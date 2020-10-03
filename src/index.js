GM_addStyle(require('./resource/style/icon.css').toString());
GM_addStyle(require('./resource/style/style.css').toString());

import pageBottom from './components/PageBottomButton';
import autoCheckIn from './components/AutoCheckIn';
import hoverProfile from './components/HoverProfile';
import hotTag from './components/HotTag';
import beautifyQaIndex from './components/BeautifyQaIndex';
import showMarkMessage from './components/ShowMarkMessage';
import opBadge from './components/OpBadge';
import inputCounter from './components/InputCounter';
import inputPreview from './components/InputPreview';
import sortTipsByLikes from './components/SortTipsByLikes';
import showTrophyNotEarned from './components/ShowTrophyNotEarned';
import trophyPieChart from './components/TrophyPieChart';
import trophyEarnedLineChart from './components/TrophyEarnedLineChart';
import earnedStatusInGuide from './components/EarnedStatusInGuide';
import gameCompletion from './components/GameCompletion';
import replyContent from './components/ReplyContent';
import allGame from './components/AllGame';
import autoPaging from './components/AutoPaging';
import floorIndex from './components/FloorIndex';
import priceLinePlot from './components/PriceLinePlot';
import hoverShowReply from './components/HoverShowReply';
import discountTitleColor from './components/DiscountTitleColor';
import { bestOnly, bestOnlySalesPage } from './components/BestOnly';

const page = window.location.href;
const psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/);

Highcharts.setOptions({
    lang: {
        decimalPoint: '.',
        drillUpText: '返回 {series.name}',
        loading: '加载中',
        months: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月',
        ],
        noData: '没有数据',
        numericSymbols: ['千', '兆', 'G', 'T', 'P', 'E'],
        resetZoom: '恢复缩放',
        resetZoomTitle: '恢复图表',
        shortMonths: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
        ],
        thousandsSep: ',',
        weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
});

// 全局
autoCheckIn(true); // TODO 设置面板
pageBottom();
hotTag(30); // TODO 设置面板
showMarkMessage(true); // TODO 设置面板
hoverProfile(true); // TODO 设置面板
floorIndex(); // TODO Router
hoverShowReply('.post');

// TODO Router refactor
if (/(gene|trade|topic)\//.test(page) & !/comment/.test(page)) {
    opBadge();
}

// 导航 > 问答
if (/\/qa/.test(page)) {
    beautifyQaIndex(true); // TODO 设置面板
}

// 导航 > 机因 > 发机因
if (/set\/gene/.test(page)) {
    // 实时统计创建机因时候的文字数
    inputCounter();
    // 发基因时可实时预览结果内容
    inputPreview();
}

if (/trophy\/\d+($|\/$)/.test(page)) {
    sortTipsByLikes();
}

// TODO Router refactor
if (/psngame\//.test(page) && /^(?!.*comment|.*rank|.*battle|.*gamelist|.*topic|.*qa)/.test(page)) {
    // 奖杯统计扇形图
    trophyPieChart();
    // 奖杯获得时间线形图
    trophyEarnedLineChart();
    // 只显示为获得
    showTrophyNotEarned();
}

if (/topic\//.test(page) && psnidCookie) {
    // 在攻略页面增加自己奖杯的获得状况
    earnedStatusInGuide(psnidCookie);
}

if (/psngame/.test(page) & !/psnid/.test(page)) {
    // 悬浮图标显示自己的游戏的完成度
    gameCompletion(psnidCookie);
}

// 页面：机因、主题
if (/(gene|topic|trade|battle)\//.test(page)) {
    replyContent(true); // TODO 设置面板
}

if (/psnid\/[A-Za-z0-9_-]+$/.test(page) && $('tbody').length > 2) {
    allGame(true); // TODO 设置面板
}

// 综合页面：一览
if (/((gene|qa|topic|trade)($|\?))/.test(page)) {
    autoPaging(3); // TODO 设置面板
}

// 页面：数折 一览
if (/\/dd($|\?)/.test(page)) {
    // 根据降价幅度变更标题颜色
    discountTitleColor();
    // 只看史低
    bestOnly();
}

// 页面：数折 > 商品页
if (/\/dd\//.test(page) || /game\/[0-9]+\/dd$/.test(page)) {
    priceLinePlot();
}

// 页面：活动
if (/huodong/.test(page)) {
    // 只看史低
    bestOnlySalesPage();
}

if (/^(?!.*trade|.*qa(\?(ob|title)=.*)?$)/.test(page)) {
    // 回复按钮悬浮触发显示
    hoverShowReply("div[class$='ml64']");
}
