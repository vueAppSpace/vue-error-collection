<!--
 * @Description: 每日任务
 * @Author: IFLS
 * @Date: 2022-11-16 09:53:32
 * @LastEditTime: 2023-03-23 17:37:07
-->
<script>
  import { defineComponent, toRefs, reactive, onMounted } from "@vue/composition-api";
  import { querydialyTask, queryTodayData } from "@/service/integralMall";
  import Tips from "@/components/Tips";
  import { translateTargetUrl } from "./taskType";
  export default defineComponent({
    components: {
      Tips
    },
    setup(_, context) {
      const { $router: router } = context.root;

      const state = reactive({
        taskInfo: {
          sumPointsByToday: 0,
          sumPerCompleteTaskByToday: 0
        },
        taskList: [],
        tips: {
          visible: false,
          item: {}
        }
      });

      const jumpTo = target => {
        if (typeof target === "function") {
          target();
        } else {
          router.push(target);
        }
      };

      // 查询任务信息: 今日赚取 今日完成任务
      const queryData = () => {
        queryTodayData().then(({ code, data, message }) => {
          if (code === 0) {
            state.taskInfo = data;
          } else {
            console.log("queryTodayData", message);
          }
        });
      };

      // 查询任务列表
      const queryList = () => {
        querydialyTask().then(({ code, data, message }) => {
          if (code === 0) {
            state.taskList = data.list || [];
          } else {
            console.log("querydialyTask", message);
          }
        });
      };

      // 任务提示
      const showTips = item => {
        state.tips.item = item;
        state.tips.visible = true;
      };

      // 任务跳转
      const finishTask = item => {
        const target = translateTargetUrl(item.eventType);
        jumpTo(target);
      };

      onMounted(() => {
        queryData();
        queryList();
      });

      return {
        ...toRefs(state),
        jumpTo,
        showTips,
        finishTask
      };
    }
  });
</script>

<template>
  <div class="bg-box">
    <div class="box-top">
      <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/coin.png" alt="" />
      <div>
        <div class="title">今日赚取</div>
        <div class="num">{{ taskInfo.sumPointsByToday }}</div>
      </div>
      <div>
        <div class="title">今日完成任务</div>
        <div class="num">{{ taskInfo.sumPerCompleteTaskByToday }}个</div>
      </div>
    </div>

    <ul>
      <li v-for="item in taskList" :key="item.dailyTasksId">
        <img :src="item.taskImage" alt="" />
        <div class="card-box">
          <div>
            <div class="title">{{ item.taskName }}</div>
            <div class="content">
              <span>积分+ {{ item.completeTaskPoints }}</span>
              <i>完成{{ item.completeTaskTimes }}/{{ item.taskTimes }}</i>
            </div>
          </div>
          <button
            class="check-btn"
            :disabled="item.isComplete === 1"
            @click="showTips(item)"
            v-track="{
              type: 'click',
              name: '健康新奥-点击打卡类型按钮',
              data: `{&quot;按钮名称&quot;: &quot;运动打卡&quot;, &quot;类型&quot;: &quot;每日任务&quot;, &quot;所属功能&quot;: &quot;我的&quot;, &quot;页面名称&quot;: &quot;每日任务页面&quot;}`
            }"
          >
            {{ item.isComplete === 1 ? "已完成" : "去完成" }}
          </button>
        </div>
      </li>
    </ul>

    <tips :value.sync="tips.visible" :duration="0" :exp="0" :title="tips.item.taskName">
      <div class="tip-box">{{ tips.item.remark }}</div>
      <button
        class="common-btn"
        @click="finishTask(tips.item)"
        v-track="{
          type: 'click',
          name: '健康新奥-点击打卡类型按钮',
          data: `{&quot;按钮名称&quot;: &quot;运动打卡&quot;, &quot;类型&quot;: &quot;每日任务&quot;, &quot;所属功能&quot;: &quot;我的&quot;, &quot;页面名称&quot;: &quot;每日任务弹窗&quot;}`
        }"
      >
        去完成
      </button>
    </tips>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../assets/less/btn.css";
  .bg-box {
    width: 100%;
    min-height: 100%;
    background-color: #f0f2f7;
    padding: 20px;
    background-image: url(https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/integral/bg%402x.png);
    background-repeat: no-repeat;
    background-size: contain;
    .box-top {
      display: flex;
      padding: 44px 0 0 28px;
      img {
        width: 84px;
        height: 84px;
      }
      .title {
        font-size: 26px;
        font-weight: 400;
        color: #fff;
      }
      .num {
        font-size: 44px;
        font-weight: 500;
        color: #fff;
      }
      > div {
        margin-left: 56px;
      }
      > div:last-child {
        margin-left: 128px;
      }
    }
    ul {
      margin-top: 48px;
      background: #fff;
      border-radius: 16px;
      li {
        display: flex;
        text-align: left;
        padding: 24px;
        height: 160px;
        img {
          flex: 1;
          width: 112px;
          height: 112px;
        }
        .card-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 100;
          .title {
            font-size: 30px;
            font-weight: 400;
            color: #1c1c1e;
          }
          .content {
            font-size: 26px;
            font-weight: 400;
            color: #f86e11;
            i {
              font-style: normal;
              color: #7c808b;
            }
          }
          div {
            line-height: 1.5;
            margin-left: 20px;
          }
          .check-btn {
            width: 140px;
            height: 64px;
            font-size: 24px;
            color: #fff;
            line-height: 64px;
            background: #4b7aff;
            border-radius: 44px;
            border: none;
          }
          .check-btn:active {
            filter: brightness(0.5);
            transition: 0.2s;
          }
          .check-btn:disabled {
            background: #b7cafd;
          }
        }
      }
    }
  }
  .tip-box {
    padding: 14px 48px 38px;
  }
</style>
