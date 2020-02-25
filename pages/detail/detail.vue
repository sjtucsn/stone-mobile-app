<template>
	<view class="content">
		<view class="detail-header">
			<view class='detail-header-avatar'>
				<image class='detail-header-avatar-image' :src="BASE_URL + data.avatar" mode="aspectFill" width="60px" height="60px"></image>
			</view>
			<view class="detail-header-info">
				<view class="detail-header-info-name">
					{{ data.name }}
					<text v-if="data.gender === 1" class="cuIcon-male gender-male"></text>
					<text v-if="data.gender === 0" class="cuIcon-female gender-female"></text>
				</view>
				<view class="detail-header-info-time">{{ data.createTime }}</view>
			</view>
		</view>
		<view class="detail-content">
			<view class="detail-content-text">
				{{ data.content }}
			</view>
			<view v-if="data.position" class='detail-content-text'>
				资源地址：{{ data.position }}
			</view>
			<view class='detail-content-text'>
				联系方式：{{ data.tel }}
			</view>
			<image v-if="data.imageList.length === 1" class='detail-content-grid' :src="BASE_URL + data.imageList[0]" 
				@click="viewImage(data.imageList, 0)" mode="aspectFit"></image>
			<uni-grid v-else class="detail-content-grid" :column="column" :showBorder="false">
				<uni-grid-item class="detail-content-item" v-for="(item, index) in data.imageList" :key="index">
					<image class="detail-content-item-image" v-if="item !== ''" :src="BASE_URL + item" 
						@click="viewImage(data.imageList, index)" mode="aspectFill"></image>
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
			return {
				BASE_URL,
				type: '',
				index: ''
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
			},
			data() {
				let data
				if (this.type === 'article') {
					data = this.$store.state.articleList[this.index]
					data = {
						...data,
						avatar: data.publisherAvatar,
						name: data.publisherName,
						tel: data.publisherTel,
						gender: data.publisherGender
					}
				} else {
					data = this.$store.state.resourceList[this.index]
					data = {
						...data,
						avatar: data.uploaderAvatar,
						name: data.uploaderName,
						tel: data.uploaderTel,
						gender: data.uploaderGender
					}
				}
				const imageList = data.imageList
				if (imageList.length === 5) {
					imageList.push('')
				} else if (imageList.length === 7) {
					imageList.push('')
					imageList.push('')
				} else if (imageList.length === 8) {
					imageList.push('')
				}
				return data
			}
		},
		methods: {
			viewImage(imageList, index) {
				imageList = imageList.filter(url => url !== '').map(url => BASE_URL + url)
				uni.previewImage({
					urls: imageList,
					current: imageList[index]
				});
			},
		},
		onLoad(data) {
			this.type = data.type;
			this.index = data.index;
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
			}
			
			&-item {
				padding: 5rpx;
				
				&-image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
