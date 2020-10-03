const UNIT_TIME_HOUT = 60 * 60 * 1000;

// 1小时
const relative_description_to_offset = (prune_pattern, unit_time) => {
    return -parseInt(timestamp_text.replace(prune_pattern, '')) * unit_time;
}

const relative_timestamp = (offset, replace_pattern) => {
    if (replace_pattern) {
        return (
            (new Date((new Date()).getTime() + 8 * UNIT_TIME_HOUT + offset))
                .toLocaleDateString('en-CA', { timeZone: "Asia/Shanghai" })
                .split('-')
                .concat(timestamp_text.replace(replace_pattern, '').split(/:/))
        );
    } else {
        let _array = (new Date((new Date()).getTime() + offset))
            .toLocaleString('en-CA', { timeZone: "Asia/Shanghai", hour12: false })
            .split(/-|, |:/);
        _array.pop();
        return _array;
    }
}

const date_string_to_array = date_string => {
    return date_string.split(/-|\s|:/);
};

/*
 * P9时间格式转换函数
 * @param  timestamp_text  P9时间字符串
 * @return  UTC  时间
 */
const p9TimeTextParser = (timestamp_text) => { // returns UTC time
    let array = null;
    if (timestamp_text.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}/)) {
        array = date_string_to_array(timestamp_text);
    } else if (timestamp_text.match(/[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}/)) {
        array = date_string_to_array(timestamp_text);
        array.unshift((new Date()).getFullYear());
    } else {
        // if time were not offset by 8 hours, date calculation would be incorrect when description involves '[0-9]+天前'
        if (timestamp_text.match(/[0-9]+天前\s[0-9]{2}:[0-9]{2}/))
            array = relative_timestamp(relative_description_to_offset(/天前.+$/g, UNIT_TIME_HOUT * 24), /[0-9]+天前\s/g);
        else if (timestamp_text.match(/前天\s[0-9]{2}:[0-9]{2}/))
            array = relative_timestamp(-2 * UNIT_TIME_HOUT * 24, /前天\s/g);
        else if (timestamp_text.match(/昨天\s[0-9]{2}:[0-9]{2}/))
            array = relative_timestamp(-UNIT_TIME_HOUT * 24, /昨天\s/g);
        else if (timestamp_text.match(/今天\s[0-9]{2}:[0-9]{2}/))
            array = relative_timestamp(0, /今天\s/g);
        else if (timestamp_text.match(/[0-9]+小时前/))
            array = relative_timestamp(relative_description_to_offset(/小时.+$/g, UNIT_TIME_HOUT));
        else if (timestamp_text.match(/[0-9]+分钟前/))
            array = relative_timestamp(relative_description_to_offset(/分钟.+$/g, 60 * 1000));
        else if (timestamp_text.match(/刚刚/))
            array = relative_timestamp(0);
    }
    if (array) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] == '') {
                array.splice(i, 1);
                continue;
            }
            array[i] = parseInt(array[i]);
            if (i == 1) // Everything else is normal except month starts from 0
                array[i]--;
        }
        return Date.UTC(...array) - 8 * UNIT_TIME_HOUT;
    }
    console.log('not parsed: ' + timestamp_text);
    return null;
}

export default p9TimeTextParser;
