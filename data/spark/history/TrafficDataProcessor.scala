package data.spark.history

import org.apache.spark.sql.{SparkSession, functions => F}

object TrafficDataProcessor {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Traffic Duration Distribution Generator")
      .master("local[*]")  // 或根据你实际部署调整
      .getOrCreate()

    import spark.implicits._

    // Step 1: 读取原始数据 CSV（包含 hour 字段的）
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/congestion_events_with_hour.csv")

    // Step 2: 添加“拥堵等级”分类字段
    val withLevel = df.withColumn("level",
      F.when($"congestion_duration_min" > 120, "特重拥堵 (>120分钟)")
        .when($"congestion_duration_min" > 60, "重度拥堵 (60-120分钟)")
        .when($"congestion_duration_min" > 30, "中度拥堵 (30-60分钟)")
        .otherwise("轻度拥堵 (<30分钟)")
    )

    // Step 3: 统计每天各类拥堵的事件数量
    val grouped = withLevel.groupBy("date", "level").agg(F.count("*").as("count"))

    // Step 4: pivot 变成横向格式
    val pivoted = grouped.groupBy("date")
      .pivot("level", Seq(
        "轻度拥堵 (<30分钟)",
        "中度拥堵 (30-60分钟)",
        "重度拥堵 (60-120分钟)",
        "特重拥堵 (>120分钟)"
      ))
      .agg(F.first("count"))

    // Step 5: 空值补0
    val finalResult = pivoted.na.fill(0)

    // Step 6: 保存为 JSON 文件（结构适配前端）
    finalResult.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/output/duration_distribution")

    // Step 6: 保存为 JSON 文件（结构适配前端）
    finalResult.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/output/duration_distribution2")

    spark.stop()
  }
}

