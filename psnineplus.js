// ==UserScript==
// @name         PSN中文网功能增强
// @namespace    https://swsoyee.github.io
// @version      0.9.3
// @description  数折价格走势图，显示人民币价格，奖杯统计和筛选，发帖字数统计和即时预览，楼主高亮，自动翻页，屏蔽黑名单用户发言，被@用户的发言内容显示等多项功能优化P9体验
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAMFBMVEVHcEw0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNuEOyNSAAAAD3RSTlMAQMAQ4PCApCBQcDBg0JD74B98AAABN0lEQVRIx+2WQRaDIAxECSACWLn/bdsCIkNQ2XXT2bTyHEx+glGIv4STU3KNRccp6dNh4qTM4VDLrGVRxbLGaa3ZQSVQulVJl5JFlh3cLdNyk/xe2IXz4DqYLhZ4mWtHd4/SLY/QQwKmWmGcmUfHb4O1mu8BIPGw4Hg1TEvySQGWoBcItgxndmsbhtJd6baukIKnt525W4anygNECVc1UD8uVbRNbumZNl6UmkagHeRJfX0BdM5NXgA+ZKESpiJ9tRFftZEvue2cS6cKOrGk/IOLTLUcaXuZHrZDq3FB2IonOBCHIy8Bs1Zzo1MxVH+m8fQ+nFeCQM3MWwEsWsy8e8Di7meA5Bb5MDYCt4SnUbP3lv1xOuWuOi3j5kJ5tPiZKahbi54anNRaaG7YElFKQBHR/9PjN3oD6fkt9WKF9rgAAAAASUVORK5CYII=
// @author       InfinityLoop, mordom0404
// @include      *psnine.com/*
// @include      *d7vg.com/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      http://code.highcharts.com/highcharts.js
// @require      https://unpkg.com/tippy.js@3/dist/tippy.all.min.js
// @license      MIT
// @supportURL   https://github.com/swsoyee/psnine-night-mode-CSS/issues/new
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';
    var settings = {
        // 功能0-1.1：恢复导航部的新闻链接
        addNews: false, // 设置为false默认关闭
        // 功能0-3设置：鼠标滑过黑条即可显示内容
        hoverUnmark: true, // 设置为false则选中才显示
        // 功能0-5设置：是否开启自动签到
        autoCheckIn: true,
        // 功能0-6: 自动翻页
        autoPaging: 0, // 自动往后翻的页数
        // 功能0-7：个人主页下显示所有游戏
        autoPagingInHomepage: true,
        // 功能1-4：回复内容回溯
        replyTraceback: true,
        // 功能1-1设置：高亮发帖楼主功能
        highlightBack: '#3890ff', // 高亮背景色
        highlightFront: '#ffffff', // 高亮字体颜色
        // 功能1-2设置：高亮具体ID功能（默认管理员id）
        // 注：此部分功能源于@mordom0404的P9工具包：
        // https://greasyfork.org/zh-CN/scripts/29343-p9%E5%B7%A5%E5%85%B7%E5%8C%85
        highlightSpecificID: ['mechille', 'sai8808', 'jimmyleo', 'jimmyleohk'], // 需要高亮的ID数组
        highlightSpecificBack: '#d9534f', // 高亮背景色
        highlightSpecificFront: '#ffffff', // 高亮字体颜色
        // 功能1-6设置：屏蔽黑名单中的用户发言内容
        blockList: [], // 请在左侧输入用户ID，用逗号进行分割，如： ['use_a', 'user_b', 'user_c'] 以此类推
        // 功能1-10设置：问答根据回答状态对标题着色
        qaHighlightTitle: true,
        // 功能1-11设置：鼠标悬浮于头像显示个人奖杯卡
        hoverHomepage: true,
        // 功能2-2设置：汇率设置
        dollarHKRatio: 0.88, // 港币汇率
        dollarRatio: 6.9, // 美元汇率
        poundRatio: 7.8, // 英镑汇率
        yenRatio: 0.06, // 日元汇率
        // 功能4-3设置：汇总以获得和未获得奖杯是否默认折叠
        foldTropySummary: false, // true则默认折叠，false则默认展开
        // 功能5-1设置：是否在`游戏`页面启用降低无白金游戏的图标透明度
        filterNonePlatinumAlpha: 0.2, // 透密 [0, 1] 不透明，如果设置为1则关闭该功能
        //夜间模式
        nightMode: false,
        // 约战页面去掉发起人头像
        removeHeaderInBattle: false,
    };
    Highcharts.setOptions({
        lang: {
            contextButtonTitle: '图表导出菜单',
            decimalPoint: '.',
            downloadJPEG: '下载JPEG图片',
            downloadPDF: '下载PDF文件',
            downloadPNG: '下载PNG文件',
            downloadSVG: '下载SVG文件',
            drillUpText: '返回 {series.name}',
            loading: '加载中',
            months: [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月',
            ],
            noData: '没有数据',
            numericSymbols: ['千', '兆', 'G', 'T', 'P', 'E'],
            printChart: '打印图表',
            resetZoom: '恢复缩放',
            resetZoomTitle: '恢复图表',
            shortMonths: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
            ],
            thousandsSep: ',',
            weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
    });
    if (window.localStorage) {
        if (window.localStorage['psnine-night-mode-CSS-settings']) {
            $.extend(
                settings,
                JSON.parse(window.localStorage['psnine-night-mode-CSS-settings'])
            ); //用storage中的配置项覆盖默认设置
        }
    } else {
        console.log('浏览器不支持localStorage,使用默认配置项');
    }

    // 全局优化
    /*
     * 页面右下角追加点击跳转到页面底部按钮
     */
    const toPageButton = () => {
        $('.bottombar').append("<a id='scrollbottom' class='yuan mt10'>B</a>");
        $('#scrollbottom').click(() => {
            $('body,html').animate({
                scrollTop: document.body.clientHeight,
            },
                500
            );
        });
    }
    toPageButton();

    /*
     * 恢复Header部的新闻链接
     * @param  isOn  是否开启功能
     */
    const addNews = (isOn) => {
        if (isOn) {
            $('#pcmenu > li:nth-child(1)').before(
                "<li><a href='https://psnine.com/news'>新闻</a></li>"
            );
        }
    }
    addNews(settings.addNews);

    // 功能0-2：夜间模式
    if (settings.nightMode) {
        $('body').append(`
<style>li[style="background:#f5faec"]{background:#344836 !important}li[style="background:#fdf7f7"]{background:#4f3945 !important}li[style="background:#faf8f0"]{background:#4e4c39 !important}li[style="background:#f4f8fa"]{background:#505050 !important}span[style="color:blue;"]{color:#64a5ff !important}span[style="color:red;"]{color:#ff6464 !important}span[style="color:brown;"]{color:#ff8864 !important}.tit3{color:white !important}.mark{background:#bbb !important;color:#bbb}body.bg{background:#2b2b2b !important}.list li,.box .post,td,th{border-bottom:1px solid #333}.content{color:#bbb !important}.psnnode{background:#656565}.box{background:#3d3d3d !important}.title a{color:#bbb}.text-strong,strong{color:#bbb !important}.twoge{color:white !important}.storeinfo{color:#bbb !important}.alert-warning{background:#4d4d4d !important}.alert-info{background:#5e5e5e !important}.alert-success{background:#4b4b4b !important}h1,.title2{color:#fff !important}.inav{background:#3d3d3d !important}.inav li.current{background:#4b4b4b !important}.ml100 p{color:#fff !important}.t1{background:#657caf !important}.t2{background:#845e2f !important}.t3{background:#707070 !important}.t4{background:#8b4d2d !important}blockquote{background:#bababa !important}.text-gray{color:#bbb !important}.tradelist li{color:white !important}.tbl{background:#3c3c3c !important}.genelist li:hover,.touchclick:hover{background:#333 !important}.cloud{background-color:#3c3c3c!important}.showbar{background:radial-gradient(at center top,#7B8492,#3c3c3c)}.side .darklist{background-color:#3c3c3c}.side .hd3{background-color:#222}.header,.dropdown ul{background-color:#222}.list li .sonlist li{background-color:#333}.node{background-color:#3b4861}.rep{background-color:#3b4861}.btn-gray{background-color:#666}</style>
`);
    }

    // 功能0-3：黑条文字鼠标悬浮显示
    if (settings.hoverUnmark) {
        $('.mark').hover(
            function (i) {
                var backGroundColor = $('.box.mt20').css('background-color');
                $(this).css({ color: backGroundColor });
            },
            function (o) {
                var sourceColor = $(this).css('background-color');
                $(this).css({ color: sourceColor });
            }
        );
    }
    // 功能0-4：markdown语法支持测试

    /*
     * 自动签到功能
     * @param  isOn  是否开启功能
     */
    const automaticSignIn = (isOn) => {
        // 如果签到按钮存在页面上
        if (isOn && $('[class$=yuan]').length > 0) {
            $('[class$=yuan]').click();
        }
    }
    automaticSignIn(settings.autoCheckIn);

    // 功能0-6：自动翻页

    /* 获取当前页面的后一页页码和链接
    *  @return  nextPage      后一页页码
    *  @return  nextPageLink  后一页的链接
    */
    const getNextPageInfo = () => {
        // 获取下一页页码
        const nextPage = Number($('.page > ul > .current:last').text()) + 1;
        // 如果地址已经有地址信息
        let nextPageLink = '';
        if (/page/.test(window.location.href)) {
            nextPageLink = window.location.href.replace(
                /page=.+/,
                'page=' + nextPage
            );
        } else {
            nextPageLink = window.location.href + '&page=' + nextPage;
        }
        return { nextPage, nextPageLink }
    }
    if (settings.autoPaging > 0) {
        let isbool = true; //触发开关，防止多次调用事件
        $('body').append(
            "<div id='loadingMessage' style='position: absolute;bottom: 0px;position: fixed;right: 1px !important;display:none; color:white;'></div>"
        );
        if (
            /((gene($|\?))|(qa($|\?))|(topic($|\?))|(planlist($|\?))|(gamelist($|\?))|(trade($|\?)))/.test(
                window.location.href
            )
        ) {
            let autoPagingLimitCount = 0;
            $(window).scroll(function () {
                //当内容滚动到底部时加载新的内容
                if (
                    $(this).scrollTop() + $(window).height() + 700 >=
                    $(document).height() &&
                    $(this).scrollTop() > 700 &&
                    isbool == true &&
                    autoPagingLimitCount < settings.autoPaging
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
                            var $response = $('<div />').html(data);
                            $(`.loadPage${nextPage}`)
                                .append($response.find('.list'))
                                .append($response.find('.page'));
                            isbool = true;
                            autoPagingLimitCount++;
                            // 各个页面的功能追加
                            addHighlightOnID();
                            filterUserPost();
                            addHoverProfile();
                            if (/\/qa/.test(window.location.href)) {
                                addColorToQaTitle();
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
    // 功能0-7：个人主页下显示所有游戏
    if (settings.autoPagingInHomepage) {
        var isbool2 = true; //触发开关，防止多次调用事件
        GM_addStyle(
            `#loadingMessage {position: absolute;bottom: 0px;position: fixed;right: 1px !important;display:none; color:white;}`
        );
        $('body').append("<div id='loadingMessage'></div>");
        if (
            /psnid\/[A-Za-z0-9_-]+$/.test(window.location.href) &&
            $('tbody').length > 2
        ) {
            var gamePageIndex = 2;
            $(window).scroll(function () {
                if (
                    $(this).scrollTop() + $(window).height() + 700 >=
                    $(document).height() &&
                    $(this).scrollTop() > 700 &&
                    isbool2 == true
                ) {
                    isbool2 = false;
                    var gamePage =
                        window.location.href + '/psngame?page=' + gamePageIndex;
                    // 加载页面并且插入
                    $('#loadingMessage').text(`加载第${gamePageIndex}页...`).show();
                    $.get(
                        gamePage,
                        {},
                        (data) => {
                            var $response = $('<div />').html(data);
                            var nextGameContent = $response.find('tbody > tr');
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
    // 帖子优化
    /*
    * 功能：对发帖楼主增加“楼主”标志
    * @param  userId  用户（楼主）ID
    */
    const addOPBadge = (userId) => {
        $('.psnnode').map((i, n) => {
            // 匹配楼主ID，变更CSS
            if ($(n).text() == userId) {
                $(n).after('<span class="badge badge-1">楼主</span>');
            }
        });
    }
    if (
        /(gene|trade|topic)\//.test(window.location.href) &
        !/comment/.test(window.location.href)
    ) {
        // 获取楼主ID
        const authorId = $('.title2').text();
        addOPBadge(authorId);
    }

    /*
    * 功能：对关注用户进行ID高亮功能函数
    */
    const addHighlightOnID = () => {
        settings.highlightSpecificID.map((i, n) => {
            $(`.meta>[href="${window.location.href.match('(.*)\\.com')[0]}/psnid/${i}"]`).css({
                'background-color': settings.highlightSpecificBack,
                color: settings.highlightSpecificFront,
            });
        });
    }
    addHighlightOnID();

    // 功能1-3：主题中存在 -插图- 一项时，提供预览悬浮窗
    $("a[target='_blank']").html((i, url) => {
        if (url == ' -插图- ') {
            const xOffset = 5;
            const yOffset = 5;
            const imgUrl = $(this).attr('href');
            $(this).hover(
                (e) => {
                    $('body').append(
                        $(
                            `<span id="hoverImage"><img src="${imgUrl}" onload="if (this.width > 500) this.width=500;"</img></span>`
                        )
                    );
                    $('#hoverImage')
                        .css({
                            position: 'absolute',
                            border: '1px solid #ccc',
                            display: 'none',
                            padding: '5px',
                            background: '#333',
                        })
                        .css('top', e.pageY - xOffset + 'px')
                        .css('left', e.pageX + yOffset + 'px')
                        .fadeIn(500);
                },
                () => {
                    $('#hoverImage').remove();
                }
            );
            $(this).mousemove((e) => {
                $('#hoverImage')
                    .css('top', e.pageY - xOffset + 'px')
                    .css('left', e.pageX + yOffset + 'px');
            });
        }
    });
    // 功能1-4：回复内容回溯，仅支持机因、主题（目前仅限主贴，common下不会显示）
    if (
        /(gene|topic|trade|battle)\//.test(window.location.href) &&
        settings.replyTraceback
    ) {
        GM_addStyle(
            `.replyTraceback {
                background-color: rgb(0, 0, 0, 0.05) !important;
                padding: 10px !important;
                color: rgb(160, 160, 160, 1) !important;
                border-bottom: 1px solid !important;
            }`
        );
        // 悬浮框内容左对齐样式
        GM_addStyle(`
            .tippy-content {
                text-align: left;
            }`
        );
        // 每一层楼的回复外框 (0 ~ N - 1)
        var allSourceOutside = document.querySelectorAll('.post > .ml64'); // 30楼的话是29
        // 每一层楼的回复框(0 ~ N - 1) floor
        var allSource = document.querySelectorAll('.post .ml64 > .content'); // 30楼的话是29
        // 每一层楼的回复者名字( 0 ~ N - 1)
        var userId = document.querySelectorAll('.post > .ml64 > [class$=meta]'); // 30楼的话是29
        // 每一层的头像(0 ~ N - 1)
        var avator = document.querySelectorAll('.post > a.l'); // 30楼的话是29
        for (var floor = allSource.length - 1; floor > 0; floor--) {
            // 层内内容里包含链接（B的发言中是否有A）
            var content = allSource[floor].querySelectorAll('a');
            if (content.length > 0) {
                for (var userNum = 0; userNum < content.length; userNum++) {
                    // 对每一个链接的文本内容判断
                    var linkContent = content[userNum].innerText.match('@(.+)');
                    // 链接里是@用户生成的链接， linkContent为用户名（B的发言中有A）
                    if (linkContent != null) {
                        var replayBox = document.createElement('div');
                        replayBox.setAttribute('class', 'replyTraceback');
                        // 从上层开始，回溯所@的用户的最近回复（找最近的一条A的发言）
                        var traceIdFirst = -1;
                        var traceIdTrue = -1;
                        for (var traceId = floor - 1; traceId >= 0; traceId--) {
                            // 如果回溯到了的话，选取内容
                            // 回溯层用户名
                            var thisUserID = userId[traceId].getElementsByClassName(
                                'psnnode'
                            )[0].innerText;
                            if (thisUserID == linkContent[1].toLowerCase()) {
                                // 判断回溯中的@（A的发言中有是否有B）
                                if (
                                    allSource[traceId].innerText.indexOf(
                                        userId[floor].getElementsByClassName('psnnode')[0]
                                            .innerText
                                    ) > -1
                                ) {
                                    traceIdTrue = traceId;
                                    break;
                                } else if (traceIdFirst == -1) {
                                    traceIdFirst = traceId;
                                }
                            }
                        }
                        var outputID = -1;
                        if (traceIdTrue != -1) {
                            outputID = traceIdTrue;
                        } else if (traceIdFirst != -1) {
                            outputID = traceIdFirst;
                        }
                        // 输出
                        if (outputID != -1) {
                            var replyContents = '';
                            if (allSource[outputID].innerText.length > 45) {
                                replyContents =
                                    allSource[outputID].innerText.substring(0, 45) + '......';
                            } else {
                                replyContents = allSource[outputID].innerText;
                            }
                            var avatorImg = avator[outputID]
                                .getElementsByTagName('img')[0]
                                .getAttribute('src');
                            replayBox.innerHTML = `<div><span class="badge"><img src="${avatorImg}" height="15" width="15" style="margin-right: 5px; border-radius: 8px;"></img>${linkContent[1]}</span><span class="responserContent_${floor}_${outputID}" style="display: inline-block; padding-left: 10px;">${replyContents}</span></div>`;
                            allSourceOutside[floor].insertBefore(
                                replayBox,
                                allSource[floor]
                            );
                            // 如果内容超过45个字符，则增加悬浮显示全文内容功能
                            if (allSource[outputID].innerText.length > 45) {
                                tippy(`.responserContent_${floor}_${outputID}`, {
                                    content: allSource[outputID].innerText,
                                    animateFill: false,
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    // 功能1-5：增加帖子楼层信息
    const addFloorIndex = () => {
        let baseFloorIndex = 0;
        let subFloorIndex = -1;
        $('span[class^=r]').map((i, el) => {
            if (i > 0) {
                if ($(el).attr('class') === 'r') {
                    $(el).children('a:last')
                        .after(`&nbsp&nbsp<span>#${++baseFloorIndex}</span>`);
                    subFloorIndex = -1;
                } else {
                    $(el).children('a:last')
                        .after(
                            `&nbsp&nbsp<span>#${baseFloorIndex}${subFloorIndex--}</span>`
                        );
                }
            }
        });
    }
    addFloorIndex();

    // 功能1-6：屏蔽黑名单中的用户发言内容
    const Filter = (psnnode, parent, userList) => {
        $(psnnode).map((i, el) => {
            if ($(el).html().toLowerCase() === userList.toLowerCase()) {
                $(el).parents(parent).hide();
            }
        });
    }

    const filterUserPost = () => {
        if (settings.blockList.length > 0) {
            settings.blockList.map((user, i) => {
                if (window.location.href.indexOf('gene') > -1) {
                    Filter('div.post .psnnode', 'div.post', user);
                    Filter('.touchclick .psnnode', '.touchclick', user);
                }
            });
        }
    }
    filterUserPost();

    /*
    * 功能：实时统计创建机因时候的文字数
    */
    const countInputLength = () => {
        $(".pr20 > textarea[name='content']").before(
            `<div class='text-warning'>
                <p>字数：<span class='wordCount'>0</span>/600</p>
            </div>`
        );
        $(".pr20 > textarea[name='content']").keyup(function () {
            $('.wordCount').text(
                $("textarea[name='content']").val().replace(/\n|\r/gi, '').length
            );
        });
    }
    // 功能1-7：实时统计创建机因时候的文字数
    if (/set\/gene/.test(window.location.href)) {
        countInputLength();
    }


    // 功能1-8：回复按钮hover触发显示
    /*
    * 回复按钮hover触发显示功能函数
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
    hoverShowReply('.post');
    if (/^(?!.*trade|.*qa(\?(ob|title)=.*)?$)/.test(window.location.href)) {
        hoverShowReply("div[class$='ml64']");
    }

    // 功能1-9：发帖BBCode实时渲染
    if (/node\/talk\/add/.test(window.location.href)) {
        $('.alert-warning.pd10.lh180').before(
            "<div class='content pb10' style='padding:10px;' id='output'></div>"
        );

        function replaceAll(str, mapObj) {
            for (var i in mapObj) {
                var re = new RegExp(i, 'g');
                str = str.replace(re, mapObj[i]);
            }
            return str;
        }
        var bbcode = {
            '\\[quote\\](.+?)\\[\/quote\\]': '<blockquote>$1</blockquote>',
            '\\[mark\\](.+?)\\[\/mark\\]': '<span class="mark">$1</span>',
            '\\[img\\](.+?)\\[\/img\\]': '<img src="$1"></img>',
            '\\[b\\](.+?)\\[\/b\\]': '<b>$1</b>',
            '\\[s\\](.+?)\\[\/s\\]': '<s>$1</s>',
            '\\[center\\](.+?)\\[\/center\\]': '<center>$1</center>',
            '\\[\\](.+?)\\[\/b\\]': '<b>$1</b>',
            '\\[color=(.+?)\\](.+?)\\[\/color\\]': '<span style="color:$1;">$2</span>',
            '\\[url\\](.+)\\[/url\\]': '<a href="$1">$1</a>',
            '\\[url=(.+)\\](.+)\\[/url\\]': '<a href="$1">$2</a>',
            //'\\[trophy=(.+)\\]\\[/trophy\\]': '<a href="$1">$2</a>',
            //'\\[trophy=(.+)\\](.+)\\[/trophy\\]': '<a href="$1">$2</a>',
            '\\n': '<br/>',
        };
        $("textarea[name='content']").keyup(function () {
            var bbcodeSource = document.getElementsByName('content')[0].value;
            var outputContent = replaceAll(bbcodeSource, bbcode);
            $('#output').html(outputContent);
        });
    }

    /*
     * 问答标题根据回答状况着色
     * @param  isOn  是否开启功能
     */
    const addColorToQaTitle = (isOn) => {
        if (isOn) {
            $('div.meta > .r > span:nth-child(2)').map((i, el) => {
                $(el)
                    .parent()
                    .parent()
                    .prev()
                    .children('a')
                    .css('color', $(el).css('color'));
            });
        } else {
            return;
        }
    }
    if (/\/qa/.test(window.location.href)) {
        addColorToQaTitle(settings.qaHighlightTitle);
    }

    // 功能1-11：悬浮于头像显示个人界面
    const addHoverProfile = () => {
        if (settings.hoverHomepage) {
            const INITIAL_CONTENT = '加载中...';
            $("a[href*='psnid/'] > img").parent().map(function (i, v) {
                var url = $(this).attr('href');
                $(this).attr('id', 'profile' + i);
                tippy(`#profile${i}`, {
                    content: INITIAL_CONTENT,
                    delay: 700,
                    maxWidth: '500px',
                    animateFill: false,
                    interactive: true,
                    placement: 'left',
                    async onShow(tip) {
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
                                    const reg = /[\s\S]*<\/body>/g;
                                    const html = reg.exec(data)[0];
                                    const inner = $(html).find('.psnzz').parent().get(0);
                                    $(inner).find('.inner').css('max-width', '400px');
                                    tip.setContent(inner);
                                },
                                error: () => {
                                    tip.setContent('无法获取页面信息');
                                },
                            });
                        } catch (e) {
                            tip.setContent(`获取失败：${e}`);
                        } finally {
                            tip.state.ajax.isFetching = false;
                        }
                    },
                    onHidden(tip) {
                        tip.state.ajax.canFetch = true;
                        tip.setContent(INITIAL_CONTENT);
                    },
                });
            });
        }
    }
    addHoverProfile();

    /* 日期转换函数，将（XX年XX月XX日）形式切割成UTC时间
    *  @param   value     XX年XX月XX日 形式的字符串
    *  @return  {object}  UTC时间对象
    */
    const converntTime = (value) => {
        const time = value.replace(/年|月|日/g, '-').split('-');
        return Date.UTC('20' + time[0], Number(time[1]) - 1, time[2]);
    }

    /* 获取当前页面的价格变动时间，构建绘图曲线X轴数据集
    *  @return  xValue  价格变动时间X数据
    */
    const priceLineDataX = () => {
        // 获取X轴的日期
        const xContents = $('p.dd_text');
        let xValue = [];
        for (var index = 3; index < xContents.length; index += 4) {
            const tamp = xContents[index].innerText.split(' ~ ').map((item) => {
                return converntTime(item);
            });
            xValue = [tamp[0], tamp[0], tamp[1], tamp[1], ...xValue];
        }
        return xValue;
    }

    /* 获取当前页面的价格情况，构建绘图曲线Y轴数据集
    *  @return  yNormal  普通会员价格Y数据
    *  @return  yPlus    plus会员价格Y数据
    */
    const priceLineDataY = () => {
        const div = $('.dd_price');
        let yNormal = [];
        let yPlus = [];
        div.map((i, el) => {
            const yOld = $(el).children('.dd_price_old').eq(0).text();
            const yPriceNormal = $(el).children('.dd_price_off').eq(0).text();
            // 普通会员价格曲线值
            yNormal = [yOld, yPriceNormal, yPriceNormal, yOld, ...yNormal];
            // PS+会员价格曲线值
            const yPricePlus = $(el).children('.dd_price_plus').eq(0);
            const pricePlusTamp = yPricePlus.length === 0 ? yPriceNormal : yPricePlus.text();
            yPlus = [yOld, pricePlusTamp, pricePlusTamp, yOld, ...yPlus];
        });
        return { yNormal, yPlus };
    }

    /* 修正数据集的最后一组数据函数。如果当前日期在最后一次促销结束前，
    *  则修改最后一组数据为当前日期，如在以后，则将最后一次促销的原始
    *  价格作为最后一组数据的当前价格。
    *  @param   [dataArray]  包含[datetime, price]的原始数据
    * 
    *  @return  [dataArray]  修改后的[datetime, price]数据
    */
    const fixTheLastElement = (data) => {
        const today = new Date();
        const todayArray = Date.UTC(
            today.getYear() + 1900,
            today.getMonth(),
            today.getDate()
        );
        if (data[data.length - 1][0] > todayArray) {
            data.pop();
            data[data.length - 1][0] = todayArray;
        } else {
            data.push([todayArray, data[data.length - 1][1]]);
        }
        return data;
    }

    /* 传入时间和一般、Plus会员价格数组，生成绘图用数据集
    *  @param   xValue   价格变动时间数组
    *  @param   yNormal  一般会员价格数组
    *  @param   yPlus    Plus会员价格数组
    * 
    *  @return  normalData  一般会员价格绘图用数组
    *  @return  plusData    Plus会员价格绘图用数组
    *  @return  region      地区货币符
    */
    const createPriceLineData = (xValue, yNormal, yPlus) => {
        // 用于保存绘图数据的变量
        let normalData = [];
        let plusData = [];
        // 判断地区
        const prefix = yNormal[0].substring(0, 1);
        const region = prefix === 'H' ? 'HK$' : prefix;

        xValue.map((item, i) => {
            normalData.push([item, Number(yNormal[i].replace(region, ''))]);
            plusData.push([item, Number(yPlus[i].replace(region, ''))]);
        })
        // 最后一组数组的处理，生成最终数据绘图数据集
        normalData = fixTheLastElement(normalData);
        plusData = fixTheLastElement(plusData);
        return { normalData, plusData, region }
    }

    /* 根据数据绘制价格变动走势图
    *  @param   normalData     一般会员价格绘图用数组
    *  @param   plusData       Plus会员价格绘图用数组
    *  @param   region         地区货币符
    * 
    *  @return  priceLinePlot  highChart对象
    */
    const createPriceLinePlot = (normalData, plusData, region) => {
        const priceLineChart = {
            type: 'areaspline',
            backgroundColor: 'rgba(0,0,0,0)',
        };
        const priceLineTitle = {
            text: '价格变动走势图',
            style: {
                color: '#808080',
            },
        };
        const priceLineXAxis = {
            type: 'datetime',
            dateTimeLabelFormats: {
                year: '%y年',
                day: '%y年<br/>%b%e日',
                week: '%y年<br/>%b%e日',
                month: '%y年<br/>%b',
            },
            title: {
                text: '日期',
            },
        };
        const priceLineYAxis = {
            title: {
                text: '价格',
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080',
                },
            ],
        };
        const priceLineTooltip = {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: `{point.x:%y年%b%e日}: ${region}{point.y:.2f}`,
        };
        const priceLinePlotOptions = {
            areaspline: {
                fillOpacity: 0.25,
            },
        };
        const priceLineSeries = [
            {
                name: '普通会员价',
                color: '#00a2ff',
                data: normalData,
            },
            {
                name: 'PS+会员价',
                color: '#ffd633',
                data: plusData,
            },
        ];
        const priceLineCredits = {
            enabled: false,
        };
        const priceLineLegend = {
            itemStyle: {
                color: '#808080',
            },
            itemHoverStyle: {
                color: '#3890ff',
            },
        };
        const priceLinePlot = {
            chart: priceLineChart,
            title: priceLineTitle,
            tooltip: priceLineTooltip,
            xAxis: priceLineXAxis,
            yAxis: priceLineYAxis,
            series: priceLineSeries,
            plotOptions: priceLinePlotOptions,
            credits: priceLineCredits,
            legend: priceLineLegend,
        };
        return priceLinePlot;
    }
    /* 
    * 功能：在页面中插入价格变动走势图
    */
    const addPriceLinePlot = () => {
        // 构建绘图数据
        const xValue = priceLineDataX();
        const { yNormal, yPlus } = priceLineDataY();
        const { normalData, plusData, region } = createPriceLineData(xValue, yNormal, yPlus);
        const priceLinePlot = createPriceLinePlot(normalData, plusData, region);
        // 插入页面
        $('.dd_ul').before(`<div id="container"></div>`);
        $('#container').highcharts(priceLinePlot);
    }
    /*
    * 增加单个价格或文字展示标签
    * @param  value        展示数值或字符串
    * @param  className    样式名
    * @param  styleString  额外追加的样式
    * @return {string}     展示内容标签
    */
    const priceSpan = (value, className, styleString = null) => {
        let text = value;
        if (typeof value === 'number') {
            if (value > 0) {
                text = '¥' + value.toFixed(2);
            } else {
                return;
            }
        }
        return `<span class=${className} style="float:right;${styleString}">${text}</span>`;
    }
    /*
    * 功能：在当前页面上添加外币转人民币的价格展示
    */
    const foreignCurrencyConversion = () => {
        $('.dd_price').map((i, el) => {
            const price = [
                $(el).children().eq(0).text(), // 原始价格
                $(el).children().eq(1).text(), // 优惠价格
                $(el).children().eq(2).text(), // 会员优惠价格
            ];
            // 一览页面和单商品页面不同位置偏移
            const offset = /dd\//.test(window.location.href) ? 2 : 3;
            // 根据地区转换原始价格
            const district = $(`.dd_info p:nth-child(${offset})`).eq(i).text();
            const districtCurrency = {
                港服: ['HK$', settings.dollarHKRatio],
                美服: ['$', settings.dollarRatio],
                日服: ['¥', settings.yenRatio],
                英服: ['£', settings.poundRatio],
                国服: ['¥', 1],
            };
            const CNY = price.map(item => {
                return (
                    Number(item.replace(districtCurrency[district][0], '')) *
                    districtCurrency[district][1]
                );
            });
            // 整块增加的价格表示
            const addCNYPriceBlock = [
                priceSpan(CNY[2], 'dd_price_plus'),
                priceSpan(CNY[1], 'dd_price_off'),
                priceSpan(CNY[0], 'dd_price_old', 'text-decoration:line-through'),
                priceSpan('CNY：', 'dd_price_off', 'font-size:12px;'),
            ].filter(Boolean).join('');
            // 添加到页面中
            $('.dd_price span:last-child').eq(i).after(addCNYPriceBlock);
        });
    }
    /*
    * 功能：根据降价幅度变更标题颜色
    */
    const changeGameTitleColor = () => {
        // 设定不同降价范围的标题颜色
        const priceTitleColorDict = {
            100: 'rgb(220,53,69)',
            80: 'rgb(253,126,20)',
            50: 'rgb(255,193,7)',
            20: 'rgb(40,167,69)',
        };
        // 着色
        $('.dd_box').map((i, el) => {
            const offPercent = Number(
                $(el).find('.dd_pic > div[class^="dd_tag"] ').text()
                    .match('省(.+)%')[1]
            );
            for (var key in priceTitleColorDict) {
                if (offPercent < key) {
                    $('.dd_title.mb10>a').eq(i).css({
                        color: priceTitleColorDict[key]
                    });
                    break;
                }
            }
        });
    }

    /*
    * 增加按键样式
    * @param  id               标签ID
    * @param  backgroundColor  按键背景色
    */
    const addButtonStyle = (id, backgroundColor) => {
        GM_addStyle(
            `#${id} {
                padding          : 0px 5px;
                margin-left      : 10px;
                border-radius    : 2px;
                display          : inline-block;
                color            : white;
                background-color : ${backgroundColor};
                cursor           : pointer;
                line-height      : 24px;
            }`
        );
    }
    addButtonStyle('selectLowest', '#d9534f'); // 只看史低
    addButtonStyle('selectUnget', '#3498db');  // 未获得
    /*
    * 功能：页面上追加“只看史低”功能按键，点击显示史低，再次点击恢复显示所有游戏（数折页面）
    */
    const onlyLowest = () => {
        // 追加只看史低按键
        $('.dropmenu').append("<li><a id='selectLowest'>只看史低</a></li>");
        // 点击按钮隐藏或者显示
        let clickHideShowNumLowest = 0;
        $('#selectLowest').click(() => {
            if (clickHideShowNumLowest++ % 2 === 0) {
                $('li.dd_box').map((i, el) => {
                    if ($(el).children('.dd_status.dd_status_best').length === 0) {
                        $(el).hide();
                    }
                });
                $('#selectLowest').text('显示全部').css({
                    'background-color': '#f78784'
                });
            } else {
                $('li.dd_box').show();
                $('#selectLowest').text('只看史低').css({
                    'background-color': '#d9534f'
                });
            }
        });
    }
    /*
    * 功能：页面上追加“只看史低”功能按键，点击显示史低，再次点击恢复显示所有游戏（活动页面）
    */
    const onlyLowestSell = () => {
        // 追加只看史低按键
        $('.disabled.h-p').after("<li><a id='selectLowest'>只看史低</a></li>")
        // 隐藏游戏box函数
        const hideOrShowGameBox = ({ status, text, background }) => {
            $(document.querySelectorAll('li.store_box')).map((i, el) => {
                if ((el).querySelector('.store_tag_best') === null) {
                    (el).style.display = status;
                }
            })
            $('#selectLowest').text(text).css({
                'background-color': background,
            });
        }
        // 点击按钮隐藏或者显示
        let clickHideShowNumLowest2 = 0;
        $('#selectLowest').click(() => {
            hideOrShowGameBox(clickHideShowNumLowest2++ % 2 === 0
                ? { status: 'none', text: '显示全部', background: '#f78784' }
                : { status: 'block', text: '只看史低', background: '#d9534f' });
        })
    }

    // 页面：数折
    if (/\/dd/.test(window.location.href)) {
        // 外币转人民币
        foreignCurrencyConversion();
        // 根据降价幅度变更标题颜色
        changeGameTitleColor();
        // 只看史低
        onlyLowest();
    }
    // 页面：数折 > 商品页
    if (
        /\/dd\//.test(window.location.href) ||
        /game\/[0-9]+\/dd$/.test(window.location.href)
    ) {
        addPriceLinePlot();
    }

    // 页面：活动
    if (/huodong/.test(window.location.href)) {
        // 只看史低
        onlyLowestSell();

        // 活动页面根据降价幅度变更背景色
        // $(document.querySelectorAll('li.store_box > .store_pic')).map(function (i, n) {
        //     var percentValue = (this).querySelector('.store_tag_plus')
        //     if (percentValue == null) {
        //         percentValue = (this).querySelector('.store_tag_nor')
        //     }
        //     var priceDownLevel = Number(percentValue.innerText.match('省(.+)%')[1]);
        // })
    }

    /*
    * 获取奖杯各种类个数
    * @param  className  用于识别的类名
    * @param  name       奖杯种类名
    * @param  color      色块所用颜色码
    * 
    * @return {object}   用于绘扇形图的单个数据块
    */
    const getTrophyCategory = (className, name, color) => {
        const tropyCount = $(className).eq(0).text().replace(name, '');
        return { name: name, y: Number(tropyCount), color: color };
    }

    /*
    * 获取奖杯各稀有度个数
    * @return {object}   用于绘扇形图的数据块
    */
    const getTrophyRarity = () => {
        let rareArray = [0, 0, 0, 0, 0];         // 个数统计
        const rareStandard = [0, 5, 10, 20, 50]; // 区间定义
        for (var rareIndex of [1, 2, 3, 4]) {
            $(`.twoge.t${rareIndex}.h-p`).map((i, ev) => {
                // 获取稀有度
                const rarity = Number($(ev).eq(0).text().split('%')[0]
                    .replace('%', ''));
                // 计算该稀有度的奖杯数量
                rareArray[[...rareStandard, rarity]
                    .sort((a, b) => a - b)
                    .indexOf(rarity) - 1]++;
            });
        }
        return rareArray;
    }
    /*
    * 功能：在单独游戏页面上方追加奖杯统计扇形图
    */
    const addTrophyPieChart = () => {
        // 奖杯稀有度统计数据
        const rareArray = getTrophyRarity();
        const trophyRatioSeriesRarityData = [
            { name: '极度珍贵', y: rareArray[0], color: 'rgb(160, 217, 255)' },
            { name: '非常珍贵', y: rareArray[1], color: 'rgb(124, 181, 236)' },
            { name: '珍贵', y: rareArray[2], color: 'rgb(88, 145, 200)' },
            { name: '罕见', y: rareArray[3], color: 'rgb(52, 109, 164)' },
            { name: '一般', y: rareArray[4], color: 'rgb(40, 97, 152)' },
        ];
        // 奖杯个数统计数据
        const trophyRatioSeriesCategoryData = [
            getTrophyCategory('.text-platinum', '白', '#7a96d1'),
            getTrophyCategory('.text-gold', '金', '#cd9a46'),
            getTrophyCategory('.text-silver', '银', '#a6a6a6'),
            getTrophyCategory('.text-bronze', '铜', '#bf6a3a'),
        ];
        // 背景设置
        const trophyRatioChart = {
            backgroundColor: 'rgba(0,0,0,0)',
        };
        // 悬浮内容设置
        const trophyRatioTooltip = {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        };
        // 绘图设置
        const trophyRatioPlotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: -20,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textOutline: '0px contrast',
                    },
                    formatter: function () {
                        return this.point.y;
                    },
                },
            },
        };
        // 绘图数据
        const trophyRatioSeries = [
            {
                type: 'pie',
                name: '比例',
                data: trophyRatioSeriesCategoryData,
                center: [50, 30],
                size: 130,
            },
            {
                type: 'pie',
                name: '比例',
                data: trophyRatioSeriesRarityData,
                center: [200, 30],
                size: 130,
            },
        ];
        // 标题设置
        const trophyRatioTitle = {
            text: '奖杯统计',
            style: {
                color: '#808080',
            },
        };
        // 构建绘图对象
        const trophyRatio = {
            chart: trophyRatioChart,
            tooltip: trophyRatioTooltip,
            title: trophyRatioTitle,
            series: trophyRatioSeries,
            plotOptions: trophyRatioPlotOptions,
            credits: { enabled: false },
        };
        // 插入页面
        $('.box.pd10').append(
            `<p></p><div id="trophyRatioChart" align="left"></div>`
        );
        $('#trophyRatioChart').highcharts(trophyRatio);
    }
    /*
    * 增加绘图框架样式
    * @param  id     标签ID
    * @param  width  宽度
    */
    const addPlotFrame = (id, width) => {
        GM_addStyle(
            `#${id} {
            width   : ${width}px;
            height  : 200px;
            margin  : 0 0;
            display : inline-block;
        }`
        );
    }
    addPlotFrame('trophyRatioChart', 320);
    addPlotFrame('trophyGetTimeChart', 460);

    /*
    * 构建奖杯获得时间绘图数据集
    * @param  className  用于识别的类名
    * 
    * @return {object}   用于绘线形图的数据集
    */
    const createTropyGetTimeData = (className) => {
        const timeElements = $(className);
        const getTimeArray = [];
        timeElements.map((i, el) => {
            // 奖杯时间丢失部分处理
            const currentValue = $(el).text().trim();
            const index = currentValue === '时间丢失' ? 0 : i;
            // 从页面上获取奖杯时间，生成时间对象并且放入数组中保存
            const dayTime = timeElements.eq(index).text().trim();
            const timeArray = [
                timeElements.eq(index).attr('tips').replace('年', ''), // 年
                Number(dayTime.substr(0, 2)) - 1, // 月
                dayTime.substr(3, 2), // 日
                dayTime.substr(5, 2), // 时
                dayTime.substr(8, 2), // 分
            ].map((x) => Number(x));
            const xTime = Date.UTC(...timeArray);
            getTimeArray.push(xTime);
        })
        // getTimeArray.push(Date.now());
        getTimeArray.sort();
        const data = getTimeArray.map((x, y) => {
            return [x, y + 1];
        })
        // 调整最终数据点
        // data[data.length - 1][1] -= 1;
        return data;
    }

    // 奖杯系统优化
    // 功能3-1：游戏奖杯界面可视化
    if (
        /psngame\//.test(window.location.href) &&
        /^(?!.*comment|.*rank|.*battle|.*gamelist|.*topic|.*qa)/.test(
            window.location.href
        )
    ) {
        // 追加奖杯统计扇形图
        addTrophyPieChart();

        // 奖杯获得时间年月统计
        const data = createTropyGetTimeData('em.lh180.alert-success.pd5.r');
        const totalTropyCount = Number($('div.main>.box.pd10>em>.text-strong')
            .text().replace('总', ''));
        const receivedTropyCount = data.length;

        // 悬浮内容设置
        const trophyGetTimeTooltip = {
            pointFormat: '{series.name}<b>{point.y}</b>个奖杯',
        };
        // 日期格式设置
        const trophyGetTimeXaxis = {
            type: 'datetime',
            dateTimeLabelFormats: {
                second: '%Y-%m-%d<br/>%H:%M:%S',
                minute: '%Y-%m-%d<br/>%H:%M',
                hour: '%Y-%m-%d<br/>%H:%M',
                day: '%Y<br/>%m-%d',
                week: '%Y<br/>%m-%d',
                month: '%Y-%m',
                year: '%Y',
            },
            title: {
                display: false,
            },
        };
        // 绘图数据
        const trophyGetTimeSeries = [
            {
                name: '第',
                data: data,
                showInLegend: false,
            },
        ];
        // 标题设置
        const trophyGetRatio = ((receivedTropyCount / totalTropyCount) * 100).toFixed(2);
        const trophyGetTimeTitleText = `奖杯获得时间（完成率：${trophyGetRatio}%）`;
        const trophyGetTimeTitle = {
            text: trophyGetTimeTitleText,
            style: {
                color: '#808080',
            },
        };
        const trophyGetTimeSubtitle = {
            text: $('div.ml100>p').eq(0).text(), // 游戏名称
        }
        // Y轴设置
        const trophyGetTimeYAxis = {
            title: {
                text: '获得个数',
            },
            min: 0,
            max: totalTropyCount,
            endOnTick: false,
            tickInterval: Math.floor(totalTropyCount / 4),
        };
        // 绘图设置
        const trophyGetTimeChart = {
            backgroundColor: 'rgba(0,0,0,0)',
            type: 'area',
        };
        // 图形设置
        const trophyGetTimePlotOptions = {
            areaspline: {
                fillOpacity: 0.5
            }
        };
        // Credits设置
        const trophyGetTimeCreditsText = []
        $('div.main>.box.pd10>em:eq(0)>span').map((i, el) => {
            trophyGetTimeCreditsText.push($(el).text());
        })
        const trophyGetTimeCredits = {
            text: trophyGetTimeCreditsText.join(' '),
            href: undefined,
        }
        const trophyGetTime = {
            chart: trophyGetTimeChart,
            tooltip: trophyGetTimeTooltip,
            xAxis: trophyGetTimeXaxis,
            yAxis: trophyGetTimeYAxis,
            title: trophyGetTimeTitle,
            subtitle: trophyGetTimeSubtitle,
            series: trophyGetTimeSeries,
            plotOptions: trophyGetTimePlotOptions,
            credits: trophyGetTimeCredits,
        };
        // 插入页面
        $('.box.pd10').append(
            `<div id="trophyGetTimeChart" align="left"></div>`
        );
        $('#trophyGetTimeChart').highcharts(trophyGetTime);


        // 功能3-3：汇总以获得和未获得奖杯
        var tropyTitleStyle =
            'border-radius: 2px; padding:5px; background-color:' +
            $('li.current').css('background-color') +
            ';';
        // tippy弹出框的样式
        GM_addStyle(
            `.tippy-tooltip.psnine-theme {background-color: ` +
            $('.box').css('background-color') +
            `}`
        );
        // 奖杯tips颜色
        var tipColor = '';
        // 创建奖杯汇总框架函数
        function createTropyContainer(object, className, title) {
            // 添加标题框在汇总图下
            $('.box.pd10').append(
                `<div class='${className}'><p class='tropyCount' style='${tropyTitleStyle}'></p><div class='tropyContainer' style='padding:5px;'></div></div>`
            );
            object.map(function (i, v) {
                // 如果这个奖杯有Tips，就设置左边框为绿色，否则就为底色（边框颜色和底色一致）
                if (
                    $(this).parent().parent().next().find('.alert-success.pd5')
                        .length > 0
                ) {
                    tipColor = '#8cc14c';
                } else {
                    tipColor = $('.box').css('background-color');
                }
                // 添加奖杯图标
                $(`.${className}> .tropyContainer`).append(
                    `<span id='${className}Small${i}' style='padding:3px; border-left: 3px solid ${tipColor};'><a href='` +
                    $(this).parent().attr('href') +
                    `'><img src='` +
                    $(this).attr('src') +
                    `' width='30px'></img><a></span>`
                );
                // 添加鼠标悬浮弹出消息
                tippy(`#${className}Small${i}`, {
                    content: '<td>' +
                        $(this).parent().parent().html() +
                        '</td><p></p><td>' +
                        $(this).parent().parent().next().html() +
                        '</td>',
                    theme: 'psnine',
                    animateFill: false,
                });
            });
            // 给奖杯汇总标题填充文字
            var summaryTropyDict = {
                '.t1': ['text-platinum', '白'],
                '.t2': ['text-gold', '金'],
                '.t3': ['text-silver', '银'],
                '.t4': ['text-bronze', '铜'],
            };
            var tropySubText = ""
            for (var i in summaryTropyDict) {
                tropySubText += `<span class=${summaryTropyDict[i][0]}> ${summaryTropyDict[i][1]}${object.parent().parent(i).length}</span>`
            }
            $(`.${className}> .tropyCount`).append(
                `<span style='color:#808080;'>${title}：${tropySubText}<span class='text-strong'> 总${object.length}</span></span>`
            );
        }
        // 创建已获得奖杯汇总框
        createTropyContainer($('.imgbg.earned'), 'earnedTropy', '已获得奖杯');
        // 创建未获得奖杯汇总框
        createTropyContainer($("img[class$='imgbg']"), 'notEarnedTropy', '未获得奖杯');
        $('span[id^="notEarnedTropySmall"] > a > img').css({
            filter: 'grayscale(100%)',
        }); // 变黑白
        // 折叠奖杯汇总
        // 奖杯图标设置为不可见
        if (settings.foldTropySummary) {
            $('.tropyContainer').css('display', 'none');
        }
        // 单击奖杯汇总标题后展开奖杯图标
        $('.tropyCount').click(function () {
            $(this).next().slideToggle();
        });

        // 功能3-3：追加奖杯筛选功能
        $('.dropmenu').append('<li><em>筛选</em></li>'); // 追加“筛选”字样
        // 追加“未获得”的按钮
        $('.dropmenu').append("<a id='selectUnget'>尚未获得</a>");
        // 点击按钮隐藏或者显示
        var clickHideShowNum = 0;
        $('#selectUnget').click(function () {
            $('.lh180.alert-success.pd5.r')
                .parent()
                .parent()
                .toggle('slow', function () {
                    if (clickHideShowNum++ % 2 == 0) {
                        $('#selectUnget').text('显示全部');
                        $('#selectUnget').css({ 'background-color': '#E7EBEE', 'color': '#99A1A7' });
                    } else {
                        $('#selectUnget').text('尚未获得');
                        $('#selectUnget').css({ 'background-color': '#3498db', 'color': '#FFFFFF' });
                    }
                });
        });
    }

    /*
    * 功能：降低没有白金的游戏的图标亮度
    * @param  alpha  无白金游戏图标透明度
    */
    const filterNonePlatinum = (alpha) => {
        if (alpha < 1) {
            $('tr').map((i, el) => {
                // 读取白金数量
                const platinumNum = $(el)
                    .find('.pd1015.title.lh180 > em > .text-platinum').eq(0)
                    .text().replace('白', '');
                if (platinumNum === '0') {
                    $(el).find('.pdd15 > a > img').eq(0)
                        .css({ opacity: alpha });
                }
            });
        }
    };

    /*
    * 通过Ajax获取自己的该游戏页面的奖杯数目
    * @param  url  Ajax获取目标地址
    * @param  tip  Tippy对象
    */
    const getTropyContentByAjax = (url, tip) => {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'html',
            success: (data) => {
                const reg = /[\s\S]*<\/body>/g;
                const html = reg.exec(data)[0];
                const inner = $(html).find('td>em>.text-strong');
                tip.setContent(inner.length > 0
                    ? `你的奖杯完成度：${inner.text()}`
                    : '你还没有获得该游戏的任何奖杯'
                );
            },
            error: () => {
                tip.setContent('无法获取页面信息');
            },
        })
    }

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
            successFunction(url, tip);
        } catch (e) {
            tip.setContent(`获取失败：${e}`);
        } finally {
            tip.state.ajax.isFetching = false;
        }
    }

    /*
    * 功能：悬浮图标显示自己的游戏的完成度
    */
    const getMyCompletion = () => {
        $('.imgbgnb').map((i, el) => {
            $(el).attr('id', 'game' + i);
            // 从cookie中取出psnid
            const psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/);
            if (psnidCookie) {
                const psnid = psnidCookie[1];
                let myGameUrl = $(el).parent().attr('href');
                if (myGameUrl !== undefined) {
                    myGameUrl += `?psnid=${psnid}`;
                    tippy(`#game${i}`, {
                        content: '加载中...',
                        animateFill: false,
                        placement: 'left',
                        delay: 500,
                        async onShow(tip) {
                            tippyOnShow(myGameUrl, tip, getTropyContentByAjax);
                        },
                        onHidden(tip) {
                            tip.state.ajax.canFetch = true;
                            tip.setContent('加载中...');
                        },
                    });
                }
            }
        });
    }

    // 游戏页面优化
    if (
        /psngame/.test(window.location.href) & !/psnid/.test(window.location.href)
    ) {
        // 降低没有白金的游戏的图标亮度
        filterNonePlatinum(settings.filterNonePlatinumAlpha);
        // 悬浮图标显示自己的游戏的完成度
        getMyCompletion();
    }

    // 约战页面可以选择去掉发起人头像
    if (settings.removeHeaderInBattle) {
        if (/battle$/.test(window.location.href)) {
            $('.pdd15.h-p').hide();
        }
    }

    // 进入游戏页默认查看我自己的奖杯
    if (
        window.location.href.match(/psngame\/\d+$/) &&
        !/psnid/.test(window.location.href)
    ) {
        //检查游戏页
        var psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/); //从cookie中取出psnid
        if (psnidCookie) {
            var psnid = psnidCookie[1];
            window.location.href += `?psnid=${psnid}`;
        }
    }

    // 奖杯心得页面输入框可缩放大小
    if (window.location.href.match(/trophy\/\d+$/)) {
        $('#comment').css({
            resize: 'vertical',
            minHeight: 200,
        });
    }

    // 右上角头像下拉框中增加插件设定按钮
    if (window.localStorage) {
        // 如果支持localstorage
        var newSettings = JSON.parse(JSON.stringify(settings));
        $('.header .dropdown ul').append(`
<li><a href="javascript:void(0);" id="psnine-enhanced-version-opensetting">插件设置</a></li>
`);
        $('body').append(`
<style>.setting-panel-box{z-index:9999;background-color:#fff;transition:all .4s ease;position:fixed;left:50%;transform:translateX(-50%);top:-5000px;width:500px;box-shadow:0 0 20px rgba(0,0,0,0.3);padding:10px 0;box-sizing:border-box;border-radius:4px;max-height:700px;overflow-y:scroll;scrollbar-color:#dcdcdc #fff;scrollbar-width:thin}.setting-panel-box::-webkit-scrollbar{width:4px;background-color:#fff}.setting-panel-box::-webkit-scrollbar-button{display:none}.setting-panel-box::-webkit-scrollbar-thumb{background-color:#dcdcdc}.setting-panel-box.show{top:20px}.setting-panel-box h2{margin-bottom:10px;padding-left:20px}.setting-panel-box h4{margin-bottom:10px;padding-left:20px;font-weight:400;color:#1f2f3d;font-size:22px}.setting-panel-box .row{display:flex;align-items:center;justify-content:flex-start;width:100%;margin-bottom:5px;padding-left:20px;box-sizing:border-box}.setting-panel-box .row label{line-height:32px;text-align:left;font-size:14px;color:#606266;width:190px}.setting-panel-box .row .mini{line-height:26px;text-align:left;font-size:14px;color:#606266;margin:0 10px 0 0;width:50px}.setting-panel-box .row .normal{line-height:26px;text-align:left;font-size:14px;color:#606266;margin:0 10px 0 0;width:205px}.setting-panel-box .row textarea{resize:vertical;min-height:30px;border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;line-height:26px;box-sizing:border-box;width:227px;padding:0 10px}.setting-panel-box .row input{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:227px;padding:0 10px}.setting-panel-box .row input#filterNonePlatinum{height:6px;background-color:#e4e7ed;margin:16px 0;border-radius:3px;position:relative;cursor:pointer;vertical-align:middle;outline:none;padding:0}.setting-panel-box .row input#filterNonePlatinum::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border:2px solid #409eff;background-color:#fff;border-radius:50%;transition:.2s;user-select:none}.setting-panel-box .row input#filterNonePlatinum::-moz-range-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border:2px solid #409eff;background-color:#fff;border-radius:50%;transition:.2s;user-select:none}.setting-panel-box .row #filterNonePlatinumValue{margin-left:5px}.setting-panel-box .row select{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:227px;padding:0 10px}.setting-panel-box .row span{line-height:32px;text-align:left;font-size:14px;color:#606266;margin-right:10px}.setting-panel-box .btnbox{display:flex;align-items:center;justify-content:center}.setting-panel-box button{-webkit-appearance:button;padding:9px 15px;font-size:12px;border-radius:3px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #dcdfe6;color:#606266;text-align:center;box-sizing:border-box;outline:0;margin:0;transition:.1s;font-weight:500;margin:0 10px}.setting-panel-box button:hover{color:#409eff;border-color:#c6e2ff;background-color:#ecf5ff}.setting-panel-box button.confirm{color:#fff;background-color:#3890ff}.setting-panel-box button.confirm:hover{background-color:#9ec9ff}</style>
<div class=setting-panel-box><h2>PSN中文网功能增强插件设置</h2><div class=row><a href=https://github.com/swsoyee/psnine-enhanced-version><img src=https://img.shields.io/github/stars/swsoyee/psnine-enhanced-version.svg?style=social></img></a></div><div class=row><label>夜间模式</label><select id=nightMode><option value=true>启用<option value=false>关闭</select></div><div class=row><label>导航增加新闻入口</label><select id=addNews><option value=true>启用<option value=false>关闭</select></div><div class=row><label>高亮用户ID</label><textarea name="" id="highlightSpecificID" cols="30" rows="2"></textarea></div><div class=row><label>黑名单ID</label><textarea name="" id="blockList" cols="30" rows="2"></textarea></div><div class=row><label>机因中显示被@的内容</label><select id=replyTraceback><option value=true>启用<option value=false>关闭</select></div><div class=row><label>悬浮显示刮刮卡内容</label><select id=hoverUnmark><option value=true>启用<option value=false>关闭</select></div><div class=row><label>个人主页下显示所有游戏</label><select id=autoPagingInHomepage><option value=true>启用<option value=false>关闭</select></div><div class=row><label>自动签到</label><select id=autoCheckIn><option value=true>启用<option value=false>关闭</select></div><div class=row><label>自动向后翻页数</label><input type=number class=normal id=autoPaging></div><div class=row><label>问答区标题着色</label><select id=qaHighlightTitle><option value=true>启用<option value=false>关闭</select></div><div class=row><label>悬浮头像显示个人信息</label><select id=hoverHomepage><option value=true>启用<option value=false>关闭</select></div><div class=row><label>奖杯默认折叠</label><select id=foldTropySummary><option value=true>启用<option value=false>关闭</select></div><div class=row><label>约战页面去掉发起人头像</label><select id=removeHeaderInBattle><option value=true>启用<option value=false>关闭</select></div><div class=row><label>无白金游戏图标透明度</label><input id=filterNonePlatinum type=range min=0 max=1 step=0.1><span id=filterNonePlatinumValue></span></div><div class=row><label>汇率</label><span>港币</span><input type=number class=mini name="" id=dollarHKRatio><span>美元</span><input type=number class=mini name="" id=dollarRatio></div><div class=row><label></label><span>英镑</span><input type=number class=mini name="" id=poundRatio><span>日元</span><input type=number class=mini name="" id=yenRatio></div><div class=btnbox><button class=confirm>确定</button><button class=cancel>取消</button></div></div>
`);

        // 点击打开设置面板
        $('#psnine-enhanced-version-opensetting').on('click', function () {
            $('.setting-panel-box').addClass('show');
            tippy('#highlightSpecificID', {
                content: 'ID以英文逗号隔开，不区分大小写',
                zIndex: 10000,
            });
            tippy('#blockList', {
                content: 'ID以英文逗号隔开，不区分大小写',
                zIndex: 10000,
            });
            var switchSettings = [
                'hoverUnmark',
                'replyTraceback',
                'nightMode',
                'foldTropySummary',
                'addNews',
                'qaHighlightTitle',
                'hoverHomepage',
                'autoPagingInHomepage',
                'removeHeaderInBattle',
                'autoCheckIn',
            ]; // 只有true / false的设置项
            var self = this;
            switchSettings.map((name, i) => {
                if (newSettings[name]) {
                    $(`#${name} option:nth-child(1)`).attr('selected', 'true');
                } else {
                    $(`#${name} option:nth-child(2)`).attr('selected', 'true');
                }
                $(`#${name}`).change(function () {
                    newSettings[name] = JSON.parse(
                        $(this).children('option:selected').val()
                    );
                });
            });

            // 降低无白金透明度设置
            $('#filterNonePlatinum').val(newSettings.filterNonePlatinumAlpha);
            $('#filterNonePlatinumValue').html(
                newSettings.filterNonePlatinumAlpha * 100 + '%'
            );
            $('#filterNonePlatinum').on('input', function () {
                var value = $('#filterNonePlatinum').val();
                $('#filterNonePlatinumValue').html(value * 100 + '%');
                newSettings.filterNonePlatinumAlpha = value;
            });

            // 高亮用户
            var highlightSpecificIDText = newSettings.highlightSpecificID.length
                ? newSettings.highlightSpecificID.join(',')
                : '';
            $('#highlightSpecificID').val(highlightSpecificIDText);
            // 黑名单
            var blockListText = newSettings.blockList.length
                ? newSettings.blockList.join(',')
                : '';
            $('#blockList').val(blockListText);
            // 汇率
            $('#dollarHKRatio').val(newSettings.dollarHKRatio);
            $('#dollarRatio').val(newSettings.dollarRatio);
            $('#poundRatio').val(newSettings.poundRatio);
            $('#yenRatio').val(newSettings.yenRatio);
            // 自动翻页页数
            $('#autoPaging').val(newSettings.autoPaging);
            console.log(newSettings.autoPaging);
        });
        // 点击取消
        $('.setting-panel-box .btnbox .cancel').on('click', function () {
            $('.setting-panel-box').removeClass('show');
        });
        // 点击确定
        $('.setting-panel-box .btnbox .confirm').on('click', function () {
            var highlightSpecificIDText = $.trim(
                $('#highlightSpecificID').val().replace('，', ',')
            )
                .replace(/,$/, '')
                .replace(/^,/, '');
            if (highlightSpecificIDText) {
                newSettings.highlightSpecificID = highlightSpecificIDText.split(',');
            } else {
                newSettings.highlightSpecificID = [];
            }
            var blockListText = $.trim($('#blockList').val().replace('，', ','))
                .replace(/,$/, '')
                .replace(/^,/, '');
            if (blockListText) {
                newSettings.blockList = blockListText.split(',');
            } else {
                newSettings.blockList = [];
            }
            newSettings.filterNonePlatinumAlpha = $('#filterNonePlatinum').val();
            newSettings.dollarHKRatio = $('#dollarHKRatio').val();
            newSettings.dollarRatio = $('#dollarRatio').val();
            newSettings.poundRatio = $('#poundRatio').val();
            newSettings.yenRatio = $('#yenRatio').val();
            newSettings.autoPaging = $('#autoPaging').val();
            $('.setting-panel-box').removeClass('show');
            localStorage['psnine-night-mode-CSS-settings'] = JSON.stringify(
                newSettings
            );
            window.location.reload();
        });
    }
})();
