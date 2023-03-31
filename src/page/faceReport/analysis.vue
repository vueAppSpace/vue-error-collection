<!--
 * @Description: 体检报告 报告解读页面
 * @Author: IFLS
 * @Date: 2022-06-23 17:39:01
 * @LastEditTime: 2023-03-31 13:57:56
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import MedicalReport from "@/page/mine/components/MedicalReport";
  import UserReport from "@/page/mine/components/UserReport";
  export default defineComponent({
    components: {
      MedicalReport,
      UserReport
    }
  });
</script>

<template>
  <div class="containter">
    <!-- 体检报告 -->
    <medical-report />
    <!-- 用户自传体检报告 -->
    <user-report />
  </div>
</template>

<style lang="scss" scoped>
  .containter {
    padding: 30px;
  }
</style>
