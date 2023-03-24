<!--
 * @Description: 积分抽奖主页
 * @Author: IFLS
 * @Date: 2022-11-16 09:53:14
 * @LastEditTime: 2023-03-23 17:37:23
-->
<script>
  import { defineComponent, toRefs, reactive, onMounted } from "@vue/composition-api";
  import "lattice-lottery/lib/lattice-lottery.css";
  import { LotteryList } from "lattice-lottery";
  import vueSeamlessScroll from "vue-seamless-scroll";
  import FullLoading from "@/components/Loading";
  import { Toast } from "vant";
  import {
    querySysConfig,
    queryLotteryList,
    luckyDraw,
    queryLotteryRecord,
    queryHealthPointByMemberCode
  } from "@/service/lottery";
  const imgUrl = "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/";

  export default defineComponent({
    components: {
      FullLoading,
      LotteryList,
      vueSeamlessScroll
    },
    setup(_, context) {
      const {
        refs,
        root: { $router: router, $route: route }
      } = context;

      const state = reactive({
        memberCode: localStorage.getItem("memberCode"),
        loading: false,
        list: [],
        running: false, // 抽奖是否运行中
        healthPoint: 0, // 健康积分
        costPoint: 0, // 抽奖花费积分
        showResult: false, // 抽奖结果弹窗
        resultData: {}, // 中奖结果
        winningList: [], // 获奖名单
        finished: false, // 中奖名单分页加载完成
        page: {
          pageIndex: 1,
          pageSize: 20,
          total: 0,
          pages: 0
        },
        classOption: {
          limitMoveNum: 5, // 开启无缝滚动的数据量
          singleHeight: 0, // 单步停顿
          step: 0.3, // 滚动速度(s)
          hoverStop: false, // 鼠标hover停止滚动
          openTouch: false // 移动端touch滚动
        }
      });

      const jumpTo = url => {
        if (state.running) return;
        router.push(url);
      };

      // 查询抽奖消耗积分数
      const queryLotteryPoint = () => {
        querySysConfig().then(({ code, data, message }) => {
          if (code === 0) {
            state.costPoint = data.paramValue || 0;
          } else {
            console.log("querySysConfig", message);
          }
        });
      };

      // 查询剩余积分
      const queryHealthPoint = (refresh = false) => {
        // 利用params传参刷新后失效特性 减少首次进入页面时调用接口
        const { points } = route.params;
        if (points && !refresh) {
          state.healthPoint = points;
        } else {
          const req = { memberCode: state.memberCode };
          queryHealthPointByMemberCode(req).then(({ code, data, message }) => {
            if (code === 0) {
              state.healthPoint = data.healthPoints || 0;
            } else {
              console.log("queryHealthPointByMemberCode", message);
            }
          });
        }
      };

      // 查询奖品列表
      const queryList = () => {
        state.loading = true;
        queryLotteryList().then(({ code, data, message }) => {
          state.loading = false;
          if (code === 0) {
            state.list = data.map(val => {
              const defalutImg = `${imgUrl}smile_face_tks.png`;
              return {
                id: val.id,
                label: val.prizeName,
                image: val.prizeImgUrl || defalutImg,
                type: val.prizeType,
                winRecordId: val.winRecordId
              };
            });
          } else {
            console.log("queryLotteryList", message);
          }
        });
      };

      // 查询中奖名单
      const queryWinnerRecord = req => {
        if (state.finished) return;
        queryLotteryRecord(req).then(({ code, data, message, page }) => {
          if (code === 0) {
            state.winningList = [...state.winningList, ...data];
            refs["seamlessScroll"] && refs["seamlessScroll"].reset();
            state.page = page;
            if (state.page.pageIndex < state.page.pages) {
              state.page.pageIndex++;
            } else {
              state.finished = true;
            }
          } else {
            console.log("queryLotteryRecord", message);
          }
        });
      };

      // 抽奖
      const onLucky = () => {
        const failTips = errText => Toast(errText || "抽奖失败, 请重试");
        return new Promise(async (resolve, reject) => {
          const { healthPoint, costPoint } = state;
          if (healthPoint < costPoint) {
            reject();
            return failTips("剩余积分不足, 无法抽奖");
          }
          try {
            const { code, data, message } = await luckyDraw();
            if (code === 0) {
              resolve(data);
            } else {
              console.log("luckyDraw", message);
              failTips(message);
              reject();
            }
          } catch (err) {
            console.log("luckyDraw-err", err);
            failTips();
            reject();
          }
        });
      };

      // 触发抽奖
      const onSubmit = async () => {
        if (state.running) return;
        state.running = true;
        try {
          const result = await onLucky();
          state.resultData = result;
          queryHealthPoint(true); // 刷新健康积分
          const list = [...state.list];
          const index = list.findIndex(val => val.id === result.id);
          refs["lottery"].go(index);
        } catch (err) {
          console.log(err);
          state.running = false;
        }
      };

      // 抽奖结束
      const onEnd = () => {
        const { prizeName } = state.resultData;
        setTimeout(() => {
          // 未中奖: 清空中奖id
          if (prizeName === "谢谢惠顾") {
            state.resultData = { id: null };
          }
          state.showResult = true;
          state.running = false;
        }, 500);
      };

      // 立即领取/再抽一次
      const onResultButton = val => {
        // 中奖情况
        if (val.id) {
          const url = val.prizeType === "1" ? "gift" : "express"; // 1-实物商品 2-虚拟商品
          jumpTo(`/lottery-${url}?id=${val.winRecordId}&type=${val.prizeType}&status=1`);
        } else {
          state.showResult = false;
        }
      };

      // 中奖列表滚动完成事件
      const onScrollEnd = () => {
        console.log("onScrollEnd");
        const req = { ...state.page };
        queryWinnerRecord(req);
      };

      onMounted(() => {
        queryLotteryPoint();
        queryHealthPoint();
        queryList();
        queryWinnerRecord(state.page);
      });

      return {
        ...toRefs(state),
        jumpTo,
        onSubmit,
        onEnd,
        onScrollEnd,
        onResultButton,
        imgUrl
      };
    }
  });
</script>

<template>
  <div class="box">
    <full-loading :loading="loading" />

    <div class="tag" @click="jumpTo('/lottery-list')">我的奖品</div>
    <img class="top-img" :src="`${imgUrl}bg1.png`" alt="" />
    <div class="notice-box">
      <van-notice-bar
        scrollable
        background="transparent"
        color="#fff"
        :text="`剩余积分：${healthPoint}，抽奖一次消耗${costPoint}积分`"
      />
    </div>
    <div class="lottery-box">
      <lottery-list v-if="list.length > 0" class="lottery" ref="lottery" @onend="onEnd" :list="list" btnText="" />
    </div>
    <div class="botton-box">
      <div @click="onSubmit">
        <img :class="{ active: running }" :src="`${imgUrl}button.png`" />
        <div class="expend-point">消耗{{ costPoint }}分</div>
      </div>
    </div>
    <div class="list-box">
      <div class="containter-box">
        <img class="title-img" :src="`${imgUrl}title.png`" alt="" />
        <vue-seamless-scroll
          v-if="winningList.length > 0"
          ref="seamlessScroll"
          :data="winningList"
          :class-option="classOption"
          class="scroll-warp"
          @ScrollEnd="onScrollEnd"
        >
          <ul>
            <li v-for="(item, index) in winningList" :key="index">
              <div>
                <span>{{ item.gmtCreate }}</span>
                <span>{{ item.userPhone }}</span>
              </div>
              <i>{{ item.prizeName }}</i>
            </li>
          </ul>
        </vue-seamless-scroll>

        <ul v-else>
          <li class="empty">暂无数据</li>
        </ul>
      </div>
    </div>

    <van-overlay :show="showResult">
      <div class="result-wrapper" @click.stop>
        <div class="result-box">
          <div class="result-title">{{ resultData.id ? "哇～中奖啦！" : "很遗憾，您未中奖" }}</div>
          <img class="result-img" :src="resultData.id ? resultData.prizeImgUrl : `${imgUrl}smile_face.png`" alt="" />
          <div class="result-content">
            <template v-if="resultData.id"> 恭喜您获得【{{ resultData.prizeName }}】 </template>
            <template v-else> 谢谢您的参与～ </template>
          </div>
          <div class="btn-img" @click="onResultButton(resultData)">{{ resultData.id ? "立即领取" : "再抽一次" }}</div>
          <div class="lottery-list" @click="jumpTo('/lottery-list')">我的奖品</div>
        </div>
        <van-icon name="close" @click="showResult = false" />
      </div>
    </van-overlay>
  </div>
</template>

<style lang="scss" scoped>
  .box {
    position: relative;
    min-height: 100%;
    max-height: calc(100vh - 46px);
    background-color: #fb4968;
    img {
      width: 100%;
      display: block;
    }
    .tag {
      position: absolute;
      top: 36px;
      right: 0;
      width: 131px;
      height: 58px;
      line-height: 58px;
      font-size: 25px;
      font-weight: 400;
      color: #fe2e40;
      background: linear-gradient(180deg, #ffffff 0%, #ffc5d1 100%);
      border-radius: 192px 0px 0px 192px;
    }
    .top-img {
      min-height: 320px;
    }
    .notice-box {
      margin-top: -1px;
      padding-left: 142px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/bg2.png")
        no-repeat;
      background-size: 100% 100%;
      text-align: center;
      .van-notice-bar {
        width: 500px;
      }
    }
    ::v-deep.lottery-box {
      min-height: 420px;
      margin-top: -1px;
      padding: 25px 0 32px 0;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/bg3.png")
        no-repeat;
      background-size: 100% 100%;
      .lottery {
        .prize__item {
          width: 173px;
          height: 133px;
          background: linear-gradient(180deg, #fcfbfb 0%, #f8f5f5 90%, #ff7843 100%);
          box-shadow: 0px 4px 8px 0px rgba(227, 10, 50, 1), inset 0px 2px 6px 0px rgba(251, 177, 149, 0.62);
          border-radius: 15px;
          border: none;
          span {
            width: 173px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 18px;
            font-weight: 400;
            color: #d83300;
          }
          img {
            width: 77px;
            height: 77px;
          }
          .prize__item__mask {
            width: 105%;
            height: 105%;
            background-image: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/lottery_mask.png");
            background-color: transparent;
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }
        .lattice__lottery__box {
          width: 550px;
        }
        .lottery__button {
          display: none;
        }
      }
    }
    .botton-box {
      position: relative;
      height: 98px;
      margin-top: -1px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/bg4.png")
        no-repeat;
      background-size: 100% 100%;
      img {
        display: inline-block;
        width: 371px;
        height: 83px;
      }
      .active {
        filter: brightness(0.5);
        transition: 0.1s;
      }
      > div {
        position: relative;
        .expend-point {
          position: absolute;
          right: 30%;
          top: 20%;
          font-size: 23px;
          font-weight: 400;
          color: #902803;
        }
      }
    }
    .list-box {
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/bg5.png")
        no-repeat;
      background-size: 100% 100%;
      padding: 65px 35px 35px;
      .containter-box {
        padding: 0 20px 20px;
        background: #e91139;
        box-shadow: inset 0px 4px 15px 0px rgba(213, 3, 29, 0.49);
        border-radius: 23px;
        border: 2px solid rgba(255, 244, 159, 0.64);
        .scroll-warp {
          overflow: hidden;
          height: 276px;
        }
        .title-img {
          width: 300px;
          margin: 23px auto;
        }
        ul {
          font-size: 27px;
          line-height: 2;
          color: #fff;
          li {
            display: flex;
            width: 100%;
            div {
              display: flex;
              justify-content: space-around;
              flex: 2;
            }
            i {
              flex: 1;
              width: 100%;
              font-style: normal;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .empty {
            height: 100%;
            justify-content: center;
            align-items: center;
            font-size: 27px;
            color: #fff;
          }
        }
      }
    }
    .result-wrapper {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 970px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/dialog.png")
        no-repeat;
      background-size: 100% 100%;
      .result-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-top: 340px;
        .result-title {
          padding-bottom: 10px;
          font-size: 46px;
          font-weight: 600;
          color: #f64544;
        }
        .result-img {
          width: 192px;
          height: 192px;
          margin: 19px auto;
        }
        .result-content {
          padding-bottom: 30px;
          font-size: 29px;
          color: #9b370a;
        }
        .btn-img {
          width: 386px;
          height: 109px;
          padding-top: 23px;
          margin: 0 auto;
          font-size: 31px;
          font-weight: 600;
          color: #902803;
          background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/lottery/btn.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .btn-img:active {
          filter: brightness(0.5);
          transition: 0.1s;
        }
        .lottery-list {
          text-decoration: underline;
          font-size: 25px;
          color: #902803;
        }
      }
      .van-icon {
        position: absolute;
        bottom: -120px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
      }
      .van-icon:active {
        filter: brightness(0.5);
        transition: 0.1s;
      }
    }
  }
</style>
