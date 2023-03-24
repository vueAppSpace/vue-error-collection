<!--
 * @Description: icon区
 * @Author: IFLS
 * @Date: 2022-05-14 16:02:40
 * @LastEditTime: 2023-03-23 17:41:07
-->
<script>
  import { defineComponent, reactive } from "@vue/composition-api";
  import { Toast } from "vant";

  export default defineComponent({
    setup(_, context) {
      const { $router: router } = context.root;

      const iconData = reactive([
        {
          name: "健身打卡",
          pic: "clock_in.png",
          url: "/guide"
        },
        {
          name: "健康评估",
          pic: "estimate.png",
          url: "/"
        },
        {
          name: "我的档案",
          pic: "file.png",
          url: "/"
        },
        {
          name: "完善信息",
          pic: "info.png",
          url: "/"
        },
        {
          name: "我的活动",
          pic: "activity.png",
          url: "/"
        },
        {
          name: "健康报告",
          pic: "report.png",
          url: "/"
        },
        {
          name: "健康计划",
          pic: "plan.png",
          url: "/"
        }
      ]);

      const jumpTo = url => {
        return Toast("功能建设中");
        router.push(url);
      };
      return {
        iconData,
        jumpTo
      };
    }
  });
</script>

<template>
  <div class="box-card clock-in-box">
    <div class="icon-box" v-for="(item, index) in iconData" :key="index" @click="jumpTo(item.url)">
      <!-- <img :src="require(`https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/${item.pic}`)" class="icon" /> -->
      <div class="icon-name">{{ item.name }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .clock-in-box {
    display: flex;
    flex-wrap: wrap;
    padding: 38px 30px 0 30px;
    margin-bottom: 20px;
    .icon-box {
      width: 25%;
      margin-bottom: 30px;
      img {
        width: 84px;
        height: 84px;
      }
      .icon-name {
        margin-top: -10px;
        font-size: 26px;
        color: rgba(0, 0, 0, 0.7);
      }
    }
  }
</style>
