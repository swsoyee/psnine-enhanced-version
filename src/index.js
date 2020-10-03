GM_addStyle(require('./resource/style/icon.css').toString());
GM_addStyle(require('./resource/style/style.css').toString());

import pageBottom from './components/PageBottomButton';
import hotTag from './components/HotTag';
import beautifyQaIndex from './components/BeautifyQaIndex';
import showMarkMessage from './components/ShowMarkMessage';
import opBadge from './components/OpBadge';
import inputCounter from './components/InputCounter';
import inputPreview from './components/InputPreview';
import sortTipsByLikes from './components/SortTipsByLikes';

const page = window.location.href;

// 全局
pageBottom();
hotTag(30); // TODO 设置面板
showMarkMessage(true); // TODO 设置面板

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
