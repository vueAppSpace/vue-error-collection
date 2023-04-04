<!--
  * @Description: 首页
  * @Author: IFLS
  * @Date: 2022-04-22 10:06:45
 * @LastEditTime: 2023-03-28 10:14:55
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { checkSource } from "@/utils/ZGdictionary";
  import CardList from "../components/CardList";
  import Tips from "@/components/Tips";
  import intro from "@/utils/intro";
  import { useRoute } from "@/hooks/useRouter";
  import { isIOS, isUniApp } from "@/utils/native/deviceEnv";


  export default defineComponent({
    components: {
      CardList,
      Tips
    },
    setup(_, context) {
      const { $router, zgStatistics } = context.root;
      const route = useRoute($router);

      const state = reactive({
        introVisible: false,
        tips: {
          visible: false,
          exp: 0,
          isNewUser: false
        },
        accompanyDay: 0, // 陪伴天数
        address: "河北省廊坊市",
        isScroll: false
      });

      if (isUniApp) {
        state.address = '天津市';
      }

      // 查询天数
      const queryAccompanyDay = () => {
        const day = JSON.parse(localStorage.getItem("accompanyDay"));
        if (day > 0) {
          state.accompanyDay = day;
        }
      };

      // 查询欢迎提示
      const queryWelcomeTips = () => {
        const point = JSON.parse(localStorage.getItem("loginHealthPoints"));
        const day = JSON.parse(localStorage.getItem("accompanyDay"));
        // 当天首次登陆
        if (point !== 0) {
          state.tips = {
            visible: true,
            exp: point,
            isNewUser: day === 0
          };
        }
      };

      // 获取当前位置
      const queryLocation = () => {
        // #v-ifdef VITE_IFDEF=ICOME
        window.ic &&
          ic.run({
            action: "amap.location",
            success: ({ data }) => {
              state.address = data.city + data.district;
            }
          });
        // #v-endif
      };

      // 点击地图
      const openMap = () => {
        // #v-ifdef VITE_IFDEF=ICOME
        window.ic &&
          ic.run({
            action: "amap.openMap",
            success: ({ data }) => {
              state.address = data.city + data.district;
            }
          });
        // #v-endif  
      };

      // 发送埋点信息
      const sendZhugeData = () => {
        const { source } = route.value.query;
        source &&
          zgStatistics("健康新奥-进入页面", { 来源: checkSource(source), 所属功能模块: "健康", 页面名称: "健康" });
      };

      const init = () => {
        queryLocation();
        queryAccompanyDay();
        sendZhugeData();
        // 查询是否有引导
        intro("introV1").then(() => {
          queryWelcomeTips();
        });
      };

      onMounted(init);

      return {
        ...toRefs(state),
        openMap,
        queryWelcomeTips
      };
    }
  });
</script>

<template>
  <div class="page-box" ref="pageBox">
    <!-- 顶部header -->
    <div class="header">
      <div class="location-box" @click="openMap">
        <img
          class="location"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/location.png"
        />
        <span>{{ address }}</span>
        <img
          class="arrow-right"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/arrow_right.png"
        />
      </div>

      <div class="header-right">
        健康相伴{{ accompanyDay }}天
        <div class="bg-bottom"></div>
      </div>
    </div>

    <!-- 列表卡片 -->
    <card-list />

    <tips :value.sync="tips.visible" :duration="3000" :exp="tips.exp" :is-new-user="tips.isNewUser" />
  </div>
</template>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
