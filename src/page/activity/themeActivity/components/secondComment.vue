<template>
  <div class="dynamic-container-second">
    <van-list
      v-model="loading"
      class="list-data"
      :finished="finished"
      :immediate-check="false"
      finished-text="没有更多了"
      @load="handleOnload"
    >
      <div class="replay_num_title">
        回复（{{ total }}）
        <!-- 关闭弹窗 -->
        <img
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/close_icon.png"
          alt=""
          @click="handlePopupClose"
        />
      </div>
      <div class="remarks-content self-content">
        <div class="remarks-content-left">
          <!-- 头像 -->
          <img class="remarks-content-left-image" :src="replayObj.userHeadUrl" alt="" srcset="" />
        </div>
        <div class="remarks-content-right">
          <div class="remarks-content-right-nickname">
            {{ replayObj.userName }}
          </div>
          <div class="remarks-content-right-time">
            {{ replayObj.commTime }}
          </div>
          <div class="remarks-content-right-writing">
            {{ replayObj.content }}
          </div>
          <div class="thumbs_up_comment">
            <!-- 点赞 -->
            <img
              v-if="!replayObj.isLike"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/thumbs_up.png"
              alt=""
              @click="commentLikeFn(replayObj)"
              class="thumbs_up"
            />
            <img
              v-else
              @click="commentLikeCancelFn(replayObj)"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/cancel_like.png"
              alt=""
              class="thumbs_up"
            />
            <span>{{ replayObj.likeCount }}</span>
            <!-- 评论 -->
            <img
              class="comment"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/comment.png"
              alt=""
              @click="handleSecondComment(replayObj)"
            />
          </div>
        </div>
      </div>
      <div class="split_line"></div>
      <div class="other_replay">
        <div class="all_title">全部回复</div>
        <div v-for="(item, index) in commentsData" class="remarks-content">
          <div class="remarks-content-left">
            <img class="remarks-content-left-image" :src="item.userHeadUrl" alt="" srcset="" />
          </div>
          <div class="remarks-content-right">
            <div class="remarks-content-right-nickname">
              {{ item.userName }}
            </div>
            <div class="remarks-content-right-time">{{ item.commTime }}</div>
            <div class="remarks-content-right-writing">
              {{ item.content }}
            </div>
            <div class="line"></div>
          </div>
        </div>
      </div>
      <div class="remark">
        <div class="remark-input">
          <van-field
            maxlength="100"
            class="text-input"
            ref="input"
            @focus="handleFocus"
            @blur="handleBlur"
            v-model="inputValue"
            :placeholder="placeHolder"
          />
        </div>
        <div class="remark-praise">
          <div class="remark-praise-op" v-if="!show">
            <van-icon
              size="0.34rem"
              @click="commentLikeFn(replayObj)"
              v-if="!replayObj.isLike"
              yellow
              color="#565961"
              name="good-job-o"
            />
            <van-icon size="0.34rem" @click="commentLikeCancelFn(replayObj)" v-else color="#4B7AFF" name="good-job" />
            <span class="remark-praise-count">{{ replayObj.likeCount }}</span>
          </div>
          <div v-else @click="handleSubmit" class="remark-submit">发表</div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
  import {
    getDyanamics,
    getUserComments,
    commentInsert,
    likeInsert,
    realDelete,
    activityDetail,
    activitysecondcommentPage,
    activitysecondcommentInsert
  } from "@/service/activity";
  import { checkSource } from "@/utils/ZGdictionary";
  import { ImagePreview } from "vant";
  import { getMoment } from "@/utils/filter.js";
  import { Popup } from "vant";
  import { mapState, useUserStore } from "@/pinia";

  export default {
    name: "dynamicDetails",
    data() {
      return {
        url: "",
        inputValue: "",
        show: false,
        focus: false,
        imgArray: [],
        commentsData: [],
        total: 0,
        hasLike: false,
        placeHolder: "输入你想说的话",
        loading: false,
        finished: false,
        commentParams: { pageIndex: 1, pageSize: 10, checkStatus: 1 },
        posterVisible: true,
        showPlayBtn: true,
        imgWidth: 0,
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
        }
      };
    },
    filter: {
      getMoment
    },
    props: {
      replayObj: {},
      showReplay: false,
      dynamicId: "", //动态id
      commMemberCode: "",
      dynamicObj: {}
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    created() {},
    methods: {
      // 查询二级评论接口
      activitysecondcommentPageFn(e) {
        let params = {
          dynamicId: this.dynamicId, //动态id
          commentId: this.replayObj.id, //一级评论id
          pageSize: this.commentParams.pageSize,
          pageIndex: this.commentParams.pageIndex
        };
        activitysecondcommentPage(params).then(({ code, data, page }) => {
          this.loading = false;

          if (code == 0) {
            if (data.length) {
              if (e == "新增评论后查询") {
                let commentsData = this.commentsData;
                this.commentsData.unshift(data[0]);
              } else {
                this.commentsData = [...this.commentsData, ...data];
              }
              this.total = page.total;
              this.replayObj.secondNum = page.total;
            } else {
              this.loading = true;
              this.finished = true;
            }
          }
        });
      },
      // 新增二级评论
      activitysecondcommentInsertFn() {
        console.log(this.replayObj, "发表二级评论");
        let params = {
          content: this.inputValue, //评论内容
          dynamicId: this.dynamicId, //动态id
          commentId: this.replayObj.id, //一级评论id
          memberCode: localStorage.getItem("memberCode"), //用户memberCode
          memberId: this.userInfo.memberId, //用户memberId
          commMemberCode: this.commMemberCode, //动态发布人memberCode
          firstMemberCode: this.replayObj.memberCode //一级评论人memberCode
        };
        activitysecondcommentInsert(params)
          .then(res => {
            if (res.code == 0) {
              // 重新查询一下二级评论数据
              this.commentParams.pageIndex = 1;
              this.activitysecondcommentPageFn("新增评论后查询");
            } else {
              this.$toast(res.message);
            }
          })
          .catch(res => {
            console.log("评论失败");
          });
      },
      // 点击一级页面二级回复的按钮
      handleSecondComment(e) {
        this.replayObj = e;
        this.show = true;
        this.$refs.input.focus();
        this.placeHolder = "输入你想说的话";
      },
      handlePopupClose() {
        this.$emit("toParentPamas", {
          poupeShow: false,
          replayObj: this.replayObj
        });
      },
      handleOnload() {
        console.log("加载更改xx");
        this.commentParams.pageIndex += 1;
        this.activitysecondcommentPageFn();
      },
      handleSubmit() {
        this.activitysecondcommentInsertFn();
      },

      handleScroll() {
        if (this.focus && this.$refs && this.$refs.input) {
          this.$refs.input.blur();
          this.focus = false;
          this.show = false;
        }
      },
      handleFocus() {
        this.$nextTick(() => {
          this.show = true;
          this.placeHolder = "输入你想说的话";
        });
      },
      handleBlur() {
        setTimeout(() => {
          this.show = false;
          this.inputValue = "";
        }, 100);
      },

      // 评论点赞
      commentLikeFn(e) {
        // 如果e有数据则是给一级评论点赞
        let params = {
          likeType: 3,
          likeId: e.id,
          memberCode: localStorage.getItem("memberCode"),
          likeMemberCode: e.memberCode
        };
        likeInsert(params).then(res => {
          if (res.code == 0) {
            let replayObj = this.replayObj;
            replayObj.isLike = 1;
            replayObj.likeCount = replayObj.likeCount + 1;
            this.replayObj = replayObj;
          }
        });
      },
      // 评论取消点赞
      commentLikeCancelFn(e) {
        // 如果e存在则是一级评论取消点赞
        let params = {
          likeType: 3,
          likeId: e.id,
          memberCode: localStorage.getItem("memberCode")
        };
        realDelete(params).then(res => {
          if (res.code == 0) {
            let replayObj = this.replayObj;
            replayObj.isLike = 0;
            replayObj.likeCount = replayObj.likeCount - 1;
            this.replayObj = replayObj;
          }
        });
      }
    },
    mounted() {}
  };
</script>
<style scoped lang="scss">
  @mixin writing {
    font-size: 28px;
    line-height: 40px;
  }

  @mixin title {
    font-weight: 500;
    color: #1c1c1e;
    line-height: 40px;
  }

  .dynamic-container-second {
    background-color: #f0f2f7;
    // min-height: 100vh;
    text-align: left;

    // overflow: hidden;
    height: 100%;

    .user {
      background-color: #fff;
      padding: 26px 32px 32px 32px;

      &-box {
        display: flex;
        align-items: center;

        &-logo {
          width: 88px;
          height: 88px;
          border-radius: 44px;
          object-fit: cover;
        }

        &-name {
          font-size: 32px;
          font-weight: 500;
          color: #1c1c1e;
          line-height: 44px;
          margin-left: 24px;
        }
      }

      &-writing {
        text-align: left;
        margin: 24px 0;
        @include writing();
        color: #1c1c1e;

        &-tag {
          @include writing();
          color: #4b7aff;
        }
      }

      &-material {
        display: flex;
        overflow: hidden;

        &-image {
          width: 470px;
          height: 100%;
          border-radius: 16px;
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
      }

      &-pushtime {
        font-size: 26px;
        color: #abafba;
        line-height: 36px;
        margin-top: 24px;
      }
    }

    .remarks {
      margin-top: 20px;
      background-color: #fff;
      padding: 32px;
      // margin-bottom: 20vh;

      &-title {
        @include title();
        font-size: 28px;
      }

      &-cunt {
        @include title();
        font-size: 28px;
      }

      .remarks-content {
        display: flex;
        align-items: flex-start;
        margin-top: 24px;

        &:last-child {
          .remarks-content-right {
            .line {
              display: none;
            }
          }
        }

        .remarks-content-left {
          &-image {
            width: 64px;
            height: 64px;
            border-radius: 32px;
            object-fit: cover;
          }

          margin-right: 16px;
          display: flex;
        }

        .remarks-content-right {
          position: relative;
          flex: 1;

          &-nickname {
            font-size: 24px;
            font-weight: 500;
            color: #1c1c1e;
            line-height: 34px;
          }

          &-time {
            font-size: 24px;
            color: #9195a1;
            line-height: 34px;
            margin-bottom: 20px;
          }

          &-writing {
            font-size: 28px;
            color: #1c1c1e;
            line-height: 40px;
            margin-bottom: 20px;
          }
          .thumbs_up_comment {
            position: absolute;
            top: 8px;
            right: 0;
            display: flex;
            align-items: center;

            img {
              width: 32px;
              height: 32px;
            }
            .thumbs_up {
              margin-right: 8px;
            }
            span {
              margin-right: 56px;
              font-size: 24px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #abafba;
            }
          }
          .reply_num {
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4b7aff;
            padding: 10px 12px;
            background: #f2f4f8;
            border-radius: 8px;
            margin: 0 0 24px 0;
          }
          .line {
            width: 100%;
            height: 1px;
            background: #eeeeee;
          }
        }
      }
    }

    .logo-image {
    }

    .remark {
      height: 120px;
      padding: 24px 32px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      display: flex;
      align-items: center;
      z-index: 999;
      box-shadow: 0px -2px 10px 0px rgba(207, 207, 207, 0.25);

      &-input {
        width: 574px;
        height: 72px;
      }

      &-praise {
        display: flex;
        margin-left: 36px;
        align-items: center;

        &-op {
          display: flex;
          align-items: center;
        }

        &-count {
          font-size: 26px;
          color: #737782;
          margin-left: 10px;
          // line-height: 100px;
        }
      }

      &-submit {
        color: #4b7aff;
        font-size: 28px;
        color: #4b7aff;
        line-height: 40px;
      }
    }
  }
  // 二级回复的内容
  .replay_num_title {
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1e201e;
    margin-top: 32px;
    text-align: center;
    position: relative;
    img {
      width: 40px;
      height: 40px;
      position: absolute;
      right: 32px;
    }
  }
  .self-content {
    margin-top: 40px;
  }
  .split_line {
    width: 100%;
    height: 12px;
    background: #f0f2f7;
  }
  .all_title {
    font-size: 28px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1e201e;
    margin: 24px 0 32px 32px;
  }
  .remarks-content {
    display: flex;
    align-items: flex-start;
    padding: 0 32px 24px 32px;

    &:last-child {
      .remarks-content-right {
        .line {
          display: none;
        }
      }
    }

    .remarks-content-left {
      &-image {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        object-fit: cover;
      }

      margin-right: 16px;
      display: flex;
    }

    .remarks-content-right {
      position: relative;
      flex: 1;

      &-nickname {
        font-size: 24px;
        font-weight: 500;
        color: #1c1c1e;
        line-height: 34px;
      }

      &-time {
        font-size: 24px;
        color: #9195a1;
        line-height: 34px;
        margin-bottom: 20px;
      }

      &-writing {
        font-size: 28px;
        color: #1c1c1e;
        line-height: 40px;
      }
      .thumbs_up_comment {
        position: absolute;
        top: 8px;
        right: 0;
        display: flex;
        align-items: center;

        img {
          width: 32px;
          height: 32px;
        }
        .thumbs_up {
          margin-right: 8px;
        }
        span {
          margin-right: 56px;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #abafba;
        }
      }
      .reply_num {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4b7aff;
        padding: 10px 12px;
        background: #f2f4f8;
        border-radius: 8px;
        margin: 20px 0 24px 0;
      }
      .line {
        width: 100%;
        height: 1px;
        background: #eeeeee;
      }
    }
  }
  .other_replay {
    .remarks-content-right {
      .remarks-content-right-writing {
        margin-bottom: 24px;
      }
    }
  }
  .remark {
    height: 120px;
    padding: 24px 32px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    z-index: 999;
    box-shadow: 0px -2px 10px 0px rgba(207, 207, 207, 0.25);

    &-input {
      width: 574px;
      height: 72px;
    }

    &-praise {
      display: flex;
      margin-left: 36px;
      align-items: center;

      &-op {
        display: flex;
        align-items: center;
      }

      &-count {
        font-size: 26px;
        color: #737782;
        margin-left: 10px;
        // line-height: 100px;
      }
    }

    &-submit {
      color: #4b7aff;
      font-size: 28px;
      color: #4b7aff;
      line-height: 40px;
    }
  }

  .text-input {
    background-color: #f0f2f7;
    border-radius: 36px;
    height: 72px;
    box-sizing: border-box;

    // ::v-deep
  }

  .img-box {
    // display: grid;
    // grid-template-columns: repeat(3, 224px);
    // grid-template-rows: repeat(3, 224px);
    // grid-column-gap: 10px;
    // grid-row-gap: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;

    img {
      width: 215px;
      height: 215px;
      border-radius: 16px;
      object-fit: cover;
      // margin-bottom: 10px;
      // margin-right: 10px;
    }

    // justify-content: center;
  }

  .img-box-1 {
    width: 470px;
    height: 348px;
  }

  .img-box-4 {
    display: grid;
    grid-template-columns: repeat(2, 222px);
    grid-template-rows: repeat(2, 222px);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }

  .space {
    width: 222px;
    height: 1px;
  }

  .img-box-1,
  .img-box-4 {
    img {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      object-fit: cover;
    }
  }

  .list-data {
    // min-height: 100vh;
    background-color: #fff;
    height: 100%;
  }
</style>
<style scoped>
  .dynamic-container >>> .van-field__body {
    height: 36px !important;
    width: 100%;
  }

  .dynamic-container >>> .van-field__value {
    display: flex;
    align-items: center;
  }
</style>
