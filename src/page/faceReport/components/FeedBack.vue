<!--
 * @Description: 反馈组件
 * @Author: IFLS
 * @Date: 2022-09-05 15:55:47
 * @LastEditTime: 2023-03-23 17:35:57
-->
<script>
  import { defineComponent, reactive, toRefs } from "@vue/composition-api";
  import { insertFeedback } from "@/service/health";
  import { Toast } from "vant";
  export default defineComponent({
    setup(_, context) {
      const { zgStatistics } = context.root;

      const state = reactive({
        feedbackPopup: false, // 反馈popup
        // 反馈内容
        feedbackForm: {
          checkboxGroup: [],
          radio: "",
          value: ""
        }
      });

      // 提交反馈
      const submitFeedback = () => {
        const form = state.feedbackForm;
        if (form.checkboxGroup.length === 0 || form.radio === "" || form.value === "") {
          return Toast("请完整填写反馈内容");
        }
        const params = {
          info: form.value,
          type: "1",
          extInfo: {
            questions: [
              { question: "1", answer: form.checkboxGroup.join(",") },
              { question: "2", answer: form.radio },
              { question: "3", answer: form.value }
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
              value: ""
            };
            // zgStatistics('健康新奥-点击提建议', { 页面名称: document.title })
          } else {
            Toast(message);
          }
        });
      };

      return {
        ...toRefs(state),
        submitFeedback
      };
    }
  });
</script>
<template>
  <div>
    <div class="feedback-box" @click="feedbackPopup = true">
      <div class="left">
        <img src="../../../assets/images/report/edit.png" />
        <div>异常反馈</div>
      </div>
    </div>

    <van-popup v-model="feedbackPopup" position="bottom" round closeable class="feedback-popup">
      <div class="title">异常反馈</div>
      <van-form>
        <div class="subtitle">1.缺失报告年份</div>
        <van-field>
          <template #input>
            <van-checkbox-group v-model="feedbackForm.checkboxGroup" direction="horizontal">
              <van-checkbox name="2019" shape="square">2019</van-checkbox>
              <van-checkbox name="2020" shape="square">2020</van-checkbox>
              <van-checkbox name="2021" shape="square">2021</van-checkbox>
              <van-checkbox name="2022" shape="square">2022</van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>
        <div class="subtitle">2.缺失报告体检机构</div>
        <van-field>
          <template #input>
            <van-radio-group v-model="feedbackForm.radio" direction="horizontal">
              <van-radio name="廊坊爱德堡医院">廊坊爱德堡医院</van-radio>
              <van-radio name="三疗健康中心">三疗健康中心</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div class="subtitle">3.异常反馈内容</div>
        <van-field
          class="text-input"
          v-model="feedbackForm.value"
          type="textarea"
          placeholder="请填写你的异常反馈"
          maxlength="500"
          show-word-limit
        />
      </van-form>
      <button class="common-btn" @click="submitFeedback" v-debounce="3000">提交</button>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../../assets/less/btn.css";

  .feedback-box {
    position: fixed;
    right: 0;
    top: 396px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 152px;
    height: 120px;
    background: #4b7aff;
    box-shadow: 0px 4px 16px 0px rgba(47, 73, 145, 0.2);
    border-radius: 16px 0px 0px 16px;
    font-size: 26px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;

    .left {
      img {
        width: 40px;
        height: 40px;
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

  .feedback-box:active {
    background: #123fba;
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
      width: 35%;
      margin-bottom: 20px;
    }

    ::v-deep.van-checkbox-group--horizontal {
      justify-content: space-around;
    }

    ::v-deep.van-popup__close-icon--top-right {
      top: 48px;
    }

    ::v-deep.text-input {
      .van-field__control {
        height: 290px;
        background-color: #f5f5f5;
        border-radius: 16px;
        padding: 3px;
      }
    }
  }
</style>
