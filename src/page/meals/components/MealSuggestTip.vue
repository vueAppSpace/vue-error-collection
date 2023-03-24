<template>
  <div v-if="principlesQuota">
    <div class="meal-suggest-tip" @click="visible = true">
      <!-- :scrollable="true" -->
      <!--  -->
      <van-notice-bar
        background="#f3f7ff"
        color="#1C1C1E"
        left-icon="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/horn.png"
        :text="principlesQuota.principles_quota"
      />
      <!-- </van-notice-bar> -->
    </div>

    <tips :value.sync="visible" :duration="0" :exp="0" title="饮食原则解读">
      <div class="text_box" v-for="(item, index) in principlesQuota.principles_entry_explain">
        <span>{{ item.key }}: </span>{{ item.note }}
      </div>
    </tips>
  </div>
</template>

<script>
  import Tips from "@/components/Tips";

  export default {
    props: {
      principlesQuota: {
        type: Object
      }
    },
    data() {
      return {
        visible: false
      };
    },
    components: {
      Tips
    }
  };
</script>

<style lang="scss" scoped>
  .meal-suggest-tip {
    margin-top: 20px;
    ::v-deep.van-icon__image {
      width: 40px;
      height: 40px;
    }
  }
  .text_box {
    padding: 0 48px;
    font-size: 28px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1b1c1e;
    line-height: 40px;
    text-align: left;
    margin-bottom: 20px;
    span {
      font-weight: 550;
    }
  }
  .text_box:nth-last-child(1) {
    margin-bottom: 20px;
  }
</style>
