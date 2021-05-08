const goLogin = () => {
	
	let validation = new Promise(function(resolve , reject){
		var _self = this
		try { //确认用户是否已登录
			var load = uni.getStorageSync('isCanUse')
			if (load == true) {
				// console.log('登陆了')
				resolve(load)
			} else {
				uni.navigateTo({
					url: "../authorization/authorization"
				})
			}
		} catch (e) {}
	})
	return validation
	  
}

export default {
	goLogin
}
