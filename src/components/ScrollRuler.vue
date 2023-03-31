<!--
 * @Description: 滚动尺
 * @Author: IFLS
 * @Date: 2022-08-25 13:17:30
 * @LastEditTime: 2023-03-31 14:34:25
-->
<script>
  import { defineComponent, onMounted } from "@vue/composition-api";
  import { ddIsMobile } from "@/utils/ddTools";

  export default defineComponent({
    props: {
      // 当前指向的值
      value: {
        type: Number | String,
        default: 0
      },
      // 最小值
      min: {
        type: Number,
        default: 0
      },
      // 最大值
      max: {
        type: Number,
        default: 1000
      },
      // 每个刻度所代表实际的值
      scale: {
        type: Number,
        default: 10
      },
      // 两个刻度之间的间隔，默认值10(px)
      unit: {
        type: Number,
        default: 10
      },
      // 画布宽度
      width: {
        type: Number,
        default: 500
      },
      // 画布高度
      height: {
        type: Number,
        default: 150
      },
      // 刻度值字体大小
      fontSize: {
        type: Number,
        default: 16
      },
      // 刻度线宽度
      scaleWidth: {
        type: Number,
        default: 1
      },
      // 刻度值字体
      fontFamily: {
        type: String,
        default: "Courier New"
      },
      // 刻度值字体颜色
      fontColor: {
        type: String,
        default: "#4b7aff"
      },
      // 刻度线颜色
      scaleColor: {
        type: String,
        default: "#4b7aff"
      },
      // 画布背景色，默认白色
      background: {
        type: String,
        default: "#fff"
      },
      // 中心线颜色，默认黑色
      lineColor: {
        type: String,
        default: "#000"
      }
    },
    setup(props, ctx) {
      // const { $nextTick: nextTick } = ctx.root

      const { refs, emit } = ctx;

      class Ruler {
        constructor(options = {}) {
          this.version = "1.0.0";
          this.canvas = null;
          this.options = {
            ...props,
            ...options,
            canvasRef: refs.rulerRef
          };

          this.init();
        }
        init() {
          this.render();
          this.addEvent();
        }
        render() {
          const {
            canvasRef,
            value,
            min,
            max,
            scale,
            unit,
            width,
            height,
            scaleWidth,
            scaleColor,
            background,
            lineColor
          } = this.options;
          const canvas = canvasRef;
          const ctx = canvas.getContext("2d");
          let curValue = Number(value);
          let position = 0;

          canvas.width = width;
          canvas.height = height;
          this.canvas = canvas;
          ctx.clearRect(0, 0, width, height);
          ctx.lineWidth = scaleWidth;

          // 绘制右侧刻度
          for (position = width / 2; curValue <= max; position += unit) {
            // 绘制一屏
            if (position >= width) break;
            this.drawScale({ ctx, position, curValue });
            curValue = curValue + scale;
          }

          // 绘制左侧刻度
          curValue = value - scale;
          for (position = width / 2 - unit; curValue >= min; position -= unit) {
            // 绘制一屏
            if (position <= -width) break;
            this.drawScale({ ctx, position, curValue });
            curValue = curValue - scale;
          }

          // 绘制中心线
          ctx.fillStyle = background;
          ctx.fillRect = (0, 0, width, height);
          ctx.lineWidth = scaleWidth;
          ctx.moveTo(Math.floor(width / 2), 0);
          ctx.lineTo(Math.floor(width / 2), height);
          ctx.strokeStyle = lineColor;
          ctx.stroke();
          ctx.closePath();

          // 标尺底部线
          ctx.moveTo(0, height);
          ctx.lineTo(width, height);
          ctx.strokeStyle = scaleColor;
          ctx.stroke();
          ctx.closePath();
        }

        drawScale({ ctx, position, curValue }) {
          const { height, unit, scale, fontSize, fontColor, fontFamily, scaleColor } = this.options;
          const lineHeight = Math.ceil((height * 3) / 4);
          const middleLineHeight = Math.ceil((height * 5) / 6);
          const normalLineHeight = Math.ceil((height * 8) / 9);
          ctx.beginPath();
          ctx.moveTo(position, lineHeight, middleLineHeight, normalLineHeight);
          ctx.fillStyle = fontColor;
          if (curValue % (scale * unit) == 0) {
            // 第1或10格刻度
            ctx.moveTo(position, lineHeight);
            // 设置文本的字体大小和字体样式
            ctx.font = fontSize + "px " + fontFamily;
            ctx.fillStyle = fontColor;
            ctx.fillText(curValue, position - ctx.measureText(`${curValue}`).width / 2, lineHeight - 4);
          } else if (curValue % ((scale * unit) / 2) === 0) {
            // 第5格刻度
            ctx.moveTo(position, middleLineHeight);
          } else {
            // 其他刻度
            ctx.moveTo(position, normalLineHeight);
          }
          ctx.lineTo(position, height);
          ctx.strokeStyle = scaleColor;
          // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
          ctx.stroke();
          // 关闭当前的绘制路径
          ctx.closePath();
        }

        addEvent() {
          let touchstartX;
          const { unit, min, max, scale, callback } = this.options;
          const { canvas } = this;
          const touchstart = e => {
            e.stopPropagation();
            e.preventDefault();
            // 手指第一次触摸时x坐标
            touchstartX = e.touches ? e.touches[0].clientX : e.clientX;
          };
          const touchmove = e => {
            e.stopPropagation();
            e.preventDefault();
            // 当前手指所在x坐标
            const currentX = e.touches ? e.touches[0].clientX : e.clientX;
            if (Math.abs(currentX - touchstartX) > unit) {
              // 手指横向移动的距离
              const distance = currentX - touchstartX;
              let { value } = this.options;
              touchstartX = currentX;
              value -= Math.ceil(distance / unit) * scale;
              value = value < min ? min : value > max ? max : value;
              this.options.value = value;
              this.render();
              callback && callback(value);
            }
          };
          const isPC = !ddIsMobile();
          if (isPC) {
            // pc
            let flag = true;
            canvas.addEventListener(
              "mousedown",
              e => {
                flag = true;
                touchstart(e);
              },
              false
            );
            canvas.addEventListener("mousemove", e => flag && touchmove(e), false);
            canvas.addEventListener("mouseup", () => (flag = false));
            // 鼠标离开元素停止拖动
            canvas.addEventListener("mouseleave", () => (flag = false));
          } else {
            // 移动端
            // 添加手指触碰屏幕时的touchstart事件
            canvas.addEventListener("touchstart", e => touchstart(e), false);
            // 添加手指滑动屏幕时的touchmove事件
            canvas.addEventListener("touchmove", e => touchmove(e), false);
          }
        }
        reset(options = {}) {
          this.options = { ...this.options, ...options };
          this.init();
        }
      }

      onMounted(() => {
        new Ruler({
          callback: val => emit("scroll-value", val)
        });
      });

      return {};
    }
  });
</script>

<template>
  <canvas class="scroll-ruler" ref="rulerRef" style="width: 100%"></canvas>
</template>
