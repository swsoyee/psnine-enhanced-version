// ==UserScript==
// @name         PSN中文网功能增强
// @namespace    https://swsoyee.github.io
// @version      0.9.48
// @description  数折价格走势图，显示人民币价格，奖杯统计和筛选，发帖字数统计和即时预览，楼主高亮，自动翻页，屏蔽黑名单用户发言，被@用户的发言内容显示等多项功能优化P9体验
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAMFBMVEVHcEw0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNs0mNuEOyNSAAAAD3RSTlMAQMAQ4PCApCBQcDBg0JD74B98AAABN0lEQVRIx+2WQRaDIAxECSACWLn/bdsCIkNQ2XXT2bTyHEx+glGIv4STU3KNRccp6dNh4qTM4VDLrGVRxbLGaa3ZQSVQulVJl5JFlh3cLdNyk/xe2IXz4DqYLhZ4mWtHd4/SLY/QQwKmWmGcmUfHb4O1mu8BIPGw4Hg1TEvySQGWoBcItgxndmsbhtJd6baukIKnt525W4anygNECVc1UD8uVbRNbumZNl6UmkagHeRJfX0BdM5NXgA+ZKESpiJ9tRFftZEvue2cS6cKOrGk/IOLTLUcaXuZHrZDq3FB2IonOBCHIy8Bs1Zzo1MxVH+m8fQ+nFeCQM3MWwEsWsy8e8Di7meA5Bb5MDYCt4SnUbP3lv1xOuWuOi3j5kJ5tPiZKahbi54anNRaaG7YElFKQBHR/9PjN3oD6fkt9WKF9rgAAAAASUVORK5CYII=
// @author       InfinityLoop, mordom0404, Nathaniel_Wu, JayusTree
// @include      *psnine.com/*
// @include      *d7vg.com/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      https://code.highcharts.com/highcharts.js
// @require      https://code.highcharts.com/modules/histogram-bellcurve.js
// @require      https://unpkg.com/tippy.js@3/dist/tippy.all.min.js
// @license      MIT
// @supportURL   https://github.com/swsoyee/psnine-night-mode-CSS/issues/new
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    var settings = {
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
        highlightSpecificID: ['mechille', 'sai8808', 'jimmyleo', 'jimmyleohk', 'monica_zjl', 'yinssk'], // 需要高亮的ID数组
        highlightSpecificBack: '#d9534f', // 高亮背景色
        highlightSpecificFront: '#ffffff', // 高亮字体颜色
        // 功能1-6设置：屏蔽黑名单中的用户发言内容
        blockList: [], // 请在左侧输入用户ID，用逗号进行分割，如： ['use_a', 'user_b', 'user_c'] 以此类推
        // 屏蔽词,
        blockWordsList: [],
        // 问答页面状态UI优化
        newQaStatus: true,
        // 功能1-11设置：鼠标悬浮于头像显示个人奖杯卡
        hoverHomepage: true,
        // 功能4-3设置：汇总以获得和未获得奖杯是否默认折叠
        foldTrophySummary: false, // true则默认折叠，false则默认展开
        // 功能5-1设置：是否在`游戏`页面启用降低无白金游戏的图标透明度
        filterNonePlatinumAlpha: 0.2, // 透密 [0, 1] 不透明，如果设置为1则关闭该功能
        // 设置热门标签阈值
        hotTagThreshold: 20,
        // 夜间模式
        nightMode: false,
        // 自动夜间模式
        autoNightMode: {
            value: "SYSTEM",
            enum: ["SYSTEM", "TIME", "OFF"]// options in settings panel have to be in the same order
        },
        // 约战页面去掉发起人头像
        removeHeaderInBattle: false,
        // 机因、问答页面按最新排序
        listPostsByNew: false,
        // 载入全部问答答案
        showAllQAAnswers: false,
        // 答案按时间顺序排列
        listQAAnswersByOld: false,
        // 答案显示隐藏回复
        showHiddenQASubReply: false,
    };
    if (window.localStorage) {
        if (window.localStorage['psnine-night-mode-CSS-settings']) {
            let localSettings = JSON.parse(window.localStorage['psnine-night-mode-CSS-settings']);
            let settingTypeUpdated = false;
            Object.keys(settings).forEach((key) => {
                if (typeof settings[key] !== typeof localSettings[key]) {
                    localSettings[key] = settings[key];
                    settingTypeUpdated = true;
                }
            });
            $.extend(settings, localSettings); //用storage中的配置项覆盖默认设置
            if (settingTypeUpdated)
                localStorage['psnine-night-mode-CSS-settings'] = JSON.stringify(localSettings);
        }
    } else {
        console.log('浏览器不支持localStorage,使用默认配置项');
    }

    onDocumentStart();
    if (document.readyState == "loading")
        document.addEventListener("DOMContentLoaded", onDOMContentReady);
    else
        onDOMContentReady();

    // 全局优化
    function onDocumentStart() { // run before anything is downloaded
        // 机因、问答页面按最新排序
        if (settings.listPostsByNew && /\/((gene)|(qa))($|(\/$))/.test(window.location.href)) {
            window.location.href += '?ob=date';
        }
        // 功能0-2：夜间模式
        const toggleNightMode = () => {
            if (settings.nightMode) {
                let node = document.createElement("style");
                node.id = "nightModeStyle";
                node.type = "text/css";
                node.appendChild(document.createTextNode(`
                    li[style="background:#f5faec"]{background:#344836!important}li[style="background:#fdf7f7"]{background:#4f3945!important}li[style="background:#faf8f0"]{background:#4e4c39!important}li[style="background:#f4f8fa"]{background:#505050!important}span[style="color:blue;"]{color:#64a5ff!important}span[style="color:red;"],span[style="color:#a10000"]{color:#ff6464!important}span[style="color:brown;"]{color:#ff8864!important}.tit3{color:white!important}.mark{background:#bbb!important;color:#bbb}body.bg{background:#2b2b2b!important}.list li,.box .post,td,th{border-bottom:1px solid #333}.psnnode{background:#656565}.box{background:#3d3d3d!important}.title a{color:#bbb}.text-strong,strong,.storeinfo,.content{color:#bbb!important}.alert-warning,.alert-error,.alert-success,.alert-info{background:#4b4b4b!important}h1,.title2{color:#fff!important}.twoge{color:#fff!important}.inav{background:#3d3d3d!important}.inav li.current{background:#4b4b4b!important}.ml100 p{color:#fff!important}.t1{background:#657caf!important}.t2{background:#845e2f!important}.t3{background:#707070!important}.t4{background:#8b4d2d!important}blockquote{background:#bababa!important}.text-gray{color:#bbb!important}.tradelist li{color:white!important}.tbl{background:#3c3c3c!important}.genelist li:hover,.touchclick:hover{background:#333!important}.showbar{background:radial-gradient(at center top,#7b8492,#3c3c3c)}.darklist,.cloud{background-color:#3c3c3c}.side .hd3,.header,.dropdown ul{background-color:#222}.list li .sonlist li{background-color:#333}.node{background-color:#3b4861}.rep{background-color:#3b4861}.btn-gray{background-color:#666}`
                ));
                let heads = document.getElementsByTagName("head");
                if (heads.length > 0)
                    heads[0].appendChild(node);
                else // no head yet, stick it whereever
                    document.documentElement.appendChild(node);
            } else
                $('#nightModeStyle').remove();
        }
        const setNightMode = isOn => {
            settings.nightMode = isOn;
            toggleNightMode();
        }
        switch (settings.autoNightMode.value) {
            case "SYSTEM":
                if (window.matchMedia) {// if the browser/os supports system-level color scheme
                    setNightMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
                    let darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    if (darkThemeQuery.addEventListener)
                        darkThemeQuery.addEventListener('change', e => setNightMode(e.matches));
                    else
                        darkThemeQuery.addListener(e => setNightMode(e.matches)); // deprecated
                    break;
                }
            case "TIME":
                let hour = (new Date()).getHours();
                setNightMode(hour > 18 || hour < 7);// TODO: time selector in settings panel
                break;
            default:
                toggleNightMode();
        }
    }

    function onDOMContentReady() { // run when DOM is loaded
        Highcharts.setOptions({
            lang: {
                contextButtonTitle: '图表导出菜单',
                decimalPoint: '.',
                downloadJPEG: '下载JPEG图片',
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
        // 暴力猴中已经删掉了GM_addStyle函数，因此需要自己定义
        function GM_addStyle(css) {
            const style = document.getElementById("GM_addStyleBy8626") || (function () {
                const style = document.createElement('style');
                style.type = 'text/css';
                style.id = "GM_addStyleBy8626";
                document.head.appendChild(style);
                return style;
            })();
            const sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        }
        // 增加图标
        GM_addStyle(`
            .fa-check-circle {
                width: 15px; height: 15px;
                float: left;
                margin-top: 3px;
                margin-right: 3px;
                background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23659f13" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>') no-repeat center;
            }`
        );
        GM_addStyle(`
            .fa-question-circle {
                width: 15px; height: 15px;
                float: left;
                margin-top: 3px;
                margin-right: 3px;
                background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="question-circle" class="svg-inline--fa fa-question-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23c09853" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg>') no-repeat center;
            }`
        );
        GM_addStyle(`
            .fa-comments {
                width: 15px; height: 15px;
                float: left;
                margin-top: 3px;
                margin-right: 3px;
                background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comments" class="svg-inline--fa fa-comments fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="%233a87ad" d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"></path></svg>') no-repeat center;
            }`
        );
        GM_addStyle(`
            .fa-coins {
                width: 15px; height: 15px;
                float: left;
                background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="coins" class="svg-inline--fa fa-coins fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23bf6a3a" d="M0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zM320 128c106 0 192-28.7 192-64S426 0 320 0 128 28.7 128 64s86 64 192 64zM0 300.4V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4zm416 11c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5v63.6zM192 160C86 160 0 195.8 0 240s86 80 192 80 192-35.8 192-80-86-80-192-80zm219.3 56.3c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2z"></path></svg>') no-repeat center;
            }`
        );
        /*
         * 页面右下角追加点击跳转到页面底部按钮
         */
        const toPageBottom = () => {
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

        // 功能0-2：夜间模式
        let nightModeStyle = document.getElementById('nightModeStyle');
        if (nightModeStyle)
            document.head.appendChild(nightModeStyle);// ensures that night mode css is after native psnine css

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

        showMarkMessage(settings.hoverUnmark);

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

        GM_addStyle(
            `#loadingMessage {
                position : absolute;
                bottom   : 0px;
                position : fixed;
                right    : 1px !important;
                display  : none;
                color    : white;
            }`
        );

        /*
         * 功能：自动翻页
         * @param  pagingSetting  自动翻页的页数
         */
        const autoPaging = (pagingSetting) => {
            if (pagingSetting > 0) {
                let isbool = true; //触发开关，防止多次调用事件
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
                                const $response = $('<div />').html(data);
                                $(`.loadPage${nextPage}`)
                                    .append($response.find('.list'))
                                    .append($response.find('.page'));
                                isbool = true;
                                autoPagingLimitCount++;
                                // 各个页面的功能追加
                                if (/\/qa/.test(window.location.href)) {
                                    changeQaStatus(settings.newQaStatus);
                                }
                                addHighlightOnID();
                                filterUserPost();
                                addHoverProfile();
                                addHotTag();
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
            let isbool2 = true; //触发开关，防止多次调用事件
            // 插入加载提示信息
            $('body').append("<div id='loadingMessage'/>");
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

        /*
         * AJAX获取页面
         */
        const fetchOtherPage = (url, successFunction) => {
            let resultSet;
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'html',
                async: false,
                success: function (data, status) {
                    if (status == "success") {
                        resultSet = successFunction(data);
                    }
                },
                error: () => {
                    console.log('无法获取页面信息');
                },
            })
            return resultSet;
        }

        const getEarnedTrophiesInfo = (data) => {
            const reg = /[\s\S]*<\/body>/g;
            const html = reg.exec(data)[0];
            let resultSet = [];
            $(html).find('tbody>tr[id]').find('.imgbg.earned').parent().parent().parent().map((index, el) => {
                const earnedTime = $(el).find('em.lh180.alert-success.pd5.r');
                const earnedTimeCopy = earnedTime.clone();
                earnedTimeCopy.find("br").replaceWith(" ");
                resultSet.push({
                    trophy: $(el).find('a').attr('href'),
                    earned: earnedTime.attr('tips').trim() + ' ' + earnedTimeCopy.text().trim(),
                });
            })
            return resultSet;
        };

        // 在攻略页面增加自己奖杯的获得状况
        const psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/);
        if (/topic\//.test(window.location.href) && psnidCookie) {
            let games = {};
            $('.imgbgnb').parent().map((index, el) => {
                const href = $(el).attr('href');
                const gameId = href.slice(href.lastIndexOf('/') + 1, -3);
                // 根据具体游戏获取对应自己页面的信息
                if (!games.hasOwnProperty(gameId)) {
                    const gamePageUrl = document.URL.match(/^.+?\.com/)[0] + '/psngame/' + gameId + '?psnid=' + psnidCookie[1];
                    const resultSet = fetchOtherPage(gamePageUrl, getEarnedTrophiesInfo);
                    games[gameId] = resultSet;
                }
                games[gameId].map(element => {
                    if (element.trophy === $(el).attr('href')) {
                        $(el).next().find('a').slice(0, 1).append(`<div class="fa-check-circle"></div>&nbsp;<em class="alert-success pd5" style="border-radius: 3px;">${element.earned}</em>`);
                    }
                })
            })
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

        /*
         * 功能：根据纯文本的长度截断DOM
         * @param elem 需要截断的DOM
         * @param length 需要保留的纯文本长度
         * @return 截断后的 html 文本
         */
        const truncateHtml = (elem, length) => {
            // 递归获取 DOM 里的纯文本
            const truncateElem = (elem, reqCount) => {
                let grabText = '', missCount = reqCount;
                $(elem).contents().each(function () {
                    switch (this.nodeType) {
                        case Node.TEXT_NODE:
                            // Get node text, limited to missCount.
                            grabText += this.data.substr(0, missCount);
                            missCount -= Math.min(this.data.length, missCount);
                            break;
                        case Node.ELEMENT_NODE:
                            // Explore current child:
                            var childPart = truncateElem(this, missCount);
                            grabText += childPart.text;
                            missCount -= childPart.count;
                            break;
                    }
                    if (missCount === 0) {
                        // We got text enough, stop looping.
                        return false;
                    }
                });
                return {
                    text:
                        // Wrap text using current elem tag.
                        elem.outerHTML.match(/^<[^>]+>/m)[0]
                        + grabText
                        + '</' + elem.localName + '>',
                    count: reqCount - missCount,
                };
            };
            return truncateElem(elem, length).text;
        }
        /*
         * 功能：回复内容回溯，仅支持机因、主题
         * @param  isOn  是否开启功能
         */
        const showReplyContent = (isOn) => {
            if (isOn) {
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
                        overflow-wrap: break-word;
                    }`
                );
                // 每一层楼的回复框
                const allSource = $('.post .ml64 > .content');
                // 每一层楼的回复者用户名
                const userId = $('.post > .ml64 > [class$=meta]');
                // 每一层的头像
                const avator = $('.post > a.l');
                for (let floor = allSource.length - 1; floor > 0; floor--) {
                    // 层内内容里包含链接（B的发言中是否有A）
                    const content = allSource.eq(floor).find('a');
                    if (content.length > 0) {
                        for (let userNum = 0; userNum < content.length; userNum++) {
                            // 对每一个链接的文本内容判断
                            const linkContent = content.eq(userNum).text().match('@(.+)');
                            // 链接里是@用户生成的链接， linkContent为用户名（B的发言中有A）
                            if (linkContent !== null) {
                                // 从本层的上一层开始，回溯所@的用户的最近回复（找最近的一条A的发言）
                                let traceIdFirst = -1;
                                let traceIdTrue = -1;
                                for (let traceId = floor - 1; traceId >= 0; traceId--) {
                                    // 如果回溯到了的话，选取内容
                                    // 回溯层用户名
                                    const thisUserID = userId.eq(traceId).find('.psnnode:eq(0)').text();
                                    if (thisUserID.toLowerCase() === linkContent[1].toLowerCase()) {
                                        // 判断回溯中的@（A的发言中有是否有B）
                                        if (
                                            allSource.eq(traceId).text() === userId.eq(floor).find('.psnnode:eq(0)').text()
                                        ) {
                                            traceIdTrue = traceId;
                                            break;
                                        } else if (traceIdFirst == -1) {
                                            traceIdFirst = traceId;
                                        }
                                    }
                                }
                                let outputID = -1;
                                if (traceIdTrue !== -1) {
                                    outputID = traceIdTrue;
                                } else if (traceIdFirst != -1) {
                                    outputID = traceIdFirst;
                                }
                                // 输出
                                if (outputID !== -1) {
                                    const replyContentObject = allSource.eq(outputID).clone();
                                    const replyContentPlainText = replyContentObject.text();
                                    replyContentObject.find('.mark').text(function (index, text) {
                                        return `<span class="mark">${text}</span>`;
                                    });
                                    const replyContentText = replyContentObject.text();
                                    let replyContentTruncatedText = $(truncateHtml($('<p></p>').html(replyContentText)[0], 45)).html();
                                    if (replyContentPlainText.length > 45) {
                                        replyContentTruncatedText += '......';
                                    }
                                    const avatorImg = avator.eq(outputID).find('img:eq(0)').attr('src');
                                    allSource.eq(floor).before(`
                                        <div class=replyTraceback>
                                            <span class="badge">
                                                <img src="${avatorImg}" height="15" width="15" style="margin-right: 5px; border-radius: 8px;vertical-align:sub;"/>
                                                    ${linkContent[1]}
                                            </span>
                                            <span class="responserContent_${floor}_${outputID}" style="padding-left: 10px;">
                                                ${replyContentTruncatedText}
                                            </span>
                                        </div>`);
                                    // 如果内容超过45个字符，则增加悬浮显示全文内容功能
                                    replyContentPlainText.length > 45
                                        ? tippy(`.responserContent_${floor}_${outputID}`, {
                                            content: replyContentText,
                                            animateFill: false,
                                            maxWidth: '500px',
                                        })
                                        : null;
                                }
                            }
                        }
                    }
                }
            }
        }

        /*
         * 功能：增加帖子楼层信息
         */
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

        /*
         * 功能：热门帖子增加 热门 标签
         */
        const addHotTag = () => {
            $('div.meta').map((index, element) => {
                const replyCount = $(element).text().split(/(\d+)/);
                if (Number(replyCount[replyCount.length - 2]) > settings.hotTagThreshold
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
        addHotTag();

        /*
         * 功能：层内逆序显示
         * @param  isOn  是否开启该功能
         */
        const reverseSubReply = (isOn) => {
            if (!isOn || !/(\/trophy\/\d+)|(\/psngame\/\d+\/comment)|(\/psnid\/.+?\/comment)/.test(window.location.href))
                return;
            $('div.btn.btn-white.font12').click();
            const blocks = $('div.sonlistmark.ml64.mt10:not([style="display:none;"])');
            blocks.map((index, block) => {
                const reversedBlock = $($(block).find('li').get().reverse());
                $(block).find('.sonlist').remove();
                $(block).append('<ul class="sonlist">');
                reversedBlock.map((index, li) => {
                    if (index === 0) {
                        $(li).attr({ style: 'border-top:none;' });
                    } else {
                        $(li).attr({ style: '' });
                    }
                    $(block).find('.sonlist').append(li);
                })
            })
        }

        const enhanceQAPage = (loadAll, reverseOrder, allSubReply) => {
            if (!(loadAll || reverseOrder || allSubReply) || !/\/qa\/\d+($|(\/$))/.test(window.location.href))
                return;
            /*
             * 功能：答案按时间顺序排列
             * @param  isOn  是否开启该功能
             */
            const reverseAnwsers = (isOn) => {
                if (!isOn)
                    return;
                const answer_list = $('body > div.inner.mt40 > div.main > div.box.mt20 > ul.list');
                const answers = answer_list.find('> li');
                answers.remove();
                answers.get().reverse().forEach(answer => { answer_list.append(answer); });
            }

            /*
             * 功能：展开隐藏的二级回复
             * @param  isOn  是否开启该功能
             */
            const showHiddenSubReply = (isOn) => {
                if (isOn)
                    $('body > div.inner.mt40 > div.main > div.box.mt20 > ul.list div.btn.btn-white.font12').click();
            }

            /*
             * 功能：载入全部问答答案
             * @param  isOn  是否开启该功能
             */
            const showAllAnsers = (isOn, reverseOrder, allSubReply) => {
                if (!isOn)
                    return 0;
                const answer_list = $('body > div.inner.mt40 > div.main > div.box.mt20 > ul.list');
                const page_list = $('body > div.inner.mt40 > div.main > div.box.mt20 > div.page > ul');
                const last_page_url_element = page_list.find('> li:not(.current):not(.disabled.h-p) > a:last()');
                if (last_page_url_element.length == 0) {
                    page_list.remove();
                    return 0;
                }
                const last_page_url = last_page_url_element.get()[0].href;
                const last_page_number = Number(last_page_url.match(/\?page=\d+/)[0].replace('?page=', ''));
                let qa_pages_to_load = last_page_number - 1;
                let last_appended_page = 1;
                const qa_page_data = new Array(qa_pages_to_load);
                qa_page_data.fill(null);
                const load_qa_page = (page_number) => {
                    const append_answers = () => {
                        let latest_ready_page = last_appended_page;
                        for (let i = last_appended_page + 1; i <= last_page_number; i++) {
                            if (Boolean(qa_page_data[i - 2]))
                                latest_ready_page = i;
                            else
                                break;
                        }
                        if (latest_ready_page > last_appended_page) {
                            for (let i = last_appended_page + 1; i <= latest_ready_page; i++) {
                                qa_page_data[i - 2].find('div.inner.mt40 > div.main > div.box.mt20 > ul.list > li').each((index, answer) => {
                                    answer_list.append(answer);
                                });
                                qa_page_data[i - 2].remove();
                                qa_page_data[i - 2] = null;
                            }
                            last_appended_page = latest_ready_page;
                        }
                    }
                    let page_url = last_page_url.replace(last_page_number, page_number);
                    $.get(
                        page_url,
                        { retryLimit: 3 },
                        (data) => {
                            qa_page_data[page_number - 2] = $('<div />').html(data);
                            append_answers();
                            if ((--qa_pages_to_load) == 0) { //在载入全部答案之后运行
                                reverseAnwsers(reverseOrder);
                                showHiddenSubReply(allSubReply);
                                page_list.remove();
                            }
                        },
                        'html'
                    );
                };

                for (let i = 2; i <= last_page_number; i++)
                    load_qa_page(i);
                return last_page_number - 1;
            }

            if (showAllAnsers(loadAll, reverseOrder, allSubReply) == 0) {
                reverseAnwsers(reverseOrder);
                showHiddenSubReply(allSubReply);
            }
        }

        enhanceQAPage(settings.showAllQAAnswers, settings.listQAAnswersByOld, settings.showHiddenQASubReply);
        reverseSubReply(true);
        addFloorIndex();

        // 功能1-6：屏蔽黑名单中的用户发言内容
        const Filter = (psnnode, parent, userListLowerCase, psnInfoGetter, userNameChecker) => {
            let psnInfo = '';
            let userNameCheckerFinal = user => userNameChecker(user, psnInfo);
            let remover = parent.replace(/\s/g, '') == 'ul.sonlist>li' ? el => {
                let parentElements = el.parents(parent);
                let sonlistmark = parentElements.parents('div.sonlistmark.ml64.mt10');
                parentElements.remove();
                if (sonlistmark[0].querySelector('ul.sonlist>li') == null) {
                    sonlistmark.hide();
                }
            } : el => el.parents(parent).remove();
            let removed = 0;
            $(psnnode).map((i, el) => {
                psnInfo = psnInfoGetter($(el));
                if (userListLowerCase.find(userNameCheckerFinal) != undefined) {
                    remover($(el));
                    removed++;
                }
            });
            return removed;
        }
        var filteredCriticPost = false;
        const filterUserPost = () => {
            if (settings.blockList.length > 0) {
                let window_href = window.location.href;
                let userListLowerCase = [];
                settings.blockList.forEach(user => { userListLowerCase.push(user.toLowerCase()); });
                let FilterRegular = (psnnode, parent) => Filter(psnnode, parent, userListLowerCase, el => el.html().toLowerCase(), (user, psnid) => user == psnid);
                if (window_href.match(/\/gen(e\/|e)$/)) {
                    FilterRegular('.touchclick .psnnode', '.touchclick'); // 机因一览
                } else if (window_href.indexOf('gene') > -1) {
                    FilterRegular('div.post .psnnode', 'div.post'); // 机因回复
                } else if (window_href.match(/\.co(m\/|m)$/) != null || window_href.indexOf('node') > -1 || window_href.indexOf('qa') > -1 || window_href.match(/\/trad(e\/|e)$/) != null) {
                    FilterRegular('div.ml64>.meta>.psnnode', 'li'); // 主页一览、问答一览、问答回复、交易一览
                } else if (window_href.indexOf('topic') > -1 || window_href.indexOf('trade') > -1 || window_href.match(/\/battle\/[1-9][0-9]+/) != null) {
                    FilterRegular('div.ml64>.meta>.psnnode', 'div.post'); // 主页帖回复、交易帖回复、约战帖回复
                } else if (window_href.match(/\/my\/notice/)) {
                    FilterRegular('.psnnode', 'li'); // 消息通知
                } else if (window_href.indexOf('trophy') > -1 || window_href.match(/\/psnid\/[^\/]+\/comment/) != null) {
                    FilterRegular('div.ml64>.meta.pb10>.psnnode', 'li'); // 奖杯TIPS、个人主页留言
                    FilterRegular('ul.sonlist .content>.psnnode', 'ul.sonlist>li'); // 奖杯TIPS二级回复、个人主页留言二级回复
                } else if (window_href.match(/\/psngame\/[1-9][0-9]+\/comment/) != null) {
                    filteredCriticPost = FilterRegular('div.ml64>.meta.pb10>.psnnode', 'li') > 0; // 游戏测评
                    FilterRegular('ul.sonlist .content>.psnnode', 'ul.sonlist>li'); // 游戏测评二级回复
                } else if (window_href.indexOf('battle') > -1) {
                    Filter('table.list td.pdd15.h-p>a', 'tr', userListLowerCase, el => el[0].href, (user, element_href) => element_href.indexOf(`psnid/${user}`) > -1); // 约战一览
                }
                if (window_href.match(/\/qa\/[1-9][0-9]*/)) {
                    FilterRegular('ul.sonlist .content>.psnnode', 'ul.sonlist>li'); // 问答二级回复
                }
            }
        }
        // 屏蔽词
        // const blockWordsList = ['日版', '顶', '第一句', '股票', '安排', '技能点', '刀剑'];
        const FilterWordRegular = (postSelector, width) => {
            const posts = $(postSelector);
            if (posts.length > 0) {
                posts.map((index, post) => {
                    settings.blockWordsList.map(word => {
                        if ($(post).text().match(word)) {
                            $(post).parent().parent().after(`
                                <div onclick="$(this).prev().show();$(this).hide();" class="btn btn-gray font12" style="margin-bottom:2px;${width && `width:${width}%;`}">====== 内容包含您的屏蔽词，点击查看屏蔽内容 ======</div>
                            `);
                            $(post).parent().parent().hide();
                        }
                    })
                })
            }
        }
        const filterBlockWorld = () => {
            const window_href = window.location.href;
            if (window_href.indexOf('gene') > -1                         // 机因回复
                || window_href.indexOf('topic') > -1                     // 主帖回复
                || window_href.indexOf('trophy') > -1                    // 奖杯TIPS
                || window_href.indexOf('qa') > -1                        // 问答回复
                || window_href.indexOf('trade') > -1                     // 交易回复
                || window_href.match(/\/battle\/[1-9][0-9]+/) != null    // 约战回复
                || window_href.match(/\/psnid\/[^\/]+\/comment/) != null // 个人主页留言
            ) {
                FilterWordRegular('div.ml64>div.content.pb10');
            }
        }
        filterBlockWorld();
        showCriticAverage();
        filterUserPost();

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

        /* 将BBCode替换成对应html代码
         * @param   str  原始BBCode输入
         *
         * @return  str  转换后的html代码
         */
        const replaceAll = (str, mapObj) => {
            for (var i in mapObj) {
                var re = new RegExp(i, 'g');
                str = str.replace(re, mapObj[i]);
            }
            return str;
        }
        /*
         * BBCode和html标签对应表
         */
        const bbcode = {
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

        /* 功能：在输入框下方追加输入内容预览框
         * @param   tag  可定位到输入框的标签名
         */
        const addInputPreview = (tag) => {
            $(tag).after(
                "<div class='content' style='padding: 0px 10px; word-wrap: break-word; word-break:break-all;' id='preview' />"
            );
            $(tag).keyup(() => {
                $('#preview').html(replaceAll($(tag).val(), bbcode));
            });
        }

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

        // 评论框预览功能（等追加自定义设置后开放）
        // addInputPreview("textarea#comment[name='content']");

        /*
         * 问答标题根据回答状况着色
         * @param  isOn  是否开启功能
         */
        const changeQaStatus = (isOn) => {
            if (isOn) {
                // 替换文字状态为图标形式
                $('.list>li').map((i, node) => {
                    const el = $(node).find("div.meta > .r > span:nth-child(2)");
                    const status = $(el).text();
                    // 替换文字状态为图标形式
                    const selector = 'div.ml64>p.title.font16>a';
                    switch (status) {
                        case "已解决": $(node).find(selector).append('<div class="fa-check-circle"></div>'); break;
                        case "未回答": $(node).find(selector).append('<div class="fa-question-circle"></div>'); break;
                        case "解决中": $(node).find(selector).append('<div class="fa-comments"></div>'); break;
                        default: return;
                    }
                    const el_reward = $(node).find("div.meta > .r > span:nth-child(1)");
                    const reward_num = $(el_reward).text();
                    // 替换文字状态为图标形式
                    const reward = reward_num.match(/悬赏(\d+)铜/);
                    if (reward && reward.length > 0) {
                        const number = Number(reward[1]);
                        $(el_reward).replaceWith(`<div class="fa-coins"></div>&nbsp;<span class="${number > 30 ? 'text-gold' : (number === 10 ? 'text-bronze' : 'text-silver')}" style="font-weight:bold;"}">${number}</span>`);
                    }
                });
            } else {
                return;
            }
        }

        /*
         * 通过Ajax获取自己的该游戏页面的奖杯数目
         * @param  data  Ajax获取的数据
         * @param  tip   Tippy对象
         */
        const getTrophyContentByAjax = (data, tip) => {
            const reg = /[\s\S]*<\/body>/g;
            const html = reg.exec(data)[0];
            const inner = $(html).find('td>em>.text-strong');
            tip.setContent(inner.length > 0
                ? `你的奖杯完成度：${inner.text()}`
                : '你还没有获得该游戏的任何奖杯'
            );
        }

        /*
         * 通过Ajax获取用户名片
         * @param  data  Ajax获取的数据
         * @param  tip   Tippy对象
         */
        const getUserCardByAjax = (data, tip) => {
            const reg = /[\s\S]*<\/body>/g;
            const html = reg.exec(data)[0];
            const inner = $(html).find('.psnzz').parent().get(0);
            $(inner).find('.inner').css('max-width', '400px');
            tip.setContent(inner);
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
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'html',
                    success: (data) => {
                        successFunction(data, tip);
                    },
                    error: () => {
                        tip.setContent('无法获取页面信息');
                    },
                })
            } catch (e) {
                tip.setContent(`获取失败：${e}`);
            } finally {
                tip.state.ajax.isFetching = false;
            }
        }

        /*
         * 功能：悬浮于头像显示个人界面
         */
        const addHoverProfile = () => {
            if (settings.hoverHomepage) {
                $("a[href*='psnid/'] > img").parent().map(function (i, v) {
                    var url = $(this).attr('href');
                    $(this).attr('id', 'profile' + i);
                    tippy(`#profile${i}`, {
                        content: '加载中...',
                        delay: 700,
                        maxWidth: '500px',
                        animateFill: false,
                        interactive: true,
                        placement: 'left',
                        async onShow(tip) {
                            tippyOnShow(url, tip, getUserCardByAjax);
                        },
                        onHidden(tip) {
                            tip.state.ajax.canFetch = true;
                            tip.setContent('加载中...');
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
            Highcharts.chart('container', priceLinePlot)
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
        const retrieveRealTimeExchangeRate = (callback_success, callback_failure) => {
            // 默认汇率
            let exchangeRate = { HKD: 0.8796572978575602, USD: 6.817381644163391, GBP: 8.770269230346404, JPY: 0.06453927675754388 };//latest exchange rate as of 2020/09/30/00:00 AM (GMT+8)
            try {// 获取实时汇率
                let httpReq = new XMLHttpRequest();
                httpReq.open("GET", 'https://api.exchangeratesapi.io/latest', false);
                httpReq.send(null);
                let startTime = Date.now();
                const repeatUntilSuccessful = (function_ptr, interval) => {
                    if (!function_ptr())
                        setTimeout(() => {
                            repeatUntilSuccessful(function_ptr, interval);
                        }, interval);
                }
                repeatUntilSuccessful(() => {
                    // Wait until HTTP GET SUCCESSFULL or TIMEOUT
                    if ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE) && (Date.now() - startTime) < 3000)
                        return false;
                    let rawExchangeRate = null;
                    if ((httpReq.status == 200) && (httpReq.readyState == XMLHttpRequest.DONE))
                        rawExchangeRate = JSON.parse(httpReq.response);
                    if (Boolean(rawExchangeRate))// HTTP GET SUCCESSFULL
                        ['HKD', 'USD', 'GBP', 'JPY'].forEach(currency => exchangeRate[currency] = rawExchangeRate.rates.CNY / rawExchangeRate.rates[currency]);
                    callback_success(exchangeRate);
                    return true;
                }, 50);
            } catch (e) {
                console.log('实时汇率获取失败，使用默认汇率');
                callback_failure(exchangeRate);
            }
        }
        const foreignCurrencyConversion = () => {
            const insertConvertedPriceTags = (exchangeRate) => {
                $('.dd_price').map((i, el) => {
                    // 一览页面和单商品页面不同位置偏移
                    const offset = /dd\//.test(window.location.href) ? 2 : 3;
                    const region = $(`.dd_info p:nth-child(${offset})`).eq(i).text();
                    if (region == '国服')
                        return;
                    const price = [
                        $(el).children().eq(0).text(), // 原始价格
                        $(el).children().eq(1).text(), // 优惠价格
                        $(el).children().eq(2).text(), // 会员优惠价格
                    ];
                    // 根据地区转换原始价格
                    const regionCurrency = {
                        港服: ['HK$', exchangeRate.HKD],
                        美服: ['$', exchangeRate.USD],
                        日服: ['¥', exchangeRate.JPY],
                        英服: ['£', exchangeRate.GBP]
                    };
                    const CNY = price.map(item => {
                        return (
                            Number(item.replace(regionCurrency[region][0], '')) *
                            regionCurrency[region][1]
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
            retrieveRealTimeExchangeRate(insertConvertedPriceTags, insertConvertedPriceTags);
        }
        const foreignCurrencyConversionSalesPage = () => {
            const changeToConvertedPriceTags = (exchangeRate) => {
                $('.store_box>.store_price').map((i, el) => {
                    // 一览页面和单商品页面不同位置偏移
                    const region = window.location.href.match(/region=.+?(&|$)/)[0].replace(/(region=|&)/g, '').toLowerCase();
                    if (region == 'cn')
                        return;
                    // 根据地区转换原始价格
                    const regionCurrency = {
                        hk: ['HK$', exchangeRate.HKD],
                        us: ['$', exchangeRate.USD],
                        jp: ['¥', exchangeRate.JPY],
                        gb: ['£', exchangeRate.GBP]
                    };
                    $(el).children().each((j, price_tag) => {
                        $(price_tag).attr('original-price', $(price_tag).text());
                        $(price_tag).attr('converted-price', `CN¥${(Number($(price_tag).text().replace(regionCurrency[region][0], '')) * regionCurrency[region][1]).toFixed(2)}`);
                        $(price_tag).text($(price_tag).attr('converted-price'));
                    });
                });
            }
            retrieveRealTimeExchangeRate(changeToConvertedPriceTags, changeToConvertedPriceTags);
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
                try {
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
                } catch (e) { }
            });
        }

        /*
         * 增加按键样式
         * @param  id               标签ID
         * @param  backgroundColor  按键背景色
         * @param  padding          padding
         * @param  margin           margin
         */
        const addButtonStyle = (id, backgroundColor, padding = "0px 5px", margin = "0 0 0 10px") => {
            GM_addStyle(
                `#${id} {
                    padding          : ${padding};
                    margin           : ${margin};
                    border-radius    : 2px;
                    display          : inline-block;
                    color            : white;
                    background-color : ${backgroundColor};
                    cursor           : pointer;
                    line-height      : 24px;
                }`
            );
        }
        const color_AddedButtonReady = '#d9534f';
        addButtonStyle('selectUnget', '#3498db');  // 未获得
        addButtonStyle('selectOriginalPrice', color_AddedButtonReady); // 原币种价格

        GM_addStyle(`
            .switch {
                position: relative;
                display: inline-block;
                margin-left: 10px;
                width: 40px;
                height: 18px;
            }`
        );
        GM_addStyle(`
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }`
        );
        GM_addStyle(`
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
            }`
        );
        GM_addStyle(`
            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 1px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
            }`
        );
        GM_addStyle(`
            input:checked + .slider {
                background-color: #2196F3;
            }`
        );
        GM_addStyle(`
            input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
            }`
        );
        GM_addStyle(`
            input:checked + .slider:before {
                -webkit-transform: translateX(20px);
                -ms-transform: translateX(20px);
                transform: translateX(20px);
            }`
        );
        GM_addStyle(`
            .slider.round {
                border-radius: 34px;
            }`
        );
        GM_addStyle(`
            .slider.round:before {
                border-radius: 50%;
            }
        `);
        /*
        * 功能：页面上追加“只看史低”功能按键，点击显示史低，再次点击恢复显示所有游戏（数折页面）
        */
        const showBest = () => {
            // 追加只看史低按键
            $('.dropmenu').append('<li style="color:#B8C4CE;padding: 0px 0px 0px 10px;">只看史低</li><label class="switch" style="line-height:1.3;"><input id="showBest" type="checkbox"><span class="slider round"></span></label>');
            // 点击按钮隐藏或者显示
            let toggle = $('#showBest');
            toggle[0].checked = false;
            toggle.change(() => {
                $('li.dd_box').map((i, el) => {
                    if ($(el).children('.dd_status.dd_status_best').length === 0) {
                        toggle[0].checked === true ? $(el).hide() : $(el).show();
                    }
                });
            });
        }
        /*
        * 功能：页面上追加“只看史低”功能按键，点击显示史低，再次点击恢复显示所有游戏（活动页面）
        */
        const onlyLowestSalesPage = () => {
            // 追加只看史低按键
            $('.disabled.h-p').eq(0).after('<li style="color:white;padding: 2px 5px;">只看史低<label class="switch"><input id="hideGamebox" type="checkbox"><span class="slider round"></span></label></li>');
            let toggle = $('#hideGamebox');
            toggle[0].checked = false;
            toggle.change(() => {
                $(document.querySelectorAll('li.store_box')).map((i, el) => {
                    if ((el).querySelector('.store_tag_best') === null) {
                        $(el).css('display', toggle[0].checked === true ? 'none' : 'block');
                    }
                })
            });
        }
        /*
         * 功能：页面上追加“显示人民币”功能按键（活动页面）
         */
        const showOriginalPrice = () => {
            if (window.location.href.match(/region=.+?(&|$)/)[0].replace(/(region=|&)/g, '').toLowerCase() == 'cn')
                return;
            $('.disabled.h-p').eq(0).after('<li style="color:white;padding: 2px 5px;">显示人民币<label class="switch"><input id="selectOriginalPrice" type="checkbox"><span class="slider round"></span></label></li>');
            let toggle = $('#selectOriginalPrice');
            toggle[0].checked = true;
            toggle.change(() => {
                $('.store_box>.store_price').children().each((i, price_tag) => {
                    $(price_tag).text($(price_tag).attr(toggle[0].checked === true ? 'converted-price' : 'original-price'));
                });
            })
        }

        // 综合页面：一览
        if (/((gene|qa|topic|trade)($|\?))/.test(window.location.href)) {
            autoPaging(settings.autoPaging);
        }
        // 页面：机因 > 发机因
        if (/set\/gene/.test(window.location.href)) {
            // 实时统计创建机因时候的文字数
            countInputLength();
            // 发基因时可实时预览结果内容
            addInputPreview("textarea[name='content']");
        }
        // 页面：机因、主题
        if (
            /(gene|topic|trade|battle)\//.test(window.location.href)
        ) {
            showReplyContent(settings.replyTraceback);
        }
        // 页面：问答
        if (/\/qa/.test(window.location.href)) {
            changeQaStatus(settings.newQaStatus);
        }
        // 页面：数折
        if (/\/dd($|\?)/.test(window.location.href)) {
            // 外币转人民币
            foreignCurrencyConversion();
            // 根据降价幅度变更标题颜色
            changeGameTitleColor();
            // 只看史低
            showBest();
        }
        // 页面：数折 > 商品页
        if (
            /\/dd\//.test(window.location.href) ||
            /game\/[0-9]+\/dd$/.test(window.location.href)
        ) {
            addPriceLinePlot();
            // 外币转人民币
            foreignCurrencyConversion();
        }
        // 页面：活动
        if (/huodong/.test(window.location.href)) {
            // 外币转人民币
            foreignCurrencyConversionSalesPage();
            // 只看史低
            onlyLowestSalesPage();
            // 原币种价格
            showOriginalPrice();
        }
        // 页面：全局
        // 跳转至底部按钮
        toPageBottom();

        /*
         * 获取奖杯各种类个数
         * @param  className  用于识别的类名
         * @param  name       奖杯种类名
         * @param  color      色块所用颜色码
         *
         * @return {object}   用于绘扇形图的单个数据块
         */
        const getTrophyCategory = (className, name, color) => {
            const trophyCount = $(className).eq(0).text().replace(name, '');
            return { name: name, y: Number(trophyCount), color: color };
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
            $('#trophyChartContainer').append(
                `<div id="trophyRatioChart" align="left"></div>`
            );
            Highcharts.chart('trophyRatioChart', trophyRatio)
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
        const trophyGetTimeElementParser = (timeElement) => {
            // 奖杯时间丢失部分处理
            const dayTime = $(timeElement).text().trim();
            if (dayTime === '时间丢失')
                return 0;
            // 从页面上获取奖杯时间，生成时间对象并且放入数组中保存
            const timeArray = [
                $(timeElement).attr('tips').replace('年', ''), // 年
                Number(dayTime.substr(0, 2)) - 1, // 月
                dayTime.substr(3, 2), // 日
                dayTime.substr(5, 2), // 时
                dayTime.substr(8, 2), // 分
            ].map((x) => Number(x));
            return Date.UTC(...timeArray);
        };
        const createTrophyGetTimeData = (className) => {
            const timeElements = $(className);
            const getTimeArray = [];
            timeElements.map((i, el) => {
                const xTime = trophyGetTimeElementParser(el);
                getTimeArray.push([xTime, el.parentElement.parentElement]);
            })
            getTimeArray.sort((t1, t2) => t1[0] - t2[0]);
            let earliestValidTimeIndex = getTimeArray.findIndex(t => t[0] != 0);
            if (earliestValidTimeIndex >= 0)
                getTimeArray.forEach(t => {
                    if (t[0] == 0)
                        t[0] = getTimeArray[earliestValidTimeIndex][0]
                });
            else
                getTimeArray.forEach(t => t[0] = Number.NaN);
            const data = getTimeArray.map((x, y) => [x[0], y + 1]);
            // 调整最终数据点
            // data[data.length - 1][1] -= 1;
            const trophyElements = getTimeArray.map((x) => x[1]);
            return { 'data': data, 'trophyElements': trophyElements };
        }

        /*
         * 功能：在单独游戏页面上方追加奖杯获得时间线形图
         */
        let trophyGetTimeData;
        const addTrophyGetTimeLineChart = () => {
            // 奖杯获得时间年月统计
            trophyGetTimeData = createTrophyGetTimeData('em.lh180.alert-success.pd5.r');
            const data = trophyGetTimeData.data;
            const totalTrophyCount = Number($('div.main>.box.pd10>em>.text-strong')
                .text().replace('总', ''));
            const receivedTrophyCount = data.length;

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
            const trophyGetRatio = ((receivedTrophyCount / totalTrophyCount) * 100).toFixed(2);
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
                max: totalTrophyCount,
                endOnTick: false,
                tickInterval: Math.floor(totalTrophyCount / 4),
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
            $('#trophyChartContainer').append(
                `<div id="trophyGetTimeChart" align="left"></div>`
            );
            Highcharts.chart('trophyGetTimeChart', trophyGetTime);
        }

        const sortTrophiesByTimestamp = () => {
            const trophyTableEntries = $('table.list').eq(0).children().find('tr');
            const trophies = trophyTableEntries.filter((i, e) => e.id != "");
            if (trophies.eq(0).hasClass('t1'))//Platinum
                trophyTableEntries.filter((i, e) => e.id == "").eq(0).after(trophyGetTimeData.trophyElements);
            else
                trophies.eq(0).after(trophyGetTimeData.trophyElements);
        }

        /*
         * 功能：奖杯筛选功能
         */
        const addTrophyFilter = () => {
            $('.dropmenu').append('<li style="color:#B8C4CE;"></em>只显示未获得</em><label class="switch" style="line-height:1.3;"><input id="filterEarned" type="checkbox"><span class="slider round"></span></label></li>');
            let toggle = $('#filterEarned');
            toggle[0].checked = false;
            toggle.change(() => {
                $('.lh180.alert-success.pd5.r').parent().parent().toggle('slow');
            });
        }

        const addTrophySortByTimestamp = () => {
            $('div.main ul.dropmenu > li.dropdown > ul').eq(0).append('<li id="sortTrophiesByTimestamp"><a>获得时间</a></li>');
            $('#sortTrophiesByTimestamp').click(() => {
                sortTrophiesByTimestamp();
                $('#sortTrophiesByTimestamp').remove();
                $('div.main ul.dropmenu > li.dropdown').removeClass('hover');
            });
        }

        /*
         * 功能：汇总以获得和未获得奖杯
         */
        const addEarnedTrophiesSummary = () => {
            const trophyTitleStyle = `border-radius: 2px; padding:5px; background-color:${$('li.current').css('background-color')};`;
            // tippy弹出框的样式
            GM_addStyle(`.tippy-tooltip.psnine-theme {background-color: ${$('.box').css('background-color')};}`);
            // 奖杯tips颜色
            let tipColor = '';
            // 创建奖杯汇总框架函数
            const createTrophyContainer = (object, className, title) => {
                // 添加标题框在汇总图下
                $('#trophyChartContainer').append(
                    `<div class='${className}'><p class='trophyCount' style='${trophyTitleStyle}'></p><div class='trophyContainer' style='padding:5px;'></div></div>`
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
                    $(`.${className}> .trophyContainer`).append(
                        `<span id='${className}Small${i}' style='padding:3px; border-left: 3px solid ${tipColor};'><a href='${$(this).parent().attr('href')}'><img src='${$(this).attr('src')}' width='30px'></img><a></span>`
                    );
                    // 添加鼠标悬浮弹出消息
                    tippy(`#${className}Small${i}`, {
                        content: `<td>${$(this).parent().parent().html()}</td><p></p><td>${$(this).parent().parent().next().html()}</td>`,
                        theme: 'psnine',
                        animateFill: false,
                    });
                });
                // 给奖杯汇总标题填充文字
                const summaryTrophyDict = {
                    '.t1': ['text-platinum', '白'],
                    '.t2': ['text-gold', '金'],
                    '.t3': ['text-silver', '银'],
                    '.t4': ['text-bronze', '铜'],
                };
                let trophySubText = ""
                for (var i in summaryTrophyDict) {
                    trophySubText += `<span class=${summaryTrophyDict[i][0]}> ${summaryTrophyDict[i][1]}${object.parent().parent(i).length}</span>`
                }
                $(`.${className}> .trophyCount`).append(
                    `<span style='color:#808080;'>${title}：${trophySubText}<span class='text-strong'> 总${object.length}</span></span>`
                );
            }
            // 创建已获得奖杯汇总框
            createTrophyContainer($('.imgbg.earned'), 'earnedTrophy', '已获得奖杯');
            // 创建未获得奖杯汇总框
            createTrophyContainer($("img[class$='imgbg']"), 'notEarnedTrophy', '未获得奖杯');
            // 未获得奖杯变黑白
            $('span[id^="notEarnedTrophySmall"] > a > img').css({ filter: 'grayscale(100%)' });
            // 折叠奖杯汇总
            // 奖杯图标设置为不可见
            if (settings.foldTrophySummary) {
                $('.trophyContainer').css('display', 'none');
            }
            // 单击奖杯汇总标题后展开奖杯图标
            $('.trophyCount').click(function () {
                $(this).next().slideToggle();
            });
        }

        // 奖杯系统优化
        // 功能3-1：游戏奖杯界面可视化
        if (
            /psngame\//.test(window.location.href) &&
            /^(?!.*comment|.*rank|.*battle|.*gamelist|.*topic|.*qa)/.test(
                window.location.href
            )
        ) {
            $('.box.pd10').append(`<div id="trophyChartContainer" style="float: left"></div>`);
            // 追加奖杯统计扇形图
            addTrophyPieChart();
            // 追加奖杯获得时间线形图
            addTrophyGetTimeLineChart();
            // 追加奖杯获得时间排序
            addTrophySortByTimestamp();
            // 汇总以获得和未获得奖杯
            addEarnedTrophiesSummary();
            // 追加奖杯筛选功能
            addTrophyFilter();
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
                                tippyOnShow(myGameUrl, tip, getTrophyContentByAjax);
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

        // 机因、问答页面按最新排序
        if (settings.listPostsByNew) {
            $('#pcmenu a').each((i, obj) => {
                if (/\/((gene)|(qa))($|(\/$))/.test(obj.href))
                    obj.href += '?ob=date';
            });
        }

        // 进入游戏页默认查看我自己的奖杯
        if (
            window.location.href.match(/psngame\/\d+($|\/$)|(#\d+($|\/$))/) &&
            !/psnid/.test(window.location.href)
        ) {
            // 检查游戏页
            window.onpageshow = (e) => {
                const backTrigger = e || window.event;
                // 从cookie中取出psnid
                const psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/);
                if (!backTrigger.persisted && psnidCookie) {
                    if (window.location.href.match(/psngame\/\d+#\d+/))
                        window.location.href = window.location.href.replace(/#(\d+)($|\/$)/, `?psnid=${psnidCookie[1]}#$1`);
                    else
                        window.location.href = window.location.href.replace(/($|\/$)/, `?psnid=${psnidCookie[1]}`);
                }
            }
        }

        /*
         * 功能：奖杯心得按“顶”的数量排序功能
         */
        const sortTipsByLikes = (isSorted) => {
            // 检测是否为老页面
            let containerName = $('.post').length > 0 ? '.mt20' : '.list';
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
                if (!isSorted) {
                    $(ele).css({
                        order: likeStr ? 99999 - likeStr : 99999
                    });
                } else {
                    $(ele).css({
                        order: 0
                    });
                }
            });
            // 把警告信息和排序按钮写死为第一位
            $('.alert-error, #sortTipsByLikes').css({
                order: 0
            });
        }

        // 奖杯心得页面输入框可缩放大小
        addButtonStyle('sortTipsByLikes', '#3498db', "8px 16px", "10px");  // 根据顶数排序Tips
        if (window.location.href.match(/trophy\/\d+($|\/$)/)) {
            let isSorted = false;
            $("<a id='sortTipsByLikes'>根据顶数排序Tips</a>")
                .insertAfter($('div.box.mt20>div.pd10.alert-error').get(0)).css({
                    width: '111px',
                    textAlign: 'center',
                    textDecoration: 'none',
                })
                .click((event) => {
                    if (isSorted) {
                        sortTipsByLikes(isSorted);
                        $(event.target).text('根据顶数排序Tips').css({
                            "background-color": "#3498db",
                            "color": "#FFFFFF"
                        });
                    } else {
                        sortTipsByLikes(isSorted);
                        $(event.target).text('恢复默认排序').css({
                            "background-color": "#E7EBEE",
                            "color": "#99A1A7"
                        });;
                    }
                    isSorted = !isSorted;
                });
            $('#comment').css({
                resize: 'vertical',
                minHeight: 200,
            });
        }

        // P9时间格式转换函数
        function p9TimeTextParser(timestamp_text) { // returns UTC time
            let array = null;
            // 1小时
            const unit_time_hour = 60 * 60 * 1000;
            const relative_description_to_offset = (prune_pattern, unit_time) => {
                return -parseInt(timestamp_text.replace(prune_pattern, '')) * unit_time;
            }
            const relative_timestamp = (offset, replace_pattern) => {
                if (replace_pattern) {
                    return (
                        (new Date((new Date()).getTime() + 8 * unit_time_hour + offset))
                            .toLocaleDateString('en-CA', { timeZone: "Asia/Shanghai" })
                            .split('-')
                            .concat(timestamp_text.replace(replace_pattern, '').split(/:/))
                    );
                } else {
                    let _array = (new Date((new Date()).getTime() + offset))
                        .toLocaleString('en-CA', { timeZone: "Asia/Shanghai", hour12: false })
                        .split(/-|, |:/);
                    _array.pop();
                    return _array;
                }
            }
            const date_string_to_array = date_string => {
                return date_string.split(/-|\s|:/);
            };
            if (timestamp_text.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}/)) {
                array = date_string_to_array(timestamp_text);
            } else if (timestamp_text.match(/[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}/)) {
                array = date_string_to_array(timestamp_text);
                array.unshift((new Date()).getFullYear());
            } else {
                // if time were not offset by 8 hours, date calculation would be incorrect when description involves '[0-9]+天前'
                if (timestamp_text.match(/[0-9]+天前\s[0-9]{2}:[0-9]{2}/))
                    array = relative_timestamp(relative_description_to_offset(/天前.+$/g, unit_time_hour * 24), /[0-9]+天前\s/g);
                else if (timestamp_text.match(/前天\s[0-9]{2}:[0-9]{2}/))
                    array = relative_timestamp(-2 * unit_time_hour * 24, /前天\s/g);
                else if (timestamp_text.match(/昨天\s[0-9]{2}:[0-9]{2}/))
                    array = relative_timestamp(-unit_time_hour * 24, /昨天\s/g);
                else if (timestamp_text.match(/今天\s[0-9]{2}:[0-9]{2}/))
                    array = relative_timestamp(0, /今天\s/g);
                else if (timestamp_text.match(/[0-9]+小时前/))
                    array = relative_timestamp(relative_description_to_offset(/小时.+$/g, unit_time_hour));
                else if (timestamp_text.match(/[0-9]+分钟前/))
                    array = relative_timestamp(relative_description_to_offset(/分钟.+$/g, 60 * 1000));
                else if (timestamp_text.match(/刚刚/))
                    array = relative_timestamp(0);
            }
            if (array) {
                for (let i = array.length - 1; i >= 0; i--) {
                    if (array[i] == '') {
                        array.splice(i, 1);
                        continue;
                    }
                    array[i] = parseInt(array[i]);
                    if (i == 1) // Everything else is normal except month starts from 0
                        array[i]--;
                }
                return Date.UTC(...array) - 8 * unit_time_hour;
            }
            console.log('not parsed: ' + timestamp_text);
            return null;
        }
        // 游戏评论页面计算平均分
        function showCriticAverage() {
            if (window.location.href.match(/psngame\/[1-9][0-9]+\/comment/)) {
                var score_parser, score_elements, score_parent_review;
                const selectScoreElements = () => {
                    score_elements = $('div.min-inner.mt40 div.box ul.list li div.ml64 div.meta.pb10 span.alert-success.pd5:contains(评分 )');
                    if (score_elements.length > 0) {
                        score_parser = (element) => { return parseInt(element.text().replace('评分 ', '')); };
                        score_parent_review = 'li';
                    } else {
                        score_elements = $('div.min-inner.mt40 div.box div.ml64 p.text-success:contains(评分 ) b');
                        if (score_elements.length > 0) {
                            score_parser = (element) => { return parseInt(element.text()); };
                            score_parent_review = 'div.post';
                        } else {
                            return false;
                        }
                    }
                    return true;
                }
                if (!selectScoreElements())
                    return;
                var reviews_no_score = null, reviews_no_score_hidden = false;
                const selectReviewsNoScore = () => {
                    if (reviews_no_score == null)
                        reviews_no_score = $('div.min-inner.mt40 div.box ul.list li div.ml64 div.meta.pb10:not(:has(span.alert-success.pd5))').parents('li');
                    if (reviews_no_score.length == 0)
                        reviews_no_score = $('div.min-inner.mt40 div.box div.ml64:not(:has(p.text-success))').parents('div.post');
                }
                const hideReviewsNoScore = () => {
                    if (reviews_no_score_hidden)
                        return;
                    selectReviewsNoScore();
                    reviews_no_score.hide();
                    reviews_no_score_hidden = true;
                }
                const showReviewsNoScore = () => {
                    if (!reviews_no_score_hidden)
                        return;
                    selectReviewsNoScore();
                    reviews_no_score.show();
                    reviews_no_score_hidden = false;
                }
                var hidden_scores = [];
                const hideSpecificScore = (score) => {
                    if (hidden_scores.indexOf(score) > -1)
                        return;
                    var hidden = 0;
                    score_elements.each(function () {
                        if (score_parser($(this)) == score) {
                            $(this).parents(score_parent_review).hide();
                            hidden++;
                        }
                    });
                    if (hidden > 0) {
                        hideReviewsNoScore();
                        hidden_scores.push(score);
                    }
                }
                const showSpecificScore = (score) => {
                    var hidden_score_index = hidden_scores.indexOf(score);
                    if (hidden_score_index >= 0) {
                        score_elements.each(function () {
                            if (score_parser($(this)) == score)
                                $(this).parents(score_parent_review).show();
                        });
                        hidden_scores.splice(hidden_score_index, 1);
                        if (hidden_scores.length == 0)
                            showReviewsNoScore();
                    }
                }
                const scoreOnclick = (chart, seriesEntry, score) => {
                    if (filteredCriticPost) {
                        selectScoreElements();
                        filteredCriticPost = false;
                    }
                    switch (seriesEntry.color.length) {
                        case 7:// no alpha, score is being shown
                            seriesEntry.color += '1f';
                            hideSpecificScore(score);
                            break;
                        case 9:// has alpha, score is being hidden
                            seriesEntry.color = seriesEntry.color.substring(0, 7);
                            showSpecificScore(score);
                            break;
                    }
                    chart.redraw();
                }
                var gaussian_on = true, gradient_stops = null;
                var score_data_barchart, score_data_barchart_no_gaussian, score_data_gaussian;
                var score_axis, score_axis_no_gaussian;
                const scoreBarChartAddLabelOnclick = (chart) => {
                    chart.xAxis[0].labelGroup.element.childNodes.forEach(function (label) {
                        label.onclick = function () {
                            var value = parseInt(this.innerHTML);
                            var pos = chart.series[0].data.find(e => e.category == value).index;
                            scoreOnclick(chart, chart.series[0].data[pos], value);
                        }
                    });
                }
                const createScoreBarChart = (criticsCount, scoreCountMin, scoreCountMax) => {
                    const scoreChart = {
                        type: 'column',
                        backgroundColor: 'rgba(0,0,0,0)',
                        events: {
                            click: function (event) {
                                gaussian_on = !gaussian_on;
                                var chart = Highcharts.chart('scoreBarChart', createScoreBarChart(criticsCount, scoreCountMin, scoreCountMax))
                                scoreBarChartAddLabelOnclick(chart);
                                hidden_scores.forEach(s => scoreOnclick(chart, chart.series[0].data[chart.xAxis[0].categories.indexOf(s)], s));
                            }
                        }
                    };
                    const scoreTitle = {
                        text: '评论分数分布',
                        style: { color: '#808080' }
                    };
                    const scoreSubtitle = {
                        text: '点击分数柱或横坐标数字隐藏相应评论',
                        style: { fontSize: '9px', color: '#808080' }
                    };
                    const scoreXaxis = [{
                        categories: gaussian_on ? score_axis : score_axis_no_gaussian,
                        crosshair: true
                    }];
                    const scoreYaxis = [{
                        tickInterval: gaussian_on ? 2 : 1,
                        min: scoreCountMin < 3 ? 0 : scoreCountMin,
                        max: scoreCountMax,
                        title: { text: '点评人数' }
                    }];
                    const scoreTooltip = {
                        formatter() {
                            switch (this.series.index) {
                                case 0:
                                    return `<b>${this.y}人</b>`;
                                case 1:
                                    return `<b>${(this.y * 100).toFixed(2)}%</b>`;
                                default:
                                    return this.y;
                            }
                        },
                        pointFormat: '{point.y}'
                    };
                    const scorePlotOptions = {
                        column: {
                            pointPadding: 0,
                            borderWidth: 0
                        },
                        bellcurve: {
                            color: '#8080807f',
                            fillColor: '#00000000'
                        },
                        series: { point: { events: { click: function () { if (this.series.name == '评分计数') scoreOnclick(this.series.chart, this, this.category); } } } }
                    };
                    const scoreSeries = [{
                        name: '评分计数',
                        xAxis: 0,
                        yAxis: 0,
                        zIndex: 1,
                        baseSeries: 0,
                        data: gaussian_on ? score_data_barchart : score_data_barchart_no_gaussian
                    }];
                    const scoreCredits = {
                        text: '点评总人数：' + criticsCount
                    };
                    if (gaussian_on) {
                        scoreXaxis.push({
                            min: 0.5,
                            max: 10.5,
                            alignTicks: true,
                            opposite: true,
                            visible: false
                        });
                        scoreYaxis.push({
                            min: 0,
                            title: { text: '正态分布' },
                            opposite: true,
                            labels: {
                                formatter: function () {
                                    return this.value * 100 + '%';
                                }
                            }
                        });
                        scoreSeries.push({
                            type: 'bellcurve',
                            xAxis: 1,
                            yAxis: 1,
                            zIndex: 0,
                            baseSeries: 1,
                            data: score_data_gaussian,
                            enableMouseTracking: false
                        });
                    }
                    const scoreBarChart = {
                        chart: scoreChart,
                        title: scoreTitle,
                        subtitle: scoreSubtitle,
                        xAxis: scoreXaxis,
                        yAxis: scoreYaxis,
                        tooltip: scoreTooltip,
                        plotOptions: scorePlotOptions,
                        series: scoreSeries,
                        legend: { enabled: false },
                        credits: scoreCredits
                    };
                    return scoreBarChart;
                };
                const weekOfYear = (date) => { // https://stackoverflow.com/a/6117889
                    let start_of_day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                    let day_of_week = start_of_day.getUTCDay() || 7;
                    start_of_day.setUTCDate(start_of_day.getUTCDate() + 4 - day_of_week);
                    let start_of_year = new Date(Date.UTC(start_of_day.getUTCFullYear(), 0, 1));
                    return Math.ceil((((start_of_day - start_of_year) / 86400000/* milliseconds of a day */) + 1) / 7);
                };
                const weeksOfYearCache = {};
                const weeksOfYear = (year) => {
                    let weeks = weeksOfYearCache[year];
                    if (weeks == undefined) {
                        let last_week = weekOfYear(new Date(year, 11, 31));
                        if (last_week == 1)
                            weeks = weekOfYear(new Date(year, 11, 24));
                        else
                            weeks = last_week;
                        weeksOfYearCache[year] = weeks;
                    }
                    return weeks;
                };
                const yearOfWeek = (date, week = null) => {
                    let real_year = date.getUTCFullYear();
                    if (week == null)
                        week = weekOfYear(date);
                    if (date.getUTCMonth() == 0) {
                        if (week > 5)
                            return real_year - 1;
                    } else {
                        if (week == 1)
                            return real_year + 1;
                    }
                    return real_year;
                };
                const weekToTimestamp = (year, week, day = 4) => {
                    let start_of_year = new Date(Date.UTC(year, 0, 1));
                    if (weekOfYear(start_of_year) > 1)
                        start_of_year = new Date(Date.UTC(year, 0, 8));
                    return start_of_year.getTime() + (-((start_of_year.getUTCDay() || 7) - 1) + (7 * (week - 1) + (day - 1))) * 86400000/* milliseconds of a day */;
                }
                const weekDifference = (date_1, date_2) => {
                    let week_of_year_1 = weekOfYear(date_1), year_of_week_1 = yearOfWeek(date_1, week_of_year_1), week_start_1 = weekToTimestamp(year_of_week_1, week_of_year_1, 1);
                    let week_of_year_2 = weekOfYear(date_2), year_of_week_2 = yearOfWeek(date_2, week_of_year_2), week_start_2 = weekToTimestamp(year_of_week_2, week_of_year_2, 1);
                    return (week_start_1 - week_start_2) / 604800000/* milliseconds of a week */;
                }
                const createScoreTrendChart = () => {
                    var score_trend = [], comment_trend = [], min_score = Number.MAX_SAFE_INTEGER, max_score = Number.MIN_SAFE_INTEGER, first_week, last_week;
                    const createScoreTrendChartData = () => {
                        const scoreElementTime = (score_element) => {//must be single element
                            let timestamp_element = $(score_element).parents('div.ml64').find('div.meta:not(.pb10) > span:nth-child(2)');
                            if (timestamp_element.length > 0) {
                                return p9TimeTextParser(timestamp_element.text().replace(/(^\s)|(\s$)|(修改)/g, ''));
                            }
                            timestamp_element = $(score_element).parents('div.ml64').find('div.meta');
                            if (timestamp_element.length > 0) {
                                let text_array = timestamp_element.text().split(/\r?\n/);
                                let index = -1, text;
                                do {
                                    text = text_array[text_array.length + index].replace(/(^\s)|(\s$)|(修改)/g, '')
                                    index--;
                                } while (text == '')
                                return p9TimeTextParser(text);
                            }
                            return null;
                        }
                        score_elements.each(function () {
                            let timestamp = scoreElementTime($(this));
                            if (timestamp != null) {
                                let score_date = new Date(timestamp);
                                let week_of_year = weekOfYear(score_date);
                                let year_of_week = yearOfWeek(score_date, week_of_year);
                                score_trend.push([timestamp, score_parser($(this)), year_of_week, week_of_year]);
                            }
                        });
                        score_trend.sort((e1, e2) => (e1[0] - e2[0]));
                        let accumulated_score = 0;
                        for (let i = 0; i < score_trend.length; i++) {
                            accumulated_score += score_trend[i][1];
                            let updated_average_score = accumulated_score / (i + 1);
                            score_trend[i][1] = updated_average_score;
                            if (updated_average_score < min_score)
                                min_score = updated_average_score;
                            if (updated_average_score > max_score)
                                max_score = updated_average_score;
                        }
                        let comment_count_by_week = {};
                        let first_score = score_trend[0], last_score = score_trend[score_trend.length - 1];
                        first_week = [first_score[2], first_score[3]], last_week = [last_score[2], last_score[3]];
                        score_trend.forEach(score => {
                            let week = `${score[2]}/${score[3]}`;
                            if (comment_count_by_week[week] == undefined)
                                comment_count_by_week[week] = 1;
                            else
                                comment_count_by_week[week]++;
                            score.splice(2, 2);
                        });
                        for (let year = first_week[0]; year <= last_week[0]; year++) {
                            let first = year == first_week[0] ? first_week[1] : 1;
                            let last = year == last_week[0] ? last_week[1] : weeksOfYear(year);
                            for (let week = first; week <= last; week++) {
                                let count = comment_count_by_week[`${year}/${week}`];
                                comment_trend.push([weekToTimestamp(year, week, 7.5), count == undefined ? 0 : count]);
                            }
                        }
                    };
                    createScoreTrendChartData();
                    // 悬浮内容设置
                    const scoreTrendTooltip = {
                        split: false
                    };
                    // 日期格式设置
                    const scoreTrendXaxis = {
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
                    const first_week_date = new Date(weekToTimestamp(first_week[0], first_week[1])), last_week_date = new Date(weekToTimestamp(last_week[0], last_week[1])), total_weeks_passed = weekDifference(last_week_date, first_week_date) + 1;
                    const scoreTrendSeries = [
                        {
                            name: '平均分',
                            yAxis: 0,
                            data: score_trend,
                            showInLegend: false,
                            color: '#7CB5EC',
                            opacity: 1,
                            tooltip: {
                                pointFormatter() {
                                    return `<b>${this.y.toFixed(2)}</b>`;
                                }
                            }
                        }, {
                            name: '周增评分次数',
                            yAxis: 1,
                            data: comment_trend,
                            showInLegend: false,
                            color: '#E41A1C',
                            opacity: 0.5,
                            tooltip: {
                                headerFormat: '',// tooltip.formatter doesn't work, using this hack to suppress default xAxis label
                                pointFormatter() {
                                    let week_str;
                                    if (total_weeks_passed > 26) {
                                        let week_date = new Date(this.x);
                                        let week_of_year = weekOfYear(week_date);
                                        let year_of_week = yearOfWeek(week_date, week_of_year);
                                        week_str = `<span>${year_of_week}年 第${week_of_year}周</span><br/>`
                                    } else {
                                        week_str = `<span>第${weekDifference(new Date(this.x), first_week_date) + 1}周</span><br/>`;
                                    }
                                    return week_str + (this.y > 0 ? `<b>${this.y}</b>` : `<b>无评论</b>`);
                                }
                            }
                        }
                    ];
                    // 标题设置
                    const scoreTrendTitle = [
                        {
                            text: '均分走势',
                            style: {
                                color: '#808080',
                            }
                        }, {
                            text: '热度走势',
                            style: {
                                color: '#808080',
                            }
                        }
                    ];
                    // Y轴设置
                    const scoreTrendYAxis = [
                        {
                            title: {
                                text: '平均分',
                                style: {
                                    color: '#7CB5EC',
                                }
                            },
                            min: min_score - 0.2 > 0 ? min_score - 0.2 : min_score,
                            max: max_score + 0.2 < 10 ? max_score + 0.2 : 10,
                            endOnTick: true,
                            tickInterval: 0.1,
                            opposite: false
                        }, {
                            title: {
                                text: '周增评分次数',
                                style: {
                                    color: '#F28D8F',
                                }
                            },
                            min: Math.min.apply(Math, comment_trend.map((i) => { return i[1]; })),
                            max: Math.max.apply(Math, comment_trend.map((i) => { return i[1]; })),
                            endOnTick: true,
                            tickInterval: 1,
                            opposite: true
                        }
                    ];
                    // 绘图设置
                    const scoreTrendChart = {
                        backgroundColor: 'rgba(0,0,0,0)',
                        type: 'line',
                    };
                    // 图形设置
                    const scoreTrendPlotOptions = {
                        line: {
                            opacity: 1
                        }
                    };
                    // Credits设置
                    const scoreTrendChartData = {
                        chart: scoreTrendChart,
                        tooltip: scoreTrendTooltip,
                        xAxis: scoreTrendXaxis,
                        yAxis: scoreTrendYAxis,
                        title: scoreTrendTitle,
                        series: scoreTrendSeries,
                        plotOptions: scoreTrendPlotOptions,
                        legend: { enabled: false },
                        credits: { enabled: false }
                    };
                    return scoreTrendChartData;
                }
                var score_total = 0;
                score_data_barchart = new Array(10).fill(0);
                score_data_gaussian = [];
                score_elements.each(function () {
                    const score = score_parser($(this));
                    score_data_gaussian.push(score);
                    score_total += score;
                    score_data_barchart[score - 1]++;
                });
                var score_average = (score_total / score_elements.length).toFixed(2);
                var score_stddev = 0;
                score_data_gaussian.forEach(score => {
                    const dev = score - score_average;
                    score_stddev += dev * dev;
                });
                score_stddev = Math.sqrt(score_stddev) / Math.sqrt(score_elements.length);
                // adding score average to stats
                $('div.min-inner.mt40 div.box.pd10').append(`<em>&nbsp<span class="alert-success pd5" align="right">均分 ${score_average}</span></em><p/>`);
                $('div.min-inner.mt40 div.box.pd10').append(`<div id="scoreChartContainer" style="float: left; width: 100%;"></div>`);
                const psnine_stats = $('#scoreChartContainer');
                score_axis = [];
                score_axis_no_gaussian = [];
                let score_count_min = Number.MAX_SAFE_INTEGER, score_count_max = Number.MIN_SAFE_INTEGER;
                score_data_barchart_no_gaussian = score_data_barchart.slice(0);
                // 评分人数最高区间（分数）
                const max_score_count_index = score_data_barchart.indexOf(Math.max(...score_data_barchart));
                // 柱状图颜色
                let score_colors = new Array(10).fill('#3890ff'); // do not assign transparency! otherwise scoreOnclick() will break
                score_colors[max_score_count_index] = '#da314b';
                for (var score = 10; score >= 1; score--) {
                    const index = score - 1;
                    const score_count = score_data_barchart[index];
                    if (score_count == 0) {
                        score_data_barchart_no_gaussian.splice(index, 1);
                    } else {
                        if (score_count < score_count_min) {
                            score_count_min = score_count;
                        }
                        if (score_count > score_count_max) {
                            score_count_max = score_count;
                        }
                        score_data_barchart_no_gaussian[index] = { y: score_count, color: score_colors[index] };
                        score_axis_no_gaussian.unshift(score);
                    }
                    score_data_barchart[index] = { y: score_count, color: score_colors[index] };
                    score_axis.unshift(score);
                }
                psnine_stats.append('<div id="scoreBarChart" align="left" style="height: 200px;width: 50%;display: inline-block"/>');
                psnine_stats.append('<div id="scoreTrendChart" align="right" style="height: 200px;width: 50%;display: inline-block"/>');
                var charts = Highcharts.chart('scoreBarChart', createScoreBarChart(score_elements.length, score_count_min, score_count_max))
                scoreBarChartAddLabelOnclick(charts);
                Highcharts.chart('scoreTrendChart', createScoreTrendChart())
            }
        }


        // 右上角头像下拉框中增加插件设定按钮
        if (window.localStorage) {
            // 如果支持localstorage
            let newSettings = JSON.parse(JSON.stringify(settings));
            const switchSettings = [
                'hoverUnmark',
                'replyTraceback',
                'nightMode',
                'autoNightMode',
                'foldTrophySummary',
                'newQaStatus',
                'hoverHomepage',
                'autoPagingInHomepage',
                'removeHeaderInBattle',
                'autoCheckIn',
                'listPostsByNew',
                'showAllQAAnswers',
                'listQAAnswersByOld',
                'showHiddenQASubReply',
            ]; // 只有true / false的设置项
            $('.header .dropdown ul').append(`
                <li><a href="javascript:void(0);" id="psnine-enhanced-version-opensetting">插件设置</a></li>`
            );
            $('body').append(`
                <style>.setting-panel-box{z-index:9999;background-color:#fff;transition:all .4s ease;position:fixed;left:50%;transform:translateX(-50%);top:-5000px;width:500px;box-shadow:0 0 20px rgba(0,0,0,0.3);padding:10px 0;box-sizing:border-box;border-radius:4px;max-height:700px;overflow-y:scroll;scrollbar-color:#dcdcdc #fff;scrollbar-width:thin}.setting-panel-box::-webkit-scrollbar{width:4px;background-color:#fff}.setting-panel-box::-webkit-scrollbar-button{display:none}.setting-panel-box::-webkit-scrollbar-thumb{background-color:#dcdcdc}.setting-panel-box.show{top:20px}.setting-panel-box h2{margin-bottom:10px;padding-left:20px}.setting-panel-box h4{margin-bottom:10px;padding-left:20px;font-weight:400;color:#1f2f3d;font-size:22px}.setting-panel-box .row{display:flex;align-items:center;justify-content:flex-start;width:100%;margin-bottom:5px;padding-left:20px;box-sizing:border-box}.setting-panel-box .row label{line-height:32px;text-align:left;font-size:14px;color:#606266;width:190px}.setting-panel-box .row .mini{line-height:26px;text-align:left;font-size:14px;color:#606266;margin:0 10px 0 0;width:50px}.setting-panel-box .row .normal{line-height:26px;text-align:left;font-size:14px;color:#606266;margin:0 10px 0 0;width:205px}.setting-panel-box .row textarea{resize:vertical;min-height:30px;border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;line-height:26px;box-sizing:border-box;width:227px;padding:0 10px}.setting-panel-box .row input{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:227px;padding:0 10px}.setting-panel-box .row input.slider{height:6px;background-color:#e4e7ed;margin:16px 0;border-radius:3px;position:relative;cursor:pointer;vertical-align:middle;outline:none;padding:0}.setting-panel-box .row input.slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border:2px solid #409eff;background-color:#fff;border-radius:50%;transition:.2s;user-select:none}.setting-panel-box .row input.slider::-moz-range-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border:2px solid #409eff;background-color:#fff;border-radius:50%;transition:.2s;user-select:none}.setting-panel-box .row .sliderValue{margin-left:5px}.setting-panel-box .row select{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:227px;padding:0 10px}.setting-panel-box .row span{line-height:32px;text-align:left;font-size:14px;color:#606266;margin-right:10px}.setting-panel-box .btnbox{display:flex;align-items:center;justify-content:center}.setting-panel-box button{-webkit-appearance:button;padding:9px 15px;font-size:12px;border-radius:3px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #dcdfe6;color:#606266;text-align:center;box-sizing:border-box;outline:0;margin:0;transition:.1s;font-weight:500;margin:0 10px}.setting-panel-box button:hover{color:#409eff;border-color:#c6e2ff;background-color:#ecf5ff}.setting-panel-box button.confirm{color:#fff;background-color:#3890ff}.setting-panel-box button.confirm:hover{background-color:#9ec9ff}</style>
                <div class=setting-panel-box><h2>PSN中文网功能增强插件设置</h2><div class=row><a href=https://github.com/swsoyee/psnine-enhanced-version><img src=https://img.shields.io/github/stars/swsoyee/psnine-enhanced-version.svg?style=social></img></a></div><div class=row><label>夜间模式</label><select id=nightMode><option value=true>启用<option value=false>关闭</select></div><div class=row><label>自动夜间模式</label><select id=autoNightMode><option value="&quot;SYSTEM&quot;">跟随系统<option value="&quot;TIME&quot;">跟据时间<option value="&quot;OFF&quot;">关闭</select></div><div class=row><label>高亮用户ID</label><textarea name="" id="highlightSpecificID" cols="30" rows="2"></textarea></div><div class=row><label>黑名单ID</label><textarea name="" id="blockList" cols="30" rows="2"></textarea></div><div class=row><label>关键词屏蔽</label><textarea name="" id="blockWordsList" cols="30" rows="2"></textarea></div><div class=row><label>机因中显示被@的内容</label><select id=replyTraceback><option value=true>启用<option value=false>关闭</select></div><div class=row><label>悬浮显示刮刮卡内容</label><select id=hoverUnmark><option value=true>启用<option value=false>关闭</select></div><div class=row><label>个人主页下显示所有游戏</label><select id=autoPagingInHomepage><option value=true>启用<option value=false>关闭</select></div><div class=row><label>自动签到</label><select id=autoCheckIn><option value=true>启用<option value=false>关闭</select></div><div class=row><label>自动向后翻页数</label><input type=number class=normal id=autoPaging></div><div class=row><label>问答区状态优化</label><select id=newQaStatus><option value=true>启用<option value=false>关闭</select></div><div class=row><label>悬浮头像显示个人信息</label><select id=hoverHomepage><option value=true>启用<option value=false>关闭</select></div><div class=row><label>奖杯默认折叠</label><select id=foldTrophySummary><option value=true>启用<option value=false>关闭</select></div><div class=row><label>约战页面去掉发起人头像</label><select id=removeHeaderInBattle><option value=true>启用<option value=false>关闭</select></div><div class=row><label>机因、问答页面按最新排序</label><select id=listPostsByNew><option value=true>启用<option value=false>关闭</select></div><div class=row><label>载入全部问答答案</label><select id=showAllQAAnswers><option value=true>启用<option value=false>关闭</select></div><div class=row><label>答案按时间顺序排列</label><select id=listQAAnswersByOld><option value=true>启用<option value=false>关闭</select></div><div class=row><label>答案显示隐藏回复</label><select id=showHiddenQASubReply><option value=true>启用<option value=false>关闭</select></div><div class=row><label>无白金游戏图标透明度</label><input id=filterNonePlatinum class=slider type=range min=0 max=1 step=0.1><span id=filterNonePlatinumValue class=sliderValue></span></div><div class=row><label>热门标签回复数阈值</label><input id=hotTagThreshold class=slider type=range min=10 max=100 step=5><span id=hotTagThresholdValue class=sliderValue></span></div><div class=btnbox><button class=confirm>确定</button><button class=cancel>取消</button></div></div>`
            );
            // 点击打开设置面板
            $('#psnine-enhanced-version-opensetting').on('click', () => {
                $('.setting-panel-box').addClass('show');
                ['#highlightSpecificID', '#blockList'].map((item) => {
                    tippy(item, {
                        content: 'ID以英文逗号隔开，不区分大小写',
                        zIndex: 10000,
                    });
                })
                tippy('#blockWordsList', {
                    content: '屏蔽词以逗号隔开，支持正则表达式',
                    zIndex: 10000,
                });
                switchSettings.map((name, i) => {
                    let newSetting = newSettings[name];
                    let option = $(`#${name}`);
                    let optionValue = () => JSON.parse(option.children('option:selected').val());
                    if (typeof newSetting === 'object') {
                        $(`#${name} option:nth-child(${newSetting.enum.findIndex((e) => e == newSetting.value) + 1})`)
                            .attr('selected', 'true');
                        option.change(() => newSetting.value = optionValue());
                    } else {
                        $(`#${name} option:nth-child(${newSetting ? '1' : '2'})`)
                            .attr('selected', 'true');
                        option.change(() => newSettings[name] = optionValue());
                    }
                });
                // 降低无白金透明度设置
                $('#filterNonePlatinum').val(newSettings.filterNonePlatinumAlpha);
                $('#filterNonePlatinumValue').html(
                    newSettings.filterNonePlatinumAlpha * 100 + '%'
                );
                $('#filterNonePlatinum').on('input', () => {
                    const value = $('#filterNonePlatinum').val();
                    $('#filterNonePlatinumValue').html(value * 100 + '%');
                    newSettings.filterNonePlatinumAlpha = value;
                });
                // 热门标签阈值 hotTagThreshold
                $('#hotTagThreshold').val(newSettings.hotTagThreshold);
                $('#hotTagThresholdValue').html(newSettings.hotTagThreshold);
                $('#hotTagThreshold').on('input', () => {
                    const value = $('#hotTagThreshold').val();
                    $('#hotTagThresholdValue').html(value);
                    newSettings.hotTagThreshold = value;
                });
                // 自动翻页的页数设定
                $('#autoPaging').val(newSettings.autoPaging);
                // 高亮用户
                const highlightSpecificIDText = newSettings.highlightSpecificID.length
                    ? newSettings.highlightSpecificID.join(',')
                    : '';
                $('#highlightSpecificID').val(highlightSpecificIDText);
                // 黑名单
                const blockListText = newSettings.blockList.length
                    ? newSettings.blockList.join(',')
                    : '';
                $('#blockList').val(blockListText);
                // 关键词屏蔽
                const blockWordsList = newSettings.blockWordsList.length
                    ? newSettings.blockWordsList.join(',')
                    : '';
                $('#blockWordsList').val(blockWordsList);
            });
            // 点击取消
            $('.setting-panel-box .btnbox .cancel').on('click', () => {
                $('.setting-panel-box').removeClass('show');
            });
            // 点击确定
            $('.setting-panel-box .btnbox .confirm').on('click', () => {
                const highlightSpecificIDText = $.trim(
                    $('#highlightSpecificID').val().replace('，', ',')
                ).replace(/,$/, '').replace(/^,/, '');
                newSettings.highlightSpecificID = highlightSpecificIDText
                    ? highlightSpecificIDText.split(',')
                    : [];
                const blockListText = $.trim(
                    $('#blockList').val().replace('，', ',')
                ).replace(/,$/, '').replace(/^,/, '');
                newSettings.blockList = blockListText
                    ? blockListText.split(',')
                    : [];
                const blockWordsList = $.trim(
                    $('#blockWordsList').val().replace('，', ',')
                ).replace(/,$/, '').replace(/^,/, '');
                newSettings.blockWordsList = blockWordsList
                    ? blockWordsList.split(',')
                    : [];
                newSettings.filterNonePlatinumAlpha = Number($('#filterNonePlatinum').val());
                newSettings.hotTagThreshold = Number($('#hotTagThreshold').val());
                newSettings.autoPaging = Number($('#autoPaging').val());
                $('.setting-panel-box').removeClass('show');
                localStorage['psnine-night-mode-CSS-settings'] = JSON.stringify(
                    newSettings
                );
                window.location.reload();
            });
        }
    }
})();
