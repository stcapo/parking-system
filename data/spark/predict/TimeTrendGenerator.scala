package data.spark.predict

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 🎯 功能目标：未来时间段拥堵趋势图
 * 对应 predict.html 页面中下左图表（JS: time_trend.js），展示“明天全天”不同时间段的平均拥堵指数趋势。
 * */

object TimeTrendGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Time Trend Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/predict_events.csv")

    // Step 2: 获取最新预测日期
    val latestDate = df.filter($"type" === "预测")
      .agg(F.max("date")).as[String].collect()(0)

    val filtered = df.filter($"type" === "预测" && $"date" === latestDate)

    // Step 3: 每小时聚合
    val hourAgg = filtered.groupBy("hour")
      .agg(F.round(F.avg("congestion_index"), 1).alias("index"))

    // Step 4: 自定义小时排序顺序
    val hourOrder = Seq("6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00")

    val sorted = hourAgg.filter($"hour".isin(hourOrder: _*))
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

    // Step 5: 收集为一条 JSON 记录
    val hourList = sorted.select("hour").as[String].collect().toList
    val indexList = sorted.select("index").as[Double].collect().toList

    val result = spark.createDataFrame(Seq(
      (hourList, indexList)
    )).toDF("hour", "index")

    result.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/predict/output")

    spark.stop()
  }
}

