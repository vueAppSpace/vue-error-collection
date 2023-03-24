<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:42:41
 * @FilePath: \lk-xinaohealth-h5\src\page\weighingRecords\index.vue
 * @Description: 历史称重记录
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import { Toast } from "vant";
  import FullLoading from "@/components/Loading";
  import { getWeightPageList } from "@/service/classReservations";
  import _get from "lodash.get";
  import useNavigate from "@/hooks/useNavigate";
  import { jsBridge } from "@/utils/native/jsBridge";

  export default defineComponent({
    components: {
      FullLoading
    },
    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      //从 "体测记录" 进入刷新当前页面
      if (["/physical-test-records"].includes(fromPath)) {
        next(async vm => {
          try {
            vm.coverLoading = true;
            await vm.queryPageListFn("refresh");
            vm.coverLoading = false;
          } catch (err) {
            console.log("weighingRecords beforeRouteEnter err: " + err);
            vm.coverLoading = false;
          }
        });
      } else {
        next();
      }
    },

    setup(_, context) {
      console.log("weighingRecords...");

      const { zgStatistics, $router: router } = context.root;
      const state = reactive({
        dayjs,

        //bussiness data
        weightPageList: [],
        pageParams: {
          pageOffset: 0,
          pageLimit: 10
        },

        //控制加载list
        loading: false,
        finished: false,

        coverLoading: false
      });

      const { navigateTo } = useNavigate();

      function resetPageData() {
        state.weightPageList = [];
        state.pageParams.pageOffset = 0;
        state.loading = false;
        state.finished = false;
      }

      async function queryPageListFn(type) {
        try {
          state.loading = true;
          if (type === "refresh") {
            resetPageData();
          } else {
            state.pageParams.pageOffset++;
          }

          // const { code, message, data } = await import(
          //   "@/mock/getWeightPageList.json"
          // );
          const { code, message, data } = await getWeightPageList(state.pageParams);
          state.loading = false;

          const weightPageList = _get(data, "data.list") || [];
          if (code === 0) {
            if (!weightPageList.length) {
              state.finished = true;
              return;
            }
            state.weightPageList = [...state.weightPageList, ...weightPageList];
          } else {
            Toast(message || "查询称重记录失败!");
          }
        } catch (err) {
          console.log("weighingRecords index queryPageListFn err: " + err);
          state.loading = false;
        }
      }

      function handleItemCardClick(url) {
        // navigateTo(url);
        jsBridge.invoke("openWebView", {
          targetUrl: url,
          refreshTicket: false,
          extraParame: "&icome-webview=v2"
        });
      }

      return {
        ...toRefs(state),
        handleItemCardClick,
        queryPageListFn
      };
    }
  });
</script>

<template>
  <div class="class-reservations">
    <full-loading :loading="coverLoading" />
    <div class="item-card-list" v-if="weightPageList.length">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="queryPageListFn"
        offset="50"
      >
        <template v-for="item in weightPageList">
          <div class="item-card-outer" :key="item.id" @click="handleItemCardClick(item.url)">
            <div class="label" v-if="item.scene === 2">家用版</div>
            <div class="item-card-outer-wrapper">
              <div class="time">
                {{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss").slice(5) }}
              </div>
              <div class="weight">
                <div class="top">体重（kg）</div>
                <div class="bottom">{{ item.weight }}</div>
              </div>
              <div class="weight">
                <div class="top">体脂率</div>
                <div class="bottom">{{ item.bodyfatPercentage + "%" }}</div>
              </div>
              <div>
                <img
                  src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/arrowRightBlack.png"
                />
              </div>
            </div>
          </div>
        </template>
      </van-list>
    </div>
    <div v-else>
      <van-empty
        class="custom-image"
        :class="{ moreHeight: true }"
        image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
        description="暂无历史称重记录~"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .class-reservations {
    font-size: 0.3rem;
    min-height: 100%;
    background-color: #f7f9ff;
    padding: 24px 32px;

    .item-card-list {
      .item-card-outer {
        background: #ffffff;
        border-radius: 16px;
        position: relative;
        margin-bottom: 24px;

        .label {
          position: absolute;
          left: 0;
          width: 1.08rem;
          height: 0.4rem;
          background: #edf1ff;
          border-radius: 0.16rem 0 0.16rem 0;
          text-align: center;
          line-height: 0.4rem;
          font-size: 0.24rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4b7aff;
        }

        .item-card-outer-wrapper {
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: space-between;
          padding: 18px 24px;

          .time {
            width: 188px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }

          .weight {
            .top {
              height: 34px;
              font-size: 24px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 34px;
            }

            .bottom {
              height: 44px;
              font-size: 32px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #1c1c1e;
              line-height: 44px;
              margin-top: 7px;
            }
          }

          img {
            width: 12px;
            height: 18px;
          }
        }
      }
    }

    ::v-deep .van-empty {
      padding-top: 200px;
    }
  }
</style>
