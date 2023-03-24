<!--
 * @Description: 导航栏
 * @Author: IFLS
 * @Date: 2022-08-09 09:58:53
 * @LastEditTime: 2023-03-23 17:32:25
-->
<script>
  import { isMobile } from "@/utils/native/deviceEnv";
  import { jsBridge } from "@/utils/native/jsBridge";
  import eventBus from "@/utils/eventBus.js";
  import { mapState, useNavStore } from "@/pinia";

  export default {
    data() {
      return {
        oneLevelPage: ["/health", "/guide", "/service", "/union", "/mine", "/themeActivityHome"],
        isPc: false,
        isShow: true,
        navTitle: ""
      };
    },
    computed: {
      ...mapState(useNavStore, ["title"])
    },
    created() {
      const isPc = !isMobile;
      this.isPc = isPc;
    },
    watch: {
      title(val) {
        this.navTitle = val;
      },
      $route(to) {
        const {
          meta: { title, showNavBar },
          query: { navTitle },
          path
        } = to;

        // meta title > url navTitle > pinia title
        this.navTitle = title ? title : navTitle ? navTitle : this.title;

        // 路由meta若传参showNavBar 比重最大 控制显示与否
        if (showNavBar !== undefined) {
          this.isShow = showNavBar;
          return;
        }

        // pc的一级页面 隐藏navbar
        if (this.oneLevelPage.includes(path) && this.isPc) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      }
    },
    methods: {
      goback() {
        const {
          meta: { controlBack },
          query: { backHome, nologin }
        } = this.$route;
        console.warn(`[当前页面路径]: ${location.href}`);

        // meta传参: 页面自行控制回退
        if (controlBack) {
          this.emitBack();
          // url传参: 回到首页
        } else if (backHome) {
          this.$router.replace("/health");
          // url传参: 不登录情况
        } else if (nologin) {
          jsBridge.invoke("closeWebView");
        } else {
          const { path } = this.$route;
          // 非pc的一级页面 点击关闭
          if (this.oneLevelPage.includes(path) && !this.isPc) {
            jsBridge.invoke("closeWebView");
          } else {
            // 下级页面存在history正常回退 注意: 此处不准确 可能多次跳转后 才到达当前页
            if (window.history.length > 1) {
              this.$router.go(-1);
            } else {
              // 下级页面不存在history时 为推送的特定页面 返回到首页
              this.$router.replace("/health");
            }
          }
        }
      },
      emitBack() {
        eventBus.$emit("onback", () => jsBridge.invoke("closeWebView"));
      }
    }
  };
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
