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

const page = window.location.href;
const psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/);

// 全局
autoCheckIn(true); // TODO 设置面板
pageBottom();
hotTag(30); // TODO 设置面板
showMarkMessage(true); // TODO 设置面板
hoverProfile(true); // TODO 设置面板

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
