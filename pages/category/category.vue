<template>
	<view class="category">
		<view v-for="(category, index) in categoryList" :key="index" class="category-item" @longpress="showDeleteModel(category)">
			{{ category.categoryName }}
		</view>
		<view class="category-item category-create" @click="handleShowModel">
			新建
		</view>
		<view class="cu-modal" :class="showModel ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="category-title">请输入类别名称</view>
					<view class="action" @tap="handleHideModel">
						<text class="cuIcon-close text-gray"></text>
					</view>
				</view>
				<input v-model="categoryName" class="category-input" :maxlength="4" placeholder="类别名称不多于4个字"/>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="handleHideModel">取消</button>
						<button class="cu-btn bg-blue margin-left" :disabled="categoryName === ''" @tap="handleCreateCategory">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				showModel: false,
				categoryName: ''
			};
		},
		computed: {
			...mapState(['categoryList'])
		},
		methods: {
			handleShowModel() {
				this.showModel = true
			},
			handleHideModel() {
				this.showModel = false;
			},
			showDeleteModel(category) {
				uni.showModal({
					content: "您确定要删除该类别吗？",
					success: () => {
						this.$store.dispatch('deleteCategory', { categoryId: category.categoryId }).then(() => {
							this.showModel = false
							uni.showToast({
								title: '删除成功！'
							})
						}).catch(res => {
							this.showModel = false
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						})
					}
				})
			},
			handleCreateCategory() {
				this.$store.dispatch('createCategory', { categoryName: this.categoryName }).then(() => {
					this.showModel = false
					this.categoryName = ''
					uni.showToast({
						title: '创建成功！'
					})
				}).catch(res => {
					this.showModel = false
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
				})
			}
		},
		onLoad() {
			this.$store.dispatch('getCategoryList')
		}
	}
</script>

<style lang="scss">
	.category {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		background-color: white;
		padding: 30rpx 55rpx;
		
		&-item {
			margin: 10rpx 10rpx;
			width: 140rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 10rpx;
			background-color: #E6E6E6;
			color: #333;
			font-size: 28rpx;
		}
		
		&-create {
			background-color: white !important;
			border: dashed 1px #CCC;
		}
		
		&-title {
			position: absolute;
			left: 146rpx;
			width: calc(100% - 96rpx - 60rpx - 120rpx - 20rpx);
			line-height: 1.6em;
		}
		
		&-input {
			border: solid 1px #CCC;
			width: 70%;
			height: 60rpx;
			margin: 30rpx 15%;
			border-radius: 10rpx;
			font-size: 28rpx;
		}
	}
</style>
