// ==UserScript==
// @name         PSN中文网功能增强
// @namespace    https://swsoyee.github.io
// @version      0.29
// @description  PSN中文网的数折价格可视化，奖杯统计，楼主高亮，增加被@用户的留言内容等
// @author       InfinityLoop
// @include      *psnine.com/*
// @include      *d7vg.com/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      http://code.highcharts.com/highcharts.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    // 功能1-1设置：高亮发帖楼主功能
    var highlightBack = "#3890ff" // 高亮背景色
    var highlightFront = "#ffffff" // 高亮字体颜色
    // 功能1-2设置：高亮具体ID功能（默认管理员id）[注：此部分功能源于@mordom0404的P9工具包：https://greasyfork.org/zh-CN/scripts/29343-p9%E5%B7%A5%E5%85%B7%E5%8C%85]
    var highlightSpecificID = ["mechille", "sai8808", "jimmyleo","jimmyleohk"] // 需要高亮的ID数组
    var highlightSpecificBack = "#d9534f" // 高亮背景色
    var highlightSpecificFront = "#ffffff" // 高亮字体颜色
    // 帖子优化
    // 功能1-1：高亮发帖楼主
    if( /(gene|trade|topic)\//.test(window.location.href) & !/comment/.test(window.location.href)) {
        // 获取楼主ID
        var author = $(".title2").text()
        $(".psnnode").map(function(i, n){
            // 匹配楼主ID，变更CSS
            if( $(n).text() == author) {
                $(n).after('<div class="psnnode author" style="padding:0px 5px; border-radius:2px; display: inline-block;background-color:' + highlightBack + '; color: ' + highlightFront + '">楼主</div>')
            }
        })
    }
    // 功能1-2：高亮管理员
    var url = window.location.href;
    var d = url.indexOf("psnine.com");
    var h = url.substring(0, d);
    highlightSpecificID.map(function(v, i) {
        $('.meta>[href="' + h + 'psnine.com/psnid/' + v + '"]').css({ "background-color": highlightSpecificBack, "color": highlightSpecificFront })
    });

    // 功能1-3：回复内容回溯，仅支持机因、主题 (效率原因只返回所@用户的最近一条回复)
    if( /(gene|topic|trade)\//.test(window.location.href) & !/comment/.test(window.location.href)) {
        GM_addStyle (`.replyTraceback {background-color: rgb(0, 0, 0, 0.05) !important; padding: 10px !important; color: rgb(160, 160, 160, 1) !important; border: 1px solid !important;}`)
        // 如果有“查看更早的评论”需要额外处理
        var frameOffset = 0
        if(document.getElementsByClassName("btn btn-gray").length > 0) {
            frameOffset = 1
        }
        // 匹配@的字符串
        var reg = /@(.+?)\s/g
        // 每一层楼的回复外框 (1 ~ N + 1)
        var allSourceOutside = document.getElementsByClassName("ml64")
        // 每一层楼的回复框(1 ~ N+1) floor
        var allSource = document.getElementsByClassName("content pb10")
        // 每一层楼的回复者名字(2 ~ N+2) traceId
        var userId = document.getElementsByClassName("meta")
        // 每一层的头像(0 ~ N - 1)
        var avator = document.getElementsByClassName("post")
        // 没tag的帖子会少一层meta，所以要对meta[0]做处理
        var numberOffset = 0
        if( userId[0].getElementsByClassName("node").length > 0) {
            numberOffset = 2
        } else {
            numberOffset = 1
        }
        // 主题（topic）帖子tag偏移调整
        var tagOffset = 0
        if( /topic\//.test(window.location.href)) {
            tagOffset = 1
        }
        // 闲游（trade）帖子tag偏移调整
        var tradeOffset = 0
        if( /trade\//.test(window.location.href)) {
            tradeOffset = 1
        }
        for(var floor = allSource.length + numberOffset - 1; floor > 1 ; floor-- ) {
            // 层内内容里包含链接
            var content = allSource[floor - numberOffset].querySelectorAll("a")
            if(content.length > 0) {
                for(var userNum = 0; userNum < content.length; userNum++ ){
                    // 对每一个链接的文本内容判断
                    var linkContent = content[userNum].innerText.match("@(.+)")
                    // 链接里是@用户生成的链接， linkContent为用户名
                    if(linkContent != null) {
                        var replayBox = document.createElement("div")
                        replayBox.setAttribute("class", "replyTraceback")
                        // 层主ID
                        // var floorUserId = userId[floor].getElementsByClassName("psnnode")[0].innerText
                        // 从本层开始，回溯所@的用户的最近回复
                        for(var traceId = floor + 1 - frameOffset + tagOffset; traceId > 1 + tagOffset; traceId-- ){
                            // 如果回溯到了的话，选取内容
                            // 回溯层用户名
                            var thisUserID = userId[traceId - numberOffset + frameOffset].getElementsByClassName("psnnode")[0].innerText
                            if( thisUserID == linkContent[1].toLowerCase()){
                                // 输出头像
                                var avatorImgSource = avator[traceId - 1 - 2 * numberOffset + 2 * frameOffset - tagOffset].getElementsByTagName("img")
                                // 如果有“查看更早的评论”需要额外处理
                                if(avatorImgSource.length > 0){
                                    var avatorImg = avatorImgSource[0].getAttribute("src")
                                    } else {
                                        break;
                                    }
                                replayBox.innerHTML = '<div class="responserHeader" style="display: inline-block; padding-right: 10px; color: #3890ff"><img src="' +
                                    avatorImg + '" height="25" width="25"> ' + linkContent[1] + '</img>'+
                                    '</div><div class="responserContent" style="display: inline-block;">' +
                                    allSource[traceId - 2 * numberOffset + frameOffset - 2 * tagOffset - tradeOffset].innerText + "</div>"
                                allSourceOutside[floor - numberOffset + tagOffset + tradeOffset].insertBefore(replayBox, allSource[floor - numberOffset])
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // 功能1-4：主题中存在 -插图- 一项时，提供预览悬浮窗
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
    // 商城优化
    // 功能2-1：商城价格走势图
    if( /dd/.test(window.location.href) ) {
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
                day: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
            title: {
                text: 'Date'
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
            pointFormat: '{point.x:%e. %b}: '+ replaceString + '{point.y:.2f}'

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
    }
    // 奖杯系统优化
    // 功能3-1：游戏奖杯界面可视化
    if( /psngame\//.test(window.location.href) ) {
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
                var dayTime = document.getElementsByClassName("lh180 alert-success pd5 r")[timeIndex].innerText.split("\n")
                var monthDay = dayTime[0].split("-")
                var houtMinute = dayTime[1].split(":")
                var xTime = Date.UTC(Number(timeElements[timeIndex].getAttribute("tips").replace("年", "")), Number(monthDay[0]) - 1, Number(monthDay[1]), Number(houtMinute[0]), Number(houtMinute[1]))
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
    }
    // 全局优化
    // 功能4-1：点击跳转到页面底部
    var bottombar = document.getElementsByClassName("bottombar")[0]

    var toBottomSwitch = document.createElement("a")
    toBottomSwitch.innerText = "B"
    toBottomSwitch.setAttribute("href", "javascript:scroll(0, document.body.clientHeight)")
    toBottomSwitch.setAttribute("class", "yuan mt10")
    bottombar.appendChild(toBottomSwitch)
})();