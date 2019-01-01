// ==UserScript==
// @name          P9夜间模式
// @namespace     http://userstyles.org
// @description	  本CSS样式为P9的夜间模式，为了方便夜间使用而编写的。
// @author        InfinityLoop
// @homepage      https://userstyles.org/styles/167244
// @include       *psnine.com/*
// @include       *d7vg.com/*
// @run-at        document-start
// @version       0.10
// @grant         GM_addStyle
// ==/UserScript==
(function() {
    'use strict';

    // 主页不同颜色的底纹
    GM_addStyle(`li[style="background:#f5faec"] {background-color: #184e1b !important;}`)
    GM_addStyle(`li[style="background:#fdf7f7"] {background-color: #4e1818 !important;}`)
    GM_addStyle(`li[style="background:#faf8f0"] {background-color: #4e4e18 !important;}`)
    GM_addStyle(`li[style="background:#f4f8fa"] {background-color: #505050 !important;}`)
    // 主题帖子中的字体颜色
    GM_addStyle(`span[style="color:blue;"] {color: #64a5ff !important;}`)
    GM_addStyle(`span[style="color:red;"] {color: #ff6464 !important;}`)
    GM_addStyle(`span[style="color:brown;"] {color: #ff8864 !important;}`)
    GM_addStyle(`.tit3 {color: #ffffff !important;}`)
    // mark黑条鼠标放置反白
    GM_addStyle(`.mark {color: #bbb !important; background: #bbb !important}`)
    // 背景底色
    GM_addStyle(`.bg {background: #2b2b2b !important}`)
    // 回帖背景色
    GM_addStyle(`.list li {background: #2b2b2b !important; border: 1px solid #666666 !important;}`)
    // 回帖字体颜色
    GM_addStyle(`.content {color: #bbb !important;}`)
    // 回帖用户名底色
    GM_addStyle(`.psnnode {background: #656565 !important;}`)
    // 奖杯帖子标题头底色
    GM_addStyle(`.box {background: #3d3d3d !important;}`)
    // 游戏列表标题
    GM_addStyle(`.title a {color: #bbb !important;}`)
    // 个别短标签颜色
    GM_addStyle(`.text-strong, strong {color: #bbb !important;}`)
    // 排名字体
    GM_addStyle(`.twoge {color: white !important;}`)
    // store
    GM_addStyle(`.storeinfo {color: #bbb !important;}`)
    // warining
    GM_addStyle(`.alert-warning {background: #4d4d4d !important;}`)
    GM_addStyle(`.alert-info {background: #5e5e5e !important;}`)
    GM_addStyle(`.alert-success {background: #4b4b4b !important;}`)
    GM_addStyle(`h1,.title2 {color: #ffffff !important;}`)
    // 个人主页navi
    GM_addStyle(`.inav {background: #3d3d3d !important;}`)
    GM_addStyle(`.inav li.current {background: #4b4b4b !important;}`)
    // tip背景色
    // 类型奖杯底色
    GM_addStyle(`.ml100 p {color: #ffffff !important;}`)
    GM_addStyle(`.t1 {background: #657caf !important;}`)
    GM_addStyle(`.t2 {background: #845e2f !important;}`)
    GM_addStyle(`.t3 {background: #707070 !important;}`)
    GM_addStyle(`.t4 {background: #8b4d2d !important;}`)
    GM_addStyle(`blockquote {background: #bababa !important;}`)
    // 交易页面
    GM_addStyle(`.tradelist li {color: white !important;}`)
    // 选中帖子高亮
    if(/game|news|gene|trade|psnid/.test(window.location.href)){
        GM_addStyle(`.list li:hover {background: #000000 !important;}`)
    }
})();
