<template>
	<view class="container">
		<!-- 轮播图 -->
		<swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="800">
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


		<!-- 明星老师的二级导航 -->
		<view class="second-tip" v-show="artClassesNum == 0" v-if="courseTypeData[0].children.length > 0">
			<view class="second-tip-title">
				<text v-for="(item,index) in courseTypeData[0].children" :key="index" :class="{hightLight:teaHightLight == index}"
				@click="changeLight(item,index)"
				>{{item.typeName}}</text>
			</view>
		</view>

		<!-- 明星讲师 -->
		<view class="starLecturer-box" v-show="artClassesNum == 0">
			<p class="starLecturer-title">{{teaHightText}}</p>
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




		<!-- 成人课程的二级导航 -->
		<view class="second-tip" v-show="artClassesNum == 1" v-if="courseTypeData[1].children.length > 0">
			<view class="second-tip-title">
				<text v-for="(item,index) in courseTypeData[1].children" :key="index" :class="{hightLight:adultHightLight == index}"
				 @click="changeLight(item,index)">{{item.typeName}}</text>
			</view>
		</view>


		<!-- 成人课程 -->
		<view class="recommend-box" v-show="artClassesNum == 1">
			<p class="goodsDetail-title">{{adultHightText}}</p>
			<view class="goodsDetail" v-for="(item,index) in courseLibs" :key="index" @click="toDetailPage(item)">
				<view class="goodsDetail-img">
					<image :src="item.picture" mode=""></image>
				</view>
				<view class="goodsDetail-test">
					<p class="teacher">{{item.name}}</p>
					<view class="text-middle">
						<p class="middle-detail live-time">{{item.hours}}</p>
						<p class="middle-detail learn-number">{{item.studiedNumber}}人学过</p>
						<button class="middle-detail">剩余学位：{{item.remainNumber}}位</button>
					</view>
					<view class="test-bottom ">
						<p class="thisPrice">￥{{item.priceDiscount}}</p>
						<p class="lastPrice">￥{{item.priceOld}}</p>
						<image src="../../static/img/singUp.png" mode="" class="singUp-img"></image>
						<!-- <image src="../../static/img/singUp.png" mode="" class="singUp-img" v-show="item.singUpState == 'false' "></image> -->
						<!-- <image src="../../static/img/singUpEd.png" mode="" class="singUp-img" v-show="item.singUpState == 'true' "></image> -->
						<!-- <button :data-id='{singleOpenid}' open-type="share" catchtap="share" class="'share-img"></button> -->
					</view>
				</view>
			</view>
		</view>


		<!-- 少儿课程的二级导航 -->
		<view class="second-tip" v-show="artClassesNum == 2" v-if="courseTypeData[2].children.length > 0">
			<view class="second-tip-title">
				<text v-for="(item,index) in courseTypeData[2].children" :key="index" :class="{hightLight:adultHightLight == index}">{{item.typeName}}</text>
			</view>
		</view>

		<!-- 少儿课程 -->
		<view class="children-box common-box" v-show="artClassesNum == 2">
			<p class="children-title common-title">少儿课程</p>
		</view>


		<!-- 学习用品的二级导航 -->
		<view class="second-tip" v-show="artClassesNum == 3" v-if="courseTypeData[3].children.length > 0">
			<view class="second-tip-title">
				<text v-for="(item,index) in courseTypeData[3].children" :key="index" :class="{hightLight:adultHightLight == index}">{{item.typeName}}</text>
			</view>
		</view>
		<!-- 学习用品 -->
		<view class="learn-box common-box" v-show="artClassesNum == 3">
			<p class="learn-title common-title">学习用品</p>
		</view>

	</view>
</template>

<script>
	// import dataList from "../../static/testData.json"
	import request from "@/units/request.js"
	export default {
		data() {
			return {
				homeSlide: [],
				artClassesNum: 0, //瑞晟艺术课程单一高亮显示和显示对应的list
				courseTypeData: [], //一级导航
				courseLibs: "", //首页课程列表数据

				titieLibs: [{ //成人课程的二级导航
						name: "全部"
					},
					{
						name: "音乐素养"
					},
					{
						name: "声乐演唱"
					},
					{
						name: "钢琴演奏"
					},
					{
						name: "葫芦丝演奏"
					},
					{
						name: "音乐器材"
					},
				],
				adultHightText: '全部',
				teaHightText: '全部',
				teaHightLight: '0', //明星讲师的二级导航高亮
				adultHightLight: '0', //成人课程的二级导航高亮
				lecturerList: '', //明星讲师
				singleOpenid: '', //
				// menuList:[],//一级菜单跟二级菜单
			}
		},
		onReady() {
			// this.courseLibs = dataList.courseList
			// this.lecturerList = dataList.starLecturer
			this.getmenuList() //获取一级菜单跟二级菜单
			this.getSlicePic() //获取轮播图图片
		},
		methods: {

			// 获取一级菜单跟二级菜单
			getmenuList() {
				let _self = this
				uni.request({
					url: _self.$url + 'classtype/list',
					success(res) {
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
						//  console.log('菜单', res)
						_self.courseTypeData = res.data.content
						_self.toCompany(res.data.content[0])
					}
				})
			},


			//点击一级导航，请求对应的一级数据
			toCompany(item, index) {
				uni.showLoading({
					title: ''
				});
				this.artClassesNum = index
				let _self = this
				uni.request({
					url: _self.$url + item.typeUri + "?type=" + item.id,
					method: 'GET',
					success(res) {
						uni.hideLoading();
						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].picture = _self.$url + res.data.content[i].picture
						}
						if (item.typeUri.indexOf('teacher') > 0) { //请求明星老师的数据
							_self.lecturerList = res.data.content
						} else if (item.typeUri.indexOf('class') > 0) {
							_self.courseLibs = res.data.content
						}

						_self.teaHightLight = 0 //明星讲师的二级导航高亮
						_self.teaHightText = '全部'
						_self.adultHightLight = 0 //成人课程的二级导航高亮
						_self.adultHightText = '全部'
					}
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
					uni.request({
						url: _self.$url + _self.courseTypeData[num].typeUri + "?type=" + _self.courseTypeData[num].id + '&subType=' + item.id,
						success(res) {
							for (var i = 0; i < res.data.content.length; i++) {
								res.data.content[i].picture = _self.$url + res.data.content[i].picture
							}
							if (num == 0) {
								_self.teaHightLight = index
								_self.lecturerList = res.data.content
								_self.teaHightText = item.typeName
							} else if (num == 1) {
								_self.adultHightText = item.typeName
								_self.adultHightLight = index
								_self.courseLibs = res.data.content
							}

						}
					})
				}
			},



			//点击成人课程中的商品进入对应的商品详情页面
			toDetailPage(item) {
				this.$store.state.item = item
				uni.navigateTo({
					// url: "../details/details?item=" + encodeURIComponent(JSON.stringify(item))
					url: "../details/details"
				})
			},



			// 获取轮播图图片
			getSlicePic() {
				let _self = this
				uni.request({
					url: _self.$url + '/banner/list',
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
	@import "index.css";
</style>
