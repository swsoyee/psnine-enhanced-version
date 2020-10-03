/*
 * 个人主页下显示所有游戏
 * @param isOn  是否启用功能
 */
const allGame = (isOn) => {
    if (isOn) {
        let isbool2 = true; //触发开关，防止多次调用事件
        // 插入加载提示信息
        $('body').append("<div id='loadingMessage'/>");
        let gamePageIndex = 2;
        $(window).scroll(function () {
            if (
                $(this).scrollTop() + $(window).height() + 700 >=
                $(document).height() &&
                $(this).scrollTop() > 700 &&
                isbool2 == true
            ) {
                isbool2 = false;
                let gamePage =
                    window.location.href + '/psngame?page=' + gamePageIndex;
                // 加载页面并且插入
                $('#loadingMessage').text(`加载第${gamePageIndex}页...`).show();
                $.get(
                    gamePage,
                    {},
                    (data) => {
                        const nextGameContent = $('<div />').html(data).find('tbody > tr');
                        if (nextGameContent.length > 0) {
                            $('tbody > tr:last').after(nextGameContent);
                            isbool2 = true;
                            gamePageIndex++;
                        } else {
                            $('#loadingMessage').text('没有更多游戏了...');
                        }
                    },
                    'html'
                );
                setTimeout(() => {
                    $('#loadingMessage').fadeOut();
                }, 2000);
            }
        });
    }
}

export default allGame;
