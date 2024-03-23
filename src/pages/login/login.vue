<template>
    <view>
        <view class="container">
            <view class="logo-box">
                <view class="logo-img">
                    <img src="../../static/img/logo_716.png" alt=""/>
                </view>
                <view class="logo-text">如如原料</view>
            </view>

            <view class="form-container">
                <view class="welcome">请登录代理商系统</view>
                <view class="input-box">
                    <view class="img-box">
                        <img src="../../static/img/ic_phone_1.png" alt=""/>
                    </view>
                    <view>
                        <input type="number" placeholder="请输入手机号" maxlength="11"
                               placeholder-style="color:#B4C3CE;font-size:28rpx;"
                               v-model="userName"/>
                    </view>
                </view>
                <view class="input-box">
                    <view class="img-box">
                        <img src="../../static/img/ic_code_1.png" alt=""/>
                    </view>
                    <view>
                        <input type="number" placeholder="请输入验证码" maxlength="4"
                               placeholder-style="color:#B4C3CE;font-size:28rpx;" v-model="code"/>
                    </view>
                    <view class="code-box" @click="requestCode">
                        <view class="button-code" type="default">{{ codeText }}</view>
                    </view>
                </view>

                <view class="button_box" @click="onSubmit">
                    <view class="button_box_txt">登录</view>
                </view>

            </view>
        </view>
    </view>
</template>

<script>
import {active, mobilePattern} from "../../utils/config";
import {getSmsCode, loginAgentUser} from "../../api/user";

export default {
    name: "login",
    data() {
        return {
            userName: null,
            code: null,

            disabled: false,
            interval: null,
            currentTime: 60,
            codeText: '发送验证码',
        }
    },
    onLoad() {
        if (active === "debug") {
            this.openId = "otkm751pQ7vo5qBCKEA9qvlg1yOg";       //liuche
            uni.setStorageSync("openId0", this.openId);
        } else {
            this.openId = uni.getStorageSync('openId0');
        }

        console.log("!this.openId===", this.openId);
        if (!this.openId) {
            uni.redirectTo({
                url: '/pages/wxCode/index',
            })
            return;
        }

        this.agentUser = uni.getStorageSync('agentUser');
        if (!!this.agentUser && !!this.agentUser.agentToken) {
            this.switchPage();
        }
    },
    methods: {
        //获取验证码
        requestCode() {
            let currentTime = this.currentTime;

            if (!this.userName || !(new RegExp(mobilePattern)).test(this.userName)) {
                uni.showToast({
                    icon: "none",
                    title: "请输入正确的手机号",
                    duration: 3000
                })
                return
            }

            this.interval = setInterval(() => {
                currentTime--;
                this.codeText = '等待' + currentTime + '秒'
                this.disabled = true

                if (currentTime <= 0) {
                    clearInterval(this.interval)
                    this.codeText = '重新发送'
                    this.disabled = false
                }
            }, 1000)

            let paramsData = {
                mobile: this.userName,
                type: 3,        //表示代理商登录
            }
            getSmsCode(paramsData).then(res => {
                if (res.retCode === 0) {
                    uni.showToast({
                        title: '验证码获取成功',
                        duration: 1000
                    })
                }
            });
        },

        onSubmit() {
            if (active === "debug") {
                this.userName = "13901655769";
                this.code = "1234";
            }

            if (!this.userName || !(new RegExp(mobilePattern)).test(this.userName)) {
                uni.showToast({
                    icon: "none",
                    title: "请输入正确的手机号",
                    duration: 3000
                })
                return
            }

            if (!this.code) {
                uni.showToast({
                    message: '验证码不能为空',
                    icon: 'none',
                    duration: 1000,
                });
                return;
            }

            let self = this;
            let paramsData = {
                userName: this.userName,
                smsCode: this.code,
            }
            loginAgentUser(paramsData).then(res => {
                if (res.retCode === 0) {
                    uni.showToast({
                        message: '登录成功',
                        icon: 'success',
                        duration: 2000
                    });
                    uni.setStorageSync("agentUser", res.data);

                    self.switchPage();
                }
            })
        },

        switchPage() {
            setTimeout(() => {
                uni.redirectTo({
                    url: '../index/index',
                });
            }, 1000);
        },
    },
}
</script>

<style scoped lang="scss">

page {
    background: #fff;
}

.container {
    height: 100%;
    width: 100%;

    background-image: url("../../static/img/login_back.png");
    background-position: top;
    background-size: contain;
    background-repeat: no-repeat;

    .logo-box {
        width: 100%;
        min-height: 420rpx;

        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        .logo-img {
            margin-top: 100rpx;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;

            img {
                width: 20%;
                height: auto;
            }
        }

        .logo-text {
            margin-top: 30rpx;
            color: white;
            font-size: 48rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
        }
    }

    .form-container {
        margin: 40rpx 30rpx 30rpx 30rpx;
        border-radius: 20rpx;
        background-color: white;
        padding: 40rpx;

        .welcome {
            color: #777777;
            font-size: 34rpx;
        }

        .input-box {
            border-radius: 10rpx;
            margin: 40rpx auto;
            height: 100rpx;
            background-color: #f4f5f6;

            display: flex;
            flex-direction: row;

            .img-box {
                width: 42rpx;
                margin: auto 20rpx;

                display: flex;
                flex-flow: row;
                align-items: center;

                img {
                    width: 100%;
                    height: auto;
                }
            }

            input {
                padding-top: 26rpx;
                font-size: 35rpx;
                color: #333;
            }

            .code-box {
                display: flex;
                flex-flow: row;
                align-items: center;

                .button-code {
                    color: #13ad65;
                    font-size: 28rpx;
                    padding-left: 0;
                    padding-right: 0;
                    border: 0rpx;
                }
            }
        }

        .button_box {
            margin: 60rpx auto;
            height: 92rpx;
            border-radius: 100rpx;
            background-color: #13ad65;
            box-shadow: 0 4rpx 5rpx 1rpx #CCDAE4;
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: center;

            .button_box_txt {
                color: white;
                font-size: 32rpx;
                letter-spacing: 4rpx;
            }

        }

    }
}

::v-deep uni-button {
    color: #13ad65;
    font-size: 28rpx;
    padding-left: 0;
    padding-right: 0;
    border: 0rpx;
    background-color: transparent;
    position: inherit;
}

</style>
