<template>
	<view class="content">
		<view class="detail-header">
			<view class='detail-header-avatar'>
				<image class='detail-header-avatar-image' :src="BASE_URL + data.avatar" mode="aspectFill" width="60px" height="60px"></image>
			</view>
			<view class="detail-header-info">
				<view class="detail-header-info-name">{{ data.name }}</view>
				<view class="detail-header-info-time">{{ data.createTime }}</view>
			</view>
		</view>
		<view class="detail-content">
			<view class="detail-content-text">
				{{ data.content }}
			</view>
			<view class='detail-content-text'>
				地址：{{ data.address }}
			</view>
			<view class='detail-content-text'>
				联系方式：{{ data.tel }}
			</view>
			<image v-if="data.imageList.length === 1" class='detail-content-grid' :src="BASE_URL + data.imageList[0]" mode="aspectFill"></image>
			<uni-grid v-else class='detail-content-grid' :column="column">
				<uni-grid-item v-for="(item, index) in data.imageList" :key="index">
					<image class='detail-content-grid-image' v-if="item !== ''" :src="BASE_URL + item" mode="aspectFill"></image>
					<view v-else />
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	import { BASE_URL } from '../../utils.js'
	export default {
		data() {
			let data
			if (this.$route.query.type === 'article') {
				data = this.$store.state.articleList[this.$route.query.index]
				data = {
					...data,
					avatar: data.publisherAvatar,
					name: data.publisherName,
					tel: data.publisherTel
				}
			} else {
				data = this.$store.state.resourceList[this.$route.query.index]
				data = {
					...data,
					avatar: data.uploaderAvatar,
					name: data.uploaderName,
					tel: data.uploaderTel
				}
			}
			const imageList = { ...data.imageList }
			if (imageList.length === 5) {
				imageList.push('')
			} else if (imageList.length === 7) {
				imageList.push('')
				imageList.push('')
			} else if (imageList.length === 8) {
				imageList.push('')
			}
			return {
				BASE_URL,
				data,
				imageList: data.imageList
			};
		},
		computed: {
			column() {
				const length = this.data.imageList.length
				if (length <= 3) {
					return length
				} else if (length === 4) {
					return 2;
				} else {
					return 3;
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: white;
		padding: 30rpx;
		
		.detail-header {
			display: flex;
			
			&-avatar {
				width: 50px;
				height: 50px;
				overflow: hidden;
				border-radius: 25px;
				
				&-image {
					width: 50px;
					height: 50px;
				}
			}
			
			&-info {
				margin-left: 20rpx;
				flex-direction: column;
				flex: 1;
				
				&-name {
					line-height: 30px;
				}
				
				&-time {
					line-height: 20px;
					font-size: 14px;
					color: #999;
				}
			}
		}
		
		.detail-content {
			margin-top: 20rpx;
			
			&-text {
				margin-top: 10rpx;
				text-align: justify;
				text-align-last: left;
			}
			
			&-grid {
				margin-top: 30rpx;
				
				&-image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
