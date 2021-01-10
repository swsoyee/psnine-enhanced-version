/*
 * 功能：热门帖子增加 热门 标签
 * param  hotTagThreshold  设置热门阈值
 */
const hotTag = (hotTagThreshold) => {
    $('div.meta').map((index, element) => {
        const replyCount = $(element).text().split(/(\d+)/);
        if (Number(replyCount[replyCount.length - 2]) > hotTagThreshold
            && replyCount[replyCount.length - 1].match('评论|答案|回复')
            && replyCount[replyCount.length - 1].match('评论|答案|回复').index > -1
            && $(element).children('a#hot').length === 0
        ) {
            const tagBackgroundColor = $('body.bg').css('background-color');
            $(element)
                .append(`&nbsp;<a class="psnnode" id="hot" style="background-color: ${tagBackgroundColor === "rgb(43, 43, 43)"
                    ? "rgb(125 69 67)" // 暗红色
                    : "rgb(217, 83, 79)" // 鲜红色
                    };color: rgb(255, 255, 255);">🔥热门&nbsp;</a>`);
        }
    })
}

export default hotTag;
