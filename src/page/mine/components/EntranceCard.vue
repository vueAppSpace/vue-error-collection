<!--
 * @Description: 动态 体检报告入口
 * @Author: IFLS
 * @Date: 2022-07-08 10:54:05
 * @LastEditTime: 2023-03-28 10:02:36
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import { jumpToDanaoPretreat } from "@/utils/lifeEntropyMethod";
  import jumpToDanao from "@/utils/jumpToDanao";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const jumpTo = (url, param) =>
        param ? router.push({ path: url, query: { type: param, navTitle: "健康综合报告" } }) : router.push(url);

      function reportCardClick() {
        jumpToDanaoPretreat(2, "SJreport", router);
      }

      return {
        jumpTo,
        jumpToDanao,
        reportCardClick
      };
    }
  });
</script>

<template>
  <div class="img-box">
    <!-- 聚合永间 -->
    <img
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/card_report_workout.png"
      alt=""
      @click="jumpToDanao(null, 'sportCenter&exerciseRecord')"
    />
    <img
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/card_dynamic.png"
      alt=""
      @click="jumpTo('/myUpdates')"
      v-track="{
        type: 'click',
        name: '健康新奥-我的-点击卡片',
        data: `{&quot;按钮名称&quot;: &quot;我的动态&quot;, &quot;位置&quot;: &quot;下方卡片&quot;}`
      }"
    />
    <img
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/card_report.png"
      alt=""
      @click="jumpTo('/report-analysis')"
      v-track="{
        type: 'click',
        name: '健康新奥-我的-点击卡片',
        data: `{&quot;按钮名称&quot;: &quot;体检报告&quot;, &quot;位置&quot;: &quot;下方卡片&quot;}`
      }"
    />
    <img
      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/card_report_zonghe2.png"
      alt=""
      @click="reportCardClick()"
      v-track="{
        type: 'click',
        name: '健康新奥-我的-点击卡片',
        data: `{&quot;按钮名称&quot;: &quot;我的画像&quot;, &quot;位置&quot;: &quot;下方卡片&quot;}`
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
  .img-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    img {
      width: 47%;
      height: 160px;
      margin-bottom: 30px;
    }
    img:active {
      filter: brightness(0.8);
      transition: 0.2s;
    }
  }
</style>
