<script>
  export default {
    name: "CustomNavBar",
    data() {
      return {
        navTitle: ""
      };
    },
    created() {
      this.navTitle = this.$route.meta.title;
    },
    methods: {
      goBack() {
        const backHome = this.$route.query.backHome;
        // meta传参: 页面自行控制回退
        if (backHome) {
          this.$router.replace("/health");
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
    }
  };
</script>

<template>
  <van-nav-bar
    class="custom-nav-bar"
    :title="navTitle"
    left-text="返回"
    :left-arrow="true"
    :fixed="true"
    :safe-area-inset-top="true"
    :placeholder="true"
    @click-left="goBack"
  />
</template>

<style lang="scss" scoped>
  .custom-nav-bar {
    ::v-deep .van-nav-bar {
      background: transparent;
    }
    ::v-deep .van-nav-bar__title {
      color: #ffffff;
    }
    ::v-deep .van-nav-bar__text {
      color: #ffffff;
    }
    ::v-deep .van-nav-bar .van-icon {
      color: #ffffff;
    }
    ::v-deep .van-hairline--bottom::after {
      border-color: transparent;
    }
  }
</style>
