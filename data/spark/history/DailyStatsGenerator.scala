package data.spark.history

import org.apache.spark.sql.{SparkSession, functions => F}

object DailyStatsGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Daily Stats Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 读取原始事件数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/congestion_events_with_hour.csv")

    // Step 2: 聚合每一天的 min, max, avg 拥堵时长
    val stats = df.groupBy("date").agg(
      F.round(F.avg("congestion_duration_min"), 1).alias("avg_index"),
      F.max("congestion_duration_min").alias("max_index"),
      F.min("congestion_duration_min").alias("min_index")
    )

    // Step 3: 映射等级字段（你可以自定义规则）
    val withLevel = stats.withColumn("level",
      F.when($"avg_index" >= 90, "严重")
        .when($"avg_index" >= 60, "中度")
        .otherwise("轻度")
    )

    // Step 4: 保存 JSON 文件
    withLevel.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/output/daily_stats")

    // Step 4: 保存 JSON 文件
    withLevel.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/output/daily_stats2")

    spark.stop()
  }
}

