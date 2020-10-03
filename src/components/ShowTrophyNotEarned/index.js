/*
 * 功能：奖杯筛选功能
 */
const showTrophyNotEarned = () => {
    $('.dropmenu').append('<li style="color:#B8C4CE;"></em>只显示未获得</em><label class="switch" style="line-height:1.3;"><input id="filterEarned" type="checkbox"><span class="slider round"></span></label></li>');
    let toggle = $('#filterEarned');
    toggle[0].checked = false;
    toggle.change(() => {
        $('.lh180.alert-success.pd5.r').parent().parent().toggle('slow');
    });
}

export default showTrophyNotEarned;
