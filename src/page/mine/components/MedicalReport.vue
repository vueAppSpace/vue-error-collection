<!--
 * @Description: 体检报告
 * @Author: IFLS
 * @Date: 2022-05-26 14:24:19
 * @LastEditTime: 2023-03-31 14:06:17
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { queryLastHealthInfo } from "@/service/mine/index";
  import Tips from "@/components/Tips";
  import { formatTime } from "@/utils/commonFun";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    components: { Tips },
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const state = reactive({
        memberCode: localStorage.getItem("memberCode"),
        tips: {
          visible: false,
          title: "",
          titleNum: 0,
          subTitle: "",
          scram: "", // 异常解读
          unscramble: "", // 指标意义
          btn: ""
        },
        reportInfo: {}, // 体检报告基本信息
        inportantIndicator: [], // 重点指标
        diseaseRisk: [], // 疾病风险
        reportEmpty: false,
        reportLoading: true
      });

      const queryReport = () => {
        queryLastHealthInfo(state.memberCode).then(({ code, data, message }) => {
          state.reportLoading = false;
          if (code === 0) {
            if (data) {
              state.reportInfo = data.healthEventsInfo; // 报告基本信息
              state.inportantIndicator = data.phrUnscrambleDTO.details; // 重点指标
              state.diseaseRisk = data.phrUnscrambleDTO.symptoms; // 疾病风险
            } else {
              state.reportEmpty = true; // 无体检报告情况
            }
          } else {
            state.reportEmpty = true;
            console.log("queryLastHealthInfo", message);
            // Toast(message)
          }
        });
      };

      const showTips = item => {
        state.tips = {
          visible: true,
          title: item.quota_unscramble_item_name,
          titleNum: item.quotaOriginValue,
          subTitle: item.quota_unscramble_antistop,
          scram: item.quota_unscramble_abnormal_scram,
          unscramble: item.quota_unscramble_unscramble
        };
      };

      const seeMore = () => router.push("/history");

      onMounted(queryReport);

      return {
        ...toRefs(state),
        seeMore,
        showTips,
        formatTime
      };
    }
  });
</script>

<template>
  <div class="box-card report-box">
    <div class="box-header">
      <van-skeleton title title-width="70" round :row="1" :loading="reportLoading">
        <div class="box-header-top">
          <div class="title" v-if="!reportEmpty">
            {{ new Date(reportInfo.occurrenceTime).getFullYear() + "年" + reportInfo.name + "报告" }}
          </div>
          <div class="title" v-else>健康体检</div>
          <span v-track="{
              type: 'click',
              name: '健康新奥-体检报告-进入体检报告内容',
              data: `{&quot;页面类别&quot;: &quot;健康体检报告&quot;}`,
            }" @click="seeMore" v-if="!reportEmpty">更多报告<van-icon name="play" /></span>
        </div>

        <div class="box-header-bottom">
          <div class="title">{{ reportInfo.occurrenceDepartment }}</div>
          <span>{{ formatTime(reportInfo.occurrenceTime) }}</span>
        </div>
      </van-skeleton>
    </div>

    <!-- <van-skeleton title title-width="70" round :row="3" :loading="reportLoading" class="mt20" /> -->
    <van-skeleton title title-width="70" round :row="3" :loading="reportLoading" class="mt20">
      <div
        class="box-body"
        v-if="!reportEmpty && Object.keys(diseaseRisk).length !== 0 && inportantIndicator.length !== 0"
      >
        <div v-if="Object.keys(diseaseRisk).length !== 0">
          <div class="title">
            <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/safe.png" alt="" />
            <span>疾病风险提示</span>
          </div>

          <div class="box-body-content">
            <div
              :class="[
                'box-body-detail',
                Object.keys(diseaseRisk).length <= 2 && 'w310',
                Object.keys(diseaseRisk).length === 1 && 'w100'
              ]"
              v-for="(items, keyName, index) of diseaseRisk"
              :key="index"
            >
              <div class="detail-title">{{ keyName }}</div>
              <div class="detail-content" v-for="(item, idx) in items" :key="idx">
                <span>{{ item.quota_unscramble_item_name }}</span>
                <em
                  >{{ item.quotaOriginValue }} <i>{{ item.quota_unscramble_unit }}</i></em
                >
              </div>
            </div>
          </div>
        </div>

        <div v-if="inportantIndicator.length !== 0">
          <div class="title pt28">
            <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/trend.png" alt="" />
            <span>重点指标</span>
          </div>

          <div class="box-body-content">
            <div
              :class="[
                'box-body-detail',
                'box-body-trend',
                'active-animation',
                inportantIndicator.length === 1 && 'w100',
                inportantIndicator.length <= 2 && 'w310',
                inportantIndicator.length === 3 && 'w200'
              ]"
              v-for="(item, index) of inportantIndicator"
              :key="index"
              @click="showTips(item)"
              v-track="{
                type: 'click',
                name: '健康新奥-体检报告-点击按钮',
                data: `{&quot;类别名称&quot;: &quot;重点指标&quot;, &quot;按钮名称&quot;: &quot;${item.quota_unscramble_item_name}&quot;}`
              }"
            >
              <div class="trend-title">
                <span>{{ item.quota_unscramble_item_name }}</span>
                <em>{{ item.quota_unscramble_unit }}</em>
              </div>
              <div class="trend-num">
                <span class="pale-red">{{ item.quotaOriginValue }}</span>
                <!-- <img :class="{ rotate: false }" src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/arrow_up.png" alt="" /> -->
              </div>
              <div class="trend-range">正常范围：<br />{{ item.quota_unscramble_normal_range }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-body-empty" v-else>
        <div class="box-body-content-empty">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/like.png" alt="" />
          <div>培养良好生活习惯，才能少生病哦～</div>
        </div>
      </div>
    </van-skeleton>

    <tips :value.sync="tips.visible" :exp="0" :title="tips.title" :title-num="tips.titleNum" :sub-title="tips.subTitle">
      <div class="tips-box">
        <h4>异常解读</h4>
        <div>
          <span v-html="tips.scram"></span>
        </div>
        <h4>指标意义</h4>
        <div>
          <span v-html="tips.unscramble"></span>
        </div>
        <!-- <button class="common-btn" slot="button" @click="">{{ tips.btn }}</button> -->
      </div>
    </tips>
  </div>
</template>

<style scoped lang="scss">
  // @import '../../../assets/less/btn.css';
  .report-box {
    width: 100%;
    margin-bottom: 30px;
    .box-header {
      background-image: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/report_card_bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 32px 24px 24px;
      .box-header-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        .title {
          font-weight: 500;
          font-size: 34px;
          color: #fff;
        }
        span {
          display: flex;
          align-items: center;
          // align-self: center;
          font-size: 22px;
          color: #d4e0fe;
        }
      }
      .box-header-bottom {
        display: flex;
        justify-content: flex-start;
        .title {
          margin-right: 14px;
          font-size: 30px;
          color: #fff;
        }
        span {
          align-self: center;
          font-size: 24px;
          color: #d4e0fe;
        }
      }
    }
    .box-body {
      width: 100%;
      padding: 18px 14px 30px;
      .title {
        display: flex;
        align-items: center;
        padding: 10px 10px 14px;
        img {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        span {
          font-size: 30px;
          font-weight: 500;
          color: #4b7aff;
        }
      }
      .pt28 {
        padding-top: 28px;
      }
      .box-body-content {
        display: flex;
        flex-wrap: nowrap;
        align-content: flex-start;
        overflow-x: auto;
        width: 100%;
        padding: 10px;
        &::-webkit-scrollbar {
          display: none;
        }

        .box-body-detail {
          flex-shrink: 0;
          width: 285px;
          min-height: 206px;
          margin-right: 20px;
          padding: 12px 20px;
          background: #fff;
          box-shadow: 0px 4px 16px 0px rgba(115, 119, 130, 0.2);
          border-radius: 8px;
          text-align: left;
          .detail-title {
            margin-bottom: 12px;
            font-size: 32px;
            font-weight: 500;
            color: #1c1c1e;
          }
          .detail-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            span {
              font-size: 24px;
              color: #1c1c1e;
            }
            em {
              font-style: normal;
              font-size: 32px;
              font-weight: 700;
              color: #f55858;
              i {
                font-weight: 400;
                font-style: normal;
                font-size: 20px;
                color: #a0a0a0;
              }
            }
          }
        }
        .box-body-detail:last-child {
          margin-right: 0;
        }
        .box-body-trend {
          width: 186px;
          min-height: 212px;
          .trend-title {
            padding-bottom: 14px;
            font-size: 26px;
            color: #1c1c1e;
            em {
              font-style: normal;
              font-size: 20px;
              color: #a0a0a0;
            }
          }
          .trend-num {
            padding-bottom: 14px;
            font-size: 48px;
            font-weight: 700;
            img {
              width: 20px;
              height: 26px;
            }
            .rotate {
              transform: rotate(180deg);
            }
          }
          .trend-range {
            // width: 120px;
            line-height: 32px;
            font-size: 24px;
            color: #a0a0a0;
          }
        }
      }
      .active-animation:active {
        transition: 0.4s;
        background-color: #cbcaca;
      }
    }

    .box-body-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px 32px;
      margin-top: -1px;
      background-color: #4e7efc;
      border-radius: 0 0 16px 16px;
      .box-body-content-empty {
        display: flex;
        width: 100%;
        height: 88px;
        padding: 0 14px;
        line-height: 88px;
        background-color: #fff;
        border-radius: 16px;
        img {
          width: 70px;
          height: 70px;
          margin-top: 6px;
          margin-right: 20px;
        }
        div {
          font-size: 28px;
          color: #16b57d;
        }
      }
    }

    .tips-box {
      padding: 0 48px;
      text-align: left;
      h4 {
        font-size: 32px;
        font-weight: 500;
        color: #1c1c1e;
        margin-bottom: 10px;
      }
      div {
        margin-bottom: 32px;
      }
    }
  }
  .mt20 {
    margin-top: 30px;
  }
  .w310 {
    width: 310px !important;
  }
  .w100 {
    width: 100% !important;
  }
  .w200 {
    width: 200px !important;
  }
</style>
