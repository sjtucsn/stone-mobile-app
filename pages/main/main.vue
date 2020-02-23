<template>
	<view class="content">
		这是首页
	</view>
</template>

<script>
	export default {
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: () => {
					
				},
				fail: () => {
					uni.reLaunch({
						url: '../login/login'
					});
				}
			})
		}
	}
</script>

<style>
	
</style>
