<template>
	<view class="container" style="overflow: hidden;">
		<ul class="head">
			<li v-for="(item,index) in topTitle" :key="index" :class="{chooseTitle : chooseTitle == index}" @click="manaType(item,index)">
				{{item.title}}
			</li>
		</ul>


		<view class="goodsBox" v-show="chooseTitle == 0">

			<p class="showText" v-if="manaList.length == 0">暂无此类订单</p>

			<view class="management-box" v-for="(item,index) in manaList" :key="index">
				<view class="management-box-top">
					<view class="">
						<image src="../../static/img/order.png" mode=""></image>
						<text class="order-number">订单号：{{item.number}}</text>
					</view>
					<text class="order-status">{{item.type==1?'交易成功':'未付款'}}</text>
				</view>
				<!-- -->
				<view class="management-box-middle">
					<image :src="item.picture" mode=""></image>
					<view class="middle-detail">
						<text class="course-name">{{item.className}}</text>
						<text class="course-price">￥{{item.price}}</text>
						<text class="course-class" v-show="item.lesson !== underfine"><text v-show="judgeShow == true">共</text>{{item.lesson}}<text v-show="judgeShow == true">节课程</text>
						</text>
					</view>
				</view>
				<view class="management-box-bottom">
					<text>合计：</text>
					<text>{{item.price}}</text>
				</view>
				<view class="commonBtn" @click="tojudge(item)" v-show="item.type==1">
					立即评价
				</view>
				<view class="delete-order" @click="deleteOrder(item.id,index)" v-show="item.type==0">
					删除订单
				</view>
				<view class="commonBtn" v-show="item.type==0" @click="payTheGoods(item)">
					立即付款
				</view>
			</view>
		</view>

		<!-- 已付款盒子 -->
		<view class="goodsBox" v-show="chooseTitle == 1">

			<!-- <view class="showIcon" v-if="hasBeen.length == 0">
				<image src="../../static/img/account.png" mode=""></image>
			</view> -->
			<p class="showText" v-if="hasBeen.length == 0">暂无此类订单</p>

			<view class="management-box" v-for="(item,index) in hasBeen" :key="index">
				<view class="management-box-top">
					<view class="">
						<image src="../../static/img/order.png" mode=""></image>
						<text class="order-number">订单号：{{item.number}}</text>
					</view>
					<text class="order-status">交易成功</text>
				</view>
				<!-- -->
				<view class="management-box-middle">
					<image :src="item.picture" mode=""></image>
					<view class="middle-detail">
						<text class="course-name">{{item.className}}</text>
						<text class="course-price">￥{{item.price}}</text>
						<text class="course-class" v-show="item.lesson !== underfine">共{{item.lesson}}节课时</text>
					</view>
				</view>
				<view class="management-box-bottom">
					<text>合计：</text>
					<text>{{item.combined}}</text>
				</view>
				<view class="commonBtn" @click="tojudge(item)">
					立即评价
				</view>

			</view>
		</view>


		<!-- 未付款盒子 -->
		<view class="goodsBox" v-show="chooseTitle == 2">

			<!-- <view class="showIcon" v-if="notPaying.length == 0">
				<image src="../../static/img/account.png" mode=""></image>
			</view> -->
			<p class="showText" v-if="notPaying.length == 0">暂无此类订单</p>

			<view class="management-box" v-for="(item,index) in notPaying" :key="index">
				<view class="management-box-top">
					<view class="">
						<image src="../../static/img/order.png" mode=""></image>
						<text class="order-number">订单号：{{item.number}}</text>
					</view>
					<text class="order-status">未付款</text>
				</view>
				<!-- -->
				<view class="management-box-middle">
					<image :src="item.picture" mode=""></image>
					<view class="middle-detail">
						<text class="course-name">{{item.className}}</text>
						<text class="course-price">￥{{item.price}}</text>
						<text class="course-class" v-show="item.lesson !== underfine">共{{item.lesson}}节课时</text>
					</view>
				</view>
				<view class="management-box-bottom">
					<text>合计：</text>
					<text>{{item.combined}}</text>
				</view>
				<view class="delete-order" @click="deleteOrder(item.id)">
					删除订单
				</view>
				<view class="commonBtn" v-show="item.type==0">
					立即付款
				</view>
			</view>
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
				topTitle: [{
						title: '全部'
					},
					{
						title: '已支付'
					},
					{
						title: '未付款'
					}
				],
				chooseTitle: 0,
				manaList: '', //订单数据，包括已付款跟未付款
				hasBeen: [], //已付款
				notPaying: [], //未付款
				judgeShow:true,//判定用户是从课程出发还是从学习用品出发,从学习用品跳过来时false
			}
		},

		onReady() {
			userStatus.goLogin().then(res => {
				if (res) {
					this.reqData()
				}
			}) //验证用户是否已登录
			if(this.$store.state.judgeShow == false){
				this.judgeShow = this.$store.state.judgeShow
			}

		},
		methods: {

			//请求数据
			reqData() {
				let opts = {
					url: 'order/list', //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					for (var i = 0; i < res.data.content.length; i++) {
						res.data.content[i].picture = this.$url + res.data.content[i].picture
					}
					this.manaList = res.data.content //全部
				}, error => {
					console.log(error);
				})

			},


			manaType(item, index) {
				this.chooseTitle = index
				if (index == 1) { //已付款
					let opts = {
						url: 'order/list?type=' + 1, //接口地址
						method: 'GET' //请求类型
					};
					let param = {}; //该请求所需要的参数
					request.baseRequest(opts, param).then(res => {
						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].picture = this.$url + res.data.content[i].picture
						}
						this.hasBeen = res.data.content //全部
					}, error => {
						console.log(error);
					})
				} else if (index == 2) { //未付款
					let opts = {
						url: 'order/list?type=' + 0, //接口地址
						method: 'GET' //请求类型
					};
					let param = {}; //该请求所需要的参数
					request.baseRequest(opts, param).then(res => {
						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].picture = this.$url + res.data.content[i].picture
						}
						this.notPaying = res.data.content //全部
					}, error => {
						console.log(error);
					})
				}
			},



			// 删除订单按钮
			deleteOrder(id,index) {
				let _self = this
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
								url: 'order/delete?id=' + id, //接口地址
								method: 'GET' //请求类型
							};
							let param = {}; //该请求所需要的参数
							request.baseRequest(opts, param).then(res => {
								
								uni.showToast({
									title: '删除成功',
									duration: 2000
								});
								_self.reqData() //删除成功后重新请求一次数据
								_self.notPaying.splice(index,1)  //在前端先做一次删除
							}, error => {
								console.log(error);
							})

						} else {
							//点击取消
						}
					}
				});
			},

			// 跳转至评论页面
			tojudge(item) {
				uni.navigateTo({
					url: "../judgement/judgement?item=" + encodeURIComponent(JSON.stringify(item))
				})
			},

			// 支付未支付订单
			payTheGoods(item) {
				let opts = {
					url: 'order/pay', //接口地址
					method: 'POST' //请求类型
				};
				let param = {
					"number": item.number,
				}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					if (res.data.code == 2000) {
						// 	//调起支付
						this.payMentSuccess(res)
					}
				}, error => {
					console.log(error);
				})
			},

			//实施支付
			payMentSuccess(res) {
				let _self = this
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: res.data.content.timeStamp,
					nonceStr: res.data.content.nonceStr,
					package: res.data.content.package,
					signType: 'MD5',
					paySign: res.data.content.sign,
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						uni.showToast({
							title: '支付成功',
							duration: 2000
						});
						_self.reqData() //重新请求数据
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			}

		}
	}
</script>

<style>
	@import url("management.css");
</style>
