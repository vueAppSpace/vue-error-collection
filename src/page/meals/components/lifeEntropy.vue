<script>
  import { defineComponent, reactive, toRefs, watchEffect } from "@vue/composition-api";
  import LifeEntropyAnimate from "./lifeEntropyAnimate.vue";
  import tips from "@/components/Tips.vue";
  import useQuestions from "@/hooks/useQuestions";
  import useEntropy from "./useEntropy";
  import { mostKeepTwoDecimal } from "@/utils/index";

  const balanceList = [
    {
      name: "平衡",
      level: 1,
      color: "#4DC67B",
      icon: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/green-icon.png"
    },
    {
      name: "轻度失衡",
      level: 2,
      color: "#F1C00E",
      icon: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/yellow-icon.png"
    },
    {
      name: "中度失衡",
      level: 3,
      color: "#F57D35",
      icon: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/orange-icon.png"
    },
    {
      name: "重度失衡",
      level: 4,
      color: "#FF5454",
      icon: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/red-icon.png"
    }
  ];
  export default defineComponent({
    name: "LifeEntropy",
    components: {
      LifeEntropyAnimate,
      tips
    },
    emits: ["toggleLoading"],
    setup(_, ctx) {
      const { _router: router } = ctx.root;

      /* 生命熵值 */
      const state = reactive({
        entropyData: null,
        idealRotate: -25,
        realRotate: -25,
        showTips: false,
        isResponded: false
      });

      let afterDate = "";

      // initEntropyData();
      async function initEntropyData() {
        if (afterDate) ctx.emit("toggleLoading", true);
        const { entropyData, isResponded, status } = await useEntropy(afterDate);
        if (afterDate) {
          ctx.emit("toggleLoading", false);
          afterDate = "";
        }
        if (status === 200) state.entropyData = entropyData;
        entropyData.rank = mostKeepTwoDecimal(entropyData.rank * 100);
        state.isResponded = isResponded;
      }

      // 角度：-25deg 到 25deg；值：0 - 100
      watchEffect(() => {
        if (state.entropyData && state.entropyData.aiResult) {
          const idealValue = state.entropyData.aiResult.ideal_ent.entropy_mapped;
          const realValue = state.entropyData.aiResult.real_ent.entropy_mapped;
          state.idealRotate = (idealValue / 100) * 50 - 25;
          state.realRotate = (realValue / 100) * 50 - 25;
        }
      });

      // 跳转到问卷
      const { queryQuestions } = useQuestions();
      async function goTest() {
        const { status, seqNo, inquiryNo } = await queryQuestions();
        if (status === 1) {
          afterDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
          router.push({
            path: "/evaluate",
            query: { seqNo, inquiryNo }
          });
        }
      }

      return {
        dayjs,
        balanceList,
        ...toRefs(state),
        goTest,
        initEntropyData
      };
    },
    activated() {
      if (!this.entropyData) {
        this.initEntropyData();
      }
    }
  });
</script>

<template>
  <div class="life-entropy-content">
    <div class="block-box" v-if="!isResponded"></div>
    <template v-else>
      <div class="no-entropy" v-if="!entropyData">
        <img
          class="wen-icon"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/wenhao.png"
          alt=""
        />
        <div
          class="test-btn"
          @click="goTest"
          v-track="{
            name: '健康新奥-生命熵-点击测试',
            data: `{&quot;页面名称&quot;: &quot;健康&quot;}`
          }"
        >
          测测生命熵
        </div>
        <div class="title font-medium">生命熵越低，身体越健康</div>
        <div class="content">生命熵是评估生命系统平衡度的指标 熵值越低，身体越平衡，身体状况越好</div>
      </div>

      <div class="top-content" v-if="entropyData">
        <div class="entropy-value">
          <div
            class="title"
            @click="showTips = true"
            v-track="{
              name: '健康新奥-生命熵-点击问号',
              data: `{&quot;内容名称&quot;: &quot;生命熵&quot;}`
            }"
          >
            <img
              class="title-icon"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/life-entropy.png"
              alt=""
            />
            <img
              class="wen-icon"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/xiaowenhao.png"
              alt=""
            />
          </div>
          <div class="content">
            <div class="value font-semibold">{{ entropyData.entropyVal }}</div>
            <div class="time font-regular">{{ entropyData.time }}</div>
          </div>
        </div>
        <div class="entropy-balance">
          <div class="balance-name">
            <div
              class="name font-regular"
              :class="{
                'name-active': item.level === entropyData.level
              }"
              v-for="(item, index) in balanceList"
              :key="index"
            >
              <div :style="{ background: item.level === entropyData.level ? item.color : 'transform' }">{{
                item.name
              }}</div>
            </div>
          </div>
          <div class="balance-icon">
            <div class="icon" v-for="(item, index) in balanceList" :key="index">
              <img :class="{ active: item.level === entropyData.level }" :src="item.icon" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div class="middle-content" v-if="entropyData">
        <div class="entropy-value">
          <div class="title font-regular">理想生命熵</div>
          <div v-if="entropyData.aiResult" class="value font-medium">{{
            entropyData.aiResult.ideal_ent.entropy_mapped
          }}</div>
          <!-- 扇形动画 -->
          <div class="entropy-line">
            <img
              class="circle-line"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/line.png"
              alt=""
            />
            <div class="circle-radius black-arrow" :style="`transform: translate(-50%) rotateZ(${idealRotate}deg)`">
              <img
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/black-arrow.png"
                alt=""
              />
            </div>
            <div class="circle-radius red-arrow" :style="`transform: translate(-50%) rotateZ(${realRotate}deg)`">
              <img
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/red-arrow.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="entropy-age">
          <div class="pk">
            <div class="content">
              <div class="title font-regular">您的熵龄</div>
              <div v-if="entropyData.aiResult" class="value font-medium">{{
                entropyData.aiResult.real_ent.refer_ent.ent_age
              }}</div>
            </div>
            <div class="content">
              <div class="title font-regular">实际年龄</div>
              <div class="value font-medium">{{ entropyData.age }}</div>
            </div>
          </div>
          <div class="percent font-regular">超过了{{ entropyData.rank }}%的同龄人</div>
        </div>
      </div>
    </template>

    <LifeEntropyAnimate />

    <div class="entropy-dec font-regular" v-if="entropyData">
      {{ entropyData.levelExplain }}
    </div>

    <tips :value.sync="showTips" title="生命熵" titleNum="" :exp="0">
      <template>
        <div class="tips-content">
          生命熵是从信息、能量、物质三个维度评估生命系统平衡度的指标。
          熵值越低，身体越平衡，健康状态越好；反之，身体越失衡，健康风险越高。
        </div>
      </template>
    </tips>
  </div>
</template>

<style lang="scss" scoped>
  .life-entropy-content {
    .block-box {
      height: 390px;
    }
    .no-entropy {
      margin: 46px 0 30px;
      color: #414f5d;
      .wen-icon {
        width: 162px;
        height: 148px;
        display: block;
        margin: 0 auto 20px;
      }
      .test-btn {
        width: 200px;
        height: 60px;
        border-radius: 4px;
        background: #4b7aff;
        font-size: 28px;
        line-height: 60px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0 auto 34px;
      }
      .title {
        font-size: 28px;
        line-height: 40px;
        margin-bottom: 8px;
      }
      .content {
        width: 408px;
        margin: 0 auto;
        font-size: 24px;
        line-height: 34px;
      }
    }

    .top-content {
      display: flex;
      justify-content: space-between;
      padding: 0 30px;
      margin-bottom: 60px;
      .entropy-value {
        .title {
          display: flex;
          margin-bottom: 26px;
          .title-icon {
            width: 96px;
            height: 32px;
            display: block;
            margin-top: 6px;
            margin-right: 8px;
          }
          .wen-icon {
            width: 24px;
            height: 24px;
            display: block;
          }
        }
        .content {
          width: 214px;
          .value {
            font-size: 80px;
            line-height: 80px;
            color: #ff3e2f;
            margin-bottom: 8px;
          }
          .time {
            font-size: 20px;
            line-height: 20px;
            color: #414f5d;
          }
        }
      }
      .entropy-balance {
        position: relative;
        z-index: 10;
        display: flex;
        justify-content: right;
        align-items: center;
        .balance-name {
          width: 136px;
          height: 180px;
          padding-top: 10px;
          .name {
            width: 100%;
            height: 40px;
            position: relative;
            div {
              position: absolute;
              right: 14px;
              top: 50%;
              transform: translateY(-50%);
              font-size: 24px;
              line-height: 24px;
              white-space: nowrap;
              color: rgba(65, 79, 91, 0.7);
            }
          }
          .name-active {
            padding-right: 6px;
            div {
              right: 8px;
              padding: 4px 16px 6px;
              border-radius: 28px;
              font-size: 26px;
              line-height: 26px;
              color: #ffffff;
            }
          }
        }
        .balance-icon {
          width: 40px;
          height: 180px;
          border-radius: 34px;
          background: #c5dced;
          padding-top: 10px;
          .icon {
            width: 40px;
            height: 40px;
            position: relative;
            img {
              width: 28px;
              height: 28px;
              display: block;
              margin: 0 auto;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
            .active {
              width: 40px;
              height: 40px;
            }
          }
        }
      }
    }
    .middle-content {
      display: flex;
      justify-content: space-between;
      padding: 0 28px;
      color: #414f5d;
      margin-bottom: 36px;
      .entropy-value {
        .title {
          font-size: 24px;
          line-height: 24px;
          margin-bottom: 2px;
        }
        .value {
          font-size: 36px;
          line-height: 36px;
        }
        .entropy-line {
          position: relative;
          .circle-line {
            width: 250px;
            height: 42px;
            display: block;
          }
          .circle-radius {
            width: 50px;
            height: 260px;
            // background: rgba(0, 0, 0, 0.1);
            position: absolute;
            left: 50%;
            top: -220px;
            transform: translateX(-50%) rotateZ(0deg);
            transform-origin: 50% 0;
          }
          .black-arrow {
            height: 255px;
            transform: translateX(-50%) rotateZ(-25deg);
            img {
              width: 16px;
              height: 20px;
              display: block;
              position: absolute;
              left: 50%;
              bottom: 0px;
              transform: translateX(-40%) rotateZ(340deg);
            }
          }
          .red-arrow {
            height: 265px;
            transform: translateX(-50%) rotateZ(25deg);
            img {
              width: 24px;
              height: 28px;
              display: block;
              position: absolute;
              left: 50%;
              bottom: -28px;
              transform: translateX(-65%) rotateZ(343deg);
            }
          }
        }
      }
      .entropy-age {
        .pk {
          width: 286px;
          height: 80px;
          background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lifeEntropy/pk-bg.png")
            no-repeat;
          background-size: 100% 100%;
          display: flex;
          justify-content: space-between;
          padding: 8px 34px 0;
          margin-bottom: 10px;
          .content {
            .title {
              font-size: 20px;
              line-height: 28px;
            }
            .value {
              font-size: 36px;
              line-height: 36px;
            }
          }
        }
        .percent {
          font-size: 24px;
          line-height: 24px;
        }
      }
    }
    .entropy-dec {
      margin: 30px auto 0;
      width: 700px;
      height: auto;
      border: 2px solid #e6ecff;
      border-radius: 16px;
      padding: 30px 31px 36px;
      font-size: 30px;
      color: #414f5b;
      text-align: left;
    }
  }
  .tips-content {
    padding: 0 48px 24px;
    text-align: left;
  }
</style>
