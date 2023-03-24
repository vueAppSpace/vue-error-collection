<!--
 * @Description: 导航栏
 * @Author: IFLS
 * @Date: 2022-08-09 09:58:53
 * @LastEditTime: 2023-03-24 17:53:55
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import { isMobile } from "@/utils/native/deviceEnv";
  import { useNavStore, storeToRefs } from "@/pinia";
  import { useRoute } from "@/hooks/useRouter";

  export default defineComponent({
    setup() {
      const state = reactive({
        isPc: false,
        isShow: true,
        navTitle: ""
      });
      const route = useRoute();

      const { title: piniaTitle, onbackFn } = storeToRefs(useNavStore());
      const { navGoback, oneLevelPage, onback } = useNavStore();

      // 监听pinia中title变化
      watch(
        () => piniaTitle.value,
        val => {
          console.log("val", val);
          state.navTitle = val;
        }
      );

      // 监听路由变化
      watch(route, to => {
        const {
          meta: { title: metaTitle, showNavBar },
          query: { navTitle },
          path
        } = to;

        // meta title > url navTitle > pinia title
        state.navTitle = metaTitle ? metaTitle : navTitle ? navTitle : piniaTitle;

        // 路由meta若传参showNavBar 比重最大 控制显示与否
        if (showNavBar !== undefined) {
          state.isShow = showNavBar;
          return;
        }

        // pc的一级页面 隐藏navbar
        if (oneLevelPage.includes(path) && state.isPc) {
          state.isShow = false;
        } else {
          state.isShow = true;
        }
      });

      const goback = () => {
        // 自定义返回事件
        if (onbackFn.value) {
          onbackFn.value();
          // 调用完成后清空页面注册的事件
          onback(null);
        } else {
          navGoback();
        }
      };

      onMounted(() => {
        state.isPc = !isMobile;
      });

      return {
        ...toRefs(state),
        goback
      };
    }
  });
</script>

<template>
  <van-nav-bar
    v-if="isShow"
    :title="navTitle"
    left-text="返回"
    :left-arrow="true"
    :fixed="true"
    :safe-area-inset-top="true"
    :placeholder="true"
    @click-left="goback"
  />
</template>
