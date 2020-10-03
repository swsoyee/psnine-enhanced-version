/*
 * 功能：对发帖楼主增加“楼主”标志
 */
const opBadge = () => {
    const userId = document.querySelector('.title2').text;
    $('.psnnode').map((index, node) => {
        // 匹配楼主ID，变更CSS
        if ($(node).text() == userId) {
            $(node).after('<span class="badge badge-1">楼主</span>');
        }
    });
}

export default opBadge;
