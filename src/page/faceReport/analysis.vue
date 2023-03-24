<!--
 * @Description: 体检报告 报告解读页面
 * @Author: IFLS
 * @Date: 2022-06-23 17:39:01
 * @LastEditTime: 2023-03-23 17:35:58
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
    <medical-report
      v-track="{
        type: 'onload',
        name: '健康新奥-体检报告-进入体检报告内容',
        data: `{&quot;页面类别&quot;: &quot;健康体检报告&quot;}`
      }"
    />
    <!-- 用户自传体检报告 -->
    <user-report
      v-track="{
        type: 'onload',
        name: '健康新奥-体检报告-进入体检报告内容',
        data: `{&quot;页面类别&quot;: &quot;自传健康体检报告&quot;}`
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
  .containter {
    padding: 30px;
  }
</style>
