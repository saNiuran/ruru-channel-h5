<template>
    <view class="index">
    </view>
</template>

<script>
import {GetRequest} from "../../utils/utils";
import {active, appId} from "../../utils/config";
import {checkIn} from "../../api/user";

export default {
    name: "index",
    data() {
        return {
            requestParam: '',
            weChatCode: '',
            openId: null,
        }
    },
    onLoad() {

        /**
         * 微信公众号获取code
         **/
        // #ifdef H5
        if (active === 'debug') {  //测试环境打开
            this.openId = "otkm751pQ7vo5qBCKEA9qvlg1yOg";
            uni.setStorageSync("openId0", this.openId);
        } else {  //生产环境
            this.openId = uni.getStorageSync("openId0")
        }

        this.requestParam = GetRequest();
        this.weChatCode = this.requestParam.code;
        if (!this.openId) {
            if (this.weChatCode == null || this.weChatCode.length === 0) {
                if (this.requestParam.code) {
                    // 获取到微信code，并授权登录
                    // this.code = this.requestParam.code;
                } else {
                    let pageUrl = window.location.href
                        .replace(/[/]/g, "%2f")
                        .replace(/[:]/g, "%3a")
                        .replace(/[#]/g, "%23")
                        .replace(/[&]/g, "%26")
                        .replace(/[=]/g, "%3d");
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" +
                        pageUrl +
                        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                }
            }

            if (this.weChatCode) {
                let self = this;
                checkIn({code: this.weChatCode}).then(res => {
                    if (res.retCode === 0) {
                        self.openId = res.data;  //注意这里id是小写
                        uni.setStorageSync('openId0', self.openId)

                        self.switchPage();
                    }
                });
            }
        } else {
            this.switchPage();
        }
        // #endif
    },
    methods: {
        switchPage() {

            let baseURL = window.location.origin;
            let pathname = window.location.pathname;
            setTimeout(() => {
                let url = '/pages/login/login';
                window.location.href = baseURL + pathname + '#' + url;
            }, 200)
        },
    }
}
</script>

<style scoped>
</style>
