<!--
 * @Description: 领取奖品
 * @Author: IFLS
 * @Date: 2023-02-03 15:58:52
 * @LastEditTime: 2023-03-28 10:15:45
-->
<script>
  import { defineComponent, toRefs, reactive, onMounted } from "@vue/composition-api";
  import LotteryButton from "./compontents/LotteryButton";
  import Card from "./compontents/Card";
  import Tips from "@/components/Tips";
  import validator from "@/utils/validator";
  import { Toast } from "vant";
  import { updateStatus, queryDetail } from "./compontents/ajaxFn";
  import { useRouter, useRoute } from "@/hooks/useRouter";

  export default defineComponent({
    components: {
      LotteryButton,
      Tips,
      Card
    },
    beforeRouteEnter(to, from, next) {
      // 从奖品物流回到领取奖品时 自动触发回退
      if (to.path === "/lottery-gift" && from.path === "/lottery-express") {
        return window.history.go(-1);
      }
      next();
    },
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const state = reactive({
        active: 0,
        disabledSelf: false,
        disabledExpress: false,
        list: [], // 卡片列表
        selfLiftingChecked: false, // 确认自提check框
        selfLiftingTips: false, // 确认自提提示
        form: {
          receiveName: "", // 收货人
          receivePhone: "", // 联系电话
          receiveAddress: "" // 收货地址
        }
      });

      // type: 商品类型(1-实物 2-虚拟) status: 商品状态
      const { id, status, type } = route.value.query;

      const jumpTo = url => router.push(url);

      const onSubmit = () => {
        let req = { provideType: null, logisticsState: null, id };
        // 自提
        if (state.active === 0) {
          if (!state.selfLiftingChecked) {
            state.selfLiftingTips = true;
            return;
          }
          req.provideType = "2"; // 类型: 1-自提
          req.logisticsState = "5"; // 状态: 5-等待自提状态
        } else {
          // 快递
          const { receiveName, receivePhone, receiveAddress } = state.form;
          if (receiveName === "" || receiveAddress === "") {
            return Toast("请输入收货人和收货地址");
          }
          if (!validator.telephone(receivePhone)) {
            return Toast("请输入正确格式的电话");
          }
          req = {
            provideType: "1", // 类型: 1-邮寄 3-自动发放
            logisticsState: "3", // 状态: 3-待发货
            receiveName,
            receivePhone,
            receiveAddress,
            id
          };
        }
        updateStatus(req).then(() => {
          const url = `/lottery-express?id=${id}&status=${req.logisticsState}&type=${type}`;
          jumpTo(url);
        });
      };

      // 自提提示确认框
      const selfLifingConfirm = () => {
        state.selfLiftingChecked = true;
        state.selfLiftingTips = false;
      };

      // 切换tab
      const onTabsChange = val => {
        if (val === 0) {
          Object.assign(state.form, {
            receiveName: "",
            receivePhone: "",
            receiveAddress: ""
          });
        } else if (val === 1) {
          state.selfLiftingChecked = false;
        }
      };

      onMounted(async () => {
        const [list, { prizeProvideType }] = await queryDetail(id, status, "2");
        state.list = list;
        // 根据可获取奖品的状态 控制tab切换 禁用
        if (!prizeProvideType.includes("1")) {
          state.disabledExpress = true;
          state.active = 0;
        } else if (!prizeProvideType.includes("2")) {
          state.disabledSelf = true;
          state.active = 1;
        }
      });

      return {
        ...toRefs(state),
        jumpTo,
        onSubmit,
        selfLifingConfirm,
        onTabsChange
      };
    }
  });
</script>

<template>
  <div class="card">
    <h4>请选择领取方式：</h4>
    <van-tabs v-model="active" type="card" animated color="#4B7AFF" @click="onTabsChange">
      <van-tab title="自提" :disabled="disabledSelf">
        <card :list="list" />
        <van-checkbox v-model="selfLiftingChecked">确定自提</van-checkbox>
        <div class="checkbox-tips">提示：自提前请电话联系，确保奖品已备好</div>
      </van-tab>
      <van-tab title="快递邮寄" :disabled="disabledExpress">
        <div class="box-express">
          <div class="form-label">
            <span>收货人</span>
            <van-field class="text-input" v-model="form.receiveName" placeholder="请输入您的姓名" maxlength="15" />
          </div>
          <div class="form-label">
            <span>联系电话</span>
            <van-field class="text-input" v-model="form.receivePhone" type="tel" placeholder="请输入您的电话" />
          </div>
          <div class="form-label">
            <span class="textarea-label">收货地址</span>
            <van-field
              class="text-input"
              v-model="form.receiveAddress"
              type="textarea"
              placeholder="请输入您的收货地址"
              maxlength="30"
            />
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <lottery-button size="normal" :fixed="true" :type="'1'" @click.native="onSubmit" native-type="submit"
      >提交</lottery-button
    >

    <tips :value.sync="selfLiftingTips" :exp="0" title="提示">
      <div class="tips-content">自提前请电话联系，确保奖品已备好</div>
      <lottery-button :type="'1'" size="normal" @click.native="selfLifingConfirm">确认</lottery-button>
    </tips>
  </div>
</template>

<style lang="scss" scoped>
  .card {
    padding: 31px;
    min-height: 100%;
    text-align: left;
    h4 {
      font-size: 29px;
      font-weight: 500;
      color: #1c1c1e;
      padding-bottom: 38px;
    }
    ::v-deep.van-tabs__wrap {
      height: 84px;
      .van-tabs__nav {
        margin: 0;
      }
      .van-tabs__nav--card {
        height: 84px;
        border-radius: 42px;
      }
      .van-tab {
        border-radius: 42px;
        border: none;
      }
    }
    ::v-deep.van-checkbox__label {
      font-size: 28px;
      font-weight: 500;
      color: #1b1c1e;
    }
    .checkbox-tips {
      padding: 8px 0 0 54px;
      font-size: 27px;
      font-weight: 400;
      color: #565961;
    }

    .box-express {
      padding-top: 26px;
      .form-label {
        display: flex;
        font-size: 29px;
        font-weight: 400;
        text-align: left;
        color: #565961;
        span {
          display: flex;
          width: 160px;
          align-items: center;
        }
        .textarea-label {
          align-items: flex-start;
          padding-top: 38px;
        }
      }
      ::v-deep.text-input {
        padding: 12px;
        .van-field__control {
          background-color: #f5f5f5;
          border-radius: 16px;
          height: 92px;
          padding: 27px 0 27px 23px;
        }
        textarea.van-field__control {
          height: 150px;
        }
      }
      .van-cell::after {
        display: none;
      }
    }
  }
  .tips-content {
    padding: 0 0 30px;
  }
</style>
