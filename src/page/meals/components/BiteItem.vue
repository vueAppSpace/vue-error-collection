<template>
  <div>
    <div class="biteWrapper" v-if="weightArr">
      <div
        v-if="item"
        class="item"
        :class="[
          { color_douyu: item.name == '豆鱼蛋肉' || item.name == '奶类' },
          { color_shucai: item.name == '蔬菜类' || item.name == '水果类' },
          { color_oid: item.name == '油脂类' }
        ]"
        v-for="(item, index) in weightArr"
        :key="index"
      >
        <img :src="item.img" />
        <div class="text_miaoshu">{{ item.name }}</div>
        <div class="text_miaoshu">{{ item.weight }}g</div>
      </div>

      <!-- <div class="item">
                <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/zhushi.png" />
                <div class="text_miaoshu">豆鱼蛋肉100g</div>
            </div>

            <div class="item">
                <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/zhushi.png" />
                <div class="text_miaoshu">豆鱼蛋肉10g</div>
            </div>

            <div class="item">
                <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/zhushi.png" />
                <div class="text_miaoshu">豆鱼蛋肉1g</div>
            </div> -->
    </div>
  </div>
</template>
<script>
  export default {
    directives: {},
    components: {},
    data() {
      return {
        weightArr: null
      };
    },
    props: {
      zaocanRecommend: {
        type: Array,
        default: true
      }
    },
    methods: {
      formatDate(date) {
        return dayjs(parseInt(date)).format("YYYY年MM月DD日");
      },
      transLateData() {
        let obj = this.zaocanRecommend[0];
        let arr = [null, null, null, null];
        for (let k in obj) {
          if (k == "douyudanrou_Suggest" && obj[k] && obj[k].weight) {
            arr[1] = {
              name: "豆鱼蛋肉",
              weight: obj[k].weight,
              img: "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20221212140632RF91.png?Expires=2301545192&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=%2BvIwGDbkdf7WGnEeFjJ5yacwDiw%3D"
            };
          } else if (k == "shucai_Suggest" && obj[k] && obj[k].weight) {
            arr[2] = {
              name: "蔬菜类",
              weight: obj[k].weight,
              img: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/shucai.png"
            }; // shucai_Suggest
          } else if (k == "zhushi_Suggest" && obj[k] && obj[k].weight) {
            arr[0] = {
              name: "谷薯类",
              weight: obj[k].weight,
              img: "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/202212121405471H2O.png?Expires=2301545147&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=VqC5WQrCz1fpieWb8nh593MHwDA%3D"
            }; // shucai_Suggest
          } else if (k == "you_Suggest" && obj[k] && obj[k].weight) {
            arr[3] = {
              name: "油脂类",
              weight: obj[k].weight,
              img: "https://laikangland-dev.oss-cn-beijing.aliyuncs.com/20221212140757tj0b.png?Expires=2301545277&OSSAccessKeyId=LTAIykCrXSP1fmei&Signature=RdZ%2BrH5UGTsdJW8PktJoqptGwTY%3D"
            }; // shucai_Suggest
          } else if (k == "jianguozhongzi_Suggest" && obj[k] && obj[k].weight) {
            arr[0] = {
              name: "坚果类",
              weight: obj[k].weight,
              img: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/jianguo.png"
            };
          } else if (k == "nai_Suggest" && obj[k] && obj[k].weight) {
            arr[1] = {
              name: "奶类",
              weight: obj[k].weight,
              img: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/nai.png"
            };
          } else if (k == "shuiguo_Suggest" && obj[k] && obj[k].weight) {
            arr[2] = {
              name: "水果类",
              weight: obj[k].weight,
              img: "https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/meal/shuiguo.png"
            };
          }
        }
        return arr;
      }
    },
    watch: {},
    mounted() {
      this.weightArr = this.transLateData();
    }
  };
</script>
<style lang="scss" scoped>
  .biteWrapper {
    display: flex;
    // justify-content: space-between;
    padding: 0 28px;
    margin-top: 38px;
    // border: 1px solid;
    .item {
      // border: 1px solid red;
      padding: 18px 12px 20px;
      text-align: center;
      background-color: #fbf7e9;
      border-radius: 8px;
      margin-right: 16px;
      width: 160px;
      img {
        width: 60px;
        height: 60px;
      }
      .text_miaoshu {
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222222;
        line-height: 34px;
      }
    }
    .item:nth-last-child(1) {
      margin-right: 0px;
    }
    .color_douyu {
      background-color: #fff4f0;
    }
    .color_shucai {
      background-color: #effde7;
    }
    .color_oid {
      background-color: #eff6fe;
    }
  }
</style>
