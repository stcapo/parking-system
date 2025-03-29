import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Set seed for reproducibility
np.random.seed(456)

# Output directory
traffic_raw_dir = "raw_traffic_monitor_data"
os.makedirs(traffic_raw_dir, exist_ok=True)

# Parameters
today = datetime(2025, 3, 27)
dates = [today]  # 仅今日数据
hours = ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
regions = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区']
roads = ['东三环', '长安街', '西直门桥', '京藏高速', '机场高速', '北五环', '南二环', '建国路', '阜石路', '西二环']
road_type_map = {
    '东三环': '普通', '长安街': '普通', '西直门桥': '普通', '建国路': '普通', '阜石路': '普通', '西二环': '普通',
    '京藏高速': '高速', '机场高速': '高速', '北五环': '高速', '南二环': '高速'
}

# Sample lat/lng per region for map heat
region_coords = {
    '朝阳区': (39.9219, 116.4436),
    '海淀区': (39.9560, 116.3103),
    '西城区': (39.9123, 116.3661),
    '东城区': (39.9288, 116.4160),
    '丰台区': (39.8586, 116.2871)
}

# Generate simulated traffic events
events = []
for region in regions:
    lat, lng = region_coords[region]
    for hour in hours:
        for _ in range(np.random.randint(10, 20)):
            road = np.random.choice(roads)
            index = round(np.clip(np.random.normal(loc=7.0, scale=1.5), 3.0, 10.0), 1)
            duration = int(np.random.exponential(scale=30)) + 5
            events.append({
                "date": today.strftime("%Y-%m-%d"),
                "hour": hour,
                "region": region,
                "road": road,
                "road_type": road_type_map[road],
                "congestion_index": index,
                "duration_min": duration,
                "lat": round(lat + np.random.normal(0, 0.01), 6),
                "lng": round(lng + np.random.normal(0, 0.01), 6)
            })

# Save to CSV
df_traffic = pd.DataFrame(events)
csv_path = os.path.join(traffic_raw_dir, "real_time_traffic_events.csv")
df_traffic.to_csv(csv_path, index=False)

