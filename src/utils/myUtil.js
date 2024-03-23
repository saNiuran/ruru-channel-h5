import {baseUrl} from "@/utils/config";

export function getDiffDays(time) {
    let seconds = Math.floor(time / 1000);
    let day = Math.floor(seconds / (60 * 60 * 24))
    let hour = Math.floor(seconds / (60 * 60)) - (day * 24)
    let minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
    let second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
    return day;
}

export function getDiffHours(time) {
    let seconds = Math.floor(time / 1000);
    let day = Math.floor(seconds / (60 * 60 * 24))
    let hour = Math.floor(seconds / (60 * 60)) - (day * 24)
    let minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
    let second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
    return hour;
}

export function getDiffMinutes(time) {
    let seconds = Math.floor(time / 1000);
    let day = Math.floor(seconds / (60 * 60 * 24))
    let hour = Math.floor(seconds / (60 * 60)) - (day * 24)
    let minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
    let second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
    return minute;
}

export function getDiffSeconds(time) {
    let seconds = Math.floor(time / 1000);
    let day = Math.floor(seconds / (60 * 60 * 24))
    let hour = Math.floor(seconds / (60 * 60)) - (day * 24)
    let minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
    return Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
}


export function formatTime(number) {
    if (number === "" || number === 0) {
        return "";
    }
    let n = number;
    let date = new Date(n);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
}

/**
 * 获取时间格式
 * @param date
 * @returns {string}
 */
export function formatTime6(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('/')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    return `${t1} ${t2}`
}


// 发布活用的
export function formatTimeNoHour(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

export function timeDifSecond(time) {
    if (time == NaN) {
        return "刚刚";
    }
    if (time / 60 >= 1) {
        time = time / 60;
        if (time / 60 >= 1) { //大于一个小时
            time = time / 60;
            if (time / 24 >= 1) { //大于一天
                time = time / 24;
                return parseInt(time) + "天前";
            } else {
                return parseInt(time) + "小时前";
            }
        } else { //小于一个小时
            return parseInt(time) + "分钟前";
        }
    } else { //小于一分钟
        return "刚刚";
    }
}


//网络请求
export function wxRequest(parameters = "", success, method = "GET", header = {}) {
    wx.request({
        url: baseUrl + (method == "GET" ? "?" : "") + parameters,
        data: {},
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: header ? header : "application/json", // 设置请求的 header
        success: function (res) {
            console.log(res);
            success(res);
        },
        fail: function () {
            // fail
        },
        complete: function () {
            // complete
        }
    })
}

//HUD
//成功提示
export function wxShowSuccess(title = "成功啦", duration = 2500) {
    wx.showToast({
        title: title,
        icon: 'success',
        duration: (duration <= 0) ? 2500 : duration
    });
}

//loading提示
export function wxShowLoading(title = "请稍后", duration = 5000) {
    wx.showToast({
        title: title,
        icon: 'loading',
        duration: (duration <= 0) ? 5000 : duration
    });
}

//隐藏提示框
export function wxHideToast() {
    wx.hideToast();
}

//显示带取消按钮的消息提示框
export function wxAlertViewWithCancel(title = "提示", content = "消息提示", confirm, showCancel = "true") {
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        success: function (res) {
            if (res.confirm) {
                confirm();
            }
        }
    });
}

//显示不取消按钮的消息提示框
export function alertView(title = "提示", content = "消息提示", confirm) {
    wxAlertViewWithCancel(title, content, confirm, false);
}

export function priceTranslate(number) {
    if (!number) {
        return 0;
    }
    return calculateMath(number / 1000, 2);
}

//科学计数法
export function calculateMath(number, type) {
    if (!number) {
        return 0;
    }
    if (type === 2) { //2位小数
        if (number / 10000.00 >= 1 && number / 100000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(2) + "万";
        } else if (number / 100000.00 >= 1 && number / 1000000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(2) + "万";
        } else if (number / 1000000.00 >= 1 && number / 10000000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(2) + "万";
        } else if (number / 10000000.00 >= 1 && number / 100000000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(2) + "万";
        } else if (number / 100000000.00 >= 1 && number / 1000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(2) + "亿";
        } else if (number / 1000000000.00 >= 1 && number / 10000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(2) + "亿";
        } else if (number / 10000000000.00 >= 1 && number / 100000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(2) + "亿";
        } else if (number / 100000000000.00 >= 1 && number / 1000000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(2) + "亿";
        } else if (number / 1000000000000.00 >= 1 && number / 10000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(2) + "兆";
        } else if (number / 10000000000000.00 >= 1 && number / 100000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(2) + "兆";
        } else if (number / 100000000000000.00 >= 1 && number / 1000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(2) + "兆";
        } else if (number / 1000000000000000.00 >= 1 && number / 10000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(2) + "兆";
        } else if (number / 10000000000000000.00 >= 1 && number / 10000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(2) + "兆";
        } else if (number / 100000000000000000.00 >= 1 && number / 100000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(2) + "兆";
        } else {
            return number.toFixed(2);
        }
    } else {
        if (number / 10000.00 >= 1 && number / 100000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(0) + "万";
        } else if (number / 100000.00 >= 1 && number / 1000000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(0) + "万";
        } else if (number / 1000000.00 >= 1 && number / 10000000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(0) + "万";
        } else if (number / 10000000.00 >= 1 && number / 100000000.00 < 1) {
            number = number / 10000.00;
            return number.toFixed(0) + "万";
        } else if (number / 100000000.00 >= 1 && number / 1000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(0) + "亿";
        } else if (number / 1000000000.00 >= 1 && number / 10000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(0) + "亿";
        } else if (number / 10000000000.00 >= 1 && number / 100000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(0) + "亿";
        } else if (number / 100000000000.00 >= 1 && number / 1000000000000.00 < 1) {
            number = number / 100000000.00;
            return number.toFixed(0) + "亿";
        } else if (number / 1000000000000.00 >= 1 && number / 10000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(0) + "兆";
        } else if (number / 10000000000000.00 >= 1 && number / 100000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(0) + "兆";
        } else if (number / 100000000000000.00 >= 1 && number / 1000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(0) + "兆";
        } else if (number / 1000000000000000.00 >= 1 && number / 10000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(0) + "兆";
        } else if (number / 10000000000000000.00 >= 1 && number / 10000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(0) + "兆";
        } else if (number / 100000000000000000.00 >= 1 && number / 100000000000000000.00 < 1) {
            number = number / 1000000000000.00;
            return number.toFixed(0) + "兆";
        } else {
            return number.toFixed(0);
        }
    }

}

export function toDate(number) {
    let olddate = new Date(number);
    // console.log("old time = ", olddate);
    let result = 0;
    let day = 60 * 60 * 24;
    let minte = 60;
    let hour = 60 * 60;
    let just = new Date(); //获取当前时间，单位ms
    // console.log("current time = ", just);
    let diff = (just - olddate) / 1000;
    if (diff < minte) {
        return "刚刚";
    } else if ((diff >= minte) && (diff < hour)) {
        return parseInt(diff / 60) + "分钟前";
    } else if ((diff >= hour) && (diff < day)) {
        return parseInt(diff / 60 / 60) + "小时前";
    } else if ((diff >= 1 * day) && (diff < 4 * day)) {
        return parseInt(diff / 60 / 60 / 24) + "天前";
    } else {
        let date = new Date(number);
        // let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return (M + D)

    }
}

/**
 * 去除制定的字符
 */
export function deleteStringVal(str) {
    let arr = ["省", "市", "区", "县"];
    let BreakException = {};
    let strArr = str.split(',');

    let newArray = [];

    strArr.forEach(item => {
        try {
            arr.forEach(tem => {
                if (item.length > 2 && item.indexOf(tem) === item.length - 1) {
                    item = item.substring(0, item.length - 1);
                    throw BreakException;
                }
            })
        } catch (e) {

        }
        newArray.push(item);
    })

    console.log(newArray);
    return newArray.join(",");
}

export function parseShortAddress(whereShow, address) {
    let addressArray = address.split(",");
    let lastItem = addressArray[addressArray.length - 1];
    if (lastItem.indexOf("区") === lastItem.length - 1) {
        addressArray.splice(addressArray.length, 1);
    }

    if (addressArray.length >= 2) {
        if (addressArray[1].indexOf("市辖") > -1) {
            addressArray.splice(1, 1);
        }
    }

    let supperCities = ["北京", "上海", "天津", "重庆"];
    if (supperCities.indexOf(addressArray[0].substring(0, 2)) > -1) {
        return addressArray[0].substring(0, 2);
    }

    let result = addressArray[addressArray.length - 1];

    switch (addressArray.length) {
        case 1:
            result = addressArray[0];
            break
        case 2:
            switch (whereShow) {
                case "同城":
                case "本市":
                    result = addressArray[1];
                    break;
                case "本省":
                    result = addressArray[0];
                    break;
                default:
                    break;
            }
            break;
        case 3:
            switch (whereShow) {
                case "同城":
                    result = addressArray[2];
                    break;
                case "本市":
                    result = addressArray[1];
                    break;
                case "本省":
                    result = addressArray[0];
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return deleteStringVal(result);
}

/**
 * 简称省份
 */
export function shortProvince(str) {
    let proArr = ["内蒙古", "广西", "西藏", "宁夏", "新疆", "香港", "澳门"];
    for (let i = 0; i < proArr.length; i++) {
        let tem = proArr[i];
        if (str.indexOf(tem) !== -1) {
            str = tem;
            break;
        }
    }
    return str;
}

/**
 * 简称市
 */
export function shortCity(str) {
    let proArr = ["兴安盟", "锡林郭勒", "阿拉善", "延边", "大兴安岭", "恩施", "湘西", "阿坝", "甘孜", "凉山", "铜仁", "黔西南", "毕节", "黔东南", "黔南", "楚雄", "红河", "文山", "西双版纳", "大理", "德宏", "怒江", "迪庆", "昌都", "山南", "日喀则", "那曲", "阿里", "林芝", "临夏", "甘南", "海东", "海北", "黄南", "海南", "果洛", "玉树", "海西", "吐鲁番", "哈密", "昌吉", "博尔塔拉", "巴音郭楞", "阿克苏", "克孜勒", "喀什", "和田", "伊犁", "塔城", "阿勒泰"];
    for (let i = 0; i < proArr.length; i++) {
        let tem = proArr[i];
        if (str.indexOf(tem) !== -1) {
            str = tem;
            break;
        }
    }
    return str;
}

/**
 * 简称区
 */
export function shortArea(str) {
    let dic = {
        "土默特左旗": "土左旗",
        "土默特右旗": "土右旗",
        "达尔罕茂明安联合旗": "达茂旗",
        "阿鲁科尔沁旗": "阿旗",
        "克什克腾旗": "克旗",
        "科尔沁左翼中旗": "科左中旗",
        "科尔沁左翼后旗": "科左后旗",
        "莫力达瓦达翰尔族自治旗": "莫旗",
        "鄂伦春自治旗": "鄂伦春旗",
        "鄂温克族自治旗": "鄂温克族旗",
        "新巴尔虎左旗": "新左旗",
        "新巴尔虎右旗": "新右旗",
        "察哈尔右翼前旗": "察右前旗",
        "察哈尔右翼中旗": "察右中旗",
        "察哈尔右翼后旗": "察右后旗",
        "科尔沁右翼前旗": "科右前旗",
        "科尔沁右翼中旗": "科右中旗",
        "苏尼特左旗": "东苏旗",
        "苏尼特右旗": "西苏旗",
        "东乌珠穆沁旗": "东乌旗",
        "西乌珠穆沁旗": "西乌旗",
        "阿拉善左旗": "阿左旗",
        "阿拉善右旗": "阿右旗",
        "喀喇沁左翼蒙古族自治县": "喀左",
        "塔什库尔干塔吉克自治县": "塔县"
    };
    for (let key in dic) {
        if (str.search(key) != -1) {
            return dic[key];
        }
    }
    let proArr = ["青龙", "丰宁", "宽城", "围场", "孟村", "大厂", "托克托", "和林格尔", "巴林左旗", "巴林右旗", "翁牛特旗", "喀喇沁旗", "敖汉旗", "库伦旗", "奈曼旗", "扎鲁特旗", "达拉特旗", "准格尔旗", "鄂托克前旗", "鄂托克旗", "杭棉旗", "乌审旗", "伊金霍洛旗", "阿荣旗", "陈巴尔虎旗", "乌拉特前旗", "乌拉特中旗", "乌拉特后旗", "杭棉后旗", "四子王旗", "扎赉特旗", "阿巴嘎旗", "太仆寺旗", "镶黄旗", "正镶白旗", "正蓝旗", "额济纳旗", "阿勒泰", "岫岩", "新宾", "清原", "本溪", "恒仁", "宽甸", "阜新", "伊通", "长白", "前郭", "杜尔伯特", "景宁", "长阳", "五峰", "神农架", "城步", "江华", "麻阳", "新晃", "芷江", "靖州", "通道", "乳源", "连山", "连南", "融水", "三江", "龙胜", "恭城", "隆林", "富川", "罗城", "环江", "巴马", "都安", "大化", "金秀", "白沙", "昌江", "乐东", "陵水", "保亭", "琼中", "西沙", "南沙", "中沙", "石柱", "秀山", "酉阳", "彭水", "北川", "峨边", "马边", "木里", "道真", "务川", "镇宁", "关岭", "紫云", "玉屏", "印江", "沿河", "松桃", "威宁", "三都", "石林", "禄劝", "寻甸", "峨山", "新平", "元江", "玉龙", "宁蒗", "普洱", "墨江", "景东", "景谷", "镇沅", "江城", "孟连", "澜沧", "西盟", "双江", "耿马", "沧源", "屏边", "金平", "河口", "漾濞", "南涧", "巍山", "贡山", "兰坪", "维西", "张家川", "天祝", "肃南", "肃北", "阿克塞", "东乡", "积石山", "大通", "民和", "互助", "化隆", "循化", "门源", "河南", "巴里坤", "木垒", "焉耆", "察布查尔", "和布"];
    for (let i = 0; i < proArr.length; i++) {
        let tem = proArr[i];
        if (str.search(tem) != -1) {
            str = tem;
            break;
        }
    }
    return str;
}

/**
 * 删除的地区
 */
export function deleteAreaList(str) {
    let flag = false;
    let areaListArr = ["密云县", "延庆县", "蓟县", "静海县", "宁河县", "藁城市", "鹿泉市", "栾城县", "唐海县", "抚宁县", "永年县", "肥乡县", "万全县", "崇礼县", "普兰店市", "大洼县", "双城市", "崇明县", "溧水县", "高淳县", "铜山县", "金坛市", "吴江市", "赣榆县", "洪泽县", "大丰市", "临安市", "奉化市", "洞头县", "上虞市", "建阳市", "永定县", "新建县", "九江县", "赣县", "东乡县", "章丘市", "垦利县", "陵县", "定陶县", "许昌县", "郧县", "电白县", "梅县", "武鸣县", "柳江县", "临桂县", "宜州市", "开县", "梁平县", "铜梁县", "武隆县", "潼南县", "荣昌县", "璧山县", "双流县", "郫县", "罗江县", "安县", "彭山县", "达县", "名山县", "遵义县", "毕节市", "铜仁市", "沾益县", "江川县", "日喀则市", "昌都县", "林芝县", "乃东县", "户县", "华县", "安塞县", "南郑县", "平安县"];
    for (let i = 0; i < areaListArr.length; i++) {
        let tem = areaListArr[i];
        if (str.search(tem) != -1) {
            flag = true;
            break;
        }
    }
    return flag;
}

/**
 * 保留一位小数
 */
export function toDecimal2(x) {
    let f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 1) {
        s += '0';
    }
    return s;
}

/**
 * 保留两位小数
 */
export function outputcents(numbers) {
    numbers = Math.round(numbers * 100) / 100;
    return numbers;
}

/**
 * 转化null 为空字符串。
 */
export function returnStrEmpty(str) {
    if (str == null) {
        return "";
    }
    return str;
}

/**
 * 拿微信支付code
 */
export function GetRequest() {
    let url = location.search; //获取url中含"?"符后的字串
    let theRequest = new Object();
    let strs;
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

export function timestampToTime(timestamp) {
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

module.exports = {
    formatTime: formatTime,
    formatTime6: formatTime6,
    // wxRequest: wxRequest,
    wxShowSuccess: wxShowSuccess,
    wxShowLoading: wxShowLoading,
    wxHideToast: wxHideToast,
    wxAlertViewWithCancel: wxAlertViewWithCancel,
    alertView: alertView,
    toDate: toDate,
    calculateMath: calculateMath,
    priceTranslate: priceTranslate,
    timeDifSecond: timeDifSecond,
    deleteStringVal: deleteStringVal,
    parseShortAddress: parseShortAddress,
    shortProvince: shortProvince,
    shortCity: shortCity,
    shortArea: shortArea,
    deleteAreaList: deleteAreaList,
    toDecimal2: toDecimal2,
    outputcents: outputcents,
    returnStrEmpty: returnStrEmpty,
    formatTimeNoHour: formatTimeNoHour,
    getDiffDays: getDiffDays,
    getDiffHours: getDiffHours,
    getDiffMinutes: getDiffMinutes,
    getDiffSeconds: getDiffSeconds,
    GetRequest,
    timestampToTime,
}
