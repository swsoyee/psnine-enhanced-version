/*
 * 自动签到功能
 * @param  isOn  是否开启功能
 */
const autoCheckIn = (isOn) => {
    // 如果签到按钮存在页面上
    if (isOn && $('[class$=yuan]').length > 0) {
        $('[class$=yuan]').click();
    }
}

export default autoCheckIn;
