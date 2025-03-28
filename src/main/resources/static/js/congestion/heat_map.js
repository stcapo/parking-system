// 区域拥堵热力图
function initHeatMap() {
    var heatMapChart = echarts.init(document.getElementById('area_heat_map'));
    var option = {
        title: {
            text: '',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}（拥堵指数）'
        },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            inRange: {
                color: ['#00ce9b', '#ffd666', '#ff9f69', '#fa5151']
            },
            textStyle: {
                color: '#fff'
            }
        },
        series: [{
            name: '拥堵指数',
            type: 'map',
            map: '北京',
            zoom: 1.2,
            aspectScale: 0.75,
            label: {
                show: true,
                color: '#fff',
                fontSize: 10
            },
            emphasis: {
                label: {
                    color: '#fff',
                    fontSize: 12
                },
                itemStyle: {
                    areaColor: '#ff9f69'
                }
            },
            itemStyle: {
                borderColor: '#0e82ba',
                borderWidth: 1,
                areaColor: '#00ce9b'
            },
            data: [
                {name: '东城区', value: 8.4},
                {name: '西城区', value: 7.8},
                {name: '朝阳区', value: 9.2},
                {name: '丰台区', value: 6.5},
                {name: '石景山区', value: 6.1},
                {name: '海淀区', value: 8.9},
                {name: '门头沟区', value: 3.2},
                {name: '房山区', value: 4.3},
                {name: '通州区', value: 7.2},
                {name: '顺义区', value: 5.8},
                {name: '昌平区', value: 6.2},
                {name: '大兴区', value: 6.7},
                {name: '怀柔区', value: 2.5},
                {name: '平谷区', value: 2.1},
                {name: '密云区', value: 1.8},
                {name: '延庆区', value: 1.5}
            ]
        }]
    };
    heatMapChart.setOption(option);
    
    // 自适应大小
    window.addEventListener('resize', function() {
        heatMapChart.resize();
    });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    initHeatMap();
});
