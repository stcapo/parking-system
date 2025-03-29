package data.spark.traffic

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 模块：普通道路拥堵信息生成器
 *
 * 功能：
 * - 从实时交通事件中筛选 road_type 为“普通”的路段
 * - 输出每条普通道路的平均拥堵指数和平均持续时间
 *
 * 输入：
 * - real_time_traffic_events.csv
 *
 * 输出：
 * - output_traffic/normal_roads_congestion/part-*.json
 * - 格式示例：
 *   [
 *     { "road": "东三环", "index": 8.2, "duration": 36 },
 *     ...
 *   ]
 */
object NormalRoadsCongestionGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Normal Roads Congestion Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/real_time_traffic_events.csv")

    // Step 2: 筛选 road_type 为“普通”
    val normal = df.filter($"road_type" === "普通")

    // Step 3: 按 road 聚合
    val stats = normal.groupBy("road")
      .agg(
        F.round(F.avg("congestion_index"), 1).alias("index"),
        F.round(F.avg("duration_min")).cast("int").alias("duration")
      )
      .orderBy($"index".desc)

    // Step 4: 输出为 JSON
    stats.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/traffic/output/normal_roads_congestion")    // Step 4: 输出为 JSON
    stats.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/traffic/output/normal_roads_congestion2")

    spark.stop()
  }
}
