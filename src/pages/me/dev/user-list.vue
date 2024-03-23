<template>
    <view class="container">
        <view class="info-content">
            <!--列表开始-->
            <uni-list :border="false">
                <view v-for="(item,index) in userList" :key="index"
                      @longpress.stop="longPress(item,index)">
                <uni-list-item :show-arrow="item.status<2" :title="item.nickName +'-'+ item.mobile"
                               :note="item | filterStatus(that)" :right-text="item.createTime | filterTime"
                                @click="toDetail(item)">
                </uni-list-item>
                </view>
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
import {formatTime, formatTime6} from "../../../utils/myUtil";
import {createCallLog, deleteCallLog, filterUserWithCall} from "../../../api/user";
import {loadUserStatusList} from "../../../api/basic";

export default {
    name: "user-list",
    components: {UniList,UniListItem},
    data() {
        return {
            that: this,

            userList: [],
            page: 1,
            size: 10,

            statusList: [],

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
        filterStatus(item, that) {
            const [obj] = that.statusList.filter(v => v.value === item.status)
            return (!!obj ? obj.label : '') + (item.callLog?' | '+formatTime(item.callLog.createTime):'');
        },
    },
    onLoad() {
        this.initData();
    },
    methods: {
        initData() {
            this.loadUserStatusList();
        },
        loadUserStatusList() {
            let self = this;
            loadUserStatusList({}).then(res => {
                if (res.retCode === 0) {
                    self.statusList = res.data;

                    self.filterUser();
                }
            });
        },
        filterUser(){
            let self = this;
            let param = {
                page: this.page,
                size: this.size,
            }
            filterUserWithCall(param).then(res=>{
                if(res.retCode===0){
                    let userList = res.data.list;
                    if (self.page === 1) {
                        self.userList.splice(0, self.userList.length);
                    }
                    userList.forEach(item => {
                        self.userList.push(item);
                    });
                    if (res.data.isLastPage) {
                        self.loadingType = 2;
                    } else {
                        self.loadingType = 0;
                    }
                }
            });
        },
        toDetail(item){
            if(item.status===2){
                return;
            }
            uni.navigateTo({
                url: './user-detail?id=' + item.id,
            })
        },
        longPress(item,index) {
            let self = this;
            if(!item.callLog) {
                uni.showModal({
                    title: '系统提示',
                    content: '联系过了此用户【' + item.nickName + '】吗？',
                    success: (ee) => {
                        if (ee.confirm) {
                            self.createCallLog(item, index);
                        }
                    }
                })
            }else {
                uni.showModal({
                    title: '系统提示',
                    content: '取消联系此用户【' + item.nickName + '】吗？',
                    success: (ee) => {
                        if (ee.confirm) {
                            self.deleteCallLog(item, index);
                        }
                    }
                })
            }
            return true;
        },
        createCallLog(item,index){
            let self = this;
            createCallLog({userId: item.id}).then(res=>{
                if(res.retCode===0){
                    item.callLog = res.data;
                }
            });
        },
        deleteCallLog(item,index){
            let self = this;
            deleteCallLog(item.callLog).then(res=>{
                if(res.retCode===0){
                    item.callLog = null;
                }
            });
        }

    },
    onPullDownRefresh() {
        this.loadingType = 1;

        this.page = 1

        this.filterUser();

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
        this.filterUser();
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
