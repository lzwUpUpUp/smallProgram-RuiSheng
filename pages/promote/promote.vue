<template>
	<view class="container">
		<!--  -->
		<view class="topBack">
			<!-- 头部选择 -->
			<view class="topTab">
				<view class="selectType" v-for="(item,index) in tabData" :key="index" :id="tabNum == index?'tabLight':''" @click="chooseTab(item,index)">
					<p>￥{{item.money}}</p>
					<p>{{item.title}}</p>
				</view>
			</view>
		</view>

		<!-- 对应的每一个盒子 -->
		<!-- 可提现 -->
		<view class="withdrawalBox" v-show="boxNum == 0">
			<view class="withdrawalPic">
				<image src="../../static/img/withdrawalPic.png" mode=""></image>
				<text class=" bonusAmount">奖金金额</text>
				<text class="amountSize">￥{{amountSize}}</text>
			</view>
			<input type="number" value="" v-model="applyAmount" class="amountInput" placeholder="请输入提现金额" />
			<view class="withdrawalBtn" @click="applyFor">
				申请提现
			</view>
			<text class="tips">提现申请一个工作日到账</text>
			<image src="../../static/img/bottomPic.png" mode="" class="bottomPic"></image>
		</view>

		<!-- 已提现 -->
		<view class="haveDrawal" v-show="boxNum == 1">
			<view class="singleDrawal" v-for="(item,index) in drawalLibs" :key="index">
				<view class="singleDrawal-left">
					<p>微信提现</p>
					<p>{{item.time}}</p>
				</view>
				<view class="singleDrawal-right">
					￥{{item.money}}
				</view>
			</view>
		</view>




		<!-- 待审核 -->
		<view class="haveDrawal" v-show="boxNum == 2">
			<view class="singleDrawal" v-for="(item ,index) in toAudit" :key="index">
				<view class="singleDrawal-left">
					<p>微信提现待审核</p>
					<p>{{item.time}}</p>
				</view>
				<view class="singleDrawal-right">
					￥{{item.money}}
				</view>

			</view>
		</view>


		<!-- 总收益 -->
		<view class="commonBox" v-show="boxNum == 3">
			<view class="singleBox" v-for="(item ,index) in revenue" :key="index">
				<view class="box-top">
					<p>订单号：{{item.number}}</p>
					<p>{{item.className}}</p>
				</view>
				<view class="box-bottom">
					<p>姓名：{{item.name}}</p>
					<p> 联系电话：{{item.phone}}</p>
					<p>佣金:<text>￥{{item.price}}</text></p>
					<p>当前状态：已完成</p>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import dataList from "../../static/testData.json"
	import request from "@/units/request.js"
	export default {
		data() {
			return {
				tabData: [{
						title: "可提现",
						money: '1'
					},
					{
						title: "已提现",
						money: '1'
					},
					{
						title: "待审核",
						money: '1'
					}, {
						title: "总收益",
						money: '1'
					}
				],
				drawalLibs: [], //已提现记录
				toAudit: [], //待审核数据
				revenue: [], //总收益数据
				tabNum: 0,
				boxNum: 0,
				amountSize: '', //可提现的奖金金额
				applyAmount: '', //客户申请提现的金额
			}
		},
		onReady() {

			this.topData() //顶部数据
			this.haveWithdrawal() //获取已提现数据
			this.toAuditData() //获取待审核数据
			this.revenueData() //获取总收益数据
		},
		methods: {

			//获取顶部4个类型的数据
			topData() {
				let opts = {
					url: 'withdraw/index', //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					this.amountSize = res.data.content.useAmt
					this.tabData[0].money = res.data.content.useAmt
					this.tabData[1].money = res.data.content.receiveAmt
					this.tabData[2].money = res.data.content.amt
					this.tabData[3].money = res.data.content.sumAmt
				}, error => {
					console.log(error);
				})
			},




			//头部选择
			chooseTab(item, index) {
				this.tabNum = index
				this.boxNum = index
			},

			//获取已提现数据
			haveWithdrawal() {
				let opts = {
					url: 'withdraw/list?sts=1 ', //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					// console.log('已提现', res)
					for (var i = 0; i < res.data.content.length; i++) {
						var obj = {}
						obj.time = res.data.content[i].createTime
						obj.money = res.data.content[i].receiveAmt
						this.drawalLibs.push(obj)
					}
				}, error => {
					console.log(error);
				})
			},


			//获取待审核数据
			toAuditData() {
				let opts = {
					url: 'withdraw/list?sts=0 ', //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					// console.log('待审核', res)
					for (var i = 0; i < res.data.content.length; i++) {
						var obj = {}
						obj.time = res.data.content[i].createTime
						obj.money = res.data.content[i].receiveAmt
						this.toAudit.push(obj)
					}
				}, error => {
					console.log(error);
				})
			},


			//获取总收益数据
			revenueData() {
				let opts = {
					url: 'withdraw/orderList', //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					// console.log('总收益', res)
					for (var i = 0; i < res.data.content.length; i++) {
						var obj = {}
						obj.number = res.data.content[i].number
						obj.className = res.data.content[i].className
						obj.name = res.data.content[i].name
						obj.phone = res.data.content[i].phone
						obj.price = res.data.content[i].price
						this.revenue.push(obj)
					}
				}, error => {
					console.log(error);
				})
			},


			//提现按钮
			applyFor() {
				if (this.applyAmount > this.amountSize) {
					uni.showToast({
						title: '!!!超过可提现金额',
						duration: 2000,
						icon: 'none'
					});
					console.log(this.applyAmount, this.amountSize)
				} else if (this.applyAmount == '') {
                    uni.showToast({
                    	title: '!!!请输入提现金额',
                    	duration: 2000,
                    	icon: 'none'
                    });
				} else {
					
					let opts = {
						url: 'withdraw/save', //接口地址
						method: 'POST' //请求类型
					};
					let param = {
						name:  this.$store.state.userName,  //用户名字
						phone:this.$store.state.phone,  //用户电话号码
						amt:this.applyAmount ,//用户提现金额
						receiveAmt: this.tabData[1].money,  //已提现
						sumAmt: this.tabData[3].money  //总收益
					}; //该请求所需要的参数
					request.baseRequest(opts, param).then(res => {
						// 刷新一遍数据
						this.topData() //顶部数据
						this.haveWithdrawal() //获取已提现数据
						this.toAuditData() //获取待审核数据
						this.revenueData() //获取总收益数据
						uni.showToast({
							title: '提现成功',
							duration: 2000,
						});
					}, error => {
						console.log(error);
					})
					
				}
			}
		}
	}
</script>

<style>
	@import url("promote.css");
</style>
