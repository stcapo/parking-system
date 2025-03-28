// 高速道路拥堵情况图表
function initHighwayCongestionChart() {
    var highwayChart = echarts.init(document.getElementById('highway_congestion'));
    var highwayOption = {
        backgroundColor: 'rgba(1,202,217,.2)',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                var data1 = params[0].data;
                var data2 = params[1].data;
                return '时间：' + params[0].name + '<br/>' +
                       '进城方向：' + data1.value + ' (速度: ' + data1.speed + ' km/h)<br/>' +
                       '出城方向：' + data2.value + ' (速度: ' + data2.speed + ' km/h)';
            }
        },
        legend: {
            data: ['进城方向', '出城方向'],
            textStyle: {
                color: 'rgba(255,255,255,.7)'
            },
            top: 10
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '20%',
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
            name: '拥堵指数',
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
        series: [
            {
                name: '进城方向',
                type: 'bar',
                stack: '总量',
                barWidth: 20,
                emphasis: {
                    focus: 'series'
                },
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: '#ff7d3e'},
                        {offset: 1, color: '#ff3737'}
                    ])
                },
                data: [
                    {value: 3.2, speed: 75.3},
                    {value: 7.2, speed: 48.6},
                    {value: 8.6, speed: 34.2},
                    {value: 7.4, speed: 46.8},
                    {value: 6.5, speed: 51.2},
                    {value: 5.8, speed: 55.7},
                    {value: 4.9, speed: 62.4},
                    {value: 4.3, speed: 68.9}
                ]
            },
            {
                name: '出城方向',
                type: 'bar',
                stack: '总量',
                barWidth: 20,
                emphasis: {
                    focus: 'series'
                },
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: '#3fa7ff'}, 
                        {offset: 1, color: '#0071ff'}
                    ])
                },
                data: [
                    {value: 2.5, speed: 82.5},
                    {value: 3.8, speed: 71.4},
                    {value: 4.5, speed: 65.2},
                    {value: 4.7, speed: 63.6},
                    {value: 5.2, speed: 60.1},
                    {value: 6.7, speed: 50.3},
                    {value: 8.1, speed: 36.7},
                    {value: 8.5, speed: 33.8}
                ]
            }
        ]
    };
    highwayChart.setOption(highwayOption);
}

// 文档加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initHighwayCongestionChart();
});
