<!--
 * @Description: 个人信息引导
 * @Author: IFLS
 * @Date: 2022-06-15 12:53:38
 * @LastEditTime: 2023-03-23 17:36:11
-->
<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import { Toast } from "vant";
  import useQuestions from "@/hooks/useQuestions";
  import { setUserAccredit } from "@/service/health";
  export default defineComponent({
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    setup(_, context) {
      const {
        emit,
        parent,
        root: { $router: router }
      } = context;

      const agreementChecked = ref(false);

      let agreementLock = false;

      const { queryQuestions } = useQuestions();

      const jumpTo = url => router.push(url);

      const onAgreement = async () => {
        if (agreementChecked.value && !agreementLock) {
          const { code, message } = await setUserAccredit();
          if (code !== 0) {
            return Toast(message);
          }
          agreementLock = true;
        }
      };

      const onSkip = async () => {
        if (!agreementChecked.value) {
          return Toast("请您认真查看隐私保护协议，勾选视为同意协议所有条款。");
        }

        // 关闭弹窗
        emit("update:value", false);

        // 查询问题
        try {
          const { status } = await queryQuestions();
          if (status === 1) {
            jumpTo("/evaluate");
          } else {
            parent.queryWelcomeTips();
            parent.isScroll = true;
          }
        } catch (err) {
          // 接口报错
          console.warn(err.msg);
        }
      };

      return {
        agreementChecked,
        jumpTo,
        onAgreement,
        onSkip
      };
    }
  });
</script>

<template>
  <transition name="van-slide-down">
    <div class="user-info" v-if="value">
      <div class="user-box">
        <div class="user-tips">
          <div class="tip-text">心动了吗？距离这些服务的开启 只差一点点了哟！</div>
        </div>
        <div class="user-content">
          <ul>
            <li>
              <img
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/user_info.png"
                alt=""
              />
              <button
                class="common-btn small-btn"
                @click="jumpTo('/profile?autoback=true&from=intro')"
                v-track="{
                  name: '健康新奥-进入个人设置页面',
                  data: `{&quot;来源&quot;: &quot;引导页&quot;, &quot;页面名称&quot;: &quot;完善健康信息&quot; }`
                }"
              >
                完善基础信息
              </button>
            </li>
            <li>
              <img
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/user_upload.png"
                alt=""
              />
              <button
                class="common-btn small-btn"
                @click="jumpTo('/upload-report?autoback=true&add=true&from=intro')"
                v-track="{
                  name: '健康新奥-进入个人设置页面',
                  data: `{&quot;来源&quot;: &quot;引导页&quot;, &quot;页面名称&quot;: &quot;上传报告&quot; }`
                }"
              >
                上传历史报告
              </button>
            </li>
          </ul>
          <div class="user-title">在您全职涯过程中我们将充分保护您的个人健康数据安全</div>
          <van-checkbox
            icon-size="18px"
            v-model="agreementChecked"
            @click="onAgreement"
            :label-disabled="false"
            :disabled="agreementChecked"
          >
            <!-- :disabled="agreementChecked" -->
            <div>同意并阅读<span @click="jumpTo('/agreement')">隐私保护协议</span></div>
          </van-checkbox>
          <div class="user-subtitle">
            <div>信息越全服务越到位哦</div>
            <div>别担心随时可到“我的”进行完善</div>
          </div>
          <button class="common-btn skip-btn" @click="onSkip">确认</button>
        </div>
      </div>
      <div class="user-box-cover"></div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  @import "../../../assets/less/btn.css";
  .user-info {
    position: fixed;
    z-index: 2001;
    top: 0;
    width: 100%;
    height: 100%;
    .user-box {
      position: fixed;
      z-index: 2001;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      width: 100%;
      height: 100%;
      color: #fff;
      .user-tips {
        background-image: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/star-bg.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 670px;
        height: 176px;
        padding: 40px 140px;
        margin: 0 auto;
        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .tip-text {
          line-height: 50px;
          font-size: 28px;
          color: #1e201e;
        }
      }
      .user-content {
        padding: 0 40px;
        ul {
          display: flex;
          justify-content: space-around;
          li {
            display: flex;
            flex-direction: column;
            width: 320px;
            height: 268px;
            padding: 50px 50px 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            border: 2px solid rgba(255, 255, 255, 0.5);
            img {
              width: 76px;
              height: 76px;
              margin: 0 auto;
              margin-bottom: 36px;
            }
            .small-btn {
              width: 220px;
              height: 60px;
              font-size: 26px;
            }
          }
        }
        .user-title {
          margin: 40px 0 20px 0;
          font-size: 24px;
          font-weight: 400;
        }
        ::v-deep.van-checkbox {
          justify-content: center;
          padding-top: 20px;
          margin-bottom: 120px;
          .van-icon-success {
            border: 2px solid rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.3);
          }
          .van-checkbox__label {
            font-size: 26px;
          }
        }
        ::v-deep.van-checkbox__label {
          font-size: 24px;
          font-weight: 400;
          color: #b1b1b1;
          span {
            text-decoration: underline;
            color: #fff;
          }
        }
        .user-subtitle {
          font-size: 24px;
          margin-bottom: 20px;
        }
      }
    }

    .user-box-cover {
      position: fixed;
      z-index: 2000;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.7;
    }
  }
</style>
