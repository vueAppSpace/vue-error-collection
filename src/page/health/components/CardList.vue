<!--
 * @Description: 工间操卡片列表
 * @Author: IFLS
 * @Date: 2022-07-22 16:04:50
 * @LastEditTime: 2023-03-28 09:52:29
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { queryExerciseWorkJobList } from "@/service/health/index";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const state = reactive({
        exerciseWorkList: []
      });

      const queryList = () => {
        queryExerciseWorkJobList().then(({ code, data, message }) => {
          if (code === 0) {
            state.exerciseWorkList = data;
          } else {
            //console.log("queryExerciseWorkJobList", message);
            // Toast(message)
          }
        });
      };

      // 跳转详情
      const jumpToDetail = (id, name) => {
        router.push({
          path: "/workBreakExercisesDetail",
          query: { id, name: encodeURI(name) }
        });
      };

      onMounted(queryList);

      return {
        ...toRefs(state),
        jumpToDetail
      };
    }
  });
</script>

<template>
  <ul class="card-box">
    <li
      class="card"
      v-for="item in exerciseWorkList"
      :key="item.id"
      @click="jumpToDetail(item.id, item.jobName)"
      v-track="{
        type: 'click',
        name: '健康新奥-点击工间操banner',
        data: `{&quot;工间操名称&quot;: &quot;${item.jobName}&quot;}`
      }"
    >
      <i class="recommend">推荐</i>
      <img :src="item.jobImg" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .card-box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 40px 30px 20px 30px;
    .card {
      position: relative;
      display: block;
      width: 690px;
      height: 320px;
      overflow: hidden;
      margin-bottom: 40px;
      border-radius: 16px;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
      }
      .recommend {
        position: absolute;
        right: 0;
        top: 0;
        width: 76px;
        height: 40px;
        line-height: 40px;
        background: linear-gradient(90deg, #fe7315 0%, #e55c00 100%);
        border-radius: 0px 16px 0px 20px;
        font-size: 22px;
        font-style: normal;
        color: #fff;
      }
    }
  }
</style>
