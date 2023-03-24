<template>
  <div class="container">
    <van-list v-if="rankingList && rankingList.length" v-model="loading" :finished="finished" @load="onLoad">
      <!-- @click="toActivityDetail" -->
      <div class="head-bg">
        <!-- <div>8月5日前300名现场抽奖</div>
                <div class="activityDetail" @click="toActivityDetail">活动详情>></div> -->
      </div>
      <div class="integralList" style="min-height: 90vh">
        <div class="mineRank flex-between">
          <div class="left flex">
            <div class="title">我的成绩</div>
            <img v-if="!myObj.userHeadUrl" :src="listData[0].avatar" />
            <img v-else :src="myObj.userHeadUrl" />
            <div class="name">{{ myObj.userName }}</div>
          </div>

          <div class="right flex">
            <div class="paiming">第{{ myObj.rank }}名</div>
            <div class="healthPoints">{{ myObj.healthPoints }}分</div>
          </div>
        </div>

        <div class="item item-title flex-between">
          <div class="item-left flex-between">
            <div class="item-left-number-title">排名</div>
            <div class="name-title">姓名</div>
          </div>

          <div class="item-right flex-between">
            <div class="item-right-number-title">健康积分</div>
          </div>
        </div>
        <div class="item flex-between" v-for="(item, index) in rankingList" :key="index">
          <div class="item-left flex-between">
            <div class="item-left-number">
              <span v-if="item.rank > 3">{{ item.rank }}</span>
              <img
                v-if="item.rank == 1"
                class="rankImg"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/first.png"
              />
              <img
                v-if="item.rank == 2"
                class="rankImg"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/second.png"
              />
              <img
                v-if="item.rank == 3"
                class="rankImg"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/third.png"
              />
            </div>

            <!-- <div class="item-left-number">99999</div> -->

            <div class="name flex">
              <img v-if="item.userHeadUrl" class="avatar" :src="item.userHeadUrl" />
              <img v-if="!item.userHeadUrl" class="avatar" :src="listData[0].avatar" />
              <div>{{ item.userName }}</div>
            </div>
          </div>

          <div class="item-right">
            <div class="item-right-number">{{ item.healthPoints }}</div>
          </div>
        </div>
      </div>

      <div slot="loading">
        <dotsLoader></dotsLoader>
        <div>正在加载</div>
      </div>
      <div slot="finished">
        <div v-if="rankingList.length > 0" style="height: 50px; line-height: 40px">我们是有底线的</div>
      </div>
    </van-list>
  </div>
</template>
<script>
  import { mineInfo, myRankList } from "@/service/ranking";
  import dotsLoader from "../../components/dotsLoader";

  // import { Toast } from 'vant'

  const zgStr = "健康新奥-健康积分-点击超越按钮";
  export default {
    directives: {},
    components: {
      dotsLoader
    },
    data() {
      return {
        loading: false,
        finished: false,
        memberCode: "",
        listData: [
          {
            avatar:
              "https://oss-appupload.icomecloud.com/userInfo/faceUrl/pre/b2dfc5eec645a1ff5af3da7074eba690.png-m_app_avatar.jpg"
          }
        ],

        rankingList: [],
        myObj: null,
        pageIndex: 1
      };
    },
    methods: {
      toActivityDetail() {
        this.$router.push("/activityDetail2");
      },
      onLoad() {
        this.pageIndex += 1;
        this.myRankListFn();
      },

      mineInfoFn() {
        let data = {
          memberCode: this.memberCode
        };
        mineInfo(data)
          .then(res => {
            if (res.code == 0) {
              this.myObj = res.data;
            } else {
              console.log(res.message);
            }
          })
          .catch(ex => {});
      },

      myRankListFn() {
        let data = {
          pageIndex: this.pageIndex,
          pageSize: 10
        };
        myRankList(data)
          .then(res => {
            this.loading = false;
            if (res.data.length > 0) {
              this.rankingList = this.rankingList.concat(res.data);
            } else {
              this.finished = true;
              this.refreshing = false;
              this.loading = true;
            }
          })
          .catch(ex => {});
      }
    },
    watch: {},
    mounted() {
      this.memberCode = localStorage.getItem("memberCode");

      this.mineInfoFn();

      this.myRankListFn();
      //   this.findLeaderboardByCountFn();

      //   this.queryPlanFn();

      //   if (localStorage.getItem('isFirstGoIntegraList')) {
      //     this.guideVisible = false;
      //   }
      //   localStorage.setItem('isFirstGoIntegraList', true);
      //   if ( localStorage.getItem('surpassMemberCode') ) {
      //     this.surpassMemberCode =localStorage.getItem('surpassMemberCode');
      //   }
    }
  };
</script>
<style lang="scss" scoped>
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f9f9f9;
  }

  .container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #f9f9f9;
    .head-bg {
      width: 750px;
      height: 304px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/ranklist_top.jpg")
        no-repeat left center;
      background-size: 100% 100%;
      /* position: fixed; */
      top: 0;
      z-index: 100;
      font-size: 36px;
      color: #fff;
      line-height: 50px;
      text-align: left;
      padding: 42px 0 0 42px;
      .activityDetail {
        margin-top: 16px;
        width: 184px;
        text-align: center;
        height: 56px;
        background: #ffffff;
        border-radius: 28px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4b7aff;
        line-height: 56px;
      }
    }
    .integralList {
      width: 750px;
      margin: 30 0px;
      padding: 32px;
      padding-bottom: 0;
      background-color: #fff;
      border-radius: 16px;
      margin-top: -60px;
      .mineRank {
        width: 686px;
        height: 120px;
        background: #ffffff;
        box-shadow: 0px 4px 16px 0px rgba(166, 173, 192, 0.2);
        border-radius: 16px;
        font-size: 28px;
        padding: 0 24px;
        margin-bottom: 36px;
        .left {
          height: 120px;
          align-items: center;
          img {
            width: 64px;
            height: 64px;
            margin: 0 20px 0 32px;
            border-radius: 50%;
          }
          .title {
            width: 58px;
            color: rgba(75, 122, 255, 1);
          }
          .name {
            height: 120px;
            line-height: 120px;
            color: rgba(61, 62, 66, 1);
          }
        }
        .right {
          .paiming {
            margin-right: 80px;
            color: rgba(75, 122, 255, 1);
          }
          .healthPoints {
            color: rgba(245, 130, 65, 1);
          }
        }
      }

      .item {
        height: 105px;
        font-size: 28px;
        color: #333;
        /* border-bottom: 2px solid #f9f9f9; */
        .avatar {
          width: 64px;
          height: 64px;
          margin-right: 18px;
          border-radius: 50%;
        }
        .item-left-number-title {
          font-size: 26px;
          color: #9195a1;
          width: 100px;
          flex-shrink: 0;
          text-align: center;
          margin-right: 30px;
        }
        .item-left-number {
          width: 100px;
          flex-shrink: 0;
          text-align: center;
          margin-right: 30px;
          position: relative;
          .rankImg {
            width: 60px;
            height: 62px;
            /* position: absolute;
                  left: 0;
                  top: 0; */
          }
        }
        .avatar-title {
          margin: 0 42px 0 20px;
          font-size: 26px;
          color: #9195a1;
        }
        .name-title {
          font-size: 26px;
          color: #9195a1;
          /* margin-left: 80px; */
        }
        .name {
          /* margin-left: 80px; */
          line-height: 120px;
          height: 120px;
          align-items: center;
          justify-content: flex-start;
        }
        .item-right-number-title {
          font-size: 26px;
          color: #9195a1;
          margin-right: 95px;
        }
        .item-right {
          .item-right-number {
            font-size: 36px;
            color: rgba(245, 130, 65, 1);
            text-align: left;
            margin-right: 124px;
          }
          .itemRightNumberActive {
            margin-right: 144px;
          }

          img {
            width: 144px;
            height: 130px;
          }
          .aim-icon {
            width: 124px;
            height: 124px;
            margin-right: -32px;
          }
          .placeholderBox {
            width: 144px;
            height: 130px;
            background-color: #fff;
          }
        }
      }

      .item-title {
        height: 70px;
      }
      .itemActive {
        height: 105px;
        font-size: 28px;
        color: #333;
        font-weight: bold;
        border-bottom: 2px solid #f9f9f9;
        .avatar {
          width: 64px;
          height: 64px;
        }
        .item-right {
          .item-right-number {
            font-size: 36px;
            color: #dd8334;
            margin-right: 144px;
          }
          img {
            width: 0px;
            height: 0px;
          }
        }
      }

      .item:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
    }
  }
</style>
