<template>
	<view>
		<u-popup :show="show" @close="cancel">
			<view class="title">{{popupTitle}}</view>
			<view style="padding: 20rpx;">
				<u-search v-if="showSearch" @custom="search" @search="search" :placeholder="placeholder"
					v-model="keyword"></u-search>
				<u-gap v-if="showSearch" height="15"></u-gap>
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="$emit('lower')">
				
					<!--单选-->
					<u-radio-group v-if="type == 'radio'" :borderBottom="true" iconPlacement="right" placement="column"
						@change="groupChange" v-model="radioValue">
						<u-radio :customStyle="{marginBottom: '12px'}" v-for="(item, index) in dataLists" :key="index"
							:label="item[name]" :name="index">
						</u-radio>
					</u-radio-group>
				
					<!--多选-->
					<u-checkbox-group v-if="type == 'checkbox'" :borderBottom="true" placement="column"
						iconPlacement="right" @change="checkboxChange" v-model="checkboxValue">
						<u-checkbox :customStyle="{marginBottom: '12px',paddingBottom:'12px'}"
							v-for="(item, index) in dataLists" :key="index" :label="item[name]" :name="index">
						</u-checkbox>
					</u-checkbox-group>
				
				</scroll-view>
				<u-gap height="45"></u-gap>
				<view class="bottons">
					<u-row>
						<u-col customStyle="padding:0 10rpx 20rpx 20rpx" span="6">
							<u-button @click="cancel">取消</u-button>
						</u-col>
						<u-col customStyle="padding:0 20rpx 20rpx 10rpx" span="6">
							<u-button @click="submit" type="primary" throttleTime="1000" :disabled="(JSON.stringify(radioData) === '{}') && (checkboxData.length === 0)">确认</u-button>
						</u-col>
					</u-row>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	/**
	 * 公共选择下拉框，基于uview。支持下拉加载、列表搜索、单选｜多选
	 * @author qianziyu
	 * @description 弹出层选择器，基于uview中u-popup实现
	 * @property {Array}			dataLists			数据列表
	 * @property {String}			name				列表显示的字段名
	 * @property {Boolean}			show				是否展示弹窗 (默认 false )
	 * @property {String}			type				选择类型 单选｜多选 (默认 单选 )
	 * @property {Boolean}			showSearch			是否显示搜索框 (默认 true )
	 * @property {String}	        popupTitle			列表标题
	 * @property {String}			placeholder			搜索框placeholder
	 * @event {Function} search 搜索事件，返回keyword
	 * @event {Function} lower 滑动到底部触发，用于下拉加载新数据
	 * @event {Function} cancel 组件关闭事件
	 * @event {Function} submit 提交按钮,返回选中的列表数据
	 * @example <common-select :show="show" :popupTitle="popupTitle" @cancel="show=false" @search="selectSearch" name="cworkStationName" @submit="onsubmit"
			:dataLists="dataLists" placeholder="输入工站名称搜索"></common-select>
	 */
	export default {
		name: "qianziyu-select",
		props: {
			dataLists: {
				default: {},
				type: Array
			},
			name: {
				default: 'name',
			},
			show: {
				default: false,
				type: Boolean
			},
			type: {
				default: 'radio',
				type: String
			},
			showSearch: {
				default: true,
				type: Boolean
			},
			popupTitle: {
				default: '列表选择',
				type: String
			},
			placeholder: {
				default: '请输入搜索内容'
			}
		},
		data() {
			return {
				keyword: '',
				scrollTop: 0,
				checkboxData: [],
				checkboxValue:[],
				radioData: {},
				radioValue: ''
			};
		},
		methods: {
			checkboxChange(n) {
				this.checkboxData=[]
				n.forEach(key=>{
					this.checkboxData.push(this.dataLists[key])
				})
			},
			//选择列表项触发
			groupChange(n) {
				this.radioData = this.dataLists[n]
			},
			//点击搜索触发
			search() {
				this.$emit('search', this.keyword)
			},
			//点击取消按钮触发
			cancel() {
				this.$emit('cancel')
			},
			//提交触发
			submit() {
				if (this.type == 'radio') {
					if (JSON.stringify(this.radioData) == '{}') {
						uni.$u.toast('请选择数据')
						return;
					}
					this.$emit('submit', this.radioData)
				} else if (this.type == 'checkbox') {
					if (this.checkboxData.length == 0) {
						uni.$u.toast('请选择数据')
						return;
					}
					this.$emit('submit', this.checkboxData)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-popup {
		.title {
			border-bottom: 1px solid #f7f7f7;
			padding: 20rpx;
			text-align: center;
			font-weight: bold;
		}
	}

	.scroll-Y {
		height: 650rpx;
	}

	.bottons {
		background-color: white;
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		bottom: constant(safe-area-inset-bottom);
		bottom: env(safe-area-inset-bottom);
	}
</style>
