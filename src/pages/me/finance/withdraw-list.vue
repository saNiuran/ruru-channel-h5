<template>
    <view class="container">
        <view class="wallet-top">
            <view class="wallet-number">账户余额(元)</view>
            <view class="number">{{ balance | filterPrice }}</view>
        </view>

        <view class="wallet-pay" @click.stop="toWithdraw">
            <view class="pay-left">
                <view class="pay-img">
                    <image src="../../../static/img/tixian.png"></image>
                </view>
                <view class="pay-text">提现</view>
            </view>
            <view class="pay-right">
                <uni-icons type="forward" size="22" color="#999999"></uni-icons>
            </view>
        </view>

        <view class="wallet-record">
            <view class="record-title">
                <view class="record-text">记录</view>
            </view>
            <scroll-view class="record-list-box">
                <view class="record-list" v-for="(item,index) in withdrawList" :key="index">
                    <view class="status">
                        <view class="left">{{ item.status | filterStatus(that) }}&nbsp;
                                [<text>{{ item.serialNo }}</text>] </view>
                        <view class="right">{{ item.createTime | filterTime }}</view>
                    </view>
                    <view class="record-mess">
                        <view class="amount">
                            <text>￥{{ item.amount | filterPrice }}</text>
                            <text style="padding-left: 10rpx">元</text>
                        </view>
<!--                        待打款(0), 已打款(1), 已取消(2), 已失效(3), 打款失败(4);-->
                        <button class="mini" :plain="true" type="default" :size="'mini'" v-if="item.status===0"
                                @click.stop="toRevoke(item.id, index)">撤销
                        </button>
                    </view>
                </view>
            </scroll-view>
        </view>

        <text class="loading-text">{{
                loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)
            }}
        </text>
    </view>

</template>
<script>
import UniList from "../../../components/uni-list/uni-list";
import UniListItem from "../../../components/uni-list-item/uni-list-item";
import UniIcons from "../../../components/uni-icons/uni-icons";
import {formatTime6, priceTranslate} from "../../../utils/myUtil";
import {filterWithdraw, revokeWithdraw} from "../../../api/finance";
import {getMyUserInfo} from "../../../api/user";
import {getWithdrawStatusAll} from "../../../api/basic";

export default {
    name: "withdraw-list",
    components: {UniList, UniListItem, UniIcons},
    data() {
        return {
            that: this,
            balance: 0,
            agentUser: {},

            withdrawList: [],
            page: 1,
            size: 10,

            isLoading: false,
            loadingType: 2,
            contentText: {
                contentdown: "上拉显示更多",
                contentrefresh: "正在加载...",
                contentnomore: "这是底线..."
            },
            statusList: [],
        }
    },
    filters: {
        filterTime(time) {
            return formatTime6(new Date(time));
        },
        filterPrice(number) {
            return priceTranslate(number);
        },
        filterStatus(status, that) {
            const [obj] = that.statusList.filter(v => v.value === status)
            return !!obj ? obj.label : '';
        },
    },
    onLoad() {
        this.agentUser = uni.getStorageSync('agentUser');
        this.initData();
    },
    methods: {
        initData() {
            this.getStatusList();
        },
        getStatusList() {
            let self = this;
            getWithdrawStatusAll().then(res => {
                if (res.retCode === 0) {
                    self.statusList.splice(0, self.statusList.length);
                    res.data.forEach(v => {
                        self.statusList.push(v);
                    });

                    self.getMyBalance();

                    self.getWithdrawList();
                }
            });
        },
        getMyBalance() {
            let self = this;
            getMyUserInfo().then(res => {
                if (res.retCode === 0) {
                    self.balance = res.data.balance;
                }
            });
        },

        getWithdrawList() {
            let self = this;
            let param = {
                page: this.page,
                size: this.size,
                statusList: [0,1,4],
                lordType: 1, //agentUser
                lordId: this.agentUser.id,
            }
            filterWithdraw(param).then(res => {
                if (res.retCode === 0) {
                    let withdrawList = res.data.list;
                    if (self.page === 1) {
                        self.withdrawList.splice(0, self.withdrawList.length);
                    }
                    withdrawList.forEach(item => {
                        self.withdrawList.push(item);
                    });
                    if (res.data.isLastPage) {
                        self.loadingType = 2;
                    } else {
                        self.loadingType = 0;
                    }
                }
            });
        },

        toWithdraw() {
            uni.navigateTo({
                url: './withdraw'
            })
        },
        toRevoke(id, index) {
            let self = this;
            uni.showModal({
                title: '系统提示',
                content: '确定要取消提现吗？',
                success: (ee) => {
                    if (ee.confirm) {
                        revokeWithdraw({id: id}).then(res => {
                            if (res.retCode === 0) {
                                self.withdrawList.splice(index, 1);

                                self.getMyBalance();
                            }
                        });
                    }
                }
            })
        },
        otherFun(object) {  //选择地址后的数据收集
            if (!!object) {
                this.withdrawList.unshift(object);

                this.getMyBalance();
            }
        },
    },
    onPullDownRefresh() {
        this.loadingType = 1;

        this.page = 1

        this.initData();

        setTimeout(() => {
            uni.stopPullDownRefresh()
        }, 1000)
    },

    onReachBottom: function () {
        if (this.isLoading) {
            return;
        }
        if (this.loadingType === 2) {
            return;
        }
        this.page ++;
        this.getWithdrawList();
    },
}
</script>

<style scoped lang="scss">

page {
    background: #f2f2f2;
}

.container {
    width: 100%;

    .wallet-top {
        height: auto;
        padding: 40rpx;
        background: #13ad65;

        .wallet-number {
            color: #ffffff;
            font-size: 30rpx;
            margin-top: 9rpx;
        }

        .number {
            color: #ffffff;
            font-size: 140rpx;
            margin: 80rpx 0 60rpx 0;
        }

    }

    .wallet-pay {
        background: #ffffff;
        padding: 30rpx 20rpx 30rpx 30rpx;
        border-bottom: 4rpx solid #f2f2f2;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .pay-left {
            overflow: hidden;
            display: flex;
            flex-direction: row;
            align-items: center;

            .pay-img {
                width: 50rpx;
                height: 35rpx;
                margin-right: 30rpx;

                image {
                    display: block;
                    width: 50rpx;
                    height: 35rpx;
                }
            }

            .pay-text {
                font-size: 32rpx;
                color: #333333;
            }
        }
    }

    .wallet-record {
        background: #ffffff;
        margin: 10rpx 0;
        padding: 10rpx 0;

        .record-title {
            color: #333333;
            padding: 0 30rpx;
            overflow: hidden;

            .record-text {
                padding:20rpx 0;
                font-size: 32rpx;
            }
        }

        .record-list-box {
            margin: 0 30rpx;
            width: 90%;
            overflow: hidden;

            .record-list {
                padding: 20rpx 0;
                border-top: 1rpx solid #eeeeee;

                display: flex;
                flex-flow: column;

                .status {
                    display: flex;
                    flex-flow: row;
                    align-items: center;
                    justify-content: space-between;

                    .left{
                        font-size: 24rpx;
                        color: #555555;
                    }

                    .right{
                        font-size: 24rpx;
                        color: #999999;
                    }
                }

                .record-mess {
                    padding: 20rpx 0 0 0;
                    display: flex;
                    flex-flow: row;
                    align-items: center;
                    justify-content: space-between;

                    .amount {
                        color: #555555;
                        font-size: 32rpx;
                        font-weight: bold;
                    }

                    .mini {
                        margin-left: 40rpx;
                        border-color: #dedede
                    }
                }

            }
        }
    }

    .loading-text {
        min-height: 40rpx;
        line-height: 40rpx;
        font-size: 25rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: #999999;
        padding: 20rpx 0rpx 30rpx 0rpx;
    }
}

</style>
