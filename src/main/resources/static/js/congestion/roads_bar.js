// 主要路段拥堵柱状图
function initRoadsBar() {
    var roadsBarChart = echarts.init(document.getElementById('roads_bar'));
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
                type: 'shadow'
            }
        },
        legend: {
            data: ['拥堵指数', '车流量(百辆)'],
            textStyle: {
                color: '#fff'
            },
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                name: '拥堵指数',
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
            },
            {
                type: 'value',
                name: '车流量',
                min: 0,
                max: 100,
                interval: 20,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.3)'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: 'rgba(255,255,255,.7)',
                    fontSize: 10,
                    formatter: '{value} 百辆'
                }
            }
        ],
        yAxis: {
            type: 'category',
            data: ['京藏高速', '京港澳高速', '京开高速', '长安街', '北四环', '东三环', '西二环', '南五环'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.3)'
                }
            },
            axisLabel: {
                color: 'rgba(255,255,255,.7)',
                fontSize: 11
            }
        },
        series: [
            {
                name: '拥堵指数',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {offset: 0, color: '#29d0d4'},
                            {offset: 1, color: '#00a3e0'}
                        ])
                    }
                },
                data: [8.2, 7.8, 7.5, 9.1, 8.7, 8.9, 8.2, 6.5]
            },
            {
                name: '车流量(百辆)',
                type: 'bar',
                barWidth: 10,
                xAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {offset: 0, color: '#ffbc40'},
                            {offset: 1, color: '#ff784a'}
                        ])
                    }
                },
                data: [75, 68, 62, 85, 80, 82, 78, 60]
            }
        ]
    };
    roadsBarChart.setOption(option);
    
    // 自适应大小
    window.addEventListener('resize', function() {
        roadsBarChart.resize();
    });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initRoadsBar();
});
