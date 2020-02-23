<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="userTel" placeholder="请输入手机号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" :disabled="userTel === '' || password === ''" @tap="bindLogin">登录</button>
		</view>
		<view class="action-row">
			<navigator url="../reg/reg">注册账号</navigator>
			<text>|</text>
			<navigator url="../pwd/pwd">忘记密码</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userTel: '',
				password: ''
			}
		},
		methods: {
			bindLogin() {
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				const data = {
					userTel: this.userTel,
					password: this.password
				};
				this.$store.dispatch('login', data).then(res => {
					uni.showToast({
						title: '登录成功',
					});
					setTimeout(() => {
						uni.reLaunch({
							url: '../main/main',
						});
					}, 500)
				}).catch(res => {
					uni.showToast({
						icon: 'none',
						title: res.msg,
					});
				})
			},
		},
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: () => {
					uni.reLaunch({
						url: '../main/main',
					});
				}
			})
		}
	}
</script>

<style>
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}
</style>
