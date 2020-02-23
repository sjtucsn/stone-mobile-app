import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const BASE_URL = "http://192.168.2.170:8080"

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userInfo: {}
	},
	mutations: {
		login(state, userInfo) {
			state.userInfo = { ...userInfo };
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		}
	},
	actions: {
		register(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/user/register",
					method: 'POST',
					data: payload,
					success: (res) => {
						console.log(res)
						if (res.data.resultCode > 0) {
							resolve(res.data)
						} else {
							reject(res.data)
						}
					}
				})
			})
		},
		login(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/user/login",
					method: 'POST',
					data: payload,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						console.log(res)
						if (res.data.resultCode > 0) {
							context.commit('login', res.data)
							uni.setStorage({
								key: 'user',
								data: { ...payload }
							})
							resolve(res.data)
						} else {
							reject(res.data)
						}
					}
				})
			})
		}
	}
})

export default store
