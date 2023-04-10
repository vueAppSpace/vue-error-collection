<template>
  <div class="container">
    <div class="waitered buffet">
      <div class="orderBox flex-between">
        <div class="title">
          餐量参考
          <div class="bg-bottom"></div>
        </div>
      </div>

      <div style="margin-left: -0.32rem">
        <bite-item v-if="zaocanRecommend" :zaocanRecommend="zaocanRecommend"></bite-item>
      </div>
    </div>

    <div class="canteenBox flex-between" v-if="canteenListData">
      <div class="flex-center">
        <img :src="canteen.logo" />
        <div class="canteenInfo">
          <div class="canteenName">
            <span>{{ canteen.canteenName }}</span>
            <span class="canteenTag">明日特色餐</span>
          </div>
          <div class="addressInfo">{{ canteen.location }}</div>
        </div>
      </div>
      <div class="changeCanteen" @click="selectCanteen">
        更换食堂
        <van-icon name="arrow" />
        <!-- <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/arrowRight.png" /> -->
      </div>
    </div>

    <div class="canteenList" v-if="componentListData && componentListData.length">
      <div class="canteenItem" v-for="(item, index) in componentListData" :key="index">
        <div class="left flex" @click="toDetail(item)">
          <img :src="item.detail.pic" />
          <div class="tagTissue">
            <div class="caiName">{{ item.rname }}</div>
            <div class="tagList" v-if="item.detail.scoreExtraArr && item.detail.scoreExtraArr.length > 4">
              <span class="tagRed">
                <span>谨慎食用</span>
              </span>
            </div>

            <div class="tagList" v-else>
              <span v-for="(obj, idx) in item.detail.nutr" :key="idx" class="tag">
                <span v-if="obj.value > 0">{{ obj.name }}</span>
                <span v-else style="color: #ed6066">{{ obj.name }}</span>
              </span>
            </div>

            <div class="recommend flex">
              推荐指数:
              <img v-for="(obj, idx) in item.detail.scoreArr" :key="idx" src="../../assets/images/meal/star_2.png" />
              <div class="flex" v-if="item.detail.scoreExtraArr && item.detail.scoreExtraArr.length">
                <img
                  v-for="(obj, idx) in item.detail.scoreExtraArr"
                  :key="idx"
                  src="../../assets/images/meal/star_1.png"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="orderBtn" @click="toLunch(item)">点餐</div>
      </div>
    </div>

    <div class="canteenListSpec" v-else>
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/noMeals.png" />

      <div class="text">暂无膳食信息</div>
    </div>

    <van-popup
      v-model="show"
      get-container="body"
      position="bottom"
      round
      :style="{ height: '5.7rem', padding: '0.32rem 0.32rem 0.24rem', overflow: 'hidden' }"
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
        <van-picker ref="canteen" :columns="canteenListData" item-height="0.6rem" visible-item-count="4">
          <template slot="option" slot-scope="option">
            <span>{{ option.canteenName }} <i v-if="option.recommend == 1">推荐</i></span>
          </template>
        </van-picker>
      </div>
      <div class="footer" @click="submit">提交</div>
    </van-popup>
  </div>
</template>
<script>
  // import moment from 'moment'
  import loading from "../../components/Loading";
  import { getComponentList, canteenList, getUserMeals, getBizField, getDishesInfo } from "@/service/api";
  import BiteItem from "./components/BiteItem";

  import { orderLunchUrl, dianCanUrl } from "@/config/env";

  import { useLocationStore, useUserStore, mapState } from "@/pinia";

  const cityCode = useLocationStore().cityCode;

  console.log("cityCode", cityCode);

  const host = window.location.href;

  import { jsBridge } from "@/utils/native/jsBridge";
  import { isIOS, isUniApp, isIcomeMobile, isIcomePC } from "@/utils/native/deviceEnv";

  export default {
    directives: {},
    components: {
      loading,
      BiteItem
    },
    data() {
      return {
        show: false,
        componentListData: null,
        canteenListData: null,
        canteen: {
          logo: "",
          canteenName: "",
          location: ""
        },
        dataArr: [1, 2, 3, 4, 5],
        zaocanRecommend: null,
        dishesInfo: null, // 饮食建议
        scoreList: null,
        cityCode: cityCode
      };
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"]),
      text() {
        return this.currentRate.toFixed(0) + "%";
      },
      text2() {
        return this.currentRate2.toFixed(0) + "%";
      }
    },
    methods: {
      selectCanteen() {
        this.show = true;
        this.zgStatistics("健康新奥-餐食-点击切换食堂", {
          默认食堂名称: this.canteen.canteenName
        });
      },
      submit() {
        // console.log(this.$refs.canteen.getValues());
        const changeValue = this.$refs.canteen.getValues();
        if (changeValue[0].canteenName != this.canteenName) {
          this.canteen = changeValue[0];
          this.getComponentListFn();
          this.zgStatistics("健康新奥-餐食-点击确认切换食堂", {
            食堂名称: changeValue[0].canteenName
          });
        }
        this.show = false;
      },
      toDetail(item) {
        console.log("name", item);
        // return false
        this.$router.push({
          path: "/foodDetail",
          query: {
            name: item.lkcode,
            star: item.detail.score[0].value,
            type: 1
          }
        });
      },
      getDishesInfoFn() {
        getDishesInfo().then(({ code, data, message }) => {
          if (code === 0) {
            this.dishesInfo = data.dataList;
          } else {
            console.log("getDishesInfo", message);
            // Toast(message)
          }
        });
      },
      toLunch(item) {
        console.log("item", item);

        let nameArr = [];
        nameArr.push(item.lkcode);

        this.getBizFieldFn(nameArr);

        let tagName = "";
        if (item.detail.nutr && item.detail.nutr.length) {
          for (let obj of item.detail.nutr) {
            let name = obj.name + "/";
            tagName += name;
          }
        }
        console.log("item.detail.score[0].value", item.detail.score[0].value);
        this.zgStatistics("健康新奥-明日点餐-点击点餐", {
          食物名称: item.rname,
          推荐指数: item.detail.score[0].value,
          餐次类别: "午餐",
          标签: tagName
        });
      },
      getBizFieldFn(nameArr) {
        let data = {
          recipes: nameArr,
          canteenId: this.canteen.canteenId
        };
        getBizField(data)
          .then(res => {
            if (res.data) {
              console.log("id", res.data);
              let dishId = res.data[0].id;
              // return false
              // let ticket = localStorage.getItem('ticket');

              let date = dayjs().add(1, "day").format("YYYY-MM-DD");

              let url =
                `${orderLunchUrl}` +
                encodeURIComponent(
                  `${dianCanUrl}?ticket=ticket&dishId=${dishId}&canteenId=${this.canteen.canteenId}&dd_full_screen=true&date=${date}`
                );

              // 点餐宝地址
              // var orderLunchUrl = 'https://icome-dingtalk-h5.uat.ennew.com/transit?redirect_uri='
              // var dianCanUrl = 'https://imeal-h5.uat.ennew.com/mealDetail'
              let dianCanUrlPcParame = `${dianCanUrl}?ticket=ticket&dishId=${dishId}&canteenId=${this.canteen.canteenId}&dd_full_screen=true&date=${date}`;
              let url2 =
                "dingtalk://dingtalkclient/page/link?url=" +
                encodeURIComponent(orderLunchUrl + encodeURIComponent(dianCanUrlPcParame)) +
                "&web_wnd=general&width=960&height=640";
              // dingtalk://dingtalkclient/page/link?url=https%3A%2F%2Ficome-dingtalk-h5.uat.ennew.com%2Ftransit%3Fredirect_uri%3Dhttps%253A%252F%252Fimeal-h5.uat.ennew.com%252FmealDetail%253Fticket%253Dticket%2526dishId%253D4425%2526canteenId%253D4%2526dd_full_screen%253Dtrue%2526date%253D2022-09-01&web_wnd=general&width=960&height=640

              let userInfo = null;
              if (isUniApp) {
                userInfo = JSON.parse(localStorage.getItem("ticket"));
              }
              let emallUrl = encodeURIComponent(
                `${dianCanUrl}?authCode=${userInfo.grantCode}&authTenantId=${userInfo.accountId}&dishId=${dishId}&canteenId=${this.canteen.canteenId}&date=${date}`
              );
              if (isIcomeMobile) {
                jsBridge.invoke("openWebView", { targetUrl: url });
              } else if (isIcomePC) {
                console.log("url2", url2);
                window.location.href = url2;
              } else if (isUniApp) {
                jsBridge.invoke("openWebView", { targetUrl: emallUrl });
              }
            }
          })
          .catch(ex => {});
      },
      getUserMealsFn(eventCode) {
        getUserMeals({
          eventCode: eventCode
        })
          .then(res => {
            if (res.data) {
              this.zaocanRecommend = res.data;
            }
          })
          .catch(ex => {});
      },
      canteenListFn() {
        const employeeId = this.userInfo.empNo;
        canteenList({ cityCode: this.cityCode, employeeId }).then(({ code, data, message }) => {
          if (code === 0) {
            if (data) {
              this.canteenListData = data;

              this.getComponentListFn();
            }
          } else {
            console.log("canteenList", message);
            // Toast(message)
          }
        });
      },
      getComponentListFn() {
        let btd = dayjs().add(1, "day").format("YYYY-MM-DD");
        // let btd = dayjs().subtract(18, 'day').format("YYYY-MM-DD");
        getComponentList({
          eventCode: "wucan",
          phrId: this.userInfo.phrId,
          canteenId: this.canteen.canteenId, // 食堂id 调试时不填
          date: btd
        }).then(({ code, data, message }) => {
          if (code === 0) {
            if (data) {
              this.componentListData = [];

              let recipe_type_fw = data.recipe_rec_detail.food_time_noon.recipe_type_fw;

              console.log("recipe_type_fw", recipe_type_fw);
              for (let i = 0; i < recipe_type_fw.length; i++) {
                if (recipe_type_fw[i].detail.score && recipe_type_fw[i].detail.score.length) {
                  let arr = [];
                  let arr2 = [];
                  console.log(
                    "recipe_type_fw[i].detail.score[0].value",
                    Math.round(recipe_type_fw[i].detail.score[0].value)
                  );
                  if (Math.round(recipe_type_fw[i].detail.score[0].value) < 0) {
                    arr.length = 0;
                  } else {
                    arr.length = Math.round(recipe_type_fw[i].detail.score[0].value);
                  }
                  arr2.length = 5 - arr.length;
                  recipe_type_fw[i].detail.scoreArr = arr;
                  recipe_type_fw[i].detail.scoreExtraArr = arr2;
                }
                this.componentListData.push(recipe_type_fw[i]);
              }

              console.log("this.componentListDataxx", this.componentListData);

              let nameArr = [];
              for (let i = 0; i < recipe_type_fw.length; i++) {
                nameArr.push(data.recipe_rec_detail.food_time_noon.recipe_type_fw[i].rname);
              }
            }
          } else {
            console.log("getComponentList", message);
            // Toast(message)
          }
        });
      },
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY年MM月DD日");
      }
    },
    watch: {},
    mounted() {
      // this.canteenListFn();

      this.canteenListData = JSON.parse(localStorage.getItem("columns"));
      const filterCanteen = this.canteenListData.filter(item => item.recommend === 1);
      this.canteen = filterCanteen[0] || {};
      if (!this.canteen.canteenId) {
        this.canteen = this.canteenListData[0];
      }

      this.getComponentListFn();

      this.getUserMealsFn("wucan");

      this.getDishesInfoFn();
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../style/meal.css";

  .container {
    background: #f0f2f7;
    width: 100%;
    height: 100%;
    padding: 20px;
    .van-swipe {
      border-radius: 0.16rem;
      box-shadow: 0px 8px 16px 0px rgba(145, 149, 161, 0.2);
    }

    .dishesvarietyBox {
      width: 598px;
      .dishesvariety {
        position: relative;
        width: 184px;
        img {
          width: 184px;
          height: 128px;
          background: #d8d8d8;
          border-radius: 8px;
        }
        .foodName {
          position: absolute;
          left: 0px;
          top: 84px;
          width: 184px;
          height: 44px;
          color: #ffffff;
          line-height: 44px;
          font-size: 24px;
          z-index: 105;
        }
        .opacityBg {
          position: absolute;
          left: 0px;
          top: 84px;
          width: 184px;
          height: 44px;
          background: #000000;
          border-radius: 0px 0px 8px 8px;
          opacity: 0.4;
          z-index: 100;
        }
        .foodNum {
          font-size: 26px;
          line-height: 40px;
        }
      }
    }

    .waitered {
      width: 710px;
      height: 312px;
      margin: 0 auto;
      color: #1c1c1e;
      font-size: 28px;
      padding: 32px 56px;
      background-color: #fff;
      border-radius: 16px;
      margin-bottom: 24px;
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

        .repastImg2 {
          width: 648px;
          height: 322px;
          background: #d8d8d8;
          border-radius: 16px;
        }
        .audioTag {
          position: absolute;
          right: 24px;
          top: 24px;
          width: 50px;
          height: 50px;
        }
        .audioInfo {
          position: absolute;
          left: 24px;
          right: 68px;
          top: 202px;
          font-size: 36px;
          color: #fff;
          .audioTop {
            width: 526px;
            height: 50px;
            .audioName {
              width: 360px;
              flex-shrink: 0;

              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: 10px;
            }
            .playTimes {
              width: 155px;
              height: 40px;
              background: #202020;
              border-radius: 20px;
              opacity: 0.1;
              font-size: 26px;
              line-height: 40px;
              position: relative;
              .sanjiaoRight {
                width: 16px;
                height: 26px;
                margin-left: 22px;
                margin-right: 10px;
              }
            }
          }
          .audioBottom {
            font-size: 28px;

            width: 570;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
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

    /* <div class="canteenBox flex-between">
            <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/swip-img.png" />
            <div class="canteenInfo">
                <div class="canteenName">
                    <span>科一食堂</span>
                    <span class="canteenTag">明日特色餐</span>
                </div>
            </div>
            <div>更换食堂 ></div>
        </div> */
    .canteenBox {
      width: 710px;
      height: 192px;
      background: #ffffff;
      border-radius: 16px;
      font-size: 26px;
      color: #737782;
      padding: 32px;
      padding-right: 22px;
      img {
        width: 128px;
        height: 128px;
        background: #dadae1;
        border-radius: 8px;
      }
      .canteenInfo {
        font-weight: bold;
        margin: 0 0px 0 20px;
        text-align: left;
        .canteenName {
          .canteenTag {
            font-weight: normal;
            padding: 0 12px;
            height: 40px;
            background: #dce5ff;
            border-radius: 8px;
            line-height: 40px;
            font-size: 24px;
            color: #4b7aff;
          }
        }
        .addressInfo {
          font-weight: normal;
        }
      }
      .changeCanteen {
        /* color: #FFFFFF; */
        color: #9195a1;
        span {
          display: inline-block;
          width: 12px;
          height: 22px;
          font-size: 24px;
        }
        img {
          width: 12px;
          height: 22px;
        }
      }
    }

    .canteenListSpec {
      margin-top: 24px;
      width: 710px;
      background: #ffffff;
      border-radius: 16px;
      font-size: 28px;
      color: #333;
      padding: 64px;
      img {
        width: 176px;
        height: 176px;
      }
      .text {
        margin-top: 20px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #565961;
        line-height: 36px;
      }
    }

    /* <div class="canteenList">
            <div class="canteenItem">
                <div class="left">
                    <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/swip-img.png" />
                    <div class="tagTissue">
                        <div class="caiName">牛奶</div>

                        <div class="tagList">
                            <div class="tag">这是一个较长的标签文案</div>
                            <div class="tag">高嘌呤</div>
                            <div class="tag">健脾</div>
                        </div>
                    </div>
                </div>

                <div class="orderBtn"></div>

            </div>
        </div> */
    .canteenList {
      margin-top: 24px;
      width: 710px;
      background: #ffffff;
      border-radius: 16px;
      font-size: 28px;
      color: #333;
      padding: 32px;
      .canteenItem {
        position: relative;
        margin-bottom: 24px;
        .left {
          img {
            width: 162px;
            height: 162px;
            border-radius: 12px;
            margin-right: 20px;
          }
          .tagTissue {
            width: 310px;
            text-align: left;
            .tagList {
              height: 92px;
              .tag {
                display: inline-block;
                background: #d4c3c4;
                color: #ed6066;
                border-radius: 4px;
                padding: 4px 12px;
                margin-top: 8px;
                margin-right: 6px;
                font-size: 24px;

                background: #e5f9ef;
                color: #00c863;
              }
              .tagRed {
                display: inline-block;

                border-radius: 4px;
                padding: 4px 12px;
                margin-top: 8px;
                margin-right: 6px;
                font-size: 24px;

                background-color: #ed6066;
                color: #fff;
              }
            }

            .recommend {
              font-size: 22px;
              line-height: 26px;
              color: #999;
              margin-top: 8px;
              img {
                width: 22px;
                height: 22px;
                margin-right: 0;
                display: block;
              }
            }
          }
        }
        .orderBtn {
          position: absolute;
          right: 24px;
          top: 102px;
          width: 120px;
          height: 56px;
          background: #4b7aff;
          border-radius: 44px;
          line-height: 56px;
          color: #fff;
        }
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
