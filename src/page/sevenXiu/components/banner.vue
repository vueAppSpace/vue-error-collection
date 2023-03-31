<script>
  import { defineComponent, reactive } from "@vue/composition-api";
  import { healtheverydaystudyList, healthcareList } from "@/service/api";
  export default defineComponent({
    emits: ["playVideo", "clickCard"],
    setup(_, ctx) {
      const swiperData = reactive([]);
      getSwiperData();

      // 每日一修
      async function healtheverydaystudyListFn(params) {
        try {
          const { code, data, message } = await healtheverydaystudyList(params);
          if (code === 0) {
            return data;
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
      // 健康关怀
      async function healthcareListFn(params) {
        try {
          const { code, data, message } = await healthcareList({ ...params, pageSize: 3 });
          if (code === 0) {
            return data;
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
      async function getSwiperData() {
        const params = {
          status: 1,
          pageNum: 1,
          pageSize: 1,
          startTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        const prefixUrl = "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/";

        const resultArr = await Promise.all([healtheverydaystudyListFn(params), healthcareListFn(params)]);
        if (resultArr[0] && resultArr[0].length) {
          const data = resultArr[0][0];
          const infoData = resultArr[1].find(item => item.type === "1");
          swiperData.push({
            title: data.info,
            headerUrl: `${prefixUrl}avatar.png`,
            ...data,
            info: infoData ? infoData.info : ""
          });
        }
      }

      const { zgStatistics } = ctx.root;
      function playVideo(data) {
        ctx.emit("clickCard", zgStatistics, { type: "每日一修", name: data.info, link: data.videoUrl });
        ctx.emit("playVideo", { ...data, type: data.source, name: data.info });
      }

      return {
        swiperData,
        playVideo
      };
    }
  });
</script>

<template>
  <div class="banner-box">
    <van-swipe :autoplay="5000">
      <van-swipe-item v-for="(item, index) in swiperData" :key="item.id">
        <div class="swipe-item">
          <div
            class="top-box"
            :style="{ background: `url(${item.imgUrl}) no-repeat center center / cover` }"
            @click.stop="playVideo(item)"
          >
            <div :class="['title', { 'title-white': index === 0 }]">{{ item.title }}</div>
            <div class="play-icon">
              <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/sevenXiu/video_2.png" />
            </div>
          </div>
          <div class="bottom-box">
            <img :src="item.headerUrl" />
            <div class="double-quote">“</div>
            <div class="info-text">{{ item.info }}</div>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style lang="scss" scoped>
  .banner-box {
    .van-swipe {
      border-radius: 0.16rem;
      box-shadow: 0px 8px 16px 0px rgba(145, 149, 161, 0.2);
      .swipe-item {
        .top-box {
          height: 282px;
          border-radius: 16px 16px 0px 0px;
          padding: 24px 32px;
          position: relative;
          .title {
            font-size: 34px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #1c1c1e;
            line-height: 48px;
            height: 48px;
            text-align: left;
            &.title-white {
              color: #ffffff;
            }
          }
          .play-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            img {
              display: block;
              width: 90px;
              height: 90px;
            }
          }
        }
        .bottom-box {
          display: flex;
          align-items: center;
          height: 96px;
          position: relative;
          background-color: #ffffff;
          border-radius: 0px 0px 16px 16px;
          border: 1px solid #e6ecff;
          padding: 0 20px;
          .double-quote {
            position: absolute;
            top: 22px;
            left: 80px;
            color: #3d3e42;
            font-size: 32px;
          }
          img {
            width: 56px;
            height: 56px;
            margin-right: 20px;
          }
          .info-text {
            font-size: 26px;
            font-weight: 400;
            color: #3d3e42;
            line-height: 36px;
          }
        }
      }
    }
  }
</style>
