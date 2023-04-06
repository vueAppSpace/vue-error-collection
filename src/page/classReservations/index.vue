<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-02-08 17:03:37
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-04-06 17:58:34
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\index.vue
 * @Description: 动感团操
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import DateCard from "./components/DateCard.vue";
  import ClassCard from "./components/ClassCard.vue";
  import ChooseMenu from "@/components/ChooseMenu.vue";
  import { Toast } from "vant";
  import FullLoading from "@/components/Loading";
  import {
    getVenueList,
    getSubClassTable,
    queryNeedCompletedRequireInfo,
    subClass
  } from "@/service/classReservations/index";
  import _get from "lodash.get";
  import { formatDate } from "@/utils/commonFun";

  import { useClassReservationsStore, storeToRefs } from "@/pinia";
  import { getDefaultDateList } from "./util/commonFun";

  export default defineComponent({
    components: {
      ClassCard,
      DateCard,
      FullLoading,
      ChooseMenu
    },

    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      //从 fillInfo, class-reservations-record 返回,
      if (["/class-reservations-fill-info", "/class-reservations-record"].includes(fromPath)) {
        next(async vm => {
          //只需刷新课程数据
          await vm.querySubClassTableFn();
        });
      } else {
        //刷新整个页面数据
        //从service进入或者刷新当前页面
        next(async vm => {
          await vm.queryPageDataFn();
        });
      }
    },

    setup(_, context) {
      console.log("classReservations index...");

      const { zgStatistics, $router: router } = context.root;
      const state = reactive({
        dateList: [],
        //当前场馆
        gym: null, //当前场馆(预约课程中返回的场馆的详细信息，用于填充模板)
        classList: [],
        currenDateItem: null,
        currenClassItem: null,
        activeDateIndex: 0,
        activeClassIndex: 0,
        isShowDialog: false,
        formatReservationsTime: "",
        coverLoading: false,
        //场馆列表
        venueList: [],
        currentVenue: {}, //当前场馆(场馆列表中选中的那个场馆)
        chooseIndex: 0, //默认选中item index
        isShow: false
      });

      const store = useClassReservationsStore();
      const { isSubmitUserInfoFlag } = storeToRefs(store);
      const { resetSubmitUserInfoFlag } = store;

      function resetState(type) {
        state.dateList = getDefaultDateList();
        state.gym = null;
        state.classList = [];
        state.currenDateItem = null;
        state.currenClassItem = null;
        state.activeDateIndex = 0;
        state.activeClassIndex = 0;
        state.isShowDialog = false;
        state.formatReservationsTime = "";
        state.coverLoading = false;
        state.currentVenue = {};
        state.chooseIndex = 0;

        if (type !== "switchVenue") {
          state.isShow = false;
          state.venueList = [];
        }
      }

      //查询页面全部所需数据
      async function queryPageDataFn() {
        try {
          resetState();
          state.coverLoading = true;
          await queryVenueListFn();
          await querySubClassTableFn();
          state.coverLoading = false;
        } catch (e) {
          state.coverLoading = false;
          console.log(e);
        }
      }

      //查询场馆
      async function queryVenueListFn() {
        const { code, message, data } = await import("@/mock/getVenueList.json"); //to do
        //const { code, message, data } = await getVenueList();
        if (code === 0 && data && data.length) {
          state.venueList = data.map(item => {
            item.text = item.name;
            return item;
          });
          state.currentVenue = data[0];
        } else {
          Toast(message || "未查询到场馆信息!");
        }
      }

      //查询预约课程
      async function querySubClassTableFn() {
        // const { code, message, data } = await import("@/mock/getSubClassTable.json");
        const { code, message, data } = await getSubClassTable();
        // {gymId: state.currentVenue.id}//to do

        const dateList = _get(data, "classTable.dateList") || [];
        const gym = _get(data, "gym") || null;

        dateList.length && (state.dateList = dateList);
        gym && (state.gym = gym);

        //延用上次得 activeDateIndex(本页面已经keep-alive)
        state.currenDateItem = state.dateList[state.activeDateIndex];
        state.classList = state.currenDateItem.classList || [];

        //用户已经提交了 约课用户信息
        if (gym && isSubmitUserInfoFlag.value) {
          handleClassCardClick(state.activeClassIndex);
        }

        if (code !== 0) {
          console("获取课程表失败," + message);
        }
      }

      //切换日期
      function handleDateCardClick(index) {
        state.activeDateIndex = index;
        state.currenDateItem = state.dateList[state.activeDateIndex];
        state.classList = state.currenDateItem.classList || [];
      }

      //预约
      async function handleClassCardClick(index) {
        //重置
        resetSubmitUserInfoFlag();

        const toast = Toast.loading({
          duration: 0,
          forbidClick: true
        });

        const { code, message, data } = await queryNeedCompletedRequireInfo();
        toast.clear();
        if (code === 0 && data && data.hasCompleted) {
          //显示确认预约弹窗
          state.isShowDialog = true;

          state.activeClassIndex = index;
          state.currenClassItem = state.classList[state.activeClassIndex];
          state.formatReservationsTime = formatDate(new Date(state.currenDateItem.date)).slice(5);
        } else {
          //进入补全信息
          router.push({
            path: "class-reservations-fill-info"
          });
        }
      }

      //点击弹窗的确认预约按钮
      async function handleConfirmClick() {
        state.isShowDialog = false;

        const param = {
          classId: state.currenClassItem.id,
          userSubjectId: state.currenClassItem.userSubject.id
        };

        const { code, message, data } = await subClass(param);
        if (code === 0) {
          //约课成功，刷新当前页面
          await querySubClassTableFn();
        } else {
          Toast(message || "约课失败");
        }
      }

      function goToRecordClickHandle() {
        router.push({
          path: "class-reservations-record"
        });
      }

      //切换健身房
      async function handleItemChoose(chooseIndex) {
        if (state.chooseIndex !== chooseIndex) {
          resetState("switchVenue");
          state.currentVenue = state.venueList[chooseIndex];
          state.chooseIndex = chooseIndex;
          await querySubClassTableFn();
        }
      }

      return {
        ...toRefs(state),
        handleDateCardClick,
        handleClassCardClick,
        queryPageDataFn,
        querySubClassTableFn,
        handleConfirmClick,
        goToRecordClickHandle,
        handleItemChoose
      };
    }
  });
</script>

<template>
  <div class="class-reservations">
    <full-loading :loading="coverLoading" />

    <template v-if="dateList.length">
      <div class="topArea">
        <div class="header">
          <div class="greet" @click="isShow = !isShow">
            <img
              src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/location_blue.png"
            />
            <span>{{ currentVenue.name }}></span>
          </div>
          <div class="record" @click="goToRecordClickHandle">约课记录</div>
        </div>
        <div class="dateCard">
          <DateCard :activeIndex="activeDateIndex" @click="handleDateCardClick" :dateList="dateList" />
        </div>
      </div>
      <div class="item-card-list" v-if="classList && classList.length">
        <template v-for="(item, index) in classList">
          <ClassCard
            @click="handleClassCardClick"
            class="item-card-outer"
            v-bind="item"
            :index="index"
            :key="item.id"
          />
        </template>
      </div>
      <template v-else>
        <van-empty
          class="custom-image"
          :class="{ moreHeight: true }"
          image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
          description="暂无可预约课程~"
        />
      </template>
    </template>
    <template v-else>
      <van-empty
        :class="{ moreHeight: true }"
        image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
        description="暂无可预约课程~"
      />
    </template>

    <!-- 确认预约弹窗 -->
    <van-popup
      v-model="isShowDialog"
      position="center"
      closeable
      round
      :close-on-click-overlay="true"
      class="date-popup"
    >
      <div class="confirmForm" v-if="currenClassItem">
        <div class="title">【{{ currenClassItem.courseName }}】</div>
        <div class="content">
          <div>预约地址：{{ gym.address + " " + gym.name }}</div>
          <div>
            预约时间：{{ formatReservationsTime }}
            {{ currenClassItem.startDateText + "~" + currenClassItem.endDateText }}
          </div>
        </div>
        <div class="btnArea">
          <div @click="isShowDialog = false">我再想想</div>
          <div @click="handleConfirmClick">确认</div>
        </div>
        <div class="tip">温馨提示：预约成功后不可调整/取消</div>
      </div>
    </van-popup>

    <!-- 场馆切换菜单 -->
    <ChooseMenu
      :columns="venueList"
      :isShow="isShow"
      :chooseIndex="chooseIndex"
      @close="isShow = !isShow"
      @chooseItem="handleItemChoose"
    />
  </div>
</template>

<style lang="scss" scoped>
  .class-reservations {
    font-size: 0.3rem;
    min-height: 100%;
    background-color: #f7f9ff;
    padding-bottom: 60px;

    .topArea {
      background-color: #ffffff;
      padding-right: 0;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #ffffff;
        padding: 32px;
        padding-right: 0;

        .greet {
          min-height: 50px;
          font-size: 36px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #1c1c1e;
          display: flex;
          flex: 1;
          align-items: center;
          background: linear-gradient(270deg, rgba(130, 178, 255, 0) 0%, #aec1f4 100%);
          background-position: left bottom;
          background-size: 50% 8px;
          background-repeat: no-repeat;
          text-align: left;

          img {
            width: 36px;
            height: 36px;
          }

          span {
            margin-left: 6px;
          }
        }

        .record {
          width: 144px;
          height: 48px;
          background: #edf1ff;
          border-radius: 200px 0px 0px 200px;

          font-size: 26px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4b7aff;
          line-height: 48px;
        }
      }

      .dateCard {
        background-color: #ffffff;
        padding-bottom: 20px;
      }
    }

    ::v-deep .van-empty {
      padding-top: 200px;
    }

    .custom-image {
      padding-top: 140px;
    }

    .item-card-list {
      padding: 0 0.32rem;
      margin-top: 32px;

      .item-card-outer {
        margin-bottom: 24px;
      }
    }

    ::v-deep .van-popup__close-icon {
      font-size: 43px;
      top: 26px;
      right: 26px;
    }

    .confirmForm {
      background-image: url(http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/dialogBg.png);
      background-size: cover;
      padding: 50px 46px;
      text-align: center;

      .title {
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1b1c1e;
        margin-top: 26px;
      }

      .content {
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2b2c2f;
        line-height: 40px;
        margin-top: 50px;
        margin-bottom: 50px;

        & > div:last-child {
          margin-top: 16px;
        }
      }

      .btnArea {
        display: flex;
        justify-content: space-between;

        & > div {
          width: 260px;
          height: 90px;
          background: #ffffff;
          border-radius: 50px;
          border: 2px solid #4b7aff;
          line-height: 90px;
          color: #4b7aff;

          &:last-child {
            background: #4b7aff;
            color: #ffffff;
            margin-left: 40px;
          }
        }
      }

      .tip {
        margin-top: 24px;
        height: 48px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #f09918;
        line-height: 48px;
      }
    }
  }
</style>
