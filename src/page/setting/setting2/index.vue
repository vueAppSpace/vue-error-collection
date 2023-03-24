<!--
 * @Description: 设置页面
 * @Author: IFLS
 * @Date: 2022-06-17 21:32:41
 * @LastEditTime: 2023-03-23 17:42:13
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import SubscribeSwitch from "@/page/mine/components/SubscribeSwitch";

  export default defineComponent({
    components: {
      SubscribeSwitch
    },
    setup(_, context) {
      const { $router: router } = context.root;

      const jumpTo = url => router.push(url);

      return {
        jumpTo
      };
    }
  });
</script>

<template>
  <div class="box">
    <van-cell-group>
      <subscribe-switch />
    </van-cell-group>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../profile/index.scss";
  ::v-deep.subscribe-box {
    padding: 24px 32px !important;
    margin-bottom: 20px !important;
    .subscribe-content {
      color: #565961 !important;
    }
  }
</style>
