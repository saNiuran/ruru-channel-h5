<template>
    <view class="container">
        <view v-if="userInfo" class="list-box">
            <uni-list>
                <view class="small-title">基本信息</view>
                <view class="info-block">
                    <uni-list-item title="头像" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="head-img">
                                <img :src="userInfo.avatar?userInfo.avatar:imgUrl+'/static/default-avatar.png'"
                                     alt=""/>
                            </view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="昵称" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.nickName }}</view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="手机号码" :show-arrow="false" @click="toCall">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.mobile }}</view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="性别" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.gender | filterGender(genderList) }}</view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="个性签名" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.slogan }}</view>
                        </template>
                    </uni-list-item>
                </view>

                <view class="small-title">认证信息</view>
                <view class="info-block">

                    <uni-list-item title="认证情况" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.certLevel | filterCertLevel(userCertLevelList) }}</view>
                        </template>
                    </uni-list-item>

                    <view v-if="userInfo.certLevel===3 && userInfo.blueCert.status===1">
                        <uni-list-item title="蓝V号" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.blueCert.blueName }}</view>
                            </template>
                        </uni-list-item>

                        <uni-list-item title="公司名称" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.blueCert.companyName }}</view>
                            </template>
                        </uni-list-item>

                        <uni-list-item title="社会编码" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.blueCert.socialCode }}</view>
                            </template>
                        </uni-list-item>

                        <uni-list-item title="认证时间" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.blueCert.updateTime | filterTime }}</view>
                            </template>
                        </uni-list-item>
                    </view>

                    <view v-if="userInfo.certLevel===2 && userInfo.corporateCert && userInfo.corporateCert.status===1">
                        <uni-list-item title="公司名称" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.corporateCert.name }}</view>
                            </template>
                        </uni-list-item>
                        <uni-list-item title="社会编码" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.corporateCert.socialCode }}</view>
                            </template>
                        </uni-list-item>
                        <uni-list-item title="认证时间" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.corporateCert.updateTime | filterTime }}</view>
                            </template>
                        </uni-list-item>
                    </view>
                    <view v-if="userInfo.certLevel===1 && userInfo.personalCert && userInfo.personalCert.status===1">
                        <uni-list-item title="认证时间" :show-arrow="false">
                            <template v-slot:footer>
                                <view class="label-box">{{ userInfo.personalCert.updateTime | filterTime }}</view>
                            </template>
                        </uni-list-item>
                    </view>

                    <uni-list-item title="会员" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.memberLevel | filterMemberLevel(userMemberLevelList)
                                }}
                            </view>
                        </template>
                    </uni-list-item>
                </view>

                <view class="small-title">付费情况</view>
                <view class="info-block">
                    <uni-list-item title="蓝V认证" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ (userInfo.blueCert && userInfo.blueCert.status===1) ? '已支付' : '未支付' }}</view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="VIP会员" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ (userInfo.member
                            && (userInfo.member.overTime-userInfo.member.beginTime)===365*24*3600*1000) ? '已支付' : '未支付' }}</view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="保证金" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">
                                {{ userInfo.userAccount ? (userInfo.userAccount.deposit / 1000).toFixed(2) : '0.00' }}元
                            </view>
                        </template>
                    </uni-list-item>
                </view>

                <view class="small-title">推广情况</view>
                <view class="info-block">
                    <uni-list-item title="扫码时间" :show-arrow="false" v-if="userChannel.scanLog">
                        <template v-slot:footer>
                            <view class="label-box">{{ userChannel.scanLog.createTime | filterTime }}</view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="注册时间" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.createTime | filterTime }}</view>
                        </template>
                    </uni-list-item>
                </view>

                <view class="small-title">活跃度</view>
                <view class="info-block">
                    <uni-list-item title="询价数量" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.userCounter ? userInfo.userCounter.enquiryCounter : '0'
                                }}
                            </view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="甩货数量" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.userCounter ? userInfo.userCounter.stockCounter : '0'
                                }}
                            </view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="报价数量" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">
                                {{ userInfo.userCounter ? userInfo.userCounter.quotationCounter : '0' }}
                            </view>
                        </template>
                    </uni-list-item>
                    <uni-list-item title="砍价数量" :show-arrow="false">
                        <template v-slot:footer>
                            <view class="label-box">{{ userInfo.userCounter ? userInfo.userCounter.haggleCounter : '0'
                                }}
                            </view>
                        </template>
                    </uni-list-item>
                </view>
            </uni-list>


        </view>
    </view>
</template>

<script>

import UniList from "../../../components/uni-list/uni-list";
import UniListItem from "../../../components/uni-list-item/uni-list-item";
import {formatTime6} from "../../../utils/myUtil";
import {loadGenderList, loadUserCertLevelList, loadUserMemberLevelList} from "../../../api/basic";
import {getUserInfoPackAnon, infoUserChannelByUserId} from "../../../api/user";

export default {
    components: {UniListItem, UniList},
    data() {
        return {
            imgUrl: 'https://web.ruru2050.com',
            userInfo: {},
            userChannel: {},
            agentUser: {},

            userCertLevelList: [],
            genderList: [],
            userMemberLevelList: [],
        }
    },
    filters: {
        filterCertLevel(level, list) {
            let obj = list.find(v => v.value === level);
            return !!obj ? obj.label : '';
        },
        filterMemberLevel(level, list) {
            let obj = list.find(v => v.value === level);
            return !!obj ? obj.label : '';
        },
        filterGender(level, list) {
            let obj = list.find(v => v.value === level);
            return !!obj ? obj.label : '';
        },
        filterTime(time) {
            return formatTime6(new Date(time));
        },
    },
    onLoad(options) {
        let id = options.id
        if (!!id) {
            this.userInfo.id = parseInt(id);
        }
        this.agentUser = uni.getStorageSync('agentUser');
        this.initData();
    },
    methods: {
        initData() {
            this.loadGenderList();
        },
        loadGenderList() {
            let self = this;
            loadGenderList({}).then(res => {
                if (res.retCode === 0) {
                    self.genderList = res.data;

                    self.loadUserCertLevelList();
                }
            });
        },
        loadUserCertLevelList() {
            let self = this;
            loadUserCertLevelList({}).then(res => {
                if (res.retCode === 0) {
                    res.data.forEach(v => {
                        if (v.label.indexOf("个人认证") > -1) {
                            v.label = "实名认证";
                        }
                    });
                    self.userCertLevelList = res.data;

                    self.loadUserMemberLevelList();
                }
            });
        },
        loadUserMemberLevelList() {
            let self = this;
            loadUserMemberLevelList({}).then(res => {
                if (res.retCode === 0) {
                    res.data.forEach(v => {
                        if (v.label.indexOf("付费用户") > -1) {
                            v.label = "VIP会员";
                        }
                    });
                    self.userMemberLevelList = res.data;

                    self.loadUserInfoPack();
                }
            });
        },
        loadUserInfoPack() {
            let self = this;
            getUserInfoPackAnon({id: this.userInfo.id}).then(res => {
                if (res.retCode === 0) {
                    self.userInfo = res.data;

                    self.getUserChannel();
                }
            });
        },
        getUserChannel() {
            let self = this;
            infoUserChannelByUserId({userId: this.userInfo.id, agentUserId: this.agentUser.id}).then(res => {
                if (res.retCode === 0) {
                    self.userChannel = res.data;
                }
            });
        },
        toCall() {
            //#ifdef H5
            window.location.href = 'tel:'+this.userInfo.mobile;
            //#endif
            //#ifndef H5
            let self = this;
            uni.showActionSheet({
                itemList: [this.userInfo.mobile, '呼叫'],
                success: function (res) {
                    if (res.tapIndex === 1) {
                        uni.makePhoneCall({
                            phoneNumber: self.userInfo.mobile,
                        })
                    }
                }
            })
            //#endif
        }
    }
}
</script>

<style scoped lang="scss">

.container {
    .list-box {
        margin: 12rpx 0;

        /deep/ .uni-list {
            background: transparent !important;

            .info-block {
                margin: 16rpx 20rpx 20rpx 20rpx;
                border-radius: 10rpx;
                background-color: white;
            }

            .small-title {
                font-size: 26rpx;
                color: #555555;
                margin-left: 30rpx;
                margin-top: 10rpx;
            }
        }
    }
}

/deep/ .uni-list-item__container {
    padding-left: 30rpx;
}

.head-img {
    width: 100rpx;
    height: 100rpx;
    display: block;
    overflow: hidden;
    border-radius: 50rpx;

    img {
        width: 100rpx;
        height: 100rpx;
    }
}

</style>
