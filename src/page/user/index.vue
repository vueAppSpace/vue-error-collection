<!--
 * @Description: 选择用户版面
 * @Author: IFLS
 * @Date: 2022-12-05 14:57:09
 * @LastEditTime: 2023-03-24 17:49:40
-->
<script>
  import { defineComponent, onMounted, reactive, toRefs } from "@vue/composition-api";
  import { Toast } from "vant";
  import { queryUserRole } from "@/service/user";
  import { getCoachToken } from "@/service/service";
  import { useNavStore } from "@/pinia";
  import { jsBridge } from "@/utils/native/jsBridge";

  export default defineComponent({
    setup(_, context) {
      const { $router: router } = context.root;
      const { setTitle, onback } = useNavStore();

      const state = reactive({
        active: 0,
        userInfo: {},
        roleRight: false // 是否有运动中心权限
      });

      const jumpTo = url => {
        if (url.includes("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      };

      const onClick = val => (state.active = val);

      const jumpToThirdPath = async url => {
        try {
          const { code, message, data } = await getCoachToken();
          if (code === 0) {
            const targetUrl = url.replace("{token}", data);
            jumpTo(targetUrl);
          } else {
            Toast(message);
          }
        } catch (err) {
          Toast(err);
        }
      };

      const querUser = async () => {
        const { code, message, data } = await queryUserRole();
        if (code === 0) {
          // 有权限数据
          if (data.length > 0) {
            const dt = data[0];
            // 判断是否有运动中心权限
            if (dt.id) {
              state.userInfo = dt;
              state.roleRight = true;
              setTitle("选择用户");
            } else {
              jumpTo("/health");
            }
          } else {
            jumpTo("/health");
          }
        } else {
          console.log("queryUserRole", message);
        }
      };

      const onBtn = () => {
        if (state.active === 1) {
          jumpTo("/health");
        } else if (state.active === 2) {
          const url = state.userInfo.extInfo.jumpUrl;
          jumpToThirdPath(url);
        }
      };

      onMounted(() => {
        querUser();
        // 监听返回
        onback(() => {
          // 关闭当前页
          jsBridge.invoke("closeWebView");
        });
      });

      return {
        ...toRefs(state),
        jumpTo,
        onClick,
        onBtn
      };
    }
  });
</script>

<template>
  <div class="user-box" v-if="roleRight">
    <div class="avator">
      <van-image round :src="userInfo.userHead" />
      <div class="username">{{ userInfo.userName }}</div>
    </div>

    <div class="title-box">
      <div class="title">请选择您要进入的终端</div>
      <div class="subtitle">健康工作 快乐创值</div>
    </div>

    <ul class="content">
      <li :class="active === 1 && 'li-active'" @click="onClick(1)">
        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/user/user_health.png" alt="" />
        <div>客户端</div>
      </li>
      <li :class="active === 2 && 'li-active'" @click="onClick(2)">
        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/user/user_jhyj.png" alt="" />
        <div>运动中心服务端</div>
      </li>
    </ul>

    <div class="botton-out-box">
      <div
        class="botton-box"
        @click="onBtn"
        v-track="{
          type: 'click',
          name: '健康新奥-点击用户选择确定',
          data: `{&quot;按钮名称&quot;: &quot;${active === 0 ? '客户端' : '运动中心服务端'}&quot;}`
        }"
      >
        <div :class="['button', { 'button-active': active > 0 }]">
          <van-icon name="down" size="30" color="#fff" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
