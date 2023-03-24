<template>
  <div class="dynamic-container">
    <!-- :immediate-check="false" -->
    <van-list
      v-model="loading"
      class="list-data"
      :finished="finished"
      :immediate-check="false"
      finished-text="没有更多了"
      @load="handleOnload"
    >
      <div class="user">
        <div class="user-box">
          <div class="user-box-logo">
            <img class="user-box-logo" :src="url" alt="" srcset="" />
          </div>
          <div class="user-box-name">
            {{ dynamicObj.userName }}
          </div>
        </div>
        <div class="user-writing">
          <span>{{ dynamicObj.content }}</span
          ><span @click="handleGoActiveDetail(dynamicObj)" class="user-writing-tag" v-if="dynamicObj.activityTitle"
            >@{{ dynamicObj.activityTitle }}</span
          >
          <span @click="handleGoTopicDetail(dynamicObj)" class="user-writing-tag" v-if="dynamicObj.topicTitle"
            >#{{ dynamicObj.topicTitle }}#</span
          >
        </div>
        <div
          v-if="dynamicObj.dynamicImgs && dynamicObj.dynamicImgs[0] && dynamicObj.dynamicImgs[0].flag == 'img'"
          :class="[
            dynamicObj.dynamicImgs.length == 1 ? 'img-box-1' : '',
            dynamicObj.dynamicImgs.length == 4 ? 'img-box-4' : '',
            dynamicObj.dynamicImgs.length != 1 && dynamicObj.dynamicImgs.length != 4 ? 'img-box' : ''
          ]"
        >
          <img
            v-for="(itemA, indexA) in dynamicObj.dynamicImgs"
            :key="indexA"
            @click="handleImage(dynamicObj.dynamicImgs, indexA)"
            :style="
              dynamicObj.dynamicImgs.length != 1 && dynamicObj.dynamicImgs.length != 4
                ? `width:${imgWidth}px;height:${imgWidth}px;margin-bottom:5px;`
                : ''
            "
            :src="itemA.url"
            alt=""
          />
          <span class="space"> </span>
          <span class="space"> </span>
        </div>

        <div v-if="imgArray.length && imgArray[0].flag == 'video'" class="user-material">
          <!-- <video :src="imgArray[0].url"></video> -->
          <div class="videoBox">
            <div class="play_box" v-if="showPlayBtn">
              <img @click="handlePlay" src="../../../assets/images/health/video_2.png" />
            </div>
            <div class="video_poster" v-if="posterVisible">
              <img v-if="imgArray[0].cover" :src="imgArray[0].cover" />
            </div>
            <video-player
              v-if="!posterVisible"
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              webkit-playsinline="true"
              x-webkit-airplay="true"
              playsinline
              :options="playerOptions"
            >
            </video-player>
          </div>
        </div>
        <div class="user-pushtime">{{ dynamicObj.dynamicTime }}</div>
      </div>
      <div class="remarks">
        <div class="remarks-title">
          评论<span class="remarks-count">（{{ total }}）</span>
        </div>

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
            <div class="thumbs_up_comment">
              <!-- 点赞 -->
              <img
                v-if="!item.isLike"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/thumbs_up.png"
                alt=""
                @click="commentLikeFn(item)"
                class="thumbs_up"
              />
              <img
                v-else
                @click="commentLikeCancelFn(item)"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/cancel_like.png"
                alt=""
                class="thumbs_up"
              />
              <span>{{ item.likeCount }}</span>
              <!-- 评论一级回复 -->
              <img
                class="comment"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/comment.png"
                alt=""
                @click="handleSecondComment(item)"
              />
            </div>
            <div class="reply_num" v-if="item.secondNum" @click="handleReplayNum(item)"
              >共{{ item.secondNum }}条回复></div
            >
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
          <div class="remark-praise-op" v-show="!show">
            <van-icon size="0.34rem" @click="handlePraise" v-if="!hasLike" color="#565961" name="good-job-o" />
            <van-icon size="0.34rem" @click="handleCancelPraise" v-else color="#4B7AFF" name="good-job" />
            <span class="remark-praise-count">{{ dynamicObj.likeCount }}</span>
          </div>
          <div v-show="show" @click="handleSubmit" class="remark-submit">发表</div>
        </div>
      </div>

      <!-- <van-overlay :show="show" @click="show = false" /> -->
    </van-list>

    <!-- 二级回复 -->
    <van-popup
      v-model="showReplay"
      position="bottom"
      round
      class="van_popup"
      :style="{ maxHeight: '80%' }"
      @close="handlePopupClose"
    >
      <secondComment
        :replayObj="replayObj"
        v-if="showReplay"
        @toParentPamas="toParentPamas"
        :dynamicId="dynamicId"
        :commMemberCode="commMemberCode"
        :dynamicObj="dynamicObj"
        ref="secondCommentRef"
      ></secondComment>
    </van-popup>
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
  import secondComment from "./components/secondComment.vue";
  import throttle from "lodash.throttle";
  export default {
    name: "dynamicDetails",
    data() {
      return {
        url: "",
        inputValue: "",
        show: false,
        focus: false,
        dynamicObj: {},
        imgArray: [],
        commentsData: [],
        total: 0,
        totalSecond: 0,
        hasLike: false,
        placeHolder: "输入你想说的话",
        loading: false,
        finished: false,
        commentsParams: {
          pageIndex: 1,
          pageSize: 10,
          checkStatus: 1
        },
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
        },
        showReplay: false,
        replayObj: {},
        replayObjBak: {},
        twoReplayShow: false,
        inputValueReplay: "",
        dynamicId: "", //动态id
        commMemberCode: "", //动态发布人memberCode
        hasLikeSecond: false
      };
    },
    components: { secondComment },
    filter: {
      getMoment
    },
    created() {
      this.dynamicId = this.$route.query.id;
      this.commMemberCode = this.$route.query.memberCode;
    },
    methods: {
      toParentPamas(e) {
        this.showReplay = e.poupeShow;
        // 获取子组件页面的数据，更新父组件页面的评论条数
        let replayObj = e.replayObj;
        let commentsData = this.commentsData;
        commentsData.forEach(item => {
          if (item.id == replayObj.id) {
            item.secondNum = replayObj.secondNum;
          }
        });
        this.commentsData = [...commentsData];
        // 关闭之后清空选中的回复那条数据，使得回复不是二级回复而是一级回复
        this.replayObj = {};
      },
      handlePopupClose() {
        this.replayObj = {};
        this.showReplay = false;
      },
      // 新增二级评论
      activitysecondcommentInsertFn() {
        console.log(this.replayObj, "发表二级评论");
        let params = {
          content: this.inputValue, //评论内容
          dynamicId: this.dynamicId, //动态id
          commentId: this.replayObj.id, //一级评论id
          memberCode: localStorage.getItem("memberCode"), //用户memberCode
          memberId: localStorage.getItem("memberId"), //用户memberId
          commMemberCode: this.commMemberCode, //动态发布人memberCode
          firstMemberCode: this.replayObj.memberCode //一级评论人memberCode
        };
        activitysecondcommentInsert(params)
          .then(res => {
            if (res.code == 0) {
              // 改变页面展示的回复条数
              let commentsData = this.commentsData;
              commentsData.forEach(item => {
                if (item.id == this.replayObjBak.id) {
                  item.secondNum += 1;
                }
              });
              this.commentsData = [...commentsData];
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
        this.replayObjBak = e;
        this.show = true;
        this.$refs.input.focus();
        this.placeHolder = "输入你想说的话";
      },
      handleReplayNum(e) {
        console.log(this.dynamicObj, "11111");
        this.replayObj = e;
        this.showReplay = true;
        // 查询二级评论数据
        this.$nextTick(() => {
          this.$refs.secondCommentRef.activitysecondcommentPageFn();
        });
      },
      handlePopupClose() {
        this.show = false;
        this.showReplay = false;
        this.placeHolder = "输入你想说的话";
        this.inputValue = "";
        setTimeout(() => {
          this.replayObj = {};
        }, 100);
      },
      handleGoActiveDetail(item) {
        this.$router.push({
          name: "activityDetail",
          query: {
            id: item.activityId,
            source: this.$route.name
          }
        });
      },
      handleGoTopicDetail(item) {
        this.$router.push({
          name: "topicDetail",
          query: {
            topicId: item.topicId
          }
        });
      },
      handlePlay() {
        this.posterVisible = false;
        this.showPlayBtn = false;
        setTimeout(() => {
          this.$refs.videoPlayer.player.play();
        }, 1000);
      },
      handleOnload() {
        console.log("加载更改xx");

        this.commentsParams.pageIndex += 1;
        this.getUserComments();
      },
      handleSubmit() {
        if (Object.keys(this.replayObj).length) {
          this.activitysecondcommentInsertFn();
        } else {
          this.handleCommit();
        }
      },
      // 点击二级评论图标
      handleCommentReplay() {
        this.$nextTick(() => {
          this.placeHolder = "输入你想说的话";
        });
      },
      handleCommit() {
        this.zgStatistics("健康新奥-健康活动-活动动态-点击发表评论按钮", {
          活动名称: this.dynamicObj.activityTitle
        });
        let params = {
          content: this.inputValue,
          dynamicId: this.dynamicObj.id,
          memberCode: localStorage.getItem("memberCode"),
          commMemberCode: this.dynamicObj.memberCode
        };
        commentInsert(params)
          .then(res => {
            if (res.code == 0) {
              this.commentsParams.pageIndex = 1;
              this.commentsData = [];
              this.getUserComments();
              this.inputValue = "";
            } else {
              this.$toast(res.message);
            }
          })
          .catch(res => {
            console.log("评论失败");
          });
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
          // 把点击过一级评论按钮的数据清空
          this.replayObj = {};
          this.inputValue = "";
        }, 100);
      },

      getDyanamics(id) {
        getDyanamics({ id, memberCode: localStorage.getItem("memberCode") })
          .then(res => {
            const { dynamicImgs, userHeadUrl, isLike } = res.data;
            this.dynamicObj = res.data;
            this.url = userHeadUrl;
            this.imgArray = dynamicImgs ? dynamicImgs : [];
            this.hasLike = isLike;
            if (this.imgArray.length && this.imgArray[0].cover) {
              this.imgArray[0].cover = this.imgArray[0].cover.replace("Expires", "none");
              this.playerOptions.sources[0].src = dynamicImgs[0].url.replace("Expires", "none");
            }
            // this.zgStatistics('健康新奥-健康活动-进入活动详情', { 活动名称: this.dynamicObj.activityTitle, 来源: checkSource(this.$route.query.source) })
          })
          .catch(err => {
            console.log(err, "err,");
          });
      },

      handleImage(e, indexA) {
        let imgArr = [];
        e.forEach(item => {
          imgArr.push(item.url);
        });
        // 预览图片
        ImagePreview({
          images: imgArr,
          closeable: true,
          "show-indicators": true,
          startPosition: indexA
        });
      },
      getUserComments() {
        // this.loading = true
        getUserComments(this.commentsParams).then(({ code, data, page }) => {
          this.loading = false;
          if (code == 0) {
            if (data.length) {
              this.commentsData = [...this.commentsData, ...data];
              this.total = page.total;
            } else {
              this.loading = true;
              this.finished = true;
            }

            // if (this.commentsData.length == page.total) {
            //     this.finished = true
            // }
            // this.loading = true
          }
        });
      },
      handleCancelPraise() {
        this.zgStatistics("健康新奥-健康活动-活动动态-互动情况-点击互动按钮", {
          来源: "动态详情",
          按钮名称: "取消点赞",
          互动目标ID: this.dynamicObj.memberCode,
          活动名称: this.dynamicObj.activityTitle
        });
        // 如果e存在则是一级评论取消点赞
        let params = {
          likeType: 1,
          likeId: this.dynamicObj.id,
          memberCode: localStorage.getItem("memberCode")
        };
        realDelete(params).then(res => {
          if (res) {
            this.dynamicObj.likeCount -= 1;
            this.hasLike = false;
          }
        });
      },
      handlePraise() {
        this.zgStatistics("健康新奥-健康活动-活动动态-互动情况-点击互动按钮", {
          来源: "动态详情",
          按钮名称: "点赞",
          互动目标ID: this.dynamicObj.memberCode,
          活动名称: this.dynamicObj.activityTitle
        });
        let params = {
          likeType: 1,
          likeId: this.dynamicObj.id,
          memberCode: localStorage.getItem("memberCode"),
          likeMemberCode: this.dynamicObj.memberCode
        };
        likeInsert(params).then(res => {
          if (res.code == 0) {
            this.dynamicObj.likeCount += 1;
            this.hasLike = true;
          }
        });
      },
      // 评论点赞
      commentLikeFn: throttle(function (e) {
        // 如果e有数据则是给一级评论点赞
        let params = {
          likeType: 3,
          likeId: e.id,
          memberCode: localStorage.getItem("memberCode"),
          likeMemberCode: e.memberCode
        };
        likeInsert(params).then(res => {
          if (res.code == 0) {
            let commentsData = this.commentsData;
            commentsData.forEach(item => {
              if (item.id == e.id) {
                item.isLike = 1;
                item.likeCount = item.likeCount + 1;
              }
            });
            this.commentsData = [...commentsData];
          }
        });
      }, 300),
      // 评论取消点赞
      commentLikeCancelFn: throttle(function (e) {
        // 如果e存在则是一级评论取消点赞
        let params = {
          likeType: 3,
          likeId: e.id,
          memberCode: localStorage.getItem("memberCode")
        };
        realDelete(params).then(res => {
          if (res.code == 0) {
            let commentsData = this.commentsData;
            commentsData.forEach(item => {
              if (item.id == e.id) {
                item.isLike = 0;
                item.likeCount = item.likeCount - 1;
              }
            });
            this.commentsData = [...commentsData];
          }
        });
      }, 300)
    },
    mounted() {
      window.addEventListener("scroll", this.handleScroll);
      this.getDyanamics(this.$route.query.id);

      this.commentsParams.dynamicId = this.$route.query.id;
      this.getUserComments();
      if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        // require("@/assets/less/scroll.less");
        import("@/assets/less/scroll.css");
      }
      setTimeout(() => {
        if (document.querySelector(".img-box")) {
          this.imgWidth = (document.querySelector(".img-box").offsetWidth - 10) / 3;
        }
      }, 500);
    }
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

  .dynamic-container {
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
  .van_popup {
    padding-bottom: 120px;

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
