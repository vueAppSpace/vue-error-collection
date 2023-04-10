<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-04-10 14:59:43
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\Report.vue
 * @Description: 动感团操 - 运动报告
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import ReportCard from "./components/ReportCard.vue";
  import { Toast } from "vant";
  import FullLoading from "@/components/Loading";
  import { getSportPageList, getSportReportSummary } from "@/service/classReservations/index";
  import _get from "lodash.get";
  import { jsBridge } from "@/utils/native/jsBridge";

  export default defineComponent({
    components: {
      ReportCard,
      FullLoading
    },

    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      //从 "约课记录" 进入刷新当前页面
      if (["/class-reservations-record"].includes(fromPath)) {
        next(async vm => {
          try {
            vm.coverLoading = true;
            await vm.queryPageListFn("refresh");
            await vm.getSportReportSummaryFn();
            vm.coverLoading = false;
          } catch (err) {
            console.log("classReservations report beforeRouteEnter err: " + err);
            vm.coverLoading = false;
          }
        });
      } else {
        next();
      }
    },

    setup(_, context) {
      console.log("report...");

      const { zgStatistics, $router: router } = context.root;
      const state = reactive({
        //bussiness data
        summary: null,
        reportList: [],
        pageParams: {
          pageIndex: 1,
          pageOffset: 0,
          pageLimit: 10
        },

        //控制加载list
        loading: false,
        finished: false,
        //遮罩层
        coverLoading: false
      });

      function resetPageData() {
        state.summary = null;
        state.reportList = [];
        state.pageParams.pageIndex = 1;
        state.pageParams.pageOffset = 0;
        state.loading = false;
        state.finished = false;
      }

      //递增分页
      function incrementPageIndex() {
        state.pageParams.pageIndex++;
        state.pageParams.pageOffset = state.pageParams.pageLimit * (state.pageParams.pageIndex - 1);
      }

      async function queryPageListFn(type) {
        try {
          state.loading = true;
          if (type === "refresh") {
            resetPageData();
          } else {
            incrementPageIndex();
          }

          // const { code, message, data } = await import(
          //   "@/mock/getSportPageList.json"
          // );
          const params = {
            pageOffset: state.pageParams.pageOffset,
            pageLimit: state.pageParams.pageLimit
          };
          const { code, message, data } = await getSportPageList(params);
          state.loading = false;

          const reportList = _get(data, "data.list") || [];
          if (code === 0) {
            if (!reportList.length) {
              state.finished = true;
              return;
            }
            state.reportList = [...state.reportList, ...reportList];
          } else {
            Toast(message || "获取运动记录数据失败!");
          }
        } catch (err) {
          state.loading = false;
          console.log("classReservations report queryPageListFn: " + err);
        }
      }

      async function getSportReportSummaryFn() {
        //  const { code, message, data } = await import(
        //   "@/mock/getSportReportSummary.json"
        // );
        const { code, message, data } = await getSportReportSummary();
        if (code === 0 && data) {
          state.summary = data;
        } else {
          Toast(message || "获取运动记录汇总数据失败!");
        }
      }

      function handleItemCardClick(url) {
        jsBridge.invoke("openWebView", {
          targetUrl: url,
          refreshTicket: false
        });
      }

      return {
        ...toRefs(state),
        handleItemCardClick,
        queryPageListFn,
        getSportReportSummaryFn
      };
    }
  });
</script>

<template>
  <div class="class-reservations-report">
    <full-loading :loading="coverLoading" />
    <template v-if="summary && reportList.length">
      <div class="totalInfo">
        <div>
          <div>总消耗（kcal）</div>
          <div>{{ summary.calorie }}</div>
        </div>
        <div>
          <div>总运动时长（min）</div>
          <div>{{ summary.duration }}</div>
        </div>
        <div>
          <div>总消耗课时（节）</div>
          <div>{{ summary.total }}</div>
        </div>
      </div>
      <div class="item-card-list">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="queryPageListFn"
          offset="50"
        >
          <template v-for="item in reportList">
            <div class="item-card-wrap" :key="item.id">
              <ReportCard @click="handleItemCardClick" class="item-card-outer" v-bind="item" />
            </div>
          </template>
        </van-list>
      </div>
    </template>
    <template v-else>
      <van-empty
        class="custom-image"
        :class="{ moreHeight: true }"
        image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
        description="暂无运动报告~"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .class-reservations-report {
    font-size: 0.3rem;
    min-height: 100%;
    background-color: #f7f9ff;

    .totalInfo {
      display: flex;
      align-items: center;
      height: 232px;
      background: linear-gradient(147deg, #4b7aff 0%, #6d92fb 100%);

      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        position: relative;
        width: calc(100% / 3);

        &:nth-child(2)::before {
          position: absolute;
          display: block;
          content: " ";
          left: 0;
          top: 30%;
          transform: translateY(-50%, -50%);
          width: 1px;
          height: 44px;
          background-color: #e77c17;
        }

        &:nth-child(2)::after {
          position: absolute;
          display: block;
          content: " ";
          right: 0;
          top: 30%;
          transform: translateY(-50%, -50%);
          width: 1px;
          height: 44px;
          background-color: #e77c17;
        }

        div:first-child {
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 34px;
        }

        div:last-child {
          font-size: 44px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #ffffff;
          line-height: 52px;
          margin-top: 16px;
        }
      }
    }

    .item-card-list {
      padding-top: 32px;
      position: relative;
      top: -10px;
      background-color: #f7f9ff;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;

      .item-card-wrap {
        .item-card-outer {
          margin: 0 32px;
          margin-bottom: 24px;
        }
      }
    }

    ::v-deep .van-empty {
      padding-top: 200px;
    }
  }
</style>
