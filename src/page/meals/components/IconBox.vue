<!--
 * @Description: 首页icon区
 * @Author: IFLS
 * @Date: 2022-11-03 10:07:31
 * @LastEditTime: 2023-04-18 15:32:37
-->
<script>
  import { defineComponent, ref, reactive, toRefs, onMounted } from "@vue/composition-api";
  import qrcodeDialog from "@/components/QRCodeDialog";
  import { jumpToDanaoPretreat } from "@/utils/lifeEntropyMethod";
  import { useScanQRcodeStore } from "@/pinia";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    components: {
      qrcodeDialog
    },
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const store = useScanQRcodeStore();
      const { scanCodeFn } = store;

      let QRCodeVisible = ref(false);

      const onCode = () => (QRCodeVisible.value = true);

      const onScancode = () => {
        scanCodeFn();
      };

      onMounted(() => {
        //try {
        // console.log(a);
        // } catch (err) {
        //   console.log("[try-catch]: 捕获到错误", err);
        //   //throw err;
        // }
      });

      const state = reactive({
        iconData: [
          {
            name: "三济健康报告",
            url: "data:image/png;base64,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",
            onClick: () => jumpToDanaoPretreat(2, "SJreport", router) // Toast('功能建设中 敬请期待')
          },
          {
            name: "二维码",
            url: "data:image/png;base64,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",
            onClick: onCode
          },
          {
            name: "扫一扫",
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAApFJREFUaEPtWr+L1EAUft+hJoZDtBA9sFSLlJnAsgha6Yna+aOxF2ut9A/QSmuxt/FHp3KnlYKsJzMpU3h2CqdYKIfErMo9CXgad/cyGc7E3dnZcuebN+9735vk5c2ALP/Bcn7kCE66wiMVDMNwWxAER5h5ZxVBZl71PO95r9f72kQgut3u9n6/fxjAjir7AD5nWfYsTdNvg7ghggU53/dfAIjrOM3MaZ7nnTRNv9TB18WEYTjr+/4SgLDOHGaWeZ4fGiQ5RDCO46PM/KSO0XUMgDNSygcmc3TYOI5PM/N9Ha48DuCYlPLpX/8NGhBCnCWiu4aGO1LKVyZzdFghRIeIXupwA+PnlFL3jAgy8xqAj6MWKvYggFtKqZuGjtSCCyEuMfPFjfYgM+8GMFMyZk6QiD4opfbW8qhlkBDiPRHtcQTLgR+xB52CLWfm7+VcihIN16LWp2gURfMAFtbzgJmXkyQ5+L/SsGrdKIpeAzhQ8vV4kiSLle/BX/WfLJVIl5t6z202aMV7kohuFHaKktHzvHiwLt6o2J4NgmCemd8ppZY260iT84uKB8C+LMsWR9XD7nuwyei3Ydsp2EaUm1zDKdhkdNuw7RQc+uK/wFvndtHc2pZ2W44zP4hXPtGKuo3vJsobKXjiCp8C6A4RVXa5TBwwxK4y0/nH1/Gw7jwjgiev8jIR7a9rvCHcm0fX/tSfujUcwXKErE/Rgqyw+SGjy/dxHDfag+NIQOeTI6iL0LiPOwXHXSGdf9OpYHH4WDSdiOjtvz4W00XcdNy46WR929D6xq/1rXtH0PQp0CDeHZ9N5fHZ1O3BabhGon1MAJici0DWX+Wy/jJekY9WX6fUbrgJA0zn9+CEiVTprvUK/gRjGMtIQu93BQAAAABJRU5ErkJggg==",
            onClick: onScancode
          }
        ]
      });
      return {
        QRCodeVisible,
        ...toRefs(state)
      };
    },
    methods: {
      onScancode() {
        this.err1();
        //this.err11();
        //this.err2();
        //this.err3();
        //this.err4();
        //this.err5();
        //this.err6(); //留给 全局 promise 异常捕获处理器
        //this.err7();
        //this.err8();
      },

      //err-collection ===>

      //错误收集案例:
      //案例一: 运行时错误 (✔)
      err1() {
        try {
          let a = undefined;
          console.log(a.b);
        } catch (err) {
          console.log("[try-catch]: err1捕获到错误>>>");

          console.log("name:", err.name);
          console.log("message:", err.message);
          console.log("stack:", err.stack);
          console.log("lineNumber:", err.lineNumber);
          console.log("columnNumber:", err.columnNumber);
          console.log("fileName:", err.fileName);

          throw err;
        }
      },

      err11() {
        try {
          console.log(abc);
        } catch (e) {
          console.log(e.name);
          console.log(e.message);
          console.error("try-catch: err2收集到错误,", err);
        }
      },

      //案例二: 语法错误 （❌） 语法错误无法捕获，再开发构建阶段就会被发现
      err2() {
        try {
          // let a = 123;
          // let a = 456;
        } catch (err) {
          console.error("try-catch: err2收集到错误,", err);
        }
      },

      //案例三: 异步错误 （❌）
      err3() {
        try {
          setTimeout(() => {
            let a = undefined;
            console.log(a.b);
          }, 1000);
        } catch (err) {
          console.error("try-catch: err3收集到错误,", err);
        }
      },

      //案例四: Promise 错误
      err4() {
        try {
          Promise.reject("网络错误>>>");
        } catch (err) {
          console.error("try-catch: err4收集到错误,", err);
        }
      },

      //案例五: Promise 错误捕获
      err5() {
        try {
          Promise.reject("网络错误>>>").catch(err => {
            console.error("捕获到的promise错误 err5, ", err);
          });
        } catch (err) {
          console.error("try-catch: err5收集到错误,", err);
        }
      },

      async makeRequest() {
        throw Error("请求接口错误>>>!!!");
      },

      //案例六: 捕获 async 错误
      err6() {
        try {
          makeRequest();
        } catch (err) {
          console.error("try-catch: err6收集到错误,", err);
        }
      },

      //案例七: 捕获 async 错误，加上 await
      async err7() {
        try {
          await this.makeRequest();
        } catch (err) {
          console.error("try-catch: err7收集到错误,", err);
        }
      }

      //案例八: 捕获 import chunk 的错误(导航到我的页面测试)
      // async function err8() {
      //   try {
      //     // const data = await import("./IconBoxData.json");
      //     const data = await import("./IconBoxData1.json");
      //     console.log("动态 import chunk", data);
      //   } catch (err) {
      //     console.error("try-catch: err8收集到错误,", err);
      //   }
      // }
    }
  });
</script>

<template>
  <div>
    <van-sticky>
      <ul>
        <li
          v-for="item of iconData"
          :key="item.name"
          @click="onScancode"
          v-track="{
            name: '健康新奥-健康-点击其他具体内容',
            data: `{&quot;频道&quot;: &quot;icon区&quot;, &quot;按钮名称&quot;: &quot;${item.name}&quot; }`
          }"
        >
          <img :src="item.url" alt="" />
          {{ item.name }}
        </li>
      </ul>
    </van-sticky>

    <qrcode-dialog :value.sync="QRCodeVisible" />
  </div>
</template>

<style lang="scss" scoped>
  ul {
    display: flex;
    justify-content: space-between;
    padding: 40px 32px 0px;
    font-size: 26px;
    font-weight: 400;
    color: #333333;
    /* border: 1px solid; */
    background-color: #ffffff;
    position: relative;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 212px;
      height: 152px;
      background: #ffffff;
      box-shadow: 0px 0px 16px 0px rgba(167, 169, 175, 0.3);
      border-radius: 16px;
      img {
        width: 56px;
        height: 56px;
        margin-bottom: 12px;
      }
    }
    li:active {
      filter: brightness(0.9);
      transition: 0.2s;
    }
  }
</style>
