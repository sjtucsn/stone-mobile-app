<template>
	<view class="content">
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation>
			<view class="cu-item category-height" :class="currentTagIndex === -1 ? 'text-blue cur' : ''" @tap="tabSelect(-1)">
				全部
			</view>
			<view class="cu-item category-height" :class="index === currentTagIndex ? 'text-blue cur' : ''" 
				v-for="(category, index) in categoryList" :key="index" @tap="tabSelect(index)">
				{{category.categoryName}}
			</view>
		</scroll-view>
		<view class="resource-item" v-for="(item, index) in resourceList" :key="index">
			<uni-card
				mode="title"
			    :title="item.uploaderName"
			    :is-shadow="true"
				:is-full="true"
				:thumbnail="BASE_URL + item.uploaderAvatar"
			    :extra="item.createTime">
				<view class="item-content" @click="handleShowDetail(index)">
					<view class="item-content-text no-margin-top">
						{{ item.content }}
					</view>
					<view v-if="item.position" class='item-content-text'>
						资源地址：{{ item.position }}
					</view>
					<view class='item-content-text'>
						联系方式：{{ item.uploaderTel }}
					</view>
					<view class='item-content-grid' v-if="item.thumbnailList && item.thumbnailList.length !== 0">
						<image v-if="item.thumbnailList.length === 1" :src="BASE_URL + item.thumbnailList[0]" 
							@click="viewImage(item.imageList, 0)" mode="aspectFit"></image>
						<uni-grid v-else :column="3" :showBorder="false">
							<uni-grid-item class="item-content-grid-image" v-for="(value, index) in item.thumbnailList" :key="index">
								<image class="item-content-grid-image-image" v-if="value !== ''" 
									:src="BASE_URL + value" mode="aspectFill" @click.stop="viewImage(item.imageList, index)"></image>
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
				currentTagIndex: -1,
				status: 'more'
			}
		},
		computed: {
			...mapState(['userInfo', 'resourceList', 'categoryList'])
		},
		methods: {
			handleShowDetail(index) {
				uni.navigateTo({
					url: '../detail/detail?type=resource&index=' + index,
					animationType: "fade-in",
					animationDuration: 300
				})
			},
			tabSelect(index) {
				this.currentTagIndex = index
				this.status = 'more'
				uni.showLoading({
					title: '正在加载'
				})
				const data = { offset: 0, pageSize: this.pageSize }
				if (this.currentTagIndex !== -1) {
					data.categoryId = this.categoryList[index].categoryId
				}
				if (this.userInfo.userType === 0) {
					data.uploaderId = this.userInfo.userId
				}
				this.$store.dispatch('getResourceList', data).then(() => {
					uni.hideLoading()
				})
			},
			handleLoadMore() {
				this.status = 'loading'
				const data = { offset: this.resourceList.length, pageSize: this.pageSize }
				if (this.currentTagIndex !== -1) {
					data.categoryId = this.categoryList[this.currentTagIndex].categoryId
				}
				if (this.userInfo.userType === 0) {
					data.uploaderId = this.userInfo.userId
				}
				this.$store.dispatch('loadMoreResource', data).then((res) => {
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
			const data = { offset: 0, pageSize: this.pageSize }
			if (this.currentTagIndex !== -1) {
				data.categoryId = this.categoryList[this.currentTagIndex].categoryId
			}
			if (this.userInfo.userType === 0) {
				data.uploaderId = this.userInfo.userId
			}
			this.$store.dispatch('getResourceList', data).then(() => {
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
					const data = { offset: 0, pageSize: this.pageSize }
					if (this.currentTagIndex !== -1) {
						data.categoryId = this.categoryList[this.currentTagIndex].categoryId
					}
					if (this.userInfo.userType === 0) {
						data.uploaderId = this.userInfo.userId
					}
					this.$store.dispatch('getResourceList', data).catch((res) => {
						uni.removeStorage({
							key: 'user',
							success() {
								this.status = 'more'
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
				
				.no-margin-top {
					margin-top: 0
				}
			}
		}
	}
</style>
