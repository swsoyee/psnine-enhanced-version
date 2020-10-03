/*
* 功能：页面上追加“只看史低”功能按键，点击显示史低，再次点击恢复显示所有游戏（数折页面）
*/
const bestOnly = () => {
    // 追加只看史低按键
    $('.dropmenu').append('<li style="color:#B8C4CE;padding: 0px 0px 0px 10px;">只看史低</li><label class="switch" style="line-height:1.3;"><input id="bestOnly" type="checkbox"><span class="slider round"></span></label>');
    // 点击按钮隐藏或者显示
    let toggle = $('#bestOnly');
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
const bestOnlySalesPage = () => {
    // 追加只看史低按键
    $('.disabled.h-p').eq(0).after('<li style="color:white;padding: 2px 5px;">只看史低<label class="switch"><input id="bestOnlySalesPage" type="checkbox"><span class="slider round"></span></label></li>');
    let toggle = $('#bestOnlySalesPage');
    toggle[0].checked = false;
    toggle.change(() => {
        $(document.querySelectorAll('li.store_box')).map((i, el) => {
            if ((el).querySelector('.store_tag_best') === null) {
                $(el).css('display', toggle[0].checked === true ? 'none' : 'block');
            }
        })
    });
}

export {
    bestOnly,
    bestOnlySalesPage,
}
