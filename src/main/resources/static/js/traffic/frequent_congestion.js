// 常发拥堵道路统计图表
function initFrequentCongestionChart() {
    var frequentCongestionChart = echarts.init(document.getElementById('frequent_congestion_roads'));
    var frequentCongestionOption = {
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
            left: '3%',
            right: '4%',
            top: '15%',
            bottom: '8%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            name: '平均拥堵时长(小时/天)',
            nameTextStyle: {
                color: 'rgba(255,255,255,.7)',
                fontSize: 10,
                padding: [0, 0, 5, 0]
            },
            max: 8,
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
            data: ['建国门桥区域', '西直门桥区域', '四惠桥区域', '光华桥区域', '三元桥区域', '白石桥区域'],
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
                name: '平均拥堵时长',
                type: 'bar',
                barWidth: 12,
                data: [
                    {value: 7.2, name: '建国门桥区域', congestionLevel: '严重拥堵', speed: 13.6, delay: 38},
                    {value: 6.5, name: '西直门桥区域', congestionLevel: '中度拥堵', speed: 16.8, delay: 32},
                    {value: 6.2, name: '四惠桥区域', congestionLevel: '中度拥堵', speed: 17.5, delay: 30},
                    {value: 5.8, name: '光华桥区域', congestionLevel: '中度拥堵', speed: 18.7, delay: 28},
                    {value: 5.3, name: '三元桥区域', congestionLevel: '轻度拥堵', speed: 21.4, delay: 25},
                    {value: 4.7, name: '白石桥区域', congestionLevel: '轻度拥堵', speed: 24.2, delay: 22}
                ],
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // 根据数值确定颜色
                            var colorList = [
                                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {offset: 0, color: '#20c5ff'},
                                    {offset: 1, color: '#5bffad'}
                                ]),
                                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {offset: 0, color: '#5bffad'},
                                    {offset: 1, color: '#e9ff5b'}
                                ]),
                                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {offset: 0, color: '#e9ff5b'},
                                    {offset: 1, color: '#ff9c5b'}
                                ]),
                                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {offset: 0, color: '#ff9c5b'},
                                    {offset: 1, color: '#ff5b5b'}
                                ])
                            ];
                            var index = Math.floor(params.data.value / 2) - 1;
                            if (index < 0) index = 0;
                            if (index >= colorList.length) index = colorList.length - 1;
                            return colorList[index];
                        }
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: function(params) {
                        return params.data.value + ' 小时/天';
                    },
                    color: 'rgba(255,255,255,.9)'
                }
            }
        ]
    };
    frequentCongestionChart.setOption(frequentCongestionOption);
}

// 文档加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initFrequentCongestionChart();
});
