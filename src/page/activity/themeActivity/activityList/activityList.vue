<!--
 * @Author: yanghaifengb yanghaifengb@enn.cn
 * @Date: 2022-06-28 10:18:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-28 10:09:21
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
  import { activityinfo, selectListByType } from "@/service/activity";
  import { stampToTime } from "@/utils/filter";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  // import UserInfo from './components/UserInfo'
  // import intro from '@/utils/intro'
  export default defineComponent({
    components: {
      Tips
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
        activityList: [],
        pageIndex: 1,
        pageSize: 5,
        loading: false,
        finished: false,
        publishOrgDict: [],

        stampToTime: stampToTime
      });

      // 活动列表
      const activityinfoFn = () => {
        let params = {
          pageIndex: state.pageIndex,
          pageSize: state.pageSize,
          publishOrg: null,
          status: 1,
          activity: "1"
        };
        activityinfo(params).then(({ code, data, message, page }) => {
          if (code === 0) {
            state.activityList = [...state.activityList, ...data];
            state.loading = false;
            if (state.activityList.length == page.total) {
              state.finished = true;
            }
            // console.log(data, "活动列表");
          } else {
            console.log("activityinfo", message);
            // Toast(message);
          }
        });
      };

      //转换机构
      const translateOrg = e => {
        let temp = [];
        temp = state.publishOrgDict.filter(item => {
          return item.dictId == e;
        });
        if (temp.length) {
          return temp[0]["dictValue"];
        } else {
          return "";
        }
      };
      // 查询活动机构
      const queryOrgDict = () => {
        selectListByType({
          dictType: "activity_publishOrg"
        }).then(res => {
          if ((res.code = 1000)) {
            state.publishOrgDict = res.data;
          }
        });
      };
      // 去详情页面
      const toDetail = ({ id }) => {
        console.log(route.value.query);
        router.push({
          path: "/activityDetail",
          query: Object.assign(route.value.query, { id })
        });
      };

      const onLoad = () => {
        state.pageIndex = ++state.pageIndex;
        activityinfoFn();
      };

      const init = () => {
        queryOrgDict();
        activityinfoFn();
      };

      onMounted(init);

      return {
        ...toRefs(state),
        isIosX,
        onLoad,
        queryOrgDict,
        translateOrg,
        toDetail
      };
    }
  });
</script>

<template>
  <div class="containter">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
      <div class="activity-list-box" v-for="(item, index) in activityList" :key="index">
        <img @click="toDetail(item)" class="big-pic" :src="item.cover" alt="" />
        <div class="bottom-content">
          <div class="title">{{ item.title }}</div>
          <div class="time-btn">
            <div class="time">{{ stampToTime(item.startTime) }}～{{ stampToTime(item.endTime) }}</div>
            <div class="btn" @click="toDetail(item)">
              <span>查看详情</span>
              <img
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/right_arrow_light.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <!-- 左上角标题 -->
        <!-- <div class="publish-org">{{ translateOrg(item.publishOrg) }}</div> -->
      </div>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
  @import "./activityList.scss";
</style>
