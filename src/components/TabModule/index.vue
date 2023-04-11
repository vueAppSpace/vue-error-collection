<template>
  <div class="tab__main" :style="prop.box_style ? prop.box_style : ''">
    <div class="tab__div">
      <ul class="tab__list" :style="prop.attr.tab_style ? prop.attr.tab_style : ''">
        <li
          class="tab__item"
          v-for="(tabs, index) in prop.attr.tab_content"
          :key="tabs.tab_menu"
          @click="onClickTabs(index)"
          :id="tabs.anchor_point"
        >
          <span :style="tabStyle(index)">{{ tabs.tab_menu }}</span>
        </li>
      </ul>

      <div class="active__line" :style="prop.attr.cur_slide_style ? prop.attr.cur_slide_style : ''"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "TabModule",
    props: {
      prop: {
        type: Object
      }
    },
    data() {
      return {
        scrolltop: null,
        dom: null,
        domobj: {} // 各个dom的页面位置
      };
    },
    computed: {
      tabStyle() {
        return function (params) {
          return this.prop.attr.tab_content[params].tab_style || "";
        };
      }
    },
    mounted() {
      //console.log("prop", this.prop);
      this.onWatchScroll();
      // 这里首次进入页面当前选中项为第一个
      document.querySelectorAll(".tab__item")[0].style = this.prop.attr.cur_tab_style
        ? this.prop.attr.cur_tab_style
        : "";
      this.computerSlide(0);
    },
    methods: {
      // 获取各个dom的页面位置
      getDomsObj() {
        this.domobj.dom1 = document.querySelectorAll(`#${this.prop.attr.tab_content[0].anchor_point}`)[0].offsetTop;
        this.domobj.dom2 = document.querySelectorAll(`#${this.prop.attr.tab_content[1].anchor_point}`)[0].offsetTop;
        this.domobj.dom3 = document.querySelectorAll(`#${this.prop.attr.tab_content[2].anchor_point}`)[0].offsetTop;
        this.domobj.dom4 = document.querySelectorAll(`#${this.prop.attr.tab_content[3].anchor_point}`)[0].offsetTop; //改动
      },
      // 计算当前选中滑动块儿的滑动距离和当前选中项
      computerSlide(val) {
        let tablist = document.querySelectorAll(".tab__item");
        for (let i = 0; i < tablist.length; i++) {
          tablist[i].style = "";
        }
        //console.log("val", val);
        //console.log("document.querySelector.offsetWidth", document.querySelector(".active__line").offsetWidth);
        let wX = document.querySelector(".active__line").offsetWidth + val * 90;
        document.querySelector(".active__line").style.transform = `translateX(${wX}px)`; //改动
        // 当前选中的tab_item的状态
        tablist[val].style = this.prop.attr.cur_tab_style ? this.prop.attr.cur_tab_style : "";
      },
      onClickTabs(index) {
        this.computerSlide(index);
        // 计算点击后滑动到DOM的位置
        this.dom = document.querySelectorAll(`#${this.prop.attr.tab_content[index].anchor_point}`)[0].offsetTop;
        let tabbox = document.querySelectorAll(".tab__div")[0];
        if (index === 0) {
          if (tabbox.style.position === "relative") {
            window.scrollTo(0, this.dom - tabbox.clientHeight);
            return;
          }
          window.scrollTo(0, this.dom);
          return;
        }
        if (index === 3) {
          window.scrollTo(0, this.dom);
          return;
        }
        if (tabbox.style.position === "relative") {
          window.scrollTo(0, this.dom - tabbox.clientHeight * 2);
        } else {
          window.scrollTo(0, this.dom - tabbox.clientHeight);
        }
      },
      onWatchScroll() {
        let tabmain = document.querySelectorAll(".tab__main")[0];
        let tabdiv = document.querySelectorAll(".tab__div")[0];
        tabdiv.style.top = 0;
        window.onscroll = () => {
          // 由于在created()或者mounted()钩子函数中获取到的dom位置不对，在滑动中获取dom的页面位置
          this.getDomsObj();
          this.scrolltop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
          // 滑动根据滚动距离来计算当前可是区域的选中项
          this.onScrollPage();
          // 自定义吸顶效果
          if (this.scrolltop > tabmain.offsetTop) {
            tabdiv.style.position = "fixed";
            tabdiv.style["z-index"] = 99;
          } else {
            tabdiv.style.position = "relative";
            tabdiv.style["z-index"] = 0;
          }
        };
      },
      onScrollPage() {
        let tab = document.querySelectorAll(".tab__div")[0];
        if (this.scrolltop > this.domobj.dom1 && this.scrolltop < this.domobj.dom2 - tab.offsetHeight * 2) {
          this.computerSlide(0);
        } else if (
          this.scrolltop > this.domobj.dom2 - tab.offsetHeight * 2 &&
          this.scrolltop < this.domobj.dom3 - tab.offsetHeight * 2
        ) {
          this.computerSlide(1);
        } else if (
          this.scrolltop > this.domobj.dom3 - tab.offsetHeight * 2 &&
          this.scrolltop < this.domobj.dom3 + tab.offsetHeight * 2
        ) {
          this.computerSlide(2);
        } else if (this.scrolltop > this.domobj.dom4 - tab.offsetHeight * 10 && this.scrolltop < this.domobj.dom4) {
          this.computerSlide(3);
        } //改动
      }
    }
  };
</script>
<style lang="scss" scoped>
  .tab__div {
    width: 100%;
    height: 102px;
    position: relative;
    padding: 0 28px;
    padding-top: 36px;
    background-color: #fff;
    border-radius: 16px;
    .tab__list {
      display: flex;
      justify-content: space-between;
      .tab__item {
        font-size: 32px;
        position: relative;
      }
      .tab__item-current {
        font-weight: 700;
      }
    }
    .active__line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 4px;
      background-color: #2e7cff;
      transition: all 300ms;
    }
  }
</style>
