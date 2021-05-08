<template>
	<view class="container">
		<view class="recommend-box">
			<uni-swipe-action class="" v-for="(item,index) in courseLibs" :key="index">
				<uni-swipe-action-item :options="optionText" @click="deletegoods(item)" :auto-close="false">
					<view class="goodsDetail-img" @click="toDetail(item)">
						<image :src="item.picture" mode=""></image>
					</view>
					<view class="goodsDetail-test" @click="toDetail(item)">
						<p class="teacher">{{item.name}}</p>
						<view class="text-middle">
							<p class="middle-detail live-time">{{item.hours}}</p>
							<p class="middle-detail learn-number">{{item.studiedNumber}}人学过</p>
							<button class="middle-detail">剩余学位：{{item.remainNumber}}位</button>
						</view>
						<view class="test-bottom ">
							<p class="thisPrice">￥{{item.priceDiscount[0]}}</p>
							<p class="lastPrice">￥{{item.priceOld[0]}}</p>
							<image src="../../static/img/singUp.png" mode="" class="singUp-img" v-show="item.singUpState == 'false' "></image>
							<image src="../../static/img/singUpEd.png" mode="" class="singUp-img" v-show="item.singUpState == 'true' "></image>
							<!-- <button open-type="share" class="share-img" catchtap="share"></button> -->
						</view>
					</view>

					<!-- 123 -->
				</uni-swipe-action-item>

			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
	import dataList from "../../static/testData.json"
	import userStatus from "@/units/common.js"
	import request from "@/units/request.js"
	export default {
		data() {
			return {
				courseLibs: '', //收藏详情
				optionText: [{
					text: '删除',
					style: {
						backgroundColor: '#FF7E29'
					}
				}],
				isOpend: false
			}
		},
		onReady() {
			userStatus.goLogin().then(res => {
				if (res) {
					this.getCollectionData() //获取收藏数据
				}
			}) //验证用户是否已登录
			// this.courseLibs = dataList.courseList
		},
		methods: {


			// 请求收藏数据
			getCollectionData() {
				let opts = {
					url: 'collect/list', //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					for (var i = 0; i < res.data.content.length; i++) {
						res.data.content[i].picture = this.$url + res.data.content[i].picture
						res.data.content[i].priceDiscount = res.data.content[i].priceDiscount.split(',')
						res.data.content[i].priceOld = res.data.content[i].priceOld.split(',')
					}
					console.log(res.data.content)
					this.courseLibs = res.data.content
				}, error => {
					console.log(error);
				})
			},


			//删除收藏商品
			deletegoods(item) {
				let _self = this
				this.isOpend = true
				uni.showModal({
					title: '提示',
					content: '是否删除',
					confirmText: "确认删除",
					cancelText: "取消",
					cancelColor: '',
					confirmColor: "",
					success: function(res) {
						//点击确定
						if (res.confirm) {
							let opts = {
								url: 'collect/delete?id=' + item.id, //接口地址
								method: 'GET' //请求类型
							};
							let param = {}; //该请求所需要的参数
							request.baseRequest(opts, param).then(res => {
								_self.getCollectionData() //重新请求一次数据
								uni.showToast({
									title: '删除成功',
									duration: 2000
								});
							}, error => {
								console.log(error);
							})
						} else {
							//点击取消
						}
					}
				});
			},

			//点击商品区商品详情页面
			toDetail(item) {
					uni.navigateTo({
						url: "../details/details?item=" + encodeURIComponent(JSON.stringify(item))
					})
			}
		}
	}
</script>

<style>
	@import url("collection.css");
</style>
