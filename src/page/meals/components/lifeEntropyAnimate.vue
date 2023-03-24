<script>
  import { defineComponent, reactive, computed } from "@vue/composition-api";
  import { getUserNutrTargetRatio, exerciseTarget } from "@/service/api";

  const elementList = [
    { id: 1, imgUrl: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/wuzhi.png" },
    {
      id: 2,
      imgUrl: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/nengliang.png"
    },
    { id: 3, imgUrl: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/xinxi.png" }
  ];
  export default defineComponent({
    name: "ListEntropyAnimate",
    setup() {
      // 目标球
      const targetBallList = reactive([
        {
          name: "卡路里",
          value: 0,
          title: "饮食目标",
          color: "#F9D48A"
        },
        {
          name: "卡路里",
          value: 0,
          title: "运动目标",
          color: "#71FFA0"
        }
      ]);

      const BallList = computed(() => {
        return targetBallList.filter(item => item.value > 0);
      });

      getUserNutrTargetRatio()
        .then(({ code, message, data }) => {
          if (code === 0) {
            targetBallList[0].value = data.nutr_target.heat;
          } else {
            console.log(message);
          }
        })
        .catch(err => {
          console.log(err);
        });

      exerciseTarget()
        .then(({ code, message, data }) => {
          if (code === 0) {
            targetBallList[1].value = data.targetHeat;
          } else {
            console.log(message);
          }
        })
        .catch(err => {
          console.log(err);
        });

      return {
        elementList,
        BallList
      };
    }
  });
</script>

<template>
  <div class="bottom-content">
    <div class="target-ball">
      <div class="ball-item" v-for="(target, index) in BallList" :key="index">
        <div class="ball-box">
          <div class="ball" :style="`border-color: ${target.color}`">
            <div class="ball-data font-medium" :style="`color:${target.color}`">{{ target.value }}</div>
            <div class="ball-name font-regular">{{ target.name }}</div>
          </div>
          <div class="title font-medium">{{ target.title }}</div>
        </div>
      </div>
    </div>
    <div class="people-box ts-3d">
      <div class="body-box ts-3d">
        <img
          class="body"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/people_body.png"
          alt=""
        />
        <img
          class="light"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/people_light.png"
          alt=""
        />
      </div>
      <!-- 旋转元素 -->
      <div class="wrap ts-3d">
        <div
          class="body-element element1 ts-3d"
          :class="`element${index + 1}`"
          v-for="(item, index) in elementList"
          :key="item.id"
        >
          <img class="element-content" :src="item.imgUrl" alt="" />
        </div>
      </div>
    </div>
    <img
      class="floor"
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/people_floor.png"
      alt=""
    />
  </div>
</template>

<style lang="scss" scoped>
  .ts-3d {
    -o-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }
  .bottom-content {
    width: 100%;
    height: 823px;
    position: relative;
    z-index: 10;
    overflow: hidden;
    .target-ball {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 0 36px;
      display: flex;
      flex-wrap: wrap;
      .ball-item {
        margin-bottom: 24px;
        flex-basis: 50%;
        .ball-box {
          width: 180px;
          .ball {
            width: 180px;
            height: 180px;
            border: 32px solid #f9d48a;
            border-radius: 50%;
            margin-bottom: 14px;
            padding-top: 20px;
            .ball-data {
              font-size: 36px;
              color: #e7c151;
            }
            .ball-name {
              font-size: 20px;
              color: #525f6c;
            }
          }
          .title {
            font-size: 32px;
            line-height: 44px;
            color: #525f6c;
          }
        }
      }
      .ball-item:nth-of-type(even) .ball-box {
        margin-left: auto;
      }
    }
    .people-box {
      perspective: 2000px;
      -webkit-perspective-origin: 50% 0%;
      -moz-perspective-origin: 50% 0%;
      -o-perspective-origin: 50% 0%;
      -ms-perspective-origin: 50% 0%;
      perspective-origin: 50% 0%;
      position: relative;
      .body-box {
        position: relative;
        margin-bottom: -20px;
        .body {
          width: 485px;
          height: 739px;
          display: block;
          margin: 0 auto;
        }
        .light {
          width: 320px;
          height: 88px;
          display: block;
          position: absolute;
          left: 50%;
          top: -80px;
          transform: translateX(-50%);
          animation-name: lightLoop;
          animation-duration: 3s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      }
      .wrap {
        position: relative;
        animation: rotate_3D 20s linear infinite;
        .body-element {
          position: absolute;
          left: 50%;
          bottom: -20px;
          .element-content {
            width: 330px;
            height: auto;
            display: block;
            animation: rotate_3D 20s linear infinite reverse;
          }
        }
        .element1 {
          transform: translateX(-50%) rotateY(60deg) translateZ(200px) rotateY(-60deg); // 位移和旋转的顺序很重要，散开时位移的是 Z轴
        }
        .element2 {
          transform: translateX(-50%) rotateY(180deg) translateZ(200px) rotateY(-180deg);
        }
        .element3 {
          transform: translateX(-50%) rotateY(300deg) translateZ(200px) rotateY(-300deg);
        }
      }
    }
    .floor {
      width: 750px;
      height: 184px;
      display: block;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      z-index: -1;
    }
  }

  @keyframes lightLoop {
    0% {
      transform: translate(-50%, -10px) rotateX(0deg);
      opacity: 0;
    }
    5% {
      transform: translate(-50%, 10) rotateX(0deg);
      opacity: 1;
    }
    95% {
      transform: translate(-50%, 720px) rotateX(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 740px) rotateX(0deg);
      opacity: 0;
    }
  }

  @keyframes rotate_3D {
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(180deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
</style>
