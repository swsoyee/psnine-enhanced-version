import tippyOnShow from '../../utils/tippy';

/*
 * 通过Ajax获取自己的该游戏页面的奖杯数目
 * @param  data  Ajax获取的数据
 * @param  tip   Tippy对象
 */
const parser = (data, tip) => {
    const reg = /[\s\S]*<\/body>/g;
    const html = reg.exec(data)[0];
    const inner = $(html).find('td>em>.text-strong');
    tip.setContent(inner.length > 0
        ? `你的奖杯完成度：${inner.text()}`
        : '你还没有获得该游戏的任何奖杯'
    );
}

/*
 * 功能：悬浮图标显示自己的游戏的完成度
 */
const gameCompletion = (psnidCookie) => {
    $('.imgbgnb').map((i, el) => {
        $(el).attr('id', 'game' + i);
        if (psnidCookie) {
            let myGameUrl = $(el).parent().attr('href');
            if (myGameUrl !== undefined) {
                myGameUrl += `?psnid=${psnidCookie[1]}`;
                tippy(`#game${i}`, {
                    content: '加载中...',
                    animateFill: false,
                    placement: 'left',
                    delay: 500,
                    async onShow(tip) {
                        tippyOnShow(myGameUrl, tip, parser);
                    },
                    onHidden(tip) {
                        tip.state.ajax.canFetch = true;
                        tip.setContent('加载中...');
                    },
                });
            }
        }
    });
}

export default gameCompletion;
