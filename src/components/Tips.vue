<!--
 * @Description: 经验值提示
 * @Author: IFLS
 * @Date: 2022-05-12 16:15:42
 * @LastEditTime: 2023-03-23 17:32:36
-->
<script>
  import { defineComponent, toRefs, watch } from "@vue/composition-api";
  export default defineComponent({
    props: {
      // v-model
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: "健康积分"
      },
      titleNum: {
        type: Number | String,
        default: 0
      },
      subTitle: {
        type: String,
        default: ""
      },
      // 经验值
      exp: {
        type: Number,
        default: 1
      },
      // 是否为新用户: 用于判断提示语 优先级低于自定义传入的内容
      isNewUser: {
        type: Boolean,
        default: true
      },
      // 展示时长(ms)，值为0时 不会消失
      duration: {
        type: Number,
        default: 0
      }
    },
    setup(props, context) {
      const { value, duration } = toRefs(props);
      const {
        emit
        // root: { $nextTick: nextTick, $el: el } // 注意: @vue/composition-api bug: 此处解构出的$el是app实例 不是当前组件实例
      } = context;

      watch(
        () => value.value,
        newValue => {
          if (newValue && duration.value > 0) {
            setTimeout(() => {
              emit("update:value", false);
            }, duration.value);
          }
        }
      );

      const onClose = () => {
        emit("update:value", false);
        emit("onClose");
      };

      return {
        onClose
      };
    },
    // $el指向存在bug 改用选项式
    mounted() {
      this.$nextTick(() => {
        const body = document.querySelector("body");
        if (body.append) {
          body.append(this.$el);
        } else {
          body.appendChild(this.$el);
        }
      });
    },
    beforeDestroy() {
      try {
        const body = document.querySelector("body");
        body.removeChild(this.$el);
      } catch (err) {}
    }
  });
</script>

<template>
  <van-popup v-model="value" position="top" class="tips-popup">
    <div class="transmit-box">
      <div class="transmit-box-positive">
        <div class="title">
          <span>{{ title }}</span>
          <span class="value-num" v-if="exp > 0">+{{ exp }}</span>
          <span class="sub-title-num" v-if="titleNum">{{ titleNum }}</span>
          <div>
            <div class="sub-title" v-if="subTitle">{{ subTitle }}</div>
          </div>
        </div>

        <div class="value-info">
          <div v-if="!$slots.default">
            {{ isNewUser ? "亲爱的，欢迎加入我的健康！！！" : "亲爱的，欢迎回来！！！" }}
          </div>
          <div class="pd" v-else>
            <slot></slot>
          </div>
        </div>

        <img
          @click="onClose"
          class="close-circle"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/close_icon.png"
        />
      </div>
      <slot name="button"></slot>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
  .tips-popup {
    height: 100%;
    background-color: transparent !important;
  }
  .transmit-box {
    position: fixed;
    left: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
    text-align: center;

    .transmit-box-positive {
      width: 670px;
      min-height: 238px;
      padding-bottom: 20px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/star-bg.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-color: #fff;
      border-radius: 20px;
      position: relative;
      .title {
        position: relative;
        z-index: 999;
        padding: 34px 0;
        font-size: 34px;
        font-weight: 500;
        color: #1b1c1e;
        .sub-title-num {
          font-size: 44px;
          font-weight: 500;
          color: #f55858;
        }
        .value-num {
          padding-left: 8px;
          font-size: 44px;
          font-weight: 500;
          color: #34c85a;
        }
      }
      .sub-title {
        display: inline-block;
        margin: 12px auto 0;
        padding: 0 8px;
        height: 40px;
        line-height: 40px;
        font-size: 24px;
        color: #fff;
        background: #f55858;
        border-radius: 4px;
      }
      .value-info {
        text-align: center;
        font-size: 28px;
        color: #333;
        line-height: 42px;
      }
      .close-circle {
        position: absolute;
        right: 20px;
        top: 20px;
        z-index: 1000;
        width: 40px;
        height: 40px;
      }
    }
  }
</style>
