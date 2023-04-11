<!--
 * @Description: 音频播放控件
 * @Author: IFLS
 * @Date: 2021-12-27 15:54:41
 * @LastEditTime: 2023-03-23 17:40:18
-->
<template>
  <div class="audio-wrapper">
    <audio ref="audio" :loop="loop">
      <source :src="audioUrl" type="audio/mp3" />
      <source :src="audioUrl" type="audio/wav" />
      <source :src="audioUrl" type="audio/ogg" />
    </audio>
    <div class="audio-left">
      <div class="icon-box">
        <van-icon size="30" ref="audioPlayer" name="play" v-if="playFlag" @click="onPlay()" />
        <van-icon size="30" ref="audioPlayer" name="pause" v-if="!playFlag" @click="onPlay()" />
      </div>
    </div>
    <div class="audio-right">
      <div class="audio-title">
        {{ title }}
      </div>
      <div class="audio-content">
        {{ content }}
      </div>
      <div class="audio-time">
        <div class="progress-bar-bg" ref="progressBarBg" @mousedown="handleClick">
          <span ref="progressDot"></span>
          <div class="progress-bar" ref="progressBar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 音频url
      audioUrl: {
        type: String,
        default: ""
      },
      // 是否循环播放
      loop: {
        type: Boolean,
        default: false
      },
      // 标题
      title: {
        type: String,
        default: "正念饮食"
      },
      // 内容
      content: {
        type: String,
        default: "告别情绪性进食和狼吐虎咽，享受美食，促进吸收"
      }
    },
    data() {
      return {
        audio: "",
        playFlag: true
      };
    },
    watch: {
      // 监听audio值 判断开始或结束
      audio() {
        this.audio.addEventListener(
          "timeupdate",
          () => {
            // //console.log('开始')
            this.updateProgress();
          },
          false
        );
        this.audio.addEventListener(
          "ended",
          () => {
            // //console.log('结束')
            this.audioEnded();
          },
          false
        );
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      /**
       * 初始化
       */
      init() {
        this.audio = this.$refs.audio;
        this.audio.load();
        this.audio.pause();
        this.updateProgress();
      },
      /**
       * 点击播放/暂停时，控制音乐的播放与暂停
       */
      onPlay() {
        if (this.audio.paused) {
          // 开始播放当前点击的音频
          this.audio.play();
          this.playFlag = false;
        } else {
          this.audio.pause();
          this.playFlag = true;
        }
        this.updateProgress();
      },
      /**
       * 刷新进度条
       */
      updateProgress() {
        let value = this.audio.currentTime / this.audio.duration;
        if (this.$refs.progressBar) {
          this.$refs.progressBar.style.width = value * 100 + "%";
          this.$refs.progressDot.style.left = value * 100 + "%";
        }
      },
      /**
       * 音乐结束
       */
      audioEnded() {
        this.$refs.progressBar.style.width = 0 + "%";
        this.$refs.progressDot.style.left = 0 + "%";
        this.playFlag = true;
      },
      /**
       * 点击进度条跳到指定进度
       */
      handleClick(e) {
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        if (!this.audio.paused || this.audio.currentTime != 0) {
          const pgsWidth = this.$refs.progressBarBg.offsetWidth;
          const rate = e.offsetX / pgsWidth;
          this.audio.currentTime = this.audio.duration * rate;
          this.updateProgress();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .audio-wrapper {
    width: 90%;
    // height: fit-content;
    padding: 10px;
    margin: 0 auto;
    background: linear-gradient(135deg, #e9fcff 0%, #e8faff 100%);
    border-radius: 49px;
    display: flex;
    align-items: center;
    .audio-left {
      width: 15%;
      height: 100%;
      text-align: center;
      .icon-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 80px;
        color: #fff;
        background: linear-gradient(135deg, #24ddfd 0%, #1fd1fd 100%);
        border-radius: 50%;
      }
    }
    .audio-right {
      width: 80%;
      height: 100%;
      .audio-title {
        text-align: left;
        font-size: 28px;
        font-weight: 700;
        color: #20d3fd;
      }
      .audio-content {
        color: #20d3fd;
        text-align: left;
        font-size: 20px;
      }
      .audio-time {
        margin-top: 8px;
        .progress-bar-bg {
          position: relative;
          height: 8px;
          background: linear-gradient(135deg, #aef3ff 0%, #aaeaff 100%);
          border-radius: 4px;
          .progress-bar {
            width: 0;
            height: 8px;
            background: linear-gradient(135deg, #27e5fd 0%, #1bc7fd 100%);
            border-radius: 4px;
          }
        }
      }
    }
  }

  .van-popup__close-icon {
    position: absolute;
    top: -4px;
    right: 16px;
    z-index: 1;
    color: #c8c9cc;
    font-size: 22px;
    cursor: pointer;
  }
</style>
