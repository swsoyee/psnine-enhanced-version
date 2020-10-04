const sortTips = (isSorted) => {
    // 检测是否为老页面
    const containerName = $('.post').length > 0 ? '.mt20' : '.list';
    $(containerName).css({
        display: 'flex',
        flexDirection: 'column'
    });
    // 遍历tips容器下面的每一个子元素
    $(containerName + '>*').each((index, ele) => {
        // 获取顶元素
        let $likeEle = $(ele).find('.text-success')[0];
        let likeStr = "";
        if ($likeEle) {
            // 获取顶数
            likeStr = $likeEle.innerHTML;
            likeStr = likeStr.replace(/[^0-9]/ig, "");
        }
        isSorted
            ? $(ele).css({ order: 0 })
            : $(ele).css({ order: likeStr ? 99999 - likeStr : 99999 });
    });
    // 把警告信息和排序按钮写死为第一位
    $('.alert-error, #sortTipsByLikes').css({
        order: 0
    });
}

/*
* 功能：奖杯心得按“顶”的数量排序功能
*/
const sortTipsByLikes = () => {
    let isSorted = false;
    $("<div id='sortTipsByLikes' class='page''><li class='current' style='cursor: pointer;'><a>根据顶数排序Tips</a></li></a>")
        .insertAfter($('div.box.mt20>div.pd10.alert-error').get(0))
        .click((event) => {
            sortTips(isSorted);
            if (isSorted) {
                $(event.target).text('根据顶数排序Tips');
                $(event.target).parent().addClass('current');
            } else {
                $(event.target).text('恢复默认排序');
                $(event.target).parent().removeClass('current');
            }
            isSorted = !isSorted;
        });
}

export default sortTipsByLikes;
