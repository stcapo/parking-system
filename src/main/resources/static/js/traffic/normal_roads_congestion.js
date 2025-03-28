// 普通道路拥堵情况图表
function initNormalRoadsCongestionChart() {
    var normalRoadsChart = echarts.init(document.getElementById('normal_roads_congestion'));
    var normalRoadsOption = {
        backgroundColor: 'rgba(1,202,217,.2)',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                return '时间：' + params[0].name + '<br/>' +
                       '拥堵指数：' + params[0].value;
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.3)'
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                color: "rgba(255,255,255,.7)"
            }
        },
        yAxis: {
            type: 'value',
            name: '平均拥堵指数',
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
        series: [{
            name: '平均拥堵指数',
            type: 'line',
            smooth: true,
            emphasis: {
                focus: 'series'
            },
            lineStyle: {
                width: 3,
                color: '#00e1ff'
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
                color: '#00e1ff',
                borderColor: '#fff',
                borderWidth: 2
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 225, 255, 0.7)'
                }, {
                    offset: 1,
                    color: 'rgba(0, 225, 255, 0.1)'
                }])
            },
            data: [4.2, 7.8, 9.1, 8.5, 7.2, 6.5, 5.3, 4.8]
        }]
    };
    normalRoadsChart.setOption(normalRoadsOption);
}

// 文档加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initNormalRoadsCongestionChart();
});
