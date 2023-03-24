<!--
 * @Description: 评估
 * @Author: IFLS
 * @Date: 2022-11-22 11:40:24
 * @LastEditTime: 2023-03-23 17:35:10
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import PanelTips from "@/components/PanelTips";
  import PanelList from "@/components/PanelList";
  export default defineComponent({
    components: { PanelList, PanelTips },
    setup() {
      return {};
    }
  });
</script>

<template>
  <div class="page-box">
    <panel-tips>健康早知道!</panel-tips>
    <panel-list>
      <ul>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/assess1.png" />
          体质评估
        </li>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/assess2.png" />
          情志心理评估
        </li>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/assess3.png" />
          慢病风险评估
        </li>
        <li>
          <i></i>
          <i></i>
          <i></i>
        </li>
      </ul>
    </panel-list>
  </div>
</template>
