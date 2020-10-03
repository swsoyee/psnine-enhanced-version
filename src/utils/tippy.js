/*
 * 使用Tippy的OnShow部分函数
 * @param  url              Ajax获取目标地址
 * @param  tip              Tippy对象
 * @param  successFunction  获取数据时调用函数
 */
const tippyOnShow = (url, tip, successFunction) => {
    if (!tip.state.ajax) {
        tip.state.ajax = {
            isFetching: false,
            canFetch: true,
        };
    }
    if (tip.state.ajax.isFetching || !tip.state.ajax.canFetch) {
        return;
    }
    tip.state.ajax.isFetching = true;
    tip.state.ajax.canFetch = false;
    try {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'html',
            success: (data) => {
                successFunction(data, tip);
            },
            error: () => {
                tip.setContent('无法获取页面信息');
            },
        })
    } catch (e) {
        tip.setContent(`获取失败：${e}`);
    } finally {
        tip.state.ajax.isFetching = false;
    }
}

export default tippyOnShow;
