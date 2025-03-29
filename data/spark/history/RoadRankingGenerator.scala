package data.spark.history

import org.apache.spark.sql.{SparkSession, functions => F}

object RoadRankingGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Road Ranking Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 读取原始数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/congestion_events_with_hour.csv")

    // Step 2: 每条 road 聚合统计平均拥堵时长（index）
    val roadStats = df.groupBy("road")
      .agg(F.round(F.avg("congestion_duration_min"), 1).alias("index"))

    // Step 3: 模拟一个 speed 字段（你可以根据拥堵程度反推，例如：index 越高 speed 越低）
    val withSpeed = roadStats.withColumn("speed",
      F.round(F.lit(60) - $"index" * 0.5 + F.rand() * 5, 0)
    )

    // Step 4: 排序，保留 Top 5（可根据需要调整）
    val top5 = withSpeed.orderBy($"index".desc).limit(5)

    // Step 5: 输出为 JSON
    top5.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/output/road_ranking")    // Step 5: 输出为 JSON
    top5.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/output/road_ranking2")

    spark.stop()
  }
}

