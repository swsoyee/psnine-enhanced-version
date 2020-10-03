import createTrophyEarnedTimeData from '../../utils/trophyData';
/*
 * 功能：在单独游戏页面上方追加奖杯获得时间线形图
 */
const trophyEarnedLineChart = () => {
    // 奖杯获得时间年月统计
    let trophyGetTimeData = createTrophyEarnedTimeData('em.lh180.alert-success.pd5.r');
    const data = trophyGetTimeData.data;
    const totalTrophyCount = Number($('div.main>.box.pd10>em>.text-strong')
        .text().replace('总', ''));
    const receivedTrophyCount = data.length;

    // 悬浮内容设置
    const trophyGetTimeTooltip = {
        pointFormat: '{series.name}<b>{point.y}</b>个奖杯',
    };
    // 日期格式设置
    const trophyGetTimeXaxis = {
        type: 'datetime',
        dateTimeLabelFormats: {
            second: '%Y-%m-%d<br/>%H:%M:%S',
            minute: '%Y-%m-%d<br/>%H:%M',
            hour: '%Y-%m-%d<br/>%H:%M',
            day: '%Y<br/>%m-%d',
            week: '%Y<br/>%m-%d',
            month: '%Y-%m',
            year: '%Y',
        },
        title: {
            display: false,
        },
    };
    // 绘图数据
    const trophyGetTimeSeries = [
        {
            name: '第',
            data: data,
            showInLegend: false,
        },
    ];
    // 标题设置
    const trophyGetRatio = ((receivedTrophyCount / totalTrophyCount) * 100).toFixed(2);
    const trophyGetTimeTitleText = `奖杯获得时间（完成率：${trophyGetRatio}%）`;
    const trophyGetTimeTitle = {
        text: trophyGetTimeTitleText,
        style: {
            color: '#808080',
        },
    };
    const trophyGetTimeSubtitle = {
        text: $('div.ml100>p').eq(0).text(), // 游戏名称
    }
    // Y轴设置
    const trophyGetTimeYAxis = {
        title: {
            text: '获得个数',
        },
        min: 0,
        max: totalTrophyCount,
        endOnTick: false,
        tickInterval: Math.floor(totalTrophyCount / 4),
    };
    // 绘图设置
    const trophyGetTimeChart = {
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'area',
    };
    // 图形设置
    const trophyGetTimePlotOptions = {
        areaspline: {
            fillOpacity: 0.5
        }
    };
    // Credits设置
    const trophyGetTimeCreditsText = []
    $('div.main>.box.pd10>em:eq(0)>span').map((i, el) => {
        trophyGetTimeCreditsText.push($(el).text());
    })
    const trophyGetTimeCredits = {
        text: trophyGetTimeCreditsText.join(' '),
        href: undefined,
    }
    const trophyGetTime = {
        chart: trophyGetTimeChart,
        tooltip: trophyGetTimeTooltip,
        xAxis: trophyGetTimeXaxis,
        yAxis: trophyGetTimeYAxis,
        title: trophyGetTimeTitle,
        subtitle: trophyGetTimeSubtitle,
        series: trophyGetTimeSeries,
        plotOptions: trophyGetTimePlotOptions,
        credits: trophyGetTimeCredits,
    };
    // 插入页面
    // 插入页面
    GM_addStyle(
        `#trophyGetTimeChart {
            width   : 460px;
            height  : 200px;
            margin  : 0 0;
            display : inline-block;
        }`
    );
    $('.box.pd10').append(
        `<div id="trophyGetTimeChart" align="left"></div>`
    );
    Highcharts.chart('trophyGetTimeChart', trophyGetTime);
}

export default trophyEarnedLineChart;
