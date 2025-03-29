package data.spark.traffic

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 模块：热力图地图数据生成器
 *
 * 功能：
 * - 输出每条交通拥堵事件的地理位置（lat/lng）和拥堵指数（index）
 * - 用于前端地图热力图展示
 *
 * 输入：
 * - real_time_traffic_events.csv（字段包括 lat, lng, congestion_index）
 *
 * 输出：
 * - output_traffic/real_time_map/part-*.json
 * - 格式示例：
 *   [
 *     { "lat": 39.92, "lng": 116.44, "index": 7.6 },
 *     ...
 *   ]
 */
object RealTimeMapGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Real Time Map Heat Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载交通事件数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/real_time_traffic_events.csv")

    // Step 2: 提取 lat/lng 和拥堵指数（重命名为 index）
    val heatPoints = df.select(
      $"lat",
      $"lng",
      $"congestion_index".alias("index")
    )

    // Step 3: 输出为 JSON 文件
    heatPoints.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/traffic/output/real_time_map")    // Step 3: 输出为 JSON 文件
    heatPoints.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/traffic/output/real_time_map2")

    spark.stop()
  }
}

