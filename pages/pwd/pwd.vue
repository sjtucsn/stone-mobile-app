<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row">
				<text class="title">手机：</text>
				<m-input type="text" focus clearable v-model="userTel" placeholder="请输入手机号"></m-input>
			</view>
		</view>

		<view class="btn-row">
			<button type="primary" class="primary" @tap="findPassword">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userTel: ''
			}
		},
		methods: {
			findPassword() {
				/**
				 * 仅做示例
				 */
				if (this.userTel.length != 11) {
					uni.showToast({
						icon: 'none',
						title: '手机号不合法',
					});
					return;
				}
				uni.showToast({
					icon: 'none',
					title: '已发送验证码，请查收',
					duration: 3000
				});
			}
		}
	}
</script>

<style>

</style>
