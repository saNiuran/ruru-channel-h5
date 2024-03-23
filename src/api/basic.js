import Vue from 'vue'
import {myRequest} from "../utils/api";

Vue.prototype.$myRequest = myRequest;

export const loadGenderList = () => {
    return Vue.prototype.$myRequest({
        url: '/user/basic/enum/user/gender',
        method: 'get',
        data: {},
        silent: 1,
    });
};

export const loadUserCertLevelList = () => {
    return Vue.prototype.$myRequest({
        url: '/user/basic/enum/user/cert/level',
        method: 'get',
        data: {},
        silent: 1,
    });
};

export const loadUserMemberLevelList = () => {
    return Vue.prototype.$myRequest({
        url: '/user/basic/enum/user/member/level',
        method: 'get',
        data: {},
        silent: 1,
    });
};

export const loadUserStatusList = () => {
    return Vue.prototype.$myRequest({
        url: '/user/basic/enum/user/status',
        method: 'get',
        data: {},
        silent: 1,
    });
};

export const getPotentialChannelAll = () => {
    return Vue.prototype.$myRequest({
        url: '/channel/basic/enum/potential/channel',
        method: 'get',
        data: {},
        silent: 1,
    });
};

export const getWithdrawStatusAll = () => {
    return Vue.prototype.$myRequest({
        url: '/channel/basic/enum/withdraw/status',
        method: 'get',
        data: {},
        silent: 1,
    });
};
