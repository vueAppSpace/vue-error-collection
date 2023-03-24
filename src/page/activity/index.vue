<!--
 * @Description: 活动
 * @Author: IFLS
 * @Date: 2022-05-12 15:09:48
 * @LastEditTime: 2023-03-23 17:35:03
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import PanelTips from "@/components/PanelTips";
  import PanelList from "@/components/PanelList";
  import { isIosX } from "@/utils/isIosX";
  export default defineComponent({
    components: { PanelList, PanelTips },
    setup() {
      return {
        isIosX
      };
    }
  });
</script>

<template>
  <div :class="['page-box', isIosX ? 'padding-ipx' : '']">
    <panel-tips>健康活动等您来！</panel-tips>
    <panel-list>
      <ul>
        <li>
          <img src="../../assets/images/icon/born.png" />
          28天燃脂训练营
        </li>
        <li>
          <img src="../../assets/images/icon/ball.png" />
          “羽”众不同青年赛
        </li>
        <li>
          <img src="../../assets/images/icon/play.png" />
          健康三济功法晨练
        </li>
        <li>
          <img src="../../assets/images/icon/food.png" />
          美食健康SHOW
        </li>
        <li>
          <img src="../../assets/images/icon/share.png" />
          发布、转发、分享…
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
