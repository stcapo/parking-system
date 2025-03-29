package data.spark.predict

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 🎯 功能目标：实时拥堵指数仪表盘
 * 对应 predict.html 左下图表（JS: realtime_gauge.js），需要显示 “当前时间点”或预测时间点的综合拥堵指数。
 */

object RealtimeGaugeGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Realtime Gauge Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/predict_events.csv")

    // Step 2: 获取“预测”中最近一天的数据（即明天）
    val latestDate = df.filter($"type" === "预测")
      .agg(F.max("date")).as[String].collect()(0)

    val filtered = df.filter($"type" === "预测" && $"date" === latestDate)

    // Step 3: 计算整体平均拥堵指数（全市预测值平均）
    val avgIndex = filtered.agg(F.round(F.avg("congestion_index"), 1)).as[Double].collect()(0)

    // Step 4: 构造 DataFrame 单行输出
    val now = java.time.LocalDateTime.now().toString.replace("T", " ").substring(0, 19)
    val result = Seq((now, avgIndex)).toDF("time", "index")

    result.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/predict/output/realtime_gauge")

    spark.stop()
  }
}

