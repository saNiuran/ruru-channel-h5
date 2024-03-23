import Vue from 'vue'
import {myRequest} from "../utils/api";

Vue.prototype.$myRequest = myRequest;

export const filterBalanceLog = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/balance/log/filter',
        method: 'post',
        data: params,
    });
};

export const createWithdraw = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/withdraw/new',
        method: 'post',
        data: params,
    });
};

export const revokeWithdraw = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/withdraw/revoke',
        method: 'post',
        data: params,
    });
};

export const filterWithdraw = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/withdraw/filter',
        method: 'post',
        data: params,
    });
};
