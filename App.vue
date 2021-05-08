<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.initialize()
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
			try {
				uni.removeStorageSync('judgeClass'); //关闭小程序的时候，把分享者的openid也删掉，因为已经不再属于分享范畴了
			} catch (e) {}
		},


		methods: {
			initialize() {
				let _self = this //uni.login中this指向会出错，需重指向
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code; //code可以给后台获取unionID或openID作为用户标识
						// 跟后台请求token
						uni.request({
							url: _self.$url + 'login/dologin',
							method: 'POST',
							data: {
								code: code,
							},
							success(res) {
								uni.setStorageSync('token', res.data.content.token);
								uni.setStorageSync('openid', res.data.content.openid); //储存用户ID，做分享时用

							}
						})
					},
					fail: function(res) {}
				})
			}
		}
	};
</script>

<style>
	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		/* 	font-family: uniicons;
	src: url('/static/uni.ttf'); */
	}



	/* #endif */
</style>
