package data.spark.history

import org.apache.spark.sql.{SparkSession, functions => F}

object RegionRankingGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Region Ranking Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 加载原始数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/congestion_events_with_hour.csv")

    // Step 2: 按 region 分组，计算平均值作为 index
    val regionAvg = df.groupBy("region")
      .agg(F.round(F.avg("congestion_duration_min"), 1).alias("index"))

    // Step 3: 排序（可选）并转结构为单条 JSON（数组形式）
    val regionList = regionAvg.orderBy($"index".desc).select("region").as[String].collect().toList
    val indexList = regionAvg.orderBy($"index".desc).select("index").as[Double].collect().toList

    // Step 4: 保存为 JSON 格式（DataFrame 形式不能直接支持数组结构）
    val result = spark.createDataFrame(Seq(
      (regionList, indexList)
    )).toDF("region", "index")

    result.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/output/region_ranking")

//    result.coalesce(1)
//      .write.mode("overwrite")
//      .csv("src/main/Scala/data/spark/output/region_ranking2")

    spark.stop()
  }
}

