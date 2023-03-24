<!--
 * @Date: 2023-02-28 15:30:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-23 17:36:32
 * @FilePath: \lk-xinaohealth-h5\src\page\healthEducation\arcitleDetail.vue
-->
<template>
  <div class="container tl" v-if="educationAnswer">
    <!-- 富文本内容 -->
    <div class="content" v-html="educationAnswer"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        educationAnswer: null
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
      let educationAnswer = localStorage.getItem("educationAnswer");
      const regex = new RegExp("<img", "gi");
      if (educationAnswer) {
        educationAnswer = educationAnswer.replace(regex, '<img style="max-width: 100%; height: auto"');
        this.educationAnswer = educationAnswer;
      }
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
