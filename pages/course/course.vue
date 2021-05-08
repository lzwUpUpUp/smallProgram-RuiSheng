<template>
	<view class="container">
		<!-- 轮播图 -->
		<swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="800" circular="true">
			<swiper-item v-for="(item , index) in homeSlide" :key="index">
				<image :src="item.imgUrl" class="swiperImg"></image>
			</swiper-item>
		</swiper>

		<!-- 一级导航 -->
		<view class="courses-type">
			<p class="courses-type-title">瑞晟艺术课程</p>
			<view class="courses-type-box">
				<view class="courses-type-detail" v-for="(item,index) in courseTypeData" :key="index" @click="toCompany(item,index)"
				 :class="{airClsaaesLight : artClassesNum == index } ">

					<image :src="item.typeImg" mode=""></image>
					<p>{{item.typeName}}</p>
					<!-- <text class="line"></text> -->
					<image src="../../static/img/pointTo.png" mode="" class="ponitTo" v-show="artClassesNum == index" v-if="courseTypeData[artClassesNum].children.length > 0"></image>
				</view>
			</view>
		</view>


		<!-- 二级导航 -->
		<view class="second-tip" v-if="secondNavigation.length > 0">
			<view class="second-tip-title">
				<text v-for="(item,index) in secondNavigation" :key="index" :class="{hightLight:allHightLight == index}" @click="changeLight(item,index)">{{item.typeName}}</text>
			</view>
		</view>

		<!-- 明星讲师 -->
		<!-- <view class="starLecturer-box" v-show="artClassesNum == 0"> -->
		<view class="starLecturer-box" v-show="!lecturerStatus">
			<p class="starLecturer-title">全部</p>
			<view class="lecturer-detail" v-for="(item,index) in lecturerList" :key="index">
				<view class="lecturer-img">
					<image :src="item.picture" mode=""></image>
				</view>
				<view class="lecturer-text">
					<p class="lecturer-name">{{item.name}}</p>
					<p>{{item.title}}</p>
					<p>{{item.profession}}</p>
					<p>{{item.remark}}</p>
				</view>
			</view>
		</view>


		<!-- 共同载体 -->
		<!-- <view class="learn-box common-box" v-show="artClassesNum !== 0"> -->
		<view class="learn-box common-box" v-show="lecturerStatus">
			<p class="learn-title goodsDetail-title">{{allText}}</p>
			<view class="goodsDetail" v-for="(item,index) in allDataList" :key="index" @click="toDetailPage(item,false)">
				<view class="goodsDetail-img">
					<image :src="item.picture" mode=""></image>
				</view>
				<view class="goodsDetail-test">
					<p class="teacher">{{item.name}}</p>
					<view class="text-middle">
						<p class="middle-detail learn-number">{{item.studiedNumber}}人已购买</p>
					</view>
					<view class="test-bottom ">
						<p class="thisPrice">￥{{item.priceDiscount}}</p>
						<p class="lastPrice">￥{{item.priceOld}}</p>
						<image src="../../static/img/buy.png" mode="" class="singUp-img"></image>
					</view>
				</view>
			</view>
		</view>





	</view>
</template>

<script>
	import request from "@/units/request.js"
	export default {
		data() {
			return {
				homeSlide: [],
				artClassesNum: 0, //瑞晟艺术课程单一高亮显示和显示对应的list
				courseTypeData: [], //一级导航
				lecturerList: '', //预防使用的是明星导师模板
				lecturerStatus: false, //如果有明星导师的数据，就显示明星导师的html模板，如果没有，直接隐藏
				secondNavigation: '', //二级导航数据
				
				allText: '全部',
				allHightLight: '0',
				allDataList: '', //数据共同载体
			}
		},

		onReady() {

			uni.showShareMenu()
			this.getmenuList() //获取一级菜单跟二级菜单
			this.getSlicePic() //获取轮播图图片
		},




		methods: {

			// 获取一级菜单跟二级菜单
			getmenuList() {
				let _self = this
				let opts = {
					url: 'classtype/netlist', //接口地址
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					for (var i = 0; i < res.data.content.length; i++) {
						res.data.content[i].typeImg = _self.$url + res.data.content[i].typeImg
						if (res.data.content[i].children.length > 1) {
							var lib = {
								typeName: "全部",
								parentId: res.data.content[i].id
							}
							res.data.content[i].children.unshift(lib)
						}
					}

					_self.courseTypeData = res.data.content
					_self.toCompany(res.data.content[0])
				}, error => {
					console.log(error);
				})


			},


			//点击一级导航，请求对应的一级数据
			toCompany(item, index) {
				this.secondNavigation = item.children
				uni.showLoading({
					title: ''
				});
				this.artClassesNum = index
				let _self = this
				let opts = {
					url: item.typeUri + "?type=" + item.id, //接口地址
					method: 'GET' //请求类型
				};
				let param = {}; //该请求所需要的参数
				request.baseRequest(opts, param).then(res => {
					uni.hideLoading();
					for (var i = 0; i < res.data.content.length; i++) {
						res.data.content[i].picture = _self.$url + res.data.content[i].picture
					}

					if (item.id == 100) { //请求明星老师的数据
						_self.lecturerList = res.data.content
						_self.lecturerStatus = false
					} else {
						_self.lecturerStatus = true
						_self.allDataList = res.data.content
						_self.allHightLight = 0, //二级导航高亮
							_self.allText = '全部'
					}
				}, error => {
					console.log(error);
				})

			},



			// 点击二级导航，进行高亮显示并请求数据
			changeLight(item, index) {
				var num = ''
				for (var k = 0; k < this.courseTypeData.length; k++) {
					if (this.courseTypeData[k].id == item.parentId) {
						num = k
					}
				}

				let _self = this //uni.login中this指向会出错，需重指向
				if (index == 0) {
					_self.toCompany(_self.courseTypeData[num]) //点击全部的时候获取全部数据
				} else {
					let opts = {
						url: _self.courseTypeData[num].typeUri + "?type=" + _self.courseTypeData[num].id + '&subType=' +
							item.id,
						method: 'GET',
					};
					let param = {}; //该请求所需要的参数
					request.baseRequest(opts, param).then(res => {
						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].picture = _self.$url + res.data.content[i].picture
						}

						_self.allDataList = res.data.content
						_self.allHightLight = index
						_self.allText = item.typeName

					}, error => {
						console.log(error);
					})

				}
			},


			





			//点击成人课程中的商品进入对应的商品详情页面
			toDetailPage(item, status) {
				this.$store.state.videoItem = item
				// this.$store.state.judgeShow = status
				uni.navigateTo({
					// url: "../details/details?item=" + encodeURIComponent(JSON.stringify(item))
					url: "../videoPage/videoPage"
				})
			},


			//点击进入直播页面
			gotoLivePage() {
				uni.navigateTo({
					url: "../livePage/livePage"
				})
			},




			// 获取轮播图图片
			getSlicePic() {
				let _self = this
				uni.request({
					url: _self.$url + '/banner/netlist',
					success: (res) => {
						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].imgUrl = _self.$url + res.data.content[i].imgUrl
						}
						this.homeSlide = res.data.content
					}
				})
			},
		},

	}
</script>

<style>
	/* .container {
		width: 100%;
		height: 100%;
	} */
	@import "course.css";
</style>
