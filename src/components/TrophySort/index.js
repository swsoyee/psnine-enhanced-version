import createTrophyEarnedTimeData from "../../utils/trophyData";

const sortTrophiesByTimestamp = () => {
    const trophyGetTimeData = createTrophyEarnedTimeData('em.lh180.alert-success.pd5.r');
    const trophyTableEntries = $('table.list').eq(0).children().find('tr');
    const trophies = trophyTableEntries.filter((i, e) => e.id != "");
    if (trophies.eq(0).hasClass('t1')) // Platinum
        trophyTableEntries.filter((i, e) => e.id == "").eq(0).after(trophyGetTimeData.trophyElements);
    else
        trophies.eq(0).after(trophyGetTimeData.trophyElements);
}

/*
 * 功能：奖杯筛选功能
 */

const trophySortByTimestamp = () => {
    $('div.main ul.dropmenu > li.dropdown > ul').eq(0).append('<li id="sortTrophiesByTimestamp"><a>获得时间</a></li>');
    $('#sortTrophiesByTimestamp').click(() => {
        sortTrophiesByTimestamp();
        $('#sortTrophiesByTimestamp').remove();
        $('div.main ul.dropmenu > li.dropdown').removeClass('hover');
    });
}

export default trophySortByTimestamp;
