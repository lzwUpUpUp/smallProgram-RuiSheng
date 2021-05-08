<template>
	<view class="container">
		<view class="course-element">
			<image :src="goodsData.pic" mode=""></image>
			<view class="course-element-box">
				<text class="course-element-name">{{goodsData.name}}</text>
				<text class="course-element-price">￥{{goodsData.price}}</text>
				<text class="course-element-num">{{goodsData.time}}</text>
				</text>
			</view>
		</view>

		<view class="goods-price">
			<text class="text">商品</text>
			<text class="price">￥{{goodsData.price}}</text>
		</view>
		<view class="goods-price">
			<text class="text">订单总计</text>
			<text class="price">￥{{goodsData.price}}</text>
		</view>
		<view class="goods-price">
			<text class="text">支付方式</text>
			<text class="paymanetTerms">微信支付</text>
		</view>
		<view class="goods-trems">
			<text class="text">手机号码</text>
			<!-- <text class="paymanetTerms">微信支付</text> -->
			<input type="number" placeholder="*请输入手机号码" maxlength="11" class="phoneNumber" v-model="phoneInput" />
		</view>
		<view class="goods-price">
			<text class="text">姓名</text>
			<!-- <text class="paymanetTerms">微信支付</text> -->
			<input type="text" placeholder="*请输入姓名" class="phoneNumber" v-model="userName" />
		</view>
		<!-- 	<view class="goods-invoice">
			<text class="text">发票信息</text>
			<view class="paymanetTerms" @click="chooseInvoice()">选择抬头
				<uni-icons color="#bbb" size="14" type="arrowright" />
			</view>
		</view> -->
		<view class="goods-price" v-show="invoiceShow">
			<text class="text">抬头名称</text>
			<text class="price">{{invoiceTitle}}</text>
		</view>
		<view class="goods-price" v-show="invoiceShow">
			<text class="text">抬头税号</text>
			<text class="price">{{invoiceNumber}}</text>
		</view>


		<view class="page-bottom">
			<view class="page-bottom-left">
				<view class="">
					<text>应付金额：</text>
					<text>￥{{goodsData.price}}</text>
				</view>
			</view>
			<view class="page-bottom-right" @click="makeSureStatus">
				确定
			</view>
		</view>



	</view>
</template>

<script>
	import request from "@/units/request.js"
	export default {
		data() {
			return {
				goodsData: '', //课程详情
				invoiceTitle: '', //抬头名称
				invoiceNumber: '', //抬头税号
				invoiceShow: false, //抬头名称，抬头税号是否显示
				orderNumber: '', //生成预付款的订单号
				phoneInput: '', //手机号码
				userName: '', //用户姓名
				warnText: '',
			}
		},
		onLoad(option) {
			this.goodsData = JSON.parse(decodeURIComponent(option.item))
		},
		onReady() {
			
			try {
				var number = uni.getStorageSync('phone');
				var name = uni.getStorageSync('userName');
				if (number) {
					this.phoneInput = number
				}
				if (name) {
					this.userName = name
				}
			} catch (e) {}
		},
		methods: {
			//  选择发票
			chooseInvoice() {
				var _self = this
				uni.chooseInvoiceTitle({
					success(res) {
						console.log(res.type);
						console.log(res.title);
						console.log(res.taxNumber);
						console.log(res.companyAddress);
						console.log(res.telephone);
						console.log(res.bankName);
						console.log(res.bankAccount);
						_self.invoiceTitle = res.title
						_self.invoiceNumber = res.taxNumber
						_self.invoiceShow = true
					}
				})
			},

			makeSureStatus() {
				if (this.phoneInput && this.userName) {

					var myreg = /^1[3458]\d{9}$/;
					var inpVal = this.phoneInput;

					if (!myreg.exec(inpVal)) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的手机号码',
							duration: 2000
						});
					} else {
						var _self = this
						uni.setStorageSync('phone', _self.phoneInput); //将手机号码存入本地
						uni.setStorageSync('userName', _self.userName); //将用户存入本地
						_self.creatOrder() //生成预订单
					}

				} else {
					uni.showToast({
						icon: 'none',
						title: '请填写手机号码和姓名',
						duration: 2000
					});
				}
			},

			//生成预订单
			creatOrder() {
				uni.showLoading({
					title: ''
				});
				var shareId = ""
				var judgeClassId = uni.getStorageSync('judgeClass'); //读取存在本地的被分享的课程id
				if (judgeClassId == this.goodsData.id) {
					shareId = this.$store.state.shareOpenId //带上分享者的ID
				}
				let opts = {
					url: 'order/add', //接口地址
					method: 'POST' //请求类型
				};
				let param = {
					classId: this.goodsData.id,
					lesson: this.goodsData.time,
					shareOpenId: shareId,
					name: this.userName,
					phone: this.phoneInput,
				}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					this.orderNumber = res.data.content
					if (res.data.code == 2000) {
						// 	//调起支付
						this.payMent()
					}
				}, error => {
					console.log(error);
				})
			},


			//调起支付
			payMent() {
				var _self = this
				var token = ""
				try { //获取本地存储的token
					token = uni.getStorageSync('token');
				} catch (e) {}
				uni.hideLoading();
				uni.request({
					url: _self.$url + 'payment/dopayment',
					method: 'POST',
					data: {
						token: token,
						orderNo: _self.orderNumber,
					},
					header: {
						"Authorization": token,
					},
					success(res) {
						_self.prepaid(res)
					}
				})
			},


			//实施最终支付
			prepaid(res) {
				uni.hideLoading();
				var _self = this
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
						if(_self.goodsData.onDemand){  //如果是网授课程支付成功后，就改变vuex里面的商品购买状态
							_self.$store.state.videoItem.singUpState = 'true'
						}
						uni.navigateTo({ //支付成功后跳转至订单管理页面
							url: "../management/management"
						})
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},

		}
	}
</script>

<style>
	@import url("payment.css");
</style>
