# Re-run after kernel reset
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Set seed for reproducibility
np.random.seed(123)

# Create output directory
predict_raw_dir = "raw_predict_data"
os.makedirs(predict_raw_dir, exist_ok=True)

# Dates: 10天历史 + 明天（预测）
today = datetime(2025, 3, 23)
dates = [today - timedelta(days=i) for i in range(10)]
dates.reverse()
dates.append(today + timedelta(days=1))  # 加入“明天”作为预测目标

# Hours
hours = ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

# Regions and Roads
regions = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区']
roads = ['东三环', '西二环', '北五环', '机场高速', '长安街']

# Causes
causes = ['天气', '施工', '事故', '活动', '通勤高峰']

# Simulate prediction event data
predict_data = []
for date in dates:
    for region in regions:
        for hour in hours:
            predict_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "hour": hour,
                "region": region,
                "road": np.random.choice(roads),
                "congestion_index": round(np.clip(np.random.normal(loc=7.0, scale=1.5), 4.0, 10.0), 1),
                "cause": np.random.choice(causes, p=[0.3, 0.2, 0.2, 0.2, 0.1]),
                "type": "预测" if date > today else "历史"
            })

df_predict = pd.DataFrame(predict_data)
csv_path = os.path.join(predict_raw_dir, "predict_events.csv")
df_predict.to_csv(csv_path, index=False)
