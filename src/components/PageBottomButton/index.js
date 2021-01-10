/*
 * 页面右下角追加点击跳转到页面底部按钮
 */
const pageBottom = () => {
    $('.bottombar').append("<a id='scrollbottom' class='yuan mt10'>B</a>");
    $('#scrollbottom').click(() => {
        $('body,html').animate({
            scrollTop: document.body.clientHeight,
        },
            500
        );
    }).css({
        cursor: 'pointer'
    });
}

export default pageBottom;
