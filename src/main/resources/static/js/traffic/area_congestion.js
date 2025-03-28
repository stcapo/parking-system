// 今日区域拥堵排行图表
function initAreaCongestionChart() {
    var areaRankingChart = echarts.init(document.getElementById('area_congestion_ranking'));
    var areaRankingOption = {
        backgroundColor: 'rgba(1,202,217,.2)',
        grid: {
            left: 20,
            right: 100,
            top: 40,
            bottom: 10,
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                var data = params[0].data;
                return '区域：' + data.name + '<br/>' +
                       '交通指数：' + data.value + '<br/>' +
                       '拥堵等级：' + data.congestionLevel + '<br/>' +
                       '平均速度：' + data.speed + ' km/h';
            }
        },
        xAxis: {
            type: 'value',
            max: 10,
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.2)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.1)'
                }
            },
            axisLabel: {
                color: "rgba(255,255,255,.7)"
            },
            name: '交通指数',
            nameTextStyle: {
                color: 'rgba(255,255,255,.7)'
            }
        },
        yAxis: {
            type: 'category',
            data: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区', '通州区', '昌平区'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.5)'
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
            name: '交通指数',
            type: 'bar',
            barWidth: 15,
            data: [
                {value: 8.7, name: '朝阳区', congestionLevel: '严重拥堵', speed: 15.5},
                {value: 8.2, name: '海淀区', congestionLevel: '严重拥堵', speed: 16.8},
                {value: 7.4, name: '西城区', congestionLevel: '中度拥堵', speed: 18.6},
                {value: 7.1, name: '东城区', congestionLevel: '中度拥堵', speed: 19.2},
                {value: 6.5, name: '丰台区', congestionLevel: '中度拥堵', speed: 21.5},
                {value: 5.8, name: '石景山区', congestionLevel: '轻度拥堵', speed: 24.7},
                {value: 5.2, name: '通州区', congestionLevel: '轻度拥堵', speed: 26.4},
                {value: 4.8, name: '昌平区', congestionLevel: '轻度拥堵', speed: 28.3}
            ],
            itemStyle: {
                normal: {
                    color: function(params) {
                        // 颜色渐变，越拥堵越红
                        var colorList = [
                            '#20c5ff', // 蓝色 - 畅通
                            '#5bffad', // 绿色 - 基本畅通
                            '#e9ff5b', // 黄色 - 轻度拥堵
                            '#ff9c5b', // 橙色 - 中度拥堵
                            '#ff5b5b'  // 红色 - 严重拥堵
                        ];
                        var index = Math.floor(params.data.value / 2);
                        if (index >= colorList.length) index = colorList.length - 1;
                        return colorList[index];
                    }
                }
            },
            label: {
                show: true,
                position: 'right',
                formatter: function(params) {
                    return params.data.value;
                },
                color: 'rgba(255,255,255,.9)'
            }
        }]
    };
    areaRankingChart.setOption(areaRankingOption);
}

// 文档加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initAreaCongestionChart();
});
