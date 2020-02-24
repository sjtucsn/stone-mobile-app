<template>
	<view class="content">
		<view class="article-item" v-for="(item, index) in articleList" :key="index">
			<uni-card
				mode="title"
			    :title="item.publisherName"
			    :is-shadow="true"
				:is-full="true"
				:thumbnail="BASE_URL + item.publisherAvatar"
			    :extra="item.createTime"
				@click="handleShowDetail(index)"
			>
				<view class="item-content">
					<view class="item-content-image">
						<image class="item-content-image-image" :src="BASE_URL + item.imageList[0]" mode="aspectFill"/>
						<view class="item-content-image-title"><text class="item-content-image-title-text">{{ item.title }}</text></view>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { BASE_URL } from '../../utils.js' 
	export default {
		data() {
			return {
				BASE_URL,
				pageNo: 0,
				pageSize: 10
			}
		},
		computed: {
			...mapState(['articleList'])
		},
		methods: {
			handleShowDetail(index) {
				uni.navigateTo({
					url: '../detail/detail?type=article&index=' + index,
					animationType: "fade-in",
					animationDuration: 300
				})
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'user',
				success: () => {
					this.$store.dispatch('getArticleList', { pageNo: this.pageNo, pageSize: this.pageSize}).catch((res) => {
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
		
		.article-item {
			margin-bottom: 30rpx;
			
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
