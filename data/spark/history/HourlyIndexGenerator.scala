package data.spark.history

import org.apache.spark.sql.{SparkSession, functions => F}

object HourlyIndexGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Hourly Index Generator")
      .master("local[*]")
      .getOrCreate()

    // Step 1: 读取数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/congestion_events_with_hour.csv")

    // Step 2: 按 date 和 hour 分组计算平均拥堵时长
    val grouped = df.groupBy("date", "hour")
      .agg(F.round(F.avg("congestion_duration_min"), 1).alias("avg_index"))

    // Step 3: Pivot，变为横向结构（每行一个日期，每列一个 hour）
    val hourOrder = Seq("6:00", "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00")

    val pivoted = grouped.groupBy("date")
      .pivot("hour", hourOrder)
      .agg(F.first("avg_index"))
      .na.fill(0)

    // Step 4: 将每行转为 (date, Map[hour -> value])
    val rows = pivoted.collect().map { row =>
      val date = row.getAs[String]("date")
      val hourlyMap = hourOrder.map(hour => hour -> row.getAs[Double](hour)).toMap
      (date, hourlyMap)
    }

    val resultDF = spark.createDataFrame(rows).toDF("date", "hourly_index")

    // Step 5: 输出为 JSON
    resultDF.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/output/hourly_index")

    spark.stop()
  }
}

