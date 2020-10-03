import tippyOnShow from '../../utils/tippy';

/*
 * 通过Ajax获取用户名片
 * @param  data  Ajax获取的数据
 * @param  tip   Tippy对象
 */
const getUserCardByAjax = (data, tip) => {
    const reg = /[\s\S]*<\/body>/g;
    const html = reg.exec(data)[0];
    const inner = $(html).find('.psnzz').parent().get(0);
    $(inner).find('.inner').css('max-width', '400px');
    tip.setContent(inner);
}

/*
 * 功能：悬浮于头像显示个人界面
 * @param  isOn  是否启用功能
 */
const hoverProfile = (isOn) => {
    if (isOn) {
        $("a[href*='psnid/'] > img").parent().map(function (i, v) {
            var url = $(this).attr('href');
            $(this).attr('id', 'profile' + i);
            tippy(`#profile${i}`, {
                content: '加载中...',
                delay: 700,
                maxWidth: '500px',
                animateFill: false,
                interactive: true,
                placement: 'left',
                async onShow(tip) {
                    tippyOnShow(url, tip, getUserCardByAjax);
                },
                onHidden(tip) {
                    tip.state.ajax.canFetch = true;
                    tip.setContent('加载中...');
                },
            });
        });
    }
}

export default hoverProfile;
