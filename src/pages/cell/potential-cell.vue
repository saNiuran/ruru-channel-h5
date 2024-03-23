<template>
    <view class="container">
        <view @click.stop="toLog">
            <view class="status-bar">
                <view class="left">{{ bean.potential.city }}</view>
                <view class="right">{{ bean.updateTime | filterTime }}</view>
            </view>
            <view class="content-box">
                <view class="company-info">
                    <view class="left">{{ bean.potential.companyName }}</view>
                </view>
                <view class="contact-info">
                    <view>
                        {{ bean.name ? bean.name : '' }}
                        {{ bean.mobile }}
                        <text style="color:red;">{{ !!bean.userId ? (!!bean.membershipOrderId?'已签约':' 已注册') : '' }}</text>
                    </view>
                    <view class="right" v-show="!!bean.rate">
                        <uni-icons type="fire" size="20" color="#fb5318"/> {{bean.rate}}
                    </view>
                </view>
                <view class="mobile-info">
                    <view>{{ bean.channel | filterChannel(that) }}</view>
                </view>
                <view class="photo-box">
                    <view class="img-item" v-for="(item,index) in bean.potential.photoList" :key="index">
                        <image :src="item.imgUrl" class="upload"></image>
                    </view>
                </view>
            </view>
            <view class="footer-bar">
                <button class="mini" :plain="true" type="default" :size="'mini'" @click.stop="toEdit">编辑</button>
                <button class="mini" :plain="true" type="default" :size="'mini'" @click.stop="toSms" v-if="!bean.membershipOrderId">促活</button>
                <button class="mini" :plain="true" type="warn" :size="'mini'" @click.stop="toDelete">删除</button>
            </view>
        </view>
    </view>
</template>

<script>
import {formatTime6} from "../../utils/myUtil";
import {getPotentialChannelAll} from "../../api/basic";
import UniIcons from "../../components/uni-icons/uni-icons";


export default {
    name: "potential-cell",
    components: {UniIcons},
    props: {
        bean: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            that: this,

            potentialMobile: {
                mobile: null,
                userId: null,
                createTime: null,
                updateTime: null,
                channel: null,

                potential: {
                    companyName: null,
                    contactName: null,
                    city: null,

                    photoList: [],
                },
            },
            channelType: [],

        }
    },
    filters: {
        filterTime(time) {
            return formatTime6(new Date(time));
        },
        filterChannel(channel, that) {
            const [obj] = that.channelType.filter(v => v.value === channel)
            return !!obj ? obj.label : '';
        },
    },
    onLoad() {
        this.initData();
    },
    methods: {
        initData() {
            this.getChannelEnum();
        },
        getChannelEnum() {
            let self = this;
            getPotentialChannelAll().then(res => {
                if (res.retCode === 0) {
                    self.channelType.splice(0, self.channelType.length);
                    res.data.forEach(v => {
                        self.channelType.push(v);
                    })
                }
            });
        },
        toEdit() {
            this.$emit("onEdit", this.bean);
        },
        toSms() {
            this.$emit("onSms", this.bean);
        },
        toLog() {
            this.$emit("onLog", this.bean);
        },
        toDelete() {
            this.$emit("onDelete", this.bean);
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    margin: 20rpx 20rpx 0 20rpx;
    padding: 20rpx;
    background-color: white;

    .status-bar {
        width: 100%;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;

        .left, .right {
            font-size: 28rpx;
        }

        padding-bottom: 6rpx;
        border-bottom: 1rpx solid #dedede;
    }

    .content-box {
        padding-top: 10rpx;
        display: flex;
        flex-flow: column;
        align-items: flex-start;
        justify-content: center;

        .company-info {
            width: 100%;
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-between;

            .left {
                color: #333;
                font-size: 34rpx;
                font-weight: bold;
            }
        }

        .contact-info {
            width: 100%;
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-between;

            .right {
                display: flex;
                flex-flow: row;
                align-items: center;
                font-size: 34rpx;
                color: #fb5318
            }
        }

        .mobile-info {

        }

        .photo-box {
            padding: 20rpx 0;
            display: flex;
            flex-flow: wrap;
            align-items: center;
            justify-content: flex-start;

            .img-item {
                width: 120rpx;
                height: 120rpx;
                border: 1px solid #ededed;
                position: relative;
                border-radius: 10rpx;
                margin: 10rpx 10rpx 0 0;
                display: flex;
                align-items: center;
                justify-content: center;

                image {
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 10rpx;
                }
            }
        }
    }

    .footer-bar {
        width: 100%;
        padding-top: 20rpx;
        border-top: 1rpx solid #ededed;

        display: flex;
        flex-flow: row;
        align-items: flex-start;
        justify-content: flex-end;

        .mini {
            margin-right: 20rpx;
            margin-left: 20rpx;
        }
    }
}


</style>
