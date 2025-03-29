package data.spark.predict

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 🎯 功能目标：区域拥堵热力图
 * 对应 predict.html 页面左上角图表，显示每个区域的拥堵预测强度。
 */
object HeatMapGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Heat Map Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载原始预测数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/predict_events.csv")

    // Step 2: 过滤“预测”类型，取最近预测日期（通常是明天）
    val latestDate = df.filter($"type" === "预测")
      .agg(F.max("date")).as[String].collect()(0)

    val predictOnly = df.filter($"type" === "预测" && $"date" === latestDate)

    // Step 3: 每个 region 的平均拥堵指数
    val regionHeat = predictOnly.groupBy("region")
      .agg(F.round(F.avg("congestion_index"), 1).alias("index"))
      .orderBy($"index".desc)

    // Step 4: 输出为 JSON
    regionHeat.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/predict/output/heat_map")    // Step 4: 输出为 JSON
    regionHeat.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/predict/output/heat_map2")

    spark.stop()
  }
}

