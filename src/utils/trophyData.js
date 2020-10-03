/*
 * 构建奖杯获得时间绘图数据集
 * @param  className  用于识别的类名
 *
 * @return {object}   用于绘线形图的数据集
 */
const trophyEarnedTimeElementParser = (timeElement) => {
    // 奖杯时间丢失部分处理
    const dayTime = $(timeElement).text().trim();
    if (dayTime === '时间丢失')
        return 0;
    // 从页面上获取奖杯时间，生成时间对象并且放入数组中保存
    const timeArray = [
        $(timeElement).attr('tips').replace('年', ''), // 年
        Number(dayTime.substr(0, 2)) - 1, // 月
        dayTime.substr(3, 2), // 日
        dayTime.substr(5, 2), // 时
        dayTime.substr(8, 2), // 分
    ].map((x) => Number(x));
    return Date.UTC(...timeArray);
};

const createTrophyEarnedTimeData = (className) => {
    const timeElements = $(className);
    const getTimeArray = [];
    timeElements.map((i, el) => {
        const xTime = trophyEarnedTimeElementParser(el);
        getTimeArray.push([xTime, el.parentElement.parentElement]);
    })
    getTimeArray.sort((t1, t2) => t1[0] - t2[0]);
    let earliestValidTimeIndex = getTimeArray.findIndex(t => t[0] != 0);
    if (earliestValidTimeIndex >= 0)
        getTimeArray.forEach(t => {
            if (t[0] == 0)
                t[0] = getTimeArray[earliestValidTimeIndex][0]
        });
    else
        getTimeArray.forEach(t => t[0] = Number.NaN);
    const data = getTimeArray.map((x, y) => [x[0], y + 1]);
    // 调整最终数据点
    // data[data.length - 1][1] -= 1;
    const trophyElements = getTimeArray.map((x) => x[1]);
    return { 'data': data, 'trophyElements': trophyElements };
}

export default createTrophyEarnedTimeData;
