<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-04-06 15:04:15
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\fillInfo.vue
 * @Description: 动感团操 - 信息填写
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, watch, computed } from "@vue/composition-api";
  import { Toast } from "vant";
  import { submitUserRequireInfo } from "@/service/classReservations/index";
  import { queryUserPortrait } from "@/service/profile";
  import validMap from "@/utils/validator";
  import { formatTimeForBirth } from "@/utils/commonFun";
  import _get from "lodash.get";
  import ScrollRuler from "@/components/ScrollRuler";

  import ChooseMenu from "@/components/ChooseMenu";

  import { formatDate } from "@/utils/commonFun";
  import SubmitButton from "@/components/SubmitButton";

  import { storeToRefs, useClassReservationsStore } from "@/pinia";
  import { useUserStore } from "@/pinia";

  export default defineComponent({
    components: {
      ScrollRuler,
      ChooseMenu,
      SubmitButton
    },
    props: {
      type: String
    },
    setup(_, context) {
      console.log("classReservations fillinfo...");

      const { zgStatistics, $router: router } = context.root;

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const BasePulseIndex = 50; //心率下限
      const DefaultPulseIndex = 70; //推荐心率
      const state = reactive({
        phrId: userInfo.value.phrId,
        loading: false,
        userInfo: {
          //1男，2女
          gender: 1, // 性别
          birthday: "", // 出生日期
          height: 0, // 身高
          pulse: 0 //心率
        },

        radioList: [
          {
            text: "男",
            value: 1
          },
          {
            text: "女",
            value: 2
          }
        ],
        activeRadioIndex: 0,
        //填写格式
        formatGender: "",
        formatBirth: "",
        formatHeight: "",
        formatPulse: "",

        datePopup: false,
        highPopup: false,
        pulsePopup: false,

        //choose birthday
        currentDate: new Date(),
        minDate: new Date("1900/01/01"),
        maxDate: new Date(),

        //menu
        chooseIndex: 0, //默认选中item index
        currentPulseItem: {},
        pulseList: [] //50到110写死
      });

      const pulseList = Array(61).fill(0);
      state.pulseList = pulseList.map((item, index) => {
        return {
          id: index,
          value: index + BasePulseIndex,
          text: index + BasePulseIndex + "次/分钟",
          recommend: index === 20
        };
      });

      const store = useClassReservationsStore();
      const { isSubmitUserInfoFlag } = storeToRefs(store);
      const { setSubmitUserInfoFlag } = store;

      onMounted(async () => {
        queryInfoFn();
      });

      // 查询用户信息
      const queryInfoFn = () => {
        state.loading = true;
        queryUserPortrait({ phrId: userInfo.value.phrId })
          .then(({ code, data, message }) => {
            if (code === 0) {
              if (data) {
                data.forEach(item => {
                  if (item.code === "XYZBGRXX002") {
                    state.userInfo.gender = item.value;
                  }
                  if (item.code === "lk1589863443528") {
                    state.userInfo.birthday = item.value;
                  }
                  if (item.code === "XYZBXY001013") {
                    state.userInfo.height = item.value;
                  }
                });
              }
            } else {
              console.log("queryUserPortrait", message);
            }

            state.loading = false;
            formatData();
          })
          .catch(() => {
            state.loading = false;
            formatData();
          });
      };

      function formatData() {
        state.formatGender = state.userInfo.gender || 1;
        state.formatBirth = state.userInfo.birthday || "";
        if (state.userInfo.height) {
          state.formatHeight = Number(state.userInfo.height);
        } else {
          state.formatHeight = "";
        }

        //get formatPulse
        state.chooseIndex = DefaultPulseIndex - BasePulseIndex;
        state.currentPulseItem = state.pulseList[state.chooseIndex];
        state.formatPulse = state.currentPulseItem.text;

        //set activeRadioIndex
        state.radioList.find((item, index) => {
          if (item.value === Number(state.formatGender)) {
            state.activeRadioIndex = index;
            state.formatGender = state.radioList[state.activeRadioIndex].value;
          }
        });
      }

      const isBtnActiveClass = computed(() => {
        return !!(state.formatGender && state.formatBirth && state.formatHeight && state.formatPulse);
      });

      // 保存用户信息
      const handleSubmit = async () => {
        if (!isBtnActiveClass.value) {
          Toast("请将信息填写完整!");
          return false;
        }

        const { formatGender, formatBirth, formatHeight, currentPulseItem } = state;
        const param = {
          gender: Number(formatGender),
          birthday: formatBirth,
          height: Number(formatHeight),
          pulse: currentPulseItem.value
        };
        console.log("commit param:", param);

        const { code, message, data } = await submitUserRequireInfo(param);
        if (code === 0) {
          setSubmitUserInfoFlag(true);
          router.back();
        } else {
          Toast(message || "提交用户信息失败!");
        }
      };

      function formatter(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        } else if (type === "day") {
          return `${val}日`;
        }
        return val;
      }

      // 设置默认身高
      const onHighPopup = () => {
        if (state.userInfo.height === 0) {
          state.userInfo.height = 160;
          state.formatHeight = 160;
        }
        state.highPopup = true;
      };

      // 设置默认出生日期
      const onDatePopup = () => {
        if (state.formatBirth !== "") {
          const temp = state.formatBirth.replace("-", "/");
          state.currentDate = new Date(temp);
        } else {
          state.currentDate = new Date("1990/01/01");
        }
        state.datePopup = true;
      };

      const onPulsePopup = () => {
        state.pulsePopup = true;
      };

      watch(
        () => state.datePopup,
        (newValue, oldValue) => {
          if (newValue === false) {
            state.formatBirth = formatDate(state.currentDate);
          }
        }
      );

      const formatHeightWithUnit = computed(() => {
        return state.formatHeight ? `${state.formatHeight + "cm"}` : "";
      });

      //选择心率
      function handleItemChoose(chooseIndex) {
        state.chooseIndex = chooseIndex;
        state.currentPulseItem = state.pulseList[state.chooseIndex];
        state.formatPulse = state.currentPulseItem.text;
      }

      const handleHigh = val => (state.formatHeight = val);

      function handleGenderClick(index) {
        state.activeRadioIndex = index;
        state.formatGender = state.radioList[state.activeRadioIndex].value;
      }

      return {
        ...toRefs(state),
        onHighPopup,
        onDatePopup,
        onPulsePopup,
        formatter,
        handleHigh,
        handleItemChoose,
        handleGenderClick,
        handleSubmit,
        isBtnActiveClass,
        formatHeightWithUnit
      };
    }
  });
</script>

<template>
  <div class="class-reservations-fillInfo">
    <div class="topArea">
      <div class="header">
        <div class="greet">请填写一下基本数据</div>
      </div>
    </div>
    <div class="form">
      <div class="form-item">
        <div class="label">性别:</div>
        <div class="radioGroup">
          <div
            v-for="(item, index) in radioList"
            class="radioItem"
            :class="{ active: activeRadioIndex === index }"
            :key="index"
            @click="handleGenderClick(index)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>

      <div class="form-item">
        <div class="label">出生日期:</div>
        <van-field :value="formatBirth" readonly right-icon="arrow" placeholder="请选择您的生日" @click="onDatePopup" />
      </div>

      <div class="form-item">
        <div class="label">身高:</div>
        <van-field
          :value="formatHeightWithUnit"
          readonly
          right-icon="arrow"
          placeholder="请选择您的身高"
          @click="onHighPopup"
        />
      </div>

      <div class="form-item">
        <div class="label">安静心率:</div>
        <van-field
          :value="formatPulse"
          readonly
          right-icon="arrow"
          placeholder="请选择您的心率"
          @click="onPulsePopup"
        />
      </div>

      <!-- 出生日期 -->
      <van-popup
        v-model="datePopup"
        position="bottom"
        closeable
        round
        :close-on-click-overlay="true"
        class="date-popup"
      >
        <div class="title">出生日期</div>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          item-height="50"
          :show-toolbar="false"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
        />
      </van-popup>

      <!-- 身高 -->
      <van-popup
        v-model="highPopup"
        position="bottom"
        closeable
        round
        :close-on-click-overlay="true"
        class="body-popup"
      >
        <div class="title">您的身高</div>
        <div class="subtitle">
          {{ formatHeightWithUnit }}
        </div>
        <scroll-ruler @scroll-value="handleHigh" :scale="1" :max="250" :min="50" :unit="10" :value="formatHeight" />
      </van-popup>

      <ChooseMenu
        popupHeight="8rem"
        contentHeight="4rem"
        title="选择安静心率"
        :columns="pulseList"
        :isShow="pulsePopup"
        :visible-item-count="8"
        :chooseIndex="chooseIndex"
        @close="pulsePopup = !pulsePopup"
        @chooseItem="handleItemChoose"
      />

      <SubmitButton
        :width="'auto'"
        :isActive="isBtnActiveClass"
        :isFixed="true"
        v-debounceFn="{ fn: handleSubmit, delay: 3000 }"
        >保存</SubmitButton
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .class-reservations-fillInfo {
    padding: 20px 60px;
    min-height: 100%;
    background-color: #ffffff;
    font-size: 20px;
    text-align: left;

    .topArea {
      background-color: #ffffff;
      padding-right: 0;
      padding-top: 40px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #ffffff;
        padding-right: 0;

        .greet {
          height: 50px;
          font-size: 36px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #1c1c1e;
          line-height: 50px;

          background: linear-gradient(270deg, rgba(130, 178, 255, 0) 0%, #4b7aff 100%);
          background-position: bottom;
          background-size: 100% 12px;
          background-repeat: no-repeat;
        }
      }
    }

    .form {
      margin-top: 116px;
      .form-item {
        .label {
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #565961;
          line-height: 40px;
          padding-left: 20px;
        }

        ::v-deep .van-cell {
          padding: 20px 0;
        }

        ::v-deep .van-field__value {
          height: 80px;
          background: #f0f2f7;
          border-radius: 40px;
          padding: 0 30px;
        }

        ::v-deep .van-field__control {
          width: 100%;
          height: 80px;
          background: #f0f2f7;
          border-radius: 40px;
        }

        .radioGroup {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 20px 0;
          .radioItem {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 220px;
            height: 80px;
            background: #edf1ff;
            border-radius: 40px;
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #4b7aff;

            &:last-child {
              margin-left: 60px;
            }

            &.active {
              background: #4b7aff;
              color: #ffffff;
            }
          }
        }
      }
    }

    .van-popup {
      padding-top: 34px;
      .title {
        font-size: 30px;
        font-family: Source Han Sans CN;
        color: #666;
        text-align: center;
      }
      .icon-box {
        display: flex;
        justify-content: space-around;
        .van-radio {
          height: 380px;
        }
        .img-icon {
          width: 152px;
          height: 152px;
        }
        .sex {
          margin-top: 20px;
          font-size: 26px;
          color: #999;
        }
        .sexActvie {
          color: #4b7aff;
        }
      }
    }
    .date-popup,
    .sex-popup {
      height: 800px;
    }
    .body-popup {
      height: 800px;
      overflow: hidden;
      .title {
        margin-bottom: 60px;
        margin-left: 30px;
        font-size: 36px;
        font-weight: 600;
        color: #111111;
        text-align: left;
      }
      .subtitle {
        margin-bottom: 120px;
        font-size: 64px;
        font-family: DIN;
        font-weight: 700;
        color: #4b7aff;
        span {
          font-size: 38px;
          font-weight: 400;
        }
      }
      ::v-deep.scroll-ruler {
        padding-bottom: 30%;
      }
    }
  }
  .mt20 {
    margin-top: 20px;
  }
</style>
