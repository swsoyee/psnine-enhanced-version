/*
 * 功能：根据降价幅度变更标题颜色
 */
const discountTitleColor = () => {
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
            for (let key in priceTitleColorDict) {
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

export default discountTitleColor;
