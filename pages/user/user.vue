<template>
	<view class="user">
		<view class="user-header">
			<view class='user-header-avatar'>
				<image class='user-header-avatar-image' :src="BASE_URL + userInfo.userAvatar" mode="aspectFill" @click="preview"></image>
			</view>
			<view class="user-header-info">
				<view class="user-header-info-name">{{ userInfo.userName }}</view>
				<view class="user-header-info-time">手机号：{{ userInfo.userTel }}</view>
			</view>
		</view>
		
		<view class="user-block margin-top" hover-class="user-block-hover" @click="handleChangeAvatar">
			<text class="user-block-icon-left cuIcon-profile"></text>
			<text>更新头像</text>
			<text class="user-block-icon-right cuIcon-right"></text>
		</view>
		<navigator class="user-block" hover-class="user-block-hover" url="../update/update">
			<text class="user-block-icon-left cuIcon-edit"></text>
			<text>修改资料</text>
			<text class="user-block-icon-right cuIcon-right"></text>
		</navigator>
		<navigator class="user-block" hover-class="user-block-hover" url="../upload/upload">
			<text class="user-block-icon-left cuIcon-upload"></text>
			<text>上传资源</text>
			<text class="user-block-icon-right cuIcon-right"></text>
		</navigator>
		<navigator class="user-block" hover-class="user-block-hover" open-type="switchTab" url="../resource/resource">
			<text class="user-block-icon-left cuIcon-list"></text>
			<text>{{ userInfo.userType === 1 ? '资源列表' : '我的资源'}}</text>
			<text class="user-block-icon-right cuIcon-right"></text>
		</navigator>
		<navigator v-if="userInfo.userType === 1" class="user-block margin-top" hover-class="user-block-hover" url="../publish/publish">
			<text class="user-block-icon-left cuIcon-pullup"></text>
			<text>发表文章</text>
			<text class="user-block-icon-right cuIcon-right"></text>
		</navigator>
		<navigator v-if="userInfo.userType === 1" class="user-block" hover-class="user-block-hover" url="../category/category">
			<text class="user-block-icon-left cuIcon-cascades"></text>
			<text>类别管理</text>
			<text class="user-block-icon-right cuIcon-right"></text>
		</navigator>
		<navigator v-if="userInfo.userType === 1" class="user-block" hover-class="user-block-hover" url="../authority/authority">
			<text class="user-block-icon-left cuIcon-search"></text>
			<text>用户查找</text>
			<text class="user-block-icon-right cuIcon-right"></text>
		</navigator>
		
		<view class="margin-top">
			<button type="primary" class="user-button primary" @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { BASE_URL, compressImage } from '../../utils.js'
	export default {
		data() {
			return {
				BASE_URL
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			handleChangeAvatar() {
				const device = uni.getSystemInfoSync();
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						const path = res.tempFilePaths[0];
						const tempPath = await compressImage(path, device.platform);
						uni.showModal({
							content: '您确定要修改头像吗？',
							success: (res) => {
								if (res.confirm) {
									uni.uploadFile({
										url: BASE_URL + '/user/avatar/change',
										name: 'avatar',
										filePath: tempPath,
										formData: {
											userId: this.userInfo.userId
										},
										success: (res) => {
											const data = JSON.parse(res.data)
											if (data.resultCode > 0) {
												this.$store.dispatch('getUserInfo', { userId: this.userInfo.userId })
												uni.showToast({
													title: '头像修改成功！'
												})
											} else {
												uni.showToast({
													icon: 'none',
													title: data.msg
												})
											}
										},
										fail() {
											uni.showToast({
												icon: 'none',
												title: '头像上传失败!'
											})
										}
									})
								}
							}
						})
					}
				})
			},
			preview() {
				uni.previewImage({
					urls: [(BASE_URL + this.userInfo.userAvatar).split('thumbnail.').join('')],
				});
			},
			bindLogout() {
				this.$store.commit('logout')
				uni.removeStorage({
					key: 'user',
					success() {
						uni.reLaunch({
							url: '../login/login'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.user {		
		display: flex;
		flex-direction: column;
		flex: 1;
		
		&-header {
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
		
		&-block {
			background-color: white;
			height: 95rpx;
			line-height: 95rpx;
			font-size: 30rpx;
			border-bottom: solid 1px rgba($color: #000000, $alpha: 0.1);
			
			&-hover {
				background-color: #ddd;
			}
			
			&-icon-left {
				font-size: 32rpx;
				float: left;
				margin: 0 40rpx;
			}
			
			&-icon-right {
				float: right;
				margin-right: 20rpx;
				color: #bbb
			}
		}
		
		&-button {
			height: 90rpx;
			line-height: 90rpx;
		}
	}
</style>
