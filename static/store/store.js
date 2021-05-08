import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userName: '未登录',
		loginStatus: '授权登录',
		userPic: '../../static/img/timg.jpg',
		openid: '', //用户ID
		item: '', //面授商品必需数据
		videoItem: '', //网授视频课程数据必需数据
		shareOpenId: '', //分享者的ID
		phone: '', //用户电话号码
		judgeShow:'' , //判定用户是从课程出发还是从学习用品出发
	},
	mutations: {

	}
})


export default store;
