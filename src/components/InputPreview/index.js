/*
 * BBCode和html标签对应表
 */
const bbcode = {
    '\\[quote\\](.+?)\\[\/quote\\]': '<blockquote>$1</blockquote>',
    '\\[mark\\](.+?)\\[\/mark\\]': '<span class="mark">$1</span>',
    '\\[img\\](.+?)\\[\/img\\]': '<img src="$1"></img>',
    '\\[b\\](.+?)\\[\/b\\]': '<b>$1</b>',
    '\\[s\\](.+?)\\[\/s\\]': '<s>$1</s>',
    '\\[center\\](.+?)\\[\/center\\]': '<center>$1</center>',
    '\\[\\](.+?)\\[\/b\\]': '<b>$1</b>',
    '\\[color=(.+?)\\](.+?)\\[\/color\\]': '<span style="color:$1;">$2</span>',
    '\\[url\\](.+)\\[/url\\]': '<a href="$1">$1</a>',
    '\\[url=(.+)\\](.+)\\[/url\\]': '<a href="$1">$2</a>',
    //'\\[trophy=(.+)\\]\\[/trophy\\]': '<a href="$1">$2</a>',
    //'\\[trophy=(.+)\\](.+)\\[/trophy\\]': '<a href="$1">$2</a>',
    '\\n': '<br/>',
};

/* 将BBCode替换成对应html代码
 * @param   str  原始BBCode输入
 *
 * @return  str  转换后的html代码
 */
const replaceAll = (str, mapObj) => {
    for (let i in mapObj) {
        let re = new RegExp(i, 'g');
        str = str.replace(re, mapObj[i]);
    }
    return str;
}

const style = `padding: 0px 10px;word-break: break-all;`

/*
 * 功能：在输入框下方追加输入内容预览框
 */
const inputPreview = () => {
    const tag = "textarea[name='content']";
    $(tag).after(
        `<div class='content' style='${style}' id='preview' />`
    );
    $(tag).keyup(() => {
        $('#preview').html(replaceAll($(tag).val(), bbcode));
    });
}

export default inputPreview;
