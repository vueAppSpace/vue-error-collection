<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-14 09:50:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-27 10:44:49
 * @FilePath: \lk-xinaohealth-h5\src\page\physicalTestRecords\index.vue
 * @Description: 体测记录
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import iconData from "./data";

  import { Toast } from "vant";
  import { getWeightPageList } from "@/service/classReservations";
  import _get from "lodash.get";
  import { jumpToSportGym } from "@/utils/jumpToSportGym";

  export default defineComponent({
    setup(_, context) {
      console.log("physicalTestRecords...");

      const { zgStatistics, $router: router, $route: route } = context.root;
      const state = reactive({
        pageParams: {
          pageOffset: 0,
          pageLimit: 10
        },

        quickTime: 0,
        navTitle: ""
      });

      const { navTitle } = route.query;
      state.navTitle = navTitle;

      onMounted(() => {
        if (navTitle === "体测记录") {
          queryPageDataFn();
        }
      });

      async function queryPageDataFn() {
        try {
          // const { code, message, data } = await import(
          //   "@/mock/getWeightPageList.json"
          // );
          const { code, message, data } = await getWeightPageList(state.pageParams);

          const weightPageList = _get(data, "data.list") || [];
          if (code === 0) {
            if (weightPageList.length) {
              state.quickTime = dayjs(weightPageList[0].createTime).format("YYYY-MM-DD HH:mm:ss");
            }
          } else {
            console.log(message || "查询称重记录失败!");
          }
        } catch (err) {
          console.log("physicalTestRecords index queryPageDataFn err: " + err);
        }
      }

      const jumpTo = ({ url }) => {
        if (!url) return console.error("服务-url配置异常", url);

        if (url.includes("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      };

      // 卡片事件函数
      const eventFn = {
        维塑体测仪: () => jumpToSportGym({ type: 6 }),
        场馆预约: () => jumpToSportGym({ type: 4 })
      };

      // 点击卡片: 默认调用上方事件函数 若无 跳转数据中的url
      const onClick = item => {
        const T = new Map(Object.entries(eventFn));
        const fn = T.get(item.name);
        fn ? fn(item) : jumpTo(item);
      };

      return {
        ...toRefs(state),
        onClick,
        iconData
      };
    }
  });
</script>

<template>
  <div class="physicalTestRecords">
    <div class="item-card-list">
      <div
        class="item-card-outer"
        :style="{ backgroundImage: `url(${item.picture})` }"
        v-for="(item, index) of iconData[navTitle]"
        :key="index"
        @click="onClick(item)"
      >
        <div :style="{ backgroundImage: item.picture }"></div>
        <!-- <van-badge :content="quickTime && navTitle === '体测记录' ? 'NEW' : ''" color="#ED6066"> -->
        <div :class="['titleArea', navTitle === '预约记录' ? 'mt40' : '']">
          <div class="title">{{ item.name }}</div>
          <img
            src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/arrowRight.png"
          />
        </div>
        <!-- </van-badge> -->
        <div class="time" v-if="quickTime && item.name === '快快体脂秤'">
          {{ quickTime }}
        </div>
      </div>

      <!-- <div class="item-card-outer jhjj" @click="handleCardItemClick(2)">
        <div class="titleArea">
          <div class="title">维塑体测仪</div>
          <img
            src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/arrowRight.png"
          />
        </div>
        <div class="time" v-show="false">2022.11.22 11:30:20</div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .physicalTestRecords {
    font-size: 0.3rem;
    min-height: 100%;
    background: #f7f9ff;
    padding: 0 32px;
    text-align: left;

    .item-card-list {
      padding-top: 32px;

      .item-card-outer {
        // background-image: url(http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/quickBg2.png);
        background-size: contain;
        height: 240px;
        padding-top: 48px;
        padding-left: 44px;
        margin-bottom: 32px;
        background-repeat: no-repeat;

        // &.jhjj {
        // background-image: url(http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/jhjjBg.png);
        // }

        .titleArea {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .title {
            height: 56px;
            font-size: 40px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 56px;
          }

          img {
            display: block;
            width: 14px;
            height: 24px;
            margin-left: 12px;
          }
        }

        .time {
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 40px;
          margin-top: 10px;
        }
      }

      ::v-deep .van-badge {
        border-bottom-left-radius: 0;
        min-width: 88px;
        height: 40px;
        background: #f86e11;
        border-radius: 20px 24px 24px 0px;
        line-height: 40px;
        border: none;
      }

      ::v-deep .van-badge--fixed {
        transform: translate(108%, -55%);
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
  .mt40 {
    margin-top: 40px;
  }
</style>
