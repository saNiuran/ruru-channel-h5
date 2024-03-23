<template>
    <view class="container">
        <view class="topHeight">
            <!--        输入金额开始-->
            <view class="withDraw_box">
                <view class="withDraw_box_title">
                    提现到微信零钱
                </view>

                <view class="withDraw_box_money">
                    <view>
                        ￥
                    </view>
                    <view>
                        <input type="number" placeholder="0.00" v-model="amount"/>
                    </view>

                </view>

                <!--        总金额-->
                <view class="total_money_box">
                    <view class="total_money_left">
                        可用余额：{{ agentUser.balance | filterPrice }}元
                    </view>
                    <view class="total_money_right" @click.stop="totalWithdraw">
                        全部提现
                    </view>
                </view>
            </view>
        </view>

        <view class="blank"></view>
        <!--        按钮开始-->
        <view class="bottom-box">
            <view class="button-box">
                <button class="submit-next" @click.stop="toSubmit" :disabled="disableSubmitBtn">
                    预计48小时内到账，确认提现
                </button>
            </view>
        </view>

    </view>
</template>
<script>

import {priceTranslate} from "../../../utils/myUtil";
import {decimal_two_digit} from "../../../utils/config";
import {createWithdraw} from "../../../api/finance";
import {getMyUserInfo} from "../../../api/user";

export default {
    name: "withdraw",
    data() {
        return {
            that: this,
            amount: null,
            agentUser: {},
            disableSubmitBtn: true,
        }
    },
    filters: {
        filterPrice(number) {
            return priceTranslate(number);
        },
    },
    watch: {
        amount: {
            handler(){
                if(!!this.amount && !new RegExp(decimal_two_digit).test(this.amount)){
                    uni.showToast({
                        icon: 'none',
                        title: '最多2位小数',
                        duration: 1500
                    });
                    this.disableSubmitBtn = true;
                    return;
                }
                this.disableSubmitBtn =  !(!!this.amount && Number(this.amount*1000) <= this.agentUser.balance);

            },
            deep: true,
        }
    },
    onLoad() {
        this.initData();
    },
    methods: {
        initData() {
            this.getMyBalance();
        },
        getMyBalance() {
            let self = this;
            getMyUserInfo().then(res => {
                if (res.retCode === 0) {
                    self.agentUser = res.data;
                }
            });
        },
        //提现
        toSubmit() {
            if (!(new RegExp(decimal_two_digit)).test(this.amount)) {
                uni.showToast({
                    title: '提现金额最多两位小数',
                    icon: "none",
                    duration: 2000
                })
                return
            }

            if (Number(this.amount) < 0) {
                uni.showToast({
                    title: '提现金额必须大于0',
                    icon: "none",
                    duration: 2000
                })
                return
            }

            let paramsData = {
                amount: Number(this.amount) * 1000,
                lordType: 1, //agentUser
            }
            createWithdraw(paramsData).then(res=>{
                if(res.retCode===0){
                    uni.showToast({
                        title: '提交成功！',
                        icon: "none",
                        duration: 2000
                    })
                    setTimeout(() => {
                        let pages = getCurrentPages();
                        let prevPage = pages[pages.length - 2];
                        prevPage.$vm.otherFun(res.data);
                        uni.navigateBack({
                            delta: 1,
                        })
                    }, 2000);
                }
            });
        },
        //全部提现按钮
        totalWithdraw() {
            this.amount = Number(this.agentUser.balance / 1000).toFixed(2) ;
        },
    }
}
</script>

<style scoped lang="scss">
page {
    background: #f2f2f2;
}

.container {
    width: 100%;
    height: 100%;
}

.bankCard-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: white;
    padding: 40rpx 20rpx 40rpx 30rpx;
}

.info-left{
    display: flex;
    flex-flow: row;
    align-items: flex-start;
    justify-content: flex-start;
}

.info-right{
    padding-left: 60rpx;
}

.bankCard-img {
    width: 70rpx;
    height: 50rpx;
    margin-right: 30rpx;
}

.bankCard-img image {
    margin-top: 4rpx;
    width: 100%;
    height: 100%;
}

.bankCard-txt {
    display: flex;
    flex-direction: column;
    align-items: left;
}

.bankCard_right_top {
    font-size: 28rpx;
    color: #333333;
}

.bankCard_right_bottom {
    font-size: 24rpx;
    color: #999999;
    margin-top: 10rpx;
}

.withDraw_box {
    background: white;
    padding: 40rpx;
    border-top: 20rpx solid #eeeeee;

    .withDraw_box_title {
        font-size: 30rpx;
        color: #999999;
    }

    .withDraw_box_money {
        display: flex;
        padding: 60rpx 0;
        align-items: center;
        font-size: 72rpx;
        color: #333333;
        border-bottom: 2rpx solid #e0e0e0;

        input {
            font-size: 72rpx;
            color: #333333;
            height: 100rpx;
            line-height: 100rpx;
        }
    }


    .total_money_box {
        padding-top: 30rpx;
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;

        .total_money_left {
            color: #999999;
        }

        .total_money_right {
            color: #2078e4;
        }

    }
}


.blank {
    height: 112rpx;
}

.bottom-box {
    width: 100%;
    background: #ffffff;
    position: fixed;
    left: 0;
    bottom: 0;

    .button-box {
        display: flex;
        flex-direction: row;
        align-items: center;

        .submit-next {
            width: 100%;
            height: 92rpx;
            line-height: 88rpx;
            border-radius: 0;
            border: 2rpx solid #13ad65;
            font-size: 36rpx;
            background: #13ad65;
            color: #ffffff;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

    }

    .button-box uni-button[disabled]{
        background: #76b799;
        color: #eeeeee;
    }

    .button-box button[disabled]{
        background: #76b799;
        color: #eeeeee;
    }

}


</style>
