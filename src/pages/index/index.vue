<template>
    <view class="container">
        <view class="user-info-box">
            <view class="left">
                <view class="inner-user-head-box">
                    <img :src="headImg" alt="">
                </view>
                <view class="user-nickname" v-if="agentUser.userWx">{{ agentUser.userWx.nickname }}</view>
            </view>
            <view class="right" @click="toExit">
                退出
            </view>
        </view>
        <view class="work-content-box">
            <view class="work-content-title">
                业绩
            </view>
            <uni-grid :column="2" :showBorder='false' :square='false' @change="gridClicked">
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="user_score">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="../../static/img/user_score.png"/>
                        </view>
                        <view class="cell-content-text">业绩</view>
                    </view>
                </uni-grid-item>
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="user_withdraw">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="../../static/img/user_balance.png"/>
                        </view>
                        <view class="cell-content-text">提现</view>
                    </view>
                </uni-grid-item>

            </uni-grid>
        </view>
        <view class="work-content-box">
            <view class="work-content-title">
                小程序推广
            </view>
            <uni-grid :column="2" :showBorder='false' :square='false' @change="gridClicked">
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="user_qr">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="../../static/img/ic_qr.png"/>
                        </view>
                        <view class="cell-content-text">小程序码</view>
                    </view>
                </uni-grid-item>
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="user_scan">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="../../static/img/ic_qr_scan.png"/>
                        </view>
                        <view class="cell-content-text">有效扫码</view>
                    </view>
                </uni-grid-item>
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="user_dev">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="../../static/img/ic_user_dev.png"/>
                        </view>
                        <view class="cell-content-text">扫码转换</view>
                    </view>
                </uni-grid-item>
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="user_all" v-if="supper">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="https://web.ruru2050.com/static/default-avatar.png"/>
                        </view>
                        <view class="cell-content-text">所有用户</view>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>
        <view class="work-content-box">
            <view class="work-content-title">
                客户报备
            </view>
            <uni-grid :column="2" :showBorder='false' :square='false' @change="gridClicked">
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="client_document">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="../../static/img/client_document.png"/>
                        </view>
                        <view class="cell-content-text">报备</view>
                    </view>
                </uni-grid-item>
                <uni-grid-item class="grid-cell-box" style="width: 50%" :index="client_activity">
                    <view class="grid-inner-cell">
                        <view class="cell-top-img">
                            <img alt="" src="../../static/img/client_activity.png"/>
                        </view>
                        <view class="cell-content-text">报备用户</view>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>

    </view>
</template>


<script>
import uniGrid from "../../components/uni-grid/uni-grid";
import uniGridItem from "../../components/uni-grid-item/uni-grid-item";

export default {
    name: "index",
    components: {uniGrid, uniGridItem},
    data() {
        return {
            headImg: '../../static/img/header.png',

            client_document: 0,
            client_activity: 1,
            user_score: 2,
            user_withdraw: 3,
            user_qr: 4,
            user_dev: 5,
            user_scan: 6,
            user_all: 7,

            agentUser: {
                id: null,
                userWx: {}
            },

            openId: null,
            supper: false,
        }
    },
    onLoad() {
        this.agentUser = uni.getStorageSync('agentUser');

        this.supper = !!(this.agentUser && this.agentUser.id && [1,6,17].indexOf(this.agentUser.id) > -1);
        this.headImg = this.agentUser.userWx.headimgurl;
    },
    onShow() {
    },
    methods: {
        gridClicked(e) {
            //准入申请
            if (e.detail.index === this.client_document) {
                uni.navigateTo({
                    url: "../me/tool/client_document",
                });
            } else if (e.detail.index === this.client_activity) {
                uni.navigateTo({
                    url: "../me/tool/client_activity",
                });
            } else if (e.detail.index === this.user_score) {
                uni.navigateTo({
                    url: "../me/finance/balance-log-list",
                });
            } else if (e.detail.index === this.user_withdraw) {
                uni.navigateTo({
                    url: "../me/finance/withdraw-list",
                });
            } else if (e.detail.index === this.user_dev) {
                uni.navigateTo({
                    url: "../me/dev/user-dev",
                });
            } else if (e.detail.index === this.user_scan) {
                uni.navigateTo({
                    url: "../me/dev/scan-log",
                });
            } else if (e.detail.index === this.user_all) {
                uni.navigateTo({
                    url: "../me/dev/user-list",
                });
            } else if (e.detail.index === this.user_qr) {
                uni.navigateTo({
                    url: "../me/qr/qr-mini",
                });
            }
        },
        toExit(){
            uni.showModal({
                title: '退出提示',
                content: "确定退出登录吗？",
                confirmColor: '#13ad65',
                cancelText: '取消',
                confirmText: '确定',
                success: function (res) {
                    if (res.confirm) {
                        uni.removeStorageSync('agentUser')
                        uni.removeStorageSync('openId')
                        uni.removeStorageSync('openId0')
                        uni.reLaunch({
                            url: '../login/login'
                        })
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">

page {
    background: #fff;
}

.container {
    height: 100%;
    width: 100%;

    background-image: url("../../static/img/index.png");
    background-position: top;
    background-size: contain;
    background-repeat: no-repeat;

    .user-info-box {
        padding: 10rpx 0 10rpx 0;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;

        .left {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: flex-start;

            .inner-user-head-box {
                margin: 30rpx;
                width: 120rpx;
                height: 120rpx;

                img {
                    width: 120rpx;
                    height: 120rpx;
                    border-radius: 65rpx;
                }
            }

            .user-nickname {
                font-size: 36rpx;
                font-weight: bold;
                color: white;
            }
        }

        .right {
            padding: 40rpx;
            color: white;
        }
    }

    .work-content-box {
        margin: 10rpx 30rpx 0rpx 30rpx;

        .work-content-title {
            font-size: 26rpx;
            color: #555555;
        }

        .grid-cell-box {
            margin: 20rpx 0;
            display: flex;
            flex-flow: row;
            align-content: center;

            .grid-inner-cell {
                width: 90%;
                margin: 0 auto;
                background: white;

                border-radius: 20rpx;
                border: 1rpx solid #13ad6577;

                .cell-top-img {
                    display: flex;
                    flex-flow: column;
                    align-content: center;
                    width: 100%;
                    margin: 40rpx auto 30rpx auto;
                }

                .cell-top-img img {
                    width: 100rpx;
                    height: 100rpx;
                    margin: 0 auto;
                }

                .cell-content-text {
                    width: 100%;
                    text-align: center;
                    margin-bottom: 30rpx;
                    color: #333333;
                }
            }
        }
    }

}


</style>
