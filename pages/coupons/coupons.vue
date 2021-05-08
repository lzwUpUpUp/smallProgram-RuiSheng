<template>
	<view class="container">
	     <view class="head">
	     	 <view v-for="(item,index) in topData" :key="index" :class="{chooseTitle:topDataNum==index}" @click="choosePons(item,index)">
	     	 	{{item.title}}
	     	 </view>
	     </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				topData: [{
					title: "全部"
				}, {
					title: "未使用"
				}, {
					title: "已使用"
				}, {
					title: "已过期"
				}],
				topDataNum: 0,
			}
		},
		methods:{
			//挑选卡券种类
			choosePons(item,index){
				this.topDataNum = index
			}
		}
	}
</script>

<style>
	@import url("coupons.css");
</style>
