// 分区域对比雷达图
function initAreaRadar() {
    var radarChart = echarts.init(document.getElementById('area_radar'));
    var option = {
        backgroundColor: 'rgba(1,202,217,.2)',
        title: {
            text: '',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: ['海淀区', '朝阳区', '西城区', '东城区'],
            textStyle: {
                color: '#fff'
            },
            bottom: 0
        },
        radar: {
            // shape: 'circle',
            indicator: [
                { name: '拥堵指数', max: 10 },
                { name: '车流量', max: 10 },
                { name: '事故率', max: 10 },
                { name: '平均车速', max: 10 },
                { name: '路网密度', max: 10 },
                { name: '通行效率', max: 10 }
            ],
            name: {
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)']
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            }
        },
        series: [
            {
                name: '区域交通指标对比',
                type: 'radar',
                emphasis: {
                    lineStyle: {
                        width: 4
                    }
                },
                data: [
                    {
                        value: [8.9, 9.2, 7.8, 4.2, 8.5, 5.7],
                        name: '海淀区',
                        areaStyle: {
                            color: 'rgba(80, 141, 255, 0.4)'
                        },
                        lineStyle: {
                            color: '#508dff'
                        },
                        itemStyle: {
                            color: '#508dff'
                        }
                    },
                    {
                        value: [9.2, 8.5, 8.2, 4.5, 7.8, 6.1],
                        name: '朝阳区',
                        areaStyle: {
                            color: 'rgba(255, 140, 0, 0.4)'
                        },
                        lineStyle: {
                            color: '#ff8c00'
                        },
                        itemStyle: {
                            color: '#ff8c00'
                        }
                    },
                    {
                        value: [7.8, 8.8, 6.5, 4.8, 8.3, 6.5],
                        name: '西城区',
                        areaStyle: {
                            color: 'rgba(0, 210, 170, 0.4)'
                        },
                        lineStyle: {
                            color: '#00d2aa'
                        },
                        itemStyle: {
                            color: '#00d2aa'
                        }
                    },
                    {
                        value: [8.4, 9.0, 7.2, 4.0, 7.5, 5.5],
                        name: '东城区',
                        areaStyle: {
                            color: 'rgba(155, 91, 253, 0.4)'
                        },
                        lineStyle: {
                            color: '#9b5bfd'
                        },
                        itemStyle: {
                            color: '#9b5bfd'
                        }
                    }
                ]
            }
        ]
    };
    radarChart.setOption(option);
    
    // 自适应大小
    window.addEventListener('resize', function() {
        radarChart.resize();
    });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initAreaRadar();
});
