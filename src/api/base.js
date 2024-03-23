import Vue from 'vue'
import {myRequest} from "../utils/api";

Vue.prototype.$myRequest = myRequest;

export const getRegionOnIp = params => {
    return Vue.prototype.$myRequest({
        url: '/base/location/parse/region/simple',
        method: 'post',
        data: params,
        silent: 1,
    });
};
