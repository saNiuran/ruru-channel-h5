<template>
    <view class="container">
        <img :src="img" style="width: 65%">
        <view style="font-size: 20px;color: green;margin-top: 50px" v-if="isShow">
            {{ title }}
        </view>

    </view>
</template>

<script>
import {getQrMini} from "../../../api/user";

export default {
    name: "visit-code",
    data() {
        return {
            img: null,

            isShow: false,
            title: '小程序码',
        }
    },
    onLoad() {
        this.getQrMini();
    },
    methods: {
        //二维码
        getQrMini() {
            let self = this;
            getQrMini({}).then(res => {
                if (res.retCode === 0) {
                    self.img = res.data.imgUrl;
                    self.isShow = true;
                }
            })
        }
    }
}
</script>

<style scoped>

.container {
    margin: 100px auto;
    text-align: center;
}

</style>
