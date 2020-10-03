import hoverProfile from '../HoverProfile';

/* 获取当前页面的后一页页码和链接
 *  @return  nextPage      后一页页码
 *  @return  nextPageLink  后一页的链接
 */
const getNextPageInfo = () => {
    const page = window.location.href;
    // 获取下一页页码
    const nextPage = Number($('.page > ul > .current:last').text()) + 1;
    // 如果地址已经有地址信息
    const nextPageLink = /page/.test(page)
        ? page.replace(/page=.+/, `page=${nextPage}`)
        : `${page}&page=${nextPage}`;

    return { nextPage, nextPageLink }
}

/*
 * 功能：自动翻页
 * @param  pagingSetting  自动翻页的页数
 */
const autoPaging = (pagingSetting) => {
    if (pagingSetting > 0) {
        let isbool = true; //触发开关，防止多次调用事件
        let autoPagingLimitCount = 0;
        // 插入加载提示信息
        $('body').append("<div id='loadingMessage'/>");
        $(window).scroll(function () {
            //当内容滚动到底部时加载新的内容
            if (
                $(this).scrollTop() + $(window).height() + 700 >=
                $(document).height() &&
                $(this).scrollTop() > 700 &&
                isbool == true &&
                autoPagingLimitCount < pagingSetting
            ) {
                isbool = false;
                // 获取下一页页码和链接
                const { nextPage, nextPageLink } = getNextPageInfo();
                // 加载页面并且插入
                $('#loadingMessage').text(`加载第${nextPage}页...`).show();
                $('.page:last').after(`<div class='loadPage${nextPage}'></div>`);
                $.get(
                    nextPageLink,
                    {},
                    (data) => {
                        const $response = $('<div />').html(data);
                        $(`.loadPage${nextPage}`)
                            .append($response.find('.list'))
                            .append($response.find('.page'));
                        isbool = true;
                        autoPagingLimitCount++;
                        // 各个页面的功能追加
                        // addHighlightOnID(); // TODO
                        // filterUserPost();   // TODO
                        hoverProfile();
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

export default autoPaging;
