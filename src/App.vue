<!--
 * @Author: your name
 * @Date: 2020-09-09 10:38:03
 * @LastEditTime: 2023-04-11 15:03:23
 * @LastEditors: wangcheng357
 * @Description: In User Settings Edit
 * @FilePath: \lk-vite-error-collection\src\App.vue
-->
<template>
  <div v-if="fixTopArea" id="app" :class="{ role3: role == 3 }" :style="`height: calc(100vh - ${safeAreaInsetTop})`">
    <nav-bar />

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <feed-back v-if="$route.meta.showFeedBack && role !== 3" />

    <tabbar v-if="$route.meta.showTab" :fixPadding="fixPadding" />
  </div>
</template>

<script>
  import "./utils/rem";
  import getPermissions from "./utils/permissions";
  import Tabbar from "@/components/Tabbar/index.vue";
  import FeedBack from "@/components/FeedBack.vue";
  import NavBar from "@/components/NavBar.vue";
  import { isIosX } from "@/utils/isIosX";
  import { isIcomeIOS } from "@/utils/native/deviceEnv";
  export default {
    name: "app",
    components: { Tabbar, FeedBack, NavBar },
    data() {
      return {
        role: 0,
        clientHeight: 0,
        timer: null,
        fixTopArea: true,
        fixPadding: isIosX ? false : true,
        safeAreaInsetTop: ""
      };
    },
    watch: {
      // ios手势返回也会导致webview高度失效问题
      $route() {
        if (isIosX) {
          this.setIpxPadding(true);
        }
      }
    },
    created() {
      this.role = getPermissions();
      // 埋点函数
      this.zgStatistics("打开产品", {
        一级分类名称: "SAAS",
        产品名称: "健康新奥"
      });
      this.querySafeArea();
    },
    mounted() {
      if (isIosX) {
        // 获取未受键盘影响的webview高度
        this.clientHeight = this.queryClientHeight();
        // 手机键盘收起后 webview高度会产生变化(iphonex下icome的bug)
        window.addEventListener("focusout", this.setIpxPadding);
      }
    },
    beforeDestroy() {
      if (isIosX) {
        window.removeEventListener("focusout", this.setIpxPadding);
      }
    },
    methods: {
      querySafeArea() {
        const val = getComputedStyle(document.documentElement).getPropertyValue("--sat");
        // ios设备开启的webview有概率获取不到状态栏高度
        if (isIcomeIOS) {
          if (parseInt(val) == 0 || !val) {
            //console.log("重新查询状态栏高度", val);
            setTimeout(() => {
              // v-if重置为false 为了渲染重新渲染视图
              this.fixTopArea = false;
              // 延迟0.1s出发递归
              this.querySafeArea();
            }, 100);
          } else {
            //console.log("最终状态栏高度", val);
            this.safeAreaInsetTop = parseInt(val) + 46 + "px";
            this.fixTopArea = true;
          }
        } else {
          // 安卓&pc设备
          this.safeAreaInsetTop = parseInt(val) + 46 + "px";
        }
      },
      queryClientHeight() {
        return document.documentElement.clientHeight;
      },
      setIpxPadding(isGestureBack) {
        clearTimeout(this.timer);
        this.timer = setTimeout(
          () => {
            const currentClientHeight = this.queryClientHeight();
            if (this.clientHeight !== currentClientHeight) {
              //console.log("键盘变化了");
              this.fixPadding = false;
            }
          },
          // 手机键盘收起后需等过渡动画播放完毕后才更改webview高度 留出2毫秒播放动画时间 手势返回立即触发
          isGestureBack ? 0 : 200
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "./style/common.css";
  @import url("https://at.alicdn.com/t/font_595255_tyajsui49ic.css");
  @import "./style/scss/variable.scss";
  @import "./style/scss/mixin.scss";
  @import "./style/scss/base.scss";
  #app {
    text-align: center;
    width: 100%;
    // height: 100%;
  }

  body {
    font-family: Helvetica, "Microsoft YaHei";
    user-select: none;
    // background: #f9f9f9;
  }
  img {
    font-size: 20px;
  }

  // * {
  //     -webkit-overflow-scrolling: touch;
  // }

  .mint-toast-text {
    color: #ffffff;
  }

  .page-box {
    height: 100%;
    // background: #f9f9f9;
    overflow: scroll;
    padding-bottom: 232px !important;
    -webkit-overflow-scrolling: touch;
  }
  .role3 {
    .page-box {
      padding-bottom: 132px !important;
      .photo-btn {
        bottom: 212px !important;
      }
    }
  }

  // .padding-ipx {
  //   padding-bottom: 282px !important;
  // }

  .box-card {
    background: #fff;
    box-shadow: 4px 4px 26px 10px rgba(0, 0, 0, 0.05);
    border-radius: 16px;
  }
  .red {
    color: #f42e2e;
  }
  .pale-red {
    color: #f55858;
  }
  .yellow {
    color: #f58241;
  }
  .blue {
    color: #467ffc;
  }
  .grey {
    color: #333;
  }
</style>
