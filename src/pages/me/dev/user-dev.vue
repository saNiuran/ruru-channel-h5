<template>
    <view class="container">
        <wuc-tab :tab-list="tabBars" @change="onTabItemClick" textFlex :tabCur.sync="tabIndex"
                 tab-class="text-center text-black bg-white" select-class="text-orange"
                 :class="active==='debug'?'debug-tab-choose':''"></wuc-tab>

        <!--        信息列表开始-->
        <view class="info-content">
            <view v-for="(tabBar,index) in tabBars" :key="index">
                <block v-if="tabIndex===index">
                    <!--列表开始-->
                    <uni-list :border="false">
                        <uni-list-item :show-arrow="true" :title="item.user.nickName" :note="item.user.mobile"
                                       :right-text="item.createTime | filterTime"
                                       v-for="(item,idx) in tabBar.dataList" :key="idx" @click="toDetail(item)">
                        </uni-list-item>
                    </uni-list>
                    <!--列表结束-->

                    <text class="loading-text">
                        {{
                            tabBar.loadingType === 0 ? contentText.contentdown : (tabBar.loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)
                        }}
                    </text>
                </block>
            </view>
        </view>


    </view>
</template>


<script>
import {active} from "../../../utils/config";
import UniListItem from "../../../components/uni-list-item/uni-list-item";
import UniList from "../../../components/uni-list/uni-list";
import wucTab from "../../../components/wuc-tab/wuc-tab";
import {filterUserChannel} from "../../../api/user";
import {formatTime6} from "../../../utils/myUtil";

export default {
    name: "user_dev",
    components: {UniList, UniListItem, wucTab},
    data() {
        return {
            active: active,
            timer: 0,

            tabBars: [
                {
                    value: 0,
                    name: '未付费',
                    statusList: [0],  //0=未付费
                    page: 1,
                    size: 10,
                    dataList: [],
                    loadingType: 2,
                },
                {
                    value: 0,
                    name: '已付费',
                    statusList: [1, 2],  //1=已蓝V付费  //2=已VIP会员
                    page: 1,
                    size: 10,
                    dataList: [],
                    loadingType: 2,
                },
            ],
            tabIndex: 0,

            isLoading: false,

            contentText: {
                contentdown: "上拉显示更多",
                contentrefresh: "正在加载...",
                contentnomore: "这是底线..."
            },
        }
    },
    filters: {
        filterTime(time) {
            return "注册时间 "+formatTime6(new Date(time));
        },
    },
    onLoad() {
        this.agentUser = uni.getStorageSync('agentUser');

        if (!this.agentUser) {
            this.toLogin();
            return;
        }

        this.initData();
    },
    methods: {
        initData() {
            this.tabBars[this.tabIndex].loadingType = 1;
            this.tabBars[this.tabIndex].orderList = [];

            this.filterUserChannel();
        },
        filterUserChannel() {
            if (this.tabBars[this.tabIndex].isLoading) {
                return;
            }
            this.tabBars[this.tabIndex].isLoading = true;

            let self = this;
            let param = {
                page: this.tabBars[this.tabIndex].page,
                size: this.tabBars[this.tabIndex].size,
                statusList: this.tabBars[this.tabIndex].statusList,
                agentUserId: this.agentUser.id,
            }
            filterUserChannel(param).then(res => {
                self.tabBars[self.tabIndex].isLoading = false;
                if (res.retCode === 0) {
                    const rows = res.data.list;
                    if (self.tabBars[self.tabIndex].page === 1) {
                        self.tabBars[self.tabIndex].dataList.splice(0, self.tabBars[self.tabIndex].dataList.length);
                    }
                    rows.forEach(v => {
                        self.tabBars[self.tabIndex].dataList.push(v);
                    })
                    if (!!res.data.isLastPage || res.data.total === 0) {
                        self.tabBars[self.tabIndex].loadingType = 2;
                    } else {
                        self.tabBars[self.tabIndex].loadingType = 0;
                    }
                }
            }).catch(() => {
                this.tabBars[this.tabIndex].isLoading = false;
            });
        },

        onTabItemClick(e) {
            this.tabIndex = e;
            if (this.tabBars[this.tabIndex].dataList.length === 0) {
                this.filterUserChannel();
            }
        },
        toDetail(bean) {
            uni.navigateTo({
                url: './user-detail?id=' + bean.userId,
            })
        },
    },
    onPullDownRefresh() {
        this.tabBars[this.tabIndex].page = 1;
        this.tabBars[this.tabIndex].loadingType = 0;
        uni.stopPullDownRefresh();
        this.filterUserChannel();
    },
    onReachBottom: function () {
        if (this.tabBars[this.tabIndex].isLoading) {
            return;
        }
        if (this.tabBars[this.tabIndex].loadingType === 2) {
            return;
        }
        this.tabBars[this.tabIndex].page++;
        this.filterUserChannel();
    },
}
</script>

<style scoped lang="scss">

page {
    background: #f2f2f2;
}

.container {
    .info-content {
        margin: 20rpx 20rpx;
    }
}

/deep/ .uni-list {
    background-color: transparent !important;
}

/deep/ .uni-list-item {
    margin: 30rpx 30rpx 0 30rpx;
    min-height: 100rpx;
    display: flex;
    justify-content: center;
}

/deep/ .uni-list-item__content {
    text-align: left;
}

/deep/ .uni-list-item__container {
    background-color: white;
    padding: 20rpx !important;
    border-radius: 20rpx;
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
</style>
