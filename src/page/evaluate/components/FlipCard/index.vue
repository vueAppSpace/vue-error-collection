<!--
 * @Description: 滑动卡片组件
 * @Author: IFLS
 * @Date: 2022-06-10 15:52:50
 * @LastEditTime: 2023-03-23 17:35:49
-->
<script>
  import { defineComponent, reactive, /* onMounted, onBeforeUnmount, */ toRefs, watch } from "@vue/composition-api";
  import ScrollRuler from "@/components/ScrollRuler.vue";
  import useComputed from "./computed";
  import useProfileComputed from "@/page/profile/computed.js";
  import useMethods from "./methods";
  import detectPrefixes from "./detectPrefixes";

  export default defineComponent({
    components: {
      ScrollRuler
    },
    props: {
      cardInit: {
        type: Object,
        default: []
      },
      pages: {
        type: Array,
        default: {}
      }
    },
    setup(props, context) {
      const {
        root: { $nextTick, $el },
        parent,
        refs,
        emit
      } = context;

      const state = reactive({
        basicdata: {
          start: {},
          end: {}
        },
        temporaryData: {
          prefixes: detectPrefixes(),
          offsetY: "",
          poswidth: 0,
          posheight: 0,
          lastPosWidth: "",
          lastPosHeight: "",
          lastZindex: "",
          rotate: 0,
          lastRotate: 0,
          visible: props.cardInit.visible || 3,
          tracking: false,
          animation: false,
          currentPage: props.cardInit.currentPage || 0,
          opacity: 1,
          lastOpacity: 0,
          swipe: false,
          zIndex: 10
        },
        minDate: new Date("1900/01/01"),
        maxDate: new Date()
      });

      const { offsetRatio, offsetWidthRatio } = useComputed(state, $el);

      const { formateTime } = useProfileComputed();

      const { rotateDirectionFn, angleRatioFn, nextTickFn, inStackFn, preventDefaultFn } = useMethods(
        props,
        state,
        $nextTick,
        $el
      );

      // 回传给父组件当前问题索引
      watch(
        () => state.temporaryData.currentPage,
        newVal => emit("index", newVal)
      );

      const touchstart = e => {
        // 处理单选选项
        // const [idx, index] = [e.target.getAttribute('data-idx'), e.target.getAttribute('data-index')]
        // if (idx) {
        //     const pages = [...props.pages]
        //     // 重置其他索引
        //     pages[index].answer.forEach(item => (item.active = -1))
        //     // 赋值当前索引
        //     pages[index].answer[idx].active = idx
        //     emit('update:pages', pages)
        //     return
        // }

        if (state.temporaryData.tracking) {
          return;
        }

        // 是否为touch
        if (e.type === "touchstart") {
          if (e.touches.length > 1) {
            state.temporaryData.tracking = false;
            return;
          } else {
            // 记录起始位置
            state.basicdata.start.t = new Date().getTime();
            state.basicdata.start.x = e.targetTouches[0].clientX;
            state.basicdata.start.y = e.targetTouches[0].clientY;
            state.basicdata.end.x = e.targetTouches[0].clientX;
            state.basicdata.end.y = e.targetTouches[0].clientY;
            // offsetY在touch事件中没有，只能自己计算
            state.temporaryData.offsetY = e.targetTouches[0].pageY - $el.offsetParent.offsetTop;
          }
        } else {
          // pc操作
          state.basicdata.start.t = new Date().getTime();
          state.basicdata.start.x = e.clientX;
          state.basicdata.start.y = e.clientY;
          state.basicdata.end.x = e.clientX;
          state.basicdata.end.y = e.clientY;
          state.temporaryData.offsetY = e.offsetY;
        }
        state.temporaryData.tracking = true;
        state.temporaryData.animation = false;
      };

      const touchmove = e => {
        // 记录滑动位置
        if (state.temporaryData.tracking && !state.temporaryData.animation) {
          if (e.type === "touchmove") {
            e.preventDefault();
            state.basicdata.end.x = e.targetTouches[0].clientX;
            state.basicdata.end.y = e.targetTouches[0].clientY;
          } else {
            e.preventDefault();
            state.basicdata.end.x = e.clientX;
            state.basicdata.end.y = e.clientY;
          }
          // 计算滑动值
          state.temporaryData.poswidth = state.basicdata.end.x - state.basicdata.start.x;
          state.temporaryData.posheight = state.basicdata.end.y - state.basicdata.start.y;
          const rotateDirection = rotateDirectionFn();
          const angleRatio = angleRatioFn();
          state.temporaryData.rotate = rotateDirection * offsetWidthRatio.value * 15 * angleRatio;
        }
      };

      const touchend = e => {
        state.temporaryData.tracking = false;
        state.temporaryData.animation = true;
        // 滑动结束，触发判断
        // 判断划出面积是否大于0.4
        if (offsetRatio.value >= 0.4) {
          // 计算划出后最终位置
          const ratio = Math.abs(state.temporaryData.posheight / state.temporaryData.poswidth);
          state.temporaryData.poswidth =
            state.temporaryData.poswidth >= 0 ? state.temporaryData.poswidth + 200 : state.temporaryData.poswidth - 200;
          state.temporaryData.posheight =
            state.temporaryData.posheight >= 0
              ? Math.abs(state.temporaryData.poswidth * ratio)
              : -Math.abs(state.temporaryData.poswidth * ratio);
          state.temporaryData.opacity = 0;
          state.temporaryData.swipe = true;
          nextTickFn();
          // 不满足条件则滑入
        } else {
          state.temporaryData.poswidth = 0;
          state.temporaryData.posheight = 0;
          state.temporaryData.swipe = false;
          state.temporaryData.rotate = 0;
        }
      };

      const onTransitionEnd = index => {
        const lastPage =
          state.temporaryData.currentPage === 0 ? props.pages.length - 1 : state.temporaryData.currentPage - 1;
        // dom发生变化正在执行的动画滑动序列已经变为上一层
        if (state.temporaryData.swipe && index === lastPage) {
          state.temporaryData.animation = true;
          state.temporaryData.lastPosWidth = 0;
          state.temporaryData.lastPosHeight = 0;
          state.temporaryData.lastOpacity = 0;
          state.temporaryData.lastRotate = 0;
          state.temporaryData.swipe = false;
          state.temporaryData.lastZindex = -1;
        }
      };

      const prev = () => {
        state.temporaryData.tracking = false;
        state.temporaryData.animation = true;
        // 计算划出后最终位置
        const width = $el.offsetWidth;
        state.temporaryData.poswidth = -width;
        state.temporaryData.posheight = 0;
        state.temporaryData.opacity = 0;
        state.temporaryData.rotate = "-3";
        state.temporaryData.swipe = true;
        nextTickFn("prev");
      };

      const next = () => {
        state.temporaryData.tracking = false;
        state.temporaryData.animation = true;
        // 计算划出后最终位置
        const width = $el.offsetWidth;
        state.temporaryData.poswidth = width;
        state.temporaryData.posheight = 0;
        state.temporaryData.opacity = 0;
        state.temporaryData.rotate = "3";
        state.temporaryData.swipe = true;
        nextTickFn("next");
      };

      // 非首页样式切换
      const transform = index => {
        const currentPage = state.temporaryData.currentPage;
        const length = props.pages.length;
        const lastPage = currentPage === 0 ? props.pages.length - 1 : currentPage - 1;
        let style = {};
        const visible = state.temporaryData.visible;
        if (index === state.temporaryData.currentPage) {
          return;
        }
        if (inStackFn(index, currentPage)) {
          const perIndex = index - currentPage > 0 ? index - currentPage : index - currentPage + length;
          style["opacity"] = "0.7";
          style["transform"] = "translate3D(0,0," + -1 * 40 * (perIndex - offsetRatio.value) + "px" + ")";
          style["zIndex"] = visible - perIndex;
          if (!state.temporaryData.tracking) {
            style[state.temporaryData.prefixes.transition + "TimingFunction"] = "ease";
            style[state.temporaryData.prefixes.transition + "Duration"] = 300 + "ms";
          }
        } else if (index === lastPage) {
          style["transform"] =
            "translate3D(" +
            state.temporaryData.lastPosWidth +
            "px" +
            "," +
            state.temporaryData.lastPosHeight +
            "px" +
            ",0px) " +
            "rotate(" +
            state.temporaryData.lastRotate +
            "deg)";
          style["opacity"] = state.temporaryData.lastOpacity;
          style["zIndex"] = state.temporaryData.lastZindex;
          style[state.temporaryData.prefixes.transition + "TimingFunction"] = "ease";
          style[state.temporaryData.prefixes.transition + "Duration"] = 300 + "ms";
        } else {
          style["zIndex"] = "-1";
          style["transform"] = "translate3D(0,0," + -1 * visible * 40 + "px" + ")";
        }
        return style;
      };

      // 首页样式切换
      const transformIndex = index => {
        if (index === state.temporaryData.currentPage) {
          let style = {};
          style["transform"] =
            "translate3D(" +
            state.temporaryData.poswidth +
            "px" +
            "," +
            state.temporaryData.posheight +
            "px" +
            ",0px) " +
            "rotate(" +
            state.temporaryData.rotate +
            "deg)";
          style["opacity"] = state.temporaryData.opacity;
          style["zIndex"] = 10;
          if (state.temporaryData.animation) {
            style[state.temporaryData.prefixes.transition + "TimingFunction"] = "ease";
            style[state.temporaryData.prefixes.transition + "Duration"] =
              (state.temporaryData.animation ? 300 : 0) + "ms";
          }
          return style;
        }
      };

      // 调用父组件next方法 非disabled情况下直接下一题
      const onRadio = disabled => !disabled && parent.next();

      // checkoutbox选项间有分组互斥
      const onCheckbox = (val, index) => {
        const arr = props.pages[index].active;
        // 当前点击的分组
        const currentGroup = val.group;
        arr.forEach(v => {
          // 非当前分组的选项进行反选
          if (currentGroup !== v.group) {
            refs[`checkoutBox${v.id}`][0].toggle();
          }
        });
      };

      // onMounted(() => {
      //     document.addEventListener('touchmove', preventDefaultFn, { passive: false })
      // })

      // onBeforeUnmount(() => {
      //     document.removeEventListener('touchmove', preventDefaultFn, { passive: false })
      // })

      return {
        ...toRefs(state),
        touchstart,
        touchmove,
        touchend,
        onTransitionEnd,
        prev,
        next,
        transform,
        transformIndex,
        onRadio,
        onCheckbox,
        formateTime
      };
    }
  });
</script>

<template>
  <ul class="card">
    <li
      class="card-item"
      v-for="(item, index) in pages"
      :key="index"
      @transitionend="onTransitionEnd(index)"
      :style="[transformIndex(index), transform(index)]"
    >
      <!-- @touchmove.stop.capture.prevent="touchmove"
            @touchstart.stop.capture.prevent="touchstart"
            @touchend.stop.capture.prevent="touchend"
            @touchcancel.stop.capture.prevent="touchend"
            @mousedown.stop.capture.prevent="touchstart"
            @mouseup.stop.capture.prevent="touchend"
            @mousemove.stop.capture.prevent="touchmove"
            @mouseout.stop.capture.prevent="touchend"
            @webkit-transition-end="onTransitionEnd(index)" -->
      <!-- <h6>
                {{ index }}/<span>{{ pages.length }}</span>
            </h6> -->
      <div class="title">{{ item.name }}</div>
      <div class="answer">
        <!-- 单选框 -->
        <div v-if="item.type === '1'">
          <van-radio-group v-model="item.active" :disabled="item.disabled">
            <van-radio
              class="answer-detail"
              v-for="(val, idx) in item.optionResults"
              :key="idx"
              :name="val"
              @click="onRadio(item.disabled)"
              >{{ val.name }}</van-radio
            >
          </van-radio-group>
        </div>
        <!-- 复选框 -->
        <div v-else-if="item.type === '2'">
          <van-checkbox-group v-model="item.active" :disabled="item.disabled">
            <van-checkbox
              v-for="(val, idx) in item.optionResults"
              :key="idx"
              class="answer-detail"
              :name="val"
              shape="square"
              :ref="`checkoutBox${val.id}`"
              @click="onCheckbox(val, index)"
              >{{ val.name }}
              <!-- :data-idx="idx"
                            :data-index="index" -->
            </van-checkbox>
          </van-checkbox-group>
        </div>

        <div v-else-if="item.type === '3'">
          <!-- type数值 -->
          <div class="scale" v-if="item.dataType === 'number'">
            <div class="scale-subtitle">
              {{ item.active }}
              <span>{{ item.unit }}</span>
            </div>

            <scroll-ruler
              @scroll-value="val => (item.active = val)"
              :value="item.active"
              :scale="1"
              :max="item.maxValue || 250"
              :min="item.minValue || 30"
              :unit="10"
            />
          </div>
          <!-- type时间 -->
          <van-datetime-picker
            v-else-if="item.dataType === 'date'"
            v-model="item.active"
            type="date"
            item-height="50"
            :show-toolbar="false"
            :formatter="formateTime"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="item.disabled"
          />
          <!-- type文本 -->
          <van-field
            v-else-if="item.dataType === 'text'"
            v-model="item.active"
            rows="8"
            autosize
            type="textarea"
            :disabled="item.disabled"
            placeholder="请输入"
          />

          <!-- mask遮罩 -->
          <div class="scale-mask" v-if="item.disabled && item.dataType !== 'text'"></div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .card {
    position: relative;
    margin: 0;
    padding: 0;
    // width: 686px;
    width: 100%;
    height: 858px;
    background: #fff;
    box-shadow: 0px 4px 16px 0px rgba(75, 122, 255, 0.2);
    border-radius: 24px;
    perspective: 1000px;
    perspective-origin: 50% 150%;
    -webkit-perspective: 1000px;
    -webkit-perspective-origin: 50% 150%;
    .card-item {
      height: 100%;
      width: 100%;
      padding: 32px;
      background: #fff;
      border-radius: 24px;
      text-align: center;
      overflow: auto;
      // overflow: hidden;
      position: absolute;
      opacity: 0;
      display: flex;
      flex-direction: column;
      user-select: none;
      // pointer-events: auto;
      h6 {
        text-align: left;
        font-weight: 500;
        font-size: 50px;
        span {
          font-size: 40px;
          color: #2b2c2f;
        }
      }
      h6:after {
        content: "";
        display: block;
        width: 38px;
        height: 6px;
        margin-left: 10px;
        margin-top: 5px;
        background: #4b7aff;
      }
      .title {
        padding-top: 32px;
        padding-bottom: 32px;
        font-size: 30px;
        font-weight: 500;
        text-align: left;
        color: #2b2c2f;
      }
      .answer {
        position: relative;
        .answer-detail {
          padding: 24px 32px;
          margin-bottom: 32px;
          background-color: #f0f2f7;
          border-radius: 16px;
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #2b2c2f;
        }
        ::v-deep.van-checkbox__icon--square {
          .van-icon-success {
            border-radius: 8px;
          }
        }
        ::v-deep.van-field {
          border: 1px solid #c8c9cc;
          border-radius: 16px;
        }
        .scale-mask {
          position: absolute;
          top: -5px;
          width: 100%;
          // height: 400px;
          height: 102%;
          opacity: 0.4;
          z-index: 9999;
          background: #c8c9cc;
          border-radius: 16px;
        }
        ::v-deep.scroll-ruler {
          padding-bottom: 180px;
        }
        ::v-deep.scale {
          padding-top: 100px;
          .scale-subtitle {
            margin-bottom: 100px;
            font-size: 64px;
            font-family: DIN;
            font-weight: 700;
            color: #4b7aff;
            span {
              font-size: 38px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
</style>
