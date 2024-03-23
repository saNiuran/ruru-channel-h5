import Vue from 'vue'
import {myRequest} from "../utils/api";

Vue.prototype.$myRequest = myRequest;

/**
 * 登录Profile
 */
export const getSmsCode = (params) => {
    return Vue.prototype.$myRequest({
        url: '/sms/sms/getSmsCode',
        method: 'post',
        data: params,
    });
};


/**
 * 登录Profile
 */
export const loginAgentUser = params => {
    return Vue.prototype.$myRequest({
        url: '/channel/agent/user/login',
        method: 'post',
        data: params,
    });
};


/**
 * 更新Profile
 */
export const updateLoginProfile = params => {
    return Vue.prototype.$myRequest({
        url: '/login/profile/update',
        method: 'post',
        data: params,
    });
};



/**
 * 根据code检查是用户身份
 */
export const checkIn = (params) => {
    return Vue.prototype.$myRequest({
        url: '/sms/wx/code/for/openId',
        method: 'post',
        data: params,
    })
}


/**
 * 登录Profile
 */
export const getMyUserInfo = params => {
    return Vue.prototype.$myRequest({
        url: '/channel/agent/user/info/me',
        method: 'post',
        data: params,
    });
};

/**
 * 用户详情
 */
export const getUserInfoPackAnon = params => {
    return Vue.prototype.$myRequest({
        url: '/user/user/pack/anon',
        method: 'post',
        data: params,
    });
};

/**
 * 用户列表
 */
export const filterUserWithCall = params => {
    return Vue.prototype.$myRequest({
        url: '/channel/user/filter',
        method: 'post',
        data: params,
    });
};

/**
 * 获取小程序码
 */
export const getQrMini = params => {
    return Vue.prototype.$myRequest({
        url: '/channel/agent/user/qrCode/mini',
        method: 'post',
        data: params,
    });
};

/**
 * 小程序码扫码记录
 */
export const filterUserWxLog = params => {
    return Vue.prototype.$myRequest({
        url: '/user/user/wx/log/filter',
        method: 'post',
        data: params,
    });
};

/**
 * Info UserChannel
 */
export const infoUserChannelByUserId = params => {
    return Vue.prototype.$myRequest({
        url: '/user/user/channel/info/userId',
        method: 'post',
        data: params,
        silent: 1,
    });
};

/**
 * 扫码注册成功用户
 */
export const filterUserChannel = params => {
    return Vue.prototype.$myRequest({
        url: '/user/user/channel/filter',
        method: 'post',
        data: params,
    });
};


export const createCallLog = params => {
    return Vue.prototype.$myRequest({
        url: '/channel/call/log/new',
        method: 'post',
        data: params,
    });
};

export const deleteCallLog = params => {
    return Vue.prototype.$myRequest({
        url: '/channel/call/log/delete',
        method: 'post',
        data: params,
    });
};

