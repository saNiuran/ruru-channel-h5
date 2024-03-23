// noinspection EqualityComparisonWithCoercionJS

import {appId} from "./config";

const Qs = require('qs')
function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

/**
 * 获取时间格式
 * @param date
 * @returns {string}
 */
export function formatTime(date) {
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

/**
 * 获取时间格式，只要日期
 * @param date
 * @returns {string}
 */
export function formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const t1 = [year, month, day].map(formatNumber).join('/')
    return `${t1}`
}

export function formatDateChinese(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const t1 = year+"年"+month+"月"+day+"日"
    return `${t1}`
}

export function formatDateChinese2(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    let hourStr, minuteStr, apm;
    if(hour<10){
        hourStr = "0"+hour;
    }
    if(minute<10){
        minuteStr = "0"+minute;
    }
    if(hour<12){
        apm = "上午";
    }else{
        apm = "下午";
    }

    const t1 = year+"年"+month+"月"+day+"日 "+apm +hourStr+":"+minuteStr
    return `${t1}`
}

//处理时间格式 年月日 时分秒
export function formatHourAndMinutes(time) {
    var newTime = new Date(time);
    return (newTime.getHours()<10?'0'+newTime.getHours():newTime.getHours())
        + ':' +
        (newTime.getMinutes()<10?'0'+newTime.getMinutes():newTime.getMinutes());
}


// 设置 cookie
export function setCookie (name, value, day) {
    let oDate = new Date()
    oDate.setDate(oDate.getDate() + day)
    if (day) {
        document.cookie = `${name}=${value};expires=${oDate}`
    } else {
        document.cookie = `${name}=${value}`
    }
}

// 获取 cookie
export function getCookie (name) {
    let arr = document.cookie.split('; ')
    for (let i = 0; i < arr.length; i++) {
        let arr2 = arr[i].split('=')
        if (arr2[0] === name) {
            return arr2[1]
        }
    }
    return ''
}

/**
 * 拿微信支付code
 */
export function GetRequest() {
    var url = location.search; //获取url中含"?"符后的字串
    var theRequest = {};
    var strs;
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//移除cookie
export function removeCookie (name) {
    setCookie(name, 1, -1)
}

/*
 * 正则判断
 */
export var mobileRegExp = {
    mobile:/^1[3|4|5|6|8|7|9][0-9]\d{8}$/,
    isNegativeNumber:/^\d+(\.\d+)?$/
}

/**
 * 获得时间戳
 * @param time
 * @returns {number}
 */
export function getTimeUnix(time) {
    var date  = new Date(time);
    var time1 = date.getTime();
    return time1;
}

//处理时间格式 年月日 时分秒
export function clearTime(time) {
    var newTime = time;
    var reg = /\-/g;
    var showTime =  newTime.replace(reg,"/");
//	var newTime = new Date(time);
//	showTime = newTime.getFullYear() + '/' + (newTime.getMonth() + 1) + '/' + newTime.getDate() + ' ' + newTime.getHours() + ':' + newTime.getMinutes() + ':' + newTime.getSeconds();
    return showTime;
}


/**
 * js压缩图片
 * @param file 图片文件对象
 * @param quality 压缩倍率 0~1
 * @constructor
 */
var maxSize =  1024 * 1024 * 0.5;
export function compressImage(file, quality) {

    // 图片小于1M不压缩
    if (file.size < maxSize) {
        console.log("不压缩")
        return file;
    }
    console.log("压缩")
    //默认0.5倍压缩
    quality = quality || 0.5;

    //保存文件名，后边用到
    var name = file.name;

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        var src = e.target.result;

        var img = new Image();
        img.src = src;
        img.onload = function (e) {
            var w = img.width;
            var h = img.height;
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);

            //铺底色 PNG转JPEG时透明区域会变黑色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, w, h);

            ctx.drawImage(img, 0, 0, w, h);
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpg', quality); //图片格式jpeg或webp可以选0-1质量区间

            // 返回base64转blob的值
            console.log('\u539F\u56FE' + (src.length / 1024).toFixed(2) + 'kb', '\u65B0\u56FE' + (base64.length / 1024).toFixed(2) + 'kb');
            //去掉url的头，并转换为byte
            var bytes = window.atob(base64.split(',')[1]);
            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }

            // 通过Blob生成新图片文件对象
            file = new Blob([ab], { type: 'image/jpg' });

            //这里需要重新设置文件名
            file.name = name;
            return file;
        };
        img.onerror = function (e) {
            console.error(e)
        };
    };

    reader.onerror = function (e) {
        return file;
        console.error(e)
    };
};

/**
 *
 * @param scope 授权作用域
 * @param path 授权所在页面path
 * @param extraPm 额外参数，需要在配置中进行参数配置
 */
export function get_codeV3(scope,path,extraPm={}){
    //判断使用的环境是否生产环境
    // if(process.env.NODE_ENV === 'development' && config.isMockWeChat){
    //   return '0713eFVW0AmFP12kGVTW0oGDVW03eFV2'
    // }

    let homeUrl = '',searchOb = {},searchstr = ''
    let oriUrls = window.location.href.split('?')
    //window.location.origin = http://debug.yunjg.net
    // window.location.pathname = /
    let baseShareURL = window.location.origin + window.location.pathname

    homeUrl = baseShareURL
    //看路径后面是否有code参数
    if(oriUrls.length > 1){
        let searchUrls = oriUrls[1].split("#")
        let searchUrlReal =  searchUrls[0]
        searchOb = Qs.parse(searchUrlReal)
        let {code} = searchOb
        if(code){
            delete  searchOb.code
        }
    }

    searchOb.codepath = path
    Object.assign(searchOb,extraPm)
    searchstr = `?${Qs.stringify(searchOb)}`
    homeUrl += searchstr

    let redirect_url = encodeURIComponent(homeUrl);
    console.log(homeUrl)
    let response_type = 'code';

    //应用授权作用域，
    //snsapi_base 不弹出授权页面，直接跳转，只能获取用户openid
    //snsapi_userinfo  弹出授权页面，可以通过openID拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取起信息
    //重定向后会带上stata参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
    let state = '';
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_url}&response_type=${response_type}&scope=${scope}&state=${state}#wechat_redirect`;
    window.location.href = url;
    localStorage.setItem("isWeChat",'1')
}

/**
 * 页面重定向（授权） - 确保页面链接正常
 * 支持多参、无参、指定页面
 * code在返回的search里
 * @returns {{needRedirect:boolean,homeUrl:string,search:{}}}
 */
export function urlResetForWxCode(){

    //需要重定向时：codepath参数与code参数同在

    let needRedirect = false , homeUrl = '',searchOb = {} , searchstr = ''
    let oriUrls = window.location.href.split('?')
    let baseShareURL = window.location.origin + window.location.pathname
    homeUrl = baseShareURL
    if(oriUrls.length > 1){
        let searchUrls = oriUrls[1].split('#')
        let searchUrlReal = searchUrls[0]
        let searchObReal = {}
        searchOb = Qs.parse(searchUrlReal)
        let {codepath} = searchOb
        if(codepath){
            config.platform.wxCode[codepath].forEach(item => searchUrlReal[item] = searchOb[item])
            if(config.platform.wxCode[codepath].length){
                searchstr = `?${Qs.stringify(searchObReal)}`
                homeUrl += `#${codepath}` + (searchstr.length > 1 ? searchstr :'')
            }
        }
        return {
            needRedirect,
            homeUrl,
            search:searchOb
        }
    }

}


export function timeFrom(minute){
    let s1 = Math.floor(minute / 60);
    s1 = s1<10?'0'+s1:s1+'';
    let s2 = (minute % 60);
    s2 = s2<10?'0'+s2:s2+'';
    return s1 + ":" + s2;
}
export function  timeToNumber(timeStr){
    if(!!timeStr){
        let splits = timeStr.split(":");
        return parseInt(splits[0])*60+parseInt((splits[1]));
    }
}

export default {
    formatTime,
    formatDate,
    formatNumber,
    getCookie,
    setCookie,
    removeCookie,
    GetRequest,
    mobileRegExp,
    getTimeUnix,
    clearTime,
    compressImage,
    get_codeV3,
    urlResetForWxCode,
    timeFrom,
    timeToNumber
}
