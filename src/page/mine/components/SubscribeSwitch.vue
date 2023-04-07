<!--
 * @Description: 订阅开关
 * @Author: IFLS
 * @Date: 2022-06-01 14:58:04
 * @LastEditTime: 2023-04-07 10:57:11
-->
<script>
  import { defineComponent, reactive, onMounted, toRefs } from "@vue/composition-api";
  import { Toast } from "vant";
  import { querySubscribe, updateSubscribe } from "@/service/mine/index";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    setup() {
      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        subscribeSwitch: true, // 订阅开关
        subscribeId: -1, // 订阅id
        switchLoading: false // 订阅开关loading
      });

      // 查询订阅状态
      const querySubscribeState = () => {
        querySubscribe(userInfo.value.memberCode).then(({ code, data, message }) => {
          if (code === 0) {
            const dt = data[0];
            state.subscribeSwitch = dt.isSubscribe === 1;
            state.subscribeId = dt.id;
          } else {
            console.log("querySubscribe", message);
            // Toast(message)
          }
        });
      };

      // 切换订阅状态
      const onClickSwitch = async () => {
        if (state.switchLoading) return;
        state.switchLoading = true;
        const isSubscribe = state.subscribeSwitch ? 0 : 1;
        try {
          await updateSubscribe({ id: state.subscribeId, isSubscribe });
        } catch (err) {
          Toast(err || "操作失败, 请重试");
        }
        state.switchLoading = false;
      };

      onMounted(querySubscribeState);

      return {
        ...toRefs(state),
        onClickSwitch
      };
    }
  });
</script>

<template>
  <div class="box-card subscribe-box" v-if="subscribeId !== -1">
    <div class="subscribe-content">工间操消息订阅</div>

    <van-switch
      size="24px"
      active-color="#0091FF"
      v-model="subscribeSwitch"
      :loading="switchLoading"
      @click="onClickSwitch"
    />
  </div>
</template>

<style lang="scss" scoped>
  .subscribe-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 30px;
    box-shadow: none;
    .subscribe-content {
      font-size: 30px;
      color: #1e201e;
    }
  }
</style>
