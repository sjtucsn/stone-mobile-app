<template>
	<view class="authority">
		<uni-search-bar :radius="100" @confirm="search" placeholder="输入手机号查询用户"></uni-search-bar>
		
		<view v-if="userInfo.userId" class="margin-top" @click="showModel = true">
			<view class="user-header">
				<view class='user-header-avatar'>
					<image class='user-header-avatar-image' :src="BASE_URL + userInfo.userAvatar" mode="aspectFill" width="60px" height="60px"></image>
				</view>
				<view class="user-header-info">
					<view class="user-header-info-name">{{ userInfo.userName }}</view>
					<view class="user-header-info-time">手机号：{{ userInfo.userTel }}</view>
				</view>
			</view>
		</view>
		
		<view class="cu-modal" :class="showModel ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="authority-title">修改用户权限</view>
					<view class="action" @tap="showModel = false">
						<text class="cuIcon-close text-gray"></text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="authority-radio">
						<radio-group @change="handleRadioChange">
							<radio value="0" color="#0081ff" :checked="userInfo.userType === '0'"></radio>
							<text class="margin-left-sm">外部用户</text>
							<radio class='margin-left-lg' value="1" color="#e54d42" :checked="userInfo.userType === '1'"></radio>
							<text class="margin-left-sm">方古用户</text>
						</radio-group>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="showModel = false">取消</button>
						<button class="cu-btn bg-blue margin-left" :disabled="categoryName === ''" @tap="handleChangeAuthority">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_URL } from '../../utils.js'
	export default {
		data() {
			return {
				BASE_URL,
				userInfo: {},
				showModel: false
			};
		},
		methods: {
			handleRadioChange(e) {
				this.userInfo.userType = e.detail.value
			},
			handleChangeAuthority() {
				uni.request({
					url: BASE_URL + "/user/authority/update",
					method: 'POST',
					data: this.userInfo,
					success: (res) => {
						if (res.data.resultCode > 0) {
							this.showModel = false
							uni.showToast({
								title: '用户权限更新成功！'
							})
							this.userInfo = {
								...res.data.result,
								userType: res.data.result.userType === 1 ? '1' : '0'
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							})
						}
					},
					fail(res) {
						uni.showToast({
							icon: 'none',
							title: '请求失败'
						})
					}
				})
			},
			search(e) {
				uni.request({
					url: BASE_URL + "/user/search",
					method: 'GET',
					data: {
						userTel: e.value
					},
					success: (res) => {
						if (res.data.resultCode > 0) {
							this.userInfo = {
								...res.data.result,
								userType: res.data.result.userType === 1 ? '1' : '0'
							}
						} else {
							this.userInfo = {}
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							})
						}
					},
					fail(res) {
						uni.showToast({
							icon: 'none',
							title: '请求失败'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.authority {
		width: 100%;
		display: flex;
		flex-direction: column;
		
		&-title {
			position: absolute;
			left: 146rpx;
			width: calc(100% - 96rpx - 60rpx - 120rpx - 20rpx);
			line-height: 1.6em;
		}
		
		&-radio {
			flex: 1
		}
		
		.user-header {
			background-color: white;
			display: flex;
			height: 200rpx;
			padding: 30rpx;
			
			&-avatar {
				width: 140rpx;
				height: 140rpx;
				overflow: hidden;
				border-radius: 20rpx;
				
				&-image {
					width: 140rpx;
					height: 140rpx;
				}
			}
			
			&-info {
				margin-left: 30rpx;
				flex-direction: column;
				flex: 1;
				
				&-name {
					line-height: 80rpx;
					font-size: 38rpx;
					font-weight: bold;
				}
				
				&-time {
					font-size: 26rpx;
					color: #999;
				}
			}
		}
	}
</style>
