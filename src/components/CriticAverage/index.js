import { p9TimeTextParser } from '../../utils/date';

let filteredCriticPost = false;
const filterUserPost = () => {
    if (settings.blockList.length > 0) {
        let window_href = window.location.href;
        let userListLowerCase = [];
        settings.blockList.forEach(user => { userListLowerCase.push(user.toLowerCase()); });
        let FilterRegular = (psnnode, parent) => Filter(psnnode, parent, userListLowerCase, el => el.html().toLowerCase(), (user, psnid) => user == psnid);
        if (window_href.match(/\/gen(e\/|e)$/)) {
            FilterRegular('.touchclick .psnnode', '.touchclick'); // 机因一览
        } else if (window_href.indexOf('gene') > -1) {
            FilterRegular('div.post .psnnode', 'div.post'); // 机因回复
        } else if (window_href.match(/\.co(m\/|m)$/) != null || window_href.indexOf('node') > -1 || window_href.indexOf('qa') > -1 || window_href.match(/\/trad(e\/|e)$/) != null) {
            FilterRegular('div.ml64>.meta>.psnnode', 'li'); // 主页一览、问答一览、问答回复、交易一览
        } else if (window_href.indexOf('topic') > -1 || window_href.indexOf('trade') > -1 || window_href.match(/\/battle\/[1-9][0-9]+/) != null) {
            FilterRegular('div.ml64>.meta>.psnnode', 'div.post'); // 主页帖回复、交易帖回复、约战帖回复
        } else if (window_href.match(/\/my\/notice/)) {
            FilterRegular('.psnnode', 'li'); // 消息通知
        } else if (window_href.indexOf('trophy') > -1 || window_href.match(/\/psnid\/[^\/]+\/comment/) != null) {
            FilterRegular('div.ml64>.meta.pb10>.psnnode', 'li'); // 奖杯TIPS、个人主页留言
            FilterRegular('ul.sonlist .content>.psnnode', 'ul.sonlist>li'); // 奖杯TIPS二级回复、个人主页留言二级回复
        } else if (window_href.match(/\/psngame\/[1-9][0-9]+\/comment/) != null) {
            filteredCriticPost = FilterRegular('div.ml64>.meta.pb10>.psnnode', 'li') > 0; // 游戏测评
            FilterRegular('ul.sonlist .content>.psnnode', 'ul.sonlist>li'); // 游戏测评二级回复
        } else if (window_href.indexOf('battle') > -1) {
            Filter('table.list td.pdd15.h-p>a', 'tr', userListLowerCase, el => el[0].href, (user, element_href) => element_href.indexOf(`psnid/${user}`) > -1); // 约战一览
        }
        if (window_href.match(/\/qa\/[1-9][0-9]*/)) {
            FilterRegular('ul.sonlist .content>.psnnode', 'ul.sonlist>li'); // 问答二级回复
        }
    }
}

// 游戏评论页面计算平均分
function criticAverage() {
    if (window.location.href.match(/psngame\/[1-9][0-9]+\/comment/)) {
        var score_parser, score_elements, score_parent_review;
        const selectScoreElements = () => {
            score_elements = $('div.min-inner.mt40 div.box ul.list li div.ml64 div.meta.pb10 span.alert-success.pd5:contains(评分 )');
            if (score_elements.length > 0) {
                score_parser = (element) => { return parseInt(element.text().replace('评分 ', '')); };
                score_parent_review = 'li';
            } else {
                score_elements = $('div.min-inner.mt40 div.box div.ml64 p.text-success:contains(评分 ) b');
                if (score_elements.length > 0) {
                    score_parser = (element) => { return parseInt(element.text()); };
                    score_parent_review = 'div.post';
                } else {
                    return false;
                }
            }
            return true;
        }
        if (!selectScoreElements())
            return;
        var reviews_no_score = null, reviews_no_score_hidden = false;
        const selectReviewsNoScore = () => {
            if (reviews_no_score == null)
                reviews_no_score = $('div.min-inner.mt40 div.box ul.list li div.ml64 div.meta.pb10:not(:has(span.alert-success.pd5))').parents('li');
            if (reviews_no_score.length == 0)
                reviews_no_score = $('div.min-inner.mt40 div.box div.ml64:not(:has(p.text-success))').parents('div.post');
        }
        const hideReviewsNoScore = () => {
            if (reviews_no_score_hidden)
                return;
            selectReviewsNoScore();
            reviews_no_score.hide();
            reviews_no_score_hidden = true;
        }
        const showReviewsNoScore = () => {
            if (!reviews_no_score_hidden)
                return;
            selectReviewsNoScore();
            reviews_no_score.show();
            reviews_no_score_hidden = false;
        }
        var hidden_scores = [];
        const hideSpecificScore = (score) => {
            if (hidden_scores.indexOf(score) > -1)
                return;
            var hidden = 0;
            score_elements.each(function () {
                if (score_parser($(this)) == score) {
                    $(this).parents(score_parent_review).hide();
                    hidden++;
                }
            });
            if (hidden > 0) {
                hideReviewsNoScore();
                hidden_scores.push(score);
            }
        }
        const showSpecificScore = (score) => {
            var hidden_score_index = hidden_scores.indexOf(score);
            if (hidden_score_index >= 0) {
                score_elements.each(function () {
                    if (score_parser($(this)) == score)
                        $(this).parents(score_parent_review).show();
                });
                hidden_scores.splice(hidden_score_index, 1);
                if (hidden_scores.length == 0)
                    showReviewsNoScore();
            }
        }
        const scoreOnclick = (chart, seriesEntry, score) => {
            if (filteredCriticPost) {
                selectScoreElements();
                filteredCriticPost = false;
            }
            switch (seriesEntry.color.length) {
                case 7:// no alpha, score is being shown
                    seriesEntry.color += '1f';
                    hideSpecificScore(score);
                    break;
                case 9:// has alpha, score is being hidden
                    seriesEntry.color = seriesEntry.color.substring(0, 7);
                    showSpecificScore(score);
                    break;
            }
            chart.redraw();
        }
        var gaussian_on = true, gradient_stops = null;
        var score_data_barchart, score_data_barchart_no_gaussian, score_data_gaussian;
        var score_axis, score_axis_no_gaussian;
        const scoreBarChartAddLabelOnclick = (chart) => {
            chart.xAxis[0].labelGroup.element.childNodes.forEach(function (label) {
                label.onclick = function () {
                    var value = parseInt(this.innerHTML);
                    var pos = chart.series[0].data.find(e => e.category == value).index;
                    scoreOnclick(chart, chart.series[0].data[pos], value);
                }
            });
        }
        const createScoreBarChart = (criticsCount, scoreCountMin, scoreCountMax) => {
            const scoreChart = {
                type: 'column',
                backgroundColor: 'rgba(0,0,0,0)',
                events: {
                    click: function (event) {
                        gaussian_on = !gaussian_on;
                        var chart = Highcharts.chart('scoreBarChart', createScoreBarChart(criticsCount, scoreCountMin, scoreCountMax))
                        scoreBarChartAddLabelOnclick(chart);
                        hidden_scores.forEach(s => scoreOnclick(chart, chart.series[0].data[chart.xAxis[0].categories.indexOf(s)], s));
                    }
                }
            };
            const scoreTitle = {
                text: '评论分数分布',
                style: { color: '#808080' }
            };
            const scoreSubtitle = {
                text: '点击分数柱或横坐标数字隐藏相应评论',
                style: { fontSize: '9px', color: '#808080' }
            };
            const scoreXaxis = [{
                categories: gaussian_on ? score_axis : score_axis_no_gaussian,
                crosshair: true
            }];
            const scoreYaxis = [{
                tickInterval: gaussian_on ? 2 : 1,
                min: scoreCountMin < 3 ? 0 : scoreCountMin,
                max: scoreCountMax,
                title: { text: '点评人数' }
            }];
            const scoreTooltip = {
                formatter() {
                    switch (this.series.index) {
                        case 0:
                            return `<b>${this.y}人</b>`;
                        case 1:
                            return `<b>${(this.y * 100).toFixed(2)}%</b>`;
                        default:
                            return this.y;
                    }
                },
                pointFormat: '{point.y}'
            };
            const scorePlotOptions = {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                },
                bellcurve: {
                    color: '#8080807f',
                    fillColor: '#00000000'
                },
                series: { point: { events: { click: function () { if (this.series.name == '评分计数') scoreOnclick(this.series.chart, this, this.category); } } } }
            };
            const scoreSeries = [{
                name: '评分计数',
                xAxis: 0,
                yAxis: 0,
                zIndex: 1,
                baseSeries: 0,
                data: gaussian_on ? score_data_barchart : score_data_barchart_no_gaussian
            }];
            const scoreCredits = {
                text: '点评总人数：' + criticsCount
            };
            if (gaussian_on) {
                scoreXaxis.push({
                    min: 0.5,
                    max: 10.5,
                    alignTicks: true,
                    opposite: true,
                    visible: false
                });
                scoreYaxis.push({
                    min: 0,
                    title: { text: '正态分布' },
                    opposite: true,
                    labels: {
                        formatter: function () {
                            return this.value * 100 + '%';
                        }
                    }
                });
                scoreSeries.push({
                    type: 'bellcurve',
                    xAxis: 1,
                    yAxis: 1,
                    zIndex: 0,
                    baseSeries: 1,
                    data: score_data_gaussian,
                    enableMouseTracking: false
                });
            }
            const scoreBarChart = {
                chart: scoreChart,
                title: scoreTitle,
                subtitle: scoreSubtitle,
                xAxis: scoreXaxis,
                yAxis: scoreYaxis,
                tooltip: scoreTooltip,
                plotOptions: scorePlotOptions,
                series: scoreSeries,
                legend: { enabled: false },
                credits: scoreCredits
            };
            return scoreBarChart;
        };
        const weekOfYear = (date) => { // https://stackoverflow.com/a/6117889
            let start_of_day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            let day_of_week = start_of_day.getUTCDay() || 7;
            start_of_day.setUTCDate(start_of_day.getUTCDate() + 4 - day_of_week);
            let start_of_year = new Date(Date.UTC(start_of_day.getUTCFullYear(), 0, 1));
            return Math.ceil((((start_of_day - start_of_year) / 86400000/* milliseconds of a day */) + 1) / 7);
        };
        const weeksOfYearCache = {};
        const weeksOfYear = (year) => {
            let weeks = weeksOfYearCache[year];
            if (weeks == undefined) {
                let last_week = weekOfYear(new Date(year, 11, 31));
                if (last_week == 1)
                    weeks = weekOfYear(new Date(year, 11, 24));
                else
                    weeks = last_week;
                weeksOfYearCache[year] = weeks;
            }
            return weeks;
        };
        const yearOfWeek = (date, week = null) => {
            let real_year = date.getUTCFullYear();
            if (week == null)
                week = weekOfYear(date);
            if (date.getMonth() == 0) {
                if (week > 5)
                    return real_year - 1;
            } else {
                if (week == 1)
                    return real_year + 1;
            }
            return real_year;
        };
        const weekToTimestamp = (year, week, day = 4) => {
            let start_of_year = new Date(Date.UTC(year, 0, 1));
            if (weekOfYear(start_of_year) > 1)
                start_of_year = new Date(Date.UTC(year, 0, 8));
            return start_of_year.getTime() + (-((start_of_year.getUTCDay() || 7) - 1) + (7 * (week - 1) + (day - 1))) * 86400000/* milliseconds of a day */;
        }
        const weekDifference = (date_1, date_2) => {
            let week_of_year_1 = weekOfYear(date_1), year_of_week_1 = yearOfWeek(date_1, week_of_year_1), week_start_1 = weekToTimestamp(year_of_week_1, week_of_year_1, 1);
            let week_of_year_2 = weekOfYear(date_2), year_of_week_2 = yearOfWeek(date_2, week_of_year_2), week_start_2 = weekToTimestamp(year_of_week_2, week_of_year_2, 1);
            return (week_start_1 - week_start_2) / 604800000/* milliseconds of a week */;
        }
        const createScoreTrendChart = () => {
            var score_trend = [], comment_trend = [], min_score = Number.MAX_SAFE_INTEGER, max_score = Number.MIN_SAFE_INTEGER, first_week, last_week;
            const createScoreTrendChartData = () => {
                const scoreElementTime = (score_element) => {//must be single element
                    let timestamp_element = $(score_element).parents('div.ml64').find('div.meta:not(.pb10) > span:nth-child(2)');
                    if (timestamp_element.length > 0) {
                        return p9TimeTextParser(timestamp_element.text().replace(/(^\s)|(\s$)|(修改)/g, ''));
                    }
                    timestamp_element = $(score_element).parents('div.ml64').find('div.meta');
                    if (timestamp_element.length > 0) {
                        let text_array = timestamp_element.text().split(/\r?\n/);
                        let index = -1, text;
                        do {
                            text = text_array[text_array.length + index].replace(/(^\s)|(\s$)|(修改)/g, '')
                            index--;
                        } while (text == '')
                        return p9TimeTextParser(text);
                    }
                    return null;
                }
                score_elements.each(function () {
                    let timestamp = scoreElementTime($(this));
                    if (timestamp != null) {
                        let score_date = new Date(timestamp);
                        let week_of_year = weekOfYear(score_date);
                        let year_of_week = yearOfWeek(score_date, week_of_year);
                        score_trend.push([timestamp, score_parser($(this)), year_of_week, week_of_year]);
                    }
                });
                score_trend.sort((e1, e2) => (e1[0] - e2[0]));
                let accumulated_score = 0;
                for (let i = 0; i < score_trend.length; i++) {
                    accumulated_score += score_trend[i][1];
                    let updated_average_score = accumulated_score / (i + 1);
                    score_trend[i][1] = updated_average_score;
                    if (updated_average_score < min_score)
                        min_score = updated_average_score;
                    if (updated_average_score > max_score)
                        max_score = updated_average_score;
                }
                let comment_count_by_week = {};
                let first_score = score_trend[0], last_score = score_trend[score_trend.length - 1];
                first_week = [first_score[2], first_score[3]], last_week = [last_score[2], last_score[3]];
                score_trend.forEach(score => {
                    let week = `${score[2]}/${score[3]}`;
                    if (comment_count_by_week[week] == undefined)
                        comment_count_by_week[week] = 1;
                    else
                        comment_count_by_week[week]++;
                    score.splice(2, 2);
                });
                for (let year = first_week[0]; year <= last_week[0]; year++) {
                    let first = year == first_week[0] ? first_week[1] : 1;
                    let last = year == last_week[0] ? last_week[1] : weeksOfYear(year);
                    for (let week = first; week <= last; week++) {
                        let count = comment_count_by_week[`${year}/${week}`];
                        comment_trend.push([weekToTimestamp(year, week, 7.5), count == undefined ? 0 : count]);
                    }
                }
            };
            createScoreTrendChartData();
            // 悬浮内容设置
            const scoreTrendTooltip = {
                split: false
            };
            // 日期格式设置
            const scoreTrendXaxis = {
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
            const first_week_date = new Date(weekToTimestamp(first_week[0], first_week[1])), last_week_date = new Date(weekToTimestamp(last_week[0], last_week[1])), total_weeks_passed = weekDifference(last_week_date, first_week_date) + 1;
            const scoreTrendSeries = [
                {
                    name: '平均分',
                    yAxis: 0,
                    data: score_trend,
                    showInLegend: false,
                    color: '#7CB5EC',
                    opacity: 1,
                    tooltip: {
                        pointFormatter() {
                            return `<b>${this.y.toFixed(2)}</b>`;
                        }
                    }
                }, {
                    name: '周增评分次数',
                    yAxis: 1,
                    data: comment_trend,
                    showInLegend: false,
                    color: '#E41A1C',
                    opacity: 0.5,
                    tooltip: {
                        headerFormat: '',// tooltip.formatter doesn't work, using this hack to suppress default xAxis label
                        pointFormatter() {
                            let week_str;
                            if (total_weeks_passed > 26) {
                                let week_date = new Date(this.x);
                                let week_of_year = weekOfYear(week_date);
                                let year_of_week = yearOfWeek(week_date, week_of_year);
                                week_str = `<span>${year_of_week}年 第${week_of_year}周</span><br/>`
                            } else {
                                week_str = `<span>第${weekDifference(new Date(this.x), first_week_date) + 1}周</span><br/>`;
                            }
                            return week_str + (this.y > 0 ? `<b>${this.y}</b>` : `<b>无评论</b>`);
                        }
                    }
                }
            ];
            // 标题设置
            const scoreTrendTitle = [
                {
                    text: '均分走势',
                    style: {
                        color: '#808080',
                    }
                }, {
                    text: '热度走势',
                    style: {
                        color: '#808080',
                    }
                }
            ];
            // Y轴设置
            const scoreTrendYAxis = [
                {
                    title: {
                        text: '平均分',
                        style: {
                            color: '#7CB5EC',
                        }
                    },
                    min: min_score - 0.2 > 0 ? min_score - 0.2 : min_score,
                    max: max_score + 0.2 < 10 ? max_score + 0.2 : 10,
                    endOnTick: true,
                    tickInterval: 0.1,
                    opposite: false
                }, {
                    title: {
                        text: '周增评分次数',
                        style: {
                            color: '#F28D8F',
                        }
                    },
                    min: Math.min.apply(Math, comment_trend.map((i) => { return i[1]; })),
                    max: Math.max.apply(Math, comment_trend.map((i) => { return i[1]; })),
                    endOnTick: true,
                    tickInterval: 1,
                    opposite: true
                }
            ];
            // 绘图设置
            const scoreTrendChart = {
                backgroundColor: 'rgba(0,0,0,0)',
                type: 'line',
            };
            // 图形设置
            const scoreTrendPlotOptions = {
                line: {
                    opacity: 1
                }
            };
            // Credits设置
            const scoreTrendChartData = {
                chart: scoreTrendChart,
                tooltip: scoreTrendTooltip,
                xAxis: scoreTrendXaxis,
                yAxis: scoreTrendYAxis,
                title: scoreTrendTitle,
                series: scoreTrendSeries,
                plotOptions: scoreTrendPlotOptions,
                legend: { enabled: false },
                credits: { enabled: false }
            };
            return scoreTrendChartData;
        }
        var score_total = 0;
        score_data_barchart = new Array(10).fill(0);
        score_data_gaussian = [];
        score_elements.each(function () {
            const score = score_parser($(this));
            score_data_gaussian.push(score);
            score_total += score;
            score_data_barchart[score - 1]++;
        });
        var score_average = (score_total / score_elements.length).toFixed(2);
        var score_stddev = 0;
        score_data_gaussian.forEach(score => {
            const dev = score - score_average;
            score_stddev += dev * dev;
        });
        score_stddev = Math.sqrt(score_stddev) / Math.sqrt(score_elements.length);
        // adding score average to stats
        const psnine_stats = $('div.min-inner.mt40 div.box.pd10');
        psnine_stats.append(`<em>&nbsp<span class="alert-success pd5" align="right">均分 ${score_average}</span></em><p/>`);
        score_axis = [];
        score_axis_no_gaussian = [];
        let score_count_min = Number.MAX_SAFE_INTEGER, score_count_max = Number.MIN_SAFE_INTEGER;
        score_data_barchart_no_gaussian = score_data_barchart.slice(0);
        // 评分人数最高区间（分数）
        const max_score_count_index = score_data_barchart.indexOf(Math.max(...score_data_barchart));
        // 柱状图颜色
        let score_colors = new Array(10).fill('#3890ff'); // do not assign transparency! otherwise scoreOnclick() will break
        score_colors[max_score_count_index] = '#da314b';
        for (var score = 10; score >= 1; score--) {
            const index = score - 1;
            const score_count = score_data_barchart[index];
            if (score_count == 0) {
                score_data_barchart_no_gaussian.splice(index, 1);
            } else {
                if (score_count < score_count_min) {
                    score_count_min = score_count;
                }
                if (score_count > score_count_max) {
                    score_count_max = score_count;
                }
                score_data_barchart_no_gaussian[index] = { y: score_count, color: score_colors[index] };
                score_axis_no_gaussian.unshift(score);
            }
            score_data_barchart[index] = { y: score_count, color: score_colors[index] };
            score_axis.unshift(score);
        }
        psnine_stats.append('<div id="scoreBarChart" align="left" style="height: 200px;width: 50%;display: inline-block"/>');
        psnine_stats.append('<div id="scoreTrendChart" align="right" style="height: 200px;width: 50%;display: inline-block"/>');
        var charts = Highcharts.chart('scoreBarChart', createScoreBarChart(score_elements.length, score_count_min, score_count_max))
        scoreBarChartAddLabelOnclick(charts);
        Highcharts.chart('scoreTrendChart', createScoreTrendChart())
    }
}

export default criticAverage;
