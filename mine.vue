<template>


	<view class="container">
		<!-- 我的收藏、订单管理、卡券包 -->
		<view class="personal-head">
			<view class="Head-portrait">
				<image :src="userPic" mode="" class="headPic"></image>
				<text>{{userName}}</text>
			</view>
			<view class="myDetail">
				<view class="" v-for="(item,index) in myDetailData" :key="index" @click="jumpPage(item)">
					<!-- <text>{{item.num}}</text> -->
					<image :src="item.img" mode=""></image>
					<p>{{item.title}}</p>
				</view>
			</view>
		</view>

		<!-- 基本信息、推广奖金、账号绑定、电话联系 -->
		<view class="middle-Part">
			<view class="middle-detail" v-for="(item,index) in middlePartData" :key="index" @click="countPage(item,index)">
				<image :src="item.img" mode=""></image>
				<text>{{item.name}}</text>
				<view class="into">
					<uni-icons color="#bbb" size="14" type="arrowright" style="margin-left: 6rpx;" />
				</view>
			</view>
		</view>
		<!-- 登录按钮 -->
		<button class='bottom' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
			{{loginStatus}}
		</button>
	</view>
</template>

<script>
	import request from "@/units/request.js"
	export default {
		data() {
			return {
				userName: '未登录',
				userPic: '../../static/img/timg.jpg',
				loginStatus: "",
				myDetailData: [{
						img: '../../static/img/collect.png',
						title: "我的收藏",
						path: '../collection/collection'
					},
					{
						img: '../../static/img/orderMan.png',
						title: "订单管理",
						path: '../management/management'
					},


				],
				middlePartData: [{
						img: "../../static/img/basicInformation.png",
						name: "基本信息",
						path: '../information/information'
					},
					{
						img: "../../static/img/promotionBonus.png",
						name: "推广奖金",
						path: '../promote/promote'
					}, {
						img: "../../static/img/account.png",
						name: "积分系统",
						path: ''
					}, {
						img: "../../static/img/telephone.png",
						name: "客服电话",
						path: ''
					},
				]
			}
		},
		onLoad(option) {},
		onReady() {
			// this.wxGetUserInfo()
			try {
				var load = uni.getStorageSync('isCanUse');
				if (load == true) {
					this.wxGetUserInfo()
				}
			} catch (e) {}
			this.loginStatus = this.$store.state.loginStatus
			this.wxGetUserInfo()
		},
		methods: {
			//授权登录
			wxGetUserInfo() {
				let _self = this //uni.login中this指向会出错，需重指向

				// 获取用户信息-------
				uni.showLoading({
					title: '登录中...'
				});
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						// 0是未知 1是男性 2是女性
						if (infoRes.userInfo.gender == 2) {
							infoRes.userInfo.gender = 0 //当为2女性的时候，将数值2改为0
						}
						uni.setStorageSync('gender', infoRes.userInfo.gender); //将用户性别存入本地
						// console.log('infoRes',infoRes)  //用户信息
						uni.hideLoading();
						let opts = {
							url: 'user/update', //接口地址
							method: 'POST' //请求类型
						};
						let param = {
							"nickName": infoRes.userInfo.nickName,
							"avatar": infoRes.userInfo.avatarUrl,
							"sex": infoRes.userInfo.gender,
						}; //该请求所需要的参数
						request.baseRequest(opts, param).then(res => {}, error => {
							console.log(error);
						})

						_self.loginStatus = "已登录"
						try {
							uni.setStorageSync('isCanUse', true); //记录是否第一次授权  true:表示不是第一次授权
							_self.$store.state.userName = infoRes.userInfo.nickName
							_self.$store.state.userPic = infoRes.userInfo.avatarUrl

						} catch (e) {}
					},
					fail: function(res) {
						uni.hideLoading();
					}
				})

			},

			//点击 我的收藏、订单管理跳转对应的页面
			jumpPage(item) {
				uni.navigateTo({
					url: item.path
				})
			},


			//基本信息、推广奖金、账号绑定、电话联系 点击跳转对应的页面
			countPage(item, index) {
				if (index == 3) {
					let _self = this
					var phone = ""
					uni.request({
						url: _self.$url + 'contact/list',
						success(res) {
							_self.merchantsPhone(res.data.content.serviceTel)
						}
					})
				} else if (index == 2) {
					uni.showToast({
						icon: 'none',
						title: '开发中',
						duration: 2000
					});
				} else {
					uni.navigateTo({
						url: item.path
					})
				}
			},



			merchantsPhone(phone) {
				console.log('phone', phone)
				uni.makePhoneCall({
					// 手机号
					phoneNumber: phone,
					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},


		},

		computed: {
			monitoring() {
				this.userName = this.$store.state.userName; //昵称
				this.userPic = this.$store.state.userPic; //头像
			}
		},
		watch: {
			monitoring() {}
		}
	}
</script>

<style>
	@import url("mine.css");
</style>
