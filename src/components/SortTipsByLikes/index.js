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
    GM_addStyle(
        `#sortTipsByLikes {
            padding          : 8px 16px;
            margin           : 10px;
            border-radius    : 2px;
            display          : inline-block;
            color            : white;
            background-color : #3498db;
            cursor           : pointer;
            line-height      : 24px;
        }`
    );
    let isSorted = false;
    $("<a id='sortTipsByLikes'>根据顶数排序Tips</a>")
        .insertAfter($('div.box.mt20>div.pd10.alert-error').get(0)).css({
            width: '111px',
            textAlign: 'center',
            textDecoration: 'none',
        })
        .click((event) => {
            sortTips(isSorted);
            isSorted
                ? $(event.target).text('根据顶数排序Tips').css({
                    "background-color": "#3498db",
                    "color": "#FFFFFF"
                })
                : $(event.target).text('恢复默认排序').css({
                    "background-color": "#E7EBEE",
                    "color": "#99A1A7"
                });
            isSorted = !isSorted;
        });
}

export default sortTipsByLikes;
