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
		categoryList: [],
		resourceList: [],
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
		setUserInfo(state, userInfo) {
			state.userInfo = { ...userInfo }
		},
		setCategoryList(state, categoryList) {
			state.categoryList = [ ...categoryList ]
		},
		setResourceList(state, resourceList) {
			state.resourceList = [ ...resourceList ]
		},
		addResourceList(state, resourceList) {
			state.resourceList = [ ...state.resourceList, ...resourceList ]
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
					},
					fail(res) {
						reject(res.data)
					}
				})
			})
		},
		getUserInfo(context, payload) {
			uni.request({
				url: BASE_URL + "/user/info",
				method: 'GET',
				data: payload,
				success: (res) => {
					if (res.data.resultCode > 0) {
						context.commit('setUserInfo', res.data.result)
					}
				}
			})
		},
		updateUserInfo(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/user/update",
					method: 'POST',
					data: payload,
					success: (res) => {
						if (res.data.resultCode > 0) {
							context.commit('setUserInfo', res.data.result)
							resolve(res.data)
						} else {
							reject(res.data.msg)
						}
					},
					fail() {
						reject("更改用户信息失败")
					}
				})
			})
		},
		getCategoryList(context) {
			uni.request({
				url: BASE_URL + "/category/list",
				method: 'GET',
				success: (res) => {
					if (res.data.resultCode > 0) {
						context.commit('setCategoryList', res.data.result)
					}
				}
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
		getResourceList(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/resource/list",
					method: 'GET',
					data: payload,
					success: (res) => {
						if (res.data.resultCode > 0) {
							context.commit('setResourceList', res.data.result)
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
		loadMoreResource(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/resource/list",
					method: 'GET',
					data: payload,
					success: (res) => {
						if (res.data.resultCode > 0) {
							context.commit('addResourceList', res.data.result)
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
		uploadResource(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/resource/upload",
					method: 'POST',
					data: payload,
					success: (res) => {
						if (res.data.resultCode > 0) {
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
		publishArticle(context, payload) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + "/article/publish",
					method: 'POST',
					data: payload,
					success: (res) => {
						if (res.data.resultCode > 0) {
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
		}
	}
})

export default store
