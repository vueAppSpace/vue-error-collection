<!--
 * @Description: 场地状态
 * @Author: WANGCHENGAE
 * @Date: 2022-12-1 11:00:30
 * @LastEditTime: 2023-03-23 17:32:11
-->

<template>
  <div>
    <van-popup
      :value="isShow"
      position="bottom"
      round
      :style="popupStyle"
      class="popup-box"
      :safe-area-inset-bottom="true"
      :close-on-click-overlay="false"
    >
      <div class="header">
        <span>{{ title }}</span>
        <img
          @click="closePanel"
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/common/popup-close.png"
        />
      </div>
      <div class="content">
        <van-picker
          ref="picker"
          :columns="columns"
          item-height="0.6rem"
          :visible-item-count="visibleItemCount"
          :default-index="chooseIndex"
        >
          <template slot="option" slot-scope="option">
            <div class="liWrapper">
              <span>{{ option.text }}</span>
              <i v-if="option.recommend == 1">推荐</i>
            </div>
          </template>
        </van-picker>
      </div>
      <div class="footer" @click="handleClick">{{ btnText }}</div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    props: {
      popupHeight: {
        type: String,
        default: ""
      },
      visibleItemCount: {
        type: Number,
        default: 4
      },

      isShow: {
        type: Boolean,
        default: false
      },

      title: {
        type: String,
        default: "请选择"
      },

      btnText: {
        type: String,
        default: "确定"
      },

      columns: {
        type: Array,
        default: () => []
      },

      //已经被选中的索引
      chooseIndex: {
        type: [String, Number],
        default: "" || 0
      }
    },

    computed: {
      popupStyle() {
        return {
          minHeight: this.popupHeight || "5.7rem",
          padding: "0.32rem 0.32rem 0.24rem",
          overflow: "hidden"
        };
      }
    },

    methods: {
      handleClick() {
        const choosedValue = this.$refs.picker.getValues() || [];
        if (
          choosedValue &&
          choosedValue.length
          // choosedValue.length &&
          // choosedValue[0].text != this.columns[this.chooseIndex].text
        ) {
          this.$emit(
            "chooseItem",
            this.columns.findIndex(item => item.text === choosedValue[0].text)
          );
        }

        this.closePanel();
      },

      closePanel() {
        this.$emit("close");
      }
    }
  };
</script>

<style lang="scss" scoped>
  .popup-box {
    .header {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 48px;
      position: relative;
      span {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #1e201e;
        line-height: 44px;
      }
      img {
        width: 40px;
        height: 40px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .content {
      min-height: 266px;
      padding: 0 36px;
      .van-picker {
        ::v-deep .van-picker-column__item {
          display: flex;
          align-items: center;
          padding: 0;
          &.van-picker-column__item--selected {
            background: #f2f4f8;
            border-radius: 8px;
          }

          .liWrapper {
            width: 100%;
            height: 100%;
            position: relative;
            text-align: center;
            line-height: 0.6rem;
            font-size: 30px;
          }

          i {
            width: 0.74rem;
            height: 0.36rem;
            background: #ff9c00;
            border-radius: 0.18rem 0.18rem 0.18rem 0;
            font-size: 0.24rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 0.36rem;
            font-style: normal;
            display: block;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(118%, -50%);
          }
        }
      }
    }
    .footer {
      height: 88px;
      background: #4b7aff;
      border-radius: 50px;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      width: calc(100% - 0.32rem * 2);
      bottom: 60px;
    }
  }
</style>
