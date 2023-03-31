<!--
 * @Description: 场地状态
 * @Author: WANGCHENGAE
 * @Date: 2022-12-1 11:00:30
 * @LastEditTime: 2023-03-31 14:08:46
-->
<script>
import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
import EquipmentCard from "@/components/EquipmentCard.vue";
import ChooseMenu from "@/components/ChooseMenu.vue";
import { Toast } from "vant";
import { getVenueList, getEquipmentList } from "@/service/venueStatus/index";
import { jumpToSportGym } from "@/utils/jumpToSportGym";

export default defineComponent({
  components: {
    EquipmentCard,
    ChooseMenu
  },

  props: {
    type: String
  },

  setup(_, context) {
    console.log("venueStatus...");

    const { zgStatistics } = context.root;
    const state = reactive({
      venueList: [],
      equipmentList: [],
      currentVenue: {},
      isShow: false,
      chooseIndex: 0 //默认选中item index
    });

    onMounted(async () => {
      queryVenueList();
    });

    watch(
      () => state.currentVenue.id,
      async id => {
        await queryEquipmentList(id);
      }
    );

    async function queryVenueList() {
      // const { code, message, data } = await import("@/mock/getVenueList.json");
      const { code, message, data } = await getVenueList();
      if (code === 0 && data && data.length) {
        state.venueList = data.map(item => {
          item.text = item.name;
          return item;
        });
        state.currentVenue = data[0];
      } else {
        Toast(message);
      }
    }

    async function queryEquipmentList(corpId) {
      // const { code, message, data } = await import(
      //   "@/mock/getEquipmentList.json"
      // );
      const { code, message, data } = await getEquipmentList({ corpId });
      if (code === 0 && data && data.length) {
        state.equipmentList = data;
      } else {
        Toast(message);
      }
    }

    function handleCardClick({ type, sportName, title }) {
      // zgStatistics("健康新奥-服务-点击运动记录", {
      //   器械名称: title,
      //   场地名称: state.currentVenue.name,
      //   所在页面类型: "场地状态"
      // });
      zgStatistics("健康新奥-运动-场地状态-点击卡片按钮", {
        按钮名称: "提测报告",
        场地名称: state.currentVenue.name,
        设备名称: sportName
      });
      jumpToSportGym({ type, sportName });
    }

    function handleItemChoose(chooseIndex) {
      zgStatistics("健康新奥-运动-点击确认切换场地", {
        原场地名称: state.currentVenue.name,
        现场地名称: state.venueList[chooseIndex].name,
      });
      state.currentVenue = state.venueList[chooseIndex];
      state.chooseIndex = chooseIndex;
    }

    return {
      ...toRefs(state),
      handleCardClick,
      handleItemChoose
    };
  }
});
</script>

<template>
  <div class="venue-status" v-if="venueList && venueList.length">
    <div class="wrapInner">
      <div class="header">
        <div class="greet" v-track="{
            type: 'click',
            name: '健康新奥-运动-点击切换场地',
            data: `{&quot;现在场地名称&quot;: &quot;${currentVenue.name}&quot;}`,
          }" @click="isShow = !isShow">
          <img
            src="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/classReservations/location_blue.png"
          />
          <span>{{ currentVenue.name }}></span>
        </div>
      </div>
      <div class="equipmentList">
        <template v-for="item in equipmentList">
          <EquipmentCard @click="handleCardClick" class="cardItem" v-bind="item" :key="item.id" />
        </template>
      </div>

      <ChooseMenu
        :columns="venueList"
        :isShow="isShow"
        :chooseIndex="chooseIndex"
        @close="isShow = !isShow"
        @chooseItem="handleItemChoose"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../style/scss/mixin.scss";
@import "../../style/scss/variable.scss";

.venue-status {
  padding: 0.34rem 0.32rem;
  font-size: 0.3rem;
  min-height: 100%;
  background-color: #f7f9ff;

  .wrapInner {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .greet {
        min-height: 50px;
        font-size: 33px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1c1c1e;
        display: flex;
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
          margin-left: 10px;
        }
      }
    }
    .equipmentList {
      margin-top: 24px;

      .cardItem {
        margin-bottom: 24px;
      }
    }
  }
}
</style>
