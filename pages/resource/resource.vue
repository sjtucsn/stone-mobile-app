<template>
	<view class="content">
		<view class="resource-item" v-for="(item, index) in resourceList" :key="index">
			<uni-card
				mode="title"
			    :title="item.uploaderName"
			    :is-shadow="true"
				:is-full="true"
				:thumbnail="BASE_URL + item.uploaderAvatar"
			    :extra="item.createTime">
				<view class="item-content" @click="handleShowDetail(index)">
					<view class="item-content-text">
						{{ item.content }}
					</view>
					<view v-if="item.address" class='item-content-text'>
						地址：{{ item.address }}
					</view>
					<view class='item-content-text'>
						联系方式：{{ item.uploaderTel }}
					</view>
					<view class='item-content-grid' v-if="item.imageList && item.imageList.length !== 0">
						<image v-if="item.imageList.length === 1" :src="BASE_URL + item.imageList[0]" 
							@click="viewImage(item.imageList, 0)" mode="aspectFit"></image>
						<uni-grid v-else :column="3" :showBorder="false">
							<uni-grid-item class="item-content-grid-image" v-for="(value, index) in item.imageList" :key="index">
								<image class="item-content-grid-image-image" v-if="value !== ''" 
									:src="BASE_URL + value" mode="aspectFill" @click="viewImage(item.imageList, index)"></image>
								<view v-else />
							</uni-grid-item>
						</uni-grid>
					</view>
				</view>
			</uni-card>
		</view>
		<uni-load-more :status="status" @clickLoadMore="handleLoadMore"></uni-load-more>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { BASE_URL } from '../../utils.js' 
	export default {
		data() {
			return {
				BASE_URL,
				pageSize: 10,
				status: 'more'
			}
		},
		computed: {
			...mapState(['resourceList'])
		},
		methods: {
			handleShowDetail(index) {
				uni.navigateTo({
					url: '../detail/detail?type=resource&index=' + index,
					animationType: "fade-in",
					animationDuration: 300
				})
			},
			handleLoadMore() {
				this.status = 'loading'
				this.$store.dispatch('loadMoreResource', { offset: this.resourceList.length, pageSize: this.pageSize }).then((res) => {
					if (res.result.length === 0) {
						this.status = 'nomore'
					} else {
						this.status = 'more'
					}
				})
			},
			viewImage(imageList, index) {
				imageList = imageList.map(url => BASE_URL + url)
				uni.previewImage({
					urls: imageList,
					current: imageList[index]
				});
			},
		},
		onPullDownRefresh() {
			this.$store.dispatch('getResourceList', { offset: 0, pageSize: this.pageSize }).then(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			this.handleLoadMore()
		},
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: () => {
					this.$store.dispatch('getResourceList', { offset: 0, pageSize: this.pageSize }).catch((res) => {
						uni.removeStorage({
							key: 'user',
							success() {
								uni.showToast({
									icon: 'none',
									title: res.msg
								})
								setTimeout(() => {
									uni.reLaunch({
										url: '../login/login'
									});
								}, 500)
							}
						})
					})
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

<style lang="scss">
	.content {
		padding: 0;

		.resource-item {
			margin-top: 30rpx;
			
			.item-content {
				&-grid {
					margin-top: 20rpx;
					
					&-image {
						width: 100%;
						height: 100%;
						padding: 5rpx;
						
						&-image {
							width: 100%;
							height: 100%;
						}
					}
				}
				
				&-text {
					margin-top: 10rpx;
					text-align: justify;
					text-align-last: left;
				}
			}
		}
	}
</style>
