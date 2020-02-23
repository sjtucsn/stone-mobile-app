import Vue from 'vue'
import App from './App'
import store from './store'
import mInput from './components/m-input/m-input.vue'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.component('m-input', mInput)

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
