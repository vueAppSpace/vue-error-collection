<!--
 * @Description: 反馈组件
 * @Author: IFLS
 * @Date: 2022-05-12 14:09:00
 * @LastEditTime: 2023-03-23 17:32:18
-->
<script>
  import { defineComponent, reactive, toRefs } from "@vue/composition-api";
  import { isIosX } from "@/utils/isIosX";
  import { insertFeedback } from "@/service/health/index";
  import { Toast } from "vant";
  import { showVconsole } from "@/utils/vconsoleUtil";
  import { isProduction, isTesting } from "@/utils/projectEnv";
  import { printVersion } from "@/utils/versionUtil";

  export default defineComponent({
    setup(_, context) {
      const { zgStatistics } = context.root;

      const state = reactive({
        feedbackPopup: false, // 反馈popup
        // 反馈内容
        feedbackForm: {
          checkboxGroup: [],
          radio: "",
          radio1: "",
          value: "",
          value1: ""
        },
        showVConsoleCount: 0
      });

      // 提交反馈
      const submitFeedback = () => {
        const form = state.feedbackForm;
        if (
          form.checkboxGroup.length === 0 ||
          form.radio === "" ||
          form.radio1 === "" ||
          form.value === "" ||
          form.value1 === ""
        ) {
          return Toast("请完整填写反馈内容");
        }
        const params = {
          info: form.value1,
          extInfo: {
            questions: [
              { question: "1", answer: form.checkboxGroup },
              { question: "2", answer: form.radio },
              { question: "3", answer: form.radio1 },
              { question: "4", answer: form.value }
            ]
          }
        };
        insertFeedback(params).then(({ code, message }) => {
          if (code === 0) {
            Toast("提交成功");
            state.feedbackPopup = false;
            state.feedbackForm = {
              checkboxGroup: [],
              radio: "",
              radio1: "",
              value: "",
              value1: ""
            };
            zgStatistics("健康新奥-点击提建议", { 页面名称: document.title });
          } else {
            Toast(message);
          }
        });
      };

      // 生产触发调试模式
      const addNum = () => {
        state.showVConsoleCount++;
        if (state.showVConsoleCount > 5 && isProduction()) {
          showVconsole();
          printVersion();
        }
        if (isTesting()) {
          printVersion();
        }
      };

      return {
        ...toRefs(state),
        submitFeedback,
        isIosX,
        addNum
      };
    }
  });
</script>
<template>
  <div>
    <!-- 意见反馈 -->
    <div :class="['feedback-box', isIosX ? 'bottom-ipx' : '']" @click="feedbackPopup = true">
      <div class="left">
        <div>提建议，服务更贴心</div>
        <img
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/arrow_right_white.png"
        />
      </div>
      <div class="right">
        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/edit.png" />
      </div>
    </div>

    <van-popup v-model="feedbackPopup" position="bottom" round closeable class="feedback-popup">
      <div class="title" @click="addNum">意见反馈</div>
      <van-form>
        <div class="subtitle">1.健康新奥项目计划提供线上线下服务您最在意什么？</div>
        <van-field>
          <template #input>
            <van-checkbox-group v-model="feedbackForm.checkboxGroup" direction="horizontal">
              <van-checkbox name="一日三餐" shape="square">A 一日三餐</van-checkbox>
              <van-checkbox name="健康运动" shape="square">B 健康运动</van-checkbox>
              <van-checkbox name="情绪释放" shape="square">C 情绪释放</van-checkbox>
              <van-checkbox name="健康专家指导" shape="square">D 健康专家指导</van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>
        <div class="subtitle">2.您是否期望健康新奥项目可以服务家人？</div>
        <van-field>
          <template #input>
            <van-radio-group v-model="feedbackForm.radio" direction="horizontal">
              <van-radio name="是">是</van-radio>
              <van-radio name="否">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div class="subtitle">3.您喜欢什么类型的工间操？</div>
        <van-field>
          <template #input>
            <van-radio-group v-model="feedbackForm.radio1" direction="horizontal">
              <van-radio name="现代运动">A 现代运动</van-radio>
              <van-radio name="传统功法">B 传统功法</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div class="subtitle">4.除了工间操您还想得到什么健康服务？</div>
        <van-field class="text-input" v-model="feedbackForm.value" type="textarea" placeholder="请输入" />
        <div class="subtitle">5.对健康新奥项目是否还有其他建议？</div>
        <van-field class="text-input" v-model="feedbackForm.value1" type="textarea" placeholder="请输入" />
      </van-form>
      <button class="common-btn" @click="submitFeedback" v-debounce="3000">提交</button>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
  @import "../assets/less/btn.css";

  .feedback-box {
    position: fixed;
    bottom: 110px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 122px;
    padding: 0 30px;
    font-size: 28px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(270deg, #7cb6fe 0%, #467ffc 100%);

    .left {
      display: flex;
      align-items: center;

      img {
        margin-left: 16px;
        width: 14px;
        height: 20px;
      }
    }

    .right {
      margin-top: 10px;

      img {
        width: 64px;
        height: 68px;
      }
    }
  }

  .bottom-ipx {
    bottom: 160px;
  }

  .feedback-popup {
    padding: 50px 30px 100px;

    .title {
      padding-bottom: 15px;
      text-align: left;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #1e201e;
    }

    .subtitle {
      padding-left: 20px;
      margin-top: 20px;
      font-size: 28px;
      text-align: left;
    }

    ::v-deep.van-checkbox--horizontal {
      margin-right: 60px;
      margin-bottom: 20px;
    }

    ::v-deep.van-checkbox-group--horizontal > div:nth-child(3) {
      margin-right: 58px;
    }

    ::v-deep.van-popup__close-icon--top-right {
      top: 48px;
    }

    ::v-deep.text-input {
      .van-field__control {
        background-color: #f5f5f5;
        border-radius: 16px;
        padding: 3px;
      }
    }
  }
</style>
