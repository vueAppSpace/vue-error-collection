<template>
  <div class="detail-box" v-if="foodDetail && foodDetail.detail && foodDetail.detail.name">
    <full-loading :loading="loading" />
    <!-- 头像 -->
    <div class="box-avatar">
      <img :src="foodDetail.detail.re_standard_food_picture" />
      <div class="box-title">
        <div class="title">{{ foodDetail.detail.name }}</div>
        <recommend-num v-if="star" :rate="Number(star)"></recommend-num>
      </div>
    </div>

    <!-- 健康益处 -->
    <div
      class="food-effect card health_quota benefits"
      v-if="health_quota_benefits.nutr || health_quota_benefits.cons || health_quota_benefits.solar"
    >
      <h6>健康益处</h6>
      <div class="content">
        <p v-if="health_quota_benefits.nutr">营养疗愈：{{ health_quota_benefits.nutr }}；</p>
        <p v-if="health_quota_benefits.cons">体质调理：{{ health_quota_benefits.cons }}；</p>
        <p v-if="health_quota_benefits.solar">节气补益：{{ health_quota_benefits.solar }}；</p>
      </div>
    </div>

    <!-- 健康不利 -->
    <div class="food-effect card health_quota bad" v-if="health_quota_bad.nutr || health_quota_bad.cons">
      <h6>健康不利</h6>
      <div class="content">
        <p v-if="health_quota_bad.nutr">营养不宜：{{ health_quota_bad.nutr }}；</p>
        <p v-if="health_quota_bad.cons">体质不宜：{{ health_quota_bad.cons }}；</p>
      </div>
    </div>

    <!-- 食材功效 -->
    <div class="food-effect card">
      <h6>食{{ type === "1" ? "材" : "谱" }}功效</h6>
      <div class="tags">
        <van-tag
          v-for="(item, index) of foodDetail.tags.health"
          :key="index"
          :class="effectActive == index ? 'border' : ''"
          @click="tagClickSpec(index, item, '1')"
          color="rgba(75, 122, 255, 0.1)"
          text-color="#4B7AFF"
          >{{ item.name }}</van-tag
        >
      </div>
      <div class="content">
        {{ tagContent }}
      </div>
    </div>

    <!-- 营养特点 -->
    <!-- {{ allData['营养特点'].length }} -->
    <div class="food-effect card" v-if="foodDetail.tags.nutr && foodDetail.tags.nutr.length > 0">
      <div class="subtitle">
        <h6>营养特点</h6>
        <!-- <span @click="labelDialogShow = true">
                    标签颜色说明
                    <van-icon name="question-o" size="13" />
                </span> -->
      </div>
      <div class="tags">
        <van-tag
          v-for="(item, idx) of foodDetail.tags.nutr"
          :key="idx"
          @click="tagClick(idx, item.name, '2')"
          :color="fillColor(item.val).color"
          :text-color="fillColor(item.val).textColor"
          :class="featureActive == idx ? 'border' : ''"
          >{{ item.name }}</van-tag
        >
      </div>
      <div class="content">
        {{ featContent }}
      </div>
    </div>

    <!-- 食材/配料用量 -->
    <!-- <div class="used card" v-if="type == 2">
            <h6>食材/配料用量</h6>
            <div class="table">
                <div class="tr" v-for="(item, index) of foodDetail.mainList" :key="index">
                    <div class="title">{{ item.name }}</div>
                    <div class="weight">{{ item.amount }}克</div>
                </div>
            </div>

            <div class="table">
                <div v-if="item.amount" v-for="(item, index) of foodDetail.subsList" :key="index">
                    <div class="tr">
                        <div class="title">{{ item.name }}</div>
                        <div class="weight">{{ item.amount }}克</div>
                    </div>
                </div>
            </div>
        </div> -->

    <!-- 制作步骤 -->
    <!-- <div class="steps card" v-if="foodDetail.detail.re_org_cookbook_method_and_steps && (foodDetail.detail.re_org_cookbook_method_and_steps!=0)">
            <h6>制作步骤</h6>
            <div class="content">
                <p>
                    {{ foodDetail.detail.re_org_cookbook_method_and_steps }}
                </p>
            </div>
        </div> -->

    <!-- 营养元素 -->
    <div class="food-element card">
      <div class="subtitle">
        <h6>营养元素</h6>
        <span>{{ energy }}千卡/每100克</span>
      </div>
      <!-- <healthy-circle :chartData="chartData"></healthy-circle> -->

      <div class="pieWrapper">
        <div id="myChart" :style="{ width: '100%', height: '4.6rem' }"></div>
      </div>

      <div class="element_proportion">
        <div class="title flex">
          <div class="title_name" v-for="(item, index) in titleNameArr">
            {{ item }}
          </div>
        </div>
        <div class="element flex" v-for="(item, index) in chartData">
          <div class="title_name">
            {{ item.name }}
          </div>
          <div class="title_name">
            {{ item.value }}
          </div>

          <div class="title_name">
            {{ item.ratio }}
          </div>
        </div>
      </div>

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

    <!-- 食谱推荐 -->
    <div class="shipuRecommand" v-if="searchRelRecipeData && searchRelRecipeData.length">
      <div class="title">食谱推荐</div>

      <div class="shipuRecommandBox flex-center" v-for="(item, index) in searchRelRecipeData" :key="index">
        <img :src="item.img" />
        <div class="shipuDetail">
          <div class="shupuName">{{ item.name }}</div>
          <div class="shipuUnit"
            ><span style="color: rgba(255, 149, 0, 1)">{{ item.energy }}千卡</span>/100g
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
  import {
    queryFoodDetail,
    queryCookDetail,
    queryTagDetail,
    queryList,
    searchRelRecipe,
    queryList1
  } from "@/service/healthManagement";
  import { dealWithColor, fillColor as VMFillColor } from "@/utils/commonFun";

  import FullLoading from "@/components/Loading";

  // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
  import * as echarts from "echarts/core";
  // 引入饼图图图表，图表后缀都为 Chart
  import { PieChart } from "echarts/charts";
  // 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent
  } from "echarts/components";
  // 标签自动布局，全局过渡动画等特性
  import { LabelLayout, UniversalTransition } from "echarts/features";
  // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
  import { CanvasRenderer } from "echarts/renderers";

  // 注册必须的组件
  echarts.use([
    // TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    PieChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
  ]);

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
      labelDialog,
      FullLoading
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
        chartData: [], // 图表数据

        foodDetail: null,
        tagContent: null,
        nutritiousIngredients: null,
        energy: 0,
        titleNameArr: ["营养元素", "推荐 (克)", "占比 (%)"],
        searchRelRecipeData: null,
        health_quota_bad: {},
        health_quota_benefits: {}
      };
    },
    created() {
      this.loading = true;
      const { name, type, accessToken, source, star = 0 } = this.$route.query;
      Object.assign(this, { name, type, star });
      // 若从小程序跳转过来 手动缓存accessToken
      // if (source === "mp" && accessToken) {
      //   localStorage.setItem("accessToken", accessToken);
      // }

      this.queryListFn();

      this.searchRelRecipeFn();
    },
    methods: {
      searchRelRecipeFn() {
        let ingrd_lst = [];
        ingrd_lst.push(this.$route.query.name);
        searchRelRecipe({ ingrd_lst: ingrd_lst })
          .then(res => {
            if (res.data) {
              this.searchRelRecipeData = res.data.rel[0].recipes_list;
            }
          })
          .catch(ex => {});
      },
      translateData(data) {
        for (let item of data) {
          if (item.code == "re_standard_food_carbohydrate") {
            this.chartData[0] = item;
          }
          if (item.code == "re_standard_food_protein") {
            this.chartData[1] = item;
          }
          if (item.code == "re_standard_food_fat") {
            this.chartData[2] = item;
          }
        }
        let arr = [];
        let sum = 0;
        for (let item of this.chartData) {
          sum += parseFloat(item.value);
        }
        for (let item of this.chartData) {
          item.ratio = Number(((Number(item.value) / sum).toFixed(3) * 100).toFixed(1));
        }
        for (let item of this.chartData) {
          if (item.name == "脂肪") {
            arr[2] = item;
          } else if (item.name == "碳水化合物") {
            arr[0] = item;
          } else if (item.name == "蛋白质") {
            arr[1] = item;
            // arr[1].ratio = Number( ( 100 - arr[0].ratio - arr[1].ratio ).toFixed(1) )
          }
        }

        return arr;
      },
      translateData2(data) {
        let arr = [];
        for (let item of data) {
          if (
            item.code == "re_standard_food_carbohydrate" ||
            item.code == "re_standard_food_protein" ||
            item.code == "re_standard_food_fat"
          ) {
            continue;
          } else {
            arr.push(item);
          }
        }
        return arr;
      },
      drawPie() {
        let myChart = echarts.init(document.getElementById("myChart"));
        var option;
        option = {
          series: [
            {
              name: "",
              type: "pie",
              radius: "50%",
              center: ["50%", "45%"],
              clickable: false,
              data: this.chartData
            }
          ],
          color: ["#68A1FF ", "#FFBF5B", "#FFA1B2"]
        };
        myChart.clear();
        option && myChart.setOption(option);
      },
      queryListFn1() {
        let data = {
          name: this.$route.query.name
        };
        queryList1(data)
          .then(res => {
            if (res.data) {
              this.foodDetail = res.data;
              this.tagContent = this.foodDetail.health[0].info;

              this.energy = res.data.detail.re_org_cookbook_quantity_per_unit;

              let originArr = [...res.data.detail.nutr];

              for (let item of res.data.detail.nutr) {
                if (item.code == "re_org_cookbook_carbohydrate") {
                  this.chartData[0] = item;
                }
                if (item.code == "re_org_cookbook_protein") {
                  this.chartData[1] = item;
                }

                if (item.code == "re_org_cookbook_fat") {
                  this.chartData[2] = item;
                }
              }

              let arr = [];
              let sum = 0;

              for (let item of this.chartData) {
                sum += parseFloat(item.value);
              }
              for (let item of this.chartData) {
                item.ratio = Number(((Number(item.value) / sum).toFixed(3) * 100).toFixed(1));
                //console.log("item.ratio", item.ratio);
              }
              for (let item of this.chartData) {
                if (item.name == "脂肪") {
                  arr[2] = item;
                } else if (item.name == "碳水化合物") {
                  arr[0] = item;
                } else if (item.name == "蛋白质") {
                  arr[1] = item;
                  // arr[1].ratio = Number( ( 100 - arr[0].ratio - arr[1].ratio ).toFixed(1) )
                }
              }

              this.chartData = arr;
              this.nutritiousIngredients = originArr.slice(4, originArr.length);
              this.tableData = this.nutritiousIngredients.slice(0, 2);
            }
          })
          .catch(ex => {});
      },
      /**
       * 查询详情接口
       * @param {*} type 类型
       * @param {*} name 名称
       */
      queryListFn() {
        let data = {
          name: this.$route.query.name
        };
        this.loading = true;
        queryList(data)
          .then(res => {
            if (res.data) {
              this.foodDetail = res.data.ingred_res[0];
              let originArr = [...res.data.ingred_res[0].detail.nutr];
              this.chartData = this.translateData(originArr);
              this.nutritiousIngredients = this.translateData2(originArr);
              this.tableData = this.nutritiousIngredients.slice(0, 2);

              setTimeout(() => {
                this.drawPie();

                this.loading = false;
              }, 50);

              this.tagContent = this.foodDetail.tags.health[0].info;
              this.featContent = this.foodDetail.tags.nutr[0].info;
              this.health_quota_bad = this.foodDetail.health_quota.bad;
              this.health_quota_benefits = this.foodDetail.health_quota.benefits;
              this.energy = res.data.ingred_res[0].detail.re_standard_food_energy;
              if (this.$route.query.score) {
                this.star = this.$route.query.score;
              } else {
                this.star = res.data.ingred_res[0].score;
              }
            }
          })
          .catch(ex => {
            this.loading = false;
          });
      },
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
          if (code !== 1000) return this.$toast(msg);
          data["营养特点"] = dealWithColor(color, data["营养特点"]);
          let arr = [...data.nutritiousIngredients];

          //console.log("arr.length", arr.length);
          // 切割前三条 图表使用
          // const chartData = arr.slice(0, 3).map(i => {
          //     i.ratio *= 100
          //     return i
          // })

          // //console.log('chartDatazzz', chartData)
          // this.chartData = chartData

          // data.nutritiousIngredients = arr.slice(3, arr.length)
          // // 切割4-5条 默认展示
          // this.tableData = arr.slice(3, 5)

          this.allData = data;

          const effect = data["功效"][0] || "";
          const feat = (data["营养特点"][0] && Object.keys(data["营养特点"][0])[0]) || "";
          Promise.all([this.queryTagContent(effect, "1"), this.queryTagContent(feat, "2")]);
        } catch (err) {
          this.loading = false;
          this.$toast(err.data.error || "网络异常");
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
          if (code !== 1000) return this.$toast(msg);
          this[T[type]] = data;
        } catch (err) {
          this.$toast(err.data.error || "网络异常");
        }
      },

      tagClickSpec(idx, tag, type) {
        this.tagContent = tag.info;
        this.effectActive = idx;
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
        const tableData = [...this.nutritiousIngredients];
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
    background: #f0f2f7;

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

    .health_quota {
      .content {
        margin-top: 24px;

        p {
          margin-bottom: 12px;
          position: relative;
          display: flex;
          align-items: center;
        }

        p:last-child {
          margin-bottom: 0;
        }

        p::before {
          display: inline-block;
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background-color: red;
          margin-right: 12px;
        }
      }
    }

    .health_quota.benefits {
      p::before {
        background-color: #16b57d;
      }
    }

    .health_quota.bad {
      p::before {
        background-color: #f55858;
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

  .pieWrapper {
    margin-top: 25px;
    position: relative;
  }

  .element_proportion {
    width: 646px;
    height: 252px;
    background: rgba(75, 122, 255, 0.1);
    border-radius: 16px;
    padding: 24px 40px;
    text-align: center;

    .title {
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4b7aff;
      line-height: 40px;
    }

    .element {
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d3e42;
      line-height: 40px;
    }

    .title_name {
      flex: 1;
      margin-bottom: 14px;
    }
  }

  /* <div class="shipuRecommand">
            <div class="title">食谱推荐</div>

            <div class="shipuRecommandBox">
                <img src="https://lk-shuzhizhongtai-common.oss-cn-beijing.aliyuncs.com/ai-laikang-com/2021-10-27/ZFrs7pYBjsSHNDdCWwmBa7CTP3nAkf2y.png" />
                <div class="shipuDetail">
                    <div class="shupuName">水煮鸡蛋</div>
                    <div class="shipuUnit"><span style="color: rgba(255, 149, 0, 1);">129千克</span>/100g</div>
                </div>
            </div>
        </div>     */
  .shipuRecommand {
    padding: 24px 0 24px 20px;
    background: #ffffff;
    border-radius: 16px;
    text-align: left;

    .title {
      font-size: 32px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #1c1c1e;
      line-height: 48px;
    }

    .shipuRecommandBox {
      height: 130px;
      border-bottom: 1px solid #eee;

      img {
        width: 82px;
        height: 82px;
        margin-right: 24px;
        background-color: #d8d8d8;
      }

      .shipuDetail {
        .shupuName {
          font-weight: 550;
          color: #27272a;
          line-height: 36px;
          font-size: 26px;
        }

        .shipuUnit {
          margin-top: 4px;
          font-size: 22px;
          color: #9195a1;
          line-height: 32px;
        }
      }
    }

    .shipuRecommandBox:nth-last-child(1) {
      border-bottom: 0px solid #eee;
    }
  }
</style>
