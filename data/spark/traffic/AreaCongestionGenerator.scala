package data.spark.traffic

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 模块：区域拥堵排行生成器
 *
 * 功能：
 * - 基于实时交通事件数据，统计每个 region 的平均拥堵指数（congestion_index）
 * - 输出结构供前端排行图和地图热力图使用
 *
 * 输入：
 * - real_time_traffic_events.csv
 *
 * 输出：
 * - output_traffic/area_congestion/part-*.json
 * - 格式示例：
 *   [
 *     { "region": "朝阳区", "index": 8.1 },
 *     ...
 *   ]
 */
object AreaCongestionGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Area Congestion Ranking Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载原始交通事件数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/real_time_traffic_events.csv")

    // Step 2: 按区域聚合平均拥堵指数
    val areaStats = df.groupBy("region")
      .agg(F.round(F.avg("congestion_index"), 1).alias("index"))
      .orderBy($"index".desc)

    // Step 3: 输出为 JSON
    areaStats.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/traffic/output/area_congestion")    // Step 3: 输出为 JSON
    areaStats.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/traffic/output/area_congestion2")

    spark.stop()
  }
}

