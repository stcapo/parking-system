package data.spark.predict

import org.apache.spark.sql.{SparkSession, functions => F}

/**
 * 历史 + 预测趋势图数据生成器
 *
 * 功能：
 * - 汇总过去 10 天 + 明天的每日平均拥堵指数
 * - 输出结构用于前端折线图，展示指数变化趋势
 *
 * 输入：
 * - predict_events.csv（字段包含：date, congestion_index, type）
 *
 * 输出：
 * - output_predict/prediction_trend/part-*.json
 * - JSON 格式：
 *   {
 *     "date": ["2025-03-14", ..., "2025-03-24"],
 *     "index": [6.8, 7.3, ..., 8.2]
 *   }
 */
object PredictionTrendGenerator {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder()
      .appName("Prediction Trend Generator")
      .master("local[*]")
      .getOrCreate()

    import spark.implicits._

    // 1. 读取数据
    val df = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv("src/main/Scala/data/spark/predict_events.csv")

    // 2. 按日期分组，计算每日平均值（包含历史+预测）
    val dailyAvg = df.groupBy("date")
      .agg(F.round(F.avg("congestion_index"), 1).alias("index"))
      .orderBy("date")

    // 3. 收集为单条 JSON
    val dateList = dailyAvg.select("date").as[String].collect().toList
    val indexList = dailyAvg.select("index").as[Double].collect().toList

    val result = spark.createDataFrame(Seq(
      (dateList, indexList)
    )).toDF("date", "index")

    // 4. 输出为 JSON
    result.coalesce(1)
      .write.mode("overwrite")
      .json("src/main/Scala/data/spark/predict/output/prediction_trend")

    spark.stop()
  }
}

