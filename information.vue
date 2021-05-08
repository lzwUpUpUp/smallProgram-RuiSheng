<template>
	<view class="container">
		<!--  -->
		<view class="headImg">
			<text>头像</text>
			<image :src="portrait" mode=""></image>
		</view>
		<!--  -->
		<view class="user-Detail">
			<view class="nickname common">
				<text class="common-left">昵称</text>
				<text class="common-right">{{name}}</text>
			</view>
			<view class="common">
				<text class="common-left">性别</text>
				<view class="common-right">
					<picker @change="bindPickerChange" :value="index" :range="sexArray">
						<view class="uni-input">{{sexArray[index]}}
							<uni-icons color="#bbb" size="14" type="arrowright" />
						</view>
					</picker>
				</view>
			</view>
			<view class="common">
				<text class="common-left">生日</text>
				<view class="common-right">
					<picker mode="date" :value="date" @change="bindDateChange">
						<view class="uni-input">{{date}}
							<uni-icons color="#bbb" size="14" type="arrowright" />
						</view>
					</picker>
				</view>

			</view>

			<view class="common">
				<text class="common-left">姓名</text>
				<input type="text" placeholder="请输入姓名" class="common-right" v-model="trueName" style="padding-right: 28rpx" />
			</view>

			<view class="common" @click="open()">
				<text class="common-left">手机号码</text>
				<view class="common-right">{{phoneNumber}}
					<uni-icons color="#bbb" size="14" type="arrowright" />
				</view>
			</view>

			<view class="common" @click="emailOpen()">
				<text class="common-left">邮箱</text>
				<view class="common-right">{{emailText}}
					<uni-icons color="#bbb" size="14" type="arrowright" />
				</view>
			</view>
		</view>

		<!-- 手机号码弹出层 -->
		<uni-popup ref="phonePopup" type="center" animation="ture">
			<view class="last-box">
				<view class="phone-box">
					<input type="number" placeholder="请输入手机号码" maxlength="11" class="phoneNumber" v-model="phoneInput" />
				</view>
				<view class="cancel-button" @click="phoneCancel">取消</view>
				<view class="sure-button" @click="phoneSure">确定</view>
			</view>
		</uni-popup>



		<!-- 邮箱号码弹出层 -->
		<uni-popup ref="emailPopup" type="center" animation="ture">
			<view class="last-box">
				<view class="phone-box">
					<input type="number" placeholder="请输入邮箱 " class="phoneNumber" v-model="emailInput" />
				</view>
				<view class="cancel-button" @click="emailCancel">取消</view>
				<view class="sure-button" @click="emailSure">确定</view>
			</view>
		</uni-popup>


		<!-- 手机号码和邮箱格式错误提示框 -->
		<uni-popup ref="warning" type="center" animation="ture">
			<view class="warning-text">
				{{warnText}}
			</view>
		</uni-popup>


	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import request from "@/units/request.js"
	export default {
		components: {
			uniPopup,

		},
		data() {
			return {
				portrait: '', //用户头像
				name: '', //用户名称
				index: '',
				sexArray: ['女', '男'],
				date: '',
				phoneNumber: '',
				phoneInput: '',
				warnText: '',
				// 邮箱
				emailText: '',
				emailInput: '',
				trueName: '', //用户的真实名称
			}
		},
		onReady() {
			try { //设置性别
				var gender = uni.getStorageSync('gender');
				if (gender) {
					this.index = gender
				}
			} catch (e) {}
			this.portrait = this.$store.state.userPic
			this.name = this.$store.state.userName

			this.getUserData() //获取用户信息

			this.qrCode() //二维码
		},

		onUnload() { //页面退出时，提交信息
			this.submitInfor() //提交信息
		},
		methods: {
			//获取用户信息
			getUserData() {
				let opts = {
					url: 'user/currentUser', //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					this.date = res.data.content.birthday //生日
					this.phoneNumber = res.data.content.phone //手机号码
					this.emailText = res.data.content.email //邮箱
					this.trueName = res.data.content.name //用户姓名
				}, error => {
					console.log(error);
				})
			},

			// 获取二维码
			qrCode() {
			
				// var id = ""
				// try {
				// 	id = uni.getStorageSync('openid');
				// } catch (e) {}
				// uni.request({
				// 	url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
				// 	method: 'POST',
				// 	scence:id,
				// 	path: '/pages/index/index',
				// 	success(res) {
				// 		console.log(res)
				// 	}
				// })
			},



			//提交信息
			submitInfor() {
				let opts = {
					url: 'user/update', //接口地址
					method: 'POST' //请求类型
				};
				let param = {
					birthday: this.date, //生日
					phone: this.phoneNumber,
					email: this.emailText,
					name: this.trueName
				}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {

				}, error => {
					console.log(error);
				})
			},


			// 男女选择变化
			bindPickerChange(e) {
				this.index = e.target.value
			},
			// 生日选择
			bindDateChange(e) {
				this.date = e.target.value
			},
			//手机号码弹出框弹出
			open() {
				this.$refs.phonePopup.open()
			},
			//手机号码弹出框取消按钮
			phoneCancel() {
				this.$refs.phonePopup.close()
			},
			//手机号码弹出框确定按钮
			phoneSure() {
				var myreg = /^1[3458]\d{9}$/;
				var inpVal = this.phoneInput;
				if (!myreg.exec(inpVal)) {
					// console.log('请输bai入正确的手机du号zhi')
					this.warnText = "请输入正确的手机号码"
					this.$refs.warning.open()
					setTimeout(() => {
						this.$refs.warning.close()
					}, 1500)
				} else {
					this.phoneNumber = this.phoneInput
					this.$refs.phonePopup.close()
				}
			},


			//邮箱弹出框弹出
			emailOpen() {
				this.$refs.emailPopup.open()
			},
			//邮箱弹出框取消按钮
			emailCancel() {
				this.$refs.emailPopup.close()
			},
			//邮箱弹出框确定按钮
			emailSure() {
				var myreg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
				var inpVal = this.emailInput;
				if (!myreg.exec(inpVal)) {
					this.warnText = "请输入正确的邮箱号码"
					this.$refs.warning.open()
					setTimeout(() => {
						this.$refs.warning.close()
					}, 1500)
				} else {
					this.emailText = this.emailInput
					this.$refs.emailPopup.close()
				}
			},

		},
	}
</script>

<style>
	@import url("information.css");
</style>
