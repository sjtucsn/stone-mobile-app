<template>
	<view class="publish">
		<view class="cu-form-group margin-top">
			<input type="text" v-model="title" placeholder="请输入标题"></textarea>
		</view>
		<view class="cu-form-group margin-top">
			<textarea class="textarea-height" v-model="content" placeholder="请描述资源内容"></textarea>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">资源类别</view>
			<picker :value="pickerIndex" :range="categoryList" range-key="categoryName" @change="handlePickerChange">
				<view class="picker">
					{{ pickerIndex > -1 ? categoryList[pickerIndex].categoryName : '请选择资源类别'}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">资源位置</view>
			<input type="text" v-model="position" placeholder="请输入该资源的具体位置"/>
		</view>
		<view class="cu-form-group margin-top">
			<view class="grid col-4 grid-square flex-sub with-padding-top">
				<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="viewImage" :data-url="imgList[index]">
				 <image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="deleteImage" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="chooseImage" v-if="imgList.length < 9">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { BASE_URL } from '../../utils.js'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				title: '',
				content: '',
				imgList: [],
				position: '',
				pickerIndex: -1
			}
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			viewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			deleteImage(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			handlePickerChange(e) {
				this.pickerIndex = e.detail.value
			}
		},
		computed: {
			...mapState(['userInfo', 'categoryList'])
		},
		onNavigationBarButtonTap() {
			if (this.title === '' || this.content === '' || this.imgList.length === 0) {
				uni.showToast({
					icon: 'none',
					title: '请输入文字和至少一张图片！'
				})
				return
			}
			if (this.pickerIndex === -1) {
				uni.showToast({
					icon: 'none',
					title: '请选择资源类别！'
				})
				return
			}
			uni.showLoading({
				title: '正在上传中'
			})
			const promiseList = this.imgList.map(path => {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: BASE_URL + '/image/upload',
						name: 'image',
						filePath: path,
						formData: {
							userId: this.userInfo.userId
						},
						success(res) {
							const data = JSON.parse(res.data)
							if (data.resultCode > 0) {
								resolve()
							} else {
								reject()
							}
						},
						fail() {
							reject()
						}
					})
				})
			})
			Promise.all(promiseList).then(() => {
				const data = {
					categoryId: this.categoryList[this.pickerIndex].categoryId,
					categoryName: this.categoryList[this.pickerIndex].categoryName,
					publisherId: this.userInfo.userId,
					content: this.content,
					position: this.position,
					title: this.title
				}
				this.$store.dispatch('publishArticle', data).then(res => {
					if (res.resultCode > 0) {
						uni.hideLoading()
						uni.showToast({
							title: '上传成功！'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: "../main/main"
							})
						}, 500)
					}
				})
			}).catch(() => {
				uni.showToast({
					icon: 'none',
					title: '上传失败！'
				})
			})
		}
	}
</script>

<style>
	.publish {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
	}
	.with-padding-top {
		padding-top: 22rpx;
	}
	.textarea-height {
		height: 30vh;
	}
</style>
