<template>
  <div class="container">
    <div class="radarWrapper" :class="{ radarWrapper3: idx == 3 }" v-if="valueArr">
      <div class="dateBox" @click="dateVisible = true">
        <img
          src="https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20221212150338J8O6.png?Expires=2301548619&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=wBztPQw2R3WwmklA37VBB7Rytpk%3D"
        />
        <div class="date">{{ date }}</div>
        <div class="arrow_down">
          <van-icon name="arrow-down" />
        </div>
      </div>
      <div id="myChart" :style="{ width: '100%', height: '280px' }"></div>

      <div>
        <div class="text_explain flex" v-if="idx != 3">
          <div class="tuijian">
            <div class="sandian">...</div>
            <div>推荐摄入量</div>
          </div>
          <div class="shiji">—实际摄入量</div>
        </div>

        <div class="text_explain flex text_explain2" v-else>
          <div class="tuijian">
            <div class="sandian">...</div>
            <div>推荐摄入量</div>
          </div>
          <div class="shiji">—实际摄入量</div>
        </div>
      </div>
    </div>
    <div id="player-con"></div>

    <div class="content-wrapper">
      <div class="tab__main">
        <div class="tab__div">
          <ul class="tab__list">
            <li
              class="tab__item"
              :class="{ activeTab: index == idx }"
              v-for="(tabs, index) in tab_content"
              :key="tabs.tab_menu"
              @click="tabClick(index)"
            >
              <span>{{ tabs.tab_menu }}</span>
              <div v-if="idx == index" class="bottom_line" ref="bottomLine"></div>
            </li>
          </ul>
        </div>
      </div>

      <bite-item v-if="zaocanRecommend" :zaocanRecommend="zaocanRecommend"></bite-item>

      <div style="padding-right: 0.16rem">
        <!-- v-if="zaocanRecommend && (idx==3)" -->
        <div class="bottom flex" v-if="zaocanRecommend && idx == 3">
          <div class="biteItem" v-for="(item, seri) in zaocanRecommend" :key="seri">
            <div v-if="seri == 0" class="title">饮食方案一</div>
            <div v-if="seri == 1" class="title">饮食方案二</div>
            <div v-if="seri == 2" class="title">饮食方案三</div>

            <div class="dishesvarietyBox flex-between">
              <div class="dishesvariety" @click="toDetail(item.douyudanrou_name, 2)" v-if="item.douyudanrou_name">
                <div><img :src="item.douyudanrou_pic" /></div>
                <div class="foodName">{{ item.douyudanrou_name }}</div>
                <div class="opacityBg"></div>
                <p class="foodNum"
                  >{{ item.douyudanrou_Suggest.name }}{{ Math.round(item.douyudanrou_Suggest.weight) }}g</p
                >
              </div>

              <div class="dishesvariety" @click="toDetail(item.shucai_name, 2)" v-if="item.shucai_name">
                <div><img :src="item.shucai_pic" /></div>
                <div class="foodName">{{ item.shucai_name }}</div>
                <div class="opacityBg"></div>
                <p class="foodNum">{{ item.shucai_Suggest.name }}{{ Math.round(item.shucai_Suggest.weight) }}g</p>
              </div>

              <div class="dishesvariety" @click="toDetail(item.zhushi_name, 2)" v-if="item.zhushi_name">
                <div><img :src="item.zhushi_pic" /></div>
                <div class="foodName">{{ item.zhushi_name }}</div>
                <div class="opacityBg"></div>
                <p class="foodNum">{{ item.zhushi_Suggest.name }}{{ Math.round(item.zhushi_Suggest.weight) }}g</p>
              </div>

              <div class="dishesvariety" v-if="item.jianguozhongzi_name">
                <div v-if="item.jianguozhongzi_name" @click="toDetail(item.jianguozhongzi_name, 2)">
                  <div><img :src="item.jianguozhongzi_pic" /></div>
                  <p class="foodNum">{{ item.jianguozhongzi_name }}</p>
                </div>

                <div v-else>
                  <div>
                    <img
                      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/placeholderImg.png"
                    />
                  </div>
                  <p class="foodNum">坚果</p>
                </div>
              </div>
              <div class="dishesvariety" v-if="item.nai_name">
                <div v-if="item.nai_name" @click="toDetail(item.nai_name, 2)">
                  <div><img :src="item.nai_pic" /></div>
                  <p class="foodNum">{{ item.nai_name }}</p>
                </div>

                <div v-else>
                  <div>
                    <img
                      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/placeholderImg.png"
                    />
                  </div>
                  <p class="foodNum">奶类</p>
                </div>
              </div>

              <div class="dishesvariety" v-if="item.shuiguo_name">
                <div v-if="item.shuiguo_name" @click="toDetail(item.shuiguo_name, 2)">
                  <div><img :src="item.shuiguo_pic" /></div>
                  <p class="foodNum">{{ item.shuiguo_name }}</p>
                </div>

                <div v-else>
                  <div>
                    <img
                      src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/placeholderImg.png"
                    />
                  </div>
                  <p class="foodNum">水果</p>
                </div>
              </div>
            </div>
          </div>

          <div class="placeholderBox"></div>
        </div>
      </div>

      <div class="foodSuggest" v-if="zaocanRecommend">
        <div class="suggest bottom">
          <!-- <div class="title">
                摄入量建议
                <div class="bottom-bg"></div>
              </div> -->

          <div class="title title2">
            摄入量记录(可点击)
            <div class="bottom-bg"></div>
          </div>

          <div
            class="drapWrapper flex-between"
            v-for="(objItem, index2) in zaocanValueArr[idx]"
            :key="index2"
            :class="{
              color_1: zaocanValueArr[idx][index2].name == '快捷拖动',
              color_2: zaocanValueArr[idx][index2].name == '谷薯摄入' || zaocanValueArr[idx][index2].name == '坚果摄入',
              color_3:
                zaocanValueArr[idx][index2].name == '豆鱼蛋肉摄入' || zaocanValueArr[idx][index2].name == '奶类摄入',
              color_4: zaocanValueArr[idx][index2].name == '蔬菜摄入' || zaocanValueArr[idx][index2].name == '水果摄入',
              color_5: zaocanValueArr[idx][index2].name == '油脂类摄入'
            }"
          >
            <img v-if="idx != 3 && zaocanValueArr[0]" class="handleImg" :src="zaocanValueArr[0][index2].img" />

            <img v-else class="handleImg" :src="zaocanValueArr[idx][index2].img" />

            <div class="hualunBox">
              <div v-if="index2 == 0" class="shortCut">{{ objItem.name }}</div>
              <!-- 快捷键 -->

              <div class="itemType" v-if="index2 != 0">
                <div class="item-name" :class="{ itemName2: index2 == 2, itemName3: index2 == 3 }">{{
                  objItem.name
                }}</div>
                <div class="item-bg" :class="{ itemBg2: index2 == 2, itemBg3: index2 == 3 }"></div>
              </div>

              <div class="slideBox">
                <!-- :max="zaocanValueArr[idx][index2].max" -->
                <!-- v-model="zaocanValueArr[idx][index2].value"  -->

                <van-slider
                  bar-height="6px"
                  :disabled="zaocanValueArr[idx][0].isClock"
                  active-color="#FAB657"
                  v-model="zaocanValueArr[idx][index2].value"
                  :min="0"
                  :max="zaocanValueArr[idx][index2].max"
                  @change="onChange1(index2)"
                >
                  <template #button>
                    <div class="custom-button">{{ zaocanValueArr[idx][index2].value }}</div>
                  </template>
                </van-slider>
              </div>
              <div class="scaleplate flex-between">
                <div class="left" style="font-size: 0px">0</div>

                <div>
                  <div class="right" v-if="zaocanValueArr[idx][index2].name == '快捷拖动'">200%</div>

                  <!-- 截取 -->
                  <div v-else>
                    <div>
                      <div class="right" v-if="zaocanValueArr[idx][index2].max > 200">
                        {{
                          Math.round(
                            ((zaocanValueArr[idx][index2].value / 2) * zaocanValueArr[idx][index2].standardWeight) / 100
                          )
                        }}
                      </div>
                      <div class="right" v-else>{{ zaocanValueArr[idx][index2].standardWeight }}</div>
                    </div>
                  </div>
                </div>

                <div class="pointBox" v-if="zaocanValueArr[idx][index2].name == '快捷拖动'">
                  <div class="point">
                    {{ zaocanValueArr[idx][index2].value }}%
                    <span class="introjs-arrow"></span>
                  </div>
                </div>

                <div class="pointBox" v-else>
                  <div class="point">
                    {{
                      Math.round(
                        ((zaocanValueArr[idx][index2].value / 2) * zaocanValueArr[idx][index2].standardWeight) / 100
                      )
                    }}g

                    <span class="introjs-arrow"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="save-btn" @click="saveHandle" v-if="!isSvaeArr[idx].isFlag">保存</div>

    <tips :value.sync="saveSuccess" :exp="exp" :duration="2000"> 打卡成功健康积分+{{ exp }} </tips>

    <van-calendar
      v-model="dateVisible"
      @confirm="onConfirm"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="defaultDate"
      color="#1989fa"
    />

    <full-loading :loading="loading" />
  </div>
</template>
<script>
  import {
    getUserDietRecord,
    saveUserDietRecord,
    getUserMeals,
    getUserMealsRecommand,
    dinnerRecommend,
    riskWarning
  } from "@/service/api";
  // import * as echarts from "echarts";
  import { Toast } from "vant";

  import VueSlide from "@/components/VueSlide";

  import { formatTimeForBirth, formatVideoTime } from "@/utils/commonFun";

  // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
  import * as echarts from "echarts/core";
  // 引入雷达图图图表，图表后缀都为 Chart
  import { RadarChart } from "echarts/charts";
  // 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
  } from "echarts/components";
  // 标签自动布局，全局过渡动画等特性
  import { LabelLayout, UniversalTransition } from "echarts/features";
  // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
  import { CanvasRenderer } from "echarts/renderers";

  // 注册必须的组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    RadarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
  ]);

  import BiteItem from "./components/BiteItem";

  import { hUrl } from "@/config/env";

  import Tips from "@/components/Tips";

  import FullLoading from "@/components/Loading";

  export default {
    directives: {},
    components: {
      VueSlide,
      BiteItem,
      Tips,
      FullLoading
    },
    data() {
      return {
        paramDate: "",
        minDate: new Date(2022, 1, 1),
        maxDate: new Date(),
        dateVisible: false,
        defaultDate: null,
        date: "",
        isFalse: false,
        loading: false,
        tab_content: [{ tab_menu: "早餐" }, { tab_menu: "中餐" }, { tab_menu: "晚餐" }, { tab_menu: "加餐" }],
        idx: 0,
        zaocanRecommend: null,
        recommendData: null,
        recordData: {},
        isSvaeArr: [
          {
            text: "保存",
            isFlag: true
          },
          { text: "保存", isFlag: true },
          { text: "保存", isFlag: true },
          {
            text: "保存",
            isFlag: true
          }
        ],
        indicatorArr: [],
        valueArr: null,
        doubleArr: [],
        singleArr: [],
        constWeight: 250,
        zaocanValueArr: [null, null, null, null],
        nutritionTypeList: {
          shortcut: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/kuaijie.png",
          gushu:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202212121405471H2O.png?Expires=2301545147&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=VqC5WQrCz1fpieWb8nh593MHwDA%3D",
          douyu:
            "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20221212140632RF91.png?Expires=2301545192&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=%2BvIwGDbkdf7WGnEeFjJ5yacwDiw%3D",
          shucai: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/shucai.png",
          oil: "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202212110941264a44.png?Expires=2301442886&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=5FgEnxImNR0%2B7nOEZSAWz2gnqj0%3D",
          jianguo: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/jianguo.png",
          nai: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/nai.png",
          shuiguo: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/shuiguo.png"
        },
        deviceWidth: 375,
        exp: 1,
        saveSuccess: false
      };
    },
    methods: {
      toDetail(name, type) {
        localStorage.setItem("extraindex", 3);
        this.$router.push({ path: "/dietDetail", query: { type, name } });
      },
      saveHandle() {
        if (this.idx == 0 && this.isZaocanFlag) {
          return false;
        } else if (this.idx == 1 && this.isWucanFlag) {
          return false;
        } else if (this.idx == 2 && this.isWancanFlag) {
          return false;
        } else if (this.idx == 3 && this.isJiacanFlag) {
          return false;
        }
        this.saveUserDietRecordFn(this.idx);
      },
      saveUserDietRecordFn(dietEnum) {
        let data = null;
        if (this.idx != 3) {
          data = {
            dietEnum: dietEnum,
            dateStr: this.paramDate,
            stapleIntake: Number(
              ((this.zaocanValueArr[this.idx][1].value * this.zaocanValueArr[this.idx][1].weight) / 100).toFixed(2)
            ),
            stapleRecommend: this.zaocanValueArr[this.idx][1].weight,
            beanfishIntake: Number(
              ((this.zaocanValueArr[this.idx][2].value * this.zaocanValueArr[this.idx][2].weight) / 100).toFixed(2)
            ),
            beanfishRecommend: this.zaocanValueArr[this.idx][2].weight,
            vegetableIntake: Number(
              ((this.zaocanValueArr[this.idx][3].value * this.zaocanValueArr[this.idx][3].weight) / 100).toFixed(2)
            ),
            vegetableRecommend: this.zaocanValueArr[this.idx][3].weight,
            cookingOilIntake: Number(
              ((this.zaocanValueArr[this.idx][4].value * this.zaocanValueArr[this.idx][4].weight) / 100).toFixed(2)
            ),
            cookingOilRecommend: this.zaocanValueArr[this.idx][4].weight
          };
        } else {
          data = {
            dietEnum: dietEnum,
            dateStr: this.paramDate,
            nutIntake: Number(
              ((this.zaocanValueArr[this.idx][1].value * this.zaocanValueArr[this.idx][1].weight) / 100).toFixed(2)
            ),
            nutRecommend: this.zaocanValueArr[this.idx][1].weight,
            milkIntake: Number(
              ((this.zaocanValueArr[this.idx][2].value * this.zaocanValueArr[this.idx][2].weight) / 100).toFixed(2)
            ),
            milkRecommend: this.zaocanValueArr[this.idx][2].weight,
            fruitIntake: Number(
              ((this.zaocanValueArr[this.idx][3].value * this.zaocanValueArr[this.idx][3].weight) / 100).toFixed(2)
            ),
            fruitRecommend: this.zaocanValueArr[this.idx][3].weight,
            cookingOilIntake: 0,
            cookingOilRecommend: 0
          };
        }
        saveUserDietRecord(data).then(({ code, data, message }) => {
          if (code === 0) {
            if (this.idx == 1) {
              this.dinnerRecommendFn();
              this.riskWarningFn();
            }
            this.isSvaeArr[this.idx].isFlag = true;
            if (data.isAddPoints) {
              this.exp = data.healthPoints;
              this.saveSuccess = true;
            }
            this.zgStatistics("健康新奥-点击保存", { 页面种类: "摄入量记录", 页面名称: "完成打卡" });
            this.getUserDietRecordFn(this.idx, this.paramDate);
            this.zgStatistics("健康新奥-摄入量记录-点击完成打卡", {
              餐次类别: this.tab_content[this.idx].tab_menu
            });
          } else {
          }
        });
      },
      transLatRadarArr(obj, idx, name, intake) {
        let weight = this.initWeight(obj, intake);
        if (intake && intake > weight * 2) {
          this.doubleArr.push(intake);
        } else {
          this.doubleArr.push(weight * 2);
        }
        this.singleArr.push(weight);
        this.indicatorArr[idx] = {};
        this.indicatorArr[idx].max = weight * 2;
        this.indicatorArr[idx].name = name;
      },
      translateRadarData(k, obj1, obj2, obj3, obj4) {
        let name = "";
        let intake = 0;
        for (let i = 0; i < k; i++) {
          if (i == 0) {
            if (obj1.name == "蔬菜类") {
              name = "蔬菜";
              intake = this.recordData.vegetableIntake;
            } else if (obj1.name == "坚果") {
              name = "坚果";
              intake = this.recordData.nutIntake;
            }
            this.transLatRadarArr(obj1, i, name, intake);
          } else if (i == 1) {
            if (obj2.name == "豆鱼蛋肉") {
              name = "豆鱼蛋肉";
              intake = this.recordData.beanfishIntake;
            } else if (obj2.name == "奶类") {
              name = "奶类";
              intake = this.recordData.milkIntake;
            }
            this.transLatRadarArr(obj2, i, name, intake);
          } else if (i == 2) {
            if (obj3.name == "主食") {
              name = "谷薯";
              intake = this.recordData.stapleIntake;
            } else if (obj3.name == "水果类") {
              name = "水果";
              intake = this.recordData.fruitIntake;
            }
            this.transLatRadarArr(obj3, i, name, intake);
          } else if (i == 3) {
            name = "油脂";
            intake = this.recordData.cookingOilIntake;
            this.transLatRadarArr(obj4, i, name, intake);
          }
        }
      },
      transLatZao(data) {
        if (data.shucai_Suggest) {
          this.translateRadarData(
            4,
            data.shucai_Suggest,
            data.douyudanrou_Suggest,
            data.zhushi_Suggest,
            data.you_Suggest
          );
        } else {
          this.translateRadarData(3, data.jianguozhongzi_Suggest, data.nai_Suggest, data.shuiguo_Suggest);
        }
      },
      transLateRadar(data, type) {
        this.valueArr = [0, 0, 0, 0];
        this.doubleArr = [];
        this.singleArr = [];
        this.indicatorArr = [];
        if (type == 1) {
          // 有膳食记录 stapleRecommend谷薯推荐
          if (data.stapleIntake) {
            this.valueArr.splice(0, 1, data.vegetableIntake);
            this.valueArr.splice(1, 1, data.beanfishIntake);
            this.valueArr.splice(2, 1, data.stapleIntake);
            this.valueArr.splice(3, 1, data.cookingOilIntake);
          } else {
            this.valueArr.splice(0, 1, data.nutIntake);
            this.valueArr.splice(1, 1, data.milkIntake);
            this.valueArr.splice(2, 1, data.fruitIntake);
          }
        }
        this.recordData = JSON.parse(JSON.stringify(data));
        this.transLatZao(this.zaocanRecommend[0]);
        setTimeout(() => {
          this.drawRadar();
        }, 50);
      },
      dinnerRecommendFn() {
        dinnerRecommend().then(() => {});
      },
      riskWarningFn() {
        riskWarning().then(() => {
          // // console.log(11)
        });
      },
      getUserDietRecordFn(type, date) {
        getUserDietRecord({
          date: date,
          dietEnum: type
        }).then(({ code, data, message }) => {
          if (code === 0) {
            if (data && data.length) {
              // 有膳食记录
              this.isSvaeArr[type].isFlag = true;
              this.recordData = data[0];
              this.initData(this.recommendData);
              this.zaocanValueArr[type][0].isClock = true;
              this.transLateRadar(data[0], 1); // 有膳食记录
              this.transLateSlide(type, data); // 计算回显数据
            } else {
              // 无膳食记录
              this.initData(this.recommendData);
              this.isSvaeArr[type].isFlag = false;
              this.isSvaeArr[type].text = "保存";
              this.zaocanValueArr[type][0].isClock = false;
              this.transLateRadar(this.zaocanRecommend[0], 0);
            }
            this.resetPosition();
            setTimeout(() => {
              this.loading = false;
            }, 500);
          } else {
            // Toast(message)
          }
        });
      },
      valueCount(intake, recommend) {
        let value = 0;
        if (intake) {
          value = Math.round((intake / recommend) * 100);
        }
        return value;
      },
      transLateSlide(index, data) {
        // 处理滑动关系
        let arr = this.zaocanValueArr[index];
        for (let i = 0; i < this.zaocanValueArr[index].length; i++) {
          let value = 0;
          if (arr[i].name == "谷薯摄入") {
            value = this.valueCount(data[0].stapleIntake, data[0].stapleRecommend);
          } else if (arr[i].name == "豆鱼蛋肉摄入") {
            value = this.valueCount(data[0].beanfishIntake, data[0].beanfishRecommend);
          } else if (arr[i].name == "蔬菜摄入") {
            value = this.valueCount(data[0].vegetableIntake, data[0].vegetableRecommend);
          } else if (arr[i].name == "油脂类摄入") {
            value = this.valueCount(data[0].cookingOilIntake, data[0].cookingOilRecommend);
          } else if (arr[i].name == "坚果摄入") {
            value = this.valueCount(data[0].nutIntake, data[0].nutRecommend);
          } else if (arr[i].name == "奶类摄入") {
            value = this.valueCount(data[0].milkIntake, data[0].milkRecommend);
          } else if (arr[i].name == "水果摄入") {
            value = this.valueCount(data[0].fruitIntake, data[0].fruitRecommend);
          }
          this.zaocanValueArr[this.idx][i].left = Math.round(this.transLateLeft(value));
          this.zaocanValueArr[this.idx][i].value = Math.round(value);
        }
      },
      resetPosition() {
        let pointBoxArr = document.getElementsByClassName("pointBox");
        for (let i = 0; i < this.zaocanValueArr[this.idx].length; i++) {
          if (this.zaocanValueArr[this.idx][i]) {
            setTimeout(() => {
              pointBoxArr[i].style.left = this.zaocanValueArr[this.idx][i].left + "px";
            }, 100);
          }
        }
        // 注意定时器100这个时间参数
      },
      // 调试滑块及机型兼容性代码
      transLateLeft(value) {
        let left = 0;
        left = ((value / 200) * 512 - 30) / 2;
        let value1 = 210;
        let radioValue = this.deviceWidth / 375;
        if (this.deviceWidth == 375) {
          if (value >= 181) {
            left = value1;
          }
        } else if (this.deviceWidth <= 360) {
          if (value >= 181) {
            left = value1 * radioValue;
          } else {
            left = left - 8 * radioValue;
          }
        } else if (this.deviceWidth > 375) {
          if (value >= 181) {
            left = value1 * radioValue;
          } else {
            left = left - 8 * radioValue;
          }
        }
        return left;
      },
      onChange1(type) {
        let value = this.zaocanValueArr[this.idx][type].value;
        let left = this.transLateLeft(value);
        this.zaocanValueArr[this.idx][type].left = left;
        let pointBoxArr = document.getElementsByClassName("pointBox");
        if (pointBoxArr[type]) {
          pointBoxArr[type].style.left = left + "px";
        }
        if (type == 0) {
          for (let i = 0; i < this.zaocanValueArr[this.idx].length; i++) {
            if (this.zaocanValueArr[this.idx][i]) {
              pointBoxArr[i].style.left = left + "px";
              this.zaocanValueArr[this.idx][i].value = value;
            }
          }
        }
        let typeName = "";
        if (this.idx != 3) {
          if (type == 0) {
            typeName = "快捷拖动";
          } else if (type == 1) {
            typeName = "坚果摄入";
          } else if (type == 2) {
            typeName = "奶类摄入";
          } else if (type == 3) {
            typeName = "水果摄入";
          }
        } else {
          if (type == 0) {
            typeName = "快捷拖动";
          } else if (type == 1) {
            typeName = "谷薯摄入";
          } else if (type == 2) {
            typeName = "豆鱼蛋肉摄入";
          } else if (type == 3) {
            typeName = "蔬菜摄入";
          }
        }
        this.zgStatistics("健康新奥-摄入量记录-操作", {
          操作名称: "",
          摄入类别: typeName,
          餐次类别: this.tab_content[this.idx].tab_menu
        });
      },
      initWeight(obj) {
        if (obj && obj.weight) {
          return obj.weight;
        } else {
          return this.constWeight;
        }
      },
      initRecordWeight(intake, weight) {
        if (intake && intake > weight * 2) {
          return intake;
        } else {
          return weight * 2;
        }
      },
      getSlideMax(intake, weight) {
        if (intake && intake > weight * 2) {
          // console.log('Math.round(intake / weight * 100)', Math.round(intake / weight * 100))
          return Math.round((intake / weight) * 100);
        } else {
          return 200;
        }
      },
      initData(obj) {
        let arr = [];
        arr.push({
          isClock: false,
          value: 0,
          left: 0,
          img: this.nutritionTypeList.shortcut,
          name: "快捷拖动",
          max: 200
        });
        for (let k in obj) {
          let temporaryObj = {
            isClock: false,
            value: 0,
            left: 0
          };
          if (k == "zhushi_Suggest" && obj[k]) {
            temporaryObj.img = this.nutritionTypeList.gushu;
            temporaryObj.name = "谷薯摄入";
            temporaryObj.weight = this.initWeight(obj[k]);
            temporaryObj.standardWeight = Math.round(temporaryObj.weight * 2);
            temporaryObj.max = this.getSlideMax(this.recordData.stapleIntake, temporaryObj.weight);
            arr.length += 1;
            arr[arr.length - 1] = temporaryObj;
          } else if (k == "douyudanrou_Suggest" && obj[k]) {
            temporaryObj.img = this.nutritionTypeList.douyu;
            temporaryObj.name = "豆鱼蛋肉摄入";
            temporaryObj.weight = this.initWeight(obj[k]);
            temporaryObj.standardWeight = Math.round(temporaryObj.weight * 2);
            temporaryObj.max = this.getSlideMax(this.recordData.beanfishIntake, temporaryObj.weight);
            arr.length += 1;
            arr[arr.length - 1] = temporaryObj;
          } else if (k == "shucai_Suggest" && obj[k]) {
            temporaryObj.img = this.nutritionTypeList.shucai;
            temporaryObj.name = "蔬菜摄入";
            temporaryObj.weight = this.initWeight(obj[k]);
            temporaryObj.standardWeight = Math.round(temporaryObj.weight * 2);
            temporaryObj.max = this.getSlideMax(this.recordData.vegetableIntake, temporaryObj.weight);
            arr.length += 1;
            arr[arr.length - 1] = temporaryObj;
          } else if (k == "jianguozhongzi_Suggest" && obj[k]) {
            temporaryObj.img = this.nutritionTypeList.jianguo;
            temporaryObj.name = "坚果摄入";
            temporaryObj.weight = this.initWeight(obj[k]);
            temporaryObj.standardWeight = Math.round(temporaryObj.weight * 2);
            temporaryObj.max = this.getSlideMax(this.recordData.nutIntake, temporaryObj.weight);
            arr.length += 1;
            arr[arr.length - 1] = temporaryObj;
          } else if (k == "nai_Suggest" && obj[k]) {
            temporaryObj.img = this.nutritionTypeList.nai;
            temporaryObj.name = "奶类摄入";
            temporaryObj.weight = this.initWeight(obj[k]);
            temporaryObj.standardWeight = Math.round(temporaryObj.weight * 2);
            temporaryObj.max = this.getSlideMax(this.recordData.milkIntake, temporaryObj.weight);
            arr.length += 1;
            arr[arr.length - 1] = temporaryObj;
          } else if (k == "shuiguo_Suggest" && obj[k]) {
            temporaryObj.img = this.nutritionTypeList.shuiguo;
            temporaryObj.name = "水果摄入";
            temporaryObj.weight = this.initWeight(obj[k]);
            temporaryObj.standardWeight = Math.round(temporaryObj.weight * 2);
            temporaryObj.max = this.getSlideMax(this.recordData.fruitIntake, temporaryObj.weight);
            arr.length += 1;
            arr[arr.length - 1] = temporaryObj;
          } else if (k == "you_Suggest" && obj[k]) {
            temporaryObj.img = this.nutritionTypeList.oil;
            temporaryObj.name = "油脂类摄入";
            temporaryObj.weight = this.initWeight(obj[k]);
            temporaryObj.standardWeight = Math.round(temporaryObj.weight * 2);
            temporaryObj.max = this.getSlideMax(this.recordData.cookingOilIntake, temporaryObj.weight);
            arr.length += 1;
            arr[arr.length - 1] = temporaryObj;
          }
        }
        this.zaocanValueArr[this.idx] = null;
        // this.zaocanValueArr[this.idx] = arr;引起的问题
        this.zaocanValueArr.splice(this.idx, 1, arr); // 数组变化
        // console.log('this.zaocanValueArr', this.zaocanValueArr)
      },
      getUserMealsFn(eventCode) {
        getUserMeals({
          eventCode: eventCode
        })
          .then(res => {
            if (res.data) {
              this.zaocanRecommend = res.data;
              this.recommendData = {
                zhushi_Suggest: this.zaocanRecommend[0].zhushi_Suggest,
                douyudanrou_Suggest: this.zaocanRecommend[0].douyudanrou_Suggest,
                shucai_Suggest: this.zaocanRecommend[0].shucai_Suggest,
                jianguozhongzi_Suggest: this.zaocanRecommend[0].jianguozhongzi_Suggest,
                nai_Suggest: this.zaocanRecommend[0].nai_Suggest,
                shuiguo_Suggest: this.zaocanRecommend[0].shuiguo_Suggest,
                you_Suggest: this.zaocanRecommend[0].you_Suggest
              };
              this.getUserDietRecordFn(this.idx, this.paramDate);
            }
          })
          .catch(ex => {});
      },
      tabClick(index) {
        this.zaocanRecommend = null;
        this.loading = true;
        this.idx = index;
        if (index == 1) {
          this.getUserMealsFn("wucan");
        } else if (index == 2) {
          this.getUserMealsFn("wancan");
        } else if (index == 0) {
          this.getUserMealsFn("zaocan");
        } else {
          this.getUserMealsFn("jiacan");
        }
        // 埋点
        let tabName = "";
        if (index == 0) {
          tabName = "早餐";
        } else if (index == 1) {
          tabName = "午餐";
        } else if (index == 2) {
          tabName = "晚餐";
        } else {
          tabName = "加餐";
        }
        this.zgStatistics("健康新奥-摄入量记录-点击切换tab", {
          tab名称: tabName
        });
      },
      drawRadar() {
        let myChart = echarts.init(document.getElementById("myChart"));
        var option;
        option = {
          title: {
            text: ""
          },
          radar: [
            {
              indicator: this.indicatorArr,
              triggerEvent: false,
              radius: 90,
              startAngle: 90,
              splitNumber: 1,
              name: {
                textStyle: {
                  color: "#666"
                }
              },
              splitArea: {
                areaStyle: {}
              },
              axisLine: {
                lineStyle: {
                  color: "rgba(36,191,83,0.1000)"
                }
              },
              splitLine: {
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.1)"
                }
              }
            }
          ],
          series: [
            {
              type: "radar",
              emphasis: {
                lineStyle: {
                  width: 2
                }
              },
              clickable: false,
              data: [
                {
                  value: this.valueArr,
                  name: "实际",
                  // symbol: "rect",
                  symbol: "circle",
                  symbolSize: 5,
                  areaStyle: {
                    color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                      {
                        color: "rgba(255, 145, 124, 0.1)",
                        offset: 0
                      },
                      {
                        color: "rgba(75, 122, 255, 0.9)",
                        offset: 1
                      }
                    ])
                  }
                },
                {
                  value: this.doubleArr,
                  name: "二倍",
                  symbol: "circle",
                  symbolSize: 5,
                  lineStyle: {
                    type: "dashed"
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.1)"
                  }
                },
                {
                  value: this.singleArr,
                  name: "推荐",
                  symbol: "circle",
                  symbolSize: 5,
                  lineStyle: {
                    type: "dashed",
                    color: "green"
                  },
                  areaStyle: {
                    color: "rgba(255, 255, 255, 0.4)"
                  },
                  label: {
                    show: true,
                    formatter: function (params) {
                      return params.value + "g";
                    }
                  }
                }
              ]
            }
          ]
        };
        myChart.clear();
        option && myChart.setOption(option);
      },
      onConfirm(date) {
        // 调用什么
        this.dateVisible = false;
        this.paramDate = formatTimeForBirth(date);
        this.translateDate(date);
        this.tabClick(this.idx);
      },
      translateDate(date) {
        let year = Number(dayjs(date).year());
        let month = Number(dayjs(date).month());
        let day = Number(dayjs(date).date());
        let tian = Number(dayjs(date).day());
        this.defaultDate = new Date(year, month, day);
        let week = "";
        if (tian == 1) {
          week = "周一";
        } else if (tian == 2) {
          week = "周二";
        } else if (tian == 3) {
          week = "周三";
        } else if (tian == 4) {
          week = "周四";
        } else if (tian == 5) {
          week = "周五";
        } else if (tian == 6) {
          week = "周六";
        } else if (tian == 7) {
          week = "周日";
        }
        this.date = month + 1 + "-" + day + " " + week;
      }
    },
    mounted() {
      let index = "";
      if (localStorage.getItem("extraindex")) {
        index = parseInt(localStorage.getItem("extraindex"));
      } else {
        index = parseInt(this.$route.query.type);
      }
      this.paramDate = formatTimeForBirth(new Date());
      this.tabClick(index);
      this.memberCode = localStorage.getItem("memberCode");
      this.deviceWidth = document.documentElement.clientWidth;

      this.translateDate(new Date());
    }
  };
</script>
<style lang="scss" scoped>
  .color_1 {
    background-color: rgba(75, 122, 255, 0.1);
    background-color: #f5f6f9;
  }
  .color_2 {
    background-color: rgba(243, 177, 81, 0.1);
    background-color: #f5f6f9;
  }
  .color_3 {
    background-color: rgba(243, 244, 253, 1);
    background-color: #f5f6f9;
  }
  .color_4 {
    background-color: rgba(240, 250, 247, 1);
    background-color: #f5f6f9;
  }
  .color_5 {
    background-color: #f5f6f9;
  }
  @import "../../style/ADIHistory.css";
  .container {
    padding-bottom: 160px;
    .radarWrapper {
      width: 750px;
      // height: 466px;
      // height: 600px;
      background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/radar-bg.png")
        no-repeat left center;
      background-size: 100% 100%;
      position: relative;
      z-index: 500;
      .text_explain {
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4baa4c;
        padding-bottom: 24px;

        justify-content: center;

        .tuijian {
          margin-right: 32px;
          position: relative;
          .sandian {
            position: absolute;
            left: -20px;
            top: -6px;
          }
        }
        .shiji {
          color: #3c80ff;
        }
      }

      .text_explain2 {
        margin-top: -90px;
      }

      .dateBox {
        position: absolute;
        left: 24px;
        top: 24px;
        width: 240px;
        height: 60px;
        background: #ffffff;
        border-radius: 30px;
        display: flex;
        align-items: center;
        font-size: 26px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #222222;
        padding: 0 20px;
        position: relative;

        img {
          width: 36px;
          height: 36px;
        }
        .date {
          margin: 0 6px;
        }
        .arrow_down {
          width: 8px;
          height: 8px;
          position: absolute;
          right: 32px;
          bottom: 36px;
        }
      }
    }

    .radarWrapper3 {
      height: 600px;
    }

    .content-wrapper {
      /* border-radius: 16px 16px 0px 0px; */

      background-color: #fff;
      margin: 0 auto;
      // margin-top: -40px;

      padding-bottom: 40px;

      // width: 710px;
      box-shadow: 0px 8px 16px 0px rgba(145, 149, 161, 0.2);
      border-radius: 24px;
      border: 1px solid #e6ecff;

      .bottom {
        margin-top: 24px;
        /* margin-right: 24px; */
        /* margin-right: -20px; */
        overflow-x: scroll;

        /* border: 1px solid red; */
        .placeholderBox {
          height: 357px;
          width: 16px;
          background-color: #fff;
        }
        .biteItem {
          height: 357px;
          margin-left: 16px;
          margin-left: 32px;
          /* background: #FFFFFF; */
          border-radius: 8px;

          .title {
            height: 72px;
            background: linear-gradient(135deg, #f4f1fd 0%, #f1f9fc 100%);
            font-size: 28px;
            color: #3d3e42;
            line-height: 72px;
            text-align: left;
            padding-left: 20px;
            border-radius: 8px 8px 0px 0px;
          }

          .dishesvarietyBox {
            padding: 20px;
            box-shadow: 0px 8px 16px 0px rgba(194, 197, 205, 0.29);
            border-left: 1px solid #f4f1fd;
            .dishesvariety {
              position: relative;
              width: 176px;
              width: 192px;
              img {
                width: 176px;
                height: 176px;

                border-radius: 8px;
                background: #d8d8d8;
              }
              .foodName {
                position: absolute;
                left: 0px;
                top: 120px;
                width: 176px;
                height: 56px;
                color: #ffffff;
                line-height: 56px;
                font-size: 28px;
                z-index: 105;
              }
              .opacityBg {
                position: absolute;
                left: 0px;
                top: 120px;
                width: 176px;
                height: 56px;
                background: #000000;
                border-radius: 0px 0px 8px 8px;
                opacity: 0.4;
                z-index: 100;
              }

              .foodNum {
                font-size: 28px;
                line-height: 40px;
                position: relative;
                z-index: 500;
              }
            }
          }
        }

        .biteCaoItem {
          width: 648px;
          .dishesvariety {
            margin-right: 8px;
            img {
              width: 200px;
              height: 200px;
            }
          }
        }
      }

      .foodSuggest {
        width: 686px;
        padding-bottom: 48px;
        border-radius: 8px;
        margin: 0 auto;
        margin-top: 28px;
        /* background: linear-gradient(135deg, #F4F1FD 0%, #F1F9FC 100%); */

        .suggest {
          /* padding: 24px; */
          font-size: 0px;
          text-align: left;
          overflow: hidden;
          .title {
            position: relative;

            font-size: 28px;
            font-weight: 550;
            color: #1c1c1e;
            line-height: 36px;
            display: inline-block;
            margin: 0;
            padding: 0;
            .bottom-bg {
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 12px;
              background: #4b7aff;
              opacity: 0.3;
            }
          }
          .title2 {
            margin-top: 42px;
            margin-bottom: -88px;
          }

          .biteItem {
            /* width: 600px; */
            height: auto;
            border-radius: 8px;
            margin: 0;
            margin-top: 24px;
            /* border: 1px solid red; */
            .dishesvarietyBox {
              padding: 0;
              box-shadow: none;
              .dishesvariety {
                position: relative;
                width: 184px;
                img {
                  width: 184px;
                  height: 128px;
                  border-radius: 8px;

                  /* border: 1px solid green; */
                }
                .foodName {
                  position: absolute;
                  left: 0;
                  text-align: center;
                  width: 184px;
                  height: 44px;
                  top: 84px;
                  color: #ffffff;
                  line-height: 44px;
                  font-size: 24px;
                  z-index: 105;
                }
                .opacityBg {
                  position: absolute;
                  left: 0px;
                  top: 84px;
                  width: 184px;
                  height: 44px;
                  background: #000000;
                  border-radius: 0px 0px 8px 8px;
                  opacity: 0.4;
                  z-index: 100;
                }

                .foodNum {
                  font-size: 28px;
                  line-height: 40px;
                  position: relative;
                  /* z-index: 500; */
                  text-align: center;
                }
              }
            }
          }

          .biteCaoItem {
            width: 648px;
            .dishesvariety {
              margin-right: 8px;
              img {
                width: 200px;
                height: 200px;
              }
            }
          }

          .drapWrapper {
            padding-left: 16px;

            .handleImg {
              width: 80px;
              height: 80px;
            }
            .hualunBox {
              width: 512px;
              flex-shrink: 0;
            }
            margin-top: 30px;

            /* border: 1px solid red; */

            border-radius: 16px;

            height: 172px;
            .slideBox {
              margin-right: 22px;
              margin-top: -20px;
            }
            .shortCut {
              position: relative;
              z-index: 59;
              /* margin-bottom: 50px; */
              font-size: 26px;
              color: #565961;
              margin: 0px 0 40px;
            }

            /* <div class="itemType">
                <div class="item-name">谷薯</div>
                <div class="item-bg"></div>
              </div> */

            .itemType {
              position: relative;
              padding: 0 20px 0 24px;
              display: inline-block;

              margin-left: -24px;
              margin-bottom: 40px;
              .item-bg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 40px;
                /* background: #F09918; */
                border-radius: 0px 62px 62px 0px;
                opacity: 0.2;
              }

              .item-name {
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #565961;
                line-height: 40px;
              }
              /* .itemBg2{
                  background: #16B57D;
                }
                .itemName2{
                  color: #16B57D;
                }

                .itemBg3{
                  background: #5856D6;
                }
                .itemName3{
                  color: #5856D6;
                } */
            }

            .scaleplate {
              font-size: 30px;
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #565961;
              /* line-height: 34px; */
              margin-top: 10px;
              position: relative;
              z-index: 100;
              padding-right: 22px;
              .pointBox {
                line-height: 48px;
                width: 88px;
                height: 48px;
                text-align: center;
                font-size: 28px;
                color: #2b2c2f;
                border-radius: 24px;
                background: #ffffff;
                /* background: red; */
                box-shadow: 0px 4px 12px 0px rgba(75, 122, 255, 0.2);
                position: absolute;
                left: 0;
                top: 6px;
                z-index: 10000;
                .point {
                  position: relative;
                  .introjs-arrow {
                    border: 8px solid transparent;
                    content: "";
                    position: absolute;
                    top: -16px;
                    left: 35px;
                    border-bottom-color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .tab__div {
    width: 100%;
    height: 102px;
    position: relative;
    padding: 0 70px;
    padding-top: 30px;
    background-color: #fff;
    border-radius: 16px 16px 0px 0px;
    /* border: 1px solid red; */

    .tab__list {
      display: flex;
      justify-content: space-between;

      .tab__item {
        font-size: 32px;
        position: relative;

        .bottom_line {
          /* width: 60px; */
          width: 42px;
          height: 12px;
          // border: 1px solid;
          // background: #2E7CFF;
          background-image: url("https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20221211142818R2z9.png?Expires=2301460098&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=QX5R%2B3NgK6bk2gpnfVClzfHfexs%3D");
          background-size: 42px 12px;
          // border-radius: 4px;
          position: absolute;
          /* left: 50%;
                margin-left: -30px; */
          left: 10px;
          bottom: -24px;
        }
      }

      .tab__item-current {
        font-weight: 700;
      }

      .activeTab {
        font-weight: 550;
        color: #4b7aff;
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

  .custom-button {
    /* width: 28px;
    height: 28px; */

    width: 44px;
    height: 44px;
    width: 40px;
    height: 40px;
    background: #ffd977;
    border: 2px solid #ffffff;
    border-radius: 50%;
    font-size: 0px;
  }

  .van-slider {
    background-color: #fff;
  }

  .save-btn {
    position: fixed;
    left: 32px;
    width: 686px;
    height: 88px;
    background: #4b7aff;
    border-radius: 44px;
    z-index: 2000;

    bottom: 26px;
    text-align: center;
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 88px;
  }

  .save-btnBg {
    position: fixed;
    width: 750px;
    height: 120px;
    background-color: #fff;
    z-index: 49999;
    left: 0;
    bottom: 0;
  }

  .forbiddenBtn {
    background: rgba(75, 122, 255, 0.2);
    border-radius: 44px;
  }
</style>
