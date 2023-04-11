<!--
 * @Description: 我的
 * @Author: IFLS
 * @Date: 2022-05-12 15:09:29
 * @LastEditTime: 2023-03-28 10:04:38
-->
<script>
  import { defineComponent, reactive, onMounted, toRefs } from "@vue/composition-api";
  import { Toast } from "vant";
  import * as api from "@/service/mine/index";
  import { queryUserTopAchievement } from "@/service/achievement/index";
  import PanelTips from "@/components/PanelTips";
  import PanelList from "@/components/PanelList";
  import Tips from "@/components/Tips";
  import CardList from "@/page/meals";
  import MallCard from "../components/MallCard0";
  // import HealthTab from '../components/HealthTab/index.vue'
  import CeremonyRank from "../components/CeremonyRank";
  import EntranceCard from "../components/EntranceCard";
  // import qrcodeDialog from '@/components/QRCodeDialog'
  import { judgeNeedToJumpToDanao, resetJumpReportData } from "@/utils/lifeEntropyMethod";
  import { useRouter } from "@/hooks/useRouter";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    components: {
      PanelList,
      PanelTips,
      Tips,
      MallCard,
      // HealthTab,
      CeremonyRank,
      EntranceCard,
      CardList
      // qrcodeDialog
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

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        aimd: false, // 是否有超越目标
        aimdName: "", // 超越目标的姓名
        aimdId: "", // 超越目标的id
        aimdStatus: false, // 超越结果: false失败 true成功
        aimdHealthPoints: "", // 超越目标的健康积分
        noticeBar: "暂无挑战者",
        tipsVisible: false, // 超越成功提示
        // QRCodeVisible: false,
        key: 0,
        tipsHtml: "", // 提示内容
        userInfo: {}, // 用户排行榜信息
        rankLoading: true,
        topAchievement: {}
      });

      const queryAchievement = () => {
        queryUserTopAchievement({ points: state.userInfo.totalHealthPoints }).then(({ code, data, message }) => {
          if (code === 0 && data) {
            state.topAchievement = data || {};
          } else {
            //console.log("queryTopAchievement", message);
          }
        });
      };

      // 查询用户排行信息
      const queryMineData = async () => {
        return new Promise((resolve, reject) => {
          api.queryMineRankList(userInfo.value.memberCode).then(({ code, data, message }) => {
            if (code === 0) {
              state.userInfo = data || {};
              resolve();
            } else {
              //console.log("queryMineData", message);
              // Toast(message);
              reject();
            }
          });
        });
      };

      // 查询是否有超越目标
      const queryTarget = () => {
        const req = {
          memberCode: userInfo.value.memberCode,
          pageSize: 1,
          pageNum: 1,
          status: 1
        };
        api.queryExercisePlan(req).then(({ code, data, message }) => {
          if (code === 0) {
            state.aimd = data.length !== 0;
          } else {
            //console.log("queryTarget", message);
            // Toast(message);
          }
          state.rankLoading = false;
        });
      };

      // 查询我要超越的用户
      const queryAimd = () => {
        const req = {
          memberCode: userInfo.value.memberCode,
          pageSize: 1,
          pageNum: 1
        };
        api.queryExercisePlan(req).then(({ code, data, message }) => {
          if (code === 0) {
            if (data.length !== 0) {
              const zgStr = "健康新奥-健康积分-进入超越提示页面";
              const dt = data[0];
              state.aimdName = dt.surpassMemberCodeEntity.userName;
              state.aimdHealthPoints = dt.surpassHealthPointsEntity.healthPoints;
              state.aimdId = dt.id;
              /**
               * status: 计分周期 0已结束 1进行中
               * planStatus: 超越计划状态 0失败 1成功
               * isNew: 是否进行过弹窗 0没有 1有
               */
              // 计分周期结束且没有进行过弹窗
              if (dt.status === 0 && dt.isNew === 0) {
                // 成功弹窗
                if (dt.planStatus === 1) {
                  state.tipsHtml = `亲爱的太棒了，已成功超越<span class="blue">${state.aimdName}</span>，当前排名<span class="red">${state.userInfo.rownum}</span>名，当前积分<span class="blue">${state.userInfo.healthPoints}</span>分！`;
                  state.aimdStatus = true;
                  zgStatistics(zgStr, { 页面类型: "成功" });
                }
                // 失败弹窗
                if (dt.planStatus === 0) {
                  const diff = state.aimdHealthPoints - state.userInfo.healthPoints;
                  state.tipsHtml = `亲爱的很遗憾，您和<span class="blue">${state.aimdName}</span>相差<span class="blue">${diff}</span>分，超越未成功，继续加油`;
                  state.aimdStatus = false;
                  zgStatistics(zgStr, { 页面类型: "失败" });
                }
                // 显示弹窗提示
                state.tipsVisible = true;
              }
            }
            queryTarget();
          } else {
            //console.log("queryExercisePlan", message);
            // Toast(message);
          }
        });
      };

      // 更新超越计划弹窗: 后端要求 超越计划成功提示后 调用改接口更改isNew值
      const updatePlan = () => {
        state.tipsVisible = false;
        state.aimd = false;
        try {
          api.updateExercisePlan({ id: state.aimdId, isNew: 1 });
        } catch (err) {
          Toast(err || "操作失败, 请重试");
        }
        zgStatistics("健康新奥-健康积分-点击继续超越", {
          页面类型: state.aimdStatus ? "超越提示-成功" : "超越提示-失败"
        });
      };

      // 查询想要超越我的用户
      // const queryNoticeBar = () => {
      //     const req = {
      //         surpassMemberCode: userInfo.value.memberCode,
      //         pageSize: 10,
      //         pageNum: 1,
      //         status: 1
      //     }
      //     // 暂无挑战者
      //     api.queryExercisePlan(req).then(({ code, data, message }) => {
      //         if (code === 0) {
      //             if (data.length !== 0) {
      //                 let str = data.reduce((total, currentVal) => {
      //                     total += currentVal.memberCodeEntity.userName + '、'
      //                     return total
      //                 }, '')
      //                 str = str.substr(0, str.length - 1)
      //                 state.noticeBar = str + (data.length > 1 ? '等' : '') + '想要超越你'
      //             }
      //         } else {
      //             //console.log('queryExercisePlan', message)
      //             // Toast(message);
      //         }
      //     })
      // }

      const jumpTo = (url, query) => {
        if (url === "/record") {
          zgStatistics("健康新奥-健康积分-点击超越记录");
        }

        // 用户为第一名时 aimd传true: aimd参数用于控制超越记录页按钮显示
        if (state.userInfo.rownum === 1) {
          query = { aimd: true };
        }

        router.push({
          path: url,
          query: query || {}
        });
      };

      const init = () => {
        //清除生命熵数据
        resetJumpReportData();

        queryMineData()
          .then(() => {
            // 该函数使用了上一个函数的数据
            queryAimd();
            queryAchievement();
          })
          .catch(() => {});
        // queryNoticeBar()
        zgStatistics("健康新奥-健康积分-进入积分卡片页面", { 来源: document.title });
      };

      // const onScroll = data => {}

      onMounted(init);

      return {
        // isIosX,
        ...toRefs(state),
        queryAimd,
        queryMineData,
        updatePlan,
        jumpTo
        // onScroll
      };
    },
    watch: {
      // 此处使用watch组合式api监听route存在触发bug 故改用选项式api
      $route: function (to, from) {
        if (to.path === "/mine") {
          // 页面激活时刷新’我的‘数据
          this.queryMineData()
            .then(() => {
              this.queryAimd();
            })
            .catch(() => {});
        }
      }
    },
    beforeRouteLeave(_, __, next) {
      // 页面回退时销毁二维码弹窗
      if (this.QRCodeVisible) {
        this.QRCodeVisible = false;
        this.key++;
      }
      next();
    }
  });
</script>

<template>
  <div class="containter">
    <!-- <div :class="['page-box', isIosX ? 'padding-ipx' : '']"> -->
    <div class="page-box">
      <div class="bg-box">
        <!-- 用户信息 -->
        <div class="user-box">
          <div class="avator-box">
            <img class="userHead" :src="userInfo.userHead" />
            <img class="avatarImg" :src="topAchievement.avatarImgUrl" />
          </div>

          <div class="user-flex-box">
            <div class="username">
              {{ userInfo.userName }}
              <!-- 聚合永间 -->
              <img class="badge" :src="topAchievement.badgeImgUrl" />
              <!-- <img class="qRCode"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAtZJREFUWEftmM2rTWEUh5+f8pnPkoEBM4nCBPmoa6CbARmQXEPl4w9wI/kYUKLrD7jKFInRJZFSisJEuknJwOfAQOGGiyyt03uO17H3Pvvsfc+55+q+o3Pq3Ws/e613rfe3lujwpQ7nowZoZieBA8DkJqENeAR0S/roz5rZLOAWsBL+vCOn3WGgT9IR3x8DfisAF79zu6SrAXAbcCUnUNK2YUlT6gHdE2XWLkkXA2APcKGMMUkV58UejAFPAA9zvOAyMDXsSwP8CuzIYWsVcLS6rxHgFknXGhk1s0/AjAaAnyXNzGFrMzDwfwKa2XpgNnBdUu0oFPGgmXmV2Ao8lTRY9ZiZFfOgmW0CbgRDhyWdiow2HWIzOw/sBn4ASyU9D4lVGHAv0B+g+iXtLwl4B9gQbHRJulsW0LP0DDAX6JX0piTgcuA4MCjpWOkQZ2VfkTOYZq/wGRwHDB5o1oPvgS+NiiuwAJjQoFD/Al7lsDUNmJdVqN1QGfnVI+lSyMidQOVeLrhMUuXD47v4AeD3YZHlNW2ZpGcBcDHwBJhYxJjrAEmr6wFdw20EJjVp1G+Wx1W4qGw45IoCUfkO3K5qyzIhbfI7im0fO4BBprc7xH7WXoRzOx/oApJDbGajkST7JJ1LuIsTk2Q0ykwaYGKZiSW/y/SfOY719ChLi/QkaYC0U/Jnfec4YB5F3VoPmpkL1j5gDnBQ0uvotsgDOAQsiii9oV8b/r8FPoTf3vktzBILcZLU2k4z2wNUSoFL/xGW/KnezZ0kZtYN3AyWDkk63aQH/+qLzSzuScoDhiLqIfGeZGAE2k7v3vzWyFzVAp42+mj7ZCGNdswC9gL3GoXBdRvgUt1X2k1SfwaXAK49fb2T9DIcI68S66IsrsyG0jyYg+2fLXkB4yQ5K8mHpj70XAPczyozrRpgZmVxGmDiALNVI+ChePxWV2aSAJNHwEVi2o5nOl7y/wYs8HhHhE/ypwAAAABJRU5ErkJggg=="
                                @click="QRCodeVisible = true"
                            /> -->
            </div>
            <div class="integral-box">
              <div class="integral" @click="jumpTo('/integral-bill')">
                <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/corn.png" />
                <div>健康积分余额：{{ userInfo.healthPoints }}</div>
              </div>
              <!-- <div class="exchange-btn">
                            兑换
                        </div> -->
            </div>
            <img
              class="setting-img"
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/setting.png"
              v-track="{
                type: 'click',
                name: '康新奥-我的-点击卡片',
                data: `{&quot;按钮名称&quot;: &quot;设置&quot;, &quot;位置&quot;: &quot;上方按钮&quot;}`
              }"
              @click="jumpTo('/setting')"
            />
          </div>
        </div>

        <!-- 积分商城卡片 -->
        <mall-card :userInfo="userInfo" :topAchievement="topAchievement" />

        <!-- <health-tab /> -->

        <!-- 积分排行榜 -->
        <!-- <div class="box-card rank-box">
                    <div class="rank-title">
                        * 健康积分排行榜 *
                        <div class="rank-title-bg"></div>
                    </div>

                    <van-skeleton round :row="3" style="padding: 0.2rem" :loading="rankLoading">
                        <div class="rank-content" @click="jumpTo('/rank')">
                            <div class="rank-content-box">
                                <div class="num red">{{ userInfo.rownum }}</div>
                                <div class="rank-content-title">名次</div>
                            </div>

                            <hr />

                            <div class="rank-content-box">
                                <div class="num yellow">{{ userInfo.healthPoints }}</div>
                                <div class="rank-content-title">健康积分</div>
                            </div>

                            <hr v-if="aimd" />

                            <div class="rank-content-box" v-if="aimd">
                                <div class="num blue">
                                    <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/aim.png" />
                                    {{ aimdHealthPoints }}
                                </div>
                                <div class="rank-content-title grey">
                                    {{ aimdName }}
                                </div>
                            </div>
                        </div>
                    </van-skeleton>

                    <van-notice-bar background="#f3f7ff" color="#467FFC" :scrollable="noticeBar.length > 5" :text="noticeBar">
                        <template #left-icon>
                            <img
                                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/plane.png"
                                class="notice-bar-icon"
                            />
                        </template>
                    </van-notice-bar>

                    <div class="record" @click="jumpTo('/record', { aimd })">超越记录</div>
                </div> -->

        <!-- 司庆排行榜 -->
        <!-- <ceremony-rank /> -->

        <!-- 健康计划 -->
        <!-- <health-plan :only-video="false" /> -->
        <!-- <card-list class="card-list" /> -->

        <!-- 入口卡片 -->
        <!-- <entrance-card /> -->

        <!-- 体检报告 -->
        <!-- <medical-report /> -->

        <!-- 用户自传体检报告 -->
        <!-- <user-report ref="userReport" /> -->

        <panel-tips>这些都会有！</panel-tips>

        <panel-list>
          <ul>
            <li>
              <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/picture.png" />
              健康画像
            </li>
            <li>
              <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/file.png" />
              个人健康档案
            </li>
            <li>
              <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/icon/health.png" />
              健康状态预测
            </li>
          </ul>
        </panel-list>

        <!-- <h6 class="title">常用功能</h6>

                <icon-box /> -->

        <!-- 超越提示 -->
        <tips :value.sync="tipsVisible" :exp="0" @onClose="updatePlan">
          <div class="tips-pd">
            <div v-html="tipsHtml"></div>
          </div>

          <button class="common-btn" slot="button" v-debounce="3000" @click="updatePlan">继续超越</button>
        </tips>
        <!-- 二维码提示框 -->
        <!-- <qrcode-dialog :value.sync="QRCodeVisible" :key="key" /> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "../../../assets/less/btn.css";
  @import "./index.scss";
</style>
