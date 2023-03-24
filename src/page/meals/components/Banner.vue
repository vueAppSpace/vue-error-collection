<template>
  <div class="banner-box" v-if="isRightPath">
    <van-swipe :autoplay="!isService ? 5000 : 0" :touchable="!isService">
      <van-swipe-item v-for="(item, index) in swiperData" :key="item.id">
        <div class="swipe-item">
          <div
            class="top-box"
            :style="{ background: `url(${item.imgUrl}) no-repeat center center / 100% 100%` }"
            @click="playVideo(item.videoUrl, item.extInfo, item)"
          >
            <div :class="['title', { 'title-white': index === 0 }]">{{ item.title }}</div>
            <div class="content-box">
              <component :is="componentId(index)" :item="item"></component>
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
    <!-- :style="{ height: '90%' }" -->
    <!--  -->
    <van-popup :class="['video-popup', { activeIphoneX: isIosX }]" v-model="showPlay" closeable get-container="#app">
      <video-player
        v-if="showPlay"
        ref="videoPlayer"
        :webkit-playsinline="true"
        :x-webkit-airplay="true"
        :playsinline="true"
        :options="playerOptions"
      ></video-player>
    </van-popup>
  </div>
</template>

<script>
  import {
    getUserNutrTargetRatio,
    healtheverydaystudyList,
    healthcareList,
    exerciseRecommand,
    exerciseTarget
  } from "@/service/api";
  import SportRecommend from "./SportRecommend";
  import DietRecommend from "./DietRecommend";

  import { isIosX } from "@/utils/isIosX";
  import { videoRecordStart, videoRecordEnd } from "@/hooks/useVideo";

  export default {
    data() {
      return {
        isIosX: isIosX,
        currentRate: 0,
        swiperData: [],
        showPlay: false,
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.25, 1.5, 2.0], //播放速度
          autoplay: false, // 是否自动播放。
          muted: false, // 是否静音播放，默认情况下将会消除任何音频。
          loop: false, // 是否循环播放。
          // preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          preload: "none",
          language: "zh-CN",
          // aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          aspectRatio: "16:9",
          fluid: false, // 是否流体从而按比例缩放以适应其容器。
          flash: { hls: { withCreadentials: false } }, //可以播放rtmp视频
          html5: { hls: { withCreadentials: false } }, //可以播放m3u8视频
          sources: [
            {
              type: "video/mp4",
              src: "" // 视频url地址
            }
          ],
          poster: "", // 封面地址
          width: "100%",
          notSupportedMessage: ".", // 当无法播放时允许覆盖Video.js，显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true
          }
        }
      };
    },
    computed: {
      isRightPath() {
        const path = this.$route.path;
        return path === "/health" || path === "/service";
      },
      isService() {
        return "/service" === this.$route.path;
      }
    },
    watch: {
      showPlay(newValue) {
        if (!newValue) {
          videoRecordEnd();
        }
      }
    },
    components: {
      SportRecommend,
      DietRecommend
    },
    activated() {
      if (!this.isRightPath) return;
      this.init();
    },
    methods: {
      async init() {
        const resultArr = await Promise.all([
          this.healtheverydaystudyListFn(),
          this.healthcareListFn(),
          this.getUserNutrTargetRatioFn(),
          this.exerciseTargetFn()
        ]);

        // todo 1、每日一修没数据，健康关怀有数据；
        // 2、每日一修的数据和健康关怀的数据不对应；
        // 3、健康关怀的3条数据顺序不保障，也可能请求3条返回的不是3条数据，返回的2条数据，无法准确匹配；
        // 4、运动无数据的情况；
        // 5、运动有数据健康关怀没数据怎么显示
        this.swiperData = [];
        // console.log("result：", resultArr);
        const prefixUrl = "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/";
        if (resultArr[0]) {
          // 每日一修有数据
          const temp = resultArr[0][0];

          // console.log('resultArr[1][0]', resultArr[1])
          this.swiperData.push({
            title: temp.info,
            headerUrl: `${prefixUrl}avatar.png`,
            ...temp,
            info: ""
          });
        }
        if (resultArr[2]) {
          const tempArr = [];
          for (const key in resultArr[2].supply_energy_ratio) {
            if (Object.hasOwnProperty.call(resultArr[2].supply_energy_ratio, key)) {
              const element = resultArr[2].supply_energy_ratio[key];
              tempArr.push({ name: this.formatterData(key).name, rate: element, color: this.formatterData(key).color });
            }
          }

          tempArr.unshift(tempArr.pop());

          this.swiperData.push({
            title: "吃多少适合你?",
            imgUrl: `${prefixUrl}kaluli.png`,
            headerUrl: `${prefixUrl}avatar.png`,
            circleData: tempArr,
            // ...resultArr[1][1],
            ...resultArr[2]
          });
        }

        if (resultArr[3]) {
          // 运动推荐有数据
          this.swiperData.push({
            title: "燃烧我的卡路里!",
            imgUrl: `${prefixUrl}pangpangni.png`,
            headerUrl: `${prefixUrl}avatar.png`,
            ...resultArr[3]
          });
        }

        for (let item of resultArr[1]) {
          // console.log('itemxxx', item)
          if (item.type == 1) {
            this.swiperData[0].info = item.info;
          } else if (item.type == 2) {
            if (this.swiperData[1]) {
              this.swiperData[1].info = item.info;
            }
          } else if (item.type == 3) {
            if (this.swiperData[2]) {
              this.swiperData[2].info = item.info;
            }
          }
        }

        console.log("this.swiperData真的数据：", this.swiperData);
      },
      playVideo(url, extInfo, item) {
        this.zgStatistics("健康新奥-健康-点击banner", {
          banner名称: item.info,
          跳转内容链接: url
        });
        if (!url) return;
        this.playerOptions.sources[0].src = url;
        this.showPlay = true;
        // console.log("url", url);
        // console.log("extInfo", extInfo);
        let domVideo = "";
        // 延迟1s留出组件加载及视频加载时间
        this.$nextTick().then(() => {
          // console.log("this.refs", this.$refs);
          domVideo = document.getElementsByClassName("vjs-fluid");
          if (extInfo) {
            if (extInfo.height > extInfo.width) {
              domVideo[0].style.height = "100vh";
            }
          }

          setTimeout(() => {
            this.$refs.videoPlayer.player.play();
            videoRecordStart({ name: item.info, type: item.source });
          }, 80);
        });
      },
      componentId(index) {
        switch (index) {
          case 1:
            return DietRecommend;
          case 2:
            return SportRecommend;
        }
      },
      // 每日一修
      async healtheverydaystudyListFn() {
        const params = {
          status: 1,
          pageNum: 1,
          pageSize: 1,
          startTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        try {
          const { code, data, message } = await healtheverydaystudyList(params);
          // console.log("每日一修data:", data);
          if (code === 0) {
            return data;
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      },
      // 健康关怀
      async healthcareListFn() {
        const params = {
          status: 1,
          pageNum: 1,
          pageSize: 3,
          startTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          endTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        try {
          const { code, data, message } = await healthcareList(params);
          console.log("健康关怀data:", data);
          if (code === 0) {
            return data;
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      },
      // 饮食推荐的比率
      async getUserNutrTargetRatioFn() {
        try {
          const { code, data, message } = await getUserNutrTargetRatio();
          if (code === 0) {
            // console.log("吃多少适合你data:", data);
            return data;
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      },
      // 运动推荐
      async exerciseTargetFn() {
        try {
          const { code, data, message } = await exerciseTarget();
          if (code === 0) {
            return data;
          } else {
            console.log(message);
          }
        } catch (error) {
          console.log(error.message);
        }
      },
      formatterData(str) {
        const map = new Map([
          ["fat_ser", { name: "脂肪", color: "#F09918" }],
          ["protein_ser", { name: "蛋白质", color: "#4B7AFF" }],
          ["caobon_water_ser", { name: "碳水", color: "#8476FF" }]
        ]);

        return map.get(str);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../style/meal.css";

  .banner-box {
    padding: 0 32px;
    .van-swipe {
      border-radius: 0.16rem;
      box-shadow: 0px 8px 16px 0px rgba(145, 149, 161, 0.2);
      .swipe-item {
        .top-box {
          height: 282px;
          border-radius: 16px 16px 0px 0px;
          padding: 24px 32px;
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
  .video-popup {
    width: 100%;
    background-color: transparent;
  }
  .activeIphoneX {
    /* position: absolute;
    top: 64px;
    right: 16px; */
    ::v-deep.van-popup__close-icon--top-right {
      top: 108px;
      font-size: 64px;
    }
  }
</style>
