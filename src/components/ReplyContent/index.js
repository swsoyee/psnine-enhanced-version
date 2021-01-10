/*
 * 功能：回复内容回溯，仅支持机因、主题
 * @param  isOn  是否开启功能
 */
const replyContent = (isOn) => {
    if (isOn) {
        GM_addStyle(
            `.replyTraceback {
                background-color: rgb(0, 0, 0, 0.05) !important;
                padding: 10px !important;
                color: rgb(160, 160, 160, 1) !important;
                border-bottom: 1px solid !important;
            }`
        );
        // 悬浮框内容左对齐样式
        GM_addStyle(`
            .tippy-content {
                text-align: left;
            `
        );
        // 每一层楼的回复框
        const allSource = $('.post .ml64 > .content');
        // 每一层楼的回复者用户名
        const userId = $('.post > .ml64 > [class$=meta]');
        // 每一层的头像
        const avator = $('.post > a.l');
        for (let floor = allSource.length - 1; floor > 0; floor--) {
            // 层内内容里包含链接（B的发言中是否有A）
            const content = allSource.eq(floor).find('a');
            if (content.length > 0) {
                for (let userNum = 0; userNum < content.length; userNum++) {
                    // 对每一个链接的文本内容判断
                    const linkContent = content.eq(userNum).text().match('@(.+)');
                    // 链接里是@用户生成的链接， linkContent为用户名（B的发言中有A）
                    if (linkContent !== null) {
                        // 从本层的上一层开始，回溯所@的用户的最近回复（找最近的一条A的发言）
                        let traceIdFirst = -1;
                        let traceIdTrue = -1;
                        for (let traceId = floor - 1; traceId >= 0; traceId--) {
                            // 如果回溯到了的话，选取内容
                            // 回溯层用户名
                            const thisUserID = userId.eq(traceId).find('.psnnode:eq(0)').text();
                            if (thisUserID.toLowerCase() === linkContent[1].toLowerCase()) {
                                // 判断回溯中的@（A的发言中有是否有B）
                                if (
                                    allSource.eq(traceId).text() === userId.eq(floor).find('.psnnode:eq(0)').text()
                                ) {
                                    traceIdTrue = traceId;
                                    break;
                                } else if (traceIdFirst == -1) {
                                    traceIdFirst = traceId;
                                }
                            }
                        }
                        let outputID = -1;
                        if (traceIdTrue !== -1) {
                            outputID = traceIdTrue;
                        } else if (traceIdFirst != -1) {
                            outputID = traceIdFirst;
                        }
                        // 输出
                        if (outputID !== -1) {
                            const replyContentsText = allSource.eq(outputID).text();
                            const replyContents = replyContentsText.length > 45
                                ? `${replyContentsText.substring(0, 45)}......`
                                : replyContentsText;
                            const avatorImg = avator.eq(outputID).find('img:eq(0)').attr('src');
                            allSource.eq(floor).before(`
                                        <div class=replyTraceback>
                                            <span class="badge">
                                                <img src="${avatorImg}" height="15" width="15" style="margin-right: 5px; border-radius: 8px;vertical-align:sub;"/>
                                                    ${linkContent[1]}
                                            </span>
                                            <span class="responserContent_${floor}_${outputID}" style="padding-left: 10px;">
                                                ${replyContents}
                                            </span>
                                        </div>`);
                            // 如果内容超过45个字符，则增加悬浮显示全文内容功能
                            replyContentsText.length > 45
                                ? tippy(`.responserContent_${floor}_${outputID}`, {
                                    content: replyContentsText,
                                    animateFill: false,
                                    maxWidth: '500px',
                                })
                                : null;
                        }
                    }
                }
            }
        }
    }
}

export default replyContent;
