<!--
 * @Description: 健康百科-文章卡片组件
 * @Author: WANGCHENGAE
 * @Date: 2022-1-5 11:00:30
 * @LastEditTime: 2023-03-23 17:32:09
-->

<template>
  <div class="article-card" @click="handleClick">
    <div class="articleInfo">
      <!-- <div style="font-size: 14px">index: {{ index }}</div>
      <div style="font-size: 14px">id: {{ id }}</div> -->

      <div>
        <div class="name">{{ name }}</div>
        <div class="detail">{{ detail }}</div>
      </div>
      <div class="readNumArea">
        <img
          class="eyeImg"
          src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/eye.png"
        />
        <div class="readNum">{{ readNum }}</div>
      </div>
    </div>

    <div>
      <img class="articleImg" :src="imgUrl" />
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs } from "@vue/composition-api";

  export default defineComponent({
    props: {
      index: {
        type: Number,
        default: 0
      },
      id: {
        type: [String, Number],
        default: "" | 0
      },
      name: {
        type: String,
        default: ""
      },
      detail: {
        type: String,
        default: ""
      },
      content: {
        type: String,
        default: ""
      },
      imgUrl: {
        type: String,
        default: ""
      },
      readNum: {
        type: Number,
        default: 0
      },
      type: {
        type: [String, Number],
        default: "" | 0
      }
    },
    setup({ type, id, name, index }, context) {
      const { emit } = context;

      function handleClick() {
        //console.log("ArticleCard handleClick:", type);
        emit("click", { type, id, name, index });
      }

      return {
        handleClick
      };
    }
  });
</script>

<style lang="scss" scoped>
  @import "../style/scss/variable.scss";
  @import "../style/scss/mixin.scss";

  .article-card {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-bottom: 2px solid #f0f2f7;
    padding-top: 32px;
    padding-bottom: 20px;

    .articleInfo {
      margin-right: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      word-break: break-all;

      .name {
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1b1c1e;
        line-height: 40px;
      }

      .detail {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #737782;
        line-height: 44px;
        margin-top: 12px;
      }
    }

    .readNumArea {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .readNum {
        height: 34px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #b3b3b6;
        line-height: 34px;
        margin-left: 8px;
      }

      .eyeImg {
        width: 32px;
        height: 24px;
      }
    }

    .articleImg {
      width: 264px;
      height: 198px;
      border-radius: 20px;
      display: block;
    }
  }
</style>
