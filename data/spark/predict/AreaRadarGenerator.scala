package data.spark.predict

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 区域雷达图数据生成器
 *
 * 功能：
 * - 从预测数据中提取每个区域的三个指标：
 *   1. 平均拥堵指数（avg_index）
 *   2. 拥堵峰值（peak_index）
 *   3. 拥堵总时长（duration）
 * - 输出结构用于 ECharts 雷达图展示不同区域拥堵特征对比
 *
 * 输入：
 * - predict_events.csv（含字段：region, congestion_index, type, date）
 *
 * 输出：
 * - output_predict/area_radar/part-*.json
 * - JSON 格式：
 *   [
 *     { "region": "朝阳区", "avg_index": 7.6, "peak_index": 9.1, "duration": 1940 },
 *     ...
 *   ]
 */
object AreaRadarGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Area Radar Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // 1. 读取预测数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/predict_events.csv")

    // 2. 筛选最新的“预测”数据（通常是明天）
    val latestDate = df.filter($"type" === "预测")
      .agg(F.max("date")).as[String].collect()(0)

    val filtered = df.filter($"type" === "预测" && $"date" === latestDate)

    // 3. 按区域聚合三个指标
    val areaRadar = filtered.groupBy("region")
      .agg(
        F.round(F.avg("congestion_index"), 1).alias("avg_index"),
        F.round(F.max("congestion_index"), 1).alias("peak_index"),
        F.round(F.sum("congestion_index") * 10).cast("int").alias("duration") // 模拟时长值
      )

    // 4. 输出 JSON
    areaRadar.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/predict/output/area_radar")    // 4. 输出 JSON
    areaRadar.coalesce(1)
      .write.mode("overwrite")
      .csv("src/main/Scala/data/spark/predict/output/area_radar2")

    spark.stop()
  }
}

