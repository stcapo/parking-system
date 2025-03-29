package data.spark.traffic

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 模块：交通指数时段趋势图生成器
 *
 * 功能：
 * - 统计今日每个 hour 时段的平均拥堵指数
 * - 用于前端折线图展示交通全天趋势
 *
 * 输入：
 * - real_time_traffic_events.csv（字段包括 hour, congestion_index）
 *
 * 输出：
 * - output_traffic/traffic_trend/part-*.json
 * - 格式示例：
 *   {
 *     "hour": ["6:00", "8:00", ...],
 *     "index": [6.5, 7.1, ...]
 *   }
 */
object TrafficTrendGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Traffic Trend Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载交通事件数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/real_time_traffic_events.csv")

    // Step 2: 每小时聚合平均拥堵指数
    val hourAvg = df.groupBy("hour")
      .agg(F.round(F.avg("congestion_index"), 1).alias("index"))

    // Step 3: 排序时段（确保前端顺序正确）
    val hourOrder = Seq("6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00")
    val sorted = hourAvg.filter($"hour".isin(hourOrder: _*))
      .orderBy(F.when($"hour" === "6:00", 1)
        .when($"hour" === "8:00", 2)
        .when($"hour" === "10:00", 3)
        .when($"hour" === "12:00", 4)
        .when($"hour" === "14:00", 5)
        .when($"hour" === "16:00", 6)
        .when($"hour" === "18:00", 7)
        .when($"hour" === "20:00", 8)
        .when($"hour" === "22:00", 9)
      )

    // Step 4: 收集为单条 JSON 对象
    val hourList = sorted.select("hour").as[String].collect().toList
    val indexList = sorted.select("index").as[Double].collect().toList

    val result = spark.createDataFrame(Seq((hourList, indexList)))
      .toDF("hour", "index")

    // Step 5: 输出
    result.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/traffic/output/traffic_trend")

    spark.stop()
  }
}

