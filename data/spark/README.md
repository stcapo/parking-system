
# 智能交通可视化数据处理系统（Spark）

本项目基于 Spark 实现交通大数据分析，支持多页面可视化展示所需的全部数据处理流程，包括历史分析、实时监控和拥堵预测三大板块。

---

## 📁 目录结构

```
.
├── raw_data/                           # Python 模拟生成的原始交通事件数据
│   ├── congestion_events.csv          # 历史页面数据
│   ├── predict_events.csv             # 预测页面数据
│   └── real_time_traffic_events.csv   # 实时交通页面数据
│
├── output_history/                    # Spark 输出的历史页面数据
├── output_predict/                    # Spark 输出的预测页面数据
├── output_traffic/                    # Spark 输出的实时交通数据
│
├── src/
│   ├── history/                       # history.html 对应的模块
│   ├── predict/                       # predict.html 对应的模块
│   └── traffic/                       # traffic.html 对应的模块
│
└── README.md
```

---

## 🧠 项目数据流流程图

```
原始模拟数据（CSV） → Spark 各模块处理 → JSON 输出 → 前端 HTML 页面动态展示
```

---

## 📊 各页面模块说明

### 🟦 history.html（历史分析）

| 模块名                        | 输出 JSON                           | Spark 模块                             |
|-----------------------------|--------------------------------------|----------------------------------------|
| 拥堵等级饼图                   | duration_distribution.json           | DurationDistributionGenerator.scala   |
| 每日统计指数                   | daily_stats.json                     | DailyStatsGenerator.scala             |
| 区域排行                      | region_ranking.json                  | RegionRankingGenerator.scala          |
| 路段排行                      | road_ranking.json                    | RoadRankingGenerator.scala            |
| 每周趋势                      | weekly_trend.json                    | WeeklyTrendGenerator.scala            |
| 每小时趋势                    | hourly_index.json                    | HourlyIndexGenerator.scala            |

---

### 🟩 predict.html（拥堵预测）

| 模块名                        | 输出 JSON                          | Spark 模块                            |
|-----------------------------|-------------------------------------|----------------------------------------|
| 区域热力图                    | heat_map.json                      | HeatMapGenerator.scala                |
| 拥堵原因饼图                  | cause_pie.json                     | CausePieGenerator.scala               |
| 实时仪表盘                    | realtime_gauge.json                | RealtimeGaugeGenerator.scala          |
| 路段预测柱图                  | roads_bar.json                     | RoadsBarGenerator.scala               |
| 时间趋势折线图                 | time_trend.json                    | TimeTrendGenerator.scala              |
| 区域雷达图                    | area_radar.json                    | AreaRadarGenerator.scala              |
| 历史 + 预测趋势折线图         | prediction_trend.json              | PredictionTrendGenerator.scala        |

---

### 🟥 traffic.html（实时监测）

| 模块名                        | 输出 JSON                             | Spark 模块                                |
|-----------------------------|----------------------------------------|--------------------------------------------|
| 区域排行                      | area_congestion.json                   | AreaCongestionGenerator.scala             |
| 所有道路                      | all_roads_congestion.json              | AllRoadsCongestionGenerator.scala         |
| 普通道路                      | normal_roads_congestion.json           | NormalRoadsCongestionGenerator.scala      |
| 高速道路                      | highway_congestion.json                | HighwayCongestionGenerator.scala          |
| 全天趋势折线图                 | traffic_trend.json                     | TrafficTrendGenerator.scala               |
| 常发拥堵路段                   | frequent_congestion.json               | FrequentCongestionGenerator.scala         |
| 热力图坐标                    | real_time_map.json                     | RealTimeMapGenerator.scala                |

---

## 🚀 使用方式

### 1. 生成模拟原始数据（可选）
在 raw_data/ 中运行 Python 脚本（或读取真实数据）

### 2. 执行 Spark 模块
每个模块为单独的 object，可用如下命令运行：

```bash
spark-submit --class traffic.AreaCongestionGenerator target/traffic-analyzer.jar
```

你也可以编写调度脚本一次性运行所有模块。

---

## 📎 注意事项

- 所有 JSON 输出文件使用 coalesce(1) 保证单文件输出
- 路径结构和字段命名已与前端页面 JS 完全对齐
- 可通过 Cron / Airflow 实现定时调度更新

---

## 👨‍💻 作者与贡献

本项目由 [你的名字] 构建，模拟数据+Spark分析+前端 JSON 对接一体化流程。欢迎扩展为接入真实交通平台数据版本。
