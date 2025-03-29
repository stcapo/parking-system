package data.spark.traffic

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 模块：常发拥堵道路统计生成器
 *
 * 功能：
 * - 统计当天哪些道路在拥堵事件中出现频率最高（计数）
 * - 输出结构用于前端显示常发拥堵排行
 *
 * 输入：
 * - real_time_traffic_events.csv（字段包括 road）
 *
 * 输出：
 * - output_traffic/frequent_congestion/part-*.json
 * - 格式示例：
 *   [
 *     { "road": "东三环", "count": 14 },
 *     ...
 *   ]
 */
object FrequentCongestionGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Frequent Congestion Roads Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/real_time_traffic_events.csv")

    // Step 2: 按 road 分组统计出现次数
    val roadCounts = df.groupBy("road")
      .agg(F.count("*").alias("count"))
      .orderBy($"count".desc)

    // Step 3: 输出为 JSON（可限制 topN）
    roadCounts.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/traffic/output/frequent_congestion")    // Step 3: 输出为 JSON（可限制 topN）
    roadCounts.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/traffic/output/frequent_congestion2")

    spark.stop()
  }
}

