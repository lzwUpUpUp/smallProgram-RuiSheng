<template>
	<view class="container">
		<!-- <image :src="image" mode=""></image> -->


		<!-- 视频按钮 -->
		<!-- <view class="suspensionShow" @click="videoShow" style="z-index: 9999;"></view> -->


		<!-- 视频盒子 -->
		<view class="" id="videoBox" v-show="videoStatus == true" style="z-index: 9999;">
			<view class="closeTab"><text @click="closeVideoBox"> 关闭 </text></view>
			<video id="myVideo" :src="videoSrc" @error="videoErrorCallback" autoplay="true"></video>
		</view>


		<!-- 分享按钮 -->
		<button open-type="share" catchtap="share" class="goodsShare"></button>


		<!-- 音频按钮 -->
		<view class="audioBtn" @click="audioCheck" :id="audioPlay == true?'rotating':''">
			<view class="liner" v-show="audioPlay == false">

			</view>
		</view>
		<!-- <view class="audioBtn" @click="audioCheck" id="rotating " ></view> -->


		<view v-html="vhtml" class="vhtml"></view>

		<!-- <rich-text :nodes="vhtml"></rich-text> -->
		<!-- <web-view :webview-styles="webviewStyles" src="https://ruishengys.com/promotion/page/1325986069925167106"></web-view> -->


		<!-- 	<view class="suspensionDisapper" v-show="checkStatus == false" @click="check">
		</view> -->

		<uni-popup ref="boxPopup" type="center" animation="ture" style="z-index: 9999;">
			<view class="box">
				<input type="text" class="userName" v-model="name" placeholder="姓名" />
				<input type="number" class="userPhone" v-model="phone" placeholder="电话号码" maxlength="11" />
				<view class="signUp-btn" @click="goPayment">
					<p id="list">立即报名</p>
				</view>
			</view>
		</uni-popup>


		<!-- 电话客服、立即报名 -->
		<view class="call-signUp">
			<view class="call-box" @click="phoneCall">
				<view class="">
					<text><text style="position: relative;bottom: 8rpx;">￥</text> <text class="price">{{price}}</text></text>
				</view>
			</view>
			<view class="signUp-box" @click="check">
				<p>立即报名</p>
			</view>
		</view>

	</view>
</template>

<script>
	import request from "@/units/request.js"
	var rot = 10 - 0;
	var time;
	export default {
		data() {
			return {
				image: '', //海报
				name: '', //姓名
				phone: '', //电话号码
				courseId: '', //活动ID
				checkStatus: true,
				vhtml: '',
				price: '', //价钱
				videoStatus: false,
				videoSrc: '', //视频地址
				singleOpenid: '', //分享按钮要携带的分享者用户openid
				distributorsId: '', //如果此页面是别人分享的，此字段用来承接分享者的ID
				distributeClassId: '', //如果此页面是别人分享的，此字段用来承接分享的课程ID
				audioPlay: true,
				innerAudioContext: '', //承接音频播放
				musicAdress: '', //音乐地址

			}
		},
		onLoad(option) {
			this.getposters() //获取图片和价格等数据
			if (Object.keys(option).length > 0) {
				console.log(option)
				this.distributorsId = option.openid
				this.distributeClassId = option.id
			}


		},
		onReady() {
			uni.showShareMenu()


		},
		onHide() { //切换到其他页面时关闭音乐
			this.audioPlay = false
			this.stop()
		},
		onShow() { //从其他页面切回来的时候重新播放音乐
			if (this.audioPlay == false) {
				this.play()
				this.audioPlay = true
			}
		},


		methods: {

			check() {
				// console.log(this.$refs.rich)
				this.$refs.boxPopup.open()
			},

			begin(time) {
				// console.log(uni.createSelectorQuery().in(this).select('#rotating'))
				// document.getElementById("rotating").style.transform = "rotatez(" + rot + "deg)";
				// uni.createSelectorQuery().select('#rotating').style.transform = "rotatez(" + rot + "deg)";
				// rot += 1;
			},



			//点击暂停音乐
			audioCheck() {
				this.audioPlay = !this.audioPlay
				if (this.audioPlay) {
					this.play()
				} else if (this.audioPlay == false) {
					this.stop()
				}

			},


			play() {
				this.innerAudioContext.play(() => {
					// console.log('播放');
				});
				this.innerAudioContext.onPlay(() => {
					// console.log('继续播放');
					// time = setInterval(this.begin, 10);
				});
			},

			stop() {
				this.innerAudioContext.pause(() => {
					// console.log('暂停');
				});
				this.innerAudioContext.onPause(() => {
					// console.log('暂停事件');
					// clearInterval(time);
				});
			},




			// 显示视频
			videoShow() {
				this.videoStatus = !this.videoStatus
			},

			// 视频播放失败提示
			videoErrorCallback() {
				uni.showToast({
					icon: 'none',
					title: '视频播放失败',
					duration: 2000
				});
			},


			// 关闭视频
			closeVideoBox() {
				// console.log('关闭')
				this.videoStatus = !this.videoStatus
			},


			getposters() {
				let _self = this
				uni.request({
					url: _self.$url + 'promotion/list',
					success(res) {
						_self.price = res.data.content.price
						_self.vhtml = res.data.content.content
						_self.vhtml = _self.vhtml.replace(/<img/gi,
							'<img style="max-width:100%;height:auto;float:left;display:block" re f="img" ');
						_self.courseId = res.data.content.id
						_self.videoSrc = res.data.content.videoUrl
						// console.log(res.data.content.musicUrl.substring(1))
						_self.musicAdress = res.data.content.musicUrl.substring(1)
						_self.playMusic()
						if (!_self.videoSrc) {
							_self.videoStatus = false
						} else {
							_self.videoStatus = true
						}
					}
				})
			},


			playMusic() {
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.autoplay = true;
				this.innerAudioContext.obeyMuteSwitch = false;
				this.innerAudioContext.loop = true;
				this.innerAudioContext.src = this.$url + this.musicAdress;
				// console.log(this.$url +this.musicAdress)
				this.innerAudioContext.onPlay(() => {
					console.log('开始播放');
					// this.audioPlay = true
					// time = setInterval(this.begin, 10);
					// this.begin()
				});
				this.innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			},


			// 报名
			goPayment() {

				if (this.name && this.phone) {
					var myreg = /^1[3458]\d{9}$/;
					var inpVal = this.phone;

					if (!myreg.exec(inpVal)) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的手机号码',
							duration: 2000
						});
					} else {
						// var _self = this
						// try { //确认用户是否已登录
						// 	var load = uni.getStorageSync('isCanUse')
						// 	if (load == true) {
						// 		uni.showLoading({
						// 			title: ''
						// 		});
						// 		uni.login({
						// 			provider: 'weixin',
						// 			success: function(loginRes) {
						// 				let code = loginRes.code; //code可以给后台获取unionID或openID作为用户标识
						// 				// 跟后台请求token
						// 				uni.request({
						// 					url: _self.$url + 'login/dologin',
						// 					method: 'POST',
						// 					data: {
						// 						code: code,
						// 					},
						// 					success(res) {
						// 						uni.setStorageSync('token', res.data.content.token);
						// 						_self.creatOrder() //生成预订单
						// 					}
						// 				})
						// 			}
						// 		})
						// 	} else {

						// 	}
						// } catch (e) { }
						this.creatOrder() //生成预订单
					}

				} else {
					uni.showToast({
						icon: 'none',
						title: '请填写手机号码和姓名',
						duration: 2000
					});
				}
			},

			//分享按钮携带参数
			onShareAppMessage(res) {
				this.singleOpenid = uni.getStorageSync('openid');
				return {
					path: '/pages/project/project?openid=' + this.singleOpenid + '&id=' + this.courseId
				}
			},



			//生成预订单
			creatOrder() {
				uni.setStorageSync('phone', this.phone); //将手机号码存入本地
				uni.setStorageSync('userName', this.name); //将用户存入本地
				var shareId = ""
				if (this.distributeClassId == this.courseId) {
					shareId = this.distributorsId //带上分享者的ID
				}
				let opts = {
					url: 'promotion/add', //接口地址
					method: 'POST' //请求类型
				};
				let param = {
					classId: this.courseId,
					shareOpenId: shareId,
					name: this.name,
					phone: this.phone,
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
						uni.navigateTo({ //支付成功后跳转至订单管理页面
							url: "../management/management"
						})
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
	@import url("project.css");
</style>
