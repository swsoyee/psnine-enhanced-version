/*
 * 功能：层内逆序显示
 * @param  isOn  是否开启该功能
 */
const revertSubReply = (isOn) => {
    $('div.btn.btn-white.font12').click();
    const blocks = $('div.sonlistmark.ml64.mt10:not([style="display:none;"])');
    blocks.map((index, block) => {
        const reversedBlock = $($(block).find('li').get().reverse());
        $(block).find('.sonlist').remove();
        $(block).append('<ul class="sonlist">');
        reversedBlock.map((index, li) => {
            if (index === 0) {
                $(li).attr({ style: 'border-top:none;' });
            } else {
                $(li).attr({ style: '' });
            }
            $(block).find('.sonlist').append(li);
        })
    })
}

export default revertSubReply;
