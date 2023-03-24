<template>
  <div class="question-box">
    <iframe :class="['iframe-class', { 'fix-old-device': fixOldDevice }]" :src="iframeUrl" frameborder="0"></iframe>
    <div class="homepage-box" v-if="$route.query.type == 2" @click="$router.replace('/health')">
      <div>
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAA0pJREFUWEftmE+IlWUUxn9PSZCEKOSijMQgEgQJolXowoVQmuNixpmYhamboI30hwhCx2hjIupCChT/IKhNKVaUkBsTdxLNKhlBaTEFUUJZpCTDE+fO+92+uXNn7vfdPzMD3bO7fO933989733O854j5nlonvPRFkDbK4EPgLWAgSvAe5JGW01Ay4C2twDHgYU1MH8Dr0r6tBXIpgFtx7u7gN1QPYlfgAeApQkqsjkk6f1mIZsCtP0wcAKI7GVxCHgLeBA4DOzIPfsE2CbpblnQ0oC2HwcuAM+nze4Dr0s6kt/c9hvAhwk4Hl0DNkv6uQxkKUDbzwGfA8vSJreBXkmX621q+yXgDLAoPf8J6JH0XVHIwoC2+9KxZmL4Adgk6eZMm9leBXwJrEjrSomnEKDtEMNQTgwXgVck/VEkE7YfBc4Da8qKZ0bAJIYoIf05kIMhBknjReCyNbYfAj4CtpcRz7SAdcTwTxLD0TJgtWttvwnsLSqeuoBJDKHUJ9IGvyUxfNsKXC6bG4DTOfGMJYVPEc8UQNu9wMmcM4QYXpZ0qx1wOch64tkq6bP8PpMApxHDgKQ77YTLQYbjnJtJPBXAJIZjwEAO5ADwdlkxlP0hSTwfh9Pk3j0bYgrnke3HUvHNnCHW7ZEUZWXWwva+ZJXZnuE8PQH4PfBsDUm/pOFZo5s4xfD18Ox8jARgKCisK4w8LgERcw0YJS3q5lgArgbWAX8BmeHPNeBrwCPAN1UVJ6/NjnWuAfuyctMFLCq0GpF0M1g0cdV1/+8M2u4B3kkFPzq5kbhSSfqiaCo7lkHbg8Cp3G27ehcABiVFT9IwOgl4A3g6EWRXsqfS51FJMXVoGJ0EjKt/NOtfSdoYJLa/Bl4ExiUtaEg31YvbV2Zsx38uYlhSpXexHY4UXaAlBXzD6GQGu4CV9Dd7WegecbVoTXRz2SwvpgbRFzSMDmUw5j3RTP03YbX9AnA1EV1KfXDDbq6NgDuBaNQi1ksKhkmAMde7niu6fwJReDOVTpfNrJ/5HfgxfedyYHF6IWyvSDyTWo57MTCQFJOzyTPqNFEI8iVFvrFDa/ZLikFoJepNFp5MY91whWisC03AWoSNU/o1efq7kmIoWol/AXaj5iSdoRs7AAAAAElFTkSuQmCC"
        />
        <div>健康日程</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { danaoQuestionUrl, danaoComprehensiveUrl, danaoConsulationUrl } from "@/config/env";
  export default {
    data() {
      return {
        iframeUrl: "",
        fixOldDevice: false
        // isPc: false,
      };
    },
    mounted() {
      // 修复ios11设备iframe高度100%不生效问题
      if (window.ic.isIOS) {
        const userAgent = navigator.userAgent.toLowerCase();
        let version = userAgent.match(/cpu iphone os (.*?) like mac os/);
        version = parseInt(version[1], 10);
        console.log("version", version);
        if (version <= 11) {
          this.fixOldDevice = true;
        }
      }

      // ! appkey 大小写不一致
      const phrId = window.localStorage.getItem("phrId");
      const appKey = "6KRoN5rng";
      let url = "";
      if (this.$route.query.type == 1) {
        // type 1 : 大脑问卷评估，对应服务模块
        // this.setTitle("健康服务");
        url = `${danaoQuestionUrl}?code=${this.$route.query.code}&userId=${phrId}&appkey=${appKey}&fr=zonghe`;
      } else if (this.$route.query.type == 2) {
        // type 2 : 大脑综合报告，对应 我的 模块 我的画像
        // this.setTitle("健康综合报告");
        url = `${danaoComprehensiveUrl}?userId=${phrId}&appKey=${appKey}`;
      } else if (this.$route.query.type == 3) {
        // this.setTitle("健康服务");
        url = `${danaoConsulationUrl}?mCode=${this.$route.query.code}&userId=${phrId}&appKey=${appKey}&fr=zonghe`;
      }

      this.iframeUrl = url;

      // if (!ic.isIOS && !ic.isAndroid) {
      //     this.isPc = true;
      // }
    },
    methods: {
      // setTitle(title) {
      //     if (window.ic) {
      //         ic.run({
      //             action: "webview.setTitle",
      //             params: { title },
      //         });
      //     }
      // },
    }
  };
</script>

<style lang="scss" scoped>
  .question-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .homepage-box {
      position: fixed;
      right: 0;
      top: 60%;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 152px;
      height: 120px;
      background: #4b7aff;
      box-shadow: 0px 4px 16px 0px rgba(47, 73, 145, 0.2);
      border-radius: 16px 0px 0px 16px;
      font-size: 26px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
  .iframe-class {
    width: 100%;
    height: 100%;
    pointer-events: unset !important;
  }
  .fix-old-device {
    height: calc(100vh - 40px);
  }
</style>
