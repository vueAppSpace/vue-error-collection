<template>
  <div class="container">
    <full-loading :loading="loading" />

    <LifeEntropy v-if="isEntropy" @toggleLoading="toggleLoading" />

    <Banner v-else />

    <!-- 聚合永间 -->
    <IconBox v-if="isHealth" />

    <div v-if="isHealth" class="health-plan-box">
      <h4 class="health-plan-title">专属健康计划</h4>
      <!-- TODO 控制入口显隐 -->
      <div v-if="true" class="health-sign-in" @click="goHealthSignIn">
        <img
          class="icon"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/sign_icon.png"
          alt=""
        />
        <div class="name font-regular">健康签到</div>
      </div>
    </div>

    <!-- 健康计划 -->
    <div class="time-line">
      <!--  -->
      <van-steps direction="vertical" :active="10" v-if="userPlan">
        <template v-for="plan in userPlan">
          <!-- 功法 -->
          <template v-if="plan.event_code === 'gongfa' && gongFaArr.length > 0">
            <van-step :key="plan.event_code">
              <gong-fa :userPlan="plan" :gongFaArr="gongFaArr" :eventCode="plan.event_code"></gong-fa>
            </van-step>
          </template>

          <!-- 运动推荐 -->
          <template v-if="plan.event_code === 'yundong' && exerciseCourse">
            <van-step :key="plan.event_code">
              <exercise
                :userPlan="plan"
                :eventCode="plan.event_code"
                :key="plan.event_code"
                :exerciseCourse="exerciseCourse"
              ></exercise>
            </van-step>
          </template>

          <!-- 早餐 -->
          <template v-if="plan.event_code === 'zaocan'">
            <van-step :key="plan.event_code">
              <meal-item
                :userPlan="plan"
                :eventCode="plan.event_code"
                :commonRecommendData="morningData"
                :principlesQuota="principlesQuota"
                @refresh="refresh"
              ></meal-item>
            </van-step>
          </template>
          <!-- 工间操 -->
          <template v-if="plan.event_code === 'gongjiancao'">
            <van-step :key="`${plan.event_code}${plan.num}`">
              <cao-item
                :exerciseWorkList="exerciseWorkList"
                :userPlan="plan"
                :eventCode="`${plan.event_code}${plan.num}`"
              ></cao-item>
            </van-step>
          </template>

          <!-- 音频 注意这一块的写法-->
          <template v-if="plan.event_code === 'yinpin' && prescriptionDTOs.length > 0">
            <van-step :key="plan.event_code">
              <Emotion :userPlan="plan" :eventCode="plan.event_code" :userEmotion="prescriptionDTOs"></Emotion>
            </van-step>
          </template>

          <!-- 睡前音乐 注意这一块的写法-->
          <template v-if="plan.event_code === 'shuiqianyoushengshu' && sleepHelps.length > 0">
            <van-step :key="plan.event_code">
              <Emotion :userPlan="plan" :eventCode="plan.event_code" :userEmotion="sleepHelps"></Emotion>
            </van-step>
          </template>

          <!-- 助眠音乐 -->
          <template v-if="plan.event_code === 'zhumianyinyue' && bedtimeDTOS.length > 0">
            <van-step :key="plan.event_code">
              <Emotion :userPlan="plan" :eventCode="plan.event_code" :userEmotion="bedtimeDTOS"></Emotion>
            </van-step>
          </template>

          <!-- 午餐 -->
          <template v-if="plan.event_code === 'wucan'">
            <van-step :key="plan.event_code">
              <meal-item
                :userPlan="plan"
                :eventCode="plan.event_code"
                :commonRecommendData="noonData"
                @refresh="refresh"
                :principlesQuota="principlesQuota"
              ></meal-item>
            </van-step>
          </template>

          <!-- 晚餐 -->
          <template v-if="plan.event_code === 'wancan'">
            <van-step :key="plan.event_code">
              <meal-item
                :userPlan="plan"
                :eventCode="plan.event_code"
                :commonRecommendData="nightData"
                @refresh="refresh"
                :principlesQuota="principlesQuota"
              ></meal-item>
            </van-step>
          </template>

          <!-- 文章推荐 -->
          <template v-if="plan.event_code === 'wenzhang'">
            <van-step :key="plan.event_code">
              <Article :userPlan="plan" :eventCode="plan.event_code"></Article>
            </van-step>
          </template>
        </template>
      </van-steps>
    </div>
  </div>
</template>
<script>
  import { commonRecommend, refreshRecommend } from "@/service/meal";
  import { getUserPlan, searchSuggestGongfa, getExerciseCourse } from "@/service/api";
  import { getDietPrinciples } from "@/service/health";

  import { queryExerciseWorkJobList } from "@/service/health/index";

  import { queryHealthPlan } from "@/service/mine";

  import { getUserEmotion2 } from "@/service/api";

  import Banner from "./components/Banner";
  import IconBox from "./components/IconBox";
  import MealItem from "./components/MealItem";
  import CaterItem from "./components/CaterItem";
  import CaoItem from "./components/CaoItem";
  import Exercise from "./components/Exercise";
  import Article from "./components/Article";
  import Emotion from "./components/Emotion";
  import FullLoading from "@/components/Loading";
  import LifeEntropy from "./components/lifeEntropy.vue";
  import { isEntropy } from "@/utils/permissions";
  import GongFa from "./components/GongFa.vue";

  export default {
    components: {
      FullLoading,
      CaterItem,
      CaoItem,
      MealItem,
      Exercise,
      Article,
      Emotion,
      Banner,
      IconBox,
      LifeEntropy,
      GongFa
    },
    props: {
      isScroll: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        gongFaArr: [],
        exerciseCourse: null,
        loading: false,
        userPlan: null,
        resData: {},
        morningData: null,
        noonData: null,
        nightData: null,
        lock: false,
        principlesQuota: null,
        clockInData: null,
        isEntropy: isEntropy(),
        exerciseWorkList: null,
        prescriptionDTOs: [], //音频
        sleepHelps: [], // 睡前有声书
        bedtimeDTOS: [] // 助眠音乐
      };
    },
    watch: {
      isScroll(value) {
        //console.log("走:", value);
        if (value) {
          // this.loading = true;
          if (this.isHealth) {
            this.fetchData();
          }
        }
      }
    },
    mounted() {
      this.date = dayjs().format("YYYY/MM/DD");
      //console.log("this.date", this.date);
      this.getCommonRecommend();
      this.queryExerciseWorkJobListFn();
      this.getUserDietPrinciples(); // 饮食原则一句话
    },
    computed: {
      isHealth() {
        return this.$route.path === "/health";
      }
    },
    methods: {
      async getUserEmotionFn(isRefresh) {
        try {
          let param = {
            refresh: isRefresh
          };
          const { code, data, message } = await getUserEmotion2(param);
          //console.log("情志推荐:哄睡专家", code, data, message);
          if (code === 0) {
            if (data) {
              if (data.prescriptionDTOs && data.prescriptionDTOs.length) {
                this.prescriptionDTOs = data.prescriptionDTOs;
              } else {
                this.prescriptionDTOs = [];
              }
              if (data.sleepHelps && data.sleepHelps.length) {
                this.sleepHelps = data.sleepHelps;
              } else {
                this.sleepHelps = [];
              }
              if (data.bedtimeDTOS && data.bedtimeDTOS.length) {
                this.bedtimeDTOS = data.bedtimeDTOS;
              } else {
                this.bedtimeDTOS = [];
              }
            }
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      queryExerciseWorkJobListFn() {
        queryExerciseWorkJobList().then(({ code, data, message }) => {
          if (code === 0) {
            this.exerciseWorkList = data;
          } else {
            //console.log("queryExerciseWorkJobList", message);
            // Toast(message);
          }
        });
      },
      async searchSuggestGongfaFn() {
        try {
          const { code, data, message } = await searchSuggestGongfa();
          //console.log("功法推荐", code, data, message);
          if (code === 0) {
            if (data && data.length > 0) {
              this.gongFaArr = data;
            } else {
              this.gongFaArr = [];
            }
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      async getExerciseCourseFn() {
        try {
          const { code, data, message } = await getExerciseCourse();
          //console.log("运动课程推荐", code, data, message);
          if (code === 0) {
            if (data) {
              this.exerciseCourse = data;
            } else {
              this.exerciseCourse = null;
            }
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      toggleLoading(val) {
        this.loading = val;
      },
      queryHealthPlanFn() {
        queryHealthPlan().then(({ code, data, message }) => {
          if (code === 0) {
            // 当天有运动
            if (data) {
              if (data.className) {
                this.clockInData = true;
              } else {
                // 当天无运动
                //state.sportsData = [];
              }
            } else {
              // 不适合运动
              // state.sportsData = null;
            }
            this.loading = false;
          }
        });
      },
      // 饮食原则一句话
      async getUserDietPrinciples() {
        try {
          const { code, message, data } = await getDietPrinciples();
          if (code === 0) {
            //console.log("饮食原则一句话：", data);
            // this.principlesQuota = data.principles_quota;
            this.principlesQuota = data;
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      // 换菜
      async refresh(foodInfo) {
        //console.log("这里写的难受：", foodInfo);
        if (this.lock) return;
        this.lock = true;
        let { name, cls, meal_time, recipeType } = foodInfo;
        //console.log("meal_time", meal_time);
        if (meal_time == "早餐") {
          meal_time = "zaocan";
        } else if (meal_time == "晚餐") {
          meal_time = "wancan";
        } else if (meal_time == "中餐") {
          meal_time = "zhongcan";
        }
        const { code, data, message } = await refreshRecommend({ lkcode: name, recipeType, eventCode: meal_time });
        const updateData = { ...foodInfo, ...data };
        switch (meal_time) {
          case "zaocan":
            this.refreshData(name, this.morningData, updateData);
            break;
          case "zhongcan":
            this.refreshData(name, this.noonData, updateData);
            break;
          case "wancan":
            this.refreshData(name, this.nightData, updateData);
            break;
        }
        this.lock = false;
      },
      refreshData(name, recommendData, updateData) {
        const index = recommendData.findIndex(item => item.name === name);
        recommendData.splice(index, 1, updateData);
      },
      // 智能推荐
      async getCommonRecommend() {
        const { code, data, message } = await commonRecommend({});
        //console.log("智能推荐xx：", code, data, message);
        // const { food_time_morning, food_time_noon, food_time_night } = data;
        const { zaocan, zhongcan, wancan, jiacan } = data;

        this.morningData = this.formatData(zaocan);

        //console.log("this.morningDatazzz", this.morningData);
        this.noonData = this.formatData(zhongcan);
        this.nightData = this.formatData(wancan);
      },
      formatData(code) {
        const data = [];

        if (code && code.gushu && code.gushu.length > 0) {
          code.gushu[0].foodNum = code.gushu.length;
          code.gushu[0].recipeType = "gushu";
          data.push({ ...code.gushu[0] });
        }

        if (code && code.douyu && code.douyu.length > 0) {
          code.douyu[0].foodNum = code.douyu.length;
          code.douyu[0].recipeType = "douyu";
          data.push({ ...code.douyu[0] });
        }

        if (code && code.shucai && code.shucai.length > 0) {
          code.shucai[0].foodNum = code.shucai.length;
          code.shucai[0].recipeType = "shucai";
          data.push({ ...code.shucai[0] });
        }

        if (code && code.pengtiao && code.pengtiao.length > 0) {
          code.pengtiao[0].foodNum = code.pengtiao.length;
          code.pengtiao[0].recipeType = "pengtiao";
          data.push({ ...code.pengtiao[0] });
        }

        // if (code && code.recipe_type_zc && code.recipe_type_zc.length > 0) {
        //     data.push({ ...code.recipe_type_zc[0] });
        // }
        // if (code && code.recipe_type_sc && code.recipe_type_sc.length > 0) {
        //     data.push({ ...code.recipe_type_sc[0] });
        // }

        //console.log("dataaaadccc", data);
        return data;
      },
      // 健康计划
      async getUserPlanFn() {
        try {
          const { code, data, message } = await getUserPlan();
          if (code === 0) {
            const plans = data.planContent.filter(item => item.event_code != "jiacan");
            if (this.$route.path != "/health") {
              this.judgeTimeData(plans);
            } else {
              this.userPlan = plans;
            }
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY年MM月DD日");
      },
      async fetchData() {
        try {
          await this.getUserPlanFn();
          this.isScroll && this.scrollView();
        } catch (error) {
          //console.log(error.message);
        }
      },
      scrollView() {
        const currentPlan = this.judgeTimeLine();
        // //console.log(currentPlan);
        if (currentPlan.event_code === "gongjiancao") {
          this.scrollToView(currentPlan.event_code + currentPlan.num);
        } else {
          this.scrollToView(currentPlan.event_code);
        }
      },
      // 滚动到指定元素位置
      scrollToView(id) {
        // //console.log(id, document.querySelector(`#${id}`));
        setTimeout(() => {
          if (this.isHealth) {
            document.querySelector(`#${id}`).scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest"
            });
            this.loading = false;
            return false;
          }
        }, 500);
      },
      // 我的模块 健康计划 数据处理
      judgeTimeData(plans) {
        const currentTimeStamp = new Date().valueOf();
        let overTimeStamp = new Date(`${this.date} ${plans[0].time}`).valueOf();
        // 当前时间戳小于第一个的时间点的时间戳,就显示计划的第一个
        if (currentTimeStamp <= overTimeStamp) {
          this.userPlan = plans[0];
          return;
        }

        // 过滤计划,找出大于上一个计划时间小于下一个计划时间的计划
        const currentPlans = plans.filter((item, index) => {
          // 当前计划的时间
          const timeStamp = new Date(`${this.date} ${item.time}`).valueOf();

          if (index != 0) {
            // 上一个计划的时间
            overTimeStamp = new Date(`${this.date} ${plans[index - 1].time}`).valueOf();
            // //console.log("当前时间:", `${this.date} ${item.time}`, `${this.date} ${plans[index - 1].time}`);
          }

          if (currentTimeStamp > overTimeStamp && currentTimeStamp <= timeStamp) {
            return item;
          }
        });

        this.userPlan = currentPlans;
      },
      // 时间轴判断
      judgeTimeLine() {
        const currentTimeStamp = new Date().valueOf();

        let overTimeStamp = new Date(`${this.date} ${this.userPlan[0].time}`).valueOf();
        // 当前时间戳小于第一个的时间点的时间戳,就显示计划的第一个
        if (currentTimeStamp <= overTimeStamp) {
          return this.userPlan[0];
        }

        const currentPlans = this.userPlan.filter((item, index) => {
          if (index != 0) {
            const [startTime, endTime] = item.time_periods.split("-");
            // 获取上一个区间的最大值
            const [start1Time, overTime] = this.userPlan[index - 1].time_periods.split("-");
            const startTimeStamp = new Date(`${this.date} ${overTime}`).valueOf();
            const endTimeStamp = new Date(`${this.date} ${endTime}`).valueOf();

            // 再上一个结束和当前结束范围内就返回当前
            if (currentTimeStamp > startTimeStamp && currentTimeStamp <= endTimeStamp) {
              return item;
            }
          }
        });

        return currentPlans[0];
      },
      goHealthSignIn() {
        this.$router.push("/signIn");
      }
    },
    activated() {
      if (this.isHealth) {
        if (!this.userPlan) {
          //console.log("无计划");
          this.fetchData();
        } else {
          // //console.log("有计划");
          // this.scrollView();
        }
        this.searchSuggestGongfaFn();
        this.getExerciseCourseFn();
        this.getUserEmotionFn(true);
      } else {
        this.getUserPlanFn();
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../style/meal.css";

  .container {
    .health-plan-box {
      display: flex;
      justify-content: space-between;
      padding: 40px 32px 0px;
      .health-plan-title {
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        text-align: left;
        color: #1c1c1e;
      }
      .health-sign-in {
        display: flex;
        align-items: center;
        .icon {
          display: block;
          width: 28px;
          height: 28px;
          margin-right: 8px;
        }
        .name {
          font-size: 26px;
          color: #4b7aff;
        }
      }
    }
    .dishesvarietyBox {
      padding: 20px 0;
      width: 648px;
      .dishesvariety {
        position: relative;
        width: 200px;
        img {
          width: 200px;
          height: 200px;
          background: #d8d8d8;
          border-radius: 8px;
        }
        .foodName {
          position: absolute;
          left: 0px;
          top: 144px;
          width: 200px;
          height: 56px;
          color: #ffffff;
          line-height: 56px;
          font-size: 28px;
          background: rgba(0, 0, 0, 0.4);
        }
        .foodNum {
          font-size: 28px;
          line-height: 40px;
          position: relative;
        }
      }
    }

    .time-line {
      margin-top: 12px;
      padding: 0 32px;

      .top {
        text-align: left;
        color: #1c1c1e;
        .time {
          height: 56px;
          line-height: 56px;
          font-size: 30px;
          font-weight: bold;
          span {
            font-size: 24px;
            font-weight: normal;
          }
        }
        .title {
          height: 60px;
          margin-top: 16px;
          .left {
            img {
              width: 60px;
              height: 60px;
              margin-right: 20px;
            }
            font-size: 28px;
            font-weight: bold;
          }
          .right {
            padding: 0 24px;
            height: 48px;
            border-radius: 44px;
            line-height: 48px;
            border: 1px solid #d0d4dc;
            color: #565961;
            font-size: 24px;
          }
        }
      }

      .bottom {
        margin-top: 24px;
        margin-right: 24px;
        overflow-x: scroll;
        .biteItem {
          width: 600px;
          height: 350px;
          /* background: #FFFFFF; */
          border-radius: 8px;
          margin-right: 24px;
          .title {
            height: 72px;
            background: linear-gradient(135deg, #f4f1fd 0%, #f1f9fc 100%);
            font-size: 28px;
            color: #3d3e42;
            line-height: 72px;
            text-align: left;
            padding-left: 20px;
            border-radius: 8px 8px 0px 0px;
          }
          .dishesvarietyBox {
            padding: 20px;
            box-shadow: 0px 8px 16px 0px rgba(194, 197, 205, 0.29);
            border-left: 1px solid #f4f1fd;
            width: 600px;
            .dishesvariety {
              position: relative;
              width: 176px;
              img {
                width: 176px;
                height: 176px;
                /* background: #D8D8D8; */
                border-radius: 8px;
              }
              .foodName {
                position: absolute;
                left: 0px;
                top: 120px;
                width: 176px;
                height: 56px;
                color: #ffffff;
                line-height: 56px;
                font-size: 28px;
                background-color: rgba(0, 0, 0, 0.4);
              }
            }
          }
        }

        .biteCaoItem {
          width: 648px;
          .dishesvariety {
            margin-right: 8px;
            img {
              width: 200px;
              height: 200px;
            }
          }
        }
      }

      // .waitered {
      //     margin-top: 36px;
      //     color: #1c1c1e;
      //     font-size: 28px;
      //     .orderBox {
      //         height: 48px;
      //         margin-bottom: 16px;
      //         .title {
      //             position: relative;
      //             .bg-bottom {
      //                 position: absolute;
      //                 left: 0;
      //                 right: 0;
      //                 bottom: -2px;
      //                 height: 12px;
      //                 background: #4b7aff;
      //                 opacity: 0.3;
      //             }
      //         }
      //         .btn {
      //             width: 144px;
      //             height: 48px;
      //             background: #4b7aff;
      //             border-radius: 44px;
      //             line-height: 48px;
      //             font-size: 24px;
      //             color: #fff;
      //         }
      //     }

      //     .repast {
      //         position: relative;
      //         .repastImg {
      //             width: 648px;
      //             height: 380px;
      //             background: #d8d8d8;
      //             border-radius: 16px;
      //         }

      //         .repastImg2 {
      //             width: 648px;
      //             height: 322px;
      //             background: #d8d8d8;
      //             border-radius: 16px;
      //         }
      //         .audioTag {
      //             position: absolute;
      //             right: 24px;
      //             top: 24px;
      //             width: 50px;
      //             height: 50px;
      //         }
      //         .audioInfo {
      //             position: absolute;
      //             left: 24px;
      //             right: 68px;
      //             top: 202px;
      //             font-size: 36px;
      //             color: #fff;
      //             text-align: left;
      //             .audioTop {
      //                 width: 526px;
      //                 height: 50px;
      //                 .audioName {
      //                     width: 360px;
      //                     flex-shrink: 0;

      //                     overflow: hidden;
      //                     text-overflow: ellipsis;
      //                     white-space: nowrap;
      //                     margin-right: 10px;
      //                 }
      //                 .playTimes {
      //                     width: 155px;
      //                     height: 40px;
      //                     background: #666262;
      //                     border-radius: 20px;
      //                     /* opacity: 0.8; */
      //                     font-size: 26px;
      //                     line-height: 40px;
      //                     position: relative;
      //                     .sanjiaoRight {
      //                         width: 16px;
      //                         height: 26px;
      //                         margin-left: 22px;
      //                         margin-right: 10px;
      //                     }
      //                 }
      //             }
      //             .audioBottom {
      //                 font-size: 28px;
      //                 margin-top: 6px;
      //                 width: 570;

      //                 overflow: hidden;
      //                 text-overflow: ellipsis;
      //                 white-space: nowrap;
      //             }
      //         }
      //         .name {
      //             position: absolute;
      //             left: 24px;
      //             top: 316px;
      //             font-size: 28px;
      //             color: #ffffff;
      //             z-index: 105;
      //         }
      //         .opacityBac {
      //             position: absolute;
      //             left: 0;
      //             width: 648px;
      //             top: 292px;
      //             height: 88px;
      //             background-color: #000000;
      //             opacity: 0.3;
      //             border-radius: 0 0 16px 16px;
      //             z-index: 102;
      //         }
      //     }
      //     .repastTip {
      //         font-size: 28px;
      //         font-family: PingFangSC-Regular, PingFang SC;
      //         font-weight: 400;
      //         color: #3d3e42;
      //         line-height: 40px;
      //     }
      // }

      // .warmUp {
      //     margin-top: 24px;
      //     .left {
      //         width: 78px;
      //         height: 158px;
      //         font-size: 22px;
      //         line-height: 34px;
      //         flex-shrink: 0;
      //         color: #3d3e42;
      //         padding: 0 14px;
      //         padding-top: 45px;
      //         background: linear-gradient(135deg, #ffd7f0 0%, #d4f4ff 100%);
      //         border-radius: 8px;
      //         border: 1px solid;
      //         border-image: linear-gradient(135deg, rgba(250, 164, 225, 1), rgba(198, 232, 248, 1)) 1 1;
      //     }
      //     .activeLeft {
      //         margin-left: 8px;
      //     }
      //     .right-sport {
      //         .item {
      //             margin-left: 8px;
      //             position: relative;
      //             img {
      //                 width: 280px;
      //                 height: 158px;
      //                 border-radius: 8px;
      //             }
      //             .sportBg {
      //                 position: absolute;
      //                 left: 0;
      //                 top: 118px;
      //                 width: 280px;
      //                 height: 40px;
      //                 background: rgba(255, 255, 255, 0.6);
      //                 border-radius: 0px 0px 8px 8px;
      //                 backdrop-filter: blur(1px);
      //             }
      //             .sportTextBox {
      //                 position: absolute;
      //                 left: 8px;
      //                 right: 8px;
      //                 top: 118px;
      //                 height: 40px;
      //                 font-size: 22px;
      //                 .text {
      //                     flex-shrink: 0;
      //                     width: 170px;
      //                     overflow: hidden;
      //                     text-overflow: ellipsis;
      //                     white-space: nowrap;
      //                 }
      //             }
      //         }
      //     }
      // }
    }
  }

  // .check-box {
  //     margin-right: 34px;
  //     ::v-deep.van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon {
  //         color: #fff;
  //         background-color: #1989fa;
  //         border-color: #1989fa;
  //     }
  // }
  .van-step--finish {
    padding-right: 0;
  }
</style>
