<!--
 * @Author: yanghaifengb yanghaifengb@enn.cn
 * @Date: 2022-06-29 09:41:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-31 16:08:03
 * @FilePath: \workBreakExercises\src\page\activity\themeActivity\myUpdates\myUpdates.vue
 * @Description: 我的动态
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { Toast, Swipe, SwipeItem } from "vant";
  import { queryExerciseWorkJobList } from "@/service/health/index";
  import { checkSource } from "@/utils/ZGdictionary";
  import { isIosX } from "@/utils/isIosX";
  import Tips from "@/components/Tips";
  import myDynamicList from "../components/myDynamicList.vue";
  import { getPersonCount } from "@/service/activity";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  // import UserInfo from './components/UserInfo'
  // import intro from '@/utils/intro'
  export default defineComponent({
    components: {
      Tips,
      myDynamicList
      // UserInfo
    },
    setup(_, context) {
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const state = reactive({
        // introVisible: true,
        tips: {
          visible: false,
          exp: 0,
          isNewUser: false
        },
        sortActive: "new",
        openDetail: true,
        personData: {},
        noData: false
      });

      // 我的动态
      const getPersonCountFn = () => {
        let params = {
          memberCode: localStorage.getItem("memberCode")
        };
        getPersonCount(params).then(({ code, data, message }) => {
          if (code === 0) {
            state.personData = data;
          } else {
            console.log("getPersonCount", message);
            // Toast(message);
          }
        });
      };

      // 展开详情
      const deploymentDetails = e => {
        state.openDetail = e;
      };

      const init = () => {
        getPersonCountFn();
      };

      onMounted(init);

      return {
        ...toRefs(state),
        isIosX,
        deploymentDetails,
        getPersonCountFn
      };
    }
  });
</script>

<template>
  <div class="containter">
    <!-- 顶部背景墙 -->
    <div v-if="!noData" class="top-wall">
      <div class="portrait-name">
        <img :src="personData.userHeadUrl" alt="" />
        <div class="name">{{ personData.userName }}</div>
      </div>
      <div class="info">
        <div class="activity">
          <span>{{ personData.activityCount }}</span>
          <span>参与活动</span>
        </div>
        <div class="dynamic-item">
          <span>{{ personData.dynamicCount }}</span>
          <span>发布动态</span>
        </div>
        <div class="evaluate">
          <span>{{ personData.commentCount }}</span>
          <span>获评</span>
        </div>
        <div class="praise">
          <span>{{ personData.likeCount }}</span>
          <span>获赞</span>
        </div>
      </div>
    </div>
    <div class="dynamic-list">
      <my-dynamic-list
        :userFlag="1"
        :checkStatus="null"
        :hidenPhoto="false"
        @noData="noData = true"
        @refresh="getPersonCountFn"
      ></my-dynamic-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "./myUpdates.scss";
</style>
