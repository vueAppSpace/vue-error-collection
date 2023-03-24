<!--
 * @Author: yanghaifengb yanghaifengb@enn.cn
 * @Date: 2022-06-28 10:18:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:34:05
 * @FilePath: \workBreakExercises\src\page\activity\themeActivity\activityList.vue
 * @Description: 活动列表
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { Toast, Swipe, SwipeItem } from "vant";
  import { queryExerciseWorkJobList } from "@/service/health/index";
  import { checkSource } from "@/utils/ZGdictionary";
  import { isIosX } from "@/utils/isIosX";
  import Tips from "@/components/Tips";
  import DynamicList from "../components/dynamicList.vue";
  import { activityDetail, activityinfo, likeInsert, realDelete, activityLikePage } from "@/service/activity";
  import useMethods from "../methods/methods";
  // import UserInfo from './components/UserInfo'
  // import intro from '@/utils/intro'
  export default defineComponent({
    components: {
      Tips,
      DynamicList
      // UserInfo
    },
    setup(props, context) {
      const { $router: router, $route: route, zgStatistics, $nextTick, $el } = context.root;

      const state = reactive({
        // introVisible: true,
        tips: {
          visible: false,
          exp: 0,
          isNewUser: false
        },
        sortActive: "new",
        openDetail: false,
        id: parseInt(route.query.id),
        activityDetailData: {},
        likeType: 0,
        likeStatus: false
      });

      // 点赞回调
      const likeInsertCallBack = () => {
        console.log("我点赞啦");
        activityDetailFn();
        zgStatistics("健康新奥-健康活动-活动点赞", {
          来源: "活动详情",
          活动名称: state.activityDetailData.title
        });
        activityLikePageFn();
      };
      // 取消点赞回调
      const realDeleteCallBack = () => {
        console.log("取消点赞");
        activityDetailFn();
        activityLikePageFn();
      };

      const { likeInsertFn, realDeleteFn } = useMethods({
        props: props,
        state: state,
        $nextTick: $nextTick,
        $el: $el,
        context: context,
        likeInsertCallBack: likeInsertCallBack,
        realDeleteCallBack: realDeleteCallBack
      });

      // 活动详情
      const activityDetailFn = () => {
        let params = {
          id: state.id
        };
        activityDetail(params).then(({ code, data, message }) => {
          if (code === 0) {
            const regex = new RegExp("<img", "gi");
            data.content = data.content.replace(regex, '<img style="max-width: 100%; height: auto"');
            state.activityDetailData = data;
          } else {
            console.log("activityDetail", message);
            // Toast(message);
          }
        });
      };
      // 查询是否被点赞过
      const activityLikePageFn = () => {
        let params = {
          likeId: state.id - 0,
          memberCode: localStorage.getItem("memberCode"),
          likeType: 0,
          pageIndex: 0,
          pageSize: 10
        };
        activityLikePage(params).then(({ code, data, message }) => {
          if (code === 0) {
            if (data.length) {
              state.likeStatus = true;
            } else {
              state.likeStatus = false;
            }
          } else {
            console.log("activityLikePage", message);
            // Toast(message);
          }
        });
      };

      // 展开详情
      const deploymentDetails = e => {
        state.openDetail = e;
        zgStatistics("健康新奥-健康活动-活动详情-点击展示详情", {
          活动名称: state.activityDetailData.title
        });
      };

      const init = () => {
        activityDetailFn();
        //   查询是否点赞过
        activityLikePageFn();
        zgStatistics("健康新奥-健康活动-进入活动详情", {
          活动名称: state.activityDetailData.title,
          来源: checkSource(route.query.source)
        });
      };

      onMounted(init);

      return {
        ...toRefs(state),
        isIosX,
        deploymentDetails,
        activityDetailFn,
        likeInsertFn,
        realDeleteFn,
        likeInsertCallBack,
        realDeleteCallBack,
        activityLikePageFn
      };
    }
  });
</script>

<template>
  <div class="containter-wrap-active">
    <div class="big-wall" :style="`background:url(${activityDetailData.cover}) center center no-repeat;`" alt=""></div>
    <div class="dynamic-content">
      <div class="theme-introduce">
        <div class="title-fabulous">
          <div class="title">@{{ activityDetailData.title }}</div>
          <div class="fabulous">
            <img
              @click="realDeleteFn(activityDetailData)"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/thumbs_active.png"
              alt=""
              v-if="likeStatus"
            />
            <img
              @click="likeInsertFn(activityDetailData)"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/thumbs.png"
              alt=""
              v-else
            />

            <span>{{ activityDetailData.clockInNum }}</span>
          </div>
        </div>
        <!-- 简单介绍 -->
        <div class="brief-introduction">
          <div class="text">
            {{ activityDetailData.briefIntro }}
          </div>

          <!-- 详情内容 -->
          <div class="detail-content" v-if="openDetail" v-html="activityDetailData.content"></div>

          <!-- 展开详情 -->
          <div class="btn" v-if="!openDetail" @click="deploymentDetails(true)">
            <span>展开详情</span>
            <img
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/bottom_arrow.png"
              alt=""
            />
          </div>
          <!-- 收起详情 -->
          <div class="btn" v-if="openDetail" @click="deploymentDetails(false)">
            <span>收起详情</span>
            <img
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/arrow_up_blue.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <dynamic-list class="dynamic-list" :title="activityDetailData.title" :activityId="id" from="activityDetail">
      </dynamic-list>
    </div>

    <div class="photo-btn">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/photo.png" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "./activityDetail.scss";
</style>
