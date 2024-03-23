import {baseUrl} from './config.js'

export const myRequest = (options) => {
    let showLoading = false;

    if(!options.header){
        options.header = {};
    }

    options.header["appType"] = 2;
    options.header["openId"] = uni.getStorageSync("openId0");
    options.header["agentToken"] = uni.getStorageSync("agentUser").agentToken;

    if (!options.silent) {
        uni.showLoading({});
        showLoading = true;
    }

    return new Promise((resolve,reject) => {
        wx.request({
            url:baseUrl+options.url,
            method:options.method || 'GET',
            data: options.data || {},
            header:options.header || {},
            success: (res) => {
                if (showLoading) {
                    uni.hideLoading();
                }
                if (res.statusCode === 200) {
                    if (res.data.retCode === 0) {
                        console.log(res.data.retCode, options);
                        console.log(res.data.retCode, res.data);
                        resolve(res.data);
                    } else if ((res.data.retCode + '').indexOf("401") > -1) {
                        uni.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 3000
                        })
                        uni.removeStorageSync("agentUser");
                        setTimeout(() => {
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        }, 1000)
                    } else {
                        console.log(res.data.retCode, res.data);
                        console.log(res.data.retCode, options);
                        if (!options.silent) {  //非静默方式
                            uni.showToast({
                                title: res.data.message,
                                icon: 'none',
                                duration: 3000
                            })
                        }
                        if(!!options.catch){  //指定需要截获错误信息进行处理
                            reject(res.data);
                        }else if (!!options.data && (!!options.data.page || !!options.data.pageNum)) {  //获取分页列表的接口，进行出错处理
                            reject(res.data);
                        }
                    }
                } else {
                    uni.showToast({
                        title: '接口请求失败！' + res.statusCode,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: (err) => {
                if (showLoading) {
                    uni.hideLoading();
                }
                console.log("网络错误：",err)
                uni.showToast({
                    title:JSON.stringify(err),
                    icon:'none',
                    duration:3000
                })
            }
        })
    })
}
