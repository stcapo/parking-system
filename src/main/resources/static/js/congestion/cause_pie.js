// 拥堵原因饼图
function initCausePie() {
    var causePieChart = echarts.init(document.getElementById('cause_pie'));
    var option = {
        backgroundColor: 'rgba(1,202,217,.2)',
        title: {
            text: '',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            top: 'center',
            data: ['交通事故', '道路施工', '车流量过大', '信号灯故障', '天气影响', '大型活动'],
            textStyle: {
                color: '#fff',
                fontSize: 11
            }
        },
        series: [
            {
                name: '拥堵原因',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['65%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '13',
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {
                        value: 32, 
                        name: '车流量过大',
                        itemStyle: {color: '#00a8ff'}
                    },
                    {
                        value: 25, 
                        name: '交通事故',
                        itemStyle: {color: '#ff5a5a'}
                    },
                    {
                        value: 18, 
                        name: '道路施工',
                        itemStyle: {color: '#ffbc40'}
                    },
                    {
                        value: 10, 
                        name: '信号灯故障',
                        itemStyle: {color: '#9b5bfd'}
                    },
                    {
                        value: 8, 
                        name: '天气影响',
                        itemStyle: {color: '#00e3c9'}
                    },
                    {
                        value: 7, 
                        name: '大型活动',
                        itemStyle: {color: '#68d460'}
                    }
                ]
            }
        ]
    };
    causePieChart.setOption(option);
    
    // 自适应大小
    window.addEventListener('resize', function() {
        causePieChart.resize();
    });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initCausePie();
});
