<!--
 * @Description: 预约挂号
 * @Author: IFLS
 * @Date: 2022-11-22 16:44:54
 * @LastEditTime: 2023-03-23 17:41:49
-->
<script>
  import { defineComponent, toRefs, reactive } from "@vue/composition-api";
  import Tips from "@/components/Tips";
  import { jsBridge } from "@/utils/native/jsBridge";
  export default defineComponent({
    components: {
      Tips
    },
    setup(_, context) {
      const { $router: router, zgStatistics } = context.root;

      const state = reactive({
        phone: "18031683669", // 爱德堡预约电话
        appletName: "gh_8f2bf8571044", // 三疗小程序用户名
        path: "/appointment/pages/appointmentCenter/appointmentCenter", // 三疗小程序预约挂号地址
        appointmentVisible: false // 预约挂号弹窗
      });

      const jumpTo = url => router.push(url);

      const zg = type => {
        zgStatistics("健康新奥-服务-预约挂号", {
          所属功能: "健康服务",
          所属模块: "预约挂号",
          所属位置: "健康服务预约挂号",
          一级菜单: type
        });
      };

      const showTip = () => (state.appointmentVisible = true);

      const hiddenTip = () => (state.appointmentVisible = false);

      // 跳转微信小程序
      const jumpToWXMiniProgram = () => {
        const { appletName, path } = state;
        zg("三疗健康中心");
        hiddenTip();
        jsBridge.invoke("openWXMiniProgram", { appletId: appletName, path });
      };

      // 拨打电话
      const makePhoneCall = () => {
        zg("廊坊爱德堡医院");
        jsBridge.invoke("callPhone", { tel: state.phone });
      };

      return {
        ...toRefs(state),
        jumpTo,
        jumpToWXMiniProgram,
        makePhoneCall,
        showTip,
        hiddenTip
      };
    }
  });
</script>

<template>
  <div class="box">
    <div class="card">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/center.png" alt="" />
      <div class="card-box">
        <div class="title">三疗健康中心</div>
        <div class="check-btn" @click="showTip">立即预约</div>
      </div>
    </div>

    <div class="card">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/hospital.png" alt="" />
      <div class="card-box">
        <div class="title">廊坊爱德堡医院</div>
        <div class="check-btn" @click="makePhoneCall">立即预约</div>
      </div>
    </div>

    <tips :value.sync="appointmentVisible" :duration="0" :exp="0" title="亲爱的，温馨提示">
      <div class="tip-box">即将进入三疗健康小程序，进入后请按提示进行操作！</div>
      <div class="btn-box">
        <button class="common-btn btn cancel-btn" @click="hiddenTip">取消</button>
        <button class="common-btn btn" @click="jumpToWXMiniProgram">确定</button>
      </div>
    </tips>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../../assets/less/btn.css";
  @import "../../../assets/less/checkBtn.css";
  .box {
    padding: 20px;
    min-height: 100%;
    background-color: #f0f2f7;
    .card {
      margin-bottom: 24px;
      border-radius: 16px;
      background: #fff;
      img {
        width: 100%;
        height: 280px;
      }
      .card-box {
        display: flex;
        justify-content: space-between;
        padding: 10px 24px 24px;
        .title {
          font-size: 30px;
          font-weight: 500;
          color: #333;
        }
        .check-btn {
          position: inherit;
          width: 164px;
          height: 48px;
        }
      }
    }
  }
  .tip-box {
    padding: 14px 48px 38px;
  }
  .btn-box {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    .btn {
      width: 40%;
    }
    .cancel-btn {
      background: #d0d0db;
    }
    .cancel-btn:active {
      background: #919198;
      transition: 0.2s;
    }
  }
</style>
