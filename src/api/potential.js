import Vue from 'vue'
import {myRequest} from "../utils/api";

Vue.prototype.$myRequest = myRequest;

export const getPotentialMobile = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/potential/mobile/info/multi',
        method: 'post',
        data: params,
    });
};

export const createPotentialMobile = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/potential/mobile/new',
        method: 'post',
        data: params,
    });
};

export const updatePotentialMobile = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/potential/mobile/update',
        method: 'post',
        data: params,
    });
};

export const filterPotentialMobile = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/potential/mobile/filter',
        method: 'post',
        data: params,
    });
};

export const deletePotentialMobile = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/potential/mobile/delete',
        method: 'post',
        data: params,
    });
};

export const promotePotentialMobile = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/potential/mobile/promote',
        method: 'post',
        data: params,
    });
};


export const filterPotentialMobileLog = (params) => {
    return Vue.prototype.$myRequest({
        url: '/channel/potential/mobile/log/filter',
        method: 'post',
        data: params,
    });
};
