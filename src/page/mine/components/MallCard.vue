<!--
 * @Description: 积分商城卡片
 * @Author: IFLS
 * @Date: 2022-11-15 10:06:47
 * @LastEditTime: 2023-03-31 14:07:52
-->
<script>
  import { defineComponent, reactive, toRefs, onActivated, onMounted, watch } from "@vue/composition-api";
  import { queryTodayData } from "@/service/integralMall";
  import { eMall } from "@/config/env";
  import { jsBridge } from "@/utils/native/jsBridge";
  import { queryUserTopAchievement } from "@/service/achievement/index";
  export default defineComponent({
    props: {
      userInfo: {
        type: Object,
        default: {}
      }
    },
    setup(props, context) {
      const {
        root: { $router: router },
        parent
      } = context;

      const state = reactive({
        taskInfo: {},
        percent: 0, // 任务完成百分比
        topAchievement: {}
      });

      watch(
        () => props.userInfo.totalHealthPoints,
        newValue => {
          if (!newValue) return;
          queryUserTopAchievement({ points: newValue }).then(({ code, data, message }) => {
            if (code === 0 && data) {
              state.topAchievement = data || {};
            } else {
              console.log("queryTopAchievement", message);
            }
          });
        }
      );

      // 查询任务完成进度
      const queryData = () => {
        queryTodayData().then(({ code, data, message }) => {
          if (code === 0) {
            const totalTask = data.sumPerTotalTaskByToday;
            const completeTask = data.sumPerCompleteTaskByToday;
            const percent = totalTask === 0 ? totalTask : (completeTask / totalTask) * 100;
            state.percent = percent;
            state.taskInfo = data;
          } else {
            console.log("queryTodayData", message);
          }
        });
      };

      const jumpTo = url => {
        if (url.includes("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      };

      const jumpToLottery = () => {
        router.push({
          name: "lotteryHome",
          params: { points: props.userInfo.healthPoints }
        });
      };

      const jumpToMall = () => {
        jsBridge.invoke("openWebView", {
          targetUrl: eMall,
          refreshTicket: true,
          extraParame: "&dd_full_screen=true"
        });
      };

      onActivated(queryData);

      onMounted(() => {
        document.addEventListener("resume", () => {
          parent.queryMineData();
          console.log("resume:页面刷新了");
        });
      });

      return {
        ...toRefs(state),
        jumpTo,
        jumpToMall,
        jumpToLottery
      };
    }
  });
</script>

<template>
  <ul class="rank-card">
    <li
      @click="jumpTo('/integral-task')"
      v-track="{
        name: '健康新奥-我的-点击卡片',
        data: `{&quot;按钮名称&quot;: &quot;每日任务&quot;, &quot;位置&quot;: &quot;上方卡片&quot;, &quot;类型&quot;: &quot;顶部卡片&quot;}`
      }"
    >
      <div class="title">每日任务</div>
      <div class="content">
        <div class="content-top">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABFJJREFUWEfFl01oXFUUx3/nvTeTyUwmySRp0iYNtYYSbF1UFNGVJW0sWroRFFyIG925cWEUXAsaQVeudCMuBAU3EmqrDXVXRKQIUUrVWtOknXxNJpM3meR9HHlvMpO8mSSTtuhceJt3z8f/no//uVfY51I9n/TmS+cQRvA5CTwMdGyq54G/MLiGMmkeSEyIfFvcj2lpJKS5kSOeY42p+q+ApBvJl/e1IGJ8YcbccclM3tpLZ1cAqqcsd856F+QdIBEa8X1YtqFYgrV1cNyy7ZgFrS2QTEBnCgyj4rME+r7V674ncmVTOApnRwD56bNdybj/FXA6FF/bgNkFWFwJjUvg0LJANtVVwXXRAFAAsrsd+nugNV7xdrm4YbzUMXhxqTYadQA0OzLkinkB5Ri+wvQc3F2C1gQSfKa5ZxbU89C1IEIlONgFg71gCAg3LPWek77JP7cbiADQ3KlO17GuojLMugPXp8H1kHQaMath3VcZqOejhQJYJgwPQksMRK9bMfcpyVxZrhipAlB90fTmlydUORs6n/obsSykLbUvh7sJ6aqNui6ceCgEIcJF80DnOZGvvUCnCsDLjo758AGeD1M3ETGQ1IM5r4BS20bVhxNHwTQw4G2z7/vxKgBdPd3n2kaQmxQ374SVbnS0P9DJa5X9/Eq5Q44eCrZsK+UPSdvlbBgBJ/vsOOhb2KVy6Ls6ka1WCm05vydxfk3jr5oYbS6x4zaxR+3y3lQK57cUfsHCSLtYJ2zix+1t8QX1fXRpuZyKVNDV8mGs79KY6NTxuNszMAt0c+M2UnKRVHLrAAprF7pD57XLGiqGTtw/tslvClmP2CTPzxPEeysVRTRhwbHDwa9Fa2GmX9y50edVmQhz//N1pDsTOf3GtTSl77rvKx2J0UXijxe2AARRWMzBE8NhLYhwTpzsmY9A3mQhD7fmMDIVei/rrX7Wj79QJZR7AmL0bND2WhDcreXn8nCkF3oCP/qxOHdHryA8ExCO5Oy6tlsZPwJ+w5GxMzBDaR+LjoKwLTOpMkEpPwYpuK3KQEA64imSKNN+ZRU+OYwWrHs6eUVY2lzSb9yO6GqphJoSkpMIM+JkR9fCYRNUv2EiLS0RhbVLXTi/3F9Lxh5bofVslP51fR31vXI3QKkhAD9nsfrpwL2nwVDaXp/ByESHYB2ARikIYU5m2PgpWpyNchJ/Mk9iJFcnVp+CBkUYWFAXil8exJuJ1sduIMyBEsmXs4il9QBqi7BRG1Ys+LaB/Xk/urJ3QUq7S+rVWYyUvyO+ujZsRESRHi6YFL/pxb8TLdSKjHFoneQLcxjpcNDVn34nImpIxTVm1BVKP3ThXItSc+xkgcSZpR3DXjGh9g5UHGzuZxjVHse7E2f9arkwW57OYx7c2LMudx1GYZE1exwHIJp6IQmj0OwrWQiimZfSaqXWXsv/mYPs/3Qtr4Bo6sOkGolmPs22N3TTHqe1rPJfPc//BVjRjcsxLrCKAAAAAElFTkSuQmCC"
            alt=""
          />
          <i>+{{ taskInfo.sumPointsByToday }}</i>
        </div>
        <van-progress color="#FF9C00" :show-pivot="false" :percentage="percent" />
        <div class="content-bottom"
          >已完成：{{ taskInfo.sumPerCompleteTaskByToday }}/{{ taskInfo.sumPerTotalTaskByToday }}</div
        >
      </div>
    </li>

    <li
      @click="jumpTo(`/achievement?points=${userInfo.totalHealthPoints}`)"
      v-track="{
        name: '健康新奥-我的-点击卡片',
        data: `{&quot;按钮名称&quot;: &quot;健康成就&quot;, &quot;位置&quot;: &quot;上方卡片&quot;, &quot;类型&quot;: &quot;顶部卡片&quot;}`
      }"
    >
      <div class="title">健康成就</div>
      <div class="content">
        <div class="content-top pd">
          <img class="mall-img" :src="topAchievement.badgeImgUrl" alt="" />
        </div>
        <div class="content-bottom pt16 c-black">{{ topAchievement.levelName }}</div>
      </div>
    </li>

    <!-- <li
            @click="jumpToLottery"
            v-track="{
                name: '健康新奥-我的-点击卡片',
                data: `{&quot;按钮名称&quot;: &quot;积分抽奖&quot;, &quot;位置&quot;: &quot;上方卡片&quot;, &quot;类型&quot;: &quot;顶部卡片&quot;}`
            }"
        >
            <div class="title">积分抽奖</div>
            <div class="content">
                <div class="content-top pd">
                    <img
                        class="mall-img"
                        src="data:image/png;base64,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"
                        alt=""
                    />
                </div>
                <div class="content-bottom pt16 c-black">剩余积分：{{ userInfo.healthPoints }}</div>
            </div>
        </li> -->

    <!-- // #v-ifdef VITE_IFDEF=ICOME -->
    <li
      @click="jumpToMall"
      v-track="{
        name: '健康新奥-我的-点击卡片',
        data: `{&quot;按钮名称&quot;: &quot;积分商城&quot;, &quot;位置&quot;: &quot;上方卡片&quot;, &quot;类型&quot;: &quot;顶部卡片&quot;}`
      }"
    >
      <div class="title">积分商城</div>
      <div class="content">
        <div class="content-top pd">
          <img
            class="mall-img"
            src="data:image/png;base64,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"
            alt=""
          />
        </div>
        <div class="content-bottom pt16 c-black">剩余积分：{{ userInfo.healthPoints }}</div>
      </div>
    </li>
    <!-- // #v-endif -->

    <li
      @click="jumpTo('/rank')"
      v-track="{
        name: '健康新奥-我的-点击卡片',
        data: `{&quot;按钮名称&quot;: &quot;积分排行&quot;, &quot;位置&quot;: &quot;上方卡片&quot;, &quot;类型&quot;: &quot;顶部卡片&quot;}`
      }"
    >
      <div class="title">积分排行</div>
      <div class="content health-point">
        <div class="content-top">
          <div>{{ userInfo.totalHealthPoints }}</div>
          <div>累计积分</div>
        </div>
        <div class="content-bottom pt16">
          <div>{{ userInfo.rownum }}</div>
          <div>名次</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .rank-card::-webkit-scrollbar {
    display: none;
  }
  .rank-card {
    padding-top: 30px;
    padding-right: 20px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    justify-content: flex-start;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 224px;
      height: 238px;
      margin-right: 12px;
      background: #fff;
      border-radius: 16px;
      flex: 0 0 auto;

      &:last-child {
        margin-right: 0;
      }

      .title {
        width: 160px;
        height: 56px;
        margin: 0;
        background: #fff5e6;
        border-radius: 0px 0px 26px 26px;
        font-size: 28px;
        font-weight: 500;
        color: #f86e11;
        text-align: center;
        line-height: 56px;
      }
      .content {
        display: flex;
        flex-direction: column;
        .van-progress {
          width: 176px;
        }
        .content-top {
          display: flex;
          justify-content: center;
          padding: 34px 0;
          img {
            width: 32px;
            height: 32px;
          }
          .mall-img {
            width: 80px;
            height: 80px;
          }
          i {
            font-size: 28px;
            font-style: normal;
            color: #1c1c1e;
          }
        }
        .content-bottom {
          padding-top: 10px;
          font-size: 26px;
          color: #9195a1;
        }
        .pd {
          padding: 10px;
        }
        .pt16 {
          padding-top: 15px;
        }
        .c-black {
          color: #000;
        }
      }
      .health-point {
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
        .content-top,
        .content-bottom {
          display: flex;
          flex-direction: column;
          padding-top: 20px;
          padding-bottom: 0;
          margin-top: 20px;
          color: #ed6066;
          font-size: 36px;
          :last-child {
            padding-top: 34px;
            font-size: 26px;
            color: #9195a1;
          }
        }
      }
    }
    li:active {
      filter: brightness(0.5);
      transition: 0.2s;
    }
  }
</style>
