<!--
 * @Description: 用户资料
 * @Author: IFLS
 * @Date: 2022-06-15 17:10:47
 * @LastEditTime: 2023-03-31 15:52:38
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, onUnmounted } from "@vue/composition-api";
  import { Toast } from "vant";
  import FullLoading from "@/components/Loading";
  import useToastGoback from "@/hooks/useToastGoback";
  import useComputed from "./computed";
  import ScrollRuler from "@/components/ScrollRuler";
  import { queryUserPortrait, updateUserPortrait } from "@/service/profile";
  import validMap from "@/utils/validator";
  import { formatTimeForBirth } from "@/utils/commonFun";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  import { isMobile, isIcomeAndroid } from "@/utils/native/deviceEnv";

  const sexIcon = {
    female: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/profile/female.png",
    activeFemale: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/profile/female_pressed.png",
    male: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/profile/male.png",
    activeMale: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/profile/male_pressed.png"
  };

  export default defineComponent({
    components: {
      FullLoading,
      ScrollRuler
    },
    beforeRouteEnter(to, from, next) {
      let isFromHistory = false;
      if (to.path === "/profile" && from.path === "/past-history") {
        isFromHistory = true;
      }
      next(vm => vm.queryInfo(isFromHistory));
    },
    setup(_, context) {
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const state = reactive({
        phrId: localStorage.getItem("phrId"),
        loading: false,
        icon: sexIcon,
        userInfo: {
          lk1589863443379: "", // 姓名
          XYZBGRXX002: "", // 性别
          lk1589863444942: "", // 身份证号
          lk1589863443528: "", // 出生日期
          XYZBXY001013: 0, // 身高
          XYZBXY001007: 0, // 体重
          lk1589863448622: "", // 手机号
          lk1589863312232: "" // 既往史
        },
        idCardDisabled: false,
        mobileDisabled: false,
        sexPopup: false,
        datePopup: false,
        highPopup: false,
        weightPopup: false,
        minDate: new Date("1900/01/01"),
        maxDate: new Date(),
        clientHeight: 0, // 页面视窗高度
        saveBtnShow: true
      });

      const isPc = !isMobile;

      const isAndroid = isIcomeAndroid;

      const { formateTime, formatBirth, formatHigh, formatWeight } = useComputed(state);

      const { toastAndGoback } = useToastGoback();

      // 查询信息
      const queryInfo = isFromHistory => {
        state.loading = true;
        queryUserPortrait({ phrId: state.phrId })
          .then(({ code, data, message }) => {
            if (code === 0) {
              if (data) {
                let pastHistoryStr = "";
                data.forEach(val => {
                  // 从既往史页面过来 不更新内容 只更新既往史相关
                  if (!isFromHistory) {
                    state.userInfo[val.code] = val.value;
                  }
                  // 身份证号禁用
                  if (val.code === "lk1589863444942" && val.value.length > 0) {
                    state.idCardDisabled = true;
                  }
                  // 手机号禁用
                  if (val.code === "lk1589863448622" && val.value.length > 0) {
                    state.mobileDisabled = true;
                  }
                  // 回显既往史
                  if (val.code === "lk1589863312232") {
                    pastHistoryStr += val.valueCH + "、";
                  }
                });
                if (pastHistoryStr.endsWith("、")) {
                  pastHistoryStr = pastHistoryStr.substring(0, pastHistoryStr.length - 1);
                }
                state.userInfo["lk1589863312232"] = pastHistoryStr;
              }
            } else {
              console.log("queryUserPortrait", message);
              // Toast(message)
            }
            state.loading = false;
          })
          .catch(() => (state.loading = false));
      };

      // 设置默认身高
      const onHighPopup = () => {
        if (state.userInfo["XYZBXY001013"] === 0) {
          state.userInfo["XYZBXY001013"] = 160;
        }
        state.highPopup = true;
      };

      // 设置默认体重
      const onWeightPopup = () => {
        if (state.userInfo["XYZBXY001007"] === 0) {
          state.userInfo["XYZBXY001007"] = 55;
        }
        state.weightPopup = true;
      };

      // 设置默认出生日期
      const onDatePopup = () => {
        if (state.userInfo["lk1589863443528"] !== "") {
          state.userInfo["lk1589863443528"] = new Date(state.userInfo["lk1589863443528"]);
        } else {
          // state.userInfo['lk1589863443528'] = new Date()
          state.userInfo["lk1589863443528"] = new Date("1990/01/01");
        }
        state.datePopup = true;
      };

      const handleHigh = val => (state.userInfo["XYZBXY001013"] = val);

      const handleWeight = val => (state.userInfo["XYZBXY001007"] = val);

      // 保存
      const onSave = () => {
        state.loading = true;
        const valArr = Object.values(state.userInfo);
        const quotaList = Object.keys(state.userInfo).reduce((total, currentVal, currentIdx) => {
          if (valArr[currentIdx] && currentVal !== "lk1589863312232") {
            total.push({
              quotaCode: currentVal,
              quotaValue:
                currentVal === "lk1589863443528" ? formatTimeForBirth(valArr[currentIdx]) : String(valArr[currentIdx])
            });
          }
          return total;
        }, []);

        const req = { uid: state.phrId, quotaList };
        updateUserPortrait(req).then(({ code, message }) => {
          state.loading = false;
          if (code === 0) {
            toastAndGoback().then(() => {
              const { autoback, from } = route.value.query;
              zgStatistics("健康新奥-点击保存", {
                页面种类: from === "intro" ? "引导页" : "个人设置页",
                页面名称: "完善健康信息"
              });
              autoback && router.go(-1);
            });
          } else {
            Toast(message);
          }
        });
      };

      // 翻译性别字典
      const translateSex = type => {
        const val = new Map([
          [1, "男"],
          ["1", "男"],
          [2, "女"],
          ["2", "女"]
        ]);
        // return val.get(type) ?? ''
        return val.get(type) || "";
      };

      const jumpTo = url => router.push(url);

      const screenType = "orientationchange" in window ? "orientationchange" : "resize";

      const setView = () => {
        const newClientHeight = document.documentElement.clientHeight;
        // 视窗发生变化(键盘弹起)
        if (newClientHeight !== state.clientHeight) {
          state.saveBtnShow = false;
        } else {
          // 视窗变回原值(键盘收起)
          state.saveBtnShow = true;
        }
      };

      onMounted(() => {
        const clientHeight = document.documentElement.clientHeight;
        state.clientHeight = clientHeight;
        if (isAndroid) {
          window.addEventListener(screenType, setView);
        }
      });

      onUnmounted(() => {
        if (isAndroid) {
          window.removeEventListener(screenType, setView);
        }
      });

      return {
        ...toRefs(state),
        formateTime,
        formatBirth,
        formatHigh,
        formatWeight,
        validMap,
        translateSex,
        onHighPopup,
        onWeightPopup,
        onDatePopup,
        onSave,
        jumpTo,
        queryInfo,
        handleHigh,
        handleWeight,
        isPc
      };
    }
  });
</script>

<template>
  <div class="box">
    <full-loading :loading="loading" />
    <van-form validate-first @submit="onSave">
      <van-cell-group>
        <van-cell title="姓名" :value="userInfo['lk1589863443379']" />
        <!-- <van-cell title="昵称">
                    <template #right-icon>
                        <van-field v-model="userInfo.nickName" placeholder="请输入昵称" />
                    </template>
                </van-cell> -->
        <van-cell title="性别" :value="translateSex(userInfo['XYZBGRXX002'])" is-link @click="sexPopup = true" />
        <van-cell title="身份证号">
          <template #right-icon>
            <van-field
              v-model="userInfo['lk1589863444942']"
              name="validator"
              :disabled="idCardDisabled"
              placeholder="请输入身份证号"
              :rules="[{ validator: validMap.idCard, message: '请输入正确的身份证号', trigger: 'onBlur' }]"
            />
          </template>
        </van-cell>
        <van-cell
          title="出生日期"
          :value="formatBirth"
          is-link
          @click="onDatePopup"
          :class="formatBirth === '请选择您的出生日期' && 'holder'"
        />
        <van-cell
          title="身高"
          :value="formatHigh"
          is-link
          @click="onHighPopup"
          :class="formatHigh === '请选择您的身高' && 'holder'"
        />
        <van-cell
          title="体重"
          :value="formatWeight"
          is-link
          @click="onWeightPopup"
          :class="formatWeight === '请选择您的体重' && 'holder'"
        />
        <van-cell title="手机号">
          <template #right-icon>
            <van-field
              v-model="userInfo['lk1589863448622']"
              type="tel"
              name="validator"
              placeholder="请输入手机号"
              :disabled="mobileDisabled"
              :rules="[{ validator: validMap.mobile, message: '请输入正确的手机号' }]"
            />
          </template>
        </van-cell>
        <van-cell
          class="past"
          title="既往史"
          :value="userInfo['lk1589863312232']"
          is-link
          @click="jumpTo('/past-history')"
        />
      </van-cell-group>

      <button :class="['common-btn', 'btn', { 'pc-style': isPc }]" native-type="submit" v-show="saveBtnShow"
        >保存</button
      >
    </van-form>

    <!-- 性别popup -->
    <van-popup v-model="sexPopup" position="bottom" closeable round :close-on-click-overlay="true" class="sex-popup">
      <div class="title">性别</div>
      <van-radio-group v-model="userInfo['XYZBGRXX002']" class="icon-box">
        <van-radio name="2">
          <template #icon="props">
            <img class="img-icon" :src="props.checked ? icon.activeFemale : icon.female" />
            <div :class="['sex', userInfo['XYZBGRXX002'] == 2 ? 'sexActvie' : '']">女士</div>
          </template>
        </van-radio>
        <van-radio name="1">
          <template #icon="props">
            <img class="img-icon" :src="props.checked ? icon.activeMale : icon.male" />
            <div :class="['sex', userInfo['XYZBGRXX002'] == 1 ? 'sexActvie' : '']">男士</div>
          </template>
        </van-radio>
      </van-radio-group>
    </van-popup>
    <!-- 出生日期 -->
    <van-popup v-model="datePopup" position="bottom" closeable round :close-on-click-overlay="true" class="date-popup">
      <div class="title">出生日期</div>
      <van-datetime-picker
        v-model="userInfo['lk1589863443528']"
        type="date"
        item-height="50"
        :show-toolbar="false"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formateTime"
      />
    </van-popup>
    <!-- 身高 -->
    <van-popup v-model="highPopup" position="bottom" closeable round :close-on-click-overlay="true" class="body-popup">
      <div class="title">您的身高</div>
      <div class="subtitle">
        {{ userInfo["XYZBXY001013"] }}
        <span>cm</span>
      </div>
      <scroll-ruler
        @scroll-value="handleHigh"
        :scale="1"
        :max="250"
        :min="50"
        :unit="10"
        :value="userInfo['XYZBXY001013']"
      />
    </van-popup>
    <!-- 体重 -->
    <van-popup
      v-model="weightPopup"
      position="bottom"
      closeable
      round
      :close-on-click-overlay="true"
      class="body-popup"
    >
      <div class="title mt20">您的体重</div>
      <div class="subtitle">
        {{ userInfo["XYZBXY001007"] }}
        <span>kg</span>
      </div>
      <scroll-ruler
        @scroll-value="handleWeight"
        :scale="1"
        :max="150"
        :min="30"
        :unit="10"
        :value="userInfo['XYZBXY001007']"
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../assets/less/btn.css";
  @import "./index.scss";
</style>
