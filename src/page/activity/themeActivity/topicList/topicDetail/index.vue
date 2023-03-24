<!--
 * @Author: haifeng.yang haifeng.yang@amocorp.cn
 * @Date: 2022-06-27 11:25:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:34:45
 * @FilePath: \lk-xinaohealth-h5\src\page\activity\themeActivity\topicList\topicDetail\index.vue
 * @Description: 活动首页
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, onActivated, onDeactivated, ref } from "@vue/composition-api";
  import { Toast, Swipe, SwipeItem } from "vant";
  import {
    activityinfo,
    getDynamicList,
    getUserComm,
    likeInsert,
    realDelete,
    getListByHot,
    activitytopicinfoDetail
  } from "@/service/activity";
  import { checkSource } from "@/utils/ZGdictionary";
  import { isIosX } from "@/utils/isIosX";
  import Tips from "@/components/Tips";
  import DynamicList from "../../components/dynamicList.vue";
  import FullLoading from "@/components/Loading";
  import throttle from "lodash.throttle";
  // import UserInfo from './components/UserInfo'
  // import intro from '@/utils/intro'
  export default defineComponent({
    components: {
      Tips,
      DynamicList,
      FullLoading
      // UserInfo
    },
    setup(props, context) {
      const { $router: router, $route: route, zgStatistics } = context.root;
      const dynamicListDom = ref(null);
      const state = reactive({
        // introVisible: true,
        tips: {
          visible: false,
          exp: 0,
          isNewUser: false
        },
        source: "",
        topicDetail: {},
        likeType: 4,
        sortActive: "new",
        scrollTop: 0,
        dynamicData: [
          {
            type: "img",
            imgArr: [
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/1.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/2.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/3.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/1.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/2.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/3.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/1.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/2.jpg"
              }
            ]
          },
          {
            type: "video",
            url: "http://lk-webfont.oss-accelerate.aliyuncs.com/web/play-qx/qx/%E5%85%85%E6%BB%A1%E6%83%85%E8%B0%83%E7%9A%84%E5%AE%A2%E5%8E%85%E8%8A%B1%E8%89%BA%E8%A7%86%E9%A2%91.mp4"
          },
          {
            type: "img",
            imgArr: [
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/1.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/2.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/3.jpg"
              },
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/1.jpg"
              }
            ]
          },
          {
            type: "img",
            imgArr: [
              {
                url: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/1.jpg"
              }
            ]
          }
        ],
        rotationChart: [],
        orderFlag: "gmtCreate",
        loaded: false,
        hotTopic: [],
        ranking: 0,
        topicId: ""
      });

      // 点击排序
      const bindSort = e => {
        if (state.orderFlag !== e) {
          state.loaded = false;
        }
        state.orderFlag = e;
        zgStatistics("健康新奥-健康活动-点击排序按钮", {
          按钮名称: e == "likeCount" ? "最热" : "最新"
        });
      };

      // 查询轮播图
      const activityinfoFn = () => {
        let params = {
          pageIndex: 1,
          pageSize: 5,
          publishOrg: null,
          status: 1,
          activity: "1"
        };
        activityinfo(params).then(({ code, data, message }) => {
          if (code === 0) {
            state.rotationChart = data;
          } else {
            console.log("activityinfo", message);
            // Toast(message);
          }
        });
      };

      // 话题详情
      const activitytopicinfoDetailFn = () => {
        let params = {
          id: state.topicId
        };
        activitytopicinfoDetail(params).then(({ code, data, message }) => {
          if (code === 0) {
            state.topicDetail = data;
            console.log(data, "话题详情");
          } else {
            // Toast(message);
          }
        });
      };

      // 点赞
      const likeInsertFn = throttle(function (e, index) {
        zgStatistics("健康新奥-健康活动-活动动态-互动情况-点击互动按钮", {
          来源: checkSource(route.name),
          按钮名称: "点赞",
          互动目标ID: e.memberCode,
          活动名称: e.activityTitle
        });

        let params = {
          likeType: state.likeType, //点赞
          likeId: e.id,
          memberCode: localStorage.getItem("memberCode"),
          likeMemberCode: e.publishMemberCode
        };
        likeInsert(params).then(({ code, data, message }) => {
          if (code === 0) {
            state.topicDetail.likeCount = ++state.topicDetail.likeCount;
            state.topicDetail.isLike = 1;
          } else {
            Toast(message);
          }
        });
      }, 500);

      // 取消点赞
      const realDeleteFn = throttle(function (e, index) {
        zgStatistics("健康新奥-健康活动-活动动态-互动情况-点击互动按钮", {
          来源: checkSource(route.name),
          按钮名称: "取消点赞",
          互动目标ID: e.memberCode,
          活动名称: e.activityTitle
        });

        let params = {
          likeType: state.likeType, //
          likeId: e.id,
          memberCode: localStorage.getItem("memberCode"),
          likeMemberCode: e.publishMemberCode
        };
        realDelete(params).then(({ code, data, message }) => {
          if (code === 0) {
            state.topicDetail.likeCount = --state.topicDetail.likeCount;
            state.topicDetail.isLike = 0;
          } else {
            Toast(message);
          }
        });
      }, 500);

      // 最热话题列表

      const getListByHotFn = () => {
        let params = {
          pageIndex: 1,
          pageSize: 3,
          status: 1
        };
        getListByHot(params).then(({ code, data, message }) => {
          if (code === 0) {
            state.hotTopic = data;
            console.log(data, "话题");
          } else {
          }
        });
      };

      const viewAllActivity = () => {
        zgStatistics("健康新奥-健康活动-点击排序按钮", {
          按钮名称: "查看全部",
          所属功能: "动态",
          所属模块: "热门活动"
        });
        router.push({
          path: "/activityList"
        });
      };
      const handleLoaded = () => {
        state.loaded = true;
      };
      const goToActivityDetail = e => {
        zgStatistics("健康新奥-健康活动-点击顶部轮播图", {
          活动名称: e.title,
          来源: "首页轮播图"
        });
        router.push({
          path: "/activityDetail",
          query: { id: e.id, source: "homeBanner" }
        });
      };
      // 发布动态
      const goPublish = () => {
        zgStatistics("健康新奥-健康活动-活动动态-点击发布按钮", {
          来源: checkSource(route.name)
        });
        let queryObj = {};
        if (route.name !== "themeActivityHome" && route.name !== "myUpdates") {
          queryObj = Object.assign(
            {
              name: encodeURIComponent(props.title),
              from: route.name
            },
            route.query
          );
        } else {
          queryObj = Object.assign(
            {
              from: route.name
            },
            {
              ticket: route.query.ticket
            }
          );
        }
        router.push({
          name: "publish",
          query: queryObj
        });
      };
      // 我的动态
      const jumpTo = url => router.push(url);
      // onActivated(() => {
      //     init()
      //     if (state.orderFlag == 'gmtCreate') {
      //         if (dynamicListDom.value) {
      //             dynamicListDom.value.getDataList()
      //         }
      //     } else {
      //         state.orderFlag = 'gmtCreate'
      //     }

      // })
      const init = () => {
        // 轮播图
        console.log("zhixing");
        state.loaded = false;
        state.topicId = route.query.topicId;
        state.source = route.query.source;
        state.ranking = Number(route.query.ranking);
        activitytopicinfoDetailFn();
      };

      onMounted(() => {
        init();

        if (state.orderFlag == "gmtCreate") {
          if (dynamicListDom.value) {
            dynamicListDom.value.getDataList();
          }
        } else {
          state.orderFlag = "gmtCreate";
          if (dynamicListDom.value) {
            dynamicListDom.value.getDataList();
          }
        }
      });
      return {
        ...toRefs(state),
        isIosX,
        bindSort,
        viewAllActivity,
        goToActivityDetail,
        dynamicListDom,
        handleLoaded,
        goPublish,
        jumpTo,
        likeInsertFn,
        realDeleteFn
      };
    }
  });
</script>

<template>
  <ul :class="['page-box', isIosX ? 'padding-ipx' : '', 'containter']">
    <li v-show="loaded">
      <!-- 话题内容 -->
      <div class="topic_detail">
        <div class="topic_content">
          <img
            src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/topic_detail_%23.png"
            alt=""
          />
          <span>{{ topicDetail.content }}</span>
        </div>
        <div class="comment_zan">
          <div class="comment">讨论 · {{ topicDetail.topicCount }}</div>
          <div class="zan_box">
            <img
              @click="realDeleteFn(topicDetail)"
              v-if="topicDetail.isLike"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/thumbs_active.png"
              alt=""
            />
            <img
              @click="likeInsertFn(topicDetail)"
              v-else
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/thumbs.png"
              alt=""
            />

            <span> · {{ topicDetail.likeCount }}</span>
          </div>
        </div>
        <div class="topic_ranking">
          话题热度榜 第
          <span v-if="ranking < 9">0{{ topicDetail.topicNum }}</span>
          <span v-else>{{ topicDetail.topicNum }}</span
          >名
        </div>
      </div>
      <!-- 动态 -->
      <div class="dynamic">
        <!-- 排序按钮 -->
        <div class="sort-btn-box">
          <div class="title">相关动态</div>
          <div class="sort-btn">
            <span :class="[orderFlag == 'gmtCreate' ? 'active' : '']" @click="bindSort('gmtCreate')">最新</span>
            <span :class="[orderFlag == 'likeCount' ? 'active' : '']" @click="bindSort('likeCount')">最热</span>
          </div>
        </div>
        <!-- 活动内容 -->
        <dynamic-list
          ref="dynamicListDom"
          :topicId="topicId"
          :orderFlag="orderFlag"
          @loaded="handleLoaded"
          class="dynamic-list"
        >
        </dynamic-list>
      </div>
    </li>
    <full-loading :loading="!loaded" />
  </ul>
</template>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
