<template>
  <div class="container tl" v-if="articleDetaile">
    <!-- 富文本内容 -->
    <div class="content" v-html="articleDetaile.info"></div>
  </div>
</template>
<script>
  import { getUserMission } from "@/service/api";
  export default {
    data() {
      return {
        infoId: null,
        articleDetaile: null
      };
    },
    methods: {
      getUserMissionFn() {
        getUserMission()
          .then(res => {
            if (res.data) {
              const regex = new RegExp("<img", "gi");
              if (res.data.info) {
                res.data.info = res.data.info.replace(regex, '<img style="max-width: 100%; height: auto"');
              }
              this.articleDetaile = res.data;
            }
          })
          .catch(ex => {});
      }
    },
    mounted() {
      this.getUserMissionFn();
    }
  };
</script>

<style scoped lang="scss">
  .container {
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    background: #f7f9f9;
    width: 750px;
    margin: 0 auto;
  }
  .content {
    background: #ffffff;
    padding: 0 30px 0;
    line-height: 1.6;
  }
</style>
