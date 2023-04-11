<!--
 * @Description: 食材/食谱详情
 * @Author: IFLS
 * @Date: 2021-12-23 15:59:44
 * @LastEditTime: 2023-04-04 18:51:45
-->
<template>
  <div class="detail-box" v-if="allData.name">
    <!-- 头像 -->
    <div class="box-avatar">
      <img :src="allData.picture" />
      <div class="box-title">
        <div class="title">{{ allData.name }}</div>
        <recommend-num v-if="star" :rate="Number(star)"></recommend-num>
      </div>
    </div>
    <!-- 食材功效 -->
    <div class="food-effect card">
      <h6>食{{ type === "1" ? "材" : "谱" }}功效</h6>
      <div class="tags">
        <van-tag
          v-for="(item, index) of allData['功效']"
          :key="index"
          :class="effectActive == index ? 'border' : ''"
          @click="tagClick(index, item, '1')"
          color="#feeff4"
          text-color="#fc6294"
          >{{ item }}</van-tag
        >
      </div>
      <div class="content">
        {{ effectContent }}
      </div>
    </div>
    <!-- 营养特点 -->
    <div class="food-effect card" v-if="allData['营养特点'] && allData['营养特点'].length > 0">
      <div class="subtitle">
        <h6>营养特点</h6>
        <span @click="labelDialogShow = true">
          标签颜色说明
          <van-icon name="question-o" size="13" />
        </span>
      </div>
      <div class="tags">
        <van-tag
          v-for="(i, idx) of allData['营养特点']"
          :key="idx"
          :class="featureActive == idx ? 'border' : ''"
          @click="tagClick(idx, Object.keys(i)[0], '2')"
          :color="fillColor(Object.values(i)[0]).color"
          :text-color="fillColor(Object.values(i)[0]).textColor"
          >{{ Object.keys(i)[0] }}</van-tag
        >
      </div>
      <div class="content">
        {{ featContent }}
      </div>
    </div>
    <!-- 食材/配料用量 -->
    <div class="used card" v-if="type == 2">
      <h6>食材/配料用量</h6>
      <div class="table">
        <div class="tr" v-for="(item, index) of allData.ingredients" :key="index">
          <div class="title">{{ item.name }}</div>
          <div class="weight">{{ item.amount }}克</div>
        </div>
      </div>
    </div>

    <!-- 制作步骤 -->
    <div class="steps card" v-if="type == 2 && allData.steps">
      <h6>制作步骤</h6>
      <div class="content">
        <p>
          {{ allData.steps }}
        </p>
      </div>
    </div>

    <!-- 营养元素 -->
    <div class="food-element card">
      <div class="subtitle">
        <h6>营养元素</h6>
        <span>{{ allData.energy }}</span>
      </div>
      <healthy-circle :chartData="chartData"></healthy-circle>
      <div class="table">
        <div class="th">
          <div class="title">更多营养元素</div>
          <div>每100克</div>
        </div>
        <div class="tr" v-for="(item, index) of tableData" :key="index">
          <div class="title">{{ item.name }}</div>
          <div class="weight">{{ item.value }}{{ item.unit }}</div>
        </div>

        <!-- 展开/折叠按钮 -->
        <div class="expend-box">
          <div class="expend" v-if="isShowAll" @click="expend">
            展开
            <van-icon class="expend-arrow" name="arrow-down" />
          </div>
          <div class="expend" v-else @click="close">
            收起
            <van-icon class="expend-arrow" name="arrow-up" />
          </div>
        </div>
      </div>
    </div>

    <label-dialog :labelDialogShow.sync="labelDialogShow"></label-dialog>
  </div>
</template>

<script>
  import recommendNum from "./components/recommendNum";
  import healthyCircle from "./components/healthyCircle";
  import labelDialog from "./components/labelDialog";
  import { queryFoodDetail, queryCookDetail, queryTagDetail } from "@/service/healthManagement";
  import { dealWithColor, fillColor as VMFillColor } from "@/utils/commonFun";
  export default {
    // 页面级路由守卫
    beforeRouteEnter(to, from, next) {
      const { type, name } = to.query;
      if (!type || !name) {
        return setTimeout(() => document.write("URL缺少必要参数"), 1);
      }
      next();
    },
    components: {
      recommendNum,
      healthyCircle,
      labelDialog
    },
    data() {
      return {
        type: "",
        name: "",
        effectActive: 0,
        featureActive: 0,
        star: 0, // 星数
        labelDialogShow: false, // 标签颜色说明弹窗
        isShowAll: true, // 营养元素折叠
        loading: false,
        allData: {},
        tableData: [], // 更多元素数据
        featContent: "", // 特点内容
        effectContent: "", // 功效内容
        chartData: [] // 图表数据
      };
    },
    created() {
      const { name, type, accessToken, source, star = 0 } = this.$route.query;
      Object.assign(this, { name, type, star });
      // 若从小程序跳转过来 手动缓存accessToken
      // if (source === "mp" && accessToken) {
      //   localStorage.setItem("accessToken", accessToken);
      // }
      this.queryDetail(type, name);
    },
    methods: {
      /**
       * 查询详情接口
       * @param {*} type 类型
       * @param {*} name 名称
       */
      async queryDetail(type, name) {
        this.loading = true;
        // 获取颜色对照关系
        const color = JSON.parse(localStorage.getItem("nutritions"));
        try {
          const Api = {
            1: queryFoodDetail, // 食材
            2: queryCookDetail // 食谱
          };
          const { code, msg, data } = await Api[type](name);
          this.loading = false;
          if (code !== 1000) return; //console.log(msg);
          data["营养特点"] = dealWithColor(color, data["营养特点"]);
          let arr = [...data.nutritiousIngredients];
          // 切割前三条 图表使用
          const chartData = arr.slice(0, 3).map(i => {
            i.ratio *= 100;
            return i;
          });
          this.chartData = chartData;
          data.nutritiousIngredients = arr.slice(3, arr.length);
          // 切割4-5条 默认展示
          this.tableData = arr.slice(3, 5);
          this.allData = data;

          const effect = data["功效"][0] || "";
          const feat = (data["营养特点"][0] && Object.keys(data["营养特点"][0])[0]) || "";
          Promise.all([this.queryTagContent(effect, "1"), this.queryTagContent(feat, "2")]);
        } catch (err) {
          this.loading = false;
          //console.log(err.data.error || "网络异常");
        }
      },
      /**
       * 查询标签详情接口
       * @param {*} tagName 标签名
       * @param {*} type 标签类型 1:功效 2:特点
       */
      async queryTagContent(tagName, type) {
        if (tagName === "") return;
        const T = {
          1: "effectContent",
          2: "featContent"
        };
        try {
          const { code, msg, data } = await queryTagDetail(tagName);
          if (code !== 1000) return; //console.log(msg);
          this[T[type]] = data;
        } catch (err) {
          //console.log(err.data.error || "网络异常");
        }
      },
      /**
       * 折叠/展开 tag标签
       */
      tagClick(idx, tagName, type) {
        const T = {
          1: "effectActive",
          2: "featureActive"
        };
        if (this[T[type]] === idx) return;
        this[T[type]] = idx;
        this.queryTagContent(tagName, type);
      },
      /**
       * 列表展开按钮
       */
      expend() {
        const tableData = [...this.allData.nutritiousIngredients];
        this.tableData = tableData;
        this.isShowAll = false;
      },
      /**
       * 列表收起按钮
       */
      close() {
        const tableData = [...this.tableData].slice(0, 2);
        this.tableData = tableData;
        this.isShowAll = true;
      },
      fillColor(val) {
        return VMFillColor(val);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./components/card";
  .detail-box {
    padding: 24px;
    .box-avatar {
      display: flex;
      margin-bottom: 32px;
      img {
        width: 162px;
        height: 162px;
        border-radius: 12px;
      }
      .box-title {
        padding: 24px;
        .title {
          margin-bottom: 24px;
          text-align: left;
          font-size: 44px;
          font-weight: 700;
          color: #333;
        }
      }
    }
    .food-effect {
      .van-icon {
        margin-left: 5px;
      }

      .tags {
        text-align: left;
        font-size: 68px;
        margin-bottom: 27px;
        .van-tag {
          margin-right: 12px;
        }
        .border {
          border-width: 2px;
          border-style: solid;
        }
      }
      .content {
        text-align: left;
        font-size: 26px;
        color: #333;
      }
    }
    .table {
      width: 100%;
      // display: flex;
      text-align: left;
      font-size: 28px;
      font-weight: 400;
      color: #333;
      .title {
        width: 50%;
      }
      .th,
      .tr {
        display: flex;
        width: 100%;
        height: 95px;
        line-height: 95px;
        text-align: left;
      }
      .th {
        font-weight: 700;
      }
      .tr {
        border-bottom: 2px solid #dadae1;
        .weight {
          min-width: 107px;
          text-align: center;
        }
      }
      .expend-box {
        padding-top: 31px;
        text-align: center;
        .expend {
          display: inline-block;
          width: 168px;
          height: 64px;
          line-height: 64px;
          font-size: 26px;
          color: #666;
          text-align: center;
          background: #ffffff;
          border: 2px solid #c0c0ca;
          border-radius: 32px;
          .expend-arrow {
            padding-top: 15px;
          }
        }
      }
    }
    .used {
      .weight {
        width: 50%;
        padding-right: 50px;
        text-align: right !important;
      }
    }
    .steps {
      .content {
        padding-top: 22px;
        p {
          margin-bottom: 24px;
          font-size: 26px;
          text-align: left;
          color: #333;
        }
      }
    }
  }
</style>
