<!--
 * @Description: 场地状态
 * @Author: WANGCHENGAE
 * @Date: 2022-12-1 11:00:30
 * @LastEditTime: 2023-03-23 17:32:16
-->

<template>
  <div class="equipment-card">
    <div>
      <img :src="imgUrl" />
    </div>
    <div class="right">
      <div class="topText">
        <div class="title">{{ title }}</div>
        <div class="desc">{{ description }}</div>
      </div>
      <div class="bottomBtns">
        <div class="labels">
          <template v-if="sportName !== SportNameMap.stereometer">
            <div class="label">
              空闲<span>{{ free }}</span>
            </div>
            <div class="label">
              在用<span>{{ using }}</span>
            </div>
          </template>
        </div>
        <div class="recordBtn" @click="handleClick">{{ recordBtnText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, toRefs } from "@vue/composition-api";
  import { SportType } from "@/utils/jumpToSportGym";

  const SportNameMap = {
    run: "跑步",
    elliptical: "椭圆机运动",
    cycling: "骑行",
    stereometer: "体测仪"
  };
  const prefix = "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/venueStatus";
  const ImgsMap = {
    [SportNameMap.run]: `${prefix}/a.png`,
    [SportNameMap.elliptical]: `${prefix}/b.png`,
    [SportNameMap.cycling]: `${prefix}/c.png`,
    [SportNameMap.stereometer]: `${prefix}/d.png`
  };

  export default defineComponent({
    props: {
      title: {
        type: String,
        default: ""
      },
      sportName: {
        type: String,
        default: ""
      },
      description: {
        type: String,
        default: ""
      },
      all: {
        type: String,
        default: "0"
      },
      free: {
        type: String,
        default: "0"
      },
      using: {
        type: String,
        default: "0"
      }
    },
    setup({ sportName, title }, context) {
      const { emit } = context;

      const state = reactive({
        SportNameMap: SportNameMap
      });

      const imgUrl = computed(() => ImgsMap[sportName]);
      const recordBtnText = computed(() => {
        return sportName === SportNameMap.stereometer ? "体测报告" : "运动历史";
      });

      const type = computed(() => {
        return sportName === SportNameMap.stereometer
          ? SportType["venuestatus-body_test"]
          : SportType["venuestatus-motion_recording"];
      });

      function handleClick() {
        emit("click", { type: type.value, sportName, title });
      }

      return {
        ...toRefs(state),
        handleClick,
        recordBtnText,
        imgUrl
      };
    }
  });
</script>

<style lang="scss" scoped>
  @import "../style/scss/variable.scss";
  @import "../style/scss/mixin.scss";

  .equipment-card {
    display: flex;
    justify-content: flex-start;
    font-family: PingFangSC-Regular, PingFang SC;

    img {
      width: 220px;
      height: 220px;
      display: block;
    }

    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      margin-left: 24px;

      .topText {
        text-align: left;
        .title {
          height: 42px;
          font-size: 30px;
          font-weight: 400;
          color: $primary-text-color;
          line-height: 42px;
        }

        .desc {
          font-size: 24px;
          font-weight: 400;
          color: $placeholder-text-color;
          line-height: 34px;
          margin-top: 3px;
          // @include overflow(3);
        }
      }

      .bottomBtns {
        display: flex;
        justify-content: space-between;
        align-self: stretch;
        align-items: center;

        .labels {
          display: flex;

          .label {
            width: 110px;
            height: 40px;
            background: #e7f7f2;
            border-radius: 8px;
            font-size: 22px;
            font-weight: 400;
            line-height: 40px;
            color: #16b57d;

            span {
              margin-left: 8px;
            }

            &:last-child {
              background: #fdf4e7;
              color: #f86e11;
              margin-left: 12px;
            }
          }
        }

        .recordBtn {
          width: 136px;
          height: 56px;
          background: #4b7aff;
          border-radius: 30px;
          font-size: 26px;
          font-weight: 400;
          color: #ffffff;
          line-height: 56px;
          font-family: PingFangSC-Regular, PingFang SC;
        }
      }
    }
  }
</style>
