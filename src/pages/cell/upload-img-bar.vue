<template>
    <view>
        <view class="yjg-upload-img">
            <view class="yjg-showImg" v-for="(item,index) in localImgList" :key="index"
                  @longpress="onImgLongTap(index)" @click.stop="onImgTap(index)">
                <view class="yjg-delete-img" @click.stop="onDelete(index)" v-if="showDeleteBtn">
                    <uni-icons color="#ff5100" type="minus-filled" size="22"/>
                </view>
                <image :src="item" class="upload"></image>
            </view>
            <view class="img-box" @click="onPlus" v-if="showPlusBtn">
                <uni-icons color="#cccccc" type="plusempty" size="30"/>
            </view>
        </view>
        <view class="img-length" v-if="showNumber">{{ imgLength }}/{{ imgLengthMax }}</view>
    </view>
</template>

<script>
import UniIcons from "../../components/uni-icons/uni-icons";
import {baseUrl} from "../../utils/config";

export default {
    name: "uploadImgBar",
    components: {UniIcons},
    computed: {
        imgLength: {
            get(){
                return this.localImgList.length;
            },
            set(v) {

            }
        }
    },
    props: {
        imgList: {
            type: Array,
            default(){
                return [];
            },
        },
        imgLengthMax: {
            type: Number,
            default: 5,
        },
        showNumber: {
            type: Boolean,
            default() {
                return true;
            }
        }
    },
    data() {
        return {
            showDeleteBtn: false,
            showPlusBtn: true,
            localImgList: [],
        }
    },
    watch: {
        imgLength: function (){
            this.showPlusBtn = this.imgLength !== this.imgLengthMax;
        },
    },
    created(){
        this.token = uni.getStorageSync('token');
        this.imgList.forEach(v=>{
            this.localImgList.push(v);
        });
    },
    methods: {
        getLocalImgList(){
            return this.localImgList;
        },
        toLogin() {
            uni.showToast({
                icon: 'none',
                title: '请登录...',
                duration: 1500
            });
            setTimeout(() => {
                uni.navigateTo({
                    url: '../login/login'
                })
            }, 1500)
        },
        onImgLongTap(){
            this.showDeleteBtn = !this.showDeleteBtn;
        },
        onDelete(index){
            this.localImgList.splice(index, 1);
        },
        onPlus(){
            let self = this
            uni.showActionSheet({
                itemList: ['从相册中选择', '拍照'],
                itemColor: '#ff5300',
                success: function (res) {
                    if (res.tapIndex === 0) {
                        self.chooseImageShop('album')
                    } else if (res.tapIndex === 1) {
                        self.chooseImageShop('camera')
                    }
                },
                fail: function (res) {
                }
            });
        },
        //从相册中选择
        chooseImageShop(type) {
            let self = this
            uni.chooseImage({
                count: this.imgLengthMax - this.imgList.length, //默认9
                // sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: [type], //从相册选择还是拍照
                success: function (res) {
                    let filePathArray = res.tempFilePaths
                    let fileArray = res.tempFiles

                    // #ifdef H5
                    if (filePathArray.length > (self.imgLengthMax - self.imgList.length)) {
                        filePathArray = filePathArray.slice(0, (self.imgLengthMax - self.imgList.length))
                        fileArray = fileArray.slice(0, (self.imgLengthMax - self.imgList.length))
                    }
                    // #endif
                    self.handleEachFile(filePathArray, fileArray)
                }
            });
        },
        handleEachFile(filePathArray) {
            for (let i = 0; i < filePathArray.length; i++) {
                let imgFilePath = filePathArray[i];
                this.uploadImg(imgFilePath);        //采用unify接口上传，后端压缩
            }
        },

        //图片上传
        uploadImg(data) {
            let self = this;
            uni.showLoading({});
            uni.uploadFile({
                url: baseUrl + '/upload/unify/upload/image',
                filePath: data,
                name: 'file',
                header: {
                    // token: self.token,
                    // appversion: "h5"
                },
                method: 'POST',
                success: function (res) {
                    uni.hideLoading();
                    console.log(res.data)
                    let resp = JSON.parse(res.data)
                    if (resp.retCode === 0) {
                        self.localImgList.push(resp.data[0].webPath);
                    } else {
                        let resCode = resp.retCode.toString()
                        if (resCode.indexOf('401') > -1) {
                            uni.removeStorageSync('token')
                            self.toLogin();
                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: resp.message,
                                duration: 3000
                            })
                        }
                    }
                },
                fail: function (err) {
                    uni.hideLoading();
                    console.log(err)
                    uni.showToast({
                        icon: 'none',
                        title: '上传失败',
                        duration: 3000
                    })
                },
                complete: () => {
                    self.showDeleteBtn = false
                    self.imgLength = self.imgList.length
                }
            })
        },
        onImgTap(index) {
            uni.previewImage({
                current: index,
                urls: this.localImgList,
                indicator: 'number',
                loop: true
            });
        },
    }
}
</script>

<style scoped>
.yjg-upload-img {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    justify-content: flex-start;
}

.yjg-showImg {
    width: 120rpx;
    height: 120rpx;
    border: 1px solid #ededed;
    position: relative;
    border-radius: 10rpx;
    margin: 10rpx 10rpx 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.yjg-showImg image {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 10rpx;
}

.yjg-delete-img {
    position: absolute;
    top: -16rpx;
    right: -10rpx;
    width: 40rpx;
    height: 40rpx;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}

.img-box {
    width: 120rpx;
    height: 120rpx;
    border: 1px solid #e0e0e0;
    border-radius: 10rpx;
    margin: 10rpx 10rpx 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.img-box image {
    display: block;
    width: 40rpx;
    height: 40rpx;
    margin: 40rpx auto;
}

.img-length {
    clear: both;
    height: auto;
    font-size: 30rpx;
    color: #fc5300;
    text-align: right;
}

</style>
