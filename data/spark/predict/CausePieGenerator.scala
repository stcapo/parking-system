package data.spark.predict

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 🎯 功能目标：拥堵原因分析饼图
 * 对应 predict.html 左中图表（JS: cause_pie.js），需要展示每种拥堵原因在所有预测记录中的占比。
 */
object CausePieGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Cause Pie Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载预测数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/predict_events.csv")

    // Step 2: 获取预测日期中的最新一日数据
    val latestDate = df.filter($"type" === "预测")
      .agg(F.max("date")).as[String].collect()(0)

    val filtered = df.filter($"type" === "预测" && $"date" === latestDate)

    // Step 3: 按 cause 分组统计数量
    val causeCounts = filtered.groupBy("cause")
      .agg(F.count("*").alias("value"))
      .withColumnRenamed("cause", "name")

    // Step 4: 输出为 JSON 文件
    causeCounts.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/predict/output/cause_pie")    // Step 4: 输出为 JSON 文件
    causeCounts.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/predict/output/cause_pie2")

    spark.stop()
  }
}

