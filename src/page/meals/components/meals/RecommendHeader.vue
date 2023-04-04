<script>
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
  import { useRouter } from "@/hooks/useRouter";
  import { isIOS } from "@/utils/native/deviceEnv";

  export default defineComponent({
    props: {
      isShowRight: {
        type: Boolean,
        default: false
      },
      typeName: {
        type: String,
        default: "饮食智能推荐"
      },
      isRefresh: {
        type: Boolean,
        default: true
      },
      columns: {
        type: Array
      },
      canteenName: {
        type: String
      },
      isSpecialMeal: {
        type: Boolean,
        default: false
      }
    },
    components: {},
    setup(props, context) {
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);

      const { emit } = context;

      const store = useLocationStore();
      const { cityCode, canteenList } = storeToRefs(store);

      const state = reactive({
        show: false,
        orderBtnIsvisible: true
      });

      const canteen = ref("canteen");

      const init = () => {
        // // console.log('初始化')
      };

      const selectCanteen = () => {
        state.show = true;
        zgStatistics("健康新奥-餐食-点击切换食堂", {
          默认食堂名称: props["canteenName"]
        });
      };
      const toLunch = () => {
        router.push("/lunch");
      };

      const toFoodRecomList = () => {
        router.push("/foodRecomList");
      };

      const submit = () => {
        const changeValue = canteen.value.getValues();
        if (changeValue[0].canteenName != props["canteenName"]) {
          emit("canteen", changeValue[0]); // 自定义canteen事件
          zgStatistics("健康新奥-餐食-点击确认切换食堂", {
            食堂名称: changeValue[0].canteenName
          });
        }
        state.show = false;
      };
      onMounted(init);
      watch(
        canteenList,
        newVal => {
          // console.log('变化了')
          // console.log('newVal食堂', newVal)
          if (canteenList.value == "noData") {
            state.orderBtnIsvisible = false;
          }
          // else {
          //     if (newVal && newVal.length > 0) {
          //         state.canteenList = newVal;

          //         const filterCanteen = newVal.filter((item) => item.recommend === 1);
          //         const canteen = filterCanteen[0] || {};
          //         if (!canteen.canteenId) {
          //             // state.canteen = res.data[0]
          //             state.name = newVal[0].canteenName;
          //         } else {
          //             state.name = filterCanteen[0].canteenName;
          //         }
          //     }
          // }
        },
        // cityCode,
        // (newVal) => {
        //     alert('监控')
        //     // console.log(newVal, 'newVal')
        // },
        () => state.show,
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
        ...toRefs(state),
        canteen, // dom元素
        toLunch,
        toFoodRecomList,
        selectCanteen,
        submit,
        cityCode,
        canteenList
      };
    }
  });
</script>

<template>
  <div :class="['title', { 'special-title': !isRefresh }]">
    <div class="left-box">
      <div class="left-box-lf">
        {{ typeName }}
        <div class="bg"></div>
      </div>
      <div class="canteen_name" v-if="isSpecialMeal && canteenName">({{ canteenName }})</div>
    </div>
    <div class="right-box" v-if="isShowRight && orderBtnIsvisible" @click="toLunch">明日点餐</div>

    <div class="right-box-2" v-if="typeName == '饮食智能推荐'" @click="toFoodRecomList">
      列表查看
      <van-icon name="arrow" />
    </div>
    <div class="trigger-canteen" v-if="!isRefresh" @click="selectCanteen">
      <span>{{ canteenName }}</span>
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/arrow-right-blue.png" />
    </div>
    <van-popup
      v-model="show"
      get-container="body"
      position="bottom"
      round
      :style="{ height: '5.9rem', padding: '0.32rem 0.32rem 0.24rem', overflow: 'hidden' }"
      class="popup-box"
      :safe-area-inset-bottom="true"
    >
      <div class="header">
        <span>更换食堂</span>
        <img
          @click="show = false"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/common/popup-close.png"
        />
      </div>
      <div class="content">
        <van-picker ref="canteen" :columns="columns" item-height="0.6rem" visible-item-count="4">
          <template slot="option" slot-scope="option">
            <span>{{ option.canteenName }} <i v-if="option.recommend == 1">推荐</i></span>
          </template>
        </van-picker>
      </div>
      <div class="footer" @click="submit">提交</div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    height: 42px;
    &.special-title {
      margin-bottom: 12px;
    }
    .left-box {
      height: 42px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #1c1c1e;
      position: relative;
      width: fit-content;
      display: flex;
      .left-box-lf {
        position: relative;
        width: fit-content;
        .bg {
          position: absolute;
          bottom: 4px;
          width: 100%;
          height: 12px;
          background: rgba(75, 122, 255, 0.3);
        }
      }
      .canteen_name {
        margin-left: 6px;
        font-size: 24px;
        color: #737782;
        font-weight: 400;
      }
    }
    .right-box {
      width: 144px;
      height: 48px;
      background: #4b7aff;
      border-radius: 44px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .right-box-2 {
      height: 48px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4b7aff;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .trigger-canteen {
      height: 42px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4b7aff;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 12px;
        height: 18px;
        margin-left: 4px;
      }
      span {
        height: 42px;
        display: flex;
        align-items: center;
        line-height: 42px;
      }
    }
  }
  .popup-box {
    .header {
      width: 100%;
      height: 44px;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      margin-bottom: 48px;
      position: relative;
      span {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #1e201e;
        line-height: 44px;
      }
      img {
        width: 40px;
        height: 40px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .content {
      height: 266px;
      padding: 0 136px;
      .van-picker {
        ::v-deep .van-picker-column__item {
          display: flex;
          align-items: center;
          &.van-picker-column__item--selected {
            background: #f2f4f8;
            border-radius: 8px;
          }
          span {
            display: flex;
            align-items: center;
            i {
              width: 74px;
              height: 36px;
              background: #ff9c00;
              border-radius: 18px 18px 18px 0px;
              font-size: 24px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 34px;
              font-style: normal;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 4px;
            }
          }
        }
      }
    }
    .footer {
      height: 88px;
      background: #4b7aff;
      border-radius: 50px;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
