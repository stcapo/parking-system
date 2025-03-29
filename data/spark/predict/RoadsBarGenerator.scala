package data.spark.predict

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 🎯 功能目标：主要路段预测柱状图
 * 对应 predict.html 页面中上图表（JS: roads_bar.js），用于展示不同路段的拥堵预测值排行。
 * */

object RoadsBarGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Roads Bar Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 读取预测原始数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/predict_events.csv")

    // Step 2: 获取最新预测日期
    val latestDate = df.filter($"type" === "预测")
      .agg(F.max("date")).as[String].collect()(0)

    // Step 3: 按 road 聚合拥堵指数
    val filtered = df.filter($"type" === "预测" && $"date" === latestDate)

    val roadAvg = filtered.groupBy("road")
      .agg(F.round(F.avg("congestion_index"), 1).alias("index"))
      .orderBy($"index".desc)

    // Step 4: 输出前 10 个路段（可根据需求调整）
    val topRoads = roadAvg.limit(10)

    // Step 5: 保存为 JSON
    topRoads.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/predict/output/roads_bar")    // Step 5: 保存为 JSON
    topRoads.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/predict/output/roads_bar2")

    spark.stop()
  }
}

