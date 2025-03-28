// 时间段拥堵趋势折线图
function initTimeTrend() {
    var timeTrendChart = echarts.init(document.getElementById('time_trend'));
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
            data: ['工作日', '周末'],
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
                data: ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.3)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255,255,255,.7)',
                    fontSize: 10
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
                name: '工作日',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 206, 209, 0.8)'
                        }, {
                            offset: 1,
                            color: 'rgba(0, 206, 209, 0.1)'
                        }])
                    }
                },
                lineStyle: {
                    color: '#00d4d4'
                },
                itemStyle: {
                    color: '#00d4d4'
                },
                emphasis: {
                    focus: 'series'
                },
                data: [1.2, 0.8, 0.5, 1.5, 8.2, 6.5, 4.8, 5.2, 7.8, 8.5, 4.2, 2.5]
            },
            {
                name: '周末',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255, 159, 105, 0.8)'
                        }, {
                            offset: 1,
                            color: 'rgba(255, 159, 105, 0.1)'
                        }])
                    }
                },
                lineStyle: {
                    color: '#ff9f69'
                },
                itemStyle: {
                    color: '#ff9f69'
                },
                emphasis: {
                    focus: 'series'
                },
                data: [1.0, 0.6, 0.3, 0.8, 3.5, 5.2, 7.8, 6.5, 5.8, 7.2, 6.5, 3.8]
            }
        ]
    };
    timeTrendChart.setOption(option);
    
    // 自适应大小
    window.addEventListener('resize', function() {
        timeTrendChart.resize();
    });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initTimeTrend();
});
