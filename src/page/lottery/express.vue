<!--
 * @Description: 奖品物流
 * @Author: IFLS
 * @Date: 2023-02-03 15:59:18
 * @LastEditTime: 2023-03-23 17:37:20
-->
<script>
  import { defineComponent, toRefs, reactive, onMounted } from "@vue/composition-api";
  import useToastGoback from "@/hooks/useToastGoback";
  import LotteryButton from "./compontents/LotteryButton";
  import Tips from "@/components/Tips";
  import FullLoading from "@/components/Loading";
  import Card from "./compontents/Card";
  import { titleInfoFn } from "./compontents/data";
  import { updateStatus, queryDetail } from "./compontents/ajaxFn";

  export default defineComponent({
    components: {
      LotteryButton,
      FullLoading,
      Tips,
      Card
    },
    setup(_, context) {
      const { $router: router, $route: route } = context.root;

      const state = reactive({
        loading: false,
        list: [], // 卡片信息
        titleInfo: [], // 顶部标题信息
        receiveDesc: "", // 虚拟商品描述
        confirmTips: false // 确认收货提示
      });

      const { toastAndGoback } = useToastGoback(router);

      const { id, status, type } = route.query;

      const jumpTo = url => router.push(url);

      // 获取顶部title文本
      const queryTitle = () => {
        const titleInfo = titleInfoFn(status);
        state.titleInfo = titleInfo;
      };

      // 展示确认框
      const showTips = () => (state.confirmTips = true);

      // 取消按钮
      const cancel = () => (state.confirmTips = false);

      // 确定按钮
      const confirm = () => {
        const req = { id, logisticsState: "2" };
        updateStatus(req).then(() => {
          cancel();
          toastAndGoback("操作成功");
        });
      };

      onMounted(async () => {
        state.loading = true;
        queryTitle();
        const [list, { receiveDesc }] = await queryDetail(id, status, type);
        state.list = list;
        state.receiveDesc = receiveDesc;
        state.loading = false;
      });

      return {
        ...toRefs(state),
        status,
        type,
        jumpTo,
        showTips,
        confirm,
        cancel
      };
    }
  });
</script>

<template>
  <div class="card">
    <full-loading :loading="loading" />

    <div v-if="type === '1'" :class="['card-top', { 'bg-zt': status === '5' }]">
      <div>{{ titleInfo[0] }}</div>
      <div>{{ titleInfo[1] }}</div>
    </div>
    <div class="card-containter">
      <card v-if="type === '1'" :list="list" />
      <card v-else>
        <span v-html="receiveDesc"></span>
      </card>
    </div>

    <lottery-button
      v-if="status === '4' || status === '5' || type === '2'"
      size="normal"
      :fixed="true"
      @click.native="showTips"
    >
      确认{{ type !== "1" ? "领取" : status === "5" ? "领取" : "收货" }}
    </lottery-button>

    <tips :value.sync="confirmTips" :exp="0" title="提示">
      <div class="tip-box">您确认已经{{ titleInfo[2] }}奖品了吗？</div>
      <div class="btn-box">
        <lottery-button :type="'2'" size="normal" @click.native="cancel">取消</lottery-button>
        <lottery-button :type="'1'" size="noraml" @click.native="confirm">确认</lottery-button>
      </div>
    </tips>
  </div>
</template>

<style lang="scss" scoped>
  .card {
    min-height: 100%;
    .card-top {
      width: 100%;
      height: 179px;
      padding: 38px 0 0 46px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/card_bg.png");
      background-size: 100% 100%;
      text-align: left;
      color: #fff;
      :first-child {
        padding-bottom: 15px;
        font-size: 35px;
        font-weight: 500;
      }
      :last-child {
        font-size: 27px;
        font-weight: 400;
      }
    }
    .bg-zt {
      background-image: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/card_bg_zt.png");
    }
    .card-containter {
      padding: 0 33px;
    }
  }

  .tip-box {
    padding: 38px 0 58px;
  }
  .btn-box {
    display: flex;
    padding: 0 29px;
    justify-content: space-between;
    .bg-grey {
      margin-right: 48px;
    }
  }
</style>
