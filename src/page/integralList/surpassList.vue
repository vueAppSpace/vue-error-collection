<template>
  <div class="container">
    <div class="head-bg"></div>

    <div class="integralList">
      <div class="integralList-header flex">
        <div class="line-bg"></div>
        <div class="persons">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/surpass-2.png" />
          <div class="person-num">
            <span>{{ surpassNum }}</span
            >人
          </div>
          <span>累计超越</span>
        </div>

        <div class="persons award">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/point.png" />
          <div class="person-num person-num2">
            <span>{{ integralNum }}</span
            >分
          </div>
          <span>累计奖励</span>
        </div>
      </div>
      <div v-if="surpassplanList && surpassplanList.length">
        <div class="item flex-between" v-for="(item, index) in surpassplanList" :key="index">
          <div class="item-left flex-between">
            <div class="item-left-number">{{ parseInt(index) + 1 }}</div>
            <img
              v-if="item.surpassMemberCodeEntity && item.surpassMemberCodeEntity.userHeadUrl"
              class="avatar"
              :src="item.surpassMemberCodeEntity.userHeadUrl"
            />
            <img
              v-if="!item.surpassMemberCodeEntity.userHeadUrl"
              class="avatar"
              src="https://oss-appupload.icomecloud.com/userInfo/faceUrl/pre/b2dfc5eec645a1ff5af3da7074eba690.png-m_app_avatar.jpg"
            />
            <div class="name">
              <span>{{ item.surpassMemberCodeEntity.userName }}</span>
              <div class="date">{{ translateTime(item.gmtCreate) }}至{{ translateTime(item.planEndTime) }}</div>
            </div>
          </div>

          <div class="item-right flex-between">
            <img
              v-if="item.planStatus == 1"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/victory.png"
            />
            <img
              v-else
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/fail.png"
            />
          </div>
        </div>
      </div>

      <div class="noData" v-else>
        <div v-if="rowNum == 1">
          <div>棒棒哒，您当前排名第1，</div>
          <div>加油保持！</div>
        </div>

        <div v-else>
          <div v-if="isAim">
            <div>正在超越 {{ surpassplanPerson }}，</div>
            <div>加油！！！</div>
          </div>

          <div v-else>
            <div>暂无超越记录，</div>
            <div>快去找个目标挑战一下！！！</div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!isAim && rowNum != 1 && surpassplanList && surpassplanList.length >= 1"
      class="surpass-btn"
      @click="goToRank"
      >继续超越</div
    >

    <div
      v-if="surpassplanList && surpassplanList.length < 1 && rowNum != 1 && !isAim"
      class="surpass-btn"
      @click="goToRank"
      >我要超越</div
    >
  </div>
</template>
<script>
  import { rankingPerson, surpassplanPage, integralNum } from "@/service/ranking";
  // import { companyId } from "@/config/env";
  import { useUserStore, mapState } from "@/pinia";

  export default {
    directives: {},
    components: {},
    data() {
      return {
        rowNum: 0,
        isAim: false,
        id: 356,
        surpassplanList: null,
        surpassNum: "",
        integralNum: "",
        surpassplanPerson: null
      };
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    methods: {
      rankingPersonFn() {
        let data = {
          // companyId,
          // companyPid: 10,
          memberCode: this.userInfo.memberCode
        };
        rankingPerson(data)
          .then(res => {
            if (res.code == 0) {
              if (res.data) {
                //console.log("res.data", res.data);
                this.rowNum = res.data.rownum;
              }
            }
          })
          .catch(ex => {});
      },
      goToRank() {
        this.zgStatistics("健康新奥-健康积分-点击继续超越", { 页面类型: "超越记录" });
        // this.$router.push('/rank');
        this.$router.go(-1);
      },
      translateTime(time) {
        return time.split(" ")[0];
      },
      integralNumFn() {
        let data = {
          memberCode: this.userInfo.memberCode,
          source: 4
        };
        integralNum(data)
          .then(res => {
            if (res.code == 0) {
              this.integralNum = res.data;
            }
          })
          .catch(ex => {});
      },
      surpassplanPageFn() {
        let data = {
          memberCode: this.userInfo.memberCode,
          pageSize: 100,
          pageNum: 1,
          status: 0
        };
        surpassplanPage(data)
          .then(res => {
            if (res.code == 0) {
              if (res.data) {
                this.surpassplanList = res.data;
              }
            }
          })
          .catch(ex => {});
      },

      surpassplanPageUnderwayFn() {
        let data = {
          memberCode: this.userInfo.memberCode,
          pageSize: 100,
          pageNum: 1,
          status: 1
        };
        surpassplanPage(data)
          .then(res => {
            if (res.code == 0) {
              if (res.data) {
                this.surpassplanPerson = res.data[0].surpassMemberCodeEntity.userName;
              }
            }
          })
          .catch(ex => {});
      },
      surpassplanPageStatusFn() {
        let data = {
          memberCode: this.userInfo.memberCode,
          status: 0,
          planStatus: 1,
          pageSize: 100,
          pageNum: 1
        };
        surpassplanPage(data)
          .then(res => {
            if (res.code == 0) {
              if (res.data) {
                this.surpassNum = res.page.total;
                //console.log("this.surpassNum", this.surpassNum);
              }
            }
          })
          .catch(ex => {});
      }
    },
    watch: {},
    mounted() {
      if (this.$route.query.aimd && this.$route.query.aimd != "false") {
        this.isAim = true;
      }
      this.surpassplanPageFn();
      this.surpassplanPageStatusFn();
      this.integralNumFn();
      this.rankingPersonFn();

      this.surpassplanPageUnderwayFn();
      let a = "123";
      //console.log(a);
    }
  };
</script>
<style lang="scss" scoped>
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #f9f9f9;
    .head-bg {
      width: 750px;
      height: 304px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/head-bg2.png")
        no-repeat left center;
      background-size: 100% 100%;
    }
    .integralList {
      width: 690px;
      margin: 0 30px;
      background-color: #fff;
      border-radius: 16px;
      position: relative;
      z-index: 500;
      margin-top: -150px;
      .noData {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #737782;
        line-height: 40px;
        padding: 200px 0 436px;
      }
      .integralList-header {
        padding: 0 110px 50px 112px;
        position: relative;
        .line-bg {
          width: 2px;
          height: 56px;
          background-color: #f1f1f1;
          position: absolute;
          left: 344px;
          top: 130px;
        }
        .persons {
          font-size: 26px;
          line-height: 36px;
          color: rgba(30, 32, 30, 0.37);
          margin-right: 196px;
          img {
            width: 136px;
            height: 136px;
          }
          .person-num {
            margin-top: -30px;
            margin-bottom: 24px;
            color: #333;
            span {
              font-size: 48px;
              font-weight: bold;
              color: #f42e2e;
              line-height: 56px;
              margin-right: 8px;
            }
          }

          .person-num2 {
            span {
              color: #467ffc;
            }
          }
        }
      }
      .item {
        height: 128px;
        font-size: 28px;
        color: #333;
        border-top: 2px solid #f9f9f9;
        padding-left: 30px;
        .avatar {
          width: 80px;
          height: 80px;
          margin: 0 28px;
          border-radius: 50%;
        }
        .name {
          text-align: left;
          line-height: 34px;
          .date {
            font-size: 24px;
            color: #999;
          }
        }
        .item-right {
          img {
            width: 60px;
            height: 84px;
          }
        }
      }
    }

    .surpass-btn {
      width: 606px;
      height: 90px;
      background: linear-gradient(90deg, #fe7315 0%, #e55c00 100%);
      border-radius: 50px;

      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 90px;

      position: fixed;
      left: 72px;
      bottom: 68px;
      z-index: 600;
    }
  }
</style>
