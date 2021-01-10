/*
 * 问答标题根据回答状况着色
 * @param  isOn  是否开启功能
 */
const beautifyQaIndex = (isOn) => {
    if (isOn) {
        // 替换文字状态为图标形式
        $('.list>li').map((i, node) => {
            const el = $(node).find("div.meta > .r > span:nth-child(2)");
            const status = $(el).text();
            // 替换文字状态为图标形式
            const selector = 'div.ml64>p.title.font16>a';
            switch (status) {
                case "已解决": $(node).find(selector).append('<div class="fa-check-circle"></div>'); break;
                case "未回答": $(node).find(selector).append('<div class="fa-question-circle"></div>'); break;
                case "解决中": $(node).find(selector).append('<div class="fa-comments"></div>'); break;
                default: return;
            }
            const el_reward = $(node).find("div.meta > .r > span:nth-child(1)");
            const reward_num = $(el_reward).text();
            // 替换文字状态为图标形式
            const reward = reward_num.match(/悬赏(\d+)铜/);
            if (reward && reward.length > 0) {
                const number = Number(reward[1]);
                $(el_reward).replaceWith(`<div class="fa-coins"></div>&nbsp;<span class="${number > 30 ? 'text-gold' : (number === 10 ? 'text-bronze' : 'text-silver')}" style="font-weight:bold;"}">${number}</span>`);
            }
        });
    } else {
        return;
    }
}

export default beautifyQaIndex;
