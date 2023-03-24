<!--
 * @Description: 健康计划/健康档案
 * @Author: IFLS
 * @Date: 2022-11-15 14:28:07
 * @LastEditTime: 2023-03-23 17:41:00
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import iconData from "./iconData";
  import jumpToDanao from "@/utils/jumpToDanao";
  import { jumpToDanaoPretreat } from "@/utils/lifeEntropyMethod";
  import { jumpToSportGym } from "@/utils/jumpToSportGym";
  import { queryEmployeeList } from "@/service/mine";

  export default defineComponent({
    setup(_, context) {
      const { $router: router } = context.root;

      const state = reactive({
        active: 0,
        iconData
      });

      // 展示离退报告卡片
      const showRetirementCard = () => {
        const retirementCard = {
          name: "离退报告",
          url: "/retirement-report",
          picture: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/mine/icon/file/4.png"
        };
        state.iconData.forEach(val => {
          if (val.name === "健康档案") {
            val.children.push(retirementCard);
          }
        });
      };

      // 查询员工状态
      const queryIsEmployee = async () => {
        try {
          const req = {
            memberCode: localStorage.getItem("memberCode"),
            userEmpNo: localStorage.getItem("empNo"),
            status: 1
          };
          const { code, data, message } = await queryEmployeeList(req);

          if (code === 0) {
            if (data && data.length > 0) {
              const { dimissionStatus } = data[0];
              // dimissionStatus 离职状态 0-未发起  1-发起离职 2-撤销离职
              if (dimissionStatus == 1) {
                showRetirementCard();
              }
            } else {
              console.log("queryEmployeeListData", data);
            }
          } else {
            console.log("queryEmployeeListCode", message);
          }
        } catch (err) {
          console.log("queryEmployeeListErr", err);
        }
      };

      const jumpTo = url => {
        if (!url) return console.error("我的-url配置异常", url);

        if (url.includes("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      };

      // 事件函数: vue内跳转可直接在iconData中添加url参数
      const eventFn = {
        // 预约记录: () => jumpToSportGym({ type: 4 }),
        运动记录: () => jumpToDanao(2, "sportList"),
        三济健康报告: () => jumpToDanaoPretreat(2, "SJreport", router),
        三济健康档案: () => jumpToDanaoPretreat(4, "", router)
      };

      // 点击卡片: 默认调用上方事件函数 若无 跳转数据中的url
      const onClick = item => {
        const T = new Map(Object.entries(eventFn));
        const fn = T.get(item.name);
        fn ? fn(item) : jumpTo(item.url);
      };

      onMounted(queryIsEmployee);

      return {
        ...toRefs(state),
        onClick
      };
    }
  });
</script>

<template>
  <van-tabs v-model="active" animated>
    <van-tab v-for="items in iconData" :key="items.name" :title="items.name">
      <ul>
        <li
          v-for="item of items.children"
          :key="item.name"
          @click="onClick(item)"
          v-track="{
            type: 'click',
            name: '健康新奥-我的-点击卡片',
            data: `{&quot;按钮名称&quot;: &quot;${
              item.name
            }&quot;, &quot;位置&quot;: &quot;下方卡片&quot;, &quot;类型&quot;: &quot;${
              active === 0 ? '健康计划' : '健康档案'
            }&quot;}`
          }"
        >
          <img :src="item.picture" alt="" />
          <div>
            <div class="title">{{ item.name }}</div>
          </div>
        </li>
      </ul>
    </van-tab>
  </van-tabs>
</template>

<style lang="scss" scoped>
  ::v-deep.van-tabs {
    padding-top: 32px;
    padding-right: 20px;
    .van-tabs__nav {
      background-color: transparent;
    }
    .van-tabs__line {
      width: 32px;
      height: 8px;
      background: linear-gradient(270deg, rgba(130, 178, 255, 0.2) 0%, #4b7aff 100%);
      border-radius: 4px;
    }
    .van-tab {
      justify-content: start;
      flex: inherit;
      margin-right: 88px;
      .van-tab__text {
        font-size: 28px;
        font-weight: 400;
        color: #565961;
      }
    }
    .van-tab--active {
      .van-tab__text {
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #4b7aff;
      }
    }
    .van-tab__pane-wrapper {
      margin-top: 24px;
      background: #fff;
      border-radius: 16px;
      li {
        display: flex;
        padding: 32px 24px;
        width: 100%;
        height: 176px;
        border-radius: 16px;
        font-size: 26px;
        img {
          width: 112px;
          height: 112px;
        }
        div {
          display: flex;
          align-items: center;
          margin-left: 24px;
          .title {
            font-size: 30px;
            color: #1c1c1e;
            line-height: 88px;
          }
        }
      }
      li:active {
        transition: 0.2s;
        background: rgb(230, 229, 229);
      }
    }
  }
</style>
