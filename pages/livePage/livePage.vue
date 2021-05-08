<template>


	<view class="container">
		<live-player id="polyvLiveVideo" class="vp-v" :src="video.src" autoplay></live-player>
	</view>


</template>

<script>
	import polyvLive from "@/units/polyvlive.js"
	export default {
		data() {
			return {
				video: { //直播的链接
					src: '',
					poster: ''
				},
			}
		},
		onReady() {
			this.livePlay()
		},
		onUnload() {
			polyvLive.destroy();
		},
		methods: {


			livePlay() {
				const liveUid = "e91629260c";
				const liveVid = "2019522";
				const liveVideoContext = uni.createLivePlayerContext('polyvLiveVideo');

				polyvLive.getVideo({
					uid: liveUid,
					vid: liveVid,
					videoContext: liveVideoContext,
					success: (videoInfo) => {
						// set video src and poster
						this.setPlayerSrc(videoInfo);
					},
					error: (res) => {
						console.log('error',res.error);
					},
					onStartLive: () => {
						console.log('start live');
						// set latest video src
						this.setNewPlayerSrc();
					}
				});

			},


			// 监听当前直播视频流状态
			onStateChange(e) {
				console.log('stateChnage:', e);
			},

			// 设置播放地址
			// 若使用video组件替代live-player组件，播放地址请使用videoInfo.src
			setPlayerSrc(videoInfo) {
				this.video.src = videoInfo.flvSrc
				this.video.poster = videoInfo.poster
				console.log(this.video)
			},

			// 设置当前最新播放地址
			setNewPlayerSrc() {
				polyvLive.getNewVideo((videoInfo) => {
					this.setPlayerSrc(videoInfo);
				});
			}

		},
	}
</script>

<style>
</style>
