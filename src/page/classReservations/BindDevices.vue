<!--
 * @Author: YanivWang YanivWang@outlook.com
 * @Date: 2023-03-02 15:25:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-31 15:51:52
 * @FilePath: \lk-xinaohealth-h5\src\page\classReservations\BindDevices.vue
 * @Description: 设备绑定
-->

<script>
  import { defineComponent, reactive, toRefs, onMounted, nextTick, computed } from "@vue/composition-api";
  import { Toast } from "vant";
  import _get from "lodash.get";
  import {
    isQucikQucik,
    isWeight,
    isBiDai,
    isXiDai,
    getWeightParam,
    getXiDaiParam,
    getBiDaiParam
  } from "@/utils/scanQRcodeUtil";
  import { jsBridge } from "@/utils/native/jsBridge";

  import { getErrorMessage } from "@/utils/error";

  import FullLoading from "@/components/Loading";
  import SubmitButton from "@/components/SubmitButton";

  import { bindWeight, bindSign, getBindDevices } from "@/service/classReservations";

  import { useScanQRcodeStore, storeToRefs } from "@/pinia";
  import { QucikQucikDeviceType, Status_msg_map, initDeivceList, NOT_IDENTIFY_QRCODE_TIP } from "./util/constant";
  import { isMobile } from "@/utils/native/deviceEnv";

  export default defineComponent({
    components: {
      FullLoading,
      SubmitButton
    },

    setup(_, context) {
      //console.log("classReservations bindDevices...");

      const { zgStatistics, $router: router, $route: route } = context.root;
      const isPc = !isMobile;

      const store = useScanQRcodeStore();
      const { tiZhiChenBindSuccessFlag } = storeToRefs(store);
      const { bindSignFn, bindWeightFn, setTiZhiChenBindSuccessFlag } = store;

      /**
       * 1.只有 classId，是从record页面进来的
       * 2.既有 classId, 又有 qrcode，从首页扫一扫逻辑进入
       */
      const { classId = "", qrcode = "" } = route.params || {};

      const state = reactive({
        classId,
        qrcode, //暂存本页扫码结果 | 路由传递的参数(从首页-扫一扫过来)

        //bussiness data
        bindDevicesList: [], //接口返回的绑定设备数据
        finalBindDevicesList: [], //处理后的绑定设备数据

        //遮罩层
        coverLoading: false
      });

      const bindDeviceBtnText = computed(() => {
        let text = "绑定设备";

        if ((state.bindDevicesList.length > 0 && state.bindDevicesList.length < 4) || tiZhiChenBindSuccessFlag.value) {
          text = "继续绑定设备";
        }

        if (
          state.bindDevicesList.length >= 4 ||
          (state.bindDevicesList.length === 3 && tiZhiChenBindSuccessFlag.value)
        ) {
          text = "更换设备";
        }

        return text;
      });

      //console.log("classId", state.classId);
      //console.log("qrcode", state.qrcode);

      onMounted(async () => {
        if (state.classId) {
          await queryPageDataFn();

          if (state.qrcode) {
            nextTick(async () => {
              await qrCodeProcess(state.qrcode);
            });
          }
        } else {
          Toast("课程id缺失!");
        }
      });

      //1.获取页面初始化所需全部数据
      async function queryPageDataFn() {
        state.coverLoading = true;
        try {
          await queryBindDevices();
          state.coverLoading = false;
        } catch (e) {
          state.coverLoading = false;
          Toast("获取已绑定设备列表失败!");
        }
      }

      //2.查询用户已经绑定的设备数据
      async function queryBindDevices() {
        // const { code, message, data } = await import(
        //   "@/mock/getBindDevices.json"
        // );
        const { code, message, data } = await getBindDevices({
          classId: state.classId
        });
        const bindDevicesList = _get(data, "bindList") || [];
        if (code == 0) {
          state.bindDevicesList = bindDevicesList;
          state.finalBindDevicesList = processBindDevicesList(bindDevicesList);
        } else {
          Toast(message || "获取已绑定设备列表失败!");
        }
      }

      //数据处理(不调接口)
      function processBindDevicesList(bindDevicesList) {
        const map = new Map();
        bindDevicesList.forEach((item, index) => {
          map.set(item.deviceType, item);
        });

        const tempDeivceList = JSON.parse(JSON.stringify(initDeivceList));
        const list = tempDeivceList.map(item => {
          const data = map.get(item.deviceType);
          if (data) {
            item.isBind = true;
            item.scanTime = dayjs(data.updateTime || data.createTime).format("YYYY-MM-DD HH:mm");

            if (QucikQucikDeviceType.tiZhiChen == item.deviceType) {
              item.bindedText = "已称重";
            } else {
              item.bindedText = "已绑定";
            }
          } else {
            //体测仪特殊处理
            if (QucikQucikDeviceType.tiZhiChen == item.deviceType && tiZhiChenBindSuccessFlag.value) {
              item.bindedText = "已扫描";
            }
          }

          //从首页扫一扫过来的逻辑 | 或者当前扫码
          if (QucikQucikDeviceType.leftXiDai == item.deviceType) {
            if (state.qrcode && isXiDai(state.qrcode)) {
              item.btnText = "佩戴在左膝";
            }

            if (item.isBind && state.qrcode && isXiDai(state.qrcode)) {
              item.btnText = "替换左膝";
            }
          } else if (QucikQucikDeviceType.rightXiDai == item.deviceType) {
            if (state.qrcode && isXiDai(state.qrcode)) {
              item.btnText = "佩戴在右膝";
            }

            if (item.isBind && state.qrcode && isXiDai(state.qrcode)) {
              item.btnText = "替换右膝";
            }
          }

          return { ...item, ...data };
        });

        return list;
      }

      //扫码
      async function onScancode() {
        if (!isPc) {
          let { qrcode } = await jsBridge.invoke("scanQRCode");

          //console.log("========== qrcode ==========");
          //console.log(qrcode);
          //console.log("========== qrcode ==========");

          //1. 快快二维码

          //1.1 臂带
          //qrcode = ('"deviceid":16061027,"url":"http://d.kuaikuaikeji.com/tiotaservice/Checkqrcode","classesId":0');

          //1.2 膝带
          //qrcode = "130030073";
          //qrcode = "130030088";

          //1.3 体测仪
          //qrcode = ("https://kifs-test.kuaikuaikeji.com/kifs-web/config/KIFS_SCAN?action=weight&uuid=7c80ce57c6104fdc9b23df4292bef613&gymId=318");

          //2. 统一二维码
          //qrcode = "https://t.uat.ennew.com/24UiTG";

          await qrCodeProcess(qrcode);
        } else {
          Toast("请至移动端扫码");
        }
      }

      async function qrCodeProcess(qrcode) {
        if (isQucikQucik(qrcode)) {
          state.qrcode = qrcode;

          if (isXiDai(state.qrcode)) {
            //刷新绑定列表(不调接口) 因此此时 qrcode 存在了
            state.finalBindDevicesList = processBindDevicesList(state.bindDevicesList);
          } else if (isWeight(state.qrcode)) {
            await handleBindWeight();
          } else if (isBiDai(state.qrcode)) {
            await handleBindBiDai();
          }
        } else {
          Toast(NOT_IDENTIFY_QRCODE_TIP);
        }
      }

      //处理臂带绑定
      async function handleBindBiDai() {
        try {
          const params = getBiDaiParam(state.qrcode);
          const { data } = (await bindSignFn(params)) || {};
          const { bindMsg, status } = data || {};

          //绑定成功，刷新绑定设备列表
          if (status == 1) {
            await queryBindDevices();
          }

          //清空qrcode
          state.qrcode = "";
          Toast(Status_msg_map[status] || bindMsg || Status_msg_map[999]);
        } catch (e) {
          //console.log("handleBindBiDai", e);
          Toast(getErrorMessage(e) || "系统异常!");
        }
      }

      //处理体脂称绑定
      async function handleBindWeight() {
        try {
          const params = getWeightParam(state.qrcode);
          const { data } = (await bindWeightFn(params)) || {};
          const { bindMsg, status } = data || {};

          //绑定成功，刷新绑定设备列表
          if (status == 1) {
            setTiZhiChenBindSuccessFlag(true); //暂存体脂称扫描状态
            await queryBindDevices();
          }

          //清空qrcode
          state.qrcode = "";
          Toast(bindMsg || Status_msg_map[999]);
        } catch (e) {
          //console.log("handleBindWeight", e);
          Toast(getErrorMessage(e) || "系统异常!");
        }
      }

      //用户点击选择左右膝带
      async function handleChooseXiDai(deviceType) {
        try {
          const params = getXiDaiParam(state.qrcode);
          params.deviceType = deviceType;

          const { data } = (await bindSignFn(params)) || {};
          const { bindMsg, status } = data || {};
          //绑定成功，刷新绑定设备列表
          if (status == 1) {
            await queryBindDevices();
          }

          //清空qrcode
          state.qrcode = "";
          //刷新绑定列表(不调接口) 因此此时 qrcode 不存在了
          state.finalBindDevicesList = processBindDevicesList(state.bindDevicesList);

          Toast(Status_msg_map[status] || bindMsg || Status_msg_map[999]);
        } catch (e) {
          //console.log("handleChooseXiDai", e);
          Toast(getErrorMessage(e) || "系统异常!");
        }
      }

      return {
        ...toRefs(state),
        tiZhiChenBindSuccessFlag,
        queryPageDataFn,
        onScancode,
        handleChooseXiDai,
        bindDeviceBtnText
      };
    }
  });
</script>

<template>
  <div class="class-reservations-record">
    <full-loading :loading="coverLoading" />

    <div class="tipPanel">
      <!-- tiZhiChenBindSuccessFlag: {{ tiZhiChenBindSuccessFlag }} -->
      <div class="title">欢迎参加动感团操</div>
      <div class="content">请在课前完成以下设备绑定</div>
    </div>

    <div class="contentPanel">
      <template v-if="finalBindDevicesList.length">
        <div class="item-card-list">
          <template v-for="(item, index) in finalBindDevicesList">
            <div class="item-card" :key="index">
              <img :src="item.url" />
              <div class="device">
                <div class="name">{{ item.name }}</div>
                <div class="state">{{ item.bindedText }}</div>
              </div>

              <template v-if="item.btnText">
                <div class="xiDaiBtn" @click="handleChooseXiDai(item.deviceType)">
                  {{ item.btnText }}
                </div>
              </template>
              <template v-else-if="item.isBind">
                <div class="bindedTip">
                  <div>{{ item.bindedTimeText }}:</div>
                  <div>{{ item.scanTime }}</div>
                  <div>{{ item.bindedTip }}</div>
                </div>
              </template>
              <template v-else>
                <div class="tip">
                  {{ item.tip }}
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <van-empty
          class="custom-image"
          :class="{ moreHeight: true }"
          image="http://lk-webfont.oss-cn-beijing.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
          description="您未绑定任何设备~"
        />
      </template>
    </div>

    <div class="bottomArea">
      <div class="tipText"> 提示：智能臂带、智能膝带至少绑定一个才可以在运动后获得运动报告哦。 </div>
      <SubmitButton :isActive="true" :isFixed="true" v-debounceFn="{ fn: onScancode, delay: 3000 }">{{
        bindDeviceBtnText
      }}</SubmitButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .class-reservations-record {
    font-size: 0.3rem;
    min-height: 100%;
    padding-bottom: 2.5rem;

    .tipPanel {
      background-image: url("http://lk-webfont.oss-cn-beijing.aliyuncs.com/web/xinao-health/images/classReservations/class_bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 200px;
      padding-left: 48px;
      text-align: left;
      padding-top: 48px;
      padding-left: 48px;

      .title {
        height: 44px;
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 44px;
      }

      .content {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 40px;
        margin-top: 8px;
      }
    }

    .contentPanel {
      position: relative;
      transform: translateY(-20px);
      background-color: #ffffff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;

      .item-card-list {
        padding-top: 70px;
        .item-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          margin-bottom: 65px;

          img {
            width: 140px;
            height: 140px;
          }

          .device {
            flex: 1;
            text-align: left;
            padding-left: 20px;
            .name {
              height: 42px;
              font-size: 30px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #1c1c1e;
              line-height: 42px;
            }

            .state {
              height: 36px;
              font-size: 26px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #f55858;
              line-height: 36px;
            }
          }

          .tip {
            width: 260px;
            height: 36px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 36px;
            text-align: right;
          }

          .bindedTip {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
          }

          .xiDaiBtn {
            width: 180px;
            height: 56px;
            background: #4b7aff;
            border-radius: 30px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    .bottomArea {
      background-color: #ffffff;
      height: 2.8rem;
      position: fixed;
      bottom: 0;
      width: 100%;
    }

    .tipText {
      width: 652px;
      height: 86px;
      font-size: 26px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #737782;
      line-height: 36px;
      text-align: left;
      margin: auto;
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 1.7rem;
    }

    ::v-deep .van-empty {
      padding-top: 200px;
    }
  }
</style>
