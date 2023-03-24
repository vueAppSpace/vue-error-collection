<template>
  <div class="container">
    <!-- <div class="download" @click="downloadHandle"></div> -->

    <loading :loading="loading"></loading>
    <div v-if="originTabData">
      <div class="header">
        <div
          class="download"
          v-if="originTabData.healthExam && originTabData.healthExam.reportUrl"
          @click="downloadHandle"
          >PDF查看</div
        >
        <div class="title">
          {{ formatYear(originTabData.healthEventsInfo.occurrenceTime) }}年{{ originTabData.healthEventsInfo.name }}报告
        </div>
        <div class="person-info flex">
          <img class="avatar" :src="headUrl" />
          <div class="right">
            <div class="name flex flex-middle">
              <div class="name-style">{{ originTabData.healthEventsPersonalInfo.realName }}</div>
              <div>{{ formatDate(originTabData.healthEventsInfo.occurrenceTime) }}</div>
            </div>
            <div class="source">{{ originTabData.healthEventsInfo.occurrenceDepartment }}</div>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="tab__main">
          <div
            class="tab__div"
            :class="{
              tab__divSpec: marginIndex == 2,
              tab__divThree: marginIndex == 1,
              tab__divFour: marginIndex == 3
            }"
          >
            <ul
              class="tab__list"
              :class="{
                tab__list_one: marginIndex == 3
              }"
            >
              <li
                class="tab__item"
                :class="{ activeTab: index == idx }"
                v-for="(tabs, index) in tab_content"
                :key="tabs.tab_menu"
                @click="tabClick(index, tabs)"
                v-show="tabs.tab_menu"
              >
                <span>{{ tabs.tab_menu }}</span>

                <div v-if="idx == index" class="bottom_line" ref="bottomLine"></div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 重点指标 -->
        <div class="indicator" v-if="idx == 0">
          <div class="item" v-for="(item, index) in medicalInfo.phrUnscrambleDTO.details" :key="index">
            <div class="item-breviary flex-between">
              <div class="left">
                <div class="title">{{ item.quota_unscramble_item_name }}</div>
                <div class="unit">参考范围:{{ item.quota_unscramble_normal_range }}</div>
              </div>
              <div class="left middle">
                <div class="title">{{ item.quotaOriginValue }}</div>
                <div class="unit">{{ item.quota_unscramble_unit }}</div>
              </div>
              <div class="right" @click="unfoldToggle(item, index)">
                <span v-if="item.selected">收起解读</span>
                <span v-else>展开解读</span>
                <div class="sanjiao"></div>
              </div>
            </div>

            <div class="unscramble" v-if="item.selected">
              <div class="title">异常解读</div>
              <div class="content">
                <div v-html="item.quota_unscramble_abnormal_scram"></div>
                <!-- {{ item.quota_unscramble_abnormal_scram }} -->
              </div>
            </div>

            <div class="unscramble significance" v-if="item.selected">
              <div class="title">指标意义</div>
              <div class="content">
                {{ item.quota_unscramble_unscramble }}
              </div>
            </div>
          </div>
        </div>

        <!-- 综合建议 -->
        <div class="jianyi" v-if="idx == 1">
          <div class="survey">
            <div class="title">体检综述</div>
            <div
              class="item-survey"
              v-for="(item, index) in ConversionWords(medicalInfo.healthExam.summary)"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div class="survey tijian-jianyi">
            <div class="title title-suggest">体检建议</div>
            <div
              class="item-survey item-survey-spec"
              v-for="(item, index) in ConversionWords(medicalInfo.healthExam.suggestion)"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <!-- 一般检查 -->
        <div class="jiancha yiban" v-if="idx == 2">
          <div class="itemWrapper" v-for="(item, index) in medicalInfo.healthExam.details.departmentExam" :key="index">
            <div class="title" v-if="item.departmentExamDetail">{{ item.itemTypeName }}</div>
            <div class="item" v-for="(obj, idx) in item.departmentExamDetail" :key="idx">
              <div class="top flex-between">
                <div class="name">{{ obj.itemPositionName }}</div>
                <div class="value" :class="{ red_tDetailFn1: obj.unusualPrompt != '0' && obj.unusualPrompt != '9' }">
                  {{ obj.itemResult }}
                </div>
              </div>
              <div class="bottom flex-between">
                <div class="scope">参考范围:{{ translateData(obj.itemResultReferenceValue) }}</div>
                <div class="unit">单位：{{ translateData(obj.itemResultUnit) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- // 实验室检查 -->
        <div class="jiancha" v-if="idx == 3">
          <div class="itemWrapper" v-for="(item, index) in medicalInfo.healthExam.details.laboratoryExam" :key="index">
            <div class="title" v-if="item.laboratoryExamDetail">{{ item.itemTypeName }}</div>
            <div class="item" v-for="(obj, idx) in item.laboratoryExamDetail" :key="idx">
              <div class="top flex-between">
                <div class="name">{{ obj.itemName }}</div>
                <div class="value" :class="{ red_1: obj.unusualPrompt != '0' && obj.unusualPrompt != '9' }">{{
                  obj.itemResult
                }}</div>
              </div>
              <div class="bottom flex-between">
                <div class="scope">参考范围:{{ translateData(obj.itemResultReferenceValue) }}</div>
                <div class="unit">单位：{{ translateData(obj.itemResultUnit) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 医技检查 -->

        <div class="jiancha" v-if="idx == 4">
          <div
            class="itemWrapper"
            v-for="(item, index) in medicalInfo.healthExam.details.medicalTechnologyExam"
            :key="index"
          >
            <div class="title" v-if="item.medicalTechnologyExamDetail">{{ item.itemTypeName }}</div>
            <div class="item" v-for="(obj, idx) in item.medicalTechnologyExamDetail" :key="idx">
              <div class="top flex-between">
                <div class="name">{{ obj.itemName }}</div>
                <div class="value" :class="{ red_1: obj.unusualPrompt != '0' && obj.unusualPrompt != '9' }">
                  {{ obj.itemResult }}
                </div>
              </div>
              <div class="bottom flex-between">
                <div class="scope">参考范围:{{ translateData(obj.itemResultReferenceValue) }}</div>
                <div class="unit">单位：{{ translateData(obj.itemResultUnit) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-text" v-if="!loading">—— 数智解读供参考 ——</div>
  </div>
</template>
<script>
  import { reportDetail } from "@/service/healthRecord";
  import TabModule from "../../components/TabModule";
  import loading from "../../components/Loading";
  // import pdf from '../../components/vuePdf'
  // import moment from 'moment'
  import { isUniApp, isIcomeIOS, isIcomeAndroid } from "@/utils/native/deviceEnv";
  import { jsBridge } from "@/utils/native/jsBridge";
  import { mapState, useUserStore } from "@/pinia";
  import { eServicePdfPreview } from "@/config/env";
  import scriptUrl from "@/utils/url";
  import { loadBase64 } from "@/utils/commonFun";

  export default {
    directives: {},
    components: {
      TabModule,
      loading
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    data() {
      return {
        pdfUrl:
          "https://entropy-tmp.oss-cn-beijing.aliyuncs.com/MjEwNTI0MDUwOQ%3D%3D.PDF?Expires=3546509703&OSSAccessKeyId=LTAI5tNBUuD5RLXz1h85PPn3&Signature=OW36SCXf9SbzlKIrY%2Be3yOhiX9E%3D",
        listData: [
          {
            time: "2022年04月14日",
            img: "https://oss-appupload.icomecloud.com/userInfo/faceUrl/pre/b2dfc5eec645a1ff5af3da7074eba690.png-m_app_avatar.jpg",
            name: "年度体检",
            orga: "三疗健康中心",
            abnormalNum: 5
          }
        ],
        tab_content: null,
        // tab_content: [{ tab_menu: "重点指标" },
        // { tab_menu: "综合建议" },
        // { tab_menu: "一般检查" },
        // { tab_menu: "实验室检查" }],
        idx: 0,
        medicalInfo: {
          phrUnscrambleDTO: null,
          healthExam: {
            details: {
              departmentExam: [],
              laboratoryExam: [],
              medicalTechnologyExam: []
            }
          }
        },
        headUrl: null,
        loading: true,

        originTabData: null,

        marginIndex: 0
      };
    },
    methods: {
      translateData(val) {
        if (val == "-" || !val) {
          return "--";
        } else {
          return val;
        }
      },
      translateNum(val) {
        if (parseFloat(val).toString() == "NaN") {
          return val;
        } else {
          if (Math.round(val)) {
            return Math.round(val);
          } else {
            return val;
          }
        }
      },
      downloadHandle() {
        let reportUrl = this.medicalInfo.healthExam.reportUrl;
        let filename = this.getDay();
        console.log("filename", reportUrl);

        if (isIcomeIOS) {
          jsBridge.invoke("previewFile", { serverUrl: reportUrl, ext: { fileName: filename + ".pdf" } });
        } else if (isIcomeAndroid) {
          jsBridge.invoke("openWebView", { targetUrl: reportUrl });
        } else if (isUniApp) {
          console.log("downloadHandle ============>");

          loadBase64(scriptUrl.base64).then(() => {
            jsBridge.invoke("openWebView", {
              targetUrl: `${eServicePdfPreview}?url=${encodeURIComponent(Base64.encode(reportUrl))}`
            });
          });
        } else {
          jsBridge.invoke("previewFile", { serverUrl: reportUrl, ext: { fileName: filename + ".pdf" } });
        }
      },
      downloadHandle2() {
        let reportUrl =
          "https://entropy-tmp.oss-cn-beijing.aliyuncs.com/MjEwNTI0MDUwOQ%3D%3D.PDF?Expires=3546509703&OSSAccessKeyId=LTAI5tNBUuD5RLXz1h85PPn3&Signature=OW36SCXf9SbzlKIrY%2Be3yOhiX9E%3D";
        window.open(reportUrl);
      },
      downloadHandle3() {
        let reportUrl =
          "http://file.finance.sina.com.cn/211.154.219.97:9494/MRGG/CNSESH_STOCK/2022/2022-4/2022-04-28/8117633.PDF";
        this.fileLinkToStreamDownload(reportUrl); //直接传入要下载的pdf文件的线上地址
      },
      downloadHandle4() {
        let reportUrl =
          "http://file.finance.sina.com.cn/211.154.219.97:9494/MRGG/CNSESH_STOCK/2022/2022-4/2022-04-28/8117633.PDF";
        window.open(reportUrl);
      },
      fileLinkToStreamDownload(url) {
        let fileName = this.getDay();
        console.log("fileName", fileName);
        let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
        if (!reg.test(url)) {
          throw new Error("传入参数不合法,不是标准的文件链接");
        } else {
          let xhr = new XMLHttpRequest();
          xhr.open("get", url, true);
          // xhr.setRequestHeader('Content-Type', `application/pdf`)
          xhr.responseType = "blob";
          let that = this;
          xhr.onload = function () {
            if (this.status == 200) {
              //接受二进制文件流
              var blob = this.response;
              that.downloadExportFile(blob, fileName);
            }
          };
          xhr.send();
        }
      },
      downloadExportFile(blob, tagFileName) {
        let downloadElement = document.createElement("a");
        let href = blob;
        if (typeof blob == "string") {
          downloadElement.target = "_blank";
        } else {
          href = window.URL.createObjectURL(blob); //创建下载的链接
        }
        downloadElement.href = href;
        downloadElement.download = tagFileName;
        //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        if (typeof blob != "string") {
          window.URL.revokeObjectURL(href); //释放掉blob对象
        }
      },
      getDay() {
        let time = new Date(),
          year = time.getFullYear(),
          month = time.getMonth() + 1,
          day = time.getDate(),
          timeStem = time.getTime();
        return `${year}/${month}/${day}/${timeStem}.pdf`;
      },
      ConversionWords(code) {
        console.log("、武术");
        console.log("code", code);
        code = code.replace(/↵/g, "\n");

        // code = code.split(/[(\r\n)\r\n]+/); // 根据换行或者回车进行识别
        code = code.split(/\r/); // \r表示回车
        console.log("code2", code);
        code.forEach((item, index) => {
          // 删除空项
          if (!item) {
            code.splice(index, 1);
          }
        });
        code = Array.from(new Set(code));

        console.log("codeFinal", code);
        return code;
      },
      unfoldToggle(item, index) {
        for (let i = 0; i < this.medicalInfo.phrUnscrambleDTO.details.length; i++) {
          if (i == index) {
            continue;
          } else {
            this.medicalInfo.phrUnscrambleDTO.details[i].selected = false;
          }
        }
        item.selected = !item.selected;
        this.medicalInfo.phrUnscrambleDTO.details.splice(index, 1, item);
      },
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY.MM.DD");
      },
      formatYear(date) {
        return dayjs(parseInt(date)).format("YYYY");
      },
      tabClick(index, tabs) {
        const reportName = `${this.formatYear(this.originTabData.healthEventsInfo.occurrenceTime)}年${
          this.originTabData.healthEventsInfo.name
        }报告`;
        const tabName = tabs.tab_menu;
        this.zgStatistics("健康新奥-体检报告-点击报告详情切换", { tab名称: tabName, 报告名称: reportName });
        this.idx = index;
      },
      reportDetailFn() {
        let data = {
          archiveId: this.$route.query.id
        };
        reportDetail(data)
          .then(res => {
            if (res.code == 0) {
              if (res.data) {
                console.log("res.data", res.data);
                this.loading = false;
                this.originTabData = res.data;
                this.medicalInfo = res.data;

                this.tab_content = [];

                // 重点指标
                if (
                  res.data.phrUnscrambleDTO &&
                  res.data.phrUnscrambleDTO.details &&
                  res.data.phrUnscrambleDTO.details.length
                ) {
                  this.tab_content.push({ tab_menu: "重点指标", index: 0 });

                  this.$set(this.medicalInfo.phrUnscrambleDTO.details, "selected", false);
                  this.medicalInfo.phrUnscrambleDTO.details[0].selected = true;
                } else {
                  this.tab_content.push({});
                }

                // 综合建议

                if (res.data.healthExam && res.data.healthExam.summary) {
                  this.tab_content.push({ tab_menu: "综合建议", index: 1 });
                } else {
                  this.tab_content.push({});
                  this.marginIndex += 1;
                }
                // 一般检查

                if (
                  res.data.healthExam &&
                  res.data.healthExam.details &&
                  res.data.healthExam.details.departmentExam.length
                ) {
                  this.tab_content.push({ tab_menu: "一般检查", index: 2 });
                } else {
                  this.tab_content.push({});
                  this.marginIndex += 1;
                }
                // 实验室检查
                if (
                  res.data.healthExam &&
                  res.data.healthExam.details &&
                  res.data.healthExam.details.laboratoryExam.length
                ) {
                  this.tab_content.push({ tab_menu: "实验室检查", index: 3 });
                } else {
                  this.tab_content.push({});
                  this.marginIndex += 1;
                }
                // 医技检查
                if (
                  res.data.healthExam.details.medicalTechnologyExam &&
                  res.data.healthExam.details.medicalTechnologyExam.length
                ) {
                  this.tab_content.push({
                    tab_menu: "医技检查",
                    index: 4
                  });
                } else {
                  this.tab_content.push({});
                  this.marginIndex += 1;
                }

                for (let item of this.tab_content) {
                  if (item.tab_menu) {
                    this.idx = item.index;
                    break;
                  }
                }

                console.log("this.tab_content", this.tab_content);

                console.log("marginIndex", this.marginIndex);
                // this.tabClick();
              }
            }
          })
          .catch(ex => {});
      }
    },
    watch: {},
    mounted() {
      this.reportDetailFn();

      // this.headUrl = localStorage.getItem("headUrl");
      this.headUrl = this.userInfo.icomeHeadPhoto;

      loadBase64(scriptUrl.base64);
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../style/faceReport.css";

  .container {
    width: 100%;
    position: relative;
    background-color: #f0f2f7;
    padding-bottom: 130px;

    .header {
      width: 750px;
      height: 446px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/report-bg.png")
        no-repeat left center;
      background-size: 100% 100%;
      text-align: left;
      position: relative;

      .download {
        position: absolute;
        right: 32px;
        top: 130px;
        width: 176px;
        height: 64px;
        background: #ffffff;
        border-radius: 44px;
        font-size: 28px;
        font-weight: 500;
        color: #4b7aff;
        line-height: 64px;
        text-align: center;
      }

      .title {
        font-size: 48px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 56px;
        text-shadow: 0px 2px 4px #2b6fe5;
        padding: 40px 0 22px 56px;
      }

      .person-info {
        font-size: 32px;
        line-height: 44px;
        color: #ffffff;
        padding-left: 32px;

        img {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          margin-right: 24px;
        }

        .source {
          font-size: 26px;
          line-height: 38px;
        }

        .right {
          .name-style {
            width: 170px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 8px;
          }
        }
      }
    }

    /* #F0F2F7 */

    .content-wrapper {
      background-color: #f0f2f7;
      margin-top: -180px;
      position: relative;
      z-index: 100;
      border-radius: 16px;

      .jiancha {
        margin: 0 32px;
        margin-top: 32px;
        background-color: #fff;
        text-align: left;

        .itemWrapper {
          font-size: 32px;
          font-weight: 550;
          color: #1c1c1e;
          line-height: 44px;

          .title {
            padding: 32px 0 32px 32px;
          }

          .item {
            color: #1c1c1e;
            line-height: 42px;
            font-size: 30px;
            padding: 32px;
            border-top: 1px solid rgba(235, 235, 235, 0.4);
            font-weight: normal;

            .top {
              margin-bottom: 8px;
              .name {
                min-width: 100px;
              }
              .value {
              }
            }

            .bottom {
              font-size: 26px;
              color: #9195a1;
            }
          }
        }
      }

      .yiban {
        .itemWrapper {
          .item {
            .top {
              .value {
                color: #1c1c1e;
              }
            }
          }
        }
      }

      .jianyi {
        margin: 0 32px;
        margin-top: 32px;
        background-color: #fff;
        text-align: left;
        padding-bottom: 24px;

        .survey {
          font-size: 32px;
          font-weight: 500;
          color: #1c1c1e;
          line-height: 44px;

          .title {
            padding: 32px 0 32px 88px;
            font-weight: bold;
            background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/summary.png")
              no-repeat 32px center;
            background-size: 44px 46px;
          }

          .title-suggest {
            padding: 32px 0 32px 88px;
            font-weight: bold;
            background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/suggest.png")
              no-repeat 32px center;
            background-size: 44px 46px;
          }

          .item-survey {
            width: 638px;
            font-size: 30px;
            color: #1c1c1e;
            line-height: 42px;
            padding: 0px 32px;
          }

          .item-survey-spec {
            margin-bottom: 16px;
          }
        }
      }

      /* <div class="indicator">
                <div class="item">
                    <div class="left">
                        <div class="title">心率</div>
                        <div class="unit">参考范围:9.4-12.5</div>
                    </div>
                    <div class="middle">
                        <div class="title">68</div>
                        <div class="unit">次/分钟</div>
                    </div>
                    <div class="right">
                        收起解读
                        <span></span>
                    </div>
                </div>
            </div> */
      .indicator {
        margin: 0 32px;
        margin-top: 32px;
        /* background-color: #fff; */
        text-align: left;

        .item {
          /* height: 136px; */
          position: relative;
          margin-bottom: 20px;

          .item-breviary {
            padding: 32px;
            background-color: #fff;
            border-radius: 16px 16px 0px 0px;
          }

          .left {
            .title {
              font-weight: 550;
              color: #1c1c1e;
              line-height: 42px;
              font-size: 32px;
              margin-bottom: 6px;
            }

            .unit {
              color: #9195a1;
              line-height: 30px;
              font-size: 22px;
            }
          }

          .middle {
            .title {
              font-size: 40px;
              font-weight: bold;
              color: #f55858;
              line-height: 36px;
            }
          }

          .right {
            font-size: 24px;
            color: #4b7aff;
            line-height: 34px;
            position: relative;
            margin-right: 24px;

            .sanjiao {
              width: 0px;
              height: 0px;
              border: 10px solid transparent;
              border-top-color: #4b7aff;
              position: absolute;
              right: -30px;
              top: 10px;
            }
          }

          /* <div class="unscramble">
                        <div class="title">
                            异常解读
                        </div>
                        <div class="content">
                            改善饮食结构，控制体重，适当运动
                            ，若伴有乏力、心率减慢等不适，请咨询
                        </div>
                    </div> */

          .unscramble {
            font-size: 28px;
            color: #1c1c1e;
            line-height: 48px;
            padding: 32px;
            background-color: #f4f7ff;

            .title {
              font-weight: bold;
              margin-bottom: 12px;
            }
          }

          .significance {
            padding-top: 0px;
          }
        }
      }
    }

    .bottom-text {
      position: fixed;
      bottom: 0px;
      left: 0;
      width: 750px;
      text-align: center;
      height: 110px;
      line-height: 110px;
      font-size: 28px;
      color: #9195a1;
      z-index: 150;
      background-color: #f0f2f7;
    }
  }

  .tab__div {
    width: 100%;
    height: 102px;
    position: relative;
    padding: 0 8px;
    padding-top: 30px;
    background-color: #fff;
    border-radius: 16px 16px 0px 0px;

    .tab__list {
      display: flex;
      justify-content: space-between;

      .tab__item {
        font-size: 32px;
        position: relative;

        .bottom_line {
          width: 60px;
          height: 4px;
          background: #2e7cff;
          border-radius: 4px;
          position: absolute;
          left: 50%;
          margin-left: -30px;
          bottom: -24px;
        }
      }

      .tab__item-current {
        font-weight: 700;
      }

      .activeTab {
        font-weight: 550;
        color: #4b7aff;
      }
    }
    .tab__list_one {
      justify-content: center;
    }

    .active__line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 4px;
      background-color: #2e7cff;
      transition: all 300ms;
    }
  }

  .tab__divSpec {
    padding: 0 0.48rem;
    padding-top: 0.3rem;
  }
  .tab__divThree {
    padding: 0 0.48rem;
    padding-top: 0.3rem;
  }
  .tab__divFour {
  }
  .red_1 {
    color: #f55858 !important;
  }
</style>
