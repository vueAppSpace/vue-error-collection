<template>
  <div class="header-box">
    <div class="left-box">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/chef.png" />
      {{ userPlan.event }}
    </div>
    <div class="right-box" @click="ToastHandle">摄入量记录></div>
  </div>
</template>

<script>
  export default {
    props: {
      userPlan: {
        type: Object,
        default: {}
      }
    },
    methods: {
      ToastHandle() {
        let type = "";
        let typeName = "";
        let sourceName = "健康";
        switch (this.userPlan.event_code) {
          case "zaocan":
            type = 0;
            typeName = "早餐";
            break;
          case "wucan":
            type = 1;
            typeName = "午餐";
            break;
          case "wancan":
            type = 2;
            typeName = "晚餐";
            break;
        }
        localStorage.removeItem("extraindex");

        if (this.$route.path !== "/health") {
          sourceName = "我的";
        }
        this.zgStatistics("健康新奥-餐食-进入摄入量记录", {
          来源: sourceName,
          类别: typeName
        });
        this.$router.push({
          path: "/ADIHistory",
          query: { type }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .header-box {
    height: 60px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-box {
      display: flex;
      align-items: center;
      font-weight: bold;
      img {
        width: 60px;
        height: 60px;
        margin-right: 20px;
      }
    }
    .right-box {
      width: 184px;
      height: 48px;
      border-radius: 44px;
      border: 2px solid #d0d4dc;
      font-size: 24px;
      color: #565961;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
