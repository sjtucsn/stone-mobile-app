<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">用户：</text>
				<m-input type="text" clearable v-model="userName" placeholder="请输入用户名"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">手机：</text>
				<m-input type="text" focus clearable v-model="userTel" placeholder="请输入手机号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">确认：</text>
				<m-input type="password" displayable v-model="passwordAgain" placeholder="请确认密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" :disabled="password === ''" @tap="register">注册</button>
		</view>
	</view>
</template>

<script>
	import sha256 from 'js-sha256'
	export default {
		data() {
			return {
				userName: '',
				userTel: '',
				password: '',
				passwordAgain: ''
			}
		},
		methods: {
			register() {
				if (this.userName.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '用户名不能为空'
					});
					return;
				}
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.userTel))) {
					uni.showToast({
						icon: 'none',
						title: '无效的手机号'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码长度至少为6位'
					});
					return;
				}
				if (this.password != this.passwordAgain) {
					uni.showToast({
						icon: 'none',
						title: '两次输入的密码不一致'
					});
					return;
				}
				const password = sha256(this.password)
				const data = {
					userName: this.userName,
					userTel: this.userTel,
					password
				}
				this.$store.dispatch('register', data).then(res => {
					uni.showToast({
						title: '注册成功',
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '../login/login'
						});
					}, 1500)
				}).catch(res => {
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
				})
			}
		}
	}
</script>

<style>

</style>
