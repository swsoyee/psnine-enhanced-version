/*
 * 获取奖杯各稀有度个数
 * @return {object}   用于绘扇形图的数据块
 */
const getTrophyRarity = () => {
    let rareArray = [0, 0, 0, 0, 0];         // 个数统计
    const rareStandard = [0, 5, 10, 20, 50]; // 区间定义
    for (let rareIndex of [1, 2, 3, 4]) {
        $(`.twoge.t${rareIndex}.h-p`).map((i, ev) => {
            // 获取稀有度
            const rarity = Number($(ev).eq(0).text().split('%')[0]
                .replace('%', ''));
            // 计算该稀有度的奖杯数量
            rareArray[[...rareStandard, rarity]
                .sort((a, b) => a - b)
                .indexOf(rarity) - 1]++;
        });
    }
    return rareArray;
}

/*
 * 获取奖杯各种类个数
 * @param  className  用于识别的类名
 * @param  name       奖杯种类名
 * @param  color      色块所用颜色码
 *
 * @return {object}   用于绘扇形图的单个数据块
 */
const getTrophyCategory = (className, name, color) => {
    const trophyCount = $(className).eq(0).text().replace(name, '');
    return { name: name, y: Number(trophyCount), color: color };
}

/*
 * 功能：在单独游戏页面上方追加奖杯统计扇形图
 */
const trophyPieChart = () => {
    // 奖杯稀有度统计数据
    const rareArray = getTrophyRarity();
    const trophyRatioSeriesRarityData = [
        { name: '极度珍贵', y: rareArray[0], color: 'rgb(160, 217, 255)' },
        { name: '非常珍贵', y: rareArray[1], color: 'rgb(124, 181, 236)' },
        { name: '珍贵', y: rareArray[2], color: 'rgb(88, 145, 200)' },
        { name: '罕见', y: rareArray[3], color: 'rgb(52, 109, 164)' },
        { name: '一般', y: rareArray[4], color: 'rgb(40, 97, 152)' },
    ];
    // 奖杯个数统计数据
    const trophyRatioSeriesCategoryData = [
        getTrophyCategory('.text-platinum', '白', '#7a96d1'),
        getTrophyCategory('.text-gold', '金', '#cd9a46'),
        getTrophyCategory('.text-silver', '银', '#a6a6a6'),
        getTrophyCategory('.text-bronze', '铜', '#bf6a3a'),
    ];
    // 背景设置
    const trophyRatioChart = {
        backgroundColor: 'rgba(0,0,0,0)',
    };
    // 悬浮内容设置
    const trophyRatioTooltip = {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    };
    // 绘图设置
    const trophyRatioPlotOptions = {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                distance: -20,
                style: {
                    fontWeight: 'bold',
                    color: 'white',
                    textOutline: '0px contrast',
                },
                formatter: function () {
                    return this.point.y;
                },
            },
        },
    };
    // 绘图数据
    const trophyRatioSeries = [{
        type: 'pie',
        name: '比例',
        data: trophyRatioSeriesCategoryData,
        center: [50, 30],
        size: 130,
    }, {
        type: 'pie',
        name: '比例',
        data: trophyRatioSeriesRarityData,
        center: [200, 30],
        size: 130,
    }];
    // 标题设置
    const trophyRatioTitle = {
        text: '奖杯统计',
        style: {
            color: '#808080',
        },
    };
    // 构建绘图对象
    const trophyRatio = {
        chart: trophyRatioChart,
        tooltip: trophyRatioTooltip,
        title: trophyRatioTitle,
        series: trophyRatioSeries,
        plotOptions: trophyRatioPlotOptions,
        credits: { enabled: false },
    };
    // 插入页面
    GM_addStyle(
        `#trophyRatioChart {
            width   : 320px;
            height  : 200px;
            margin  : 0 0;
            display : inline-block;
        }`
    );
    $('.box.pd10').append('<div id="trophyRatioChart" align="left"></div>');
    Highcharts.chart('trophyRatioChart', trophyRatio)
}

export default trophyPieChart;
