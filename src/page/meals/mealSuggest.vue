<template>
  <div
    class="container"
    :class="{
      containerHeightauto: mealsProposeAndNutrients && mealsProposeAndNutrients.nowMealsIntakeThan
    }"
  >
    <full-loading :loading="loading" />

    <div>
      <div class="repastCondition flex-between meal_time" @click="show = true">
        <div class="title_spec flex-center">
          <img class="rili_icon" src="../../assets/images/meal/date_icon.png" />
          <div>就餐时间: {{ time }}</div>
        </div>

        <div class="time_icon">
          <img src="../../assets/images/meal/right_arrow.png" />
        </div>
      </div>
      <div v-if="mealsProposeAndNutrients && mealsProposeAndNutrients.nowMealsIntakeThan">
        <div class="repastCondition" v-if="mealsProposeAndNutrients.nowMealsIntakeThan">
          <div class="title">
            就餐情况
            <div class="bg-bottom"></div>
          </div>

          <div class="content flex-between">
            <div class="left">
              <div class="meal_type_title fontSize26">餐次</div>
              <div class="meal_type_content marginTop12">午餐</div>
            </div>

            <div class="middle">
              <div class="meal_intake_title fontSize26">当餐摄入</div>
              <div
                class="meal_intake_value flex-center marginTop12"
                :class="{
                  colorGreen: mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 0,
                  colorRed: mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 1
                }"
              >
                <div class="value_level" v-if="mealsProposeAndNutrients.nowMealsIntakeThan.ratio == -1">偏低</div>
                <div class="value_level" v-else-if="mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 1">偏高</div>
                <!-- <div>203kcal</div> -->
                <div>{{ Math.round(mealsProposeAndNutrients.nowMealsIntakeThan.intake) }}千卡</div>
              </div>
            </div>

            <div class="right" @click="dancanExplain('当餐推荐摄入量')">
              <div class="meal_remmond_title fontSize26"
                >当餐推荐摄入<img class="questionMarkUrl" :src="questionMarkUrl"
              /></div>
              <div class="meal_remmond_value marginTop12">
                {{ Math.round(mealsProposeAndNutrients.nowMealsIntakeThan.recommend) }}千卡
              </div>
            </div>
          </div>

          <div>
            <div class="dietRemark" style="font-size: 14px" v-if="dietRemark.length > 0">
              <span>{{ dietRemark[0] }}</span
              ><span style="color: #f55858">{{ dietRemark[1] }}</span
              ><span>{{ dietRemark[2] }}</span>
            </div>

            <div v-else>{{ mealsProposeAndNutrients.dietRemark }}</div>
          </div>
        </div>

        <!--<div class="repastCondition meal_suggest" v-if="mealsProposeAndNutrients.proposeDTOList">
                        <div class="title">
                            膳食建议
                            <div class="bg-bottom"></div>
                        </div>
                        <div class="dishesvarietyBox flex">
                            <div class="dishesvariety" v-for="(item, index) in mealsProposeAndNutrients.proposeDTOList" :key="index">
                                <div>
                                    <img :src="item.picture" />
                                </div>
                                <div class="foodName">{{ item.recipe_name }}</div>

                                <div class="opacityBg"></div>
                                <p class="foodNum">{{ item.num }}g</p>
                            </div>
                        </div>
                    </div>-->

        <!--<div
                        class="calorie_suggest flex-center fontSize26"
                        :class="{
                            calorie_suggest_normal: mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 0,
                            calorie_suggest_high: mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 1,
                        }"
                        v-if="mealsProposeAndNutrients"
                    >
                        <div>
                            <img
                                v-if="mealsProposeAndNutrients.nowMealsIntakeThan.ratio == -1"
                                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/plaint_icon.png"
                            />
                            <img
                                v-else-if="mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 1"
                                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/plaint_icon_red.png"
                            />
                        </div>

                        <div>
                            <div v-if="mealsProposeAndNutrients.nowMealsIntakeThan.ratio == -1">热量偏低, 建议增加</div>
                            <div v-else-if="mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 0">热量正常</div>
                            <div v-else-if="mealsProposeAndNutrients.nowMealsIntakeThan.ratio == 1">热量偏高, 建议减少</div>
                        </div>
                    </div>-->

        <div class="three_main" v-if="mealsProposeAndNutrients.newMealsMainNutritionList">
          <div class="title_wrapper flex-center">
            <div class="title">
              营养摄入分析
              <div class="bg-bottom"></div>
            </div>
            <div class="title_explain">(当餐)</div>
          </div>

          <div class="pieWrapper">
            <div id="myChart" :style="{ width: '100%', height: '4.6rem' }"></div>
          </div>

          <div class="legendRight flex">
            <div class="legendRight_item flex-center" v-for="(obj, i) in arr2" :key="i">
              <div class="colorSquare" :class="{ bgRed: i == 0, bgYellow: i == 1, bgGreen: i == 2 }"></div>
              <div>
                <div class="colorText" v-if="i == 0">偏高</div>
                <div class="colorText" v-else-if="i == 1">偏低</div>
                <div class="colorText" v-else>合适</div>
              </div>
            </div>
          </div>
          <div class="progressBox flex-between" v-if="progressData">
            <div class="carbo" v-for="(item, idx) in progressData" :key="idx">
              <div class="carbo_title">{{ item.nutritionName }}</div>
              <!-- :percentage="progressArr[0]" -->
              <div class="progressContent">
                <van-progress :color="item.color" :percentage="item.ratioValue" stroke-width="4" />
              </div>
              <div class="carbo_value"
                >{{ Math.round(item.intake) }}/{{ Math.round(item.recommend) }}{{ item.unit }}</div
              >
            </div>
          </div>
        </div>

        <div class="others" v-if="mealsProposeAndNutrients.allDayOtherNutrition">
          <div class="title_wrapper flex-center">
            <div class="title">
              其他营养摄入现状
              <div class="bg-bottom"></div>
            </div>
            <div class="title_explain">(全天)</div>
          </div>

          <div class="nutrition_box" v-if="otherProgressData">
            <div class="nutrition_item" v-for="(session, j) in otherProgressData" :key="j">
              <div class="top flex-between">
                <div class="nutritionName">{{ session.nutritionName }}</div>
                <div>
                  <div class="nutrition_item_value fontSize24" v-if="!session.surpassFlag">
                    {{ session.intake }}/{{ session.recommend }}{{ session.unit }}
                  </div>
                  <div v-else>{{ session.intake }}{{ session.unit }}</div>
                </div>
              </div>
              <div class="progressContent2">
                <van-progress :color="session.color" :percentage="session.ratioValue" stroke-width="4" />
              </div>
            </div>

            <div class="tipInfo">注: 因数据完整性有限，以上数据仅供参考</div>

            <!-- 展开/折叠按钮 
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
                            -->
          </div>
        </div>
      </div>

      <div v-else class="noData">
        <div v-if="!loading">
          <img src="https://lk-webfont.oss-cn-beijing.aliyuncs.com/web/xinao-health/images/meal/shanshi_noData.png" />
          <div class="text">暂无膳食数据</div>
        </div>
      </div>
    </div>

    <!--  -->
    <van-calendar
      v-model="show"
      @confirm="onConfirm"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="defaultDate"
      color="#1989fa"
    />

    <tips :value.sync="explainDialog" :title="title" :exp="exp" :duration="2000000">
      <div class="pd">
        {{ explanationNouns }}
      </div>

      <div @click="explainDialog = false" class="btn-confirm">知道了</div>
    </tips>
  </div>
</template>
<script>
  import FullLoading from "@/components/Loading";
  import { getDishesInfo, getMealsProposeAndNutrients } from "@/service/api";

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

  import Tips from "@/components/Tips";

  import { Toast } from "vant";

  import { adminLogin } from "@/service/ranking";

  import { mapState, useNavStore } from "@/pinia";

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
    directives: {},
    components: {
      FullLoading,
      Tips
    },
    data() {
      return {
        // defaultDate: new Date(),
        defaultDate: new Date(2022, 9, 26),
        noData: false,
        date: "",
        show: false,
        minDate: new Date(2022, 8, 1),
        maxDate: new Date(),
        time: "",
        // dishesInfo: null,
        // arr: [1,2,3,4,5,6],
        arr2: [1, 2, 3],
        // color1: '#f2826a',
        // valueArr: [
        //     { value: 300, name: '碳水化物' },
        //     { value: 120, name: '脂肪' },
        //     { value: 90, name: '蛋白质' }
        // ],
        progressArr: [],
        sum: "",
        mealsProposeAndNutrients: null,
        pieData: null,
        progressData: null,
        otherProgressData: null,
        isShowAll: true, // 营养元素折叠
        tableData: [],
        loading: false,
        explainDialog: false,
        title: "当餐推荐摄入",
        exp: 0,
        explanationNouns: "",
        questionMarkUrl: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/question.png",
        dietRemark: []
      };
    },
    computed: {
      ...mapState(useNavStore, ["onback"])
    },
    methods: {
      dancanExplain(name) {
        if (
          this.mealsProposeAndNutrients.nounExplanationDTOS &&
          this.mealsProposeAndNutrients.nounExplanationDTOS.length
        ) {
          for (let item of this.mealsProposeAndNutrients.nounExplanationDTOS) {
            if (item.name == name) {
              this.explanationNouns = item.explanation;
              this.title = item.name;
            }
          }
        }
        setTimeout(() => {
          this.explainDialog = true;
        }, 100);
      },
      formatDate(date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      },
      onConfirm(date) {
        this.show = false;
        this.time = this.formatDate(date);
        this.getMealsProposeAndNutrientsFn();
        //console.log("this.date", this.date);
      },
      /**
       * 列表展开按钮
       */
      expend() {
        const tableData = [...this.otherProgressData];
        this.tableData = tableData;
        this.isShowAll = false;
      },
      /**
       * 列表收起按钮
       */
      close() {
        const tableData = [...this.tableData].slice(0, 5);
        this.tableData = tableData;
        this.isShowAll = true;
      },
      translateProgressData(data) {
        let arr = [];
        for (let item of data) {
          let obj = {
            nutritionName: item.nutritionName,
            intake: item.intake,
            recommend: item.recommend,
            ratio: item.ratio,
            unit: item.unit,
            surpassFlag: false
          };
          if (obj.ratio == -1) {
            obj.color = "#F09918";
          } else if (obj.ratio == 0) {
            obj.color = "#16B57D";
          } else {
            obj.color = "#F55858";
          }
          if (obj.unit == "mg") {
            obj.unit = "毫克";
          }
          if (obj.unit == "g") {
            obj.unit = "克";
          }
          if (item.intake && item.intake != 0 && item.recommend != 0) {
            obj.ratioValue = Math.round((Number(item.intake) / Number(item.recommend)) * 100);
            if (obj.ratioValue > 100) {
              obj.ratioValue = 100;
              obj.surpassFlag = true;
            }
            // //console.log('nutritionName', item.nutritionName)
            // //console.log('obj.ratioValue', obj.ratioValue)
          } else {
            obj.ratioValue = 0;
          }
          arr.push(obj);
        }
        return arr;
      },
      translatePieData(data) {
        this.pieData = [];
        if (data && data.length > 0) {
          for (let item of data) {
            if (item.nutritionName == "碳水化合物") {
              item.nutritionName = "碳水化合物";
            }
            let obj = {
              value: item.intake,
              name: item.nutritionName
            };
            this.pieData.push(obj);
          }

          setTimeout(() => {
            this.drawPie();
          }, 50);
        }
      },
      getMealsProposeAndNutrientsFn() {
        this.loading = true;
        let _this = this;
        getMealsProposeAndNutrients({
          // dateStr: "2022-09-26",
          dateStr: this.time,
          dietEnum: this.$route.query.type
        })
          .then(({ code, data, message }) => {
            if (code === 0) {
              this.loading = false;

              this.mealsProposeAndNutrients = data;

              this.translatePieData(data.newMealsMainNutritionList);

              this.progressData = this.translateProgressData(data.newMealsMainNutritionList);

              let otherProgressData = [];
              for (let obj of data.allDayOtherNutrition) {
                if (obj.nutritionName == "维生素C") {
                  otherProgressData.push(obj);
                } else if (obj.nutritionName == "维生素E") {
                  otherProgressData.push(obj);
                } else if (obj.nutritionName == "钙") {
                  otherProgressData.push(obj);
                } else if (obj.nutritionName == "钾") {
                  otherProgressData.push(obj);
                } else if (obj.nutritionName == "铁") {
                  otherProgressData.push(obj);
                } else if (obj.nutritionName == "锌") {
                  otherProgressData.push(obj);
                }
              }
              this.otherProgressData = this.translateProgressData(otherProgressData);
              let str = this.mealsProposeAndNutrients.dietRemark;
              if (this.mealsProposeAndNutrients.dietRemark.indexOf("$") > -1) {
                this.dietRemark.push(str.substring(0, str.indexOf("$")));
                this.dietRemark.push(str.substring(str.indexOf("$") + 1, str.lastIndexOf("$")));
                this.dietRemark.push(str.substring(str.lastIndexOf("$") + 1, str.length));
              }
            } else {
              //console.log("getDishesInfo", message);
            }
          })
          .catch(ex => {
            this.loading = false;
          });
      },
      // sumFn(num, valueArr) {
      //     let sum = 0;
      //     let radio = 0;
      //     for (let item of valueArr) {
      //         sum += Number( item.value );
      //     }
      //     this.sum = sum;
      //     radio = Math.round( Number(valueArr[num].value) / sum * 100 );
      //     return radio;
      // },
      drawPie() {
        let myChart = echarts.init(document.getElementById("myChart"));
        var option;
        let imgUrl = this.questionMarkUrl;
        // //console.log('this.pieDataxx', this.pieData)
        option = {
          series: [
            {
              name: "",
              type: "pie",
              radius: "50%",
              center: ["45%", "45%"],
              clickable: false,
              // data: this.pieData,
              label: {
                show: true
              },
              labelLine: {
                normal: {
                  length: 2, //第一条线
                  length: 3, //第二条线
                  lineStyle: {
                    width: 1 // 线条的宽度
                    // color: "#000", //线的颜色设置， 如没有设置颜色则线条的颜色跟随饼状图的颜色
                  }
                }
              },

              data: [
                {
                  value: this.pieData[0].value,
                  name: this.pieData[0].name,
                  label: {
                    formatter: ["{title|{b}}{abg|}"].join("\n"),
                    rich: {
                      title: {
                        color: "#333",
                        align: "center"
                      },
                      abg: {
                        backgroundColor: {
                          image: imgUrl
                        },
                        width: 20,
                        align: "left",
                        height: 20
                      }
                    }
                  }
                },
                {
                  value: this.pieData[1].value,
                  name: this.pieData[1].name,
                  label: {
                    formatter: ["{title|{b}}{abg|}"].join("\n"),
                    rich: {
                      title: {
                        color: "#333",
                        align: "center"
                      },
                      abg: {
                        backgroundColor: {
                          image: imgUrl
                        },
                        width: 20,
                        align: "left",
                        height: 20
                      }
                    }
                  }
                },
                {
                  value: this.pieData[2].value,
                  name: this.pieData[2].name,
                  label: {
                    formatter: ["{abg|}{title|{b}}"].join("\n"),
                    rich: {
                      title: {
                        color: "#333",
                        align: "center"
                      },
                      abg: {
                        backgroundColor: {
                          image: imgUrl
                        },
                        width: 20,
                        align: "right",
                        height: 20
                      }
                    }
                  }
                }
              ]
            }
          ]
        };
        myChart.clear();

        let _this = this;
        myChart.on("click", "series.pie.label", function (param) {
          //添加点击事件
          //console.log("param", param);
          _this.dancanExplain(param.name);
        });
        // myChart.on('click', 'series.pie.label', function(param) { //添加点击事件
        option && myChart.setOption(option);
      },
      getDishesInfoFn() {
        getDishesInfo().then(({ code, data, message }) => {
          if (code === 0) {
            this.dishesInfo = data.dataList;
          } else {
            //console.log("getDishesInfo", message);
          }
        });
      }

      //   handleLoginBtn() {
      //     const params = {
      //       accountNumber: "17688888888",
      //       companyId: 240, // 240
      //       companyPid: 10,
      //       password: "123456"
      //     };
      //     adminLogin(params)
      //       .then(res => {
      //         if (res.code === 1000) {
      //           // localStorage.setItem("userInfo", JSON.stringify(res.data));
      //           localStorage.setItem("accessToken", res.data.accessToken);
      //         } else {
      //           this.$message.error(res.msg);
      //         }
      //       })
      //       .catch(err => {
      //         //console.log(err);
      //       });
      //   }
      // },
      // watch: {},
    },
    mounted() {
      // this.handleLoginBtn();
      this.zgStatistics("健康新奥-进入页面", { 来源: "推送", 页面名称: "膳食建议", 所属功能模块: "健康" });
      if (this.$route.query.date) {
        // 从消息页面进入
        this.time = this.$route.query.date;
      } else {
        // 从我的页面进入
        this.time = dayjs().format("YYYY-MM-DD");
      }
      if (this.$route.query.type) {
      } else {
        this.$route.query.type = "wucan";
      }

      this.getDishesInfoFn();

      this.getMealsProposeAndNutrientsFn();

      // this.progressArr.push( this.sumFn(0, this.valueArr) );
      // this.progressArr.push( this.sumFn(1, this.valueArr) );
      // this.progressArr.push( this.sumFn(2, this.valueArr) );

      // 监听返回事件
      this.onback(() => {
        if (this.$route.query.date) {
          this.$router.replace("/health");
        } else {
          this.$router.replace("/mine");
        }
      });

      let year = Number(dayjs(this.time).year());
      let month = Number(dayjs(this.time).month());
      let day = Number(dayjs(this.time).date());
      // //console.log('year', year, 'month', month, 'day', day)
      this.defaultDate = new Date(year, month, day);
      // this.defaultDate = new Date(2022, 8, 26);
      // //console.log('this.defaultDate', this.defaultDate);
      // //console.log('this.minDate', this.minDate);

      // 本次就餐摄入$碳水不足、蛋白质不足、脂肪较多$，长期可导致情绪焦虑

      // var str = "aaabbbfff";
      // var str = "本次就餐摄入$碳水不足、蛋白质不足、脂肪较多$，长期可导致情绪焦虑";
      // //console.log('strxxxx', str.indexOf('$'));

      // //console.log('string.substring(start,stop)', str.substring( str.lastIndexOf('$') + 1, str.length ))
      // //console.log('stryyyy', str.lastIndexOf('$') );
      // str.lastIndexOf(
      // //console.log('xxxafadf', this.subStringMulti(str))
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../style/meal.css";
  .marginTop12 {
    margin-top: 12px;
  }
  .fontSize26 {
    font-size: 26px;
    color: #737782;
  }
  .fontSize26 {
    font-size: 24px;
  }
  .colorRed {
    color: #f55858 !important;
  }
  .colorGreen {
    color: #16b57d !important;
  }
  .colorYellow {
    color: #f09918 !important;
  }
  .bgRed {
    background: #f55858 !important;
  }
  .bgGreen {
    background: #16b57d !important;
  }
  .bgYellow {
    background: #f09918 !important;
  }
  .title {
    position: relative;
    display: inline-block;
    font-size: 30px;
    .bg-bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 12px;
      background: #4b7aff;
      opacity: 0.3;
    }
  }

  .title_wrapper {
    margin: 0;
    .title_explain {
      font-size: 26px;
      margin-left: 8px;
    }
  }
  .container {
    .noData {
      height: calc(100vh - 240px);
      font-size: 32px;
      text-align: center;
      line-height: 1.5;
      // padding-top: 240px;
      overflow: hidden;
      background: #fff;
      font-size: 28px;
      font-weight: 400;
      color: #565961;
      line-height: 40px;
      img {
        width: 502px;
        height: 336px;
        margin-top: 264px;
      }
      .text {
        margin-top: -40px;
      }
    }
    background: #f0f2f7;
    width: 100%;
    height: auto;
    /*height: 100%;*/
    padding: 20px;
    .repastCondition {
      font-size: 30px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1c1c1e;
      text-align: left;
      line-height: 42px;
      width: 710px;
      padding: 22px 24px;
      /* height: 238px; */
      background: #ffffff;
      border-radius: 16px;
      .content {
        padding: 0 48px 0 46px;
        text-align: center;
        margin-top: 40px;
        line-height: 40px;
        .middle {
          .meal_intake_value {
            color: #f09918;
            .value_level {
              border: 1px solid #f09918;
              font-size: 20px;
              border-radius: 4px;
              line-height: 32px;
              margin-right: 4px;
              background: #fdf4e7;
            }
          }
          .colorRed {
            color: #f55858;
          }
          .colorGreen {
            color: #16b57d;
          }
        }
        .right {
          .questionMarkUrl {
            width: 40px;
            height: 40px;
            vertical-align: top;
          }
        }
      }
      .dietRemark {
        margin-top: 32px;
        border-top: 2px solid #f2f4f8;
        padding-top: 24px;
      }
    }
    .meal_time {
      margin-bottom: 20px;
      height: 88px;
      padding: 0 24px;
      .title_spec {
        height: 88px;
        line-height: 88px;
      }
      .rili_icon {
        width: 40px;
        height: 40px;
        margin-right: 24px;
      }
      .time_icon {
        img {
          width: 12px;
          height: 22px;
        }
      }
    }
    .meal_suggest {
      margin-top: 20px;
      border-radius: 16px 16px 0 0;
      height: auto;
      .dishesvarietyBox {
        overflow-x: scroll;
      }

      .dishesvariety {
        position: relative;
        width: 204px;
        margin-top: 28px;
        flex-shrink: 0;
        margin-right: 20px;
        img {
          width: 100%;
          height: 148px;
          border-radius: 8px;
        }
        .foodName {
          position: absolute;
          left: 0;
          width: 100%;
          text-align: center;
          height: 44px;
          top: 104px;
          color: #ffffff;
          line-height: 44px;
          font-size: 24px;
          z-index: 105;
        }
        .opacityBg {
          position: absolute;
          left: 0px;
          top: 104px;
          width: 100%;
          height: 44px;
          border-radius: 0px 0px 8px 8px;
          z-index: 100;
          background: rgba(0, 0, 0, 0.4);
        }

        .foodNum {
          font-size: 28px;
          line-height: 40px;
          position: relative;
          z-index: 500;
          text-align: center;
          position: relative;
          color: #f86e11;
        }
      }

      .dishesvariety:last-child {
        margin-right: 0;
      }
    }
    .calorie_suggest {
      width: 710px;
      height: 64px;
      background: #fdf4e7;
      border-radius: 0px 0px 8px 8px;
      justify-content: center;
      color: #f09918;
      img {
        width: 32px;
        height: 28px;
        margin-right: 8px;
      }
    }
    .calorie_suggest_normal {
      background: #e7f7f2;
      color: #16b57d;
    }
    .calorie_suggest_high {
      background: #feeeee;
      color: #f55858;
    }
    .calorie_suggest_low {
      background: #feeeee;
      color: #f09918;
    }
    .three_main {
      width: 710px;
      // height: 666px;
      padding: 24px;
      background: #ffffff;
      border-radius: 16px;
      margin-top: 20px;
      .pieWrapper {
        margin-top: 25px;
        position: relative;

        /* <div class="legendRight">
                    <div class="legendRight_item">
                        <div class="colorSquare"></div>
                        <div class="colorText">偏高</div>
                    </div>
                </div> */
      }
      .legendRight {
        // position: absolute;
        // top: 0px;
        // right: 0px;
        height: 34px;
        font-size: 24px;
        color: #9195a1;
        margin-bottom: 24px;
        padding-top: 40px;
        // margin-top: 24px;
        justify-content: flex-end;
        border-top: 1px solid #d1d3d6;
        .legendRight_item {
          margin-right: 44px;
          .colorSquare {
            width: 20px;
            height: 20px;
            background: #f55858;
            margin-right: 8px;
          }
        }
        .legendRight_item:last-child {
          margin-right: 0px;
        }
      }
      .progressBox {
        /* 80px 110px 手机适配 */
        // margin-top: -100px;
        font-size: 24px;
        line-height: 34px;
        .carbo {
          width: 200px;
        }
        .carbo_title {
          text-align: left;
        }
        .carbo_value {
          text-align: right;
        }
        .progressContent {
          margin: 8px 0;
        }
        .carbo_value {
          position: relative;
        }
      }
    }

    .others {
      width: 710px;
      height: 268px;
      height: auto;
      background: #ffffff;
      border-radius: 16px;
      margin-top: 20px;
      padding: 24px;
      .nutrition_box {
        /* margin-top: 26px; */
        .nutrition_item {
          height: 42px;
          font-size: 28px;
          margin-top: 24px;
          padding-right: 16px;
          .nutritionName {
            /* min-width: 40px;
                        flex-shrink: 0; */
            position: relative;
          }
          .top {
            margin-bottom: 8px;
          }
          .progressContent2 {
            width: 440px;
            width: 100%;
          }
          .nutrition_item_value {
            position: relative;
            /* width: 144px;
                        flex-shrink: 0; */
          }
        }

        /* .nutrition_item:last-child{
                    margin-bottom: 0px;
                } */
        /* .nutrition_item:nth-last-child(1){
                    margin-bottom: 0px;
                } */
      }
    }
    .tipInfo {
      font-size: 28px;
      color: #9195a1;
      margin-top: 40px;
      line-height: 40px;
    }
    .expend-box {
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

  .containerHeightauto {
    height: auto;
  }

  .pd {
    padding: 0 48px;
    font-size: 28px;
    font-weight: 400;
    color: #1c1c1e;
    line-height: 48px;
    text-align: left;
  }
  .btn-confirm {
    width: 440px;
    height: 88px;
    background: #4b7aff;
    border-radius: 50px;
    line-height: 88px;
    color: #fff;
    margin: 40px auto 30px;
    font-size: 32px;
  }
</style>
