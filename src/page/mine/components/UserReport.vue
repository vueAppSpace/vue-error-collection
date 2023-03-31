<!--
 * @Description: 用户自上传的体检报告
 * @Author: IFLS
 * @Date: 2022-06-28 11:13:35
 * @LastEditTime: 2023-03-31 14:07:12
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, computed } from "@vue/composition-api";
  import { Toast } from "vant";
  import { formatTime } from "@/utils/commonFun";
  import { queryReport } from "@/service/uploadReport";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const state = reactive({
        memberCode: localStorage.getItem("memberCode"),
        empNo: localStorage.getItem("empNo"),
        memberId: localStorage.getItem("memberId"),
        reportData: {},
        reportLoading: true
      });

      const isEmpty = computed(() => {
        return Object.keys(state.reportData).length === 0;
      });

      const queryReportData = () => {
        const { memberCode, memberId, empNo } = state;

        const req = { memberCode, memberId, empNo, pageSize: 1, pageNum: 1 };
        queryReport(req).then(({ code, data, message }) => {
          state.reportLoading = false;
          if (code === 0) {
            if (data.length === 1) {
              const dt = data[0];
              state.reportData = dt;
            }
          } else {
            isEmpty.value = true;
            console.log("queryReportData", message);
            // Toast(message)
          }
        });
      };

      const jumpTo = url => router.push(url);

      const jumpToDetail = status => {
        let url = "/upload-report?autoback=true";
        // status: 0待标注 1待补充 2已标注 3已编辑   2 3时不可编辑
        // if (status > 1) {
        //     url += '&disabled=true'
        // }
        if (status != 1) {
          url += "&disabled=true";
        } else {
          url += `&status=${status}`;
        }

        jumpTo(url);
      };

      onMounted(queryReportData);

      return {
        ...toRefs(state),
        isEmpty,
        jumpTo,
        jumpToDetail,
        queryReportData, // 暴露给父组件刷新数据使用
        formatTime
      };
    }
  });
</script>

<template>
  <div class="box-card report-box">
    <div class="box-header">
      <van-skeleton title title-width="70" round :row="1" :loading="reportLoading">
        <div v-if="!isEmpty">
          <div class="box-header-top">
            <div class="title">
              {{ formatTime(new Date(reportData.archivesDate.replace(/-/g, "/")).getTime()) + "上传" }}
            </div>
            <span v-track="{
                type: 'click',
                name: '健康新奥-体检报告-进入体检报告内容',
                data: `{&quot;页面类别&quot;: &quot;自传健康体检报告&quot;}`,
              }" @click="jumpTo('/history?self=true')">更多报告<van-icon name="play" /></span>
          </div>

          <div class="box-header-bottom">
            <button class="btn" @click="jumpToDetail(reportData.archivesStatus)">点击查看>></button>
          </div>
        </div>

        <div v-else class="box-heaer-empty">
          <div class="empty-tips">您还没有上传任何历史报告哦～</div>
          <div class="empty-btn" @click="jumpTo('/upload-report?autoback=true&add=true')">立即上传</div>
        </div>
      </van-skeleton>
    </div>

    <van-skeleton title title-width="70" round :row="3" :loading="reportLoading" class="mt20">
      <div class="box-body" v-if="!isEmpty">
        <div class="tips-info" v-if="reportData.archivesStatus === 1">
          <van-icon name="warning-o" size="20" />
          <span @click="jumpToDetail(reportData.archivesStatus)"> 上传资料不足以支撑健康解读，立即上传>> </span>
        </div>
        <div v-if="[2, 3].includes(reportData.archivesStatus)">
          <div class="doctor-info">
            <img
              src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/default_avatar.png"
              alt=""
            />
            <div class="doctor-box">
              <div>
                <span class="doctor-name">三疗健康管理师</span>
                <!-- <span class="doctor-title">主任医师</span> -->
              </div>
              <!-- <div>
                            <div class="doctor-introduce">原解放军301医院内分泌科主任</div>
                        </div> -->
            </div>
          </div>
          <div class="content">
            <h6 class="content-title">整体印象</h6>
            <div v-html="reportData.reportInterpretation"></div>
          </div>
        </div>
        <div class="upload-success" v-if="reportData.archivesStatus === 0">
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/resolve.png" alt="" />
          <div>健康报告解读中…</div>
        </div>
      </div>
    </van-skeleton>
  </div>
</template>

<style scoped lang="scss">
  @import "../../../assets/less/btn.css";
  .report-box {
    width: 100%;
    margin-bottom: 30px;
    .box-header {
      background-image: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/report_card_bg2.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 32px 24px 24px;
      .box-header-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        color: #fff;
        .title {
          font-weight: 500;
          font-size: 34px;
        }
        span {
          display: flex;
          align-items: center;
          // align-self: center;
          font-size: 22px;
        }
      }
      .box-header-bottom {
        display: flex;
        justify-content: flex-start;
        .btn {
          // width: 146px;
          height: 56px;
          background: transparent;
          border-radius: 28px;
          font-size: 28px;
          font-weight: 400;
          color: #fff;
          border: none;
        }
      }
      .box-heaer-empty {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .empty-tips {
          font-size: 28px;
          font-weight: 400;
          color: #fff;
        }
        .empty-btn {
          width: 168px;
          height: 56px;
          line-height: 56px;
          background: #fff;
          border-radius: 30px;
          font-size: 26px;
          font-weight: 500;
          color: #19c9c3;
        }
      }
    }
    .box-body {
      width: 100%;
      padding: 24px;
      .upload-success {
        padding: 20px;
        font-size: 26px;
        font-weight: 400;
        color: #565961;
        border-radius: 15px;
        img {
          margin-bottom: 18px;
          width: 142px;
          height: 130px;
        }
      }
      .tips-info {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90px;
        line-height: 90px;
        background: #fff3e3;
        font-size: 26px;
        font-weight: 400;
        color: #ff9500;
        border-radius: 20px;
      }
      .tips-info::after {
        position: absolute;
        top: -15px;
        left: 70px;
        width: 0;
        height: 0;
        content: "";
        border-bottom: 15px solid #fff3e3;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
      }

      .doctor-info {
        display: flex;
        padding-bottom: 24px;
        text-align: left;
        font-weight: 400;
        font-size: 24px;
        img {
          width: 88px;
          height: 88px;
          border-radius: 50%;
        }
        .doctor-box {
          padding: 10px 0 0 16px;
          display: flex;
          align-items: center;
          .doctor-name {
            font-size: 32px;
            font-weight: 500;
            color: #1c304f;
          }
          .doctor-title {
            color: #1c304f;
          }
          .doctor-introduce {
            color: #9195a1;
          }
        }
      }
      .content {
        // padding-bottom: 21px;
        text-align: left;
        font-size: 28px;
        font-weight: 400;
        color: #3d3e42;
        .content-title {
          font-size: 32px;
          font-weight: 500;
          color: #1b1c1e;
          margin-bottom: 20px;
        }
      }
    }
  }
  .mt20 {
    margin-top: 20px;
  }
  .pb20 {
    padding-bottom: 20px;
  }
  .pd0 {
    padding: 0;
  }
</style>

<style>
  .content img {
    width: 100%;
  }
</style>
