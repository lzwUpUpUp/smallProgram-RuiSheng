import url from "../static/url.js"
let token = ""

const baseUrl = url.appUrl; //此为测试地址,并非真实地址
// 定义基础请求路径(后端服务器地址)
const baseRequest = (opts, data) => {
	try { //获取本地存储的token
		token = uni.getStorageSync('token');   //取token
	} catch (e) {}
	let baseDefaultOpts = {
		url: baseUrl + opts.url,
		// 请求接口地址
		data: data,
		// 传入请求参数
		method: opts.method,
		// 配置请求类型
		header:{
			"Authorization":token,
		},
		// 配置请求头
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(baseDefaultOpts).then(
			(res) => {
				// console.log('request的', res)
				resolve(res[1]) //回调函数
				// if(res[1].data.state == '100' || res[1].data.state == 100){
				// 	// 后端返回的状态码100为成功状态,成功则返回请求结果,在app调试时可以通过console.log(JSON.stringify(res[1].data))来查看返回值（以项目实际情况为准）
				// 	resolve(res[1].data)
				// }
				// if(res[1].data.state == '105' || res[1].data.state == 105){
				// 	// 后端返回状态码为105则为未登录状态（以项目实际情况为准）
				// 	uni.showToast({
				// 		icon:'none',
				// 	    title: '尚未登录',
				// 	    duration: 2000 
				// 	}); 
				// 	// 尚未登录的逻辑处理
				// 	return false
				// }
			}
		).catch(
			(response) => {
				reject(response)
			}
		)
	})
	return promise
};

export default {
	baseUrl,
	baseRequest,
}
