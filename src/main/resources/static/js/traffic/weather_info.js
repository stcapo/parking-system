// 今日天气情况图表
function initWeatherInfoChart() {
    var weatherChart = echarts.init(document.getElementById('weather_info'));
    var weatherOption = {
        backgroundColor: 'rgba(1,202,217,.2)',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
        },
        series: [
            {
                name: '今日天气',
                type: 'gauge',
                radius: '85%',
                center: ['50%', '60%'],
                startAngle: 200,
                endAngle: -20,
                min: -20,
                max: 40,
                splitNumber: 12,
                itemStyle: {
                    color: '#00e1ff'
                },
                progress: {
                    show: true,
                    width: 30
                },
                pointer: {
                    show: true,
                    length: '80%',
                    width: 6
                },
                axisLine: {
                    lineStyle: {
                        width: 30,
                        color: [
                            [0.25, '#00a0e9'],  // 冷
                            [0.5, '#5bffad'],   // 舒适
                            [0.75, '#e9ff5b'],  // 温暖
                            [1, '#ff5b5b']      // 热
                        ]
                    }
                },
                axisTick: {
                    distance: -45,
                    length: 4,
                    lineStyle: {
                        width: 2,
                        color: '#fff'
                    }
                },
                splitLine: {
                    distance: -52,
                    length: 8,
                    lineStyle: {
                        width: 2,
                        color: '#fff'
                    }
                },
                axisLabel: {
                    distance: -15,
                    color: '#fff',
                    fontSize: 12
                },
                detail: {
                    valueAnimation: true,
                    formatter: '晴朗 {value}°C\n东北风 2级',
                    color: '#fff',
                    fontSize: 14,
                    offsetCenter: [0, '55%'],
                    rich: {
                        value: {
                            fontSize: 40,
                            fontWeight: 'normal',
                            color: '#fff'
                        }
                    }
                },
                data: [
                    {
                        value: 21
                    }
                ]
            }
        ]
    };
    weatherChart.setOption(weatherOption);
}

// 文档加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initWeatherInfoChart();
});
