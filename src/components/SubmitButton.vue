<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-01-03 09:00:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:32:34
 * @FilePath: \lk-xinaohealth-h5\src\components\SubmitButton.vue
 * @Description: ****
-->
<template>
  <div class="button-wrapper" :class="{ isFixed, isActive }" :style="{ width, height }" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      width: {
        type: String,
        default: ""
      },

      height: {
        type: String,
        default: ""
      },

      isFixed: {
        type: Boolean,
        default: false
      },

      isActive: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../style/scss/variable.scss";

  .button-wrapper {
    width: 686px;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    background: #4b7aff;
    color: #fff;
    border-radius: 44px;
    opacity: 0.5;

    &.isActive {
      background: #4b7aff;
      opacity: 1;
    }

    &.isFixed {
      position: fixed;
      bottom: 60px;
      width: calc(100% - 0.6rem * 2) !important;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
