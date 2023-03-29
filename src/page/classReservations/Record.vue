<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-03-29 17:22:46
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\Record.vue
 * @Description: 动感团操 - 约课记录
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import { Toast } from "vant";
  import _get from "lodash.get";

  import RecordCard from "./components/RecordCard.vue";
  import FullLoading from "@/components/Loading";

  import { getUserSubClassList, getUserSubClassPastList } from "@/service/classReservations";

  import { jsBridge } from "@/utils/native/jsBridge";
  import { RecordState } from "./util/constant";

  export default defineComponent({
    components: {
      RecordCard,
      FullLoading
    },

    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      //从 "约课界面" "体测二级页面" "设备绑定页面" 进入刷新当前页面
      if (["/class-reservations", "/physical-test-records", "/class-reservations-bind-devices"].includes(fromPath)) {
        next(async vm => {
          await vm.queryPageDataFn();
        });
      } else {
        next();
      }
    },

    setup(_, context) {
      console.log("classReservations record...");

      const { zgStatistics, $router: router } = context.root;
      const state = reactive({
        RecordState,
        //tab
        tabList: [
          {
            title: "未完成",
            id: "1001"
          },
          {
            title: "已完成",
            id: "1002"
          }
        ],
        activeTabIndex: 0,

        //bussiness data
        userSubClassList: [],
        userPastSubClassList: [],
        pageParams: {
          pageIndex: 1,
          pageOffset: 0,
          pageLimit: 10
        },

        //控制加载list
        loading: false,
        finished: false,
        //遮罩层
        coverLoading: false
      });

      //重置整个页面数据
      function resetPageData() {
        state.activeTabIndex = 0;
        state.userSubClassList = [];
        state.userPastSubClassList = [];
        state.pageParams.pageIndex = 1;
        state.pageParams.pageOffset = 0;
        state.loading = false;
        state.finished = false;
      }

      //重置分页所需数据
      function resetListData() {
        state.userPastSubClassList = [];
        state.pageParams.pageIndex = 1;
        state.pageParams.pageOffset = 0;
        state.loading = false;
        state.finished = false;
      }

      //递增分页
      function incrementPageIndex() {
        state.pageParams.pageIndex++;
        state.pageParams.pageOffset = state.pageParams.pageLimit * (state.pageParams.pageIndex - 1);
      }

      //1.获取页面初始化所需全部数据
      async function queryPageDataFn() {
        state.coverLoading = true;
        try {
          resetPageData();
          await queryUserSubClassListFn();
          state.coverLoading = false;
        } catch (e) {
          state.coverLoading = false;
          console.log("queryPageDataFn", e);
        }
      }

      //2.查询用户约课数据
      async function queryUserSubClassListFn() {
        // const { code, message, data } = await import(
        //   "@/mock/getUserSubClassList.json"
        // );
        const { code, message, data } = await getUserSubClassList();
        const userSubClassList = _get(data, "userSubClassList") || [];
        if (code == 0) {
          state.userSubClassList = userSubClassList;
        } else {
          Toast(message || "获取用户约课记录失败!");
        }
      }

      //3.分页查询“历史”约课数据
      async function queryListFn(type) {
        try {
          state.loading = true;
          if (type == "refresh") {
            resetListData();
          } else {
            incrementPageIndex();
          }

          // const { code, message, data } = await import(
          //   "@/mock/getUserSubClassPastList.json"
          // );
          const params = {
            pageOffset: state.pageParams.pageOffset,
            pageLimit: state.pageParams.pageLimit
          };
          const { code, message, data } = await getUserSubClassPastList(params);
          state.loading = false;

          const userPastSubClassList = _get(data, "data.userSubClassList") || [];
          if (code == 0) {
            if (!userPastSubClassList.length) {
              state.finished = true;
              return;
            }
            state.userPastSubClassList = [...state.userPastSubClassList, ...userPastSubClassList];
          } else {
            Toast(message || "获取用户历史约课记录失败!");
          }
        } catch (err) {
          state.loading = false;
          console.log("queryListFn: ", err);
        }
      }

      //约课记录卡片被点击
      function handleItemCardClick({ classId, reportUrl }) {
        if (state.activeTabIndex == RecordState.notFinish) {
          router.push({
            name: "classReservationsBindDevices",
            params: {
              classId
            }
          });
        } else if (state.activeTabIndex == RecordState.finished) {
          jsBridge.invoke("openWebView", {
            targetUrl: reportUrl,
            refreshTicket: false,
            extraParame: "&icome-webview=v2"
          });
        }
      }

      //切换tab
      async function handleTabChangeFn(index) {
        if (index == RecordState.notFinish) {
          await queryPageDataFn();
        } else if (index == RecordState.finished) {
          await queryListFn("refresh");
        }
      }

      //跳转运动报告
      function jumpToSportsReportHandle() {
        router.push({
          path: "class-reservations-report"
        });
      }

      return {
        ...toRefs(state),
        handleItemCardClick,
        jumpToSportsReportHandle,
        handleTabChangeFn,
        queryPageDataFn,
        queryListFn
      };
    }
  });
</script>

<template>
  <div class="class-reservations-record">
    <full-loading :loading="coverLoading" />

    <div class="tipPanel"></div>

    <div class="contentPanel">
      <div class="contentNav">
        <van-tabs
          title-active-color="#4B7AFF"
          title-inactive-color="#737782"
          type="line"
          :border="true"
          v-model="activeTabIndex"
          @change="handleTabChangeFn"
        >
          <van-tab v-for="(item, index) in tabList" :title="item.title" :name="index" :key="item.id"> </van-tab>
        </van-tabs>
        <div class="reportBtn" @click="jumpToSportsReportHandle">
          <span>运动报告</span>
          <img
            src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/arrowRightBlue.png"
          />
        </div>
      </div>

      <div class="contentWrap">
        <!-- 约课记录 -->
        <template v-if="activeTabIndex == 0">
          <div class="tipText">
            提示：开课前25分钟至开课后10分钟可进行首次设备绑定，超时无法绑定设备（臂带、膝带），完成首次绑定后可随时换绑设备。
          </div>

          <template v-if="userSubClassList.length">
            <div class="item-card-list">
              <template v-for="item in userSubClassList">
                <div class="item-card-wrap" :key="item.id">
                  <div class="recordDate">
                    {{ item.startDateWeek + " " + item.startDateText }}
                  </div>
                  <RecordCard
                    @click="handleItemCardClick"
                    class="item-card-outer"
                    v-bind="item"
                    :classId="item.classId"
                    :userSubjectId="item.userSubject.id"
                    :type="activeTabIndex == 0 ? RecordState.notFinish : RecordState.finished"
                  />
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <van-empty
              class="custom-image"
              :class="{ moreHeight: true }"
              image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
              description="暂无约课记录~"
            />
          </template>
        </template>

        <!-- 历史约课记录 -->
        <template v-else-if="activeTabIndex == 1">
          <template v-if="userPastSubClassList.length">
            <div class="item-card-list">
              <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :immediate-check="false"
                @load="queryListFn"
                offset="50"
              >
                <template v-for="item in userPastSubClassList">
                  <div class="item-card-wrap" :key="item.id">
                    <div class="recordDate">
                      {{ item.startDateWeek + " " + item.startDateText }}
                    </div>
                    <RecordCard
                      @click="handleItemCardClick"
                      class="item-card-outer"
                      v-bind="item"
                      :classId="item.id"
                      :userSubjectId="item.userSubject.id"
                      :type="activeTabIndex == 0 ? RecordState.notFinish : RecordState.finished"
                    />
                  </div>
                </template>
              </van-list>
            </div>
          </template>
          <template v-else>
            <van-empty
              class="custom-image"
              :class="{ moreHeight: true }"
              image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
              description="暂无历史约课记录~"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .class-reservations-record {
    font-size: 0.3rem;
    min-height: 100%;
    background-color: #ffffff;
    padding-bottom: 0.5rem;

    .tipPanel {
      background-image: url("http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/class_bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 190px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .contentPanel {
      position: relative;
      transform: translateY(-80px);

      .contentNav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #e9eeff;
        height: 96px;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;

        ::v-deep .van-tabs--line .van-tabs__wrap {
          height: 70px;
        }

        ::v-deep .van-tabs {
          width: 500px;

          .van-tabs__nav {
            background-color: transparent;
          }
        }

        ::v-deep .van-tab--active {
          font-weight: 500;
          font-size: 34px;
        }

        ::v-deep .van-tabs__line {
          width: 32px;
          height: 8px;
          background: linear-gradient(270deg, rgba(130, 178, 255, 0.2) 0%, #4b7aff 100%);
          border-radius: 4px;
        }

        .reportBtn {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4d78ff;
          margin-right: 20px;

          img {
            width: 12px;
            height: 18px;
            margin-left: 4px;
          }
        }
      }

      .contentWrap {
        background-color: #ffffff;

        .tipText {
          width: 652px;
          font-size: 26px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          margin: 0 48px;
          padding: 24px 0;
          padding-bottom: 10px;
          text-align: left;
        }

        .item-card-list {
          .item-card-wrap {
            padding-top: 32px;

            .recordDate {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 236px;
              height: 52px;
              background: #4b7aff;
              border-radius: 0px 8px 8px 0px;
              font-size: 26px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
            }

            .item-card-outer {
              margin: 0 32px;
              margin-top: 24px;

              box-shadow: 0px 8px 40px 0px rgba(224, 221, 221, 0.5);
            }
          }
        }
      }
    }

    ::v-deep .van-empty {
      padding-top: 200px;
    }
  }
</style>
