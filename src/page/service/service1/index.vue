<script>
  import { defineComponent, reactive, toRefs } from "@vue/composition-api";
  import services from "./data";
  import PanelTips from "@/components/PanelTips";
  import PanelList from "@/components/PanelList";
  import jumpToDanao from "@/utils/jumpToDanao";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    components: { PanelList, PanelTips },
    setup(_, ctx) {
      const { $router } = ctx.root;
      const router = useRouter($router);

      const state = reactive({
        services
      });

      const jumpTo = url => {
        if (!url) return console.error("服务-url配置异常", url);

        if (url.includes("http")) {
          window.location.href = url;
        } else if (url.split("/").length > 3) {
          // jsBridge.invoke("openWXMiniProgram", { appletId: state.appletName, path: url }); // 小程序跳转
        } else {
          router.push(url);
        }
      };

      // 卡片事件函数
      const eventFn = {
        运动健身: () => jumpToDanao(5, "index"),
        穴位按摩: () => jumpToDanao(5, "acupointIndex")
      };

      // 点击卡片: 默认调用上方事件函数 若无 跳转数据中的url
      const onClick = item => {
        const T = new Map(Object.entries(eventFn));
        const fn = T.get(item.name);
        fn ? fn(item) : jumpTo(item.url);
      };

      return {
        ...toRefs(state),
        onClick
      };
    }
  });
</script>

<template>
  <div class="page-box">
    <div class="common" v-for="item in services" :key="item.id">
      <div class="title-box">
        <h2>{{ item.title }}</h2>
        <span v-if="item.name" @click="onClick(item)">{{ item.name }}></span>
      </div>
      <ul>
        <li
          v-for="(type, index) in item.children"
          :key="type.name + index"
          @click="onClick(type)"
          v-track="{
            type: 'click',
            name: '健康新奥-服务-点击卡片',
            data: `{&quot;卡片名称&quot;: &quot;${type.name}&quot;, &quot;类别&quot;: &quot;${item.name}&quot;, &quot;所属模块&quot;: &quot;服务首页&quot;}`
          }"
        >
          <img :src="type.picture" alt="" />
          <span>{{ type.name }}</span>
        </li>
      </ul>
    </div>

    <panel-tips>健康服务随心挑!</panel-tips>
    <panel-list>
      <ul>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/service1.png" />
          报告解读服务
        </li>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/service2.png" />
          健康咨询服务
        </li>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/service3.png" />
          运动健身服务
        </li>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/service4.png" />
          七修养生服务
        </li>
        <li>
          <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/service5.png" />
          慢病管理服务
        </li>
        <li>
          <i></i>
          <i></i>
          <i></i>
        </li>
      </ul>
    </panel-list>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../../assets/less/btn.css";
  .page-box {
    padding: 20px;
    .banner {
      padding: 0;
      margin-bottom: 24px;
    }
    .card {
      height: 340px;
      border-radius: 16px;
      margin-bottom: 24px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 16px;
      }
    }
    .common {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      .title-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h2 {
          height: 50px;
          font-size: 36px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #1c1c1e;
          line-height: 50px;
          margin-bottom: 16px;
          text-align: left;
        }
        span {
          font-size: 28px;
          color: rgb(167, 165, 165);
        }
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 30%;
          height: 160px;
          margin-bottom: 8px;
          border-radius: 8px;
          position: relative;
          img {
            width: 212px;
            height: 160px;
            border-radius: 8px;
            object-fit: cover;
          }
          span {
            position: absolute;
            bottom: 0;
            width: 212px;
            height: 60px;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
            border-radius: 0px 0px 8px 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 40px;
          }
        }
      }
      ul::after {
        content: "";
        width: 30%;
      }
    }
  }
  .contact-box {
    display: flex;
    justify-content: space-around;
    padding: 0 37px 22px;
    .phone,
    .icome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 240px;
      background: linear-gradient(119deg, #f8f9ff 0%, #eef2ff 100%);
      box-shadow: 0px 4px 8px 0px rgba(226, 228, 247, 0.5);
      border-radius: 16px;
      border: 2px solid #e7eaff;
      img {
        width: 88px;
        height: 88px;
      }
      span {
        margin-top: 18px;
        font-size: 28px;
        font-weight: 500;
        color: #333;
      }
      em {
        font-style: normal;
        margin-top: 4px;
        font-size: 24px;
        color: #737782;
      }
    }
    .phone:active,
    .icome:active {
      transition: 0.2s;
      background: #eef2ff;
    }
  }
</style>
