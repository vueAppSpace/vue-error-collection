<!--
 * @Description: 我的奖品列表
 * @Author: IFLS
 * @Date: 2023-02-03 15:53:34
 * @LastEditTime: 2023-03-28 09:57:11
-->
<script>
  import { defineComponent, toRefs, reactive, onMounted, onBeforeUnmount } from "@vue/composition-api";
  import LotteryButton from "./compontents/LotteryButton";
  import FullLoading from "@/components/Loading";
  import { mineWinnerRecord } from "@/service/lottery";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    components: {
      FullLoading,
      LotteryButton
    },
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const state = reactive({
        loading: false,
        list: [],
        page: {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          pages: 0
        },
        pageLoading: false,
        finished: false
      });

      const jumpTo = url => router.push(url);

      // 查询积分列表
      const queryList = () => {
        state.loading = true;
        mineWinnerRecord(state.page).then(({ code, data, message, page }) => {
          state.loading = false;
          if (code === 0) {
            state.list = state.list.concat(data);
            state.page = page;
            state.pageLoading = false;
            if (state.page.pageIndex < state.page.pages) {
              state.page.pageIndex++;
              state.finished = false;
            } else {
              state.finished = true;
            }
          } else {
            console.log("mineWinnerRecord", message);
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

      // 点击列表按钮
      const onClick = ({ logisticsState, id, prizeType }) => {
        // 已完结状态
        if (logisticsState === "2") return;
        // 其他状态
        let url = logisticsState === "1" && prizeType !== "2" ? "gift" : "express";
        jumpTo(`/lottery-${url}?status=${logisticsState}&id=${id}&type=${prizeType}`);
      };

      onMounted(() => {
        window.addEventListener("scroll", onScroll);
        queryList();
      });

      onBeforeUnmount(() => {
        window.removeEventListener("scroll", onScroll);
      });

      return {
        ...toRefs(state),
        jumpTo,
        onClick
      };
    }
  });
</script>

<template>
  <div class="box">
    <full-loading :loading="loading" />

    <ul class="card-ul">
      <li class="card-li" v-for="(item, index) in list" :key="index">
        <div class="img-box">
          <img class="img" :src="item.prizeImgUrl" alt="" />
        </div>
        <div class="list-box">
          <div class="list-title">{{ item.prizeName }}</div>
          <lottery-button :type="item.logisticsState" @click.native="onClick(item)" />
        </div>
      </li>
    </ul>

    <div class="empty" v-if="list.length === 0 && !loading">暂无数据</div>

    <div class="bottom-loading" v-else>
      <van-loading size="16px" v-if="!finished">加载中...</van-loading>
      <div class="finished" v-else>我是有底线的</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .box {
    padding: 31px;
    min-height: 100%;
    .card-ul {
      .card-li {
        display: flex;
        text-align: left;
        margin-bottom: 31px;
        .img-box {
          width: 192px;
          height: 192px;
          margin-right: 23px;
        }
        .img {
          width: 192px;
          height: 192px;
        }
        .list-box {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-end;
          width: 100%;
          text-align: right;
          .list-title {
            text-align: left;
            font-size: 29px;
            color: #1c1c1e;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            word-break: break-all;
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
    .empty {
      padding-top: 500px;
      font-size: 27px;
    }
  }
</style>
