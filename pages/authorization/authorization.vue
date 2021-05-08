<template>
	<view class="container">
		<p>您还没有登录，请授权登录</p>
		<button class='bottom' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
			授权登录
		</button>
	</view>
</template>

<script>
	import request from "@/units/request.js"
	export default {
		data() {
			return {}
		},
		methods: {
			//授权登录
			wxGetUserInfo() {
				let _self = this //uni.login中this指向会出错，需重指向
			
				// 获取用户信息
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						//infoRes里面有用户信息需要的话可以取一下
						uni.hideLoading();
						let opts = {
							url: 'user/save', //接口地址
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

						_self.loginStatus = "已登录";
						try {
							uni.setStorageSync('isCanUse', true); //记录是否第一次授权  true:表示不是第一次授权
							_self.$store.state.userName = infoRes.userInfo.nickName
							_self.$store.state.userPic = infoRes.userInfo.avatarUrl
							uni.showToast({
								title: '登录成功',
								duration: 2000
							}, uni.navigateBack({ //返回上一级页面
								delta: 1
							}))

						} catch (e) {}
					},
					fail: function(res) {}
				})
			},
		}
	}
</script>

<style>
	@import url("authorization.css");
</style>
