<template>
  <div class="container" :class="{ hidden: dialogVisible }">
    <!-- <div class="head-bg"></div> -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :head-height="86">
      <div slot="pulling">
        <dotsLoader></dotsLoader>
        <div>下拉刷新</div>
      </div>

      <!-- 释放提示 -->
      <div slot="loosing">
        <dotsLoader></dotsLoader>
        <div>释放刷新</div>
      </div>

      <!-- 加载提示 -->
      <div slot="loading">
        <dotsLoader></dotsLoader>
        <div style="line-height: 2">正在加载</div>
      </div>

      <van-list v-if="rankingList && rankingList.length" v-model="loading" :finished="finished" @load="onLoad">
        <div class="head-bg">
          <div class="record" @click="jumpTo('/record', { isAim })">超越记录</div>
          <van-notice-bar
            background="#f3f7ff"
            color="#fff"
            :scrollable="noticeBar.length > 5"
            :class="{ pl170: noticeBar.length <= 5 }"
            :text="noticeBar"
          />
        </div>
        <div class="integralList" style="min-height: 90vh">
          <div class="item item-title flex-between">
            <div class="item-left flex-between">
              <div class="item-left-number-title">排名</div>
              <div class="avatar-title">头像</div>
              <div class="name-title">姓名</div>
            </div>

            <div class="item-right flex-between">
              <div class="item-right-number-title">健康积分</div>
            </div>
          </div>
          <div
            class="item flex-between"
            :class="{ itemActive: item.memberCode == memberCode }"
            v-for="(item, index) in rankingList"
            :key="index"
          >
            <div class="item-left flex-between">
              <div class="item-left-number">{{ item.rownum }}</div>
              <img v-if="item.userHead" class="avatar" :src="item.userHead" />
              <img v-if="!item.userHead" class="avatar" :src="listData[0].avatar" />
              <div class="name">{{ item.userName }}</div>
            </div>

            <div class="item-right flex-between">
              <img
                v-if="item.isSurpass"
                class="aim-icon"
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/aim.png"
              />
              <div class="item-right-number" :class="{ itemRightNumberActive: item.rownum > rowNum }">
                {{ item.totalHealthPoints }}
              </div>
              <!-- {{ item.rownum }} {{ rowNum }} -->

              <div class="surpassBox" v-if="item.rownum < rowNum && !isAim" @click="surpassHandle(item)">
                <img
                  src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/surpass.png"
                />
              </div>
              <div v-if="item.rownum < rowNum && isAim" class="placeholderBox"></div>
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
    </van-pull-refresh>

    <div class="zask" v-if="dialogVisible || guideVisible"></div>

    <div class="surpass-wrapper" v-if="dialogVisible">
      <div class="surpass">
        <img
          class="close-btn"
          @click="closeHandle"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/close-x.png"
        />
        <div class="surpass-header">
          <div class="title">棒棒哒，继续加油</div>
          <div class="surpass-person">
            超越<span>{{ seletedPerson.userName }}</span
            >吧!
          </div>
        </div>

        <div class="surpass-person-info">
          <div class="person-ranking">
            {{ seletedPerson.userName }}当前排名 <span>{{ seletedPerson.rownum }}</span> 名
          </div>

          <div class="surpass-time">
            预计需要 <span>{{ predictDay }}</span> 天即可超越他
          </div>
        </div>

        <div class="surpass-way">
          <div class="title">超越方法</div>

          <div class="surpass-content">
            <div>
              1、每日进入我的健康,健康积分<span style="color: #34c85a">+{{ taskPointsMap[TaskTypeMap.LOGIN] }}</span>
            </div>
            <div>
              2、完成一次工间操健康积分<span style="color: #34c85a">+{{ taskPointsMap[TaskTypeMap.EW] }}</span
              >,每日可以完成{{ taskTimesMap[TaskTypeMap.EW] }}次
            </div>
            <div>
              3、完成工间操后动动小手点击健康传递其他小伙伴健康积分<span style="color: #34c85a"
                >+{{ taskPointsMap[TaskTypeMap.HD] }}</span
              >, 每日可以完成{{ taskTimesMap[TaskTypeMap.HD] }}次
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-btn-box flex-between">
        <div @click="closeDialog">取消</div>
        <div class="yellow2" @click="confirmPerson">确定</div>
      </div>
    </div>
    <tips :value.sync="guideVisible" :duration="0" :exp="0" title="超越奖励说明">
      <div class="tipBox tipBox2">
        <div class="tipWrapper">
          <!-- <div>超越奖励说明</div> -->
          <div class="surpassInfo">
            <div class="title">超越者</div>
            <div>1、 每七天一次超越的机会</div>
            <div>2、 超越目标任您选择</div>
            <div>3、 七天时间坚持超越</div>
            <div>4、 超越成功获得{{ taskPointsMap[TaskTypeMap.CY] }}超越积分</div>
            <div class="title-2">被超越者</div>
            <div>超越失败时被超越目标获得{{ taskPointsMap[TaskTypeMap.CYSB] }}健康积分</div>
          </div>
          <div class="hortative">
            <div>时间只有7天，目标也在行动～</div>
            <div>量力而行哟! 加油! ! !</div>
          </div>
          <!-- <span class="arrow"></span> -->
          <!-- <img class="star_4" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/four_stars.png" /> -->
          <!-- <img class="star_5" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/four_stars.png" /> -->
          <!-- <img class="star_6" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/four_stars.png" /> -->
          <!-- <div class="confirm_btn" @click="closeGuide">我知道了</div> -->
        </div>
      </div>
    </tips>
    <!-- <div class="tipBox tipBox2" v-if="guideVisible">
          <div class="tipWrapper">
            <div>超越奖励说明</div>
            <div class="surpassInfo">
              <div class="title">超越者</div>
              <div>1、 每七天一次超越的机会</div>
              <div>2、 超越目标任您选择</div>
              <div>3、 七天时间坚持超越</div>
              <div>4、 超越成功获得7超越积分</div>
              <div class="title-2">被超越者</div>
              <div>超越失败时被超越目标获得5健康积分</div>
            </div>
            <div class="hortative">
              <div>时间只有7天，目标也在行动～ </div>
              <div>量力而行哟! 加油! ! !</div>
            </div>
            <span class="arrow"></span>
            <img class="star_4" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/four_stars.png" />
            <img class="star_5" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/four_stars.png" />
            <img class="star_6" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/four_stars.png" />
            <div class="confirm_btn" @click="closeGuide">我知道了</div>
          </div>
        </div> -->
    <!-- <img v-if="guideVisible" class="elephant-5" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/elephant-4.png" /> -->
  </div>
</template>
<script>
  import { rankingPerson, rankingList, surpassplanInsert, queryPlan, findLeaderboardByCount } from "@/service/ranking";
  import { queryExercisePlan } from "@/service/mine";
  import { querydialyTask } from "@/service/integralMall";
  import { TaskTypeMap } from "@/constants/commonConst";

  import dotsLoader from "../../components/dotsLoader";
  import Tips from "@/components/Tips";

  import { Toast } from "vant";
  // import { companyId } from "@/config/env";
  import { useUserStore, mapState } from "@/pinia";

  const zgStr = "健康新奥-健康积分-点击超越按钮";
  export default {
    directives: {},
    components: {
      dotsLoader,
      Tips
    },
    data() {
      return {
        loading: false,
        finished: false,
        refreshing: false,
        guideVisible: false,
        memberCode: "",
        surpassMemberCode: "",
        seletedPerson: null,
        listData: [
          {
            rank: 345,
            avatar:
              "https://oss-appupload.icomecloud.com/userInfo/faceUrl/pre/b2dfc5eec645a1ff5af3da7074eba690.png-m_app_avatar.jpg",
            name: "张三",
            score: 268,
            id: 268,
            isGoUp: true
          }
        ],
        dialogVisible: false,
        rowNum: 0,
        rankingList: [],
        predictDay: 0,
        ownerHealthPoint: 0,
        isAim: false,
        noticeBar: "暂无挑战者",

        //积分规则
        taskPointsMap: {},
        taskTimesMap: {},
        TaskTypeMap,
        totalTaskPoints: 1
      };
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    methods: {
      onRefresh() {
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true;
        this.onLoad();
      },
      onLoad() {
        if (this.refreshing) {
          // this.refreshAticlelist(this.categorylist[this.active].nodeId, 1);
          // //console.log('this.rankingList', this.rankingList[0].rownum);
          let rowNum = this.rankingList[0].rownum - 5;
          this.refreshRankingListFn(rowNum);
        } else {
          let rowNum = this.rankingList[this.rankingList.length - 1].rownum + 6;
          // //console.log('rowNum', rowNum);
          this.rankingListFn(rowNum);
        }
      },

      // 查询每日任务列表
      querydialyTaskFn() {
        querydialyTask()
          .then(({ code, data, message }) => {
            if (code === 0 && data && data.list && data.list.length) {
              data.list.forEach(item => {
                this.taskPointsMap[item.eventType] = item.taskPoints;
                this.taskTimesMap[item.eventType] = item.taskTimes;
              });

              if (!this.taskPointsMap[TaskTypeMap.CY] || this.taskTimesMap[TaskTypeMap.CY]) {
                this.taskPointsMap[TaskTypeMap.CY] = 7;
                this.taskTimesMap[TaskTypeMap.CY] = 1;
              }
              if (!this.taskPointsMap[TaskTypeMap.CYSB] || this.taskTimesMap[TaskTypeMap.CYSB]) {
                this.taskPointsMap[TaskTypeMap.CYSB] = 5;
                this.taskTimesMap[TaskTypeMap.CYSB] = 1;
              }

              this.totalTaskPoints = data.totalTaskPoints;
            } else {
              //console.log("querydialyTask", message);
            }
          })
          .catch(err => {
            //console.log("querydialyTask", err);
          });
      },

      queryPlanFn() {
        // queryPlan
        let data = {
          memberCode: this.userInfo.memberCode,
          status: 1,
          pageSize: 10,
          pageNum: 1
        };
        queryPlan(data)
          .then(res => {
            if (res.code == 0) {
              if (res.data && res.data.length) {
                //console.log("res.data", res.data);
                this.isAim = true;
              }
            }
          })
          .catch(ex => {});
      },
      findLeaderboardByCountFn() {
        findLeaderboardByCount()
          .then(res => {
            if (res.code == 0) {
              if (res.data) {
                this.leaderboardByCount = res.data.countSize;
                this.rankingPersonFn();
              }
            }
          })
          .catch(ex => {});
      },
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
                this.ownerHealthPoint = res.data.totalHealthPoints;
                this.rowNum = res.data.rownum;
                //console.log("this.rowNum", this.rowNum);
                let num = this.rowNum;
                if (this.leaderboardByCount > 10) {
                  if (num <= 5) {
                    num = 6;
                  } else {
                    if (this.leaderboardByCount - num < 5) {
                      num = this.leaderboardByCount - 4;
                    } else {
                      //console.log("什么也不做");
                    }
                  }
                } else {
                  num = 6;
                }
                this.rankingListFn(num);
              }
            }
          })
          .catch(ex => {});
      },
      refreshRankingListFn(rowNum) {
        let startRownum = rowNum - 5;
        let endRownum = rowNum + 4;
        let data = {
          startRownum: startRownum,
          endRownum: endRownum
        };
        rankingList(data)
          .then(res => {
            if (res.code == 0) {
              setTimeout(() => {
                //console.log("close");
                this.refreshing = false;
                if (res.data && res.data.length) {
                  this.loading = false;
                  this.aimFn(res.data);
                  this.rankingList = res.data.concat(this.rankingList);
                } else {
                  this.finished = true;
                  this.refreshing = false;
                  this.loading = true;
                }
              }, 200);
            }
          })
          .catch(ex => {});
      },
      rankingListFn(rowNum) {
        let startRownum = rowNum - 5;
        let endRownum = rowNum + 4;
        let data = {
          startRownum: startRownum,
          endRownum: endRownum
        };
        rankingList(data)
          .then(res => {
            this.loading = false;
            if (res.code == 0) {
              if (res.data && res.data.length) {
                this.rankingList = this.rankingList.concat(res.data);
                this.aimFn(this.rankingList);
              } else {
                this.finished = true;
              }
            } else {
              this.finished = true;
              this.refreshing = false;
              this.loading = true;
            }
          })
          .catch(ex => {
            this.refreshing = false;
            this.loading = true;
          });
      },

      aimFn(data) {
        for (let item of data) {
          if (item.isSurpass) {
            this.isAim = true;
            return;
          }
        }
      },
      closeGuide() {
        this.guideVisible = false;
      },
      confirmPerson() {
        this.surpassplanInsertFn();
        this.zgStatistics(zgStr, { 按钮名称: "确定" });
      },
      surpassplanInsertFn() {
        let data = {
          memberCode: this.memberCode,
          surpassMemberCode: this.seletedPerson.memberCode
        };
        surpassplanInsert(data)
          .then(res => {
            if (res.code == 0) {
              // this.surpassMemberCode = this.seletedPerson.memberCode;
              // localStorage.setItem('surpassMemberCode', this.surpassMemberCode);
              this.dialogVisible = false;
              // this.rankingListFn(this.rowNum);
              for (let item of this.rankingList) {
                if (item.memberCode == this.seletedPerson.memberCode) {
                  item.isSurpass = true;
                }
              }
              this.isAim = true;
              // this.aimFn(this.rankingList);
            } else {
              //console.log("surpassplanInsert", res.message);
              // Toast(res.message);
              this.dialogVisible = false;
              this.isAim = true;
            }
          })
          .catch(ex => {});
      },
      closeDialog() {
        this.dialogVisible = false;
        this.zgStatistics(zgStr, { 按钮名称: "取消" });
      },
      surpassHandle(item) {
        this.dialogVisible = true;
        this.seletedPerson = item;
        this.predictDay = Math.ceil(
          (this.seletedPerson.totalHealthPoints - this.ownerHealthPoint) / this.totalTaskPoints
        );
        this.zgStatistics("健康新奥-健康积分-点击超越", { 超越目标: item.userName });
      },
      closeHandle() {
        this.dialogVisible = false;
      },
      jumpTo(url, query) {
        this.zgStatistics("健康新奥-健康积分-点击超越记录");
        // 用户为第一名时 aimd传true: aimd参数用于控制超越记录页按钮显示
        if (this.rownum === 1) {
          query = { aimd: true };
        }

        this.$router.push({
          path: url,
          query: query || {}
        });
      },
      // 查询想要超越我的用户
      queryNoticeBar() {
        const req = {
          surpassMemberCode: this.userInfo.memberCode,
          pageSize: 10,
          pageNum: 1,
          status: 1
        };
        queryExercisePlan(req).then(({ code, data, message }) => {
          if (code === 0) {
            if (data.length !== 0) {
              let str = data.reduce((total, currentVal) => {
                total += currentVal.memberCodeEntity.userName + "、";
                return total;
              }, "");
              str = str.substr(0, str.length - 1);
              this.noticeBar = str + (data.length > 1 ? "等" : "") + "想要超越你";
            }
          } else {
            //console.log("queryExercisePlan", message);
            // Toast(message);
          }
        });
      }
    },
    watch: {},
    mounted() {
      this.memberCode = this.userInfo.memberCode;
      this.findLeaderboardByCountFn();
      this.queryPlanFn();
      this.queryNoticeBar();
      //查询每日任务
      this.querydialyTaskFn();

      if (!localStorage.getItem("isFirstGoIntegraList")) {
        this.guideVisible = true;
      }
      localStorage.setItem("isFirstGoIntegraList", true);
      if (localStorage.getItem("surpassMemberCode")) {
        this.surpassMemberCode = localStorage.getItem("surpassMemberCode");
      }
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

  .zask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.7);
  }

  .elephant-4 {
    width: 358px;
    height: 314px;
    position: absolute;
    left: 26px;
    top: 84px;
    z-index: 51;
  }

  .elephant-5 {
    width: 358px;
    height: 314px;
    position: absolute;
    left: 36px;
    top: 876px;
    z-index: 51;
  }

  .surpass-wrapper {
    position: absolute;
    top: 40%;
    left: 50%;
    margin-top: -341px;
    margin-left: -335px;
    z-index: 52;
    .surpass {
      width: 670px;
      height: 682px;
      margin: 0 auto;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/cheer-bg.png")
        no-repeat left center;
      background-size: 100% 100%;
      padding-top: 44px;
      text-align: center;
      position: relative;
      z-index: 60;
      .close-btn {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .surpass-header {
        font-size: 36px;
        line-height: 36px;
        color: #fff;
        .surpass-person {
          margin: 34px 0 26px;
          span {
            color: #fdc72f;
          }
        }
      }
      .surpass-person-info {
        font-size: 26px;
        color: #fff;
        line-height: 36px;
        padding-left: 64px;
        text-align: left;
        .person-ranking {
          span {
            color: #f42e2e;
            font-size: 48px;
            line-height: 66px;
          }
        }
        .surpass-time {
          margin-bottom: 4px;
          span {
            color: #fdc72f;
            font-size: 48px;
            line-height: 66px;
          }
        }
      }

      .surpass-way {
        font-size: 24px;
        color: #333;
        background-color: #fff;
        border-radius: 20px;
        padding: 30px 24px;
        text-align: left;
        line-height: 48px;
        width: 600px;
        margin: 0 auto;
        box-shadow: 0px 4px 26px 0px rgba(124, 159, 255, 0.3);
        .surpass-way-tips,
        .title {
          font-size: 26px;
          font-weight: bold;
        }
      }
    }
  }

  .bottom-btn-box {
    margin-top: 28px;
    height: 90px;
    padding: 0 20px;
    color: #333;
    font-size: 32px;
    line-height: 90px;
    div {
      width: 268px;
      height: 90px;
      background: linear-gradient(90deg, #ffffff 0%, #e6e6e6 100%);
      border-radius: 50px;
    }
    .yellow2 {
      background: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
      color: #fff;
    }
  }

  .tipBox {
    // position: absolute;
    // top: 126px;
    // left: 130px;
    // z-index: 105;
    .tipWrapper {
      padding: 0 48px 20px;
      // position: relative;
      // padding: 30px 40px 30px 40px;
      // width: 560px;

      font-size: 28px;
      color: #1e201e;
      line-height: 28px;
      text-align: center;
      border-radius: 16px;
      background-color: #fff;
      .middle {
        margin: 20px 0;
      }
      .arrow {
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-top: 18px solid #fff;
        position: absolute;
        bottom: -18px;
        left: 90px;
        z-index: 110;
      }
      .elep {
        position: absolute;
        width: 428px;
        height: 372px;
        left: -90px;
        bottom: -420px;
      }
      .star_1 {
        position: absolute;
        right: 106px;
        top: 16px;
        width: 26px;
        height: 26px;
      }
      .star_2 {
        position: absolute;
        right: 72px;
        top: 24px;
        width: 32px;
        height: 32px;
      }
      .star_3 {
        position: absolute;
        left: 86px;
        top: 31px;
        width: 23px;
        height: 23px;
      }
    }
  }

  // .elephant-4{

  // }
  .tipBox2 {
    // left: 95px;
    // left: 110px;
    // top: 300px;

    .tipWrapper {
      // padding-top: 40px;
      font-size: 32px;
      font-weight: 550;

      .confirm_btn {
        width: 168px;
        margin: 0 auto;
        margin-top: 20px;
        height: 60px;
        background: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
        border-radius: 30px;
        font-size: 26px;
        line-height: 60px;
        color: #fff;
      }

      .surpassInfo {
        text-align: left;
        // margin-top: 34px;
        font-weight: normal;
        margin-bottom: 32px;
        div {
          font-size: 24px;
          line-height: 44px;
        }
        .title {
          color: #1e201e;
          font-size: 26px;
          font-weight: 550;
          line-height: 44px;
          margin-bottom: 22px;
        }
        .title-2 {
          font-size: 26px;
          font-weight: 550;
          line-height: 26px;
          margin: 32px 0 22px;
        }
      }

      .hortative {
        width: 574px;
        height: 112px;
        background: #fff7ec;
        padding: 16px 0;
        text-align: center;
        color: #ff9500;
        border-radius: 16px;

        margin-top: 12px;
        font-size: 26px;
        // color: #467FFC;
        font-weight: 500;
        line-height: 36px;
        // text-align: left;
      }

      .middle {
        text-align: left;
        font-size: 24px;
        font-weight: normal;
        line-height: 36px;
      }
      .know_btn {
        width: 168px;
        height: 60px;
        background: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
        border-radius: 30px;
        color: #fff;
        margin: 0 auto;
        line-height: 60px;
        font-size: 26px;
      }
      .arrow {
        left: 40px;
      }

      .star_4 {
        position: absolute;
        right: 112px;
        top: 32px;
        width: 26px;
        height: 26px;
      }
      .star_5 {
        position: absolute;
        left: 98px;
        top: 40px;
        width: 23px;
        height: 23px;
      }
      .star_6 {
        position: absolute;
        left: 108px;
        top: 12px;
        width: 32px;
        height: 32px;
      }
    }
  }

  .container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #f9f9f9;
    .head-bg {
      position: relative;
      width: 750px;
      height: 364px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/head-bg.png")
        no-repeat left center;
      background-size: 100% 100%;
      /* position: fixed; */
      // top: 0;
      // z-index: 100;
      .record {
        position: absolute;
        top: 20px;
        right: 36px;
        font-size: 26px;
        font-weight: 500;
        text-decoration: underline;
        color: #fff;
      }
      .record:active {
        color: #999;
        transition: 0.25s;
      }
      .van-notice-bar {
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%);
        width: 554px;
        height: 52px;
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.38) 55%,
          rgba(0, 0, 0, 0) 100%
        ) !important;
        .notice-bar-icon {
          width: 48px;
          height: 36px;
          margin-right: 16px;
        }
        ::v-deep.van-notice-bar__content {
          padding-left: 60px;
        }
        ::v-deep.van-notice-bar__content::before {
          display: block;
          position: absolute;
          left: 0;
          top: 6px;
          content: "";
          width: 44px;
          height: 34px;
          background-image: url(https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/plan-new.png);
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      .pl170 {
        padding-left: 170px;
      }
    }
    .integralList {
      position: relative;
      width: 690px;
      margin: 30px;
      padding-left: 30px;
      background-color: #fff;
      border-radius: 16px;
      margin-top: -90px;
      /* margin-top: 304px; */

      /* margin-top: 100px;
          position: relative;
          z-index: 1000; */
      .item {
        height: 105px;
        font-size: 28px;
        color: #333;
        border-bottom: 2px solid #f9f9f9;
        .avatar {
          width: 64px;
          height: 64px;
          margin: 0 36px;
          border-radius: 50%;
        }
        .item-left-number-title {
          font-size: 26px;
          color: #9195a1;
        }
        .avatar-title {
          margin: 0 42px 0 20px;
          font-size: 26px;
          color: #9195a1;
        }
        .name-title {
          font-size: 26px;
          color: #9195a1;
        }
        .item-right-number-title {
          font-size: 26px;
          color: #9195a1;
          margin-right: 95px;
        }
        .item-right {
          .item-right-number {
            font-size: 36px;
            color: #467ffc;
          }
          .itemRightNumberActive {
            margin-right: 144px;
          }
          /* .surpassBox{
                width: 144px;
                text-align: center;
                  img{
                    width: 96px;
                    height: 72px;
                }
              }
              .aim-icon{
                width: 72px;
                height: 72px;
                margin-right: -32px;
              } */

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
  .hidden {
    overflow: hidden;
  }
</style>
