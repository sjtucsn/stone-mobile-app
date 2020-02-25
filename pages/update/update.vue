<template>
	<view class="user-update">
		<view class="cu-form-group margin-top">
			<view class="title">手机号</view>
			<input disabled :placeholder="userInfo.userTel"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">用户昵称</view>
			<input v-model="userInfo.userName"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">用户地址</view>
			<input v-model="userInfo.userAddress"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">性别</view>
			<view class="gender-radio">
				<radio-group @change="handleRadioChange">
					<radio value="1" color="#0081ff" :checked="userInfo.userGender === '1'"></radio>
					<text class="margin-left-sm">男</text>
					<radio class='margin-left-lg' value="0" color="#e54d42" :checked="userInfo.userGender === '0'"></radio>
					<text class="margin-left-sm">女</text>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: { ...this.$store.state.userInfo, userGender: this.$store.state.userInfo.userGender === 1 ? '1' : '0' }
			};
		},
		methods: {
			handleRadioChange(e) {
				this.userInfo.userGender = e.detail.value
			}
		},
		onNavigationBarButtonTap() {
			this.$store.dispatch('updateUserInfo', { ...this.userInfo }).then(() => {
				uni.showToast({
					title: '更新成功！'
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 500)
			}).catch(msg => {
				uni.showToast({
					icon: 'none',
					title: msg
				})
			})
		}
	}
</script>

<style lang="scss">
	.user-update {
		width: 100%;
	}
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	.gender-radio {
		flex: 1
	}
</style>
