/*
 * 功能：黑条文字鼠标悬浮显示
 * param:  isOn  是否开启功能
 */
const showMarkMessage = (isOn) => {
    if (isOn) {
        window.addEventListener('load', () => {
            $('.mark').hover(
                function () {
                    $(this).css({ color: "rgb(255,255,255)" });
                },
                function () {
                    $(this).css({ color: $(this).css('background-color') });
                }
            );
        })
    }
}

export default showMarkMessage;
