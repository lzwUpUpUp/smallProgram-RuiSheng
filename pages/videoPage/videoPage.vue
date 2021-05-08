<template>
	<view class="container">

	
		<button open-type="share" catchtap="share" class="goodsShare"></button>

		<view class="good-img-box">
			<image :src="courseDetail.picture" mode="" class="good-img" v-show="whetherPlay==false"></image>
			<!-- <view class="momLayer" v-show="dataOptions.singUpState=='false'">
				<view class="layerText">
					!请先购买
				</view>
			</view> -->

			<video class="videoBox" :src="src"  v-show="whetherPlay==true"></video>
		</view>

		<view class="goods-price">
			<text class="Current-price">￥<text class="Current-priceNum">{{priceDisShow}}</text></text>
			<text class="beofre-price">￥<text class="beofre-priceNum">{{priceOldShow}}</text></text>
		</view>
		<!-- 商品详情 -->
		<view class="goods-detail">
			<p class="goods-name">{{courseDetail.name}}</p>
			<view class="classTime">
				<view class="classTime-left">
					<p>可选</p>
					<image src="../../static/img/point.png" mode=""></image>
				</view>
				<view class="classTime-right">
					<view v-for="(item,index) in optionClass" :key="index" :class="{ClassChoose:timeDataNum==index}" @click="chooseClose(item,index)">
						{{item.lable}}
					</view>
				</view>
			</view>
			<view class="classTip">
				<image src="../../static/img/classTip.png" mode=""></image>
				<text>{{description}}</text>
				<uni-fav :checked="checked" class="favBtn" circle="true" bg-color="#eeeeee" bg-color-checked="#FF7B22" @click="checkChange"></uni-fav>
			</view>
		</view>


		<!-- 课程评分 -->
		<view class="course-score">
			<view class="common-titie">
				<image src="../../static/img/commonImg.png" mode=""></image>
				<text>评论</text>
			</view>
			<p class="noComments" v-if="commentList.length==0">暂无评论</p>
			<view class="comments-box" v-for="(item,index) in commentList" :key="index">
				<view class="comments-head">
					<image :src="item.avatar" mode=""></image>
					<text class="reviewers">{{item.nickName}}</text>
					<text class="CommentTime">{{item.createTime}}</text>
				</view>
				<p class="Comment-content">{{item.comment}}</p>
				<uni-rate :value="item.score" size="18" :disabled="true"></uni-rate>
			</view>

			<p class="anList" v-show='listCheck == true' @click="anListBox" v-if="commentData.length>3">展开评论<view class="rotate">»</view>
			</p>
			<p class="closeList" v-show='listCheck == false' @click="closeListBox">收起评论<view class="rotate">»</view>
			</p>
		</view>



		<!-- 课程详情 -->
		<view class="course-detail">
			<view class="common-titie">
				<image src="../../static/img/commonImg.png" mode=""></image>
				<text>详情</text>
			</view>
			<view v-html="vHtml"></view>
		</view>



		<!-- 地址 -->
		<view class="address-box">
			<view class="common-titie">
				<image src="../../static/img/commonImg.png" mode=""></image>
				<text>地址信息</text>
			</view>
			<view class="address-detail" @click="checkMap">
				<image src="../../static/img/address.png" mode=""></image>
				<view class="school-detail">
					<p class="school-name">瑞晟艺术学校</p>
					<p class="school-loacl">湖南省岳阳市岳阳楼区德胜南路518号2楼</p>
				</view>
			</view>
		</view>

		<view class="nothing"></view>

		<!-- 电话客服、立即报名 -->
		<view class="call-signUp">
			<view class="call-box" @click="phoneCall">
				<view class="">
					<image src="../../static/img/telephone.png" mode=""></image>
					<text>电话客服</text>
				</view>
			</view>
		<!-- 	<view class="signUp-box" @click="goPayment">
		 		<p>立即购买</p>
			</view> -->
			<view class="signUp-box" @click="goPayment" v-if="whetherPlay==false">
				<p>立即购买</p>
			</view>
			<view class="signUpEd-box" v-if="whetherPlay==true">
				<p>已报名</p>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	import request from "@/units/request.js"
	import polyv from "@/units/polyv.js"
	import utilMd5 from "@/units/md5.js"
	// import userStatus from "@/units/common.js"
	export default {
		data() {
			return {
				courseDetail: '', //课程详情
				dataOptions: '', //承接上一个页面传来的数据
				optionClass: [], //课程有多少课时
				// chooseCloseTime: '', //所选择的课时
				timeData: [{
					time: "10"
				}, {
					time: "20"
				}, {
					time: "30"
				}, {
					time: "40"
				}, ],
				timeDataNum: 0,
				description: '', //文字描述
				commentData: [], //评论列表
				checked: false, //是否收藏
				singleOpenid: '', //分享按钮要携带的用户openid
				listCheck: true, //
				commentList: [],
				priceDisShow: '', //
				priceOldShow: '', //
				vHtml: '', //课程详情
				src: '', //视频链接
				secretKey:'',//视频密匙
				optionId :'',
				checkStatus:false,
				whetherPlay:false, //是否显示播放控件
			}
		},
		onLoad(option) {
			if (Object.keys(option).length > 0) {
				this.$store.state.shareOpenId = option.openid
				this.getCourseDteails(option.id)
				this.checkStatus = true
				try {
					uni.setStorageSync('judgeClass', option.id); //存入所分享的课程ID，如果最后被分享者支付的课程同是此课程，那分享者就有佣金
				} catch (e) {}
			} else {
				this.checkStatus = false
			}

		},
      
		onShow() {
			this.commentList = [] //清空评论列表在插入新的
			this.optionClass=[] //清空视频挑选lable
			this.dataOptions = this.$store.state.videoItem;  //获取点击网授视频课程的信息
			// console.log('this.dataOptions',this.dataOptions	)
			if(!this.checkStatus){
				this.getCourseDteails(this.dataOptions.id)
			}
		},

		methods: {
			//请求课程详情数据
			getCourseDteails(id) {
				uni.showLoading({
					title: ''
				});
				let opts = {
					url: 'class/netdetail?id=' + id, //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					// console.log('结果',res.data.content)
					this.courseDetail = res.data.content
					// 提取播放密匙
					this.secretKey = res.data.content.polyvSecretKey
					if (this.dataOptions.singUpState == 'true') {
							this.whetherPlay = true
						this.playVideo(res.data.content.detail[0]) //如果此用户报了名，则出现点播视频控件
					}
					
					for(var k in res.data.content.detail){  //可选视频标签
						var obj = {}
						obj.lable = res.data.content.detail[k].lable
						obj.videoSrc = res.data.content.detail[k].videoSrc
						this.optionClass.push(obj)
					}
					
					this.courseDetail.picture = this.$url + this.courseDetail.picture
					this.description = res.data.content.classDesc
					this.checked = res.data.content.collectState
					this.commentData = res.data.content.comments


					this.courseDetail.priceDiscount = this.courseDetail.priceDiscount.split(',')
					this.courseDetail.priceOld = this.courseDetail.priceOld.split(',')

					this.priceDisShow = this.courseDetail.priceDiscount[0] //初始页面时的商品现在价格
					this.priceOldShow = this.courseDetail.priceOld[0] //初始页面时的商品以往价格

					for (var i = 0; i < this.commentData.length; i++) {
						this.commentData[i].createTime = this.commentData[i].createTime.split(' ')[0]
					}
					if (this.commentData.length > 2) {
						for (var k = 0; k < 3; k++) {
							this.commentList.push(this.commentData[k])
						}
					} else {
						this.commentList = this.commentData
					}

					this.vHtml = res.data.content.content
					this.vHtml = this.vHtml.replace(/<img/gi,
						'<img style="max-width:100%;height:auto;display:block" ref="img" ');
					uni.hideLoading();
				}, error => {
					console.log(error);
				})
			},


			//如果此用户报了名，则出现点播视频控件
			playVideo(data) {
				let vid = data.videoSrc;
				let timestamp = Date.parse(new Date());
				let secretKey = this.secretKey; //
				let ts = timestamp;
				let sign = utilMd5.hexMD5(secretKey + vid + ts);
				/*获取视频数据*/
				let obj = {
					vid: vid,
					ts: ts,
					sign: sign,
					callback: videoInfo => {
						if (videoInfo.type === 'error') {
							console.log('videoInfo', videoInfo);
							return;
						}
						this.src = videoInfo.src[0]
					}
				};

				this.player = polyv.getVideo(obj);
			},



			//挑选视频
			chooseClose(item, index) {
				this.timeDataNum = index
				if(this.whetherPlay==true){
					this.playVideo(item)  //选择播放其他视频
				}
			
			},




			// 拨打电话
			phoneCall() {
				let _self = this
				var phone = ""
				uni.request({
					url: _self.$url + 'contact/list',
					success(res) {
						_self.merchantsPhone(res.data.content.serviceTel)
					}
				})
			},

			merchantsPhone(phone) {
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


			// 点击导航
			checkMap() {
				uni.openLocation({
					latitude: 29.356903680267948,
					longitude: 113.1060313128281,
					success: function() {
						console.log('success');
					}
				});
				//显示定位点：
				var map = uni.createMapContext('map');
				map.moveToLocation();
			},

			// 跳转至支付页面并携带参数
			goPayment() {
				var obj = {
					price: this.priceDisShow, //价格
					name: this.courseDetail.name,
					pic: this.courseDetail.picture,
					// time: this.chooseCloseTime,
					id: this.courseDetail.id,
					onDemand: true, //判断是面授课程还是网授课程
				}
				uni.navigateTo({
					url: "../payment/payment?item=" + encodeURIComponent(JSON.stringify(obj))
				})
			},

			// 收藏按钮
			checkChange() {
				this.checked = !this.checked
				if (this.checked) {
					let opts = {
						url: 'collect/add', //接口地址
						method: 'POST' //请求类型
					};
					let param = {
						"classId": this.courseDetail.id,
					}; //该请求所需要的参数
					request.baseRequest(opts, param).then(res => {
						uni.showToast({
							title: '收藏成功',
							duration: 1500
						});
					}, error => {
						console.log(error);
					})
				} else {
					let opts = {
						url: 'collect/delete?id=' + this.courseDetail.id, //接口地址
						method: 'GET' //请求类型
					};
					let param = {}; //该请求所需要的参数
					request.baseRequest(opts, param).then(res => {
						uni.showToast({
							title: '取消收藏',
							duration: 1500
						});
					}, error => {
						console.log(error);
					})

				}
			},


			//分享按钮携带参数
			onShareAppMessage(res) {
				this.singleOpenid = uni.getStorageSync('openid');
				// if (res.from === 'button') { // 来自页面右上角分享按钮
				// }
				return {
					path: '/pages/videoPage/videoPage?openid=' + this.singleOpenid + '&id=' + this.dataOptions.id
				}
			},

			//展开评论
			anListBox() {
				this.listCheck = !this.listCheck
				this.commentList = []
				for (var i = 0; i < this.commentData.length; i++) {
					this.commentList.push(this.commentData[i])
				}
			},

			//收起评论
			closeListBox() {
				this.listCheck = !this.listCheck
				this.commentList = []
				for (var k = 0; k < 3; k++) {
					this.commentList.push(this.commentData[k])
				}
			}



		},


	}
</script>

<style>
	@import url("videoPage.css");
</style>
