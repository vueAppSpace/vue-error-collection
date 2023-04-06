<template>
  <div class="container">
    <loading :loading="loading"></loading>
    <div :class="['header-wrapper', isSelf && 'header-wrapper-self']">
      <div :class="['header', 'flex-middle', isSelf && 'header-self']">
        <div class="guide-icon"></div>
        <div class="title">{{ isSelf && "自传" }}健康体检报告</div>
        <div class="guide-icon-2"></div>
      </div>
    </div>

    <div class="list" v-if="!isSelf">
      <div class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <div class="circle"></div>
        <div class="line"></div>
        <div class="title">{{ formatDate(item.examTime) }}</div>
        <div class="content">
          <div class="top flex">
            <img v-if="item.type == 1" :src="imgList[0]" />
            <img v-if="item.type == 2" :src="imgList[2]" />
            <img v-if="item.type == 0" :src="imgList[1]" />
            <div class="medicalInfo">
              <div class="bold">{{ item.typeName }}</div>
              <div class="address">{{ item.organizationName }}</div>
            </div>
          </div>
          <div
            class="bottom"
            v-if="item.phrInfoAbnormalCountDetailDTO && item.phrInfoAbnormalCountDetailDTO.totalCount"
          >
            共有<span>
              {{ item.phrInfoAbnormalCountDetailDTO.totalCount }}
              <!-- {{ ConversionWords(item.summary) ? ConversionWords(item.summary).length : 0 }}  --> </span
            >项异常
          </div>
          <div class="bottom" v-else>一切正常</div>
        </div>
      </div>
    </div>

    <div class="list list-self" v-else>
      <div class="item" v-for="(item, index) in selfList" :key="index" @click="toDetailSelf(item)">
        <div class="circle"></div>
        <div class="line"></div>
        <div class="title">{{ formatDate(new Date(item.archivesDate.replace(/-/g, "/")).getTime()) }}</div>
        <div :class="['content', isSelf && 'content-self']">
          <div class="top flex">
            <img :src="imgList[2]" />
            <div class="medicalInfo">
              <div class="bold">{{ "体检报告" }}</div>
              <div class="address">{{ "自行上传" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="common-btn fix-btn" @click="toDetailSelf(null)" v-if="isSelf">上传报告</button>

    <feed-back />
  </div>
</template>
<script>
  import { queryReport } from "@/service/uploadReport";
  import FeedBack from "./components/FeedBack";
  import { list } from "@/service/healthRecord";
  // import moment from 'moment'
  import loading from "../../components/Loading";
  import { mapState, useUserStore } from "@/pinia";

  const imagesArr = [
    "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/niandu-tag.png",
    "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/person-tag.png",
    "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/ruzhi-tag.png"
  ];
  export default {
    directives: {},
    components: {
      loading,
      FeedBack
    },
    computed: {
      ...mapState(useUserStore, ["userInfo"])
    },
    data() {
      return {
        isSelf: undefined,
        memberCode: localStorage.getItem("memberCode"),
        list: [],
        selfList: [],
        imgList: imagesArr,
        loading: true
      };
    },
    methods: {
      ConversionWords(code) {
        if (!code) return;
        code = code.replace(/↵/g, "\n");
        code = code.split(/[(\r\n)\r\n]+/); // 根据换行或者回车进行识别
        code.forEach((item, index) => {
          // 删除空项
          if (!item) {
            code.splice(index, 1);
          }
        });
        code = Array.from(new Set(code));

        return code;
      },
      listFn() {
        let data = {
          memberCode: localStorage.getItem("memberCode")
        };
        list(data)
          .then(res => {
            if (res.code == 0) {
              if (res.data) {
                this.loading = false;
                console.log("res.data", res.data);
                this.list = res.data;
              }
            }
          })
          .catch(ex => {});
      },
      queryList() {
        debugger;
        const { memberCode } = this;
        const { memberId } = this.userInfo;
        const { empNo } = this.userInfo;
        const req = { memberCode, memberId, empNo, pageSize: 999, pageNum: 1 };
        queryReport(req).then(({ code, data, message }) => {
          if (code === 0) {
            this.selfList = data;
            this.loading = false;
          } else {
            console.log("queryReport", message);
            // Toast(message)
          }
        });
      },
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY年MM月DD日");
      },
      toDetail(item) {
        this.zgStatistics("健康新奥-体检报告-进入体检报告内容", {
          异常项数量: item.phrInfoAbnormalCountDetailDTO ? item.phrInfoAbnormalCountDetailDTO.totalCount : 0,
          // this.ConversionWords(item.summary) ? this.ConversionWords(item.summary).length : 0
          报告时间: this.formatDate(item.examTime)
        });
        this.$router.push({
          path: "/reportDetail",
          query: {
            id: item.eventId
          }
        });
      },
      toDetailSelf(item) {
        this.zgStatistics("健康新奥-体检报告-进入体检报告内容", {
          异常项数量: 0,
          报告时间: item ?? this.formatDate(new Date(item.archivesDate.replace(/-/g, "/")).getTime())
        });
        if (item) {
          sessionStorage.setItem("reportDetailCache", JSON.stringify(item));
          this.$router.push({
            path: "/upload-report",
            query: {
              disabled: true,
              cache: true
            }
          });
        } else {
          this.$router.push({
            path: "/upload-report",
            query: {
              add: true,
              autoback: true
            }
          });
        }
      }
    },

    mounted() {
      const { self: isSelf } = this.$route.query;
      this.isSelf = isSelf;
      if (isSelf) {
        this.queryList();
      } else {
        this.listFn();
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/less/btn.css";

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
    .header-wrapper {
      width: 750px;
      height: 446px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/history-bg.png")
        no-repeat left center;
      background-size: 100% 100%;
      .header {
        padding: 98px 88px 0 88px;
        font-size: 48px;
        color: #fff;
        .title {
          margin: 0 20px;
        }
        .guide-icon {
          width: 120px;
          height: 8px;
          background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          border-radius: 100px;
        }
        .guide-icon-2 {
          width: 120px;
          height: 8px;
          background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          border-radius: 100px;
        }
      }
      .header-self {
        padding: 98px 0 0 0;
      }
    }
    .header-wrapper-self {
      background-image: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/report/history-bg2.png");
    }
    .list {
      width: 710px;
      margin: 0 20px;
      background-color: #fff;
      border-radius: 16px;
      padding: 40px 0;
      margin-top: -223px;

      .item {
        margin: 0 32px 56px 76px;
        text-align: left;
        position: relative;
        .circle {
          width: 24px;
          height: 24px;
          background: #ffffff;
          border-radius: 12px;
          border: 6px solid #4b7aff;
          position: absolute;
          left: -44px;
          top: 5px;
        }
        .line {
          width: 4px;
          height: 300px;
          background: rgba(75, 122, 255, 0.16);
          position: absolute;
          left: -34px;
          top: 29px;
        }
        .title {
          font-size: 32px;
          color: #565961;
          line-height: 44px;
        }
        .content {
          width: 602px;
          height: 198px;
          background: rgba(242, 244, 248, 0.8);
          border-radius: 12px;
          padding: 26px 0 24px 32px;
          margin-top: 24px;
          .top {
            height: 84px;
            img {
              width: 84px;
              height: 84px;
              border-radius: 50%;
              margin-right: 18px;
            }
            .medicalInfo {
              color: #1c1c1e;
              .bold {
                font-size: 30px;
                font-weight: 550;
                line-height: 42px;
              }
              .address {
                font-size: 26px;
                color: #737782;
                line-height: 38px;
              }
            }
          }

          .bottom {
            margin-top: 22px;
            font-size: 30px;
            color: #1c1c1e;
            line-height: 42px;
            span {
              color: red;
            }
          }
        }

        .content-self {
          height: auto;
        }
      }
      .item:last-child {
        .line {
          height: 240px;
        }
      }
    }
    .list-self {
      padding-bottom: 190px;
    }
  }
  // .fix-btn {
  //   background: #fda337;
  // }
</style>
