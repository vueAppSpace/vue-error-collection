<template>
  <div class="progress-bar">
    <div class="num">{{ num }}</div>

    <div class="left-area">0</div>

    <div class="right-area">200%</div>
    <div class="mask">
      <div class="bar">
        <div class="point"></div>

        <div class="pointBox">110%</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "progress-bar",
    props: {
      min: {
        //最小值
        type: Number,
        default: 0
      },
      max: {
        //最大值
        type: Number,
        default: 100
      },
      step: {
        //每步的值为多少
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        num: this.value,
        test: ""
      };
    },
    mounted() {
      let dragSlide = () => {
        document.addEventListener(
          "touchmove",
          function (e) {
            e.preventDefault();
          },
          { passive: false }
        );
        //取消移动端手势长按弹出提示框的操作
        document.addEventListener("contextmenu", function (e) {
          e.preventDefault();
        });
        this.point = document.querySelector(".point"); //控制进度条的点

        this.pointBox = document.querySelector(".pointBox");

        //console.log("this.pointBox", this.pointBox);
        this.pointWidth = parseInt(window.getComputedStyle(this.point, null).width);
        this.bar = document.querySelector(".bar"); //进度条颜色层
        this.mask = document.querySelector(".mask"); //进度条底层
        let lastX = null; //判断鼠标移动方向，解决向左侧滑动时候的bug
        let move = e => {
          let x = e.touches[0].pageX;
          let direction = "";
          if (lastX == null) {
            lastX = x;
            return;
          }
          if (x > lastX) {
            direction = "right";
          } else if (x < lastX) {
            direction = "left";
          } else {
            direction = "";
          }
          let mask_left = this.getPosition(this.mask).left;
          let point_left = x - mask_left;
          if (point_left >= this.mask.offsetWidth - this.pointWidth) {
            //控制点可以滑动的最大值就是进度条的宽度减去控制点的宽度;
            point_left = this.mask.offsetWidth - this.pointWidth;
          }
          if (point_left < 0) {
            //控制点滑动的最小值不能为负
            point_left = 0;
          }
          this.point.style.left = point_left + "px";

          this.pointBox.left = point_left + "px";
          this.bar.style.width = point_left + this.pointWidth + "px";
          //计算百分比
          let percent = (point_left / (this.mask.offsetWidth - this.pointWidth)) * 100;
          if (percent < 0.5 && direction == "right") {
            percent = Math.ceil(percent);
          } else if (percent > 0.5 && direction == "right") {
            percent = Math.floor(percent);
          } else {
            percent = Math.ceil(percent);
          }
          let value = (percent / 100) * (this.max - this.min) + this.min;
          let v = Math.floor(value / this.step);
          value = v * this.step;
          this.num = value;
        };
        this.point.addEventListener("touchmove", move);
      };
      let drag0 = new dragSlide();
    },
    methods: {
      getPosition(node) {
        //获取元素的绝对位置,工具函数
        let left = node.offsetLeft; //获取元素相对于其父元素的left值var left
        let top = node.offsetTop;
        let current = node.offsetParent; // 取得元素的offsetParent // 一直循环直到根元素
        while (current != null) {
          left += current.offsetLeft;
          top += current.offsetTop;
          current = current.offsetParent;
        }
        return {
          left: left,
          top: top
        };
      }
    }
  };
</script>
<style lang="scss">
  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .progress-bar {
    text-align: left;
    position: relative;
    height: 140px;
    border: 1px solid;
    .left-area {
      position: absolute;
      left: 0;
      top: 45px;
      font-size: 30px;
      color: #565961;
    }
    .right-area {
      position: absolute;
      right: 0;
      top: 45px;
      font-size: 30px;
      color: #565961;
    }
    .mask {
      width: 592px;
      height: 20px;
      background-color: #dddddd;
      border-radius: 10px;
      position: absolute;
    }
    .bar {
      height: 20px;
      /* background-color: #FFD977; */
      background: linear-gradient(90deg, #fab657 0%, #f7ce5c 100%);
      position: absolute;
      z-index: 2;
      border-radius: 10px;
      bottom: 0;
      left: 0;
    }
    .point {
      position: absolute;
      bottom: -3px;
      left: 0;
      z-index: 3;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ffd977;
      border: 2px solid #ffffff;
    }
    .num {
      text-align: center;
      padding-bottom: 20px;
    }

    .pointBox {
      position: absolute;
      bottom: -90px;
      left: 0;
      z-index: 3;
      padding: 0px 12px;

      line-height: 44px;
      background: #ffffff;
      box-shadow: 0px 4px 12px 0px rgba(75, 122, 255, 0.2);
      border-radius: 24px;
      font-size: 22px;
      color: #565961;
      z-index: 100000;
    }
  }
</style>
