import { converntTime } from '../../utils/date';

/* 
 * 获取当前页面的价格变动时间，构建绘图曲线X轴数据集
 * @return  xValue  价格变动时间X数据
 */
const priceLineDataX = () => {
    // 获取X轴的日期
    const xContents = $('p.dd_text');
    let xValue = [];
    for (let index = 3; index < xContents.length; index += 4) {
        const tamp = xContents[index].innerText.split(' ~ ').map((item) => {
            return converntTime(item);
        });
        xValue = [tamp[0], tamp[0], tamp[1], tamp[1], ...xValue];
    }
    return xValue;
}

/* 
 * 获取当前页面的价格情况，构建绘图曲线Y轴数据集
 * @return  yNormal  普通会员价格Y数据
 * @return  yPlus    plus会员价格Y数据
 */
const priceLineDataY = () => {
    const div = $('.dd_price');
    let yNormal = [];
    let yPlus = [];
    div.map((i, el) => {
        const yOld = $(el).children('.dd_price_old').eq(0).text();
        const yPriceNormal = $(el).children('.dd_price_off').eq(0).text();
        // 普通会员价格曲线值
        yNormal = [yOld, yPriceNormal, yPriceNormal, yOld, ...yNormal];
        // PS+会员价格曲线值
        const yPricePlus = $(el).children('.dd_price_plus').eq(0);
        const pricePlusTamp = yPricePlus.length === 0 ? yPriceNormal : yPricePlus.text();
        yPlus = [yOld, pricePlusTamp, pricePlusTamp, yOld, ...yPlus];
    });
    return { yNormal, yPlus };
}

/* 
 * 修正数据集的最后一组数据函数。如果当前日期在最后一次促销结束前，
 * 则修改最后一组数据为当前日期，如在以后，则将最后一次促销的原始
 * 价格作为最后一组数据的当前价格。
 * @param   [dataArray]  包含[datetime, price]的原始数据
 *
 * @return  [dataArray]  修改后的[datetime, price]数据
 */
const fixTheLastElement = (data) => {
    const today = new Date();
    const todayArray = Date.UTC(
        today.getYear() + 1900,
        today.getMonth(),
        today.getDate()
    );
    if (data[data.length - 1][0] > todayArray) {
        data.pop();
        data[data.length - 1][0] = todayArray;
    } else {
        data.push([todayArray, data[data.length - 1][1]]);
    }
    return data;
}

/* 
 * 传入时间和一般、Plus会员价格数组，生成绘图用数据集
 * @param   xValue   价格变动时间数组
 * @param   yNormal  一般会员价格数组
 * @param   yPlus    Plus会员价格数组
 *
 * @return  normalData  一般会员价格绘图用数组
 * @return  plusData    Plus会员价格绘图用数组
 * @return  region      地区货币符
 */
const createPriceLineData = (xValue, yNormal, yPlus) => {
    // 用于保存绘图数据的变量
    let normalData = [];
    let plusData = [];
    // 判断地区
    const prefix = yNormal[0].substring(0, 1);
    const region = prefix === 'H' ? 'HK$' : prefix;

    xValue.map((item, i) => {
        normalData.push([item, Number(yNormal[i].replace(region, ''))]);
        plusData.push([item, Number(yPlus[i].replace(region, ''))]);
    })
    // 最后一组数组的处理，生成最终数据绘图数据集
    normalData = fixTheLastElement(normalData);
    plusData = fixTheLastElement(plusData);
    return { normalData, plusData, region }
}

/* 
 * 根据数据绘制价格变动走势图
 * @param   normalData     一般会员价格绘图用数组
 * @param   plusData       Plus会员价格绘图用数组
 * @param   region         地区货币符
 *
 * @return  priceLinePlot  highChart对象
 */
const createPriceLinePlot = (normalData, plusData, region) => {
    const priceLineChart = {
        type: 'areaspline',
        backgroundColor: 'rgba(0,0,0,0)',
    };
    const priceLineTitle = {
        text: '价格变动走势图',
        style: {
            color: '#808080',
        },
    };
    const priceLineXAxis = {
        type: 'datetime',
        dateTimeLabelFormats: {
            year: '%y年',
            day: '%y年<br/>%b%e日',
            week: '%y年<br/>%b%e日',
            month: '%y年<br/>%b',
        },
        title: {
            text: '日期',
        },
    };
    const priceLineYAxis = {
        title: {
            text: '价格',
        },
        plotLines: [
            {
                value: 0,
                width: 1,
                color: '#808080',
            },
        ],
    };
    const priceLineTooltip = {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: `{point.x:%y年%b%e日}: ${region}{point.y:.2f}`,
    };
    const priceLinePlotOptions = {
        areaspline: {
            fillOpacity: 0.25,
        },
    };
    const priceLineSeries = [
        {
            name: '普通会员价',
            color: '#00a2ff',
            data: normalData,
        },
        {
            name: 'PS+会员价',
            color: '#ffd633',
            data: plusData,
        },
    ];
    const priceLineCredits = {
        enabled: false,
    };
    const priceLineLegend = {
        itemStyle: {
            color: '#808080',
        },
        itemHoverStyle: {
            color: '#3890ff',
        },
    };
    const priceLinePlot = {
        chart: priceLineChart,
        title: priceLineTitle,
        tooltip: priceLineTooltip,
        xAxis: priceLineXAxis,
        yAxis: priceLineYAxis,
        series: priceLineSeries,
        plotOptions: priceLinePlotOptions,
        credits: priceLineCredits,
        legend: priceLineLegend,
    };
    return priceLinePlot;
}

/*
 * 功能：在页面中插入价格变动走势图
 */
const priceLinePlot = () => {
    // 构建绘图数据
    const xValue = priceLineDataX();
    const { yNormal, yPlus } = priceLineDataY();
    const { normalData, plusData, region } = createPriceLineData(xValue, yNormal, yPlus);
    const priceLinePlot = createPriceLinePlot(normalData, plusData, region);
    // 插入页面
    $('.dd_ul').before(`<div id="container"></div>`);
    Highcharts.chart('container', priceLinePlot)
}

export default priceLinePlot;
