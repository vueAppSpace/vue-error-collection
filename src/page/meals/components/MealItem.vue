<template>
  <div class="meal-item" :id="eventCode">
    <TimeLine :userPlan="userPlan" />
    <HeaderBox :userPlan="userPlan" />
    <MealSuggestTip :principlesQuota="principlesQuota"></MealSuggestTip>
    <div class="content-box">
      <template v-if="eventCode === 'wucan'">
        <!-- 自助餐 -->
        <RecommendMeal
          v-if="selfRecommendData && !isHidden"
          class="common-space"
          typeName="今日自助推荐"
          :isRefresh="false"
          :columns="columns"
          :canteenName="canteen.canteenName"
          :recommendData="selfRecommendData"
          @refresh="$emit('refresh', $event)"
          @canteen="handleCanteen"
        />

        <!-- 特色餐 -->
        <SpecialMeal v-if="canteen.canteenId" class="common-space" @special="handleSpecial" />
      </template>
      <SmartMeal :recommendData="commonRecommendData" @refresh="$emit('refresh', $event)" />
    </div>
  </div>
</template>

<script>
  import MealSuggestTip from "./MealSuggestTip";
  import { selfRecommend } from "@/service/meal";
  import { getCanteenListByEmp } from "@/service/health";
  import TimeLine from "./TimeLine";
  import HeaderBox from "./meals/HeaderBox.vue";
  import SpecialMeal from "./meals/SpecialMeal.vue";
  import RecommendMeal from "./meals/RecommendMeal.vue";
  import SmartMeal from "./meals/SmartMeal.vue";

  import { useLocationStore, storeToRefs } from "@/pinia";

  export default {
    props: {
      userPlan: {
        type: Object,
        default: {}
      },
      eventCode: {
        type: String
      },
      principlesQuota: {
        type: Object
      },
      commonRecommendData: {
        type: [Array, Object]
      }
    },
    data() {
      return {
        isHidden: false,
        selfRecommendData: null,
        columns: [],
        // todo 食堂列表放开以后，就不需要这个默认值了
        // canteen: {
        //     canteenId: 4,
        //     canteenName: "新奥新智食堂",
        //     introduce: "新奥新智食堂",
        //     location: "集团总部南区",
        //     logo: "http://oss-appupload.icomecloud.com/food/test/food3ac5e17b-26e7-4f2b-b448-2fd36ef34a9b_1627973176244.png",
        //     recommend: 1,
        // },
        canteen: {
          canteenId: "",
          canteenName: ""
        }
        // cityCode: cityCode
      };
    },

    methods: {
      // 获取自助餐推荐
      async getSelfRecommend() {
        const phrId = window.localStorage.getItem("phrId");
        const params = {
          eventCode: "wucan",
          canteenId: this.canteen.canteenId,
          date: dayjs().format("YYYY-MM-DD"),
          rcls: 2,
          phrId
        };
        const { code, data, message } = await selfRecommend(params);

        let recipe_type_all = null;
        if (data.food_time_noon) {
          recipe_type_all = data.food_time_noon.recipe_type_all;
        }

        if (recipe_type_all && recipe_type_all.length > 0) {
          this.selfRecommendData = [].concat(recipe_type_all);
        } else {
          this.selfRecommendData = [];
        }
      },
      // 获取餐厅列表
      async getCanteenList() {
        // alert(22)
        const employeeId = window.localStorage.getItem("empNo");
        console.log("useLocationStore().cityCode", useLocationStore().cityCode);
        getCanteenListByEmp({ employeeId, cityCode: useLocationStore().cityCode })
          .then(res => {
            if (res.code === 0) {
              this.columns = res.data;
              const filterCanteen = res.data.filter(item => item.recommend === 1);
              this.canteen = filterCanteen[0] || {};
              if (!this.canteen.canteenId) {
                this.canteen = res.data[0];
              }
              localStorage.setItem("columns", JSON.stringify(res.data));
              this.getSelfRecommend();
            } else {
              // console.log(res.message);
            }
          })
          .catch(error => {
            // console.log(error.message);
          });
      },
      handleCanteen(value) {
        this.canteen = value;
        this.getSelfRecommend();
      },
      async handleSpecial(value) {
        this.isHidden = localStorage.getItem("isHidden");
      }
    },
    mounted() {
      localStorage.setItem("isHidden", "");
      if (this.eventCode == "wucan") {
        this.getCanteenList();
      }
    },
    components: {
      MealSuggestTip,
      TimeLine,
      HeaderBox,
      SpecialMeal,
      RecommendMeal,
      SmartMeal
    }
  };
</script>

<style lang="scss" scoped>
  .meal-item {
    text-align: left;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 40px;
    .content-box {
      margin-top: 24px;
      .common-space {
        margin-bottom: 32px;
      }
    }
  }
</style>
