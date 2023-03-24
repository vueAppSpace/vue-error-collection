<!--
 * @Description: 疫情登记
 * @Author: WANGCHENGAE
 * @Date: 2022-11-17 18:00:30
 * @LastEditTime: 2023-03-23 17:32:08
-->
<template>
  <div class="agree-item">
    <!-- {{data.agreeResult}} -->
    <van-checkbox-group v-model="data.agreeResult">
      <template v-for="(item, index) in data.agreeList">
        <van-checkbox :name="item.name" :key="index">
          {{ item.title }}
        </van-checkbox>
      </template>
    </van-checkbox-group>
  </div>
</template>

<script>
  import { defineComponent } from "@vue/composition-api";

  export default defineComponent({
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import "../style/scss/variable.scss";

  .agree-item {
    ::v-deep .van-checkbox {
      flex: 1;
      margin-bottom: 20px;
      align-items: flex-start;
    }

    ::v-deep .van-checkbox__label {
      font-size: 28px;
      color: $secondary-text-color;
    }

    ::v-deep .van-checkbox__icon {
      height: initial;
      line-height: initial;
      position: relative;
      top: 2px;
    }

    ::v-deep .van-checkbox__icon .van-icon {
      width: 32px;
      height: 32px;
      line-height: 0.33rem;
      font-size: 20px;
    }

    ::v-deep .van-checkbox-group--horizontal {
      flex: 1;
    }

    ::v-deep .van-checkbox__label {
      font-size: 28px;
      line-height: 40px;
      text-align: left;
    }
  }
</style>
