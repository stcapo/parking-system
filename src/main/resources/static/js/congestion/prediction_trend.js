// 历史数据与预测趋势图
function initPredictionTrend() {
    var predictionChart = echarts.init(document.getElementById('prediction_trend'));
    var option = {
        backgroundColor: 'rgba(1,202,217,.2)',
        title: {
            text: '',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['历史拥堵指数', '预测拥堵指数'],
            textStyle: {
                color: '#fff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['上周一', '上周二', '上周三', '上周四', '上周五', '上周六', '上周日', 
                       '本周一', '本周二', '本周三', '本周四', '明天', '后天', '大后天'],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.3)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255,255,255,.7)',
                    fontSize: 9,
                    interval: 0,
                    rotate: 45
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '拥堵指数',
                nameTextStyle: {
                    color: 'rgba(255,255,255,.7)'
                },
                min: 0,
                max: 10,
                interval: 2,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.3)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255,255,255,.7)',
                    fontSize: 10
                }
            }
        ],
        series: [
            {
                name: '历史拥堵指数',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(80, 141, 255, 0.8)'
                    }, {
                        offset: 1,
                        color: 'rgba(80, 141, 255, 0.1)'
                    }])
                },
                itemStyle: {
                    color: '#508dff'
                },
                lineStyle: {
                    width: 2
                },
                emphasis: {
                    focus: 'series'
                },
                data: [7.2, 6.8, 7.3, 7.1, 8.2, 6.2, 5.8, 7.5, 7.2, 6.9, 7.5, null, null, null]
            },
            {
                name: '预测拥堵指数',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165, 0.8)'
                    }, {
                        offset: 1,
                        color: 'rgba(128, 255, 165, 0.1)'
                    }])
                },
                symbolSize: 6,
                itemStyle: {
                    color: '#80ffa5'
                },
                lineStyle: {
                    width: 2,
                    type: 'dashed'
                },
                emphasis: {
                    focus: 'series'
                },
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#fff',
                        type: 'dashed'
                    },
                    data: [{
                        xAxis: 10  // 在本周四位置标记当前日期
                    }]
                },
                data: [null, null, null, null, null, null, null, null, null, null, 7.5, 7.8, 8.2, 7.6]
            }
        ]
    };
    predictionChart.setOption(option);
    
    // 自适应大小
    window.addEventListener('resize', function() {
        predictionChart.resize();
    });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initPredictionTrend();
});
