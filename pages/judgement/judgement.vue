<template>
	<view class="container">
		<!-- 商品信息 -->
		<view class="judge-goods">
			<image src="../../static/img/goods.jpg" mode=""></image>
			<view class="middle-detail">
				<text class="course-name">第四期声乐技巧精炼直播课程—娄 煜佳老师</text>
				<text class="course-price">￥590</text>
				<text class="course-class">共30节课时</text>
			</view>
		</view>
		<!-- 星星评论 -->
		<view class="judge-star">
			<view class="judge-box">
				<text class="judge-title">总评价</text>
				<uni-rate :value="overallMerit" @change="overall" size="18"></uni-rate>
			</view>
			<view class="judge-box">
				<text class="judge-title">专业性</text>
				<uni-rate :value="professional" @change="profess" size="18"></uni-rate>
			</view>
			<view class="judge-box">
				<text class="judge-title">敬业性</text>
				<uni-rate :value="dedicated" @change="dedicat" size="18"></uni-rate>
			</view>
		</view>
		<!-- 文字评论 -->
		<view class="judge-text">
			<p>请输入你的评论</p>
			<textarea value="" placeholder="写下你对这堂课的想法吧～" v-model="commentText" />
			</view>
		
		<!-- 照片 -->
		<!-- <view class="image-choose">
				<image :src="item" mode="" v-for="(item,index) in imageLibs" :key="index"></image>
			<image src="../../static/img/imgChoose.png" mode="" class="chooseImg" @click="chooseImage"></image>
		</view> -->
		<!-- 提交 -->
		<view class="commit">
			<view class="commit-btn" @click="submitInfo">
				提交
			</view>
		</view>

	</view>
</template>

<script>
	import request from "@/units/request.js"
	var data;
	export default {	
		data() {
			return {
				overallMerit: '', //总评价
				professional: '', //专业性
				dedicated: '', //敬业性
				commentText:'', //文字评价
				imageLibs:[] //选择的图片
			}
		},
		onLoad(option) {
			 data = JSON.parse(decodeURIComponent(option.item));
		},
		methods:{
			//选择照片视频
			chooseImage(){
				var self = this
				uni.chooseImage({
				    count: 6, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: function (res) {
						self.imageLibs =res.tempFilePaths
				    }
				});
			},
			
			
			submitInfo(){
				let opts = {
					url: '/comment/save', //接口地址
					method: 'POST' //请求类型
				};
				let  comment = {
					 orderId: data.id,    //订单Id
					 classId:data.classId ,   //课程Id
					 score:this.overallMerit,//总分星星数
					  professional:this.professional, //专业性
					  dedication:this.dedicated, //敬业性
					 comment:this.commentText,
					 nickName:this.$store.state.userName, 
					 avatar:this.$store.state.userPic,
				}; //该请求所需要的参数
				request.baseRequest(opts, comment).then(res => {
					uni.showToast({
						title: '评价成功',
						duration: 2000
					});
					setTimeout(function(){
						uni.navigateTo({
						    url: '../management/management'
						})
					},2000)

				}, error => {
					console.log(error);
				})
			},
			overall(value){
				this.overallMerit=value.value
			},
			profess(value){
				this.professional = value.value
			},
			dedicat(value){
				this.dedicated = value.value
			}
			
		}
	}
</script>

<style>
	@import url("judgement.css");
</style>
