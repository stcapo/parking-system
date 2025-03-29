package data.spark.history

import org.apache.spark.sql.{SparkSession, functions => F}

import java.time.{DayOfWeek, LocalDate}
import java.time.format.DateTimeFormatter

object WeeklyTrendGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Weekly Trend Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // Step 1: 读取原始数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/congestion_events_with_hour.csv")

    // Step 2: 注册一个函数将 date 转换为 weekday（中文）
    val getWeekday = F.udf((dateStr: String) => {
      val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
      val date = LocalDate.parse(dateStr, formatter)
      val week = date.getDayOfWeek
      week match {
        case DayOfWeek.MONDAY => "周一"
        case DayOfWeek.TUESDAY => "周二"
        case DayOfWeek.WEDNESDAY => "周三"
        case DayOfWeek.THURSDAY => "周四"
        case DayOfWeek.FRIDAY => "周五"
        case DayOfWeek.SATURDAY => "周六"
        case DayOfWeek.SUNDAY => "周日"
      }
    })

    val dfWithWeekday = df.withColumn("weekday", getWeekday($"date"))

    // Step 3: 聚合每个 weekday 的 avg, max, count（映射到三个维度）
    val agg = dfWithWeekday.groupBy("weekday").agg(
      F.round(F.avg("congestion_duration_min"), 1).alias("avg_index"),
      F.round(F.avg("congestion_duration_min" * 1), 1).alias("peak_index"),
      F.sum("congestion_duration_min").alias("duration")
    )

    // Step 4: 保证 weekday 按顺序排列（用 join 或收集）
    val orderedWeekdays = Seq("周一", "周二", "周三", "周四", "周五", "周六", "周日")
    val sorted = agg.filter($"weekday".isin(orderedWeekdays: _*))
      .orderBy(F.when($"weekday" === "周一", 1)
        .when($"weekday" === "周二", 2)
        .when($"weekday" === "周三", 3)
        .when($"weekday" === "周四", 4)
        .when($"weekday" === "周五", 5)
        .when($"weekday" === "周六", 6)
        .when($"weekday" === "周日", 7)
      )

    // Step 5: 收集为单个 JSON 对象
    val weekdayList = sorted.select("weekday").as[String].collect().toList
    val avgIndexList = sorted.select("avg_index").as[Double].collect().toList
    val peakIndexList = sorted.select("peak_index").as[Double].collect().toList
    val durationList = sorted.select("duration").as[Long].map(_.toInt).collect().toList

    val result = spark.createDataFrame(Seq(
      (weekdayList, avgIndexList, peakIndexList, durationList)
    )).toDF("weekday", "avg_index", "peak_index", "duration")

    result.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/output/weekly_trend")

    spark.stop()
  }
}

