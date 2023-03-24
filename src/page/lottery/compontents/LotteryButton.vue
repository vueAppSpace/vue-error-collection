<!--
 * @Description: 奖品按钮样式
 * @Author: IFLS
 * @Date: 2023-02-07 14:35:19
 * @LastEditTime: 2023-03-23 17:37:18
-->
<script>
  import { defineComponent, computed } from "@vue/composition-api";

  export default defineComponent({
    props: {
      type: {
        default: "1", // 1: 待领取 2:已领取 3:待发货 4:已发货 5:待自提
        type: String
      },
      fixed: {
        default: false,
        type: Boolean
      },
      size: {
        default: "mini", // or normal
        type: String
      }
    },
    setup({ type, fixed, size }) {
      const translateName = type => {
        const val = new Map([
          ["1", "立即领取"],
          ["2", "已领取"],
          ["3", "等待发货"],
          ["4", "查看物流"],
          ["5", "等待自提"]
        ]);
        return val.get(type) || "按钮";
      };

      const btnStyleObj = computed(() => {
        return {
          "fix-btn": fixed,
          "btn-size": size === "mini",
          "bg-grey": type === "2",
          "bg-blue": ["1", "3"].includes(type),
          "bg-white": ["3", "4", "5"].includes(type),
          "color-blue": ["3", "4", "5"].includes(type),
          "btn-border": ["3", "4", "5"].includes(type)
        };
      });

      return {
        btnStyleObj,
        translateName
      };
    }
  });
</script>
<template>
  <button :class="['btn', btnStyleObj]">
    <template v-if="!$slots.default">{{ translateName(type) }}</template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<style lang="scss" scoped>
  .btn {
    width: 606px;
    height: 90px;
    background: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
    border: none;
    border-radius: 50px;
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
    line-height: 44px;
  }

  .fix-btn {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translate(-50%);
  }

  .btn-size {
    width: 169px;
    height: 61px;
    font-size: 27px;
    font-weight: 400;
  }
  .color-blue {
    color: #4b7aff;
  }
  .bg-blue {
    background: #4b7aff;
  }
  .bg-grey {
    background: #d0d4dc;
  }
  .bg-white {
    background: #fff;
  }
  .btn-border {
    border: 2px solid #4b7aff;
  }
</style>
