// ==UserScript==
// @name         PSN中文网功能增强
// @namespace    https://swsoyee.github.io
// @version      0.78
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


(function() {
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
        highlightBack : "#3890ff", // 高亮背景色
        highlightFront : "#ffffff", // 高亮字体颜色
        // 功能1-2设置：高亮具体ID功能（默认管理员id）[注：此部分功能源于@mordom0404的P9工具包：https://greasyfork.org/zh-CN/scripts/29343-p9%E5%B7%A5%E5%85%B7%E5%8C%85]
        highlightSpecificID : ["mechille", "sai8808", "jimmyleo","jimmyleohk"], // 需要高亮的ID数组
        highlightSpecificBack : "#d9534f", // 高亮背景色
        highlightSpecificFront : "#ffffff", // 高亮字体颜色
        // 功能1-6设置：屏蔽黑名单中的用户发言内容
        blockList : [], // 请在左侧输入用户ID，用逗号进行分割，如： ['use_a', 'user_b', 'user_c'] 以此类推
        // 功能1-10设置：问答根据回答状态对标题着色
        qaHighlightTitle: true,
        // 功能1-11设置：鼠标悬浮于头像显示个人奖杯卡
        hoverHomepage: true,
        // 功能2-2设置：汇率设置
        dollarHKRatio : 0.88, // 港币汇率
        dollarRatio : 6.9, // 美元汇率
        poundRatio : 7.8, // 英镑汇率
        yenRatio : 0.06, // 日元汇率
        // 功能4-3设置：汇总以获得和未获得奖杯是否默认折叠
        foldTropySummary: false, // true则默认折叠，false则默认展开
        // 功能5-1设置：是否在`游戏`页面启用降低无白金游戏的图标透明度
		filterNonePlatinumAlpha : 0.2, // 透密 [0, 1] 不透明，如果设置为1则关闭该功能
		//夜间模式
		nightMode: false,
        // 约战页面去掉发起人头像
        removeHeaderInBattle: false
    }
    Highcharts.setOptions({
        lang:{
            contextButtonTitle:"图表导出菜单",
            decimalPoint:".",
            downloadJPEG:"下载JPEG图片",
            downloadPDF:"下载PDF文件",
            downloadPNG:"下载PNG文件",
            downloadSVG:"下载SVG文件",
            drillUpText:"返回 {series.name}",
            loading:"加载中",
            months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
            noData:"没有数据",
            numericSymbols: [ "千" , "兆" , "G" , "T" , "P" , "E"],
            printChart:"打印图表",
            resetZoom:"恢复缩放",
            resetZoomTitle:"恢复图表",
            shortMonths: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
            thousandsSep:",",
            weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期天"]
        }
    });
    if(window.localStorage){
        if(window.localStorage["psnine-night-mode-CSS-settings"]){
            $.extend(settings,JSON.parse(window.localStorage["psnine-night-mode-CSS-settings"]))//用storage中的配置项覆盖默认设置
        }
    }else{
        console.log("浏览器不支持localStorage,使用默认配置项")
    }

    // 全局优化
    // 功能0-1：点击跳转到页面底部
    $(".bottombar").append("<a id='scrollbottom' class='yuan mt10'>B</a>")
    $("#scrollbottom").click(function() {
        $('body,html').animate({
            scrollTop: document.body.clientHeight
        },500);
    });

    // 功能0-1.1：恢复Header部的新闻链接
    if(settings.addNews){
        $("#pcmenu > li:nth-child(1)").before("<li><a href='https://psnine.com/news'>新闻</a></li>")
    }

	// 功能0-2：夜间模式
	if(settings.nightMode){
		$("body").append(`
            <style>li[style="background:#f5faec"]{background:#344836 !important}li[style="background:#fdf7f7"]{background:#4f3945 !important}li[style="background:#faf8f0"]{background:#4e4c39 !important}li[style="background:#f4f8fa"]{background:#505050 !important}span[style="color:blue;"]{color:#64a5ff !important}span[style="color:red;"]{color:#ff6464 !important}span[style="color:brown;"]{color:#ff8864 !important}.tit3{color:white !important}.mark{background:#bbb !important;color:#bbb}body.bg{background:#2b2b2b !important}.list li,.box .post,td,th{border-bottom:1px solid #333}.content{color:#bbb !important}.psnnode{background:#656565}.box{background:#3d3d3d !important}.title a{color:#bbb}.text-strong,strong{color:#bbb !important}.twoge{color:white !important}.storeinfo{color:#bbb !important}.alert-warning{background:#4d4d4d !important}.alert-info{background:#5e5e5e !important}.alert-success{background:#4b4b4b !important}h1,.title2{color:#fff !important}.inav{background:#3d3d3d !important}.inav li.current{background:#4b4b4b !important}.ml100 p{color:#fff !important}.t1{background:#657caf !important}.t2{background:#845e2f !important}.t3{background:#707070 !important}.t4{background:#8b4d2d !important}blockquote{background:#bababa !important}.text-gray{color:#bbb !important}.tradelist li{color:white !important}.tbl{background:#3c3c3c !important}.genelist li:hover,.touchclick:hover{background:#333 !important}.cloud{background-color:#3c3c3c!important}.showbar{background:radial-gradient(at center top,#7B8492,#3c3c3c)}.side .darklist{background-color:#3c3c3c}.side .hd3{background-color:#222}.header,.dropdown ul{background-color:#222}.list li .sonlist li{background-color:#333}.node{background-color:#3b4861}.rep{background-color:#3b4861}.btn-gray{background-color:#666}</style>
		`)
	}

    // 功能0-3：黑条文字鼠标悬浮显示
    if(settings.hoverUnmark){
        $(".mark").hover(function(i){
            var backGroundColor = $(".box.mt20").css("background-color")
            $(this).css({"color": backGroundColor})
        }, function(o){
            var sourceColor = $(this).css("background-color")
            $(this).css({"color": sourceColor})
        })
    }
    // 功能0-4：markdown语法支持测试

    // 功能0-5：自动签到
    if( $("[class$=yuan]").length > 0 ) {
        $("[class$=yuan]").click()
    }

    // 功能0-6：自动翻页
    if(settings.autoPaging > 0) {
        var isbool = true; //触发开关，防止多次调用事件
        $("body").append("<div id='loadingMessage' style='position: absolute;bottom: 0px;position: fixed;right: 1px !important;display:none; color:white;'></div>")
        if(/((gene($|\?))|(qa($|\?))|(topic($|\?))|(planlist($|\?))|(gamelist($|\?))|(trade($|\?)))/.test(window.location.href)) {
            var autoPagingLimitCount = 0;
            $(window).scroll(function() {
                //当内容滚动到底部时加载新的内容
                if ($(this).scrollTop() + $(window).height() + 700 >= $(document).height() && $(this).scrollTop() > 700 && isbool == true && autoPagingLimitCount < settings.autoPaging) {
                    isbool = false;
                    // 获取下一页页码
                    var nextPage = Number($(".page > ul > .current:last").text()) + 1
                    // 如果地址已经有地址信息
                    var nextPageLink = ''
                    if(/page/.test(window.location.href)) {
                        nextPageLink = window.location.href.replace(/page=.+/, "page=" + nextPage)
                    } else {
                        nextPageLink = window.location.href + "&page=" + nextPage
                    }
                    // 加载页面并且插入
                    $("#loadingMessage").text("加载第" + nextPage + "页...")
                    $("#loadingMessage").show()
                    $(".page:last").after("<div class='loadPage" + nextPage + "'></div>")
                    $.get(`${nextPageLink}`, {}, function(data) {
                        var $response = $('<div />').html(data);
                        $(`.loadPage${nextPage}`).append($response.find('.list')).append($response.find('.page'));
                        isbool = true;
                        autoPagingLimitCount++;
                        // 各个页面的功能追加
                        addHighlightOnID()
                        filterUserPost()
                        addHoverProfile()
                        if (/\/qa/.test(window.location.href) ) {
                            addColorToQaTitle()
                        }
                    },'html');
                    setTimeout(function(){$("#loadingMessage").fadeOut();},2000);
                }
            });
        }
    }
    // 功能0-7：个人主页下显示所有游戏
    if(settings.autoPagingInHomepage) {
        var isbool2 = true; //触发开关，防止多次调用事件
        $("body").append("<div id='loadingMessage' style='position: absolute;bottom: 0px;position: fixed;right: 1px !important;display:none; color:white;'></div>")
        if(/psnid\/[A-Za-z0-9_]+$/.test(window.location.href)) {
            var gamePageIndex = 2
            $(window).scroll(function() {
                if ($(this).scrollTop() + $(window).height() + 700 >= $(document).height() && $(this).scrollTop() > 700 && isbool2 == true) {
                    isbool2 = false;
                    var gamePage = window.location.href + "/psngame?page=" + gamePageIndex
                    // 加载页面并且插入
                    $("#loadingMessage").text("加载第" + gamePageIndex + "页...")
                    $("#loadingMessage").show()
                    $.get(gamePage, {}, function(data) {
                        var $response = $('<div />').html(data);
                        var nextGameContent = $response.find('tbody > tr')
                        if(nextGameContent.length > 0) {
                            $("tbody > tr:last").after(nextGameContent);
                            isbool2 = true;
                            gamePageIndex += 1
                        } else {
                            $("#loadingMessage").text("没有更多游戏了...")
                        }
                    },'html');
                    setTimeout(function(){$("#loadingMessage").fadeOut();},2000);
                }
            })
        }
    }
    // 帖子优化
    // 功能1-1：高亮发帖楼主
    if( /(gene|trade|topic)\//.test(window.location.href) & !/comment/.test(window.location.href)) {
        // 获取楼主ID
        var author = $(".title2").text()
        $(".psnnode").map(function(i, n){
            // 匹配楼主ID，变更CSS
            if( $(n).text() == author) {
                $(n).after('<div class="psnnode author" style="padding:0px 5px; border-radius:2px; display: inline-block;background-color:' + settings.highlightBack + '; color: ' + settings.highlightFront + '">楼主</div>')
            }
        })
    }
    // 功能1-2：高亮用户ID
    function addHighlightOnID() {
        settings.highlightSpecificID.map(function(i, n) {
            $('.meta>[href="' + window.location.href.match("(.*)\.com")[0] + '/psnid/' + i + '"]').css({ "background-color": settings.highlightSpecificBack, "color": settings.highlightSpecificFront })
        });
    }
    addHighlightOnID()

    // 功能1-3：主题中存在 -插图- 一项时，提供预览悬浮窗
    $("a[target='_blank']").html(function(i, url){
        if(url == " -插图- ") {
            var xOffset = 5;
            var yOffset = 5;
            var imgUrl = $(this).attr('href');
            $(this).hover(function(e){
                $("body").append($('<span id="hoverImage"><img src="' + imgUrl + '" onload="if (this.width > 500) this.width=500;"</img></span>'))
                $("#hoverImage")
                    .css({"position": "absolute", "border": "1px solid #ccc", "display": "none", "padding": "5px", "background": "#333"})
                    .css("top",(e.pageY - xOffset) + "px")
                    .css("left",(e.pageX + yOffset) + "px")
                    .fadeIn(500)
            }, function(){
                $("#hoverImage").remove()
            })
            $(this).mousemove(function(e){
                $("#hoverImage")
                    .css("top",(e.pageY - xOffset) + "px")
                    .css("left",(e.pageX + yOffset) + "px");
            });
        }
    })
    // 功能1-4：回复内容回溯，仅支持机因、主题（目前仅限主贴，common下不会显示）
    if( /(gene|topic|trade)\//.test(window.location.href) && settings.replyTraceback) {
        GM_addStyle (`.replyTraceback {background-color: rgb(0, 0, 0, 0.05) !important; padding: 10px !important; color: rgb(160, 160, 160, 1) !important; border-bottom: 1px solid !important;}`)
        // 每一层楼的回复外框 (0 ~ N - 1)
        var allSourceOutside = document.querySelectorAll(".post > .ml64") // 30楼的话是29
        // 每一层楼的回复框(0 ~ N - 1) floor
        var allSource = document.querySelectorAll(".post .ml64 > .content") // 30楼的话是29
        // 每一层楼的回复者名字( 0 ~ N - 1)
        var userId = document.querySelectorAll(".post > .ml64 > [class$=meta]") // 30楼的话是29
        // 每一层的头像(0 ~ N - 1)
        var avator = document.querySelectorAll(".post > a.l") // 30楼的话是29
        for(var floor = allSource.length - 1; floor > 0 ; floor -- ) {
            // 层内内容里包含链接（B的发言中是否有A）
            var content = allSource[floor].querySelectorAll("a")
            if(content.length > 0) {
                for(var userNum = 0; userNum < content.length; userNum++ ){
                    // 对每一个链接的文本内容判断
                    var linkContent = content[userNum].innerText.match("@(.+)")
                    // 链接里是@用户生成的链接， linkContent为用户名（B的发言中有A）
                    if(linkContent != null) {
                        var replayBox = document.createElement("div")
                        replayBox.setAttribute("class", "replyTraceback")
                        // 从上层开始，回溯所@的用户的最近回复（找最近的一条A的发言）
                        var traceIdFirst = -1
                        var traceIdTrue = -1
                        for(var traceId = floor - 1; traceId >= 0; traceId -- ){
                            // 如果回溯到了的话，选取内容
                            // 回溯层用户名
                            var thisUserID = userId[traceId].getElementsByClassName("psnnode")[0].innerText
                            if( thisUserID == linkContent[1].toLowerCase()){
                                // 判断回溯中的@（A的发言中有是否有B）
                                if ( allSource[traceId].innerText.indexOf(userId[floor].getElementsByClassName("psnnode")[0].innerText) > -1) {
                                    traceIdTrue = traceId;
                                    break;
                                } else if (traceIdFirst == -1) {
                                    traceIdFirst = traceId;
                                }
                            }
                        }
                        var outputID = -1
                        if( traceIdTrue != -1){
                            outputID = traceIdTrue
                        } else if (traceIdFirst != -1) {
                            outputID = traceIdFirst
                        }
                        // 输出
                        if(outputID != -1) {
                            var replyContents = ""
                            if(allSource[outputID].innerText.length > 45) {
                                replyContents = allSource[outputID].innerText.substring(0, 45) + "......"
                            } else {
                                replyContents = allSource[outputID].innerText
                            }
                            var avatorImg = avator[outputID].getElementsByTagName("img")[0].getAttribute("src")
                            replayBox.innerHTML = '<div class="responserHeader" style="display: inline-block; padding-right: 10px; color: #666"><img src="' +
                                avatorImg + '" height="25" width="25"> ' + linkContent[1] + '</img>'+
                                '</div><div class="responserContent_' + floor + '_' + outputID + '" style="display: inline-block;">&nbsp' +
                                replyContents + "</div>"
                            allSourceOutside[floor].insertBefore(replayBox, allSource[floor])
                            // 如果内容超过45个字符，则增加悬浮显示全文内容功能
                            if(allSource[outputID].innerText.length > 45) {
                                tippy('.responserContent_' + floor + '_' + outputID, {
                                    content: allSource[outputID].innerText,
                                    animateFill: false
                                })
                            }
                        }
                    }
                }
            }
        }
    }
    // 功能1-5：增加帖子楼层信息
    $("span[class^=r]").map(function(i,n){
        if(i > 0) {
            $(this).children("a:last").after("&nbsp&nbsp<span>#"+i+"</span>")
        }
    })
    // 功能1-6：屏蔽黑名单中的用户发言内容
    function Filter(psnnode, parent, userList) {
                $(psnnode).map(function(i,v){
                    if($(v).html().toLowerCase() == userList.toLowerCase() ){
                        $(v).parents(parent).hide()
                    }
                })
            }
    function filterUserPost() {
        if (settings.blockList.length > 0) {
            settings.blockList.map((user,i)=>{
                if(window.location.href.indexOf("gene") > -1){
                    Filter("div.post .psnnode", "div.post", user)
                    Filter(".touchclick .psnnode", ".touchclick", user)
                }
            })
        }
    }
    filterUserPost()

    // 功能1-7：实时统计创建机因时候的文字数
    if( /set\/gene/.test(window.location.href)){
        $(".pr20 > textarea[name='content']").before("<div style='color:#c09853'><p>字数：<span class='wordCount'>0</span>/600</p></div>")
        $(".pr20 > textarea[name='content']").keyup(function(){
            document.getElementsByClassName("wordCount")[0].innerHTML = document.getElementsByName("content")[0].value.replace(/\n|\r/gi,"").length
        });
    }

    // 功能1-8：基因回复按钮hover触发显示
	if(window.location.href.match(/gene\/\d+$/)){
		$(".post .r").css({
			opacity:0,
			transition:"all 0.2s ease"
		})
		$(".post").hover(function(){
			$(this).find(".r").css({
				opacity:1
			})
		},function(){
			$(this).find(".r").css({
				opacity:0
			})
		})
	}

    // 功能1-9：发帖BBCode实时渲染
    if( /node\/talk\/add/.test(window.location.href)){
        $(".alert-warning.pd10.lh180").before("<div class='content pb10' style='padding:10px;' id='output'></div>")
        function replaceAll(str,mapObj){
            for(var i in mapObj) {
                var re = new RegExp(i, "g");
                str = str.replace(re, mapObj[i])
            }
            return str
        }
        var bbcode = {'\\[quote\\](.+?)\\[\/quote\\]': '<blockquote>$1</blockquote>',
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
                      '\\n': '<br/>'}
         $("textarea[name='content']").keyup(function(){
             var bbcodeSource = document.getElementsByName("content")[0].value
             var outputContent = replaceAll(bbcodeSource, bbcode)
            $("#output").html(outputContent)
        });
    }

    // 功能1-10：问答标题根据回答状况着色
    function addColorToQaTitle(){
        if(settings.qaHighlightTitle) {
            $("div.meta > .r > span:nth-child(2)").map( function(i, v) {
                $(this).parent().parent().prev().children("a").css("color", $(this).css("color"))
            })
        }
    }
    if (/\/qa/.test(window.location.href) ) {
        addColorToQaTitle()
    }

    // 功能1-11：悬浮于头像显示个人界面
    function addHoverProfile() {
        if(settings.hoverHomepage) {
            const INITIAL_CONTENT = '加载中...'
            $(".l[href*='psnid/']").map(function(i, v) {
                var url = $(this).attr("href");
                $(this).attr("id", "profile" + i)
                tippy("#profile" + i, {
                    content: INITIAL_CONTENT,
                    delay: 700,
                    maxWidth: "500px",
                    animateFill: false,
                    interactive: true,
                    placement: "left",
                    async onShow(tip) {
                        if (!tip.state.ajax) {
                            tip.state.ajax = {
                                isFetching: false,
                                canFetch: true,
                            }
                        }
                        if (tip.state.ajax.isFetching || !tip.state.ajax.canFetch) {
                            return
                        }
                        tip.state.ajax.isFetching = true
                        tip.state.ajax.canFetch = false
                        try {
                            $.ajax({
                                type : "GET",
                                url : url,
                                dataType : "html",
                                success: function(data) {
                                    var reg = /[\s\S]*<\/body>/g;
                                    var html = reg.exec(data)[0];
                                    var inner = $(html).find(".psnzz").parent().get(0)
                                    $(inner).find(".inner").css("max-width", "400px")
                                    tip.setContent(inner)
                                },
                                error : function() {
                                    console.log("无法获取页面信息");
                                }
                            });
                        } catch (e) {
                            tip.setContent(`获取失败：${e}`)
                        } finally {
                            tip.state.ajax.isFetching = false
                        }
                    },
                    onHidden(tip) {
                        tip.state.ajax.canFetch = true
                        tip.setContent(INITIAL_CONTENT)
                    },
                })
            })
        }
    }
    addHoverProfile()

    // 商城优化
    // 功能2-1：商城价格走势图
    if( /\/dd/.test(window.location.href) ) {
        // 日期转换函数
        function converntTime(value) {
            var timeArray = value.replace('年','-').replace('月','-').replace('日','').split("-")
            timeArray[0] = "20" + timeArray[0]
            timeArray[1] = Number(timeArray[1]) - 1
            return Date.UTC(timeArray[0], timeArray[1], timeArray[2])
        }
        // 获取X轴的日期
        var xContents = document.querySelectorAll("p.dd_text")
        var xValue = [];
        var today = new Date()
        var todayArray = Date.UTC(today.getYear() + 1900, today.getMonth(), today.getDate())
        for(var xindex = 3; xindex < xContents.length; xindex+=4 ){
            var tamp = xContents[xindex].innerText.split(" ~ ")
            tamp[0] = converntTime(tamp[0])
            tamp[1] = converntTime(tamp[1])
            xValue = [tamp[0], tamp[0], tamp[1], tamp[1]].concat(xValue)
        }

        //获取价格
        var y = document.querySelectorAll(".dd_price")

        var yValueNormal = [];
        var yValuePlus = [];
        for(var yindex = 0; yindex < y.length; yindex++ ){
            var yPriceOld = y[yindex].querySelector(".dd_price_old").innerText
            var yPriceNormal = y[yindex].querySelector(".dd_price_off").innerText
            var yPricePlus = y[yindex].querySelector(".dd_price_plus")

            yValueNormal = [yPriceOld, yPriceNormal, yPriceNormal, yPriceOld].concat(yValueNormal)
            var pricePlusTamp = ""
            if( yPricePlus == null ){
                pricePlusTamp = yPriceNormal
            } else {
                pricePlusTamp = yPricePlus.innerText
            }
            yValuePlus = [yPriceOld, pricePlusTamp, pricePlusTamp, yPriceOld].concat(yValuePlus)
        }
        // 普通价格数据
        var xForPlotNormal = new Array()
        var xForPlotPlus = new Array()
        // 判断地区
        var replaceString = ""
        if( yValueNormal[0].search("HK\\$") > -1 ){
            replaceString = "HK$"
        }
        else if( yValueNormal[0].search("\\$") > -1 ){
            replaceString = "$"
        }
        else if( yValueNormal[0].search("\\£") > -1 ){
            replaceString = "£"
        } else {
            replaceString = "¥"
        }
        for(var i = 0; i < xValue.length; i++ ){
            xForPlotNormal[i] = [xValue[i], Number(yValueNormal[i].replace(replaceString, ""))]
            xForPlotPlus[i] = [xValue[i], Number(yValuePlus[i].replace(replaceString, ""))]
        }
        // 修正最后一组数据
        if( xForPlotNormal[xForPlotNormal.length - 1][0] > todayArray ){
            xForPlotNormal.pop()
            xForPlotPlus.pop()
            xForPlotNormal[xForPlotNormal.length - 1][0] = todayArray
            xForPlotPlus[xForPlotPlus.length - 1][0] = todayArray
        } else {
            xForPlotNormal.push([todayArray, xForPlotNormal[xForPlotNormal.length - 1][1]])
            xForPlotPlus.push([todayArray, xForPlotPlus[xForPlotPlus.length - 1][1]])
        }
        // 插入页面
        $(".pd10").append (`<div id="container"></div>`);

        var chart = {
            type: 'areaspline',
            backgroundColor: 'rgba(0,0,0,0)'
        };
        var title = {
            text: '价格变动走势图',
            style: {
                color: '#808080'
            }
        };
        var xAxis = {
            type: 'datetime',
            dateTimeLabelFormats: {
                year: '%y年',
                day: '%y年<br/>%b%e日',
                week: '%y年<br/>%b%e日',
                month: '%y年<br/>%b'
            },
            title: {
                text: '日期'
            }
        };
        var yAxis = {
            title: {
                text: '价格'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        };
        var tooltip = {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%y年%b%e日}: '+ replaceString + '{point.y:.2f}'

        };
        var plotOptions = {
            areaspline: {
                fillOpacity: 0.25
            }
        };
        var series= [{
            name: '普通会员价',
            color: '#00a2ff',
            data: xForPlotNormal
        }, {
            name: 'PS+会员价',
            color: '#ffd633',
            data: xForPlotPlus
        }
                    ];
        var credits = {
            enabled : false
        };
        var legend = {
            itemStyle: {
                color: '#808080'
            },
            itemHoverStyle: {
                color: '#3890ff'
            }
        }
        var json = {};
        json.chart = chart;
        json.title = title;
        json.tooltip = tooltip;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.series = series;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.legend = legend;

        $('#container').highcharts(json);

        // 功能2-2：外币转人民币
        // 转换原始价格
        function foreignCurrency(price, mark, ratio) {
            return [Number(price[0].replace(mark, "")) * ratio, Number(price[1].replace(mark, "")) * ratio, Number(price[2].replace(mark, "")) * ratio]
        }
        $(".dd_price").map(function(i, n){
            var price = [$(this).children().eq(0).text(), $(this).children().eq(1).text(), $(this).children().eq(2).text()]
            var CNY = [0, 0, 0]
            var offset = 3
            if( /dd\//.test(window.location.href) ) {
                offset = 2
            }
            var region = $(".dd_info p:nth-child(" + offset + ")").eq(i).text()
            if( region == "港服" ){
                CNY = foreignCurrency(price, "HK$", settings.dollarHKRatio)
            } else if( region == "美服" ) {
                CNY = foreignCurrency(price, "$", settings.dollarRatio)
            } else if( region == "日服" ) {
                CNY = foreignCurrency(price, "¥", settings.yenRatio)
            } else if( region == "英服" ) {
                CNY = foreignCurrency(price, "£", settings.poundRatio)
            } else {
                CNY = foreignCurrency(price, "¥", 1)
            }
            $(".dd_price span:last-child").eq(i).after("&nbsp&nbsp<s class='dd_price_old'>¥" + CNY[0].toFixed(2) + "</s><span class='dd_price_off'>¥" + CNY[1].toFixed(2) + "</span>")
            if(CNY[2] > 0){
                $(".dd_price span:last-child").eq(i).after("</span><span class='dd_price_plus'>¥" + CNY[2].toFixed(2) + "</span>")
            }
        })

        // 功能2-3：页面上方增加翻页
        $(".dropmenu").after($(".page").clone())

        // 功能2-4：根据降价幅度变更标题颜色
        $(".dd_box").map(function(i,n){
            var offPercent = Number($(this).children(".dd_pic").children("div").eq(0).text().replace("省", "").replace("%", ""))
            if( offPercent >= 80 ){
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(220,53,69)"})
            } else if( offPercent >= 50 & offPercent < 80) {
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(253,126,20)"})
            } else if( offPercent >= 20 & offPercent < 50) {
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(255,193,7)"})
            } else {
                $(".dd_title.mb10>a").eq(i).css({"color":"rgb(40,167,69)"})
            }
        })
    }

    // 功能2-5：活动页面根据降价幅度变更背景色
    if(/huodong/.test(window.location.href)){
        var unitContainer = $(".store_ul").children
        // console.log(unitContainer)
        //for(var unitIndex = 0; unitIndex < unitContainer.length; unitIndex++ ){
        //    var pricePer = Number(unitContainer.item(unitIndex).children[0].children[1].textContent.replace("省", "").replace("%", ""))
        //    console.log(pricePer)
       // }
    }


    // 奖杯系统优化
    // 功能3-1：游戏奖杯界面可视化
    if( /psngame\//.test(window.location.href) && /^(?!.*comment)/.test(window.location.href)) {
        // 游戏奖杯比例图
        var platinum = document.getElementsByClassName("text-platinum")[0].innerText.replace("白", "")
        var gold = document.getElementsByClassName("text-gold")[0].innerText.replace("金", "")
        var silver = document.getElementsByClassName("text-silver")[0].innerText.replace("银", "")
        var bronze = document.getElementsByClassName("text-bronze")[0].innerText.replace("铜", "")

        // 奖杯稀有度统计
        var rareArray = [0, 0, 0, 0, 0]
        for(var rareIndex = 1; rareIndex <= 4; rareIndex++ ){
            var rareValue = document.getElementsByClassName("twoge t" + rareIndex + " h-p")
            for(var j = 0; j < rareValue.length; j ++ ) {
                var rarity = Number(rareValue[j].innerText.split("\n")[0].replace("%", ""))
                if( rarity <= 5 ) {
                    rareArray[0]++ // 极度珍贵
                } else if ( rarity > 5 & rarity <= 10 ) {
                    rareArray[1]++ // 非常珍贵
                } else if ( rarity > 10 & rarity <= 20 ) {
                    rareArray[2]++ // 珍贵
                } else if ( rarity > 20 & rarity <= 50 ) {
                    rareArray[3]++ // 罕见
                } else {
                    rareArray[4]++ // 普通
                }
            }
        }

        var trophyRatioChart = {
            backgroundColor: 'rgba(0,0,0,0)'
        };
        var trophyRatioTooltip = {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        };
        var trophyRatioPlotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: -20,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textOutline: "0px contrast"
                    },
                    formatter: function() {
                        return this.point.y;
                    }
                }
            }
        };
        var trophyRatioSeries= [{
            type: 'pie',
            name: '比例',
            data: [
                { name: '白金', y: Number(platinum), color: '#7a96d1' },
                { name: '金', y: Number(gold), color: '#cd9a46' },
                { name: '银', y: Number(silver), color: '#a6a6a6' },
                { name: '铜', y: Number(bronze), color: '#bf6a3a' },
            ],
            center: [50, 30],
            size: 130
        }, {
            type: 'pie',
            name: '比例',
            data: [
                { name: '极度珍贵', y: rareArray[0], color: 'rgb(160, 217, 255)' },
                { name: '非常珍贵', y: rareArray[1], color: 'rgb(124, 181, 236)' },
                { name: '珍贵', y: rareArray[2], color: 'rgb(88, 145, 200)' },
                { name: '罕见', y: rareArray[3], color: 'rgb(52, 109, 164)' },
                { name: '一般', y: rareArray[4], color: 'rgb(40, 97, 152)' },
            ],
            center: [200, 30],
            size: 130
        }];
        var trophyRatioTitle = {
            text: '奖杯统计',
            style: {
                color: '#808080'
            }
        };
        var trophyRatio = {};
        trophyRatio.chart = trophyRatioChart;
        trophyRatio.tooltip = trophyRatioTooltip;
        trophyRatio.title = trophyRatioTitle;
        trophyRatio.series = trophyRatioSeries;
        trophyRatio.plotOptions = trophyRatioPlotOptions;
        trophyRatio.credits = credits;
        // 插入页面
        $(".box.pd10").append (`<p></p><div id="trophyRatioChart" align="left" style="width: 320px; height: 200px; margin: 0 0; display: inline-block;"></div>`);
        $('#trophyRatioChart').highcharts(trophyRatio);

        // 奖杯获得时间年月统计
        var getTimeArray = []
        var timeElements = document.getElementsByClassName("lh180 alert-success pd5 r")
        if( timeElements.length > 0 ) {
            for(var timeIndex = 0; timeIndex < timeElements.length; timeIndex ++ ){
                var dayTime = document.getElementsByClassName("lh180 alert-success pd5 r")[timeIndex].innerText
                var yearTips = ""
                // 时间丢失奖杯bug修复
                if(dayTime == "时间丢失") {
                    dayTime = document.getElementsByClassName("lh180 alert-success pd5 r")[0].innerText.split("\n")
                    yearTips = Number(timeElements[0].getAttribute("tips").replace("年", ""))
                } else {
                    dayTime = dayTime.split("\n")
                    yearTips = Number(timeElements[timeIndex].getAttribute("tips").replace("年", ""))
                }
                var monthDay = dayTime[0].split("-")
                var houtMinute = dayTime[1].split(":")
                var xTime = Date.UTC(yearTips, Number(monthDay[0]) - 1, Number(monthDay[1]), Number(houtMinute[0]), Number(houtMinute[1]))
                getTimeArray.push(xTime)
            }
            getTimeArray.sort()
            var getTimeArrayX = []
            for(var k = 1; k <= timeElements.length; k ++){
                getTimeArrayX.push([getTimeArray[k - 1], k])
            }
            // 调整白金时间
            getTimeArrayX[getTimeArrayX.length - 1][0] += 60000

            var trophyGetTimeTooltip = {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            };
            var trophyGetTimeXaxis = {
                type: 'datetime',
                dateTimeLabelFormats: {
                    second: '%Y-%m-%d<br/>%H:%M:%S',
                    minute: '%Y-%m-%d<br/>%H:%M',
                    hour: '%Y-%m-%d<br/>%H:%M',
                    day: '%Y<br/>%m-%d',
                    week: '%Y<br/>%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                },
                title: {
                    display: false
                }
            };
            var trophyGetTimeSeries = [{
                type: 'spline',
                name: '获得数目',
                data: getTimeArrayX,
                showInLegend: false
            }]
            var trophyGetTimeTitle = {
                text: '奖杯获得时间',
                style: {
                    color: '#808080'
                }
            };
            var trophyGetTimeYAxis = {
                title: {
                    text: '奖杯获得个数'
                },
                min: 0
            };
            var trophyGetTime = {};
            trophyGetTime.chart = trophyRatioChart;
            trophyGetTime.tooltip = trophyGetTimeTooltip;
            trophyGetTime.xAxis = trophyGetTimeXaxis;
            trophyGetTime.yAxis = trophyGetTimeYAxis;
            trophyGetTime.title = trophyGetTimeTitle;
            trophyGetTime.series = trophyGetTimeSeries;
            trophyGetTime.credits = credits;
            // 插入页面
            $(".box.pd10").append (`<div id="trophyGetTimeChart" align="left" style="width: 460px; height: 200px; margin: 0 0; display: inline-block;"></div>`);
            $('#trophyGetTimeChart').highcharts(trophyGetTime);
        }

        // 功能3-3：汇总以获得和未获得奖杯
        var tropyTitleStyle = "border-radius: 2px; padding:5px; background-color:" + $("li.current").css("background-color") + ";"
        // tippy弹出框的样式
        GM_addStyle (`.tippy-tooltip.psnine-theme {background-color: ` + $(".box").css("background-color") + `}`)
        // 奖杯tips颜色
        var tipColor = ""
        // 创建奖杯汇总框架函数
        function createTropyContainer (object, className, title) {
            // 添加标题框在汇总图下
            $(".box.pd10").append(`<div class='${className}'><p class='tropyCount' style='${tropyTitleStyle}'></p><div class='tropyContainer' style='padding:5px;'></div></div>`)
            object.map(function(i, v) {
                // 如果这个奖杯有Tips，就设置左边框为绿色，否则就为底色（边框颜色和底色一致）
                if($(this).parent().parent().next().find(".alert-success.pd5").length > 0 ){
                    tipColor = "#8cc14c"
                } else {
                    tipColor = $(".box").css("background-color")
                }
                // 添加奖杯图标
                $( `.${className}> .tropyContainer`).append(`<span id='${className}Small${i}' style='padding:3px; border-left: 3px solid ${tipColor};'><a href='` + $(this).parent().attr("href") + `'><img src='` + $(this).attr("src") + `' width='30px'></img><a></span>`)
                // 添加鼠标悬浮弹出消息
                tippy(`#${className}Small${i}`, {
                    content: "<div><span>" + $(this).parent().parent().html() + "</span><p></p><span>" + $(this).parent().parent().next().html() + "</span></div>",
                    theme: 'psnine',
                    animateFill: false
                })
            })
            // 给奖杯汇总标题填充文字
            $(`.${className}> .tropyCount`).append("<span style='color:#808080;'>" + title + "：<span class='text-platinum'>白" + object.parent().parent(".t1").length +
                                                   "</span><span class='text-gold'> 金" + object.parent().parent(".t2").length +
                                                   "</span><span class='text-silver'> 银" + object.parent().parent(".t3").length +
                                                   "</span><span class='text-bronze'> 铜" + object.parent().parent(".t4").length +
                                                   "<span class='text-strong'> 总" + object.length +
                                                   "</span></span>")
        }
        // 创建已获得奖杯汇总框
        createTropyContainer($(".imgbg.earned"), "earnedTropy", "已获得奖杯")
        // 创建未获得奖杯汇总框
        createTropyContainer($("img[class$='imgbg']"), "notEarnedTropy", "未获得奖杯")
        $('span[id^="notEarnedTropySmall"] > a > img').css({"filter": "grayscale(100%)"}) // 变黑白
        // 折叠奖杯汇总
        // 奖杯图标设置为不可见
        if( settings.foldTropySummary ) {
            $(".tropyContainer").css("display", "none");
        }
        // 单击奖杯汇总标题后展开奖杯图标
        $(".tropyCount").click(function () {
            $(this).next().slideToggle();
        })

        // 功能3-3：追加奖杯筛选功能
        function selectUnget() {
            $(".lh180.alert-success.pd5.r").parent().parent().hide()
        }
        $(".dropmenu").append("<li><em>筛选</em></li>") // 追加“筛选”字样
        // 追加“未获得”的按钮
        $(".dropmenu").append("<a id='selectUnget' style='padding:0px 5px; margin-left:10px; border-radius:2px; display: inline-block; color: white;background-color: #3890ff; cursor:pointer; line-height:24px;'>尚未获得</a>")
        // 点击按钮隐藏或者显示
        var clickHideShowNum = 0;
        $('#selectUnget').click(function() {
            $(".lh180.alert-success.pd5.r").parent().parent().toggle("slow", function(){
                if(clickHideShowNum ++ %2 == 0){
                    $("#selectUnget").text("显示全部")
                    $("#selectUnget").css("background-color","#9ec9ff");
                } else {
                    $("#selectUnget").text("尚未获得")
                    $("#selectUnget").css("background-color","#3890ff");
                }
            })
        })
    }

    // 游戏页面优化

    if(/psngame/.test(window.location.href) & !/psnid/.test(window.location.href)) {
        // 功能5-1：降低没有白金的游戏的图标亮度
        if(settings.filterNonePlatinumAlpha < 1){
            $("tr").map(function(i,n){
                // 读取白金数量
                var platinumNum = $(this).children(".pd1015.title.lh180").children("em").children(".text-platinum").text().replace("白", "")
                if(platinumNum == 0) {
                    $(this).children(".pdd15").children("a").children("img").css({"opacity": settings.filterNonePlatinumAlpha})
                }
            })
        }
        // 功能5-2：悬浮图标显示自己的游戏的完成度
        $(".imgbgnb").map(function(i,n){
            $(this).attr("id", "game" + i)
            var psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/)//从cookie中取出psnid
            if(psnidCookie){
                var psnid = psnidCookie[1]
                var myGameUrl = $(this).parent().attr("href") + `?psnid=${psnid}`
            }
            tippy("#game" + i, {
                content: "加载中",
                animateFill: false,
                placement: "left",
                delay: 500,
                async onShow(tip) {
                        if (!tip.state.ajax) {
                            tip.state.ajax = {
                                isFetching: false,
                                canFetch: true,
                            }
                        }
                        if (tip.state.ajax.isFetching || !tip.state.ajax.canFetch) {
                            return
                        }
                        tip.state.ajax.isFetching = true
                        tip.state.ajax.canFetch = false
                        try {
                            $.ajax({
                                type : "GET",
                                url : myGameUrl,
                                dataType : "html",
                                success: function(data) {
                                    var reg = /[\s\S]*<\/body>/g;
                                    var html = reg.exec(data)[0];
                                    var inner = $(html).find("td > em > .text-strong")
                                    if(inner.length > 0){
                                        tip.setContent("你的奖杯完成度：" + inner.text())
                                    } else {
                                        tip.setContent("你还没有获得该游戏的任何奖杯")
                                    }
                                },
                                error : function() {
                                    console.log("无法获取页面信息");
                                }
                            });
                        } catch (e) {
                            tip.setContent(`获取失败：${e}`)
                        } finally {
                            tip.state.ajax.isFetching = false
                        }
                    },
                    onHidden(tip) {
                        tip.state.ajax.canFetch = true
                        tip.setContent("加载中")
                    },
            })
        })
    }

    // 约战页面可以选择去掉发起人头像
    if(settings.removeHeaderInBattle) {
        if(/battle$/.test(window.location.href)) {
            $(".pdd15.h-p").hide()
        }
    }

    // 进入游戏页默认查看我自己的奖杯
    if(window.location.href.match(/psngame\/\d+$/) && !/psnid/.test(window.location.href)){//检查游戏页
        var psnidCookie = document.cookie.match(/__Psnine_psnid=(\w+);/)//从cookie中取出psnid
        if(psnidCookie){
            var psnid = psnidCookie[1]
            window.location.href+=`?psnid=${psnid}`
        }
    }

    // 奖杯心得页面输入框可缩放大小
    if(window.location.href.match(/trophy\/\d+$/)){
        $("#comment").css({
            "resize":"vertical",
            "minHeight":200
        });
    }

    // 右上角头像下拉框中增加插件设定按钮
    if(window.localStorage){ // 如果支持localstorage
        var newSettings = JSON.parse(JSON.stringify(settings))
        $(".header .dropdown ul").append(`
            <li><a href="javascript:void(0);" id="psnine-enhanced-version-opensetting">插件设置</a></li>
        `)
        $("body").append(`
<style>.setting-panel-box{z-index:9999;background-color:#fff;transition:all .4s ease;position:fixed;left:50%;transform:translateX(-50%);top:-5000px;width:500px;box-shadow:0 0 20px rgba(0,0,0,0.3);padding:10px 0;box-sizing:border-box;border-radius:4px;max-height:700px;overflow-y:scroll;scrollbar-color:#dcdcdc #fff;scrollbar-width:thin}.setting-panel-box::-webkit-scrollbar{width:4px;background-color:#fff}.setting-panel-box::-webkit-scrollbar-button{display:none}.setting-panel-box::-webkit-scrollbar-thumb{background-color:#dcdcdc}.setting-panel-box.show{top:20px}.setting-panel-box h2{margin-bottom:10px;padding-left:20px}.setting-panel-box h4{margin-bottom:10px;padding-left:20px;font-weight:400;color:#1f2f3d;font-size:22px}.setting-panel-box .row{display:flex;align-items:center;justify-content:flex-start;width:100%;margin-bottom:5px;padding-left:20px;box-sizing:border-box}.setting-panel-box .row label{line-height:32px;text-align:left;font-size:14px;color:#606266;width:190px}.setting-panel-box .row .mini{line-height:26px;text-align:left;font-size:14px;color:#606266;margin:0 10px 0 0;width:50px}.setting-panel-box .row .normal{line-height:26px;text-align:left;font-size:14px;color:#606266;margin:0 10px 0 0;width:205px}.setting-panel-box .row textarea{resize:vertical;min-height:30px;border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;line-height:26px;box-sizing:border-box;width:227px;padding:0 10px}.setting-panel-box .row input{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:227px;padding:0 10px}.setting-panel-box .row input#filterNonePlatinum{height:6px;background-color:#e4e7ed;margin:16px 0;border-radius:3px;position:relative;cursor:pointer;vertical-align:middle;outline:none;padding:0}.setting-panel-box .row input#filterNonePlatinum::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border:2px solid #409eff;background-color:#fff;border-radius:50%;transition:.2s;user-select:none}.setting-panel-box .row input#filterNonePlatinum::-moz-range-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border:2px solid #409eff;background-color:#fff;border-radius:50%;transition:.2s;user-select:none}.setting-panel-box .row #filterNonePlatinumValue{margin-left:5px}.setting-panel-box .row select{border:1px solid #dcdfe6;color:#606266;background-color:#fff;background-image:none;border-radius:4px;-webkit-appearance:none;height:26px;line-height:26px;display:inline-block;width:227px;padding:0 10px}.setting-panel-box .row span{line-height:32px;text-align:left;font-size:14px;color:#606266;margin-right:10px}.setting-panel-box .btnbox{display:flex;align-items:center;justify-content:center}.setting-panel-box button{-webkit-appearance:button;padding:9px 15px;font-size:12px;border-radius:3px;display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #dcdfe6;color:#606266;text-align:center;box-sizing:border-box;outline:0;margin:0;transition:.1s;font-weight:500;margin:0 10px}.setting-panel-box button:hover{color:#409eff;border-color:#c6e2ff;background-color:#ecf5ff}.setting-panel-box button.confirm{color:#fff;background-color:#3890ff}.setting-panel-box button.confirm:hover{background-color:#9ec9ff}</style>
<div class=setting-panel-box><h2>PSN中文网功能增强插件设置</h2><div class=row><a href=https://github.com/swsoyee/psnine-enhanced-version><img src=https://img.shields.io/github/stars/swsoyee/psnine-enhanced-version.svg?style=social></img></a></div><div class=row><label>夜间模式</label><select id=nightMode><option value=true>启用<option value=false>关闭</select></div><div class=row><label>导航增加新闻入口</label><select id=addNews><option value=true>启用<option value=false>关闭</select></div><div class=row><label>高亮用户ID</label><textarea name="" id="highlightSpecificID" cols="30" rows="2"></textarea></div><div class=row><label>黑名单ID</label><textarea name="" id="blockList" cols="30" rows="2"></textarea></div><div class=row><label>机因中显示被@的内容</label><select id=replyTraceback><option value=true>启用<option value=false>关闭</select></div><div class=row><label>悬浮显示刮刮卡内容</label><select id=hoverUnmark><option value=true>启用<option value=false>关闭</select></div><div class=row><label>个人主页下显示所有游戏</label><select id=autoPagingInHomepage><option value=true>启用<option value=false>关闭</select></div><div class=row><label>自动向后翻页数</label><input type=number class=normal id=autoPaging></div><div class=row><label>问答区标题着色</label><select id=qaHighlightTitle><option value=true>启用<option value=false>关闭</select></div><div class=row><label>悬浮头像显示个人信息</label><select id=hoverHomepage><option value=true>启用<option value=false>关闭</select></div><div class=row><label>奖杯默认折叠</label><select id=foldTropySummary><option value=true>启用<option value=false>关闭</select></div><div class=row><label>约战页面去掉发起人头像</label><select id=removeHeaderInBattle><option value=true>启用<option value=false>关闭</select></div><div class=row><label>无白金游戏图标透明度</label><input id=filterNonePlatinum type=range min=0 max=1 step=0.1><span id=filterNonePlatinumValue></span></div><div class=row><label>汇率</label><span>港币</span><input type=number class=mini name="" id=dollarHKRatio><span>美元</span><input type=number class=mini name="" id=dollarRatio></div><div class=row><label></label><span>英镑</span><input type=number class=mini name="" id=poundRatio><span>日元</span><input type=number class=mini name="" id=yenRatio></div><div class=btnbox><button class=confirm>确定</button><button class=cancel>取消</button></div></div>
`)

        // 点击打开设置面板
        $("#psnine-enhanced-version-opensetting").on("click",function(){
			$(".setting-panel-box").addClass("show")
            tippy("#highlightSpecificID", {
                content: 'ID以英文逗号隔开，不区分大小写',
                zIndex: 10000
            })
            tippy("#blockList", {
                content: 'ID以英文逗号隔开，不区分大小写',
                zIndex: 10000
            })
			var switchSettings = ["hoverUnmark","replyTraceback","nightMode","foldTropySummary","addNews", "qaHighlightTitle", "hoverHomepage", "autoPagingInHomepage", "removeHeaderInBattle"] //只有true / false的设置项
			var self = this
			switchSettings.map((name,i)=>{
				if(newSettings[name]){
					$(`#${name} option:nth-child(1)`).attr("selected","true")
				}else{
					$(`#${name} option:nth-child(2)`).attr("selected","true")
				}
				$(`#${name}`).change(function(){
					newSettings[name] = JSON.parse($(this).children('option:selected').val())
				})
			})

            // 降低无白金透明度设置
			$("#filterNonePlatinum").val(newSettings.filterNonePlatinumAlpha)
			$("#filterNonePlatinumValue").html(newSettings.filterNonePlatinumAlpha * 100 + "%")
            $("#filterNonePlatinum").on("input", function() {
				var value = $("#filterNonePlatinum").val()
				$("#filterNonePlatinumValue").html(value * 100 + "%")
				newSettings.filterNonePlatinumAlpha = value
			})

            // 高亮用户
            var highlightSpecificIDText = newSettings.highlightSpecificID.length?newSettings.highlightSpecificID.join(","):""
            $("#highlightSpecificID").val(highlightSpecificIDText)
            // 黑名单
            var blockListText = newSettings.blockList.length?newSettings.blockList.join(","):""
            $("#blockList").val(blockListText)
            // 汇率
            $("#dollarHKRatio").val(newSettings.dollarHKRatio)
            $("#dollarRatio").val(newSettings.dollarRatio)
            $("#poundRatio").val(newSettings.poundRatio)
            $("#yenRatio").val(newSettings.yenRatio)
            // 自动翻页页数
            $("#autoPaging").val(newSettings.autoPaging)
            console.log(newSettings.autoPaging)
        })
        // 点击取消
        $(".setting-panel-box .btnbox .cancel").on("click",function(){
            $(".setting-panel-box").removeClass("show")
        })
        // 点击确定
        $(".setting-panel-box .btnbox .confirm").on("click",function(){
            var highlightSpecificIDText = $.trim($("#highlightSpecificID").val().replace("，",",")).replace(/,$/,"").replace(/^,/,"")
            if(highlightSpecificIDText){
                newSettings.highlightSpecificID = highlightSpecificIDText.split(",")
            }else{
                newSettings.highlightSpecificID = []
            }
            var blockListText = $.trim($("#blockList").val().replace("，",",")).replace(/,$/,"").replace(/^,/,"")
            if(blockListText){
                newSettings.blockList = blockListText.split(",")
            }else{
                newSettings.blockList = []
            }
            newSettings.filterNonePlatinumAlpha = $("#filterNonePlatinum").val()
            newSettings.dollarHKRatio = $("#dollarHKRatio").val()
            newSettings.dollarRatio = $("#dollarRatio").val()
            newSettings.poundRatio = $("#poundRatio").val()
            newSettings.yenRatio = $("#yenRatio").val()
            newSettings.autoPaging = $("#autoPaging").val()
            $(".setting-panel-box").removeClass("show")
            localStorage["psnine-night-mode-CSS-settings"] = JSON.stringify(newSettings)
            window.location.reload()
        })
    }

})();
