<!--
 * @Description: 积分账单
 * @Author: IFLS
 * @Date: 2022-11-16 09:53:14
 * @LastEditTime: 2023-04-06 13:37:43
-->
<script>
  import { defineComponent, toRefs, reactive, onMounted, onBeforeUnmount } from "@vue/composition-api";
  import { queryPointList } from "@/service/integralMall";
  import { queryMineRankList } from "@/service/mine/index";
  import { unFlatArr } from "@/utils/commonFun";
  import { translateName } from "./taskType";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    setup(_, context) {
      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        userData: {},
        list: [],
        page: {
          pageIndex: 1,
          pageSize: 50,
          total: 0,
          pages: 0
        },
        pageLoading: false,
        finished: false
      });

      // 查询累积积分 剩余积分
      const queryMineData = () => {
        queryMineRankList(userInfo.value.memberCode).then(({ code, data, message }) => {
          if (code === 0) {
            state.userData = data || {};
          } else {
            //console.log("queryMineData", message);
            // Toast(message);
          }
        });
      };

      // 查询积分列表
      const queryList = () => {
        const req = { memberId: userInfo.value.memberId, ...state.page };
        queryPointList(req).then(({ code, data, message, page }) => {
          if (code === 0) {
            data = data.map(item => {
              item.time = dayjs(item.gmtCreate).format("YYYY年MM月DD日");
              return item;
            });
            const newList = unFlatArr(data, "time");
            state.list = state.list.concat(newList);
            state.page = page;
            state.pageLoading = false;
            if (state.page.pageIndex < state.page.pages) {
              state.page.pageIndex++;
              state.finished = false;
            } else {
              state.finished = true;
            }
          } else {
            //console.log("queryPointList", message);
          }
        });
      };

      // 滚动函数
      const onScroll = () => {
        const pageHeight = document.documentElement.scrollHeight;
        const pageTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if (pageHeight - pageTop <= clientHeight) {
          if (state.pageLoading || state.finished) {
            state.pageLoading = false;
            state.finished = true;
            return;
          }
          queryList();
          state.pageLoading = true;
        }
      };

      onMounted(() => {
        window.addEventListener("scroll", onScroll);
        queryMineData();
        queryList();
      });

      onBeforeUnmount(() => {
        window.removeEventListener("scroll", onScroll);
      });

      return {
        ...toRefs(state),
        translateName
      };
    }
  });
</script>

<template>
  <div class="box">
    <div class="top-box">
      <div class="top-box-left">
        <div class="title">累计积分</div>
        <div class="num">{{ userData.totalHealthPoints }}</div>
      </div>
      <hr />
      <div class="top-box-right">
        <div class="title">剩余积分</div>
        <div class="num">{{ userData.healthPoints }}</div>
      </div>
    </div>

    <ul class="card-ul" v-for="(items, index) in list" :key="index">
      <li class="card-li">
        <div class="time-title">{{ items[0].time }}</div>
        <ul class="detail-ul">
          <li class="detail-li" v-for="(item, idx) in items" :key="idx">
            <div>{{ translateName(item) }}</div>
            <div>{{ item.healthPoints > 0 ? `+${item.healthPoints}` : `${item.healthPoints}` }}</div>
          </li>
        </ul>
      </li>
    </ul>

    <div class="bottom-loading">
      <van-loading size="16px" v-if="!finished">加载中...</van-loading>
      <div class="finished" v-else>我是有底线的</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .box {
    padding: 20px;
    min-height: 100%;
    background-color: #f0f2f7;
    .top-box {
      display: flex;
      align-items: center;
      width: 100%;
      height: 196px;
      background: #4b7aff;
      box-shadow: 0px 4px 16px 0px rgba(75, 122, 255, 0.3);
      border-radius: 16px;
      .top-box-left,
      .top-box-right {
        flex: 1;
        line-height: 1.6;
      }
      hr {
        width: 2px;
        height: 36px;
        background-color: #3967e1;
        color: #3967e1;
        border: 2px solid #3967e1;
      }
      .title {
        font-size: 26px;
        font-weight: 400;
        color: #c7d5fe;
      }
      .num {
        font-size: 44px;
        font-weight: 500;
        color: #fff;
      }
    }
    .card-ul {
      margin-top: 24px;
      background: #fff;
      border-radius: 16px;
      text-align: left;
      .card-li {
        .time-title {
          height: 88px;
          padding-left: 24px;
          font-size: 30px;
          font-weight: 500;
          color: #1c1c1e;
          border-bottom: 2px solid #f0f2f7;
          line-height: 88px;
        }
        .detail-ul {
          padding: 24px 24px 0;
          font-size: 28px;
          color: #1c1c1e;
          font-weight: 400;
          .detail-li {
            display: flex;
            justify-content: space-between;
            padding-bottom: 24px;
            overflow: scroll;
            overflow-y: hidden;
            div:last-child {
              font-size: 28px;
              font-weight: 500;
              color: #1c1c1e;
            }
          }
        }
      }
    }
    .bottom-loading {
      padding-top: 24px;
      .finished {
        color: #969799;
        font-size: 28px;
      }
    }
  }
</style>
