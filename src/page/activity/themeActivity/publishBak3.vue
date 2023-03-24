<template>
  <div class="pub-container">
    <div class="content">
      <van-field
        maxlength="200"
        @update="handleChangeInput"
        class="content-input"
        v-model="text"
        rows="2"
        autosize
        type="textarea"
        placeholder=""
      >
        <div slot="label" v-if="activityTitle || topicTitle" class="active-title">
          <span @click="handleViewActive" v-if="activityTitle"> @{{ activityTitle }}</span>
          <span v-if="topicTitle"> #{{ topicTitle }}</span>
        </div>
      </van-field>
      <div>
        <div v-if="showPlayBtn && fileType == 'video'" class="videoBox">
          <div class="play_box" v-if="showPlayBtn">
            <img
              @click="handlePlay"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/video_2.png"
            />
          </div>

          <div class="video_poster" v-if="posterVisible">
            <img v-if="videoObj.CoverURL" :src="videoObj.CoverURL" />
          </div>
          <img
            @click="handleRemoveVideo()"
            class="file-remove"
            src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/del.png"
          />
        </div>

        <video-player
          v-if="!posterVisible && fileType == 'video'"
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          webkit-playsinline="true"
          x-webkit-airplay="true"
          playsinline
          :options="playerOptions"
        >
        </video-player>
      </div>
      <div class="content-file">
        <template v-if="fileType == 'image'">
          <div v-for="(item, index) in dynamicImgs" class="content-file-item" :key="index">
            <img class="file-img" :src="item.url" alt="" srcset="" />
            <img
              @click="handleRemove(index)"
              class="file-remove"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/del.png"
              alt=""
              srcset=""
            />
          </div>
        </template>
        <div v-show="fileType == ''" @click="handleClickSelectOptions" class="content-file-select">
          <img
            src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/add.png"
            alt=""
            srcset=""
          />
        </div>
        <UploadAuth
          accept="image/*"
          ref="uploadImageDom"
          v-show="fileType == 'image' && dynamicImgs.length < 9"
          :multiple="true"
          @progress="handleProgress"
          @imagesSelect="handleSelectImage"
          @getVideo="getVideoId"
        >
        </UploadAuth>
        <UploadAuth
          accept="video/*"
          ref="uploadVideoDom"
          v-show="false"
          @progress="handleProgress"
          @imagesSelect="handleSelectImage"
          :multiple="false"
          @getVideo="getVideoId"
        >
        </UploadAuth>
        <div class="content-file-space"></div>
        <div class="content-file-space"></div>
      </div>
      <div class="operate">
        <div class="select_btn">
          <div @click="handleSelectActivity" class="topic_btn activity">
            <img
              @click="handleSelectActivity"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/@.png"
              alt=""
            />
            <span class="topic_btn_label">选择活动</span>
          </div>
          <div @click="handleSelectTopic" class="topic_btn topic">
            <img
              @click="handleSelectTopic"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/%23.png"
              alt=""
            />
            <span class="topic_btn_label">选择话题</span>
          </div>
        </div>

        <div @click="handlePublish" v-debounce="3000" class="publish_btn">发表</div>
      </div>
    </div>

    <van-overlay :show="show">
      <div class="wrapper" @click.stop>
        <div class="block">{{ waitTitle }}</div>
      </div>
    </van-overlay>
    <van-action-sheet v-model="showUploadOption" :closeable="false" title="">
      <div @click="handleClickPic" class="option-item">
        <img
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/xj.png"
          alt=""
          srcset=""
        />
        <span class="label">上传图片</span>
      </div>
      <div @click="handleClickVideo" class="option-item">
        <img
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/pic.png"
          alt=""
          srcset=""
        />
        <span class="label">上传视频</span>
      </div>
      <div @click="handleCancelUpload" class="option-item cancel-label">
        <span class="label">取消</span>
      </div>
    </van-action-sheet>
    <full-loading :loading="publishing" />

    <tips :value.sync="publishSuccess" :exp="exp" :title="title">
      <div>内容经过审核才会显示哟</div>
      <div>1.文本/图片预计1-3秒</div>
      <div>2.视频视大小预计1-5分钟</div>
    </tips>
  </div>
</template>
<script>
  import { publish } from "@/service/activity";
  import UploadAuth from "@/components/AliyunUpload";
  import { getVideoUrl } from "@/service/aliyunUpload";
  import { uploadPic } from "@/service/activity";
  import FullLoading from "@/components/Loading";

  import Tips from "@/components/Tips";
  import eventBus from "@/utils/eventBus.js";
  export default {
    name: "publish",
    data() {
      return {
        publishing: false,
        publishSuccess: false,
        title: "发布成功",
        exp: 0,
        text: "",
        url: "",
        test: 0,
        activeId: "",
        activityTitle: "",
        topicId: "",
        topicTitle: "",
        videoId: "",
        timer: "",
        bakStr: "",
        init: false,
        fileType: "",
        showPlayBtn: true,
        posterVisible: true,
        videoObj: {},
        dynamicImgs: [],
        waitTitle: "",
        show: false,
        showUploadOption: false,
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.25, 1.5, 2.0], //播放速度
          autoplay: false, // 是否自动播放。
          muted: false, // 是否静音播放，默认情况下将会消除任何音频。
          loop: false, // 是否循环播放。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          // aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          aspectRatio: "16:9",
          fluid: false, // 是否流体从而按比例缩放以适应其容器。
          flash: { hls: { withCreadentials: false } }, //可以播放rtmp视频
          html5: { hls: { withCreadentials: false } }, //可以播放m3u8视频
          sources: [
            {
              type: "video/mp4",
              src: "" // 视频url地址
            }
          ],
          poster: "", // 封面地址
          width: "100%",
          notSupportedMessage: ".", // 当无法播放时允许覆盖Video.js，显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true
          }
        },
        queryObj: {}
      };
    },
    components: {
      UploadAuth,
      FullLoading,
      Tips
    },
    watch: {
      text(value, oldValue) {
        if (value != oldValue) {
          /**
           * 如果没有选择话题，并且输入的文字里包含 #开头空格结尾的，则生成话题
           */
          var reg = /#(.*?)\w+\s/;

          // // 如果没有话题，且输入的内容中符合话题的条件
          if (!this.topicTitle && reg.test(value)) {
            let temp = value.match(reg);
            temp = temp[0].replace("#", "").trim();

            // 显示的话题
            this.topicTitle = temp;
            // 显示的内容
            // this.text = value.replace(`#${this.topicTitle}`, '');
            // 提交给后端的内容
            // this.bakStr = value.replace(`#${this.topicTitle}`, '');
          }

          // 如果有选择活动或者话题
          if (this.activityTitle || this.topicTitle) {
            // 首先要把发给后台的内容文字过滤出来
            let tempStr = value.replace(`#${this.topicTitle}`, "");
            this.bakStr = tempStr.replace(`@${this.activityTitle}`, "").trim();

            /**
             * 把活动和话题与bakStr组装
             * 1.输入的text里活动和话题都存在
             * 2.输入的text里存在活动不存在话题
             * 3.输入的text里存在话题不存在活动
             * 4.输入的text里话题和活动都不存在
             */
            if (value.indexOf(`@${this.activityTitle} `) != -1 && value.indexOf(`#${this.topicTitle} `) != -1) {
              this.text = `@${this.activityTitle} #${this.topicTitle} ${this.bakStr}`;
            } else if (value.indexOf(`@${this.activityTitle} `) != -1 && value.indexOf(`#${this.topicTitle} `) == -1) {
              this.topicTitle = "";
              this.text = `@${this.activityTitle} ${this.bakStr}`;
              delete this.queryObj.topicId;
            } else if (value.indexOf(`@${this.activityTitle} `) == -1 && value.indexOf(`#${this.topicTitle} `) != -1) {
              this.activityTitle = "";
              this.text = `#${this.topicTitle} ${this.bakStr}`;
              delete this.queryObj.id;
            } else {
              this.topicTitle = "";
              this.activityTitle = "";
              this.text = this.bakStr;
              delete this.queryObj.topicId;
              delete this.queryObj.id;
            }
          } else {
            // 没有的话直接备份输入的文字
            this.bakStr = value;
          }
        }
      }
    },
    methods: {
      handleViewActive() {
        this.zgStatistics("健康新奥-健康活动-活动动态-发表时点击活动按钮", { 活动名称: this.activityTitle });
        this.$router.push({
          name: "dynamicDetail",
          query: Object.assign(this.$route.query, {
            id: this.activeId
          })
        });
      },
      handleClickSelectOptions() {
        this.showUploadOption = true;
      },
      handleClickPic() {
        this.$refs.uploadImageDom.handleClick();
        this.showUploadOption = false;
      },
      handleClickVideo() {
        this.$refs.uploadVideoDom.handleClick();
        this.showUploadOption = false;
      },
      handleCancelUpload() {
        this.showUploadOption = false;
      },
      handlePlay() {
        this.videoFinished = false;
        this.firstPlay = true;

        this.posterVisible = false;
        this.showPlayBtn = false;
        setTimeout(() => {
          this.$refs.videoPlayer.player.play();
        }, 1000);
      },
      handleSelectImage(value) {
        console.log(value, "value");
        this.fileType = "image";
        if (this.dynamicImgs.length + value.length > 9) {
          this.$toast("图片最多发9个");
          return;
        }
        value.forEach(item => {
          const formdata = new FormData();
          formdata.append("file", item);
          uploadPic(formdata).then(({ code, data, msg }) => {
            if (code == 1000) {
              console.log(data);
              const url = data.keyList[0][Object.keys(data.info)[0]];
              const name = Object.keys(data.info)[0];
              this.dynamicImgs.push({ url, flag: "img" });
            }
          });
        });
      },

      handleChangeInput(value) {
        console.log(value, "value");
      },
      handleRemoveVideo(value) {
        this.fileType = "";
        this.dynamicImgs = [];
      },
      handleRemove(index) {
        this.dynamicImgs.splice(index, 1);
        if (this.dynamicImgs.length == 0) {
          this.fileType = "";
        }
      },
      handlePublish() {
        console.log("tet", this.bakStr, "000");
        if (!this.bakStr) {
          this.$toast({
            message: "发布内容不能为空"
          });
          return;
        }
        let params = {
          content: this.bakStr,
          dynamicImgs: this.dynamicImgs,
          activityId: this.activityTitle ? this.activeId : "",
          activityTitle: this.activityTitle ? this.activityTitle : "",
          memberCode: localStorage.getItem("memberCode"),
          topicId: this.topicTitle ? this.topicId : "",
          topicTitle: this.topicTitle ? this.topicTitle : ""
        };
        let type = "文字";
        if (this.dynamicImgs.length) {
          if (this.dynamicImgs[0].flag == "video") {
            type = "文字+视频";
          } else {
            type = "文字+图片";
          }
        }
        if (this.publishing) return;
        this.publishing = true;
        this.zgStatistics("健康新奥-健康活动-活动动态-点击发表按钮", { 活动名称: this.activityTitle, 活动分类: type });
        publish(params)
          .then(({ code, data }) => {
            this.publishing = false;
            if (code == 0) {
              if (data.isAddPoints) {
                this.title = "发布成功，健康积分";
                this.exp = data.healthPoints;
              } else {
                this.title = "发布成功";
                this.exp = 0;
              }

              setTimeout(() => {
                this.publishSuccess = true;
              }, 50);

              this.dynamicImgs = [];
              this.bakStr = "";
              this.activityTitle = "";
              this.activeId = "";
              this.topicTitle = "";
              this.topicId = "";
              this.posterVisible = true;
              this.text = "";
              // 清空视频内容
              this.videoObj = {};
              this.showPlayBtn = false;
              this.fileType = "";
              this.$router.replace({
                path: "themeActivityHome"
              });
            }
          })
          .catch(() => {
            this.publishing = false;
          });
      },
      getVideoUrl(base64Cover) {
        let params = {
          videoId: this.videoId,
          zone: "beijing"
        };
        getVideoUrl(params).then(res => {
          console.log("查询视频", this.timer);
          if (res.code == 1000) {
            if (!res.data) {
              console.log("视频正在转码中，稍等后点击");
            } else {
              clearInterval(this.timer);

              this.show = false;
              this.fileType = "video";
              console.log(res.data, "data");
              this.videoObj = res.data.VideoBase;
              let url = res.data.PlayInfoList.PlayInfo[0].PlayURL;
              let cover = res.data.VideoBase.CoverURL;
              if (!cover) {
                this.videoObj.CoverURL = base64Cover;
              }
              this.playerOptions.sources[0].src = url;

              this.dynamicImgs = [{ url, cover: this.videoObj.CoverURL, flag: "video" }];
            }
          }
        });
      },
      handleSelectActivity() {
        if (this.$route.query.id) {
          this.$router.replace({ name: "topics", query: this.queryObj });
        } else {
          this.$router.push({ name: "topics", query: this.queryObj });
        }
      },
      handleSelectTopic() {
        if (this.$route.query.topicId) {
          this.$router.replace({ name: "topicSelect", query: this.$route.query });
        } else {
          this.$router.push({ name: "topicSelect", query: this.$route.query });
        }
      },
      handleProgress(value) {
        this.show = true;
        this.waitTitle = value + "%";
      },
      getVideoId(videoInfo, cover) {
        this.videoId = videoInfo.videoId;
        console.log(cover, "cover");
        this.waitTitle = "转码中...";
        this.timer = setInterval(() => {
          this.getVideoUrl(cover);
        }, 2000);
      },
      pageInit() {
        this.init = true;
        const query = this.$route.query;
        this.queryObj = this.$route.query;
        localStorage.setItem("cateId", "10408");

        if (query.id) {
          this.activeId = query.id;
          this.activityTitle = decodeURI(query.name);
          // this.bakStr = this.text[0]
          // this.text = `<span style="color:green;">@${this.activityTitle}@</span>${this.text}`
        }

        if (query.topicId) {
          this.topicId = query.topicId;
          this.topicTitle = decodeURI(query.topicTitle);
        }

        // 都存在
        if (query.id && query.topicId) {
          this.text = `@${this.activityTitle} #${this.topicTitle} ${this.bakStr}`;
        } else if (query.id && !query.topicId) {
          // 存在活动
          this.text = `@${this.activityTitle} ${this.bakStr}`;
        } else if (!query.id && query.topicId) {
          // 存在话题
          this.text = `#${this.topicTitle} ${this.bakStr}`;
        }

        if (query.from == "themeActivityHome") {
          this.dynamicImgs = [];
          this.bakStr = "";
          this.activityTitle = "";
          this.activeId = "";
          this.topicTitle = "";
          this.topicId = "";
          this.posterVisible = true;
          this.text = "";
          // 清空视频内容
          this.videoObj = {};
          this.showPlayBtn = false;
          this.fileType = "";
        }

        if (query.source && query.source == "workBreakExercisesDetail") {
          this.dynamicImgs = [];
          let url = sessionStorage.getItem("creatImgUrl");
          this.fileType = "image";
          this.dynamicImgs.push({ url: url, flag: "img" });
          console.log("this.dynamicImgs", this.dynamicImgs);
          console.log("this.fileType", this.fileType);
        }
      }
    },
    activated() {
      console.log("zou");
      this.publishSuccess = false;
      if (!this.init) {
        this.pageInit();
      }
      if (this.$route.query.source && this.$route.query.source == "workBreakExercisesDetail") {
        this.dynamicImgs = [];
        this.fileType = "image";
        let url = sessionStorage.getItem("creatImgUrl");
        this.dynamicImgs.push({
          url: url,
          flag: "img"
        });
      }
      // 监听返回事件
      eventBus.$on("onback", closeFn => {
        // closeFn() 关闭当前页
        this.$router.replace({
          path: "/themeActivityHome"
        });
      });
    },
    deactivated() {
      this.init = false;
    }
  };
</script>
<style scoped lang="scss">
  #app {
    width: 500px !important;
    background-color: red;
  }

  .option-item {
    height: 88px;
    text-align: center;
    font-size: 28px;

    color: #1c1c1e;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 40px;
      margin-right: 8px;
    }

    .label {
      font-size: 28px;
      color: #1c1c1e;
      line-height: 88px;
    }
  }

  .cancel-label {
    background-color: #f0f2f7;
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .operate {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    .topic {
      margin-left: 24px;
    }

    .select_btn {
      display: flex;
      align-items: center;
    }

    .publish_btn {
      width: 128px;
      height: 64px;
      background: #4b7aff;
      border-radius: 44px;
      // position: fixed;
      // top: calc(50% - 64px);
      // right: 32px;
      font-size: 28px;
      line-height: 64px;
      color: #fff;
      text-align: center;
    }

    .topic_btn {
      // position: fixed;
      // top: calc(50% - 64px);
      // left: 32px;
      width: 198px;
      height: 64px;
      background-color: #f2f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 44px;

      &_label {
        font-size: 26px;
        line-height: 64px;
        color: #4b7aff;
      }

      img {
        width: 36px;
        margin-right: 8px;
      }
    }
  }

  .block {
    width: 686px;
    height: 100px;
    text-align: center;
    font-size: 50px;
    color: rgb(25, 137, 250);
  }

  .pub-container {
    text-align: left;
    background-color: #f0f2f7;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    height: 100vh;
  }

  .videoBox {
    position: relative;
    width: 100%;
    color: #fff;

    .play_box {
      position: absolute;
      z-index: 99;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      width: 88px;
      height: 88px;
      margin: auto;
      border-radius: 50%;

      img {
        width: 88px;
        height: 88px;
      }
    }

    .file-remove {
      z-index: 99;
      bottom: 0;
      right: 20px;
      top: 20px;
      position: absolute;
      width: 46px;
      height: 46px;
    }

    .video_poster {
      position: relative;
      z-index: 98;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;

      img {
        width: 686px;
        min-height: 400px;
        max-height: 500px;
        object-fit: contain;
        border: 1px solid #ddd;
        border-radius: 20px;
        background-color: #000;
      }
    }
  }

  .content {
    background-color: #fff;
    // min-height: calc(100vh - 220px);
    height: 100vh;
    margin-top: 20px;
    padding: 32px 32px 0 32px;

    overflow-y: scroll;
    position: relative;

    &-input {
      position: relative;
    }

    &-file {
      margin-top: 40px;
      // padding-left: 32px;
      // padding-right: 32px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;

      &-space {
        width: 220px;
        height: 1px;
      }

      &-item {
        width: 220px;
        height: 220px;
        overflow: hidden;
        position: relative;
        margin-bottom: 12px;

        .file-img {
          width: 220px;
          height: 220px;
          object-fit: cover;
        }

        .file-remove {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 46px;
          height: 46px;
        }
      }

      &-select {
        width: 220px;
        height: 220px;
        background-color: #f2f4f8;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;

        img {
          width: 66px;
          height: 66px;
        }
      }
    }
  }

  .keyboard {
    position: fixed;
    height: 72px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding-left: 32px;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 2px solid #f0f2f7;
    z-index: 1000;

    img {
      width: 48px;
      margin-right: 60px;
    }
  }

  .noCover {
    width: 750px;
    height: auto;
  }
</style>
<style scoped>
  .pub-container >>> .vjs-poster {
    border-radius: 0.16rem !important;
  }

  .pub-container >>> .vjs-tech {
    border-radius: 0.16rem !important;
  }

  .pub-container >>> .video-js {
    border-radius: 0.16rem !important;
  }

  .pub-container >>> .active-title {
    font-size: 32px;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    line-height: 40px;
    color: #4b7aff;
    background-color: #fff;
  }

  .pub-container >>> .van-cell {
    padding: 0;
  }

  .pub-container >>> .van-field__control {
    font-size: 32px;
    line-height: 44px;
  }

  .pub-container >>> .van-field__label {
    width: 0;
    margin-right: 0;
  }

  .van-cell::after {
    border: 0 !important;
  }
</style>
