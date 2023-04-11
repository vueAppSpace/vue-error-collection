<!--
 * @Author: haifeng.yang haifeng.yang@amocorp.cn
 * @Date: 2022-06-27 11:25:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-28 10:13:11
 * @FilePath: \lk-xinaohealth-h5\src\page\activity\themeActivity\home\home.vue
 * @Description: 活动首页
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, onActivated, onDeactivated, ref } from "@vue/composition-api";
  import { Toast, Swipe, SwipeItem } from "vant";
  import { activityinfo, getDynamicList, getUserComm, likeInsert, realDelete, getListByHot } from "@/service/activity";
  import { checkSource } from "@/utils/ZGdictionary";
  import { isIosX } from "@/utils/isIosX";
  import Tips from "@/components/Tips";
  import DynamicList from "../components/dynamicList.vue";
  import FullLoading from "@/components/Loading";
  import { useRouter, useRoute } from "@/hooks/useRouter";
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
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const dynamicListDom = ref(null);
      const state = reactive({
        // introVisible: true,
        tips: {
          visible: false,
          exp: 0,
          isNewUser: false
        },
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
        topStatus: false,
        titleActive: "healthTrends"
      });

      // 点击健康动态或活动打卡
      const handleTitle = e => {
        if (state.titleActive !== e) {
          state.loaded = false;
        }
        state.titleActive = e;
      };

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

      const goToTopicDetail = (item, index) => {
        router.push({
          path: "/topicDetail",
          query: {
            topicId: item.id,
            ranking: index
          }
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
            //console.log("activityinfo", message);
            // Toast(message);
          }
        });
      };

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
            if (data[0].top == 1) {
              // 有置顶的
              state.topStatus = true;
            } else {
              state.topStatus = false;
            }
            //console.log(data, "话题");
          } else {
          }
        });
      };

      const viewAllActivity = () => {
        zgStatistics("健康新奥-健康活动-点击查看全部按钮", {
          按钮名称: "查看全部",
          所属功能: "动态",
          所属模块: "热门活动"
        });
        router.push({
          path: "/activityList"
        });
      };
      const viewAllTopic = () => {
        zgStatistics("健康新奥-健康活动-点击查看全部按钮", {
          按钮名称: "查看全部",
          所属功能: "话题",
          所属模块: "热门话题"
        });
        router.push({
          path: "/topicList"
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
      // 我的动态
      const jumpTo = url => router.push(url);
      onActivated(() => {
        init();
        if (state.orderFlag == "gmtCreate") {
          if (dynamicListDom.value) {
            dynamicListDom.value.getDataList();
          }
        } else {
          state.orderFlag = "gmtCreate";
        }
      });
      const init = () => {
        // 轮播图
        //console.log("zhixing");
        state.loaded = false;
        activityinfoFn();
        // 热门话题
        getListByHotFn();
      };

      // onMounted(init);
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
        viewAllTopic,
        handleTitle,
        goToTopicDetail
      };
    }
  });
</script>

<template>
  <ul :class="['page-box', isIosX ? 'padding-ipx' : '', 'containter']">
    <li v-show="loaded">
      <!-- 两个入口 -->
      <div class="entrance_box">
        <!-- 发布动态 -->
        <div class="publish_dynamic" @click="goPublish">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/photo.png" alt="" />
          <span>发布动态</span>
        </div>
        <!-- 我的动态 -->
        <div
          class="my_dynamic"
          @click="jumpTo('/myUpdates')"
          v-track="{
            type: 'click',
            name: '健康新奥-健康活动-活动动态-点击发布按钮',
            data: `{&quot;按钮名称&quot;:ot;}`
          }"
        >
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/star.png" alt="" />
          <span>我的动态</span>
        </div>
      </div>

      <!-- 热门活动 -->
      <div class="rotation-chart" v-if="rotationChart.length">
        <div class="text-line">
          <span class="title">热门活动</span>
          <span class="view-all" @click="viewAllActivity"
            >查看全部
            <img
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/right_arrow.png"
              alt=""
            />
          </span>
        </div>
        <!-- 轮播图 -->
        <div style="max-height: 310px; overflow: hidden" class="pic">
          <van-swipe
            height="155px"
            class="my-swipe"
            :autoplay="3000"
            indicator-color="white"
            :loop="true"
            :touchable="true"
          >
            <van-swipe-item v-for="(item, index) in rotationChart" :key="index">
              <img @click="goToActivityDetail(item)" :src="item.cover" alt="" />
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 热门话题 -->
      <div class="hot_topic">
        <div class="text-line">
          <span class="title">热门话题</span>
          <span class="view-all" @click="viewAllTopic"
            >查看全部
            <img
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/right_arrow.png"
              alt=""
            />
          </span>
        </div>
        <div class="hopic_content">
          <div
            v-for="(item, index) in hotTopic"
            :key="index"
            :class="['item_hopic', topStatus == true ? 'top_topic' : '']"
            @click="goToTopicDetail(item, index)"
          >
            <span class="serial_no" v-if="topStatus == false && item.top == 0">0{{ index + 1 }}</span>
            <span class="serial_no" v-if="topStatus == true && item.top == 0">0{{ index + 0 }}</span>
            <span class="serial_no" v-if="item.top == 1">
              <img
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/top_icon.png"
                alt=""
              />
            </span>
            <span class="hopic_text">#{{ item.content }}</span>
          </div>
        </div>
      </div>
      <!-- 动态 -->
      <div class="dynamic">
        <!-- 排序按钮 -->
        <div class="sort-btn-box">
          <div class="title_box">
            <div
              :class="['title', 'health_trends', titleActive == 'healthTrends' ? 'active' : '']"
              @click="handleTitle('healthTrends')"
            >
              健康动态
            </div>
            <div
              :class="['title', 'activity_clock', titleActive == 'activityClock' ? 'active' : '']"
              @click="handleTitle('activityClock')"
            >
              活动打卡
            </div>
          </div>
          <div class="sort-btn">
            <span :class="[orderFlag == 'gmtCreate' ? 'active' : '']" @click="bindSort('gmtCreate')">最新</span>
            <span :class="[orderFlag == 'likeCount' ? 'active' : '']" @click="bindSort('likeCount')">最热</span>
          </div>
        </div>
        <!-- 活动内容 -->
        <dynamic-list
          ref="dynamicListDom"
          :orderFlag="orderFlag"
          @loaded="handleLoaded"
          class="dynamic-list"
          :titleActive="titleActive"
        >
        </dynamic-list>
      </div>
    </li>

    <!-- <div class="photo-btn">
      <img
        src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/photo.png"
        alt=""
      />
    </div> -->
    <!-- <tips :value.sync="tips.visible" :duration="3000" :exp="tips.exp" :is-new-user="tips.isNewUser" /> -->
    <full-loading :loading="!loaded" />
  </ul>
</template>

<style lang="scss" scoped>
  @import "./home.scss";
</style>
