<template>
	<view class="content">
		<view class="btn-row">
			<button type="primary" class="primary"  @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			bindLogout() {
				this.$store.commit('logout')
				uni.removeStorage({
					key: 'user',
					success() {
						uni.reLaunch({
							url: '../login/login'
						});
					}
				})
			}
		}
	}
</script>

<style>
	
</style>
