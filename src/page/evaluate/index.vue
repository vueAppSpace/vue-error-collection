<!--
 * @Description: 健康评测
 * @Author: IFLS
 * @Date: 2022-06-10 14:27:24
 * @LastEditTime: 2023-03-23 17:35:53
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, onBeforeUnmount } from "@vue/composition-api";
  import { Toast } from "vant";
  import { queryAndSaveAnswer } from "@/service/evaluate";
  import FlipCard from "./components/FlipCard/index";
  import FullLoading from "@/components/Loading";
  import { formatTimeForBirth } from "@/utils/commonFun";
  import useFontSize from "@/hooks/useFontSize";
  import { evaluatePageMethodForLifeEntropy } from "@/utils/lifeEntropyMethod";

  export default defineComponent({
    components: {
      FlipCard,
      FullLoading
    },
    setup(_, { refs, root }) {
      const { $router: router, $route: route, zgStatistics } = root;

      const state = reactive({
        phrId: localStorage.getItem("phrId"),
        loading: false,
        index: 0, // 当前问题索引
        cardList: [], // 卡片列表
        cardInit: {
          visible: 3, // 折叠卡片显示张数
          currentPage: 0 // 起始页
        }
      });

      const {} = useFontSize("52px");

      const setSession = () => sessionStorage.setItem("isScroll", JSON.stringify(true));

      const queryAnswer = req => {
        return new Promise(resolve => {
          state.loading = true;
          queryAndSaveAnswer(req)
            .then(({ code, message, data }) => {
              if (code === 0) {
                // data为null时 无题  data.nextQuestionResult为null时 答题完成
                if (!data || !data.nextQuestionResult) {
                  state.loading = false;
                  return Toast({
                    type: "success",
                    message: "答题完成",
                    onClose: () => {
                      skip();
                    }
                  });
                }
                // 问题类型
                const { type } = data.nextQuestionResult.questionResult;
                // 类型为3时的扩展字段 其他类型时为null
                const expand = JSON.parse(data.nextQuestionResult.questionResult.expand);
                // const expand = { dataType: 'number', unit: 'kg', minValue: 2, maxValue: 150, defaultValue: 100 }
                // 设置v-model绑定值
                let active = type === "1" ? {} : type === "2" ? [] : 0;
                // 类型为3时 active值设为接口返回的默认值
                if (type === "3" && expand && expand.defaultValue) {
                  active = expand.defaultValue;
                }
                // 类型为3时 且扩展类型为date类型 默认给当前日期
                if (type === "3" && expand && expand.dataType && expand.dataType === "date") {
                  // 有默认时间
                  if (expand.defaultValue) {
                    active = new Date(expand.defaultValue);
                  } else {
                    // 无默认时间
                    active = new Date("1990/01/01");
                  }
                }
                delete data.nextQuestionResult.questionResult.expand;
                const { seqNo, optionResults, questionResult } = data.nextQuestionResult;
                const { inquiryNo } = data;
                const obj = {
                  seqNo,
                  inquiryNo,
                  optionResults,
                  active,
                  ...questionResult,
                  ...expand
                };
                state.cardList.push(obj);
                resolve();
              } else {
                console.log("queryAndSaveAnswer", message);
                // Toast(message)
              }
              state.loading = false;
            })
            .catch(() => (state.loading = false));
        });
      };

      //答题完成, 返回上一页(“跳过”按钮 1.0.15 版本被干掉了)
      const skip = () => {
        //生命熵逻辑
        const { forEntropy } = route.query;
        forEntropy && evaluatePageMethodForLifeEntropy();

        setSession();
        router.go(-1);
      };

      // 注意: 此处ref写法非标准vue3写法 为@vue/composition-api独有写法
      const prev = () => refs.flipcard.prev();

      const next = async () => {
        const currentIndex = refs.flipcard.temporaryData.currentPage;
        // 点击下一题时 是否有新题
        if (currentIndex + 1 === state.cardList.length) {
          const errorTips = () => Toast("请针对问题进行作答");
          const item = state.cardList[currentIndex];
          const { active } = state.cardList[currentIndex];
          const { type, dataType } = item;
          let [optionsCode, optionNames, answer] = [[], [], ""];

          // 单选
          if (type === "1") {
            if (Object.keys(active).length === 0) {
              return errorTips();
            }
            optionsCode.push(active.code);
            optionNames.push(active.name);
            // 多选
          } else if (type === "2") {
            if (active.length === 0) {
              return errorTips();
            }
            active.forEach(val => {
              optionsCode.push(val.code);
              optionNames.push(val.name);
            });
            // 填空
          } else if (type === "3") {
            if ([0, null, ""].includes(active)) {
              return errorTips();
            }
            answer = dataType === "date" ? formatTimeForBirth(active) : active;
            console.log("answer");
          } else {
            console.warn("问题type类型未知:", type);
            return false;
          }

          const req = {
            phrId: state.phrId,
            questionCode: item.code, // 问题Code
            seqNo: item.seqNo, // 初始化问卷获取的值
            inquiryNo: item.inquiryNo,
            optionsCode, // 问题选项Code
            optionNames, // 问题选项中文
            answer // 填空题类型时赋值些字段
          };

          // 获取新问题
          await queryAnswer(req);

          // 播放下一题动画
          refs.flipcard.next();

          // 禁用已作答题目
          for (let i = 0; i < currentIndex + 1; i++) {
            state.cardList[i].disabled = true;
          }
        } else {
          refs.flipcard.next();
        }
      };

      // 获取子组件问题索引
      const getIndex = index => (state.index = index);

      onMounted(() => {
        const { seqNo, inquiryNo } = route.query;
        const req = {
          phrId: state.phrId,
          questionCode: "",
          optionsCode: [],
          optionNames: [],
          answer: "",
          seqNo: seqNo || "",
          inquiryNo: inquiryNo || ""
        };
        queryAnswer(req);

        zgStatistics("健康新奥-问答-进入页面", { 页面名称: "健康测评" });
      });

      onBeforeUnmount(setSession);

      return {
        ...toRefs(state),
        prev,
        next,
        skip,
        getIndex
      };
    }
  });
</script>

<template>
  <div class="containter">
    <full-loading :loading="loading" />

    <h4>
      为了更好地为您制定个性化健康方案，<br />
      请回答问题
    </h4>
    <div class="flipcard-wrapper">
      <flip-card ref="flipcard" :pages.sync="cardList" :card-init="cardInit" @index="getIndex" />
    </div>
    <div class="flipcard-controls">
      <!-- <button
                class="common-btn btn btn-white"
                @click="skip"
                v-track='{ name: "健康新奥-点击问答按钮", data: `{"按钮名称": "跳过", "页面名称": "健康问答", "类型": "健康问答"}`}'
            >
                跳过
            </button> -->
      <button
        v-if="index !== 0"
        class="common-btn btn btn-white"
        @click="prev"
        v-track="{
          name: '健康新奥-点击问答按钮',
          data: `{&quot;按钮名称&quot;: &quot;返回&quot;, &quot;页面名称&quot;: &quot;健康问答&quot;, &quot;类型&quot;: &quot;健康问答&quot;}`
        }"
      >
        上一题
      </button>
      <button
        class="common-btn btn"
        @click="next"
        v-track="{
          name: '健康新奥-点击问答按钮',
          data: `{&quot;按钮名称&quot;: &quot;提交&quot;, &quot;页面名称&quot;: &quot;健康问答&quot;, &quot;类型&quot;: &quot;健康问答&quot;}`
        }"
      >
        下一题
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../assets/less/btn.css";
  @import "./index.scss";
</style>
