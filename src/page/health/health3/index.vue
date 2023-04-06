<script>
  import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    onActivated,
    onDeactivated,
    watch
  } from "@vue/composition-api";
  import { checkSource } from "@/utils/ZGdictionary";
  import { getUserAccredit } from "@/service/health";
  import { getCanteenListByEmp } from "@/service/health";

  // import { Toast } from 'vant'
  import lfCardList from "@/page/meals/index";
  import Tips from "@/components/Tips";
  import UserInfo from "../components/UserInfo";
  import useQuestions from "@/hooks/useQuestions";
  import intro from "@/utils/intro";
  import introSteps from "./introSteps";
  import { reportAllVideoDuration } from "@/hooks/useVideo";
  import { judgeNeedToJumpToDanao, resetJumpReportData } from "@/utils/lifeEntropyMethod";
  import { useLocationStore, storeToRefs } from "@/pinia";

  import { showVconsole } from "@/utils/vconsoleUtil";
  import { isProduction, isTesting } from "@/utils/projectEnv";
  import { printVersion } from "@/utils/versionUtil";
  import { jsBridge } from "@/utils/native/jsBridge";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  import { isIOS, isUniApp } from "@/utils/native/deviceEnv";
  import { useUserStore } from "@/pinia";

  export default defineComponent({
    components: {
      lfCardList,
      Tips,
      UserInfo
    },

    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      if (fromPath === "/evaluate") {
        next(vm => {
          //(从“问卷页”返回)生命熵逻辑
          judgeNeedToJumpToDanao();
        });
      } else {
        next();
      }
    },

    setup(_, context) {
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const store = useLocationStore();
      const { setCityCode } = store;
      const { setCanteenList } = store;
      const { cityCode, canteenList } = storeToRefs(store);

      setCanteenList("");

      //获取用户信息
      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        introVisible: false,
        tips: {
          visible: false,
          exp: 0,
          isNewUser: false
        },
        accompanyDay: 0, // 陪伴天数
        address: "河北省廊坊市",
        isScroll: false,
        showVConsoleCount: 0,
        city: ""
      });

      if (isUniApp) {
        state.address = "天津市";
      }

      const { queryQuestions } = useQuestions();

      // 查询天数
      const queryAccompanyDay = () => {
        if (userInfo.value.accompanyDay > 0) {
          state.accompanyDay = userInfo.value.accompanyDay;
        }
      };

      // 查询欢迎提示
      const queryWelcomeTips = () => {
        const point = userInfo.value.loginHealthPoints;
        const day = userInfo.value.accompanyDay;

        // 问俊宏: 第一次调登录接口 loginHealthPoints 返回实际数值
        // 第二次调用，就返回 0，可通过接口控制是否显示
        if (point) {
          state.tips = {
            visible: true,
            exp: point,
            isNewUser: day === 0
          };
        }
      };

      // 获取当前位置
      const queryLocation = () => {
        // setTimeout(() => {
        //       // setCityCode('016');
        //       setCityCode('010');
        //       getCanteenList();
        // }, 5);

        jsBridge
          .invoke("queryLocation")
          .then(data => {
            console.log("初始化位置>>>>>>>>>>", data);

            if (data.city) {
              state.city = data.city;
              if (isUniApp) {
                state.address = data.city;
              } else {
                state.address = data.city + data.district;
              }
              // #v-ifdef VITE_IFDEF=ICOME
              // state.address = data.city + data.district;// 初始化只有地址，没有cityCode
              // #v-endif
              // #v-ifdef VITE_IFDEF=EMALL
              // #v-endif
              if (data.city == "北京市") {
                setCityCode("010");
              } else if (data.city == "石家庄市") {
                setCityCode("0311");
              } else if (data.city == "廊坊市") {
                setCityCode("0316");
              } else if (data.city == "天津市") {
                setCityCode("022");
              } else {
                setCityCode("0471");
              }
              // setTimeout(() => {
              console.log("去除定时器");
              getCanteenList();
              // }, 500);
            }
          })
          .catch(err => {
            console.log("扫码异常:", err);
          });
      };

      // 点击地图
      const openMap = () => {
        console.log("state.city", state.city);
        if (isUniApp) {
          router.push({
            path: "/address",
            query: {
              city: state.city
            }
          });
        } else {
          // #v-ifdef VITE_IFDEF=ICOME
          window.ic &&
            ic.run({
              action: "amap.openMap",
              success: ({ data }) => {
                console.log("地址data", data);
                state.address = data.city + data.district;
                setCityCode(data.citycode);
                getCanteenList();
              }
            });
          // #v-endif
        }
      };

      const getCanteenList = async () => {
        const employeeId = userInfo.value.empNo;
        getCanteenListByEmp({ employeeId, cityCode: cityCode.value })
          .then(res => {
            if (res.code === 0) {
              if (res.data && res.data.length) {
                setCanteenList(res.data);
                localStorage.setItem("columns", JSON.stringify(res.data));
              } else {
                setCanteenList("noData");
              }
            } else {
              // console.log(res.message);
            }
          })
          .catch(error => {
            // console.log(error.message);
          });
      };

      const queryAgreement = async () => {
        try {
          const { code, data, message } = await getUserAccredit();
          if (code === 0) {
            if (data && data.length === 0) {
              state.introVisible = true;
            }
          } else {
            // console.log("queryAgreement", message);
            // Toast(message)
          }
        } catch (err) {
          // console.warn("err", err);
        }
      };

      // 发送埋点信息
      const sendZhugeData = () => {
        const { source } = route.value.query;
        source &&
          zgStatistics("健康新奥-进入页面", {
            来源: checkSource(source),
            所属功能模块: "健康",
            页面名称: "健康"
          });
      };

      const init = () => {
        //清除生命熵数据
        resetJumpReportData();

        queryLocation();
        queryAccompanyDay();
        sendZhugeData();
        // 查询是否有引导
        setTimeout(() => {
          intro("introV3", introSteps).then(async status => {
            // 存在引导
            if (status) {
              // 查询是否签署过协议
              await queryAgreement();
              if (!state.introVisible) {
                state.isScroll = true;
              }
            } else {
              // 不存在引导
              try {
                // 查询是否存在问题
                const { status, seqNo, inquiryNo } = await queryQuestions();
                if (status === 1) {
                  // 跳转到问题
                  router.push({
                    path: "/evaluate",
                    query: { seqNo, inquiryNo }
                  });
                } else {
                  // 展示欢迎提示
                  queryWelcomeTips();
                  state.isScroll = true;
                }
              } catch (err) {
                // 问卷加载异常情况
                // console.warn(err.msg);
                state.isScroll = true;
              }
            }
          });
        }, 200);
      };

      const removeSession = () => sessionStorage.removeItem("isScroll");

      //生产触发调试
      const showVconsoleHandle = () => {
        state.showVConsoleCount++;
        if (state.showVConsoleCount > 5 && isProduction()) {
          printVersion();
          showVconsole();
        }
        if (isTesting()) {
          printVersion();
        }
      };

      onMounted(init);

      onActivated(() => {
        const isScroll = JSON.parse(sessionStorage.getItem("isScroll"));
        isScroll && (state.isScroll = true);
        removeSession();

        const scrollTop = route.value.meta.scrollTop;
        const pageBox = document.querySelector(".page-box");
        if (scrollTop && pageBox) {
          pageBox.scrollTop = scrollTop;
        }
        if (route.value.query.city) {
          setCityCode(route.value.query.cityCode);
          state.city = route.value.query.city;
          state.address = route.value.query.city;
          getCanteenList();
        }
        console.log("route", route.value.query.city);
      });

      onDeactivated(() => {
        removeSession();
        reportAllVideoDuration(zgStatistics);
      });

      watch(
        () => state.introVisible,
        newVal => {
          if (isIOS) {
            if (newVal) {
              document.querySelector(".page-box").style["-webkit-overflow-scrolling"] = "auto";
            } else {
              document.querySelector(".page-box").style["-webkit-overflow-scrolling"] = "touch";
            }
          }
        }
      );

      return {
        cityCode,
        ...toRefs(state),
        openMap,
        queryWelcomeTips,
        showVconsoleHandle
      };
    }
  });
</script>

<template>
  <div class="page-box" ref="pageBox">
    <!-- 顶部header -->
    <div class="header">
      <div class="location-box" @click="openMap">
        <img
          class="location"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/location.png"
        />
        <span>{{ address }}</span>
        <img
          class="arrow-right"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/arrow_right.png"
        />
      </div>

      <div class="header-right" @click="showVconsoleHandle">
        健康相伴{{ accompanyDay }}天
        <div class="bg-bottom"></div>
      </div>
    </div>

    <!-- 廊坊列表卡片 -->
    <lf-card-list :isScroll="isScroll" />

    <tips :value.sync="tips.visible" :duration="3000" :exp="tips.exp" :is-new-user="tips.isNewUser" />

    <user-info :value.sync="introVisible" />
  </div>
</template>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
