<!--
 * @Description: 健康百科
 * @Author: WANGCHENGAE
 * @Date: 2022-1-5 11:00:30
 * @LastEditTime: 2023-03-23 17:36:40
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, computed } from "@vue/composition-api";
  import { Toast } from "vant";
  import { queryArticleDetail, addArticleReadNum } from "@/service/healthEncyclopedia/index";

  export default defineComponent({
    props: {
      id: {
        type: [String, Number],
        default: "" | 0
      }
    },

    setup({ id }, context) {
      console.log("healthEncyclopedia detail...");

      const state = reactive({
        articleInfo: {}
      });

      onMounted(async () => {
        queryArticleDetailFn();
        addArticleReadNumFn();
      });

      const time = computed(() => {
        return state.articleInfo.gmtCreate;
      });

      async function queryArticleDetailFn() {
        const toast = Toast.loading({
          duration: 0,
          forbidClick: true
        });
        const { code, message, data } = await queryArticleDetail({ id });
        toast.clear();
        if (code === 0 && data) {
          state.articleInfo = data;
        } else {
          Toast(message || "未获取到文章详情!");
        }
      }

      async function addArticleReadNumFn() {
        const { code, message } = await addArticleReadNum({ id });
        if (code !== 0) {
          console.log("message", message);
        }
      }

      return {
        ...toRefs(state),
        time
      };
    }
  });
</script>

<template>
  <div class="articles-detail">
    <div class="title">{{ articleInfo.articleName }}</div>
    <div class="time">{{ time }}</div>
    <div class="articleContent" v-html="articleInfo.articleContent"></div>
  </div>
</template>

<style lang="scss" scoped>
  .articles-detail {
    min-height: 100%;
    padding: 32px 30px;
    text-align: left;

    .title {
      font-size: 36px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1b1c1e;
      line-height: 50px;
      word-break: break-all;
    }

    .time {
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9195a1;
      line-height: 34px;
      margin-top: 10px;
    }

    .articleContent {
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1b1c1e;
      line-height: 40px;
      margin-top: 40px;
      word-break: break-all;
    }

    ::v-deep img {
      max-width: 100% !important;
    }
  }
</style>
