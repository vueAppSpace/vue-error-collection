<template>
  <!-- 饮食 -->
  <div :id="eventCode">
    <div class="top">
      <div class="time">
        {{ userPlan.time }}
        <span>{{ parseInt(userPlan.time) >= 12 ? "pm" : "am" }}</span>
      </div>
      <div class="title flex-between">
        <div class="left flex-center">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/chef.png" />
          <span>{{ userPlan.event }}</span>
        </div>
        <div class="right" @click="ToastHandle(type)">摄入量记录></div>
      </div>
    </div>

    <div class="bottom flex">
      <div class="biteItem" v-for="(item, index) in zaocanRecommend" :key="index">
        <div v-if="index == 0" class="title">饮食方案一</div>
        <div v-if="index == 1" class="title">饮食方案二</div>
        <div v-if="index == 2" class="title">饮食方案三</div>
        <div class="dishesvarietyBox flex-between">
          <div class="dishesvariety" @click="toDetail(item.douyudanrou_name, 2)" v-if="item.douyudanrou_name">
            <div><img :src="item.douyudanrou_pic" /></div>
            <div class="foodName">{{ item.douyudanrou_name }}</div>
            <div class="opacityBg"></div>
            <p class="foodNum">{{ item.douyudanrou_Suggest.name }}{{ Math.round(item.douyudanrou_Suggest.weight) }}g</p>
          </div>

          <div class="dishesvariety" @click="toDetail(item.shucai_name, 2)" v-if="item.shucai_name">
            <div><img :src="item.shucai_pic" /></div>
            <div class="foodName">{{ item.shucai_name }}</div>
            <div class="opacityBg"></div>
            <p class="foodNum">{{ item.shucai_Suggest.name }}{{ Math.round(item.shucai_Suggest.weight) }}g</p>
          </div>

          <div class="dishesvariety" @click="toDetail(item.zhushi_name, 2)" v-if="item.zhushi_name">
            <div><img :src="item.zhushi_pic" /></div>
            <div class="foodName">{{ item.zhushi_name }}</div>
            <div class="opacityBg"></div>
            <p class="foodNum">{{ item.zhushi_Suggest.name }}{{ Math.round(item.zhushi_Suggest.weight) }}g</p>
          </div>

          <div class="dishesvariety" v-if="item.jianguozhongzi_name" @click="toDetail(item.jianguozhongzi_name, 2)">
            <div><img :src="item.jianguozhongzi_pic" /></div>
            <div class="foodName">{{ item.jianguozhongzi_name }}</div>
            <div class="opacityBg"></div>
            <p class="foodNum">{{ item.jianguozhongzi_Suggest.name }}{{ item.jianguozhongzi_Suggest.weight }}g</p>
          </div>

          <div class="dishesvariety" v-if="item.nai_name" @click="toDetail(item.nai_name, 2)">
            <div><img :src="item.nai_pic" /></div>
            <div class="foodName">{{ item.nai_name }}</div>
            <div class="opacityBg"></div>
            <p class="foodNum">{{ item.nai_Suggest.name }}{{ item.nai_Suggest.weight }}g</p>
          </div>

          <div class="dishesvariety" v-if="item.shuiguo_name" @click="toDetail(item.shuiguo_name, 2)">
            <div><img :src="item.shuiguo_pic" /></div>
            <div class="foodName">{{ item.shuiguo_name }}</div>
            <div class="opacityBg"></div>
            <p class="foodNum">{{ item.shuiguo_Suggest.name }}{{ item.shuiguo_Suggest.weight }}g</p>
          </div>
        </div>
      </div>
    </div>

    <div class="waitered" v-if="type === 1">
      <div>
        <div class="orderBox flex-between">
          <div class="title">
            已点特色餐
            <div class="bg-bottom"></div>
          </div>
          <div class="btn" @click="toLunch">明日点餐</div>
        </div>

        <div class="repast" v-if="orderList.length" @click="toDetail(orderList[0].dishName, 2)">
          <img v-if="orderList[0].dishImg" class="repastImg" :src="orderList[0].dishImg" />

          <img
            v-else
            class="repastImg"
            src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/swip-img.png"
          />
          <div class="name">{{ orderList[0].dishName }}</div>
          <div class="opacityBac"></div>
        </div>

        <div v-else class="repastTip" @click="toMealSuggest">暂时没有您的点餐数据哦~</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserMeals, orderListByEmployeeId } from "@/service/api";
  import { mapState, useUserStore } from "@/pinia";

  export default {
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    data() {
      return {
        zaocanRecommend: [],
        orderList: []
      };
    },
    props: {
      userPlan: {
        type: Object,
        default: {}
      },
      eventCode: {
        type: String
      },
      type: {
        type: Number
      }
    },
    mounted() {
      if (this.type === 0) {
        // 早餐
        this.getUserMealsFn("zaocan");
      } else if (this.type === 1) {
        // 午餐
        this.getUserMealsFn("wucan");
        this.orderListByEmployeeIdFn();
      } else if (this.type === 2) {
        // 晚餐
        this.getUserMealsFn("wancan");
      }
      // wucan、wancan、jiacan
    },
    methods: {
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY年MM月DD日");
      },
      ToastHandle(type) {
        localStorage.removeItem("extraindex");
        this.$router.push({
          path: "/ADIHistory",
          query: {
            type: type
          }
        });
      },
      toLunch() {
        this.$router.push("/lunch");
      },
      toDetail(name, type) {
        if (this.$route.path !== "/health") {
          this.zgStatistics("健康新奥-我的-点击卡片", { 按钮名称: name, 位置: "餐食" });
        }
        this.$router.push({ path: "/dietDetail", query: { type, name } });
      },
      async getUserMealsFn(eventCode) {
        try {
          const { code, data, message } = await getUserMeals({ eventCode });
          //console.log("饮食推荐:", code, data);
          if (code === 0) {
            this.zaocanRecommend = data;
          } else {
            //console.log(message);
          }
        } catch (error) {
          //console.log(error.message);
        }
      },
      // 获取点餐的订单数据
      orderListByEmployeeIdFn() {
        orderListByEmployeeId({
          date: dayjs().format("YYYY-MM-DD"),
          // date: dayjs().subtract(9, 'day').format("YYYY-MM-DD"),
          employeeId: this.userInfo.empNo ? this.userInfo.empNo : 10104970
        }).then(({ code, data, message }) => {
          if (code === 0) {
            this.loading = false;

            if (data) {
              this.orderList = data;
            }
          } else {
            //console.log(message);
          }
        });
      },
      toMealSuggest() {
        this.$router.push("/mealSuggest");
      }
    }
  };
</script>
<style lang="scss" scoped>
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
        border: 2px solid #d0d4dc;
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
        border-radius: 8px;
        .dishesvariety {
          position: relative;
          width: 176px;
          img {
            width: 176px;
            height: 176px;
            border-radius: 8px;
            background: #d8d8d8;
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
            border-radius: 0px 0px 8px 8px;
          }
          .foodNum {
            position: relative;
            font-size: 26px;
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

  .waitered {
    margin-top: 36px;
    color: #1c1c1e;
    font-size: 28px;
    .orderBox {
      height: 48px;
      margin-bottom: 16px;
      .title {
        position: relative;
        .bg-bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 12px;
          background: #4b7aff;
          opacity: 0.3;
        }
      }
      .btn {
        width: 144px;
        height: 48px;
        background: #4b7aff;
        border-radius: 44px;
        line-height: 48px;
        font-size: 24px;
        color: #fff;
      }
    }

    .repast {
      position: relative;
      .repastImg {
        width: 648px;
        height: 380px;
        background: #d8d8d8;
        border-radius: 16px;
      }
      .name {
        position: absolute;
        left: 24px;
        top: 316px;
        font-size: 28px;
        color: #ffffff;
        z-index: 105;
      }
      .opacityBac {
        position: absolute;
        left: 0;
        width: 648px;
        top: 292px;
        height: 88px;
        background-color: #000000;
        opacity: 0.3;
        border-radius: 0 0 16px 16px;
        z-index: 102;
      }
    }
    .repastTip {
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d3e42;
      line-height: 40px;
    }
  }
</style>
