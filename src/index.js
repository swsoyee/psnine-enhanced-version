GM_addStyle(require('./resource/style/icon.css').toString());

import pageBottom from './components/PageBottomButton';
import beautifyQaIndex from './components/BeautifyQaIndex';

const page = window.location.href;

// 导航 > 问答
if (/\/qa/.test(page)) {
    beautifyQaIndex(true); // TODO 设置面板
}

pageBottom();
