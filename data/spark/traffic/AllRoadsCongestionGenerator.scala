package data.spark.traffic

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 模块：全部道路拥堵信息生成器
 *
 * 功能：
 * - 输出当前所有道路的平均拥堵指数和平均拥堵持续时间
 * - 用于交通页道路信息展示
 *
 * 输入：
 * - real_time_traffic_events.csv
 *
 * 输出：
 * - output_traffic/all_roads_congestion/part-*.json
 * - 格式示例：
 *   [
 *     { "road": "东三环", "index": 8.4, "duration": 45 },
 *     ...
 *   ]
 */
object AllRoadsCongestionGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("All Roads Congestion Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载交通事件数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/real_time_traffic_events.csv")

    // Step 2: 按 road 聚合平均指数与平均持续时间
    val roadStats = df.groupBy("road")
      .agg(
        F.round(F.avg("congestion_index"), 1).alias("index"),
        F.round(F.avg("duration_min")).cast("int").alias("duration")
      )
      .orderBy($"index".desc)

    // Step 3: 输出为 JSON
    roadStats.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/traffic/output/all_roads_congestion")    // Step 3: 输出为 JSON
    roadStats.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/traffic/output/all_roads_congestion2")

    spark.stop()
  }
}

