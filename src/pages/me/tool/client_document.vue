<template>
    <view>
        <view class="container">
            <uni-forms class="uni-forms" label-position="left" border label-width="120">
                <h5 class="block_title">&nbsp;</h5>

                <view>
                    <uni-forms-item required label="手机号码">
                        <uni-easyinput type="textarea" v-model="mobile" :inputBorder="false"
                                       placeholder="请输入手机号码，多个号码可以逗号隔开"/>
                    </uni-forms-item>
                </view>

                <view>
                    <uni-forms-item label="姓名">
                        <uni-easyinput type="text" v-model="name" :inputBorder="false"
                                       placeholder="请输入联系人姓名"/>
                    </uni-forms-item>
                </view>

                <view>
                    <uni-forms-item label="公司名称">
                        <uni-easyinput type="text" v-model="potential.companyName" :inputBorder="false"
                                       placeholder="请输入公司名称"/>
                    </uni-forms-item>
                </view>

                <h5 class="block_title">&nbsp;</h5>

                <view @click.stop="loadCity">
                    <uni-forms-item label="所在城市：">
                        <uni-easyinput type="text" v-model="potential.city" :inputBorder="false"
                                       :styles="{disableColor:'white',textAlign: 'right'}" disabled readonly
                                       suffixIcon="arrowright"/>
                    </uni-forms-item>
                </view>

                <h5 class="block_title">&nbsp;</h5>

                <view>
                    <uni-forms-item label="相关图片">
                        <upload-img-bar ref="uploadImgBar" class="img-upload-bar" :show-number="false"
                                        :img-list="uploadImgList" :img-length-max="2" :key="timer"/>
                    </uni-forms-item>
                </view>

            </uni-forms>
            <Canvas type='2d' id='myCanvas' style='width: 414px; height: 736px;' hidden/>
        </view>
        <view class="blank">&nbsp;</view>
        <view class="footer">
            <button class="no_radius" style="background-color: #13ad65;color: white" @click.stop="toSubmit">
                {{ buttonValue }}
            </button>
        </view>

        <mpvue-city-picker
            ref="mpvueCityPicker"
            :pickerValueDefault="locationPickerValueDefault"
            @onConfirm="onConfirmCity"></mpvue-city-picker>

    </view>
</template>


<script>
import uniIcons from "../../../components/uni-icons/uni-icons";
import uploadImgBar from "../../cell/upload-img-bar";
import {mobilePattern} from "../../../utils/config";
import UniForms from "../../../components/uni-forms/uni-forms";
import UniFormsItem from "../../../components/uni-forms-item/uni-forms-item";
import areaData from "../../../components/mpvue-citypicker/src/city-data/area";
import cityData from "../../../components/mpvue-citypicker/src/city-data/city";
import provinceData from "../../../components/mpvue-citypicker/src/city-data/province";
import MpvueCityPicker from "../../../components/mpvue-citypicker";
import {getRegionOnIp} from "../../../api/base";
import {
    createPotential,
    createPotentialMobile,
    getPotentialMobile,
    updatePotentialMobile
} from "../../../api/potential";

export default {
    name: "client_document",
    components: {MpvueCityPicker, uniIcons, uploadImgBar, UniForms, UniFormsItem},
    data() {
        return {
            id: null,
            mobile: null,
            name: null,

            potential: {
                companyName: null,
                city: null,
            },

            uploadImgList: [],
            finalImgList: [],
            timer: 0,

            cityValue: null,
            cityLabel: null,
            locationPickerValueDefault: [0, 0, 0],
            locationPickerValueArray: [],

            buttonValue: '提交',
        }
    },
    onLoad(query) {
        this.agentUser = uni.getStorageSync('agentUser');

        if (!this.agentUser) {
            this.toLogin();
            return;
        }

        if(!!query.id){
            this.id = parseInt(query.id);
        }

        this.initData();
    },
    methods: {
        initData() {
            if(!!this.id){
                this.getPotentialMobile();
            }else {
                this.getCityOnIp();
            }
        },
        getPotentialMobile(){
            let self = this;
            getPotentialMobile({id: this.id}).then(res=>{
                if(res.retCode===0){
                    self.mobile = res.data.mobile;
                    self.name = res.data.name;
                    self.potential = {
                        companyName: res.data.potential.companyName,
                        city: res.data.potential.city,
                    };

                    res.data.potential.photoList.forEach(v=>{
                        self.uploadImgList.push(v.imgUrl);
                    });
                    self.refreshTimer();

                    let arr = self.potential.city.split(",");
                    let location = {
                        province: arr[0],
                        city: arr[1],
                        area: arr[2],
                    }

                    self.loadCityPickerDefault(location);
                    self.$refs.mpvueCityPicker.refreshPickValueDefault();
                }
            });
        },
        getCityOnIp() {
            let self = this;
            getRegionOnIp().then(res => {
                if (res.retCode === 0) {
                    self.potential.city = res.data.province + "," + res.data.city + "," + res.data.district;
                    let location = {
                        province: res.data.province,
                        city: res.data.city,
                        area: res.data.district,
                    }

                    self.loadCityPickerDefault(location);
                    self.$refs.mpvueCityPicker.refreshPickValueDefault();
                }
            });
        },
        loadCityPickerDefault(locationMap) {
            this.locationPickerValueDefault.splice(0, this.locationPickerValueDefault.length);
            // console.log(locationMap);
            if (locationMap.province) {
                let provinceId = provinceData.indexOf(provinceData.find(function (item) {
                    return item.label === locationMap.province;
                }));
                if (provinceId < 0) {
                    provinceId = 0;
                }
                this.locationPickerValueDefault.push(provinceId);
                if (locationMap.city) {
                    let cityId = cityData[provinceId].indexOf(cityData[provinceId].find(function (item) {
                        return item.label === locationMap.city;
                    }));
                    if (cityId === null || cityId < 0) {
                        cityId = 0;
                    }
                    this.locationPickerValueDefault.push(cityId);
                    if (!locationMap.area) {
                        locationMap.area = locationMap.city;
                    }
                    if (locationMap.area) {
                        let areaId = areaData[provinceId][cityId].indexOf(areaData[provinceId][cityId].find(function (item) {
                            return item.label === locationMap.area;
                        }));
                        if (areaId == null || areaId < 0) {
                            areaId = 0;
                        }
                        this.locationPickerValueDefault.push(areaId);
                    }
                }
            }
        },
        loadCity() {
            this.$refs.mpvueCityPicker.show();
        },
        onConfirmCity(e) {
            console.log(e);
            this.locationPickerValueDefault = [];
            this.locationPickerValueDefault.push(e.value);
            this.potential.city = e.label;
        },

        //表单验证
        validatorData() {

            if (!this.mobile.trim()) {
                return '请输入手机号码';
            } else {
                let mobile = this.mobile.trim();
                mobile = mobile.replace(/[ ]/g, ",");

                let arr = mobile.split(",");

                for (let i = 0; i < arr.length; i++) {
                    if (!(new RegExp(mobilePattern)).test(arr[i])) {
                        return "手机号码" + arr[i] + "错误";
                    }
                }
            }
        },
        //数据检验成功
        toSubmit() {
            this.finalImgList = this.$refs.uploadImgBar.getLocalImgList();

            let err = this.validatorData();
            console.log("err", err);
            if (!!err) {
                uni.showToast({
                    title: err,
                    icon: 'none',
                    duration: 2000,
                })
                return;
            }

            this.postData();
        },
        postData() {
            let self = this;
            let param = {
                id: this.id,
                name: !!this.name?this.name:'',
                potential: {
                    companyName: !!this.potential.companyName?this.potential.companyName:'',
                    city: this.potential.city,
                },
                mobileList: this.mobile.trim().replace(/[ ]/g, ",").split(","),
                photoList: this.finalImgList,
                channel: 0, //报备(0), 扫推广描(1);
            }
            if(!this.id) {
                createPotentialMobile(param).then(res => {
                    if (res.retCode === 0) {
                        uni.showModal({
                            content: "提交成功！继续报备吗？",
                            confirmColor: '#2195F2',
                            cancelText: '取消',
                            confirmText: '确定',
                            success: function (res1) {
                                if (res1.confirm) {
                                    uni.redirectTo({
                                        url: './client_document'
                                    })
                                } else {
                                    uni.navigateBack({
                                        delta: 1,
                                    })
                                }
                            }
                        });
                    }
                });
            }else {
                updatePotentialMobile(param).then(res => {
                    if (res.retCode === 0) {
                        if (res.retCode === 0) {
                            uni.showToast({
                                icon: 'none',
                                title: '操作成功',
                                duration: 2000
                            });
                            setTimeout(() => {
                                let pages = getCurrentPages();
                                let prevPage = pages[pages.length - 2];
                                prevPage.$vm.otherFun(res.data);
                                uni.navigateBack({
                                    delta: 1,
                                })
                            }, 2000);
                        }
                    }
                });
            }
        },
        refreshTimer(){
            this.timer = new Date().getTime();
        }

    }
}
</script>

<style scoped lang="scss">

.container {

    .title-tip {
        color: #999;
        padding: 30rpx 0 4rpx 10rpx;
        background-color: #f2f2f2;
    }
}

.footer {
    position: fixed;
    width: 100%;
    background-color: #ffffffff;
    bottom: 0;
    border-top: #e7e7e7 solid 1px;

    .no_radius {
        border-radius: 0rpx;
    }

}

.block_title {
    color: #999;
    padding: 16rpx 0 4rpx 20rpx;
    background-color: #f2f2f2;
}


.blank {
    min-height: 200rpx;
}

::v-deep .uni-forms {
    margin: 0rpx 30rpx 0rpx 30rpx;
    background-color: white;
}

::v-deep .uni-forms-item {
    min-height: 100rpx;
    display: flex;
    flex-flow: column;
    justify-content: center;
}


::v-deep .uni-forms-item__box {
    padding: 0rpx 20rpx 0 20rpx;
}

::v-deep .uni-forms-item__inner {
    display: flex;
    flex-flow: row;
    align-items: center;
}


::v-deep .uni-forms-item__label span {
    font-size: 30rpx;
}

::v-deep .uni-input-placeholder {
    font-size: 28rpx;
    color: #cccccc;
}

::v-deep .uni-textarea-placeholder {
    font-size: 28rpx;
    color: #cccccc;
}

::v-deep .uni-easyinput__content {
    background-color: #f4f4f4;
    min-height: 90rpx;
    border-radius: 6rpx;
}

::v-deep .uni-easyinput__content-input[disabled] {
    text-align: right;
}

::v-deep .uni-easyinput__content-textarea {
    padding: 10rpx;
}


</style>
