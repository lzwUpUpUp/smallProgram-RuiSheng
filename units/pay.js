const checkStatus = () => {

	var _slef = this
	try { //确认用户是否已登录
		var load = uni.getStorageSync('isCanUse')
		if (load == true) {
			uni.showLoading({
				title: ''
			});
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
							creatOrder() //生成预订单
						}
					})
				}
			})
		} else {
			uni.navigateTo({
				url: "../pages/authorization/authorization"
			})
		}
	} catch (e) {}


	// //生成预订单
	function creatOrder() {
			var sgareId = ""
			if (this.$store.state.shareOpenId) {
				sgareId = this.$store.state.shareOpenId //如果是被分享的话，就带上分享者的ID
			}
			let opts = {
				url: 'promotion/add', //接口地址
				method: 'POST' //请求类型
			};
			let param = {
				classId: this.courseId,
				shareOpenId: sgareId,
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
		}
		
		
		// //调起支付
		function payMent() {
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
		}
		
		
		// //实施最终支付
		function prepaid(res) {
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
		


};



export default {
	checkStatus
}
