// 实时拥堵指数仪表盘
function initRealtimeGauge() {
    var gaugeChart = echarts.init(document.getElementById('realtime_gauge'));
    var option = {
        backgroundColor: 'rgba(1,202,217,.2)',
        title: {
            text: '',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            formatter: '{a} <br/>{b} : {c}'
        },
        series: [
            {
                name: '实时拥堵指数',
                type: 'gauge',
                radius: '85%',
                center: ['50%', '55%'],
                detail: {
                    formatter: '{value}',
                    color: '#fff',
                    fontSize: 24,
                    offsetCenter: [0, '60%']
                },
                title: {
                    fontSize: 14,
                    color: '#fff',
                    offsetCenter: [0, '80%']
                },
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.3, '#00e3c9'],  // 畅通
                            [0.6, '#ffbc40'],  // 一般拥堵
                            [0.8, '#ff9f69'],  // 中度拥堵
                            [1, '#ff5a5a']     // 严重拥堵
                        ]
                    }
                },
                axisLabel: {
                    fontSize: 10,
                    color: '#fff',
                    distance: -36
                },
                axisTick: {
                    length: 8,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {
                    length: 15,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                pointer: {
                    width: 5,
                    length: '80%',
                    itemStyle: {
                        color: 'auto'
                    }
                },
                data: [{
                    value: 7.2,
                    name: '当前拥堵指数'
                }],
                min: 0,
                max: 10,
                splitNumber: 10,
                animation: true,
                animationDuration: 1000
            }
        ]
    };
    gaugeChart.setOption(option);
    
    // 模拟实时数据更新
    setInterval(function() {
        var newVal = Math.random() * 3 + 6; // 生成6-9之间的随机数
        option.series[0].data[0].value = newVal.toFixed(1);
        gaugeChart.setOption(option, true);
    }, 5000);
    
    // 自适应大小
    window.addEventListener('resize', function() {
        gaugeChart.resize();
    });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initRealtimeGauge();
});
