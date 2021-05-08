import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false



//设置全局的url变量
import url from './static/url.js'
Vue.prototype.$url = url.appUrl
// Vue.prototype.$pageUrl = url.pageUrl
// Vue.prototype.$picUrl = url.picUrl


//引用vueX
import store from './static/store/store.js'
Vue.prototype.$store = store //全局请求


App.mpType = 'app'

const app = new Vue({
	...App,
})
app.$mount()
 