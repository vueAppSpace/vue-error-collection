<!--
 * @Description: 司庆排行榜卡片
 * @Author: IFLS
 * @Date: 2022-07-06 15:29:15
 * @LastEditTime: 2023-03-28 10:02:23
-->
<script>
  import { defineComponent, reactive, onMounted, toRefs } from "@vue/composition-api";
  import { mineInfo } from "@/service/ranking";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const state = reactive({
        rankLoading: true,
        userInfo: {}
      });

      const queryRankList = () => {
        const req = { memberCode: localStorage.getItem("memberCode") };
        mineInfo(req)
          .then(({ code, data, message }) => {
            if (code === 0) {
              state.userInfo = data;
            } else {
              console.log("mineInfo", message);
              // Toast(message);
            }
            state.rankLoading = false;
          })
          .catch(() => (state.rankLoading = false));
      };

      const jumpTo = () => router.push("/rankList");

      onMounted(queryRankList);

      return {
        ...toRefs(state),
        jumpTo
      };
    }
  });
</script>

<template>
  <div class="box-card rank-box" @click="jumpTo">
    <div class="rank-title">
      * 8.26健康先锋排行榜 *
      <div class="rank-title-bg"></div>
    </div>

    <van-skeleton round :row="3" style="padding: 0.2rem" :loading="rankLoading">
      <div class="rank-content" @click="jumpTo('/rank')">
        <div class="rank-content-box">
          <div class="num red">{{ userInfo.rank }}</div>
          <div class="rank-content-title">活动名次</div>
        </div>

        <hr />

        <div class="rank-content-box">
          <div class="num yellow">{{ userInfo.healthPoints }}</div>
          <div class="rank-content-title">有效健康积分</div>
        </div>
      </div>
    </van-skeleton>

    <van-notice-bar
      background="#f3f7ff"
      color="#467FFC"
      :scrollable="true"
      text="7月26日 00:00:00-8月26日 23:59:59  每晚12:00统一结算，次日显示前日累计积分。"
    />
  </div>
</template>

<style lang="scss" scoped>
  @import "../mine0/index.scss";
</style>
