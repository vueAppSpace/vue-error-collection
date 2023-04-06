<!--
 * @Description: 疫情登记
 * @Author: WANGCHENGAE
 * @Date: 2022-11-17 18:00:30
 * @LastEditTime: 2023-04-06 14:15:44
-->
<script>
  import { defineComponent, reactive, toRefs, computed, onMounted } from "@vue/composition-api";
  import { useNavStore } from "@/pinia";

  import FieldItem from "@/components/FieldItem.vue";
  import AgreeItem from "@/components/AgreeItem.vue";
  import SubmitButton from "@/components/SubmitButton.vue";
  import {
    getInputList,
    getRadioList,
    getAgreeData,
    FieldType,
    SourceType,
    NotHealthArray,
    HealthType,
    getSourceDestUrl,
    ValidSourceTypeArray,
    SourcePageArray,
    CodeNameMap
  } from "./constantData";
  import { Toast } from "vant";
  import ValidMap from "@/utils/validator";
  import { insertEpidemicRegister, queryUserNeededRegister } from "@/service/epidemicRegister/index";
  import { getThirdUserToken } from "@/service/service";
  import { queryUserPortrait } from "@/service/profile";
  import UploaderPic from "@/components/Uploader/UploaderPic.vue";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    components: {
      FieldItem,
      AgreeItem,
      SubmitButton,
      UploaderPic
    },

    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      if (SourceType[to.query.type] && fromPath !== "/") {
        next(vm => {
          vm.mountedHandle(fromPath);
        });
      } else {
        window.history.back();
      }
    },

    // beforeRouteLeave(to, from, next){
    //   this.resetTitle();
    //   next();
    // },

    props: {
      type: String
    },

    setup({ type }, context) {
      const { zgStatistics, $router: router } = context.root;

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        inputList: getInputList(),
        radioList: getRadioList(),
        agreeData: getAgreeData(),
        healthCodeUrlList: [],
        travelCardUrlList: [],
        isUserRegister: false //当前用户是否需要登记
      });

      const { setTitle } = useNavStore();

      const userEmpNo = userInfo.value.empNo;

      async function mountedHandle(fromPath) {
        if (ValidSourceTypeArray.includes(type) && SourcePageArray.includes(fromPath)) {
          const { code, message, data } = await queryUserNeededRegister({
            userEmpNo
          });

          if (code === 0 && data) {
            state.isUserRegister = !!data.isUserRegister;
            if (!state.isUserRegister) {
              await jumpToThirdPath();
            } else {
              setTitle("信息登记");
              await queryUserInfo();
            }
          } else {
            console.log(message);
          }
        } else {
          await jumpToThirdPath();
        }
      }

      async function queryUserInfo() {
        const phrId = userInfo.value.phrId;
        if (phrId) {
          const { code, message, data } = await queryUserPortrait({ phrId });
          if (code === 0 && data && data.length) {
            const userInfo = {};
            data.forEach(({ code, value }) => {
              if (CodeNameMap[code]) {
                userInfo[CodeNameMap[code]] = value;
              }
            });
            state.inputList.forEach(item => {
              if (userInfo[item.name]) {
                item.value = userInfo[item.name];
              }
            });
          } else {
            console.log(message);
          }
        }
      }

      const isReadySubmit = computed(() => {
        let isInputListFilled = state.inputList.every(item => !!String(item.value).trim());
        let isRadioListFilled = state.radioList.every(item => !!String(item.value).trim());
        let isAgreeItemFilled = state.agreeData.agreeResult.length === state.agreeData.agreeList.length;

        // let isHealthCodeFilled =
        //   !!state.healthCodeUrlList[0] &&
        //   state.healthCodeUrlList[0].status === "success";
        // let isTravelCardFilled =
        //   !!state.travelCardUrlList[0] &&
        //   state.travelCardUrlList[0].status === "success";

        return (
          isRadioListFilled && isInputListFilled && isAgreeItemFilled //&&
          // isHealthCodeFilled &&
          // isTravelCardFilled
        );
      });

      //判断用户是否健康
      const healthState = computed(() => {
        let flag = state.radioList.some(({ name, value }) => {
          return NotHealthArray.indexOf(name) >= 0 && value === HealthType.notHealth;
        });
        return flag ? HealthType.notHealth : HealthType.health;
      });

      function handleInput({ fieldType, index, value }) {
        if (fieldType === FieldType.input) {
          state.inputList[index].value = value;
        } else if (fieldType === FieldType.radio) {
          state.radioList[index].value = value;
        }
      }

      function jumpTo(url) {
        if (url.includes("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      }

      async function jumpToThirdPath() {
        const { code, message, data } = await getThirdUserToken();
        if (code === 0) {
          jumpTo(getSourceDestUrl(type, data));
        } else {
          Toast(message);
        }
      }

      async function handleSubmit() {
        if (!isReadySubmit.value) return Toast("请将必填项填写完整!");
        const checkFlag = state.inputList.every(({ flag, value }) => {
          let ret = true;
          if (flag === "idCard" && !ValidMap.idCard(value)) {
            Toast("请输入正确的身份证号!");
            ret = false;
          } else if (flag === "mobile" && !ValidMap.mobile(value)) {
            Toast("请输入正确的手机号!");
            ret = false;
          }
          return ret;
        });

        if (checkFlag) {
          const params = {
            userEmpNo,
            healthCodeUrl: "", //state.healthCodeUrlList[0].url,
            travelCardUrl: "", //state.travelCardUrlList[0].url,
            sourceType: type,
            sourceName: SourceType[type],
            healthState: healthState.value
          };

          state.inputList.forEach(({ name, value }) => {
            params[name] = value;
          });

          state.radioList.forEach(({ name, value }) => {
            params[name] = value;
          });

          const { code, message } = await insertEpidemicRegister(params);
          if (code === 0) {
            Toast("提交成功");
            zgStatistics("健康新奥-信息登记-点击提交", {
              页面名称: "信息登记"
            });
            await jumpToThirdPath();
          } else {
            Toast(message);
          }
        }
      }

      return {
        ...toRefs(state),
        handleSubmit,
        handleInput,
        isReadySubmit,
        healthState,
        mountedHandle
        // setTitle,
        // resetTitle
      };
    }
  });
</script>

<template>
  <div class="epidemic-register" v-if="isUserRegister">
    <van-form>
      <template v-for="(item, index) in inputList">
        <FieldItem @input="handleInput" class="item" v-bind="item" :key="index" />
      </template>

      <!-- <div class="panel">
        <div class="title">
          <span>*</span>
          健康信息
        </div>
        <div class="picList">
          <uploader-pic
            v-model="healthCodeUrlList"
            :uploadText="'健康码截图'"
            :max-count="1"
            :max-size="10"
          />
          <uploader-pic
            v-model="travelCardUrlList"
            :uploadText="'行程卡截图'"
            :max-count="1"
            :max-size="10"
          />
        </div>
      </div> -->

      <template v-for="(item, index) in radioList">
        <FieldItem @input="handleInput" class="item" v-bind="item" :key="index + inputList.length" />
      </template>
      <div class="panel">
        <div class="title">
          <span>*</span>
          本人郑重承诺
        </div>
        <AgreeItem :data="agreeData" />
      </div>
    </van-form>
    <SubmitButton
      :class="['submitBtn', { active: isReadySubmit }]"
      v-debounceFn="{ fn: handleSubmit, delay: 3000 }"
      v-track="{
        name: '健康新奥-点击问答按钮',
        data: `{&quot;按钮名称&quot;: &quot;提交&quot;, &quot;页面名称&quot;: &quot;疫情登记&quot;, &quot;类型&quot;: &quot;服务-疫情登记&quot;}`
      }"
    >
      提交
    </SubmitButton>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../style/scss/variable.scss";

  .epidemic-register {
    padding: 34px 32px;
    font-size: 30px;

    .item {
      margin-bottom: 32px;
    }

    .panel {
      .title {
        font-size: 28px;
        color: $primary-text-color;
        text-align: left;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .picList {
        display: flex;
        justify-content: space-between;
        margin-bottom: 32px;

        ::v-deep .van-uploader__preview-image {
          width: 320px;
          height: 300px;
        }

        ::v-deep .van-uploader__upload {
          width: 320px;
          height: 300px;
          margin: 0;
        }

        ::v-deep .van-uploader__upload-icon {
          font-size: 1.2rem;
          color: #d1d4dc;
          font-weight: lighter;
        }

        ::v-deep .van-uploader__upload-text {
          font-size: 28px;
          font-weight: 400;
          color: #333333;
          line-height: 40px;
        }

        ::v-deep .van-uploader__preview-delete {
          background-color: rgba(0, 0, 0, 0.6);
          transform: translateY(-40%);

          .van-uploader__preview-delete-icon {
            color: #fff;
          }
        }
      }
    }

    .submitBtn {
      margin-top: 40px;
    }
  }
</style>
