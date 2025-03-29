import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Set seed for reproducibility
np.random.seed(42)

# Create output directory
raw_output_dir = "raw_traffic_data_hourly"
os.makedirs(raw_output_dir, exist_ok=True)

# Simulate raw traffic congestion events for 30 days with hour
today = datetime(2025, 3, 27)
dates = [today - timedelta(days=i) for i in range(30)]
dates.reverse()

# Parameters for simulation
roads = ['西直门桥', '东直门桥', '五环主路', '三环主路', '广渠门桥', '北四环西路', '东四环北路', '长安街', '阜石路', '京藏高速']
regions = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区']
hours = ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

# Simulate events: each event has date, region, road, hour, and congestion duration
raw_data = []
for date in dates:
    for _ in range(np.random.randint(100, 200)):  # simulate 100~200 events per day
        raw_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "region": np.random.choice(regions),
            "road": np.random.choice(roads),
            "hour": np.random.choice(hours),
            "congestion_duration_min": int(np.random.exponential(scale=40)) + np.random.randint(5, 20)
        })

# Convert to DataFrame and save
df_raw = pd.DataFrame(raw_data)
df_raw.to_csv(os.path.join(raw_output_dir, "congestion_events_with_hour.csv"), index=False)

# Preview the first few rows
df_raw.head()
