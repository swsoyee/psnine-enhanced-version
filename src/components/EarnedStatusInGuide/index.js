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

/*
 * AJAX获取页面成功回调函数
 */
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

/*
 * 在攻略页面增加自己奖杯的获得状况
 * @param  psnidCookie  cookie中提取的用户id
 */
const earnedStatusInGuide = (psnidCookie) => {
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
    });
}

export default earnedStatusInGuide;
