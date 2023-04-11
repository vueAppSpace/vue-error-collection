<script>
  import RecommendHeader from "./RecommendHeader.vue";
  import FoodTag from "./FoodTag.vue";

  import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    onActivated,
    onDeactivated,
    watch,
    ref
  } from "@vue/composition-api";
  import { useLocationStore, storeToRefs } from "@/pinia";
  import { useUserStore } from "@/pinia";

  import { selfRecommend } from "@/service/meal";
  // import { getCanteenListByEmp } from "@/service/health";

  export default defineComponent({
    props: {
      typeName: {
        type: String
      },
      isRefresh: {
        type: Boolean,
        default: true
      },
      recommendData: {
        type: Array
      },
      canteenName: {
        type: String
      },
      columns: {
        type: Array
      }
    },
    setup(props, context) {
      const store = useLocationStore();
      const { cityCode } = storeToRefs(store);

      const { canteenList } = storeToRefs(store);

      const { setCanteenList } = store;

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        name: props["canteenName"],
        canteenList: props["columns"],
        canteen: {
          canteenId: "",
          canteenName: ""
        },
        recommendFood: props["recommendData"]
      });

      const getSelfRecommend = async () => {
        const phrId = userInfo.value.phrId;
        const params = {
          eventCode: "wucan",
          canteenId: state.canteen.canteenId,
          date: dayjs().format("YYYY-MM-DD"),
          rcls: 2,
          phrId
        };
        const { code, data, message } = await selfRecommend(params);
        // //console.log("自助餐：", code, data, message);

        let recipe_type_all = null;
        if (data.food_time_noon) {
          recipe_type_all = data.food_time_noon.recipe_type_all;
        }
        if (recipe_type_all && recipe_type_all.length > 0) {
          state.recommendFood = [].concat(recipe_type_all);
        } else {
          state.recommendFood = [];
        }
      };

      const confirmCanteen = (value, event) => {
        state.name = "";
        //console.log("value111", value);
        state.name = value.canteenName;
        state.canteen = value;
        getSelfRecommend();
      };

      watch(
        canteenList,
        (newVal, oldVal) => {
          //console.log("xx");
          //console.log("newValyyy", newVal);
          if (newVal == "noData") {
            state.recommendFood = null;
          } else {
            if (newVal && newVal.length > 0) {
              state.canteenList = newVal;
              const filterCanteen = newVal.filter(item => item.recommend === 1);
              const canteen = filterCanteen[0] || {};
              if (!canteen.canteenId) {
                state.canteen = newVal[0];
                state.name = newVal[0].canteenName;
              } else {
                state.canteen = filterCanteen[0];
                state.name = filterCanteen[0].canteenName;
              }
              getSelfRecommend();
              localStorage.setItem("columns", JSON.stringify(newVal));
            }
          }
        },
        { deep: true, immediate: true }
      );

      onMounted(() => {});
      return {
        cityCode,
        canteenList,
        setCanteenList,
        confirmCanteen,
        ...toRefs(state)
      };
    },
    components: {
      RecommendHeader,
      FoodTag
    }
  });
</script>

<template>
  <div class="recommend-meal" v-if="recommendFood">
    <RecommendHeader
      :typeName="typeName"
      :isRefresh="isRefresh"
      :columns="canteenList"
      :canteenName="name"
      @canteen="confirmCanteen"
    />
    <!-- <div class="tip" v-if="isRefresh">4～5星疗愈、适宜；&lt;3星含健康减分因素、不宜</div> -->

    <div v-if="recommendFood.length > 0">
      <div class="tip">
        4～5星疗愈<span class="star_label green">适宜</span>
        <span class="line_cross_line">|</span>
        <3星含健康减分因素
        <span class="star_label red">不宜</span>
      </div>
      <!--  -->
      <!-- {{ recommendData }} -->
      <div :class="['food-box']">
        <FoodTag
          v-for="item in recommendFood"
          :key="item.lkcode"
          :isRefresh="isRefresh"
          :foodInfo="item"
          @refresh="$emit('refresh', $event)"
        />
      </div>
    </div>
    <div v-else class="noData">暂无食堂餐品信息～</div>
  </div>
</template>

<style lang="scss" scoped>
  .tip {
    height: 64px;
    padding-left: 12px;
    color: #333;
    background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/star_label_bg.png")
      no-repeat left center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin-bottom: 16px;
    padding-top: 8px;
    .star_label {
      width: 64px;
      height: 36px;
      background: rgba(0, 200, 99, 0.1);
      border-radius: 4px;
      /* opacity: 0.1; */
      line-height: 36px;
      text-align: center;

      font-size: 24px;
    }
    .green {
      color: rgba(0, 200, 99, 1);
      margin-left: 4px;
    }
    .line_cross_line {
      display: block;
      width: 2px;
      margin: 0 24px;
      color: #dadae1;
    }
    .red {
      margin-left: 4px;
      background: rgba(245, 88, 88, 0.1);
      color: rgba(245, 88, 88, 1);
    }
  }
  .food-box {
    display: flex;
    align-items: center;
    overflow-x: scroll;
    overflow-y: hidden;
    .food-item {
      margin-right: 24px;
      &:last-child {
        margin-right: 0;
      }
    }
    &.scrollX {
      overflow-x: scroll;
      overflow-y: hidden;
    }
  }
  .noData {
    text-align: center;
  }
</style>
