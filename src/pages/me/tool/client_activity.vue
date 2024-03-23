<template>
    <view class="container">
        <!--        顶部选项卡开始-->
        <view class="tab-choose" :class="active==='debug'?'debug-tab-choose':''">
            <view v-for="(item,index) in menuList" :key="index" class="tab-item-box" @click.stop="showMenu(item)">
                <view :class="item.class">
                    {{ item.label }}
                </view>
                <view class="tab-item-img">
                    <img v-if="!item.panelShow" src="../../../static/img/ic_down_1.png" alt=""/>
                    <img v-else src="../../../static/img/ic_up_1.png" alt=""/>
                </view>
            </view>

            <view>
                <view :class="idx===0?'cover0':'cover1'" v-if="menu.panelShow" v-for="(menu,idx) in menuList" :key="idx"
                      @click.stop="coverClicked(idx)">
                    <scroll-view scroll-y="true" class="tab-list-sort">
                        <view class="tab-text-sort" v-for="(childMenuItem,childMenuIndex) in menu.menuItems"
                              :key="childMenuIndex"
                              :class="childMenuItem.value===menu.value?'other-selected':''"
                              @click.stop="onMenuItem(childMenuItem,idx,childMenuIndex)">
                            {{ childMenuItem.label }}
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>
        <!--        顶部选项卡结束-->

        <!--        信息列表开始-->
        <view class="info-content">
            <!--列表开始-->
            <uni-list :border="false">
                <uni-list-item :show-arrow="false"
                               v-for="(item,index) in potentialMobileList" :key="index">
                    <potential-cell :bean="item" @onSms="toSms(item)" @onLog="toLog(item)"
                                    @onDelete="toDelete(item)" @onEdit="toEdit(item)"/>
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
import {active} from "../../../utils/config";
import {deletePotentialMobile, filterPotentialMobile, promotePotentialMobile} from "../../../api/potential";
import potentialCell from "../../cell/potential-cell";
import UniListItem from "../../../components/uni-list-item/uni-list-item";
import UniList from "../../../components/uni-list/uni-list";

export default {
    name: "client_activity",
    components: {potentialCell, UniList, UniListItem},
    data() {
        return {
            active: active,
            timer: 0,

            menuList: [
                {
                    name: 'type',
                    label: '全部',
                    value: null,
                    panelShow: false,
                    menuItems: [{
                        value: null,
                        label: '全部'
                    }, {
                        value: 0,
                        label: '已报备'
                    }, {
                        value: 1,
                        label: '已注册'
                    }, {
                        value: 2,
                        label: '已签约'
                    }],
                },
                {
                    name: 'sort',
                    label: '时间倒序',
                    value: 0,
                    panelShow: false,
                    menuItems: [{
                        value: 0,
                        label: '时间倒序'
                    }, {
                        value: 1,
                        label: '时间升序'
                    }, {
                        value: 2,
                        label: '热度倒序'
                    }],
                }
            ],

            page: 1,
            size: 10,
            potentialMobileList: [],

            isLoading: false,
            loadingType: 2,
            contentText: {
                contentdown: "上拉显示更多",
                contentrefresh: "正在加载...",
                contentnomore: "这是底线..."
            },

            idEdit: null,
        }
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
        initData(){
            this.getPotentialMobileList();
        },

        showMenu(item) {
            this.menuList.forEach(v=>{
                v.panelShow = false;
            })
            item.panelShow = true;
        },
        coverClicked(index) {
            this.menuList[index].panelShow = false;
        },
        onMenuItem(item, index, childMenuIndex) {
            this.menuList[index].panelShow = false;
            this.menuList[index].label = item.label;
            this.menuList[index].value = item.value;

            if(index===1 && childMenuIndex===2 ){
                this.menuList[0].label = this.menuList[0].menuItems[2].label;
                this.menuList[0].value = this.menuList[0].menuItems[2].value;
            }
            this.page = 1;
            this.getPotentialMobileList();
        },
        getPotentialMobileList(){
            let self = this;
            let orderClause = "";
            switch (this.menuList[1].value){
                case 0:
                    orderClause = "update_time desc";
                    break;
                case 1:
                    orderClause = "update_time asc";
                    break;
                case 2:
                    orderClause = "hot desc";
                    break;
            }
            let param = {
                page: this.page,
                size: this.size,
                type: this.menuList[0].value,
                orderClause: orderClause,
            }
            filterPotentialMobile(param).then(res=>{
                if(res.retCode===0){
                    let potentialList = res.data.list;
                    if (self.page === 1) {
                        self.potentialMobileList.splice(0, self.potentialMobileList.length);
                    }
                    potentialList.forEach(item => {
                        self.potentialMobileList.push(item);
                    });
                    if (res.data.isLastPage) {
                        self.loadingType = 2;
                    } else {
                        self.loadingType = 0;
                    }
                }
            });
        },
        toEdit(bean){
            this.idEdit = bean.id;
            uni.navigateTo({
                url: './client_document?id='+ bean.id,
            })
        },
        toSms(bean){
            promotePotentialMobile({id: bean.id}).then(res=>{
                if(res.retCode===0){
                    uni.showToast({
                        title: '发送成功',
                        icon: 'none',
                        duration: 2000,
                    })
                }
            });
        },
        toLog(bean){
            uni.navigateTo({
                url: './activity-log-list?id='+bean.id,
            })
        },
        toDelete(bean){
            let self = this;
            deletePotentialMobile({id: bean.id}).then(res=>{
                if(res.retCode===0){
                    let index = self.potentialMobileList.findIndex(v=>{
                        return v.id === bean.id;
                    });
                    self.potentialMobileList.splice(index,1);
                }
            });
        },
        otherFun(object) {  //选择地址后的数据收集
            console.log(object);

            if (!!object) {
                let index = this.potentialMobileList.findIndex(v=>{
                    return v.id === this.idEdit;
                });
                console.log("index==",index);
                this.potentialMobileList.splice(index,1,object);
            }
        },
        refreshTimer(){
            this.timer = new Date().getTime();
        }
    },
    onPullDownRefresh() {
        this.loadingType = 1;

        this.page = 1

        this.getPotentialMobileList();

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
        this.getPotentialMobileList();
    },
}
</script>

<style scoped lang="scss">
@import "../../../static/css/tab.css";

page {
    background: #f2f2f2;
}

.container{
    .info-content {
        position: relative;

        /* #ifdef H5*/
        top: 86rpx;
        /* #endif */
        /* #ifdef MP-WEIXIN*/
        top: 0;
        /* #endif */
    }
}

/deep/ .uni-list {
    background-color: transparent !important;
}

/deep/ .uni-list-item__content {
    text-align: left;
}

/deep/ .uni-list-item__container {
    padding: 0rpx !important;
}

/deep/ .uni-list-item {
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
