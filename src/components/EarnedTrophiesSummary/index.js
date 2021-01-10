// 创建奖杯汇总框架函数
const createTrophyContainer = (object, className, title) => {
    const trophyTitleStyle = `border-radius: 2px; padding:5px; cursor: pointer; background-color:${$('li.current').css('background-color')};`;
    // 添加标题框在汇总图下
    $('.box.pd10').append(
        `<div class='${className}'><p class='trophyCount' style='${trophyTitleStyle}'></p><div class='trophyContainer' style='padding:5px;'></div></div>`
    );
    object.map(function (i, v) {
        // 如果这个奖杯有Tips，就设置左边框为绿色，否则就为底色（边框颜色和底色一致）
        let tipColor = $(this).parent().parent().next().find('.alert-success.pd5').length > 0
            ? '#8cc14c'
            : $('.box').css('background-color');
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
    for (let i in summaryTrophyDict) {
        trophySubText += `<span class=${summaryTrophyDict[i][0]}> ${summaryTrophyDict[i][1]}${object.parent().parent(i).length}</span>`
    }
    $(`.${className}> .trophyCount`).append(
        `<span style='color:#808080;'>${title}：${trophySubText}<span class='text-strong'> 总${object.length}</span></span>`
    );
}

/*
 * 功能：汇总以获得和未获得奖杯
 * @param  expand  默认展开
 */
const earnedTrophiesSummary = (collapse) => {
    // tippy弹出框的样式
    GM_addStyle(`.tippy-tooltip.psnine-theme {background-color: ${$('.box').css('background-color')};}`);
    // 创建已获得奖杯汇总框
    createTrophyContainer($('.imgbg.earned'), 'earnedTrophy', '已获得奖杯');
    // 创建未获得奖杯汇总框
    createTrophyContainer($("img[class$='imgbg']"), 'notEarnedTrophy', '未获得奖杯');
    // 未获得奖杯变黑白
    $('span[id^="notEarnedTrophySmall"] > a > img').css({ filter: 'grayscale(100%)' });
    // 折叠奖杯汇总
    // 奖杯图标设置为不可见
    if (collapse) {
        $('.trophyContainer').css('display', 'none');
    }
    // 单击奖杯汇总标题后展开奖杯图标
    $('.trophyCount').click(function () {
        $(this).next().slideToggle();
    });
}

export default earnedTrophiesSummary;
