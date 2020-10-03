GM_addStyle(require('./resource/style/icon.css').toString());

import pageBottom from './components/PageBottomButton';
import hotTag from './components/HotTag';
import beautifyQaIndex from './components/BeautifyQaIndex';
import showMarkMessage from './components/ShowMarkMessage';
import OpBadge from './components/OpBadge';

const page = window.location.href;

// 全局
pageBottom();
hotTag(30); // TODO 设置面板
showMarkMessage(true); // TODO 设置面板

// TODO Router refactor
if (/(gene|trade|topic)\//.test(page) & !/comment/.test(page)) {
    OpBadge();
}

// 导航 > 问答
if (/\/qa/.test(page)) {
    beautifyQaIndex(true); // TODO 设置面板
}

