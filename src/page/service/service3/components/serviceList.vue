<script>
  import { defineComponent, reactive, toRefs } from "@vue/composition-api";
  import { jumpToSportGym } from "@/utils/jumpToSportGym";
  import jumpToDanao from "@/utils/jumpToDanao";
  import { jsBridge } from "@/utils/native/jsBridge";
  import { isIcomeMobile, isMobile } from "@/utils/native/deviceEnv";
  import { healthBookingUrl } from "@/config/env";
  import { getCounselor, insertRecord } from "@/service/service";
  import Tips from "@/components/Tips";
  import { Toast } from "vant";
  import { useUserStore, storeToRefs, mapState } from "@/pinia";

  export default defineComponent({
    components: {
      Tips
    },
    emit: ["editService"],
    props: {
      list: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        default: ""
      },
      editFlag: {
        type: Boolean,
        default: false
      }
    },
    setup(props, ctx) {
      const { $router: router, zgStatistics } = ctx.root;

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const iconMap = {
        reduce: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service_reduce.png",
        add: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/service_add.png"
      };
      const state = reactive({
        userId: userInfo.value.phrId,
        appletName: "gh_8f2bf8571044", // 三疗小程序用户名
        phone: "400-7895158", // 咨询师电话
        tipsVisible: false // 健康咨询弹窗
      });

      function isIconShow(service) {
        if (this.editFlag) {
          if (this.type === "add" && service.added) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      }

      const zg = type => zgStatistics("健康新奥-健康咨询方式", { 类别: type });

      const jumpTo = ({ url, appletName }) => {
        if (!url) return console.error("服务-url配置异常", url);

        if (url.includes("http")) {
          window.location.href = url;
        } else if (url.split("/").length > 3) {
          if (!appletName) appletName = state.appletName;
          jsBridge.invoke("openWXMiniProgram", { appletId: appletName, path: url }); // 小程序跳转
        } else {
          router.push(url);
        }
      };

      // 拨打电话
      const jumpToPhone = () => {
        jsBridge.invoke("callPhone", { tel: state.phone });
        // 移动端点击拨打电话记录咨询师次数
        if (isMobile) {
          const req = {
            userId: state.userId,
            category: "2", // 1:icome聊天 2:电话
            consultantId: ""
          };
          insertRecord(req);
          zg("电话咨询");
        }
      };

      // 获取随机咨询师并跳转
      const jumpToConsultant = async () => {
        if (isIcomeMobile) {
          try {
            const { code, data } = await getCounselor();
            if (code === 0 && data) {
              if (data.userEmpNo) {
                jsBridge.invoke("openIcomeChat", { userId: data.userEmpNo });
                const req = {
                  userId: state.userId,
                  category: "1", // 1:icome聊天 2:电话
                  consultantId: data.id
                };
                insertRecord(req);
                zg("在线咨询");
              } else {
                Toast("暂无咨询师提供服务，请尝试拔打健康咨询电话！");
              }
            } else {
              console.log("getCounselor", data);
              Toast("咨询师获取失败 请重试");
            }
          } catch (err) {
            console.log("getCounselor-err", err);
            Toast("咨询师获取失败 请重试");
          }
        } else {
          Toast("请至移动端打开");
        }
      };

      // 点击卡片: 默认调用上方事件函数 若无 跳转数据中的url
      const onClick = item => {
        if (props.editFlag) return;
        const T = new Map(Object.entries(eventFn));
        const fn = T.get(item.name);
        fn ? fn(item) : jumpTo(item);
      };

      // 卡片事件函数
      const eventFn = {
        运动历史: () => jumpToSportGym({ type: 1 }),
        云健身: () => jumpToSportGym({ type: 7 }),
        运动课程: () => jumpToDanao(5, "index"),
        穴位按摩: () => jumpToDanao(5, "acupointIndex"),
        健康咨询: () => (state.tipsVisible = true),
        预约体检: () => {
          jsBridge.invoke("openWebView", {
            targetUrl: healthBookingUrl,
            refreshTicket: true,
            extraParame: "&icome-webview=v2"
          });
        }
      };

      return { iconMap, ...toRefs(state), isIconShow, jumpToPhone, jumpToConsultant, onClick };
    }
  });
</script>

<template>
  <div>
    <div class="service-list">
      <div class="service-item" v-for="(item, index) in list" :key="item.id" @click="onClick(item)">
        <img
          v-if="isIconShow(item)"
          class="edit-icon"
          :src="type === 'reduce' ? iconMap.reduce : iconMap.add"
          alt=""
          @click.stop="$emit('editService', item, type, index)"
        />
        <img class="service-img" :src="item.picture" alt="" />
        <div class="font-regular van-ellipsis">{{ item.name }}</div>
      </div>
    </div>

    <tips :value.sync="tipsVisible" :duration="0" :exp="0" title="请选择健康咨询方式">
      <div class="contact-box">
        <div class="phone" @click="jumpToPhone">
          <img
            src="data:image/png;base64,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"
            alt=""
          />
          <span>400健康服务</span>
          <em>8:00-17:00</em>
        </div>
        <div class="icome" @click="jumpToConsultant">
          <img
            src="data:image/png;base64,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"
            alt=""
          />
          <span>在线健康咨询师</span>
          <em>8:00-17:00</em>
        </div>
      </div>
    </tips>
  </div>
</template>

<style lang="scss" scoped>
  .service-list {
    display: flex;
    flex-wrap: wrap;
    padding: 24px 13px 0;
    .service-item {
      width: 166px;
      margin-bottom: 40px;
      position: relative;
      .service-img {
        display: block;
        width: 112px;
        height: 112px;
        border-radius: 50%;
        object-fit: cover;
        margin: 0 auto;
      }
      div {
        font-size: 26px;
        line-height: 36px;
        color: #1c1c1e;
        margin: 16px auto 0;
        width: 90%;
      }
      .edit-icon {
        position: absolute;
        right: 27px;
        top: -6px;
        width: 40px;
        height: 40px;
      }
    }
  }
  .contact-box {
    display: flex;
    justify-content: space-around;
    padding: 0 37px 22px;
    .phone,
    .icome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 240px;
      background: linear-gradient(119deg, #f8f9ff 0%, #eef2ff 100%);
      box-shadow: 0px 4px 8px 0px rgba(226, 228, 247, 0.5);
      border-radius: 16px;
      border: 2px solid #e7eaff;
      img {
        width: 88px;
        height: 88px;
      }
      span {
        margin-top: 18px;
        font-size: 28px;
        font-weight: 500;
        color: #333;
      }
      em {
        font-style: normal;
        margin-top: 4px;
        font-size: 24px;
        color: #737782;
      }
    }
    .phone:active,
    .icome:active {
      transition: 0.2s;
      background: #eef2ff;
    }
  }
</style>
