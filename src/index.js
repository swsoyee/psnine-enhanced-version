GM_addStyle(require('./resource/style/icon.css').toString());

import pageBottom from './components/PageBottomButton';
import beautifyQaIndex from './components/BeautifyQaIndex';
import showMarkMessage from './components/showMarkMessage';

const page = window.location.href;

// 全局
pageBottom();
showMarkMessage(true); // TODO 设置面板

// 导航 > 问答
if (/\/qa/.test(page)) {
    beautifyQaIndex(true); // TODO 设置面板
}

