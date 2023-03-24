<!--
 * @Description: tabbar component
 * @Author: IFLS
 * @Date: 2022-04-22 14:56:59
 * @LastEditTime: 2023-03-23 17:31:46
-->
<script>
  import { defineComponent, onMounted, ref } from "@vue/composition-api";
  import data from "./tabbarData";
  import jumpToDanao from "@/utils/jumpToDanao";
  import checkPermissions, { isEntropy } from "@/utils/permissions";
  import { cleaerRedditCache } from "@/service/user";

  export default defineComponent({
    props: {
      fixPadding: {
        type: Boolean,
        default: true
      }
    },
    setup() {
      const active = ref(0);
      const permission = checkPermissions();

      const onTab = name => {
        // 3级权限用户 评估跳转大脑页面
        if (permission === 3 && name === "评估") {
          cleaerRedditCache();
          jumpToDanao(2, "assess", `&display=${isEntropy()}`);
        }
      };

      onMounted(() => {
        // 处理权限3用户的评估链接
        data.forEach(val => {
          if (val.name === "评估") {
            val.to = permission === 3 ? "" : "/assess";
          }
        });
      });

      return {
        active,
        data,
        onTab
      };
    }
  });
</script>

<template>
  <van-tabbar v-model="active" route :class="fixPadding ? 'pd0' : 'pd50'" style="z-index: 100">
    <van-tabbar-item
      v-for="(item, index) in data"
      :key="index"
      :to="item.to"
      replace
      :id="`tab${index}`"
      @click="onTab(item.name)"
      v-track="{
        type: 'click',
        name: '健康新奥-点击下方功能菜单',
        data: `{&quot;菜单名称&quot;: &quot;${item.name}&quot;}`
      }"
    >
      <span>{{ item.name }}</span>
      <template #icon="props">
        <img :src="props.active ? item.active : item.inactive" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
  .pd0 {
    padding-bottom: 0 !important;
  }
  .pd50 {
    padding-bottom: 50px !important;
  }
</style>
