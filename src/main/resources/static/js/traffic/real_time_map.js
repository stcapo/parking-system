// 实时地图图表
function initRealTimeMapChart() {
    // 使用echarts.init()方法初始化一个Echarts实例，在init方法中传入echarts map的容器 dom对象
    var mapChart = echarts.init(document.getElementById('topmap'));
    // mapChart的配置
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} (个)'
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        visualMap: {
            min: 0,
            max: 2000,
            text:['高','低'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['lightskyblue','yellow', 'orangered']
            }
        },
        series:[
            {
                name: '北京各区',
                type: 'map',//type必须声明为 map 说明该图标为echarts 中map类型
                map: '北京', //这里需要特别注意。如果是中国地图，map值为china，如果为各省市则为中文。这里用北京
                aspectScale: 0.75, //长宽比. default: 0.75
                zoom: 1.2,
                //roam: true,
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data: [
                    {name:'东城区', value: 1800},
                    {name:'西城区', value: 1700},
                    {name:'朝阳区', value: 1600},
                    {name:'丰台区', value: 1400},
                    {name:'石景山区', value: 1200},
                    {name:'海淀区', value: 1000},
                    {name:'门头沟区', value: 800},
                    {name:'房山区', value: 600},
                    {name:'通州区', value: 400},
                    {name:'顺义区', value: 200},
                    {name:'昌平区', value: 100},
                    {name:'大兴区', value: 300},
                    {name:'怀柔区', value: 500},
                    {name:'平谷区', value: 700},
                    {name:'密云县', value: 900},
                    {name:'延庆县', value: 1100}
                ]
            }
        ]
    };
    
    //设置图表的配置项
    mapChart.setOption(option);
}

// 文档加载完成后初始化图表
$(document).ready(function() {
    initRealTimeMapChart();
});
