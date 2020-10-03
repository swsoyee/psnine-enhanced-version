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

const repeatUntilSuccessful = (function_ptr, interval) => {
    if (!function_ptr())
        setTimeout(() => {
            repeatUntilSuccessful(function_ptr, interval);
        }, interval);
}

const retrieveRealTimeExchangeRate = (callback_success, callback_failure) => {
    // 默认汇率
    let exchangeRate = { HKD: 0.8796572978575602, USD: 6.817381644163391, GBP: 8.770269230346404, JPY: 0.06453927675754388 };//latest exchange rate as of 2020/09/30/00:00 AM (GMT+8)
    try {// 获取实时汇率
        let httpReq = new XMLHttpRequest();
        httpReq.open("GET", 'https://api.exchangeratesapi.io/latest', false);
        httpReq.send(null);
        let startTime = Date.now();
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

const currencyConversion = () => {
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

const currencyConversionSalesPage = () => {
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

export {
    currencyConversion,
    currencyConversionSalesPage,
    showOriginalPrice,
}
