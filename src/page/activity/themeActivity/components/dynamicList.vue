<!--
 * @Author: yanghaifengb yanghaifengb@enn.cn
 * @Date: 2022-06-28 14:01:49
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-04-07 10:37:07
 * @FilePath: \lk-xinaohealth-h5\src\page\activity\themeActivity\components\dynamicList.vue
 * @Description: 活动列表组件
-->

<script>
  import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    ref,
    nextTick,
    onUnmounted,
    watch
  } from "@vue/composition-api";
  // import { formatVideoTime } from "@/utils/commonFun";
  import { Toast, Swipe, SwipeItem, Field, ImagePreview, PullRefresh, List } from "vant";
  import { getMoment } from "@/utils/filter.js";
  import playerOptions from "@/utils/playerOptions";
  import { queryExerciseWorkJobList } from "@/service/health/index";
  import { checkSource } from "@/utils/ZGdictionary";
  import throttle from "lodash.throttle";
  import {
    activityinfo,
    getDynamicList,
    getUserComm,
    likeInsert,
    realDelete,
    commentInsert,
    activityDetail
  } from "@/service/activity";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  import { isIcomePC } from "@/utils/native/deviceEnv";
  import { jsBridge } from "@/utils/native/jsBridge";

  import { useUserStore, storeToRefs } from "@/pinia";

  // import UserInfo from './components/UserInfo'
  // import intro from '@/utils/intro'
  export default defineComponent({
    components: {
      // UserInfo
    },
    props: {
      orderFlag: {
        type: String,
        default: "gmtCreate"
      },
      activityId: {
        type: Number,
        default: null
      },
      from: {
        type: String,
        default: null
      },
      userFlag: {
        type: Number,
        default: 0
      },
      checkStatus: {
        type: Number,
        default: 0
      },
      hidenPhoto: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      topicId: "",
      titleActive: {
        type: String,
        default: "healthTrends"
      }
    },
    emits: ["refresh"],
    setup(props, context) {
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const fieldInput = ref(null);
      const refs = context.refs;
      const state = reactive({
        dynamicData: [],
        pageIndex: 1,
        pageSize: 5,
        inputText: "",
        showField: false,
        previewImage: [],
        playerOptions,
        showPlay: false,
        isFullscreen: undefined,
        likeType: 1,
        itemData: {},
        timer: null,
        loading: false,
        finished: false,
        getListType: "onLoad", // onLoad 追加数据，update 更新数据
        likeData: {},
        getMoment: getMoment,
        show: true,
        imgWidth: 0,
        actionLoading: false,
        dynamicIds: []
      });

      const init = () => {
        // 动态列表
        if (state.actionLoading == false) {
          getDynamicListFn();
        }
      };
      const getDataList = () => {
        // 动态列表
        state.dynamicData = [];
        state.dynamicIds = [];
        state.pageIndex = 1;
        if (state.actionLoading == false) {
          getDynamicListFn();
        }
      };
      // 点赞
      const likeInsertFn = throttle(function (e, index) {
        zgStatistics("健康新奥-健康活动-活动动态-互动情况-点击互动按钮", {
          来源: checkSource(route.value.name),
          按钮名称: "点赞",
          互动目标ID: e.memberCode,
          活动名称: e.activityTitle
        });

        state.likeData = e;
        let params = {
          likeType: state.likeType, //点赞
          likeId: e.id,
          memberCode: userInfo.value.memberCode,
          likeMemberCode: e.memberCode
        };
        likeInsert(params).then(({ code, data, message }) => {
          if (code === 0) {
            // context.emit('refresh')
            state.dynamicData[index].isLike = 1;
            state.dynamicData[index].likeCount += 1;
          } else {
            Toast(message);
          }
        });
      }, 300);

      // 取消点赞
      const realDeleteFn = throttle(function (e, index) {
        state.likeData = e;
        zgStatistics("健康新奥-健康活动-活动动态-互动情况-点击互动按钮", {
          来源: checkSource(route.value.name),
          按钮名称: "取消点赞",
          互动目标ID: e.memberCode,
          活动名称: e.activityTitle
        });

        let params = {
          likeType: state.likeType,
          likeId: e.id,
          memberCode: userInfo.value.memberCode
        };
        realDelete(params).then(({ code, data, message }) => {
          if (code === 0) {
            context.emit("refresh");
            state.dynamicData[index].isLike = 0;
            state.dynamicData[index].likeCount -= 1;
            // getDynamicListOneFn();
          } else {
            Toast(message);
          }
        });
      }, 300);

      // 评论
      const commentInsertFn = e => {
        state.likeData = e;
        let params = {
          content: state.inputText, //评论内容
          dynamicId: state.itemData.id,
          memberCode: userInfo.value.memberCode,
          commMemberCode: state.itemData.memberCode
        };
        commentInsert(params).then(({ code, data, message }) => {
          if (code === 0) {
            getDynamicListOneFn();
          } else {
            Toast(message);
          }
        });
      };

      // 动态列表
      const getDynamicListFn = () => {
        let params = {
          pageIndex: state.pageIndex,
          pageSize: state.pageSize,
          status: 1,
          orderFlag: props.orderFlag,
          memberCode: userInfo.value.memberCode,
          userFlag: props.userFlag
        };
        console.log(route, "route");
        if (props.titleActive == "healthTrends") {
          params.isEventClocking = 0;
        } else {
          params.isEventClocking = 1;
        }
        if (route.value.name == "activityDetail" || route.value.name == "topicDetail") {
          delete params.isEventClocking;
        }
        if (props.userFlag == 1) {
          params.checkStatus = null;
        } else {
          params.checkStatus = 1;
        }
        props.from == "activityDetail" ? (params.activityId = props.activityId) : "";
        state.actionLoading = true;
        if (route.value.query.topicId) {
          params.topicId = route.value.query.topicId;
        }
        getDynamicList(params)
          .then(({ code, data, message, page }) => {
            context.emit("loaded");
            if (code === 0) {
              // 如果是触底加载push数据,初次加载逻辑和触底一样
              //获取新的数据的,
              // 遍历id，取到无重复的数据
              for (let i = 0; i < data.length; i++) {
                try {
                  data[i].topicJson = JSON.parse(data[i].topicJson);
                } catch (error) {}

                let dynamicData = data[i].dynamicImgs;
                if (dynamicData && dynamicData.length && dynamicData[0].flag == "video") {
                  dynamicData.forEach(item => {
                    item.url = item.url.replace("Expires=", "none");
                    item.cover = item.cover.replace("Expires=", "none");
                  });
                } else {
                  dynamicData.forEach(item => {
                    if (item.url) {
                      item.url = item.url.split("?")[0] + "?x-oss-process=style/zip-30";
                    }
                    if (item.cover) {
                      item.cover = item.cover.split("?")[0] + "?x-oss-process=style/zip-30";
                    }
                  });
                }
              }

              let filteredData = data.filter(item => {
                return !state.dynamicIds.includes(item.id);
              });
              let tempData = [];

              if (filteredData.length) {
                tempData = state.dynamicData.concat(data);
                //
              }
              if (data.length && filteredData.length == 0) {
                // 判断如果过滤后的数据是空数组，并且data不是空数组，那么再去发起请求下一页
                context.onLoad();
              }
              state.dynamicData = tempData;
              // 获取最后10条数据的id数组
              let last10Ids = state.dynamicData.slice(-5).map(item => item.id);
              state.dynamicIds = last10Ids;
              if (state.dynamicData.length == 0) {
                context.emit("noData");
              }
              state.loading = false;
              state.actionLoading = false;
              if (state.dynamicData.length == page.total) {
                state.finished = true;
              }

              console.log(state.dynamicData, "dd");
            } else {
              console.log("getDynamicList", message);
              // Toast(message);
            }
          })
          .catch(() => {
            context.emit("loaded");
            state.loading = false;
            state.actionLoading = false;
          });
      };

      // 获取一条动态列表  点赞 取消点赞 评论时候只查询一条

      const getDynamicListOneFn = e => {
        let params = {
          pageIndex: 1,
          pageSize: 5,
          status: 1,
          orderFlag: props.orderFlag,
          memberCode: userInfo.value.memberCode,
          userFlag: props.userFlag,
          id: state.likeData.id
        };
        // 点赞 取消点赞 评论时候只查询一条
        if (e == "oneList") {
          params.id = state.likeData.id;
        }
        if (props.userFlag == 1) {
          params.checkStatus = null;
        } else {
          params.checkStatus = 1;
        }
        getDynamicList(params).then(({ code, data, message, page }) => {
          if (code === 0) {
            // 点赞数据
            let likeData = state.likeData;
            // 原始值
            let dynamicData = state.dynamicData;
            // 更新的项目值
            let newItemArr = data.filter(item => {
              return item.id == likeData.id;
            })[0];
            // 更新的index
            let updateIndex;
            for (let index = 0; index < dynamicData.length; index++) {
              const element = dynamicData[index];
              if (element.id == likeData.id) {
                updateIndex = index;
                break;
              }
            }
            // 更新原数组
            dynamicData.splice(updateIndex, 1, newItemArr);
            state.dynamicData = dynamicData;
          } else {
            console.log("getDynamicList", message);
            // Toast(message);
          }
        });
      };

      // 获取焦点
      const getFocus = e => {
        state.itemData = e;
        state.showField = true;
        nextTick(() => {
          fieldInput.value.focus();
        });
      };
      const goDetail = (data, type) => {
        if (type == "btn") {
          zgStatistics("健康新奥-健康活动-活动动态-互动情况-点击互动按钮", {
            来源: checkSource(route.value.name),
            按钮名称: "评论",
            互动目标ID: data.memberCode,
            活动名称: data.activityTitle
          });
        } else {
          zgStatistics("健康新奥-健康活动-活动动态-点击最新动态", {
            来源: checkSource(route.value.name),
            活动名称: data.activityTitle
          });
        }

        router.push({
          name: "dynamicDetail",
          query: Object.assign(route.value.query, {
            id: data.id,
            source: route.value.name,
            memberCode: data.memberCode
          })
        });
      };
      // 失去焦点
      const blurHandle = () => {
        setTimeout(() => {
          state.showField = false;
          state.inputText = "";
        }, 50);
      };

      // 预览图片
      const handleImage = (e, indexA) => {
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
      };

      const onLoad = () => {
        state.pageIndex = state.pageIndex + 1;
        state.getListType = "onLoad";
        init();
      };

      const onPlay = url => {
        state.playerOptions.sources[0].src = url;
        state.showPlay = true;
        // 延迟1s留出组件加载及视频加载时间
        state.timer = setTimeout(() => {
          refs.videoPlayer.player.play();
        }, 1000);
      };
      const goPublish = () => {
        zgStatistics("健康新奥-健康活动-活动动态-点击发布按钮", {
          来源: checkSource(route.value.name)
        });
        let queryObj = {};
        if (route.value.name !== "themeActivityHome" && route.value.name !== "myUpdates") {
          queryObj = Object.assign(
            {
              name: encodeURIComponent(props.title),
              from: route.value.name
            },
            route.value.query
          );
        } else {
          queryObj = Object.assign(
            {
              from: route.value.name
            },
            {
              ticket: route.value.query.ticket
            }
          );
        }
        router.push({
          name: "publish",
          query: queryObj
        });
      };
      const handleGoRank = item => {
        zgStatistics("健康新奥-健康活动-活动动态-点击动态打卡", {
          活动名称: item.activityTitle
        });
        router.push({
          name: "rankListActivity",
          query: {
            id: item.activityId
          }
        });
      };
      const handleGoActiveDetail = async item => {
        // 如果在活动或者话题详情页面不跳转，防止来回跳转
        if (route.value.name == "activityDetail" || route.value.name == "topicDetail") {
          return;
        }
        let status = await getDyanamicsFn(item.activityId);
        if (status == 1) {
          router.push({
            name: "activityDetail",
            query: {
              id: item.activityId,
              source: route.value.name
            }
          });
        } else if (status == 2) {
          Toast("这个活动下架了哟，快去看看新活动！");
        } else if (status == 0) {
          Toast("这个活动被删除了哟，快去看看新活动！");
        }
      };
      const handleGoTopicDetail = item => {
        // 如果在活动或者话题详情页面不跳转，防止来回跳转
        if (route.value.name == "activityDetail" || route.value.name == "topicDetail") {
          return;
        }
        router.push({
          name: "topicDetail",
          query: {
            topicId: item.id,
            source: route.value.name
          }
        });
      };
      const getDyanamicsFn = id => {
        return new Promise((resolve, reject) => {
          activityDetail({
            id,
            memberCode: userInfo.value.memberCode
          }).then(res => {
            const { status } = res.data;
            resolve(status);
          });
        });
      };
      // 视频
      const onPlayerTimeupdate = player => {
        if (isIcomePC) {
          // isFullscreen_: 未点击undefined 点击全屏true 关闭全屏false
          if (player.player_.isFullscreen_ === state.isFullscreen) return;
          // 避免函数多次调用
          state.isFullscreen = player.player_.isFullscreen_;
          // 点击全屏
          if (player.player_.isFullscreen_ === true) {
            // 静音
            document.getElementsByTagName("video")[0].muted = true;
            jsBridge.invoke("openModal", { url: state.playerOptions.sources[0].src });
            // 关闭全屏
          } else if (player.player_.isFullscreen_ === false) {
            // 恢复声音
            document.getElementsByTagName("video")[0].muted = false;
          }
        }
      };

      const initData = () => {
        state.pageIndex = 1;
        state.dynamicData = [];
        state.dynamicIds = [];
      };
      const goActiveHome = () => {
        router.push({
          name: "themeActivityHome",
          query: route.value.query
        });
      };
      watch(
        () => [props.titleActive, props.orderFlag],
        ([], []) => {
          initData();
          // 初始化参数
          state.getListType = "update";
          state.finished = false;
          getDynamicListFn();
        }
      );

      onMounted(() => {
        // init("onLoad");
        getDataList();
        if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          // require("@/assets/less/scroll.less");
          import("@/assets/less/scroll.css");
        }
        setTimeout(() => {
          if (document.querySelector(".dynamic")) {
            state.imgWidth = (document.querySelector(".dynamic").offsetWidth - 30) / 3;
          }
        }, 500);
      });

      onUnmounted(() => {
        clearTimeout(state.timer);
      });

      return {
        ...toRefs(state),
        fieldInput,
        getFocus,
        goPublish,
        handleGoRank,
        handleGoActiveDetail,
        goDetail,
        blurHandle,
        handleImage,
        onPlayerTimeupdate,
        onPlay,
        likeInsertFn,
        realDeleteFn,
        getDynamicListFn,
        commentInsertFn,
        init,
        onLoad,
        initData,
        getDynamicListOneFn,
        goActiveHome,
        route,
        getDataList,
        handleGoTopicDetail
      };
    }
  });
</script>

<template>
  <div class="containter">
    <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad" :immediate-check="false">
      <!-- 动态 -->
      <div class="dynamic">
        <!-- 动态内容 -->
        <template v-if="dynamicData && dynamicData.length">
          <div v-for="(item, index) in dynamicData" class="dynamic-box" :key="index">
            <!-- 个人信息 -->
            <div class="personal-info">
              <div class="portrait-name">
                <img :src="item.userHeadUrl" alt="" />
                <span>{{ item.userName }}</span>
              </div>
              <div v-if="item.activityId !== 0" @click="handleGoRank(item)" class="dtdk">
                <span>{{ item.clockCount }}</span>
                <span>次动态打卡</span>
                <img
                  src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/right_arrow.png"
                  alt=""
                />
              </div>
            </div>
            <!-- 话语 -->
            <div class="word-text">
              {{ item.content }}
              <span @click="handleGoActiveDetail(item)" v-if="item.activityTitle">@{{ item.activityTitle }}</span>
              <span
                style="margin-right: 4px"
                v-for="itemIn in item.topicJson"
                @click="handleGoTopicDetail(itemIn)"
                v-if="item.topicJson.length"
                >#{{ itemIn.title }}#</span
              >
            </div>
            <!-- 图片 视频 音频 -->
            <div
              v-if="item.dynamicImgs && item.dynamicImgs[0] && item.dynamicImgs[0].flag == 'img'"
              :class="[
                item.dynamicImgs.length == 1 ? 'img-box-1' : '',
                item.dynamicImgs.length == 4 ? 'img-box-4' : '',
                item.dynamicImgs.length != 1 && item.dynamicImgs.length != 4 ? 'img-box' : ''
              ]"
            >
              <!-- <span> -->
              <img
                v-for="(itemA, indexA) in item.dynamicImgs"
                :key="indexA"
                :style="
                  item.dynamicImgs.length != 1 && item.dynamicImgs.length != 4
                    ? `width:${imgWidth}px;height:${imgWidth}px;margin-bottom:5px;`
                    : ''
                "
                @click="handleImage(item.dynamicImgs, indexA)"
                :src="itemA.url"
                alt=""
              />

              <!-- </span> -->
              <span class="space"> </span>
              <span :style="`width:${imgWidth}px`" class="space"> </span>
            </div>
            <div
              v-if="item.dynamicImgs && item.dynamicImgs[0] && item.dynamicImgs[0].flag == 'video'"
              class="video-box"
            >
              <img :src="item.dynamicImgs[0].cover" alt="" />
              <img
                class="play_btn"
                @click="onPlay(item.dynamicImgs[0].url)"
                src="../../../../assets/images/health/video_2.png"
              />
            </div>
            <!-- 互动信息 -->
            <div class="interaction-info">
              <span class="time">{{ getMoment(item.gmtCreate) }}</span>
              <div v-if="item.checkStatus == 1" class="zan-comment">
                <span class="zan">
                  <img
                    @click="realDeleteFn(item, index)"
                    v-if="item.isLike"
                    src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/thumbs_active.png"
                    alt=""
                  />
                  <img
                    @click="likeInsertFn(item, index)"
                    v-else
                    src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/thumbs.png"
                    alt=""
                  />

                  <span>{{ item.likeCount }}</span>
                </span>
                <span class="comment" @click="goDetail(item, 'btn')">
                  <img
                    src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/comment.png"
                    alt=""
                  />
                  <span v-if="item.commentCount">{{ item.commentCount }}</span>
                  <span v-else>评论</span>
                </span>
              </div>
            </div>
            <!-- 评论信息 -->
            <div @click="goDetail(item, 'comment')" v-if="item.commContent" class="comment-text">
              {{ item.commName }}：{{ item.commContent }}
            </div>
            <!-- 审核信息 -->
            <div class="warning-info tip-info" v-if="item.checkStatus == 2"
              >经审核，您发布的内容不合规，请重新发布>></div
            >
            <div class="orange-info tip-info" v-if="item.checkStatus == 0">内容未审核，请稍候>></div>
            <div class="blue-info tip-info" v-if="item.checkStatus == 3">内容审核中，请稍候>></div>
          </div>
        </template>
        <!-- <div>{{ route.name }}</div> -->
        <div v-if="route.name == 'myUpdates' && dynamicData.length == 0" class="dynamic-none">
          <div class="no-tip">您还没有发布过动态哦！！！</div>
          <button class="common-btn fix-btn" @click="goActiveHome">立即发布</button>
        </div>
      </div>
      <div class="input-box" v-show="showField">
        <van-field
          class="field"
          :clearable="true"
          :center="true"
          v-model="inputText"
          ref="fieldInput"
          @blur="blurHandle"
        />
        <span @click="commentInsertFn">发表</span>
      </div>
    </van-list>

    <!-- 播放视频 -->
    <van-popup style="width: 100%" v-model="showPlay" closeable>
      <video-player
        v-if="showPlay"
        class="video-player"
        ref="videoPlayer"
        :webkit-playsinline="true"
        :x-webkit-airplay="true"
        :playsinline="true"
        :options="playerOptions"
        @timeupdate="onPlayerTimeupdate($event)"
      >
      </video-player>
    </van-popup>

    <!-- <div
      @click="goPublish"
      :class="[
        'photo-btn',
        from == 'activityDetail' ? 'activity-detail-photo' : '',
      ]"
      v-if="!hidenPhoto"
    >
      <img
        src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/photo.png"
        alt=""
      />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
  @import "./dynamicList.scss";
  @import "../../../../assets/less/btn.css";
</style>
<style lang="scss" scoped>
  .no-tip {
    font-size: 28px;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bbb;
  }
</style>
