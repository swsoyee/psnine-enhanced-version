/*
 * 功能：增加帖子楼层信息
 */
const floorIndex = () => {
    let baseFloorIndex = 0;
    let subFloorIndex = -1;
    $('span[class^=r]').map((i, el) => {
        if (i > 0) {
            if ($(el).attr('class') === 'r') {
                $(el).children('a:last')
                    .after(`&nbsp&nbsp<span>#${++baseFloorIndex}</span>`);
                subFloorIndex = -1;
            } else {
                $(el).children('a:last')
                    .after(
                        `&nbsp&nbsp<span>#${baseFloorIndex}${subFloorIndex--}</span>`
                    );
            }
        }
    });
}

export default floorIndex;
