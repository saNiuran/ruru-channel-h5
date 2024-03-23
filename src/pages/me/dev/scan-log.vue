<template>
    <view class="container">
        <view class="info-content">
            <!--列表开始-->
            <uni-list :border="false">
                <uni-list-item :show-arrow="!!item.userWx.userId"
                               :title="item.userWx.nickname?item.userWx.nickname:'匿名'"
                               :note="item.userWx.userId?'已注册':'未注册'"
                               :right-text="item.createTime | filterTime"
                               v-for="(item,index) in logList" :key="index" @click="toDetail(item.userWx)">
                </uni-list-item>
            </uni-list>
            <!--列表结束-->

            <text class="loading-text">{{
                    loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore)
                }}
            </text>
        </view>
    </view>

</template>

<script>
import UniListItem from "../../../components/uni-list-item/uni-list-item";
import UniList from "../../../components/uni-list/uni-list";
import {formatTime6} from "../../../utils/myUtil";
import {filterUserWxLog} from "../../../api/user";

export default {
    name: "scan-log",
    components: {UniList,UniListItem},
    data() {
        return {
            that: this,
            agentUser: {},
            total: 0,

            logList: [],
            page: 1,
            size: 10,

            isLoading: false,
            loadingType: 2,
            contentText: {
                contentdown: "上拉显示更多",
                contentrefresh: "正在加载...",
                contentnomore: "这是底线..."
            },

        }
    },
    filters: {
        filterTime(time) {
            return formatTime6(new Date(time));
        },
    },
    onLoad() {
        this.agentUser = uni.getStorageSync('agentUser');
        this.initData();
    },
    onShow() {

    },
    watch: {
        total: {
            handler(newVal){
                uni.setNavigationBarTitle({
                    "title": '扫码总数 【'+newVal +'】',
                })
            },
            immediate: true,
        }
    },
    methods: {
        initData() {
            this.getUserWxLogList();
        },
        getUserWxLogList(){
            let self = this;
            let param = {
                page: this.page,
                size: this.size,
                agentUserId: this.agentUser.id,
                action: 0, //扫码
            }
            filterUserWxLog(param).then(res=>{
                if(res.retCode===0){
                    let logList = res.data.list;
                    self.total = res.data.total;

                    if (self.page === 1) {
                        self.logList.splice(0, self.logList.length);
                    }
                    logList.forEach(item => {
                        self.logList.push(item);
                    });
                    if (res.data.isLastPage) {
                        self.loadingType = 2;
                    } else {
                        self.loadingType = 0;
                    }
                }
            });
        },
        toDetail(userWx){
            if(userWx && userWx.userId){
                uni.navigateTo({
                    url: './user-detail?id=' + userWx.userId,
                })
            }
        },
    },
    onPullDownRefresh() {
        this.loadingType = 1;

        this.page = 1

        this.getUserWxLogList();

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
        this.getUserWxLogList();
    },
}
</script>

<style scoped lang="scss">

page {
    background: #f2f2f2;
}

.container {
    width: 100%;
    height: 100%;

    .info-content {

    }
}

.amount-text {
    font-size: 40rpx;
    font-weight: bold;
    color: #555555;

    .amount-yuan{
        font-size: 34rpx;
        font-weight: normal;
    }
    .amount-sign{
        font-size: 40rpx;
        color: red;
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
