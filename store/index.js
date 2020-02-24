import Vue from 'vue'
import Vuex from 'vuex'
import { BASE_URL } from '../utils.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userInfo: {},
		resourseList: [],
		articleList: []
	},
	mutations: {
		login(state, userInfo) {
			state.userInfo = { ...userInfo };
			state.hasLogin = true;
		},
		logout(state) {
			state.userInfo = {};
			state.hasLogin = false;
		},
		setResourceList(state, resourseList) {
			state.resourceList = [ ...resourceList ]
		},
		setArticleList(state, articleList) {
			state.articleList = [ ...articleList ]
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
						if (res.data.resultCode > 0) {
							context.commit('login', res.data.result)
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
		},
		getArticleList(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/article/list",
					method: 'GET',
					data: payload,
					success: (res) => {
						if (res.data.resultCode > 0) {
							context.commit('setArticleList', res.data.result)
							resolve(res.data)
						} else {
							reject(res.data)
						}
					},
					fail(res) {
						reject(res.data)
					}
				})
			})
		},
	}
})

export default store
