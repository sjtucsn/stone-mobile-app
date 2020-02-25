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
		<view class="article-item" v-for="(item, index) in articleList" :key="index">
			<uni-card
				mode="title"
			    :title="item.publisherName"
			    :is-shadow="true"
				:is-full="true"
				:thumbnail="BASE_URL + item.publisherAvatar"
			    :extra="item.createTime">
				<view class="item-content" @click="handleShowDetail(index)">
					<view class="item-content-image">
						<image class="item-content-image-image" :src="BASE_URL + item.imageList[0]" mode="aspectFill"/>
						<view class="item-content-image-title"><text class="item-content-image-title-text">{{ item.title }}</text></view>
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
				status: 'loading'
			}
		},
		computed: {
			...mapState(['articleList', 'categoryList']),
		},
		methods: {
			handleShowDetail(index) {
				uni.navigateTo({
					url: '../detail/detail?type=article&index=' + index,
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
				this.$store.dispatch('getArticleList', data).then(() => {
					uni.hideLoading()
				})
			},
			handleLoadMore() {
				this.status = 'loading'
				const data = { offset: this.articleList.length, pageSize: this.pageSize }
				if (this.currentTagIndex !== -1) {
					data.categoryId = this.categoryList[this.currentTagIndex].categoryId
				}
				this.$store.dispatch('loadMoreArticle', data).then((res) => {
					if (res.result.length === 0) {
						this.status = 'nomore'
					} else {
						this.status = 'more'
					}
				})
			},
		},
		onPullDownRefresh() {
			const data = { offset: 0, pageSize: this.pageSize }
			if (this.currentTagIndex !== -1) {
				data.categoryId = this.categoryList[this.currentTagIndex].categoryId
			}
			this.$store.dispatch('getArticleList', data).then(() => {
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
					this.$store.dispatch('getCategoryList')
					this.$store.dispatch('getArticleList', { offset: 0, pageSize: this.pageSize}).catch((res) => {
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
		
		.category-height {
			height: 80rpx;
			line-height: 80rpx;
		}
		
		.article-item {
			margin-top: 30rpx;
			
			.item-content {
				&-image {
					display: flex;
					flex: 1;
					overflow: hidden;
					position: relative;
					
					&-image {
						flex: 1
					}
					
					&-title {
						display: flex;
						position: absolute;
						bottom: 0;
						left: 0;
						right: 0;
						padding: 16rpx 24rpx;
						background-color: rgba(0, 0, 0, 0.4);
						
						&-text {
							flex: 1;
							font-size: 28rpx;
							color: #fff;
						}
					}
				}
			}
		}
	}
</style>
