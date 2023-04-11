<script>
  import { defineComponent, onMounted, reactive, toRefs } from "@vue/composition-api";
  import { queryHealthLevelDetail } from "@/service/achievement/index";
  import CustomNavBar from "./components/CustomNavBar.vue";
  import { ImgsMap } from "./constant";
  import { Toast } from "vant";
  // import { jsBridge } from "@/utils/native/jsBridge";
  // import { pendantCenter } from "@/config/env";

  export default defineComponent({
    components: {
      CustomNavBar
    },
    setup(_, ctx) {
      const { _route: route } = ctx.root;
      const state = reactive({
        levelName: "",
        avatarImgUrl: "",
        badgeImgUrl: "",
        levelDesc: "",
        background: `url(${ImgsMap.x_light_bg}) no-repeat`
      });

      // TODO 待测试 暂时隐藏挂件按钮
      // function goPendantCenter() {
      //     jsBridge.invoke("openWebView", { targetUrl: pendantCenter });
      // }

      onMounted(() => {
        const { id } = route.query;
        queryHealthLevelDetail({ id })
          .then(({ code, message, data }) => {
            if (code === 0) {
              state.levelName = data.levelName;
              state.avatarImgUrl = data.avatarImgUrl;
              state.badgeImgUrl = data.badgeImgUrl;
              state.levelDesc = data.levelDesc;
            } else {
              Toast(message);
            }
          })
          .catch(err => {
            //console.log("queryHealthLevelDetail:", err);
          });
      });

      return {
        ...toRefs(state),
        ImgsMap
        // goPendantCenter,
      };
    }
  });
</script>

<template>
  <div class="content-box">
    <img class="content-bg" :src="ImgsMap.light_bg" alt="" />
    <CustomNavBar />
    <div class="achievement-badge" :style="{ '--background': background }">
      <van-image class="badge" :src="badgeImgUrl" :show-loading="false">
        <template v-slot:error>徽章加载失败</template>
      </van-image>
      <div v-if="levelName" class="achievement-name">
        <img class="wing wing-left" :src="ImgsMap.wing_right" alt="" />
        <div class="name font-medium">{{ levelName }}</div>
        <img class="wing" :src="ImgsMap.wing_right" alt="" />
      </div>
    </div>
    <div v-if="levelDesc" class="achievement-dec font-regular">
      {{ levelDesc }}
    </div>
    <div v-if="avatarImgUrl" class="achievement-avatar">
      <img class="avatar" :src="avatarImgUrl" alt="头像框" />
      <div class="avatar-dec font-regular">该成就附赠：头像挂件</div>
    </div>
    <!-- 暂时隐藏挂件按钮 -->
    <!-- <div class="avatar-btn font-medium" @click="goPendantCenter">设置icome挂件</div> -->
  </div>
</template>

<style scoped lang="scss">
  .content-box {
    width: 100%;
    height: 100vh;
    background: #2c374b;
    .content-bg {
      width: 100%;
      height: auto;
      position: absolute;
      left: 0;
      top: 0;
    }
    .achievement-badge {
      width: 100%;
      height: 744px;
      background: var(--background);
      background-size: 100% 100%;
      padding-top: 122px;
      .badge {
        width: 500px;
        height: 500px;
        display: block;
        margin: 0 auto;
      }
      .achievement-name {
        display: flex;
        justify-content: center;
        align-items: center;
        .wing {
          width: 38px;
          height: 34px;
          display: block;
        }
        .wing-left {
          transform: rotateY(180deg);
        }
        .name {
          color: #ffffff;
          font-size: 40px;
          line-height: 56px;
          margin: 0 16px;
        }
      }
      ::v-deep .van-image__error,
      .van-image__loading {
        background: transparent;
        color: #ffffff;
      }
    }
    .achievement-dec {
      margin: -40px auto 0;
      width: 560px;
      color: #ffffff;
      font-size: 28px;
      line-height: 40px;
    }
    .achievement-avatar {
      margin: 64px auto 0;
      width: 612px;
      height: 200px;
      border: 2px solid rgba(255, 255, 255, 0.16);
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 1.64rem;
        height: auto;
        display: block;
        margin-right: 24px;
      }
      .avatar-dec {
        color: #ffffff;
        font-size: 30px;
        line-height: 42px;
      }
    }
    .avatar-btn {
      margin: 64px auto 0;
      width: 360px;
      height: 88px;
      background: linear-gradient(141deg, #f8dcb0 0%, #e2bf88 100%);
      border-radius: 44px;
      font-size: 30px;
      color: #634420;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
