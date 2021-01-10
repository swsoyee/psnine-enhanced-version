/*
 * 功能：实时统计创建机因时候的文字数
 */
const inputCounter = () => {
    $(".pr20 > textarea[name='content']").before(
        `<div class='text-warning'>
                    <p>字数：<span class='wordCount'>0</span>/600</p>
                </div>`
    );
    $(".pr20 > textarea[name='content']").keyup(function () {
        const wordCount = $('.wordCount').text(
            $("textarea[name='content']").val().replace(/\n|\r/gi, '').length
        );
        if (Number($(".wordCount").text()) > 600) {
            $("button.btn.btn-large.btn-banner")
                .prop("disabled", true)
                .css("background-color", "#aaa")
                .text("内容字数超过上限！");
        } else {
            $("button.btn.btn-large.btn-banner")
                .prop("disabled", false)
                .css("background-color", "#3890ff")
                .text("提交");
        }
        return (wordCount);
    });
}

export default inputCounter;
