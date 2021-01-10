/*
 * 回复按钮悬浮触发显示
 * @param  div  标签
 */
const hoverShowReply = (div) => {
    const subClass = "span[class='r']";
    $(`${div} ${subClass}`).css({
        opacity: 0,
        transition: 'all 0.2s ease',
    });
    $(div).hover(
        function () {
            $(this).find(subClass).css({
                opacity: 1,
            });
        },
        function () {
            $(this).find(subClass).css({
                opacity: 0,
            });
        }
    );
}

export default hoverShowReply;
