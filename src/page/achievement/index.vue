<!--
 * @Description: 健康成就
 * @Author: WANGCHENGAE
 * @Date: 2022-12-6 18:00:30
 * @LastEditTime: 2023-04-07 11:23:14
-->
<script>
  import { defineComponent, reactive, toRefs, computed, onMounted } from "@vue/composition-api";

  import { ImgsMap } from "./constant";
  import { Toast } from "vant";
  import { queryUserAchievements } from "@/service/achievement/index";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    props: {
      points: String
    },

    setup({ points }, context) {
      const { zgStatistics, $router: router } = context.root;

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        achievements: [],
        ImgsMap,
        badgeCount: 0
      });

      const userEmpNo = userInfo.value.empNo;

      onMounted(() => {
        getUserAchievements();
      });

      const wallStyle = computed(() => ({
        backgroundImage: `url(${ImgsMap.achi_bg})`
      }));

      async function getUserAchievements() {
        const { code, message, data } = await queryUserAchievements({});
        if (code === 0 && data && data.length) {
          state.achievements = data.map(item => {
            item.own = points >= item.levelMin;
            item.own && state.badgeCount++;
            return item;
          });
        } else {
          Toast(message);
        }
      }

      function handleClick(id, index) {
        const { levelName, own } = state.achievements[index];
        zgStatistics("健康新奥-我的-点击健康成就墙icon", {
          icon名称: levelName,
          状态: own ? "已获得" : "未获得"
        });
        jumpTo(`/achievement-detail?id=${id}`);
      }

      function jumpTo(url) {
        if (url.includes("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      }

      return {
        ...toRefs(state),
        wallStyle,
        handleClick
      };
    }
  });
</script>

<template>
  <div class="achievement">
    <div class="wall" :style="wallStyle">
      <div class="wrap">
        <div class="title">我的成就墙</div>
        <div class="desc">
          累计已获得 <span class="count">{{ badgeCount }}</span> 枚徽章
        </div>
      </div>
    </div>
    <div class="badgeList">
      <div class="badge" v-for="(item, index) in achievements" :key="index" @click="handleClick(item.id, index)">
        <van-badge :content="item.own ? '已获得' : ''" color="#ED6066" v-if="item">
          <img :src="item.badgeImgUrl" />
          <div class="desc">{{ item.levelName }}</div>
        </van-badge>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../style/scss/variable.scss";

  .achievement {
    font-family: PingFangSC-Semibold, PingFang SC;

    .wall {
      height: 320px;
      background-size: cover;
      text-align: left;

      .wrap {
        padding-top: 0.76rem;
        padding-left: 0.48rem;

        .title {
          height: 56px;
          font-size: 40px;
          font-weight: 600;
          color: #1c1c1e;
          line-height: 56px;
        }

        .desc {
          height: 50px;
          font-size: 28px;
          font-weight: 400;
          color: #737782;
          line-height: 40px;
          letter-spacing: 1px;
          margin-top: 8px;

          .count {
            color: #5478f9;
            font-weight: bold;
            font-size: 32px;
          }
        }
      }
    }

    .badgeList {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 40px;
      overflow-x: hidden;
      .badge {
        flex-basis: calc(100% / 3);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: space-between;

        ::v-deep .van-badge {
          border-bottom-left-radius: 0;
          min-width: 88px;
          height: 40px;
          background: #ed6066;
          border-radius: 20px 24px 24px 0px;
          line-height: 38px;
        }

        ::v-deep .van-badge--fixed {
          transform: translate(24%, 8%);
        }

        img {
          width: 100%;
          display: block;
        }

        .desc {
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #1c1c1e;
          line-height: 40px;
        }
      }
    }
  }
</style>
