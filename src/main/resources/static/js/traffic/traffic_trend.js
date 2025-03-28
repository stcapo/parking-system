// 交通指数趋势图表
function initTrafficTrendChart() {
    var trafficTrendChart = echarts.init(document.getElementById('traffic_trend'));
    var trafficTrendOption = {
        backgroundColor: 'rgba(1,202,217,.2)',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '15%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.3)'
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                color: "rgba(255,255,255,.7)",
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: '交通指数',
            nameTextStyle: {
                color: 'rgba(255,255,255,.7)'
            },
            max: 10,
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
                color: "rgba(255,255,255,.7)"
            }
        },
        visualMap: {
            show: false,
            pieces: [{
                gt: 0,
                lte: 3,
                color: '#20c5ff'
            }, {
                gt: 3,
                lte: 5,
                color: '#5bffad'
            }, {
                gt: 5,
                lte: 7,
                color: '#e9ff5b'
            }, {
                gt: 7,
                lte: 9,
                color: '#ff9c5b'
            }, {
                gt: 9,
                color: '#ff5b5b'
            }]
        },
        series: [{
            name: '交通指数',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
                width: 3
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(255, 91, 91, 0.8)'
                }, {
                    offset: 0.5,
                    color: 'rgba(233, 255, 91, 0.5)'
                }, {
                    offset: 1,
                    color: 'rgba(32, 197, 255, 0.2)'
                }])
            },
            data: [2.1, 1.8, 2.2, 8.9, 5.2, 4.8, 9.1, 6.2, 3.5]
        }]
    };
    trafficTrendChart.setOption(trafficTrendOption);
}

// 文档加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initTrafficTrendChart();
});
