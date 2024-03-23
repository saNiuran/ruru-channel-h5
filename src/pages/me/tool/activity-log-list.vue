<template>
    <view class="container">
        <view class="info-content">
            <!--列表开始-->
            <uni-list :border="false">
                <uni-list-item :show-arrow="false" :right-text="item.createTime | filterTime"
                               v-for="(item,index) in logList" :key="index">
                    <template v-slot:default>
                        <view>{{item.remark}}</view>
                    </template>
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
import {filterPotentialMobileLog} from "../../../api/potential";

export default {
    name: "activity-log-list",
    components: {UniList,UniListItem},
    data() {
        return {
            id: null,

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
    onLoad(query) {
        if(!!query.id){
            this.id = parseInt(query.id);
        }else{
            return;
        }

        this.initData();
    },
    methods: {
        initData() {
            this.getPotentialMobileLogList();
        },
        getPotentialMobileLogList(){
            let self = this;
            let param = {
                page: this.page,
                size: this.size,
                potentialMobileId: this.id,
            }
            filterPotentialMobileLog(param).then(res=>{
                if(res.retCode===0){
                    let logList = res.data.list;
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
    },
    onPullDownRefresh() {
        this.loadingType = 1;

        this.page = 1

        this.getPotentialMobileLogList();

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
        this.getPotentialMobileLogList();
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
    padding: 20rpx !important;
    min-height: 100rpx;
    background-color: white;
    border-radius: 20rpx;

    display: flex;
    justify-content: center;
}

/deep/ .uni-list-item__content {
    text-align: left;
}

/deep/ .uni-list-item__container {
    padding: 0rpx !important;
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
