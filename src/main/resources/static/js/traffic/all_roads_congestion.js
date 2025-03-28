// 全部道路拥堵情况图表
function initAllRoadsCongestionChart() {
    var allRoadsChart = echarts.init(document.getElementById('all_roads_congestion'));
    var allRoadsOption = {
        backgroundColor: 'rgba(1,202,217,.2)',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                var data = params[0].data;
                return '道路：' + data.name + '<br/>' +
                       '拥堵等级：' + data.congestionLevel + '<br/>' +
                       '行进速度：' + data.speed + ' km/h<br/>' + 
                       '延迟时间：' + data.delay + ' 分钟';
            }
        },
        grid: {
            left: 100,
            right: 40,
            top: 20,
            bottom: 20,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '拥堵指数',
            nameTextStyle: {
                color: 'rgba(255,255,255,.7)'
            },
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
            }
        },
        yAxis: {
            type: 'category',
            data: ['五环路', '三环路', '长安街', '建国门内大街', '北三环', '二环路', '四环路', '北四环'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.5)'
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                color: "rgba(255,255,255,.7)"
            }
        },
        series: [
            {
                name: '拥堵指数',
                type: 'bar',
                barWidth: 16,
                data: [
                    {value: 9.2, name: '五环路', congestionLevel: '严重拥堵', speed: 12.3, delay: 35},
                    {value: 8.7, name: '三环路', congestionLevel: '严重拥堵', speed: 15.8, delay: 28},
                    {value: 8.5, name: '长安街', congestionLevel: '严重拥堵', speed: 16.2, delay: 26},
                    {value: 7.8, name: '建国门内大街', congestionLevel: '中度拥堵', speed: 18.4, delay: 22},
                    {value: 7.6, name: '北三环', congestionLevel: '中度拥堵', speed: 19.1, delay: 20},
                    {value: 6.9, name: '二环路', congestionLevel: '中度拥堵', speed: 21.5, delay: 18},
                    {value: 6.2, name: '四环路', congestionLevel: '中度拥堵', speed: 23.8, delay: 15},
                    {value: 5.5, name: '北四环', congestionLevel: '轻度拥堵', speed: 26.7, delay: 12}
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
                        return params.data.value.toFixed(1);
                    },
                    color: 'rgba(255,255,255,.9)'
                }
            }
        ]
    };
    allRoadsChart.setOption(allRoadsOption);
}

// 文档加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initAllRoadsCongestionChart();
});
