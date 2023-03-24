<template>
    <div class="food_list">
        <div class="left_box">
            <div :class="['classification', checkClass.id  == item.id ? 'activeClass' : '']" v-for="(item,index) in classDict"
                :key="index" @click="handleClass(item)">
                {{ item.name }}
            </div>
        </div>
        <div class="right_box" ref="scrollRef">
            <div class="food_introduce_box" v-for="(item, index) in foodData" :key="index">
                <div class="food_img">
                    <img v-if="item.img" :src="item.img" alt=""></img>
                    <img v-else src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/health/placeholder_img.png" />
                </div>
                <div class="food_info">
                    <div class="food_name">{{ item.name }}</div>
                    <div class="tag_box">
                        <div :class="['tag_item', item_in.n.indexOf('高') != -1 ? 'green_tag' : '']"
                            v-for="(item_in, index_in) in item.rec_tags" :key="index_in">{{ item_in.n }}
                        </div>
                    </div>
                    <div class="recommend_index">
                        <span>推荐指数：</span>
                        <span v-if="item.score < 0">不建议食用</span>
                        <img v-else v-for="(item, index) in parseInt(item.score)" :key="index"
                            src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/diet/star.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { searchSuggestFoods } from "@/service/meal";
import { Toast } from "vant";
export default {
  data() {
    return {
      classDict: [
        { id: "谷薯类", name: "谷薯类" },
        { id: "豆鱼蛋肉类", name: "豆鱼蛋肉类" },
        { id: "蔬菜类", name: "蔬菜类" },
        { id: "坚果类", name: "坚果类" },
        { id: "奶类", name: "奶类" },
        { id: "水果类", name: "水果类" },
        { id: "油脂类", name: "烹调油类" },
      ],
      foodData: [],
      checkClass: {
        id: "谷薯类",
        name: "谷薯类",
      },
    };
  },
  components: {},
  mounted() {
    this.searchSuggestFoodsFn();
  },
  methods: {
    handleClass(e) {
      this.checkClass = e;
      this.searchSuggestFoodsFn();
      this.$refs.scrollRef.scrollTop = 0;
    },
    async searchSuggestFoodsFn() {
      let params = { cls: [this.checkClass.id] };
      const { code, message, data } = await searchSuggestFoods(params);
      if (code == 0) {
        let temp = data.ingrds_list[0]["ingrds"];
        temp.forEach((item) => {
          if (item.score > 5) {
            item.score = 5;
          }
        });
        this.foodData = temp;
      } else {
        Toast(message);
      }
    },
  },
};
</script>
<style scoped lang='scss'>
.food_list {
  display: flex;

  .left_box {
    width: 164px;
    background: #f5f6f9;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    height: calc(100vh - 98px);
    overflow: auto;

    .classification {
      height: 124px;
      line-height: 124px;
    }

    .activeClass {
      background: #fff;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4b7aff;
    }
  }

  .right_box {
    flex: 1;
    padding: 0 24px;
    height: calc(100vh - 98px);
    overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    overflow-y: auto;
    padding-top: 30px;

    .food_introduce_box {
      margin-bottom: 40px;
      display: flex;
      // align-items: center;
      .food_img {
        width: 140px;
        height: 140px;
        margin-right: 28px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .food_info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        width: calc(100% - 140px - 28px);

        .food_name {
          font-size: 30px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #1b1c1e;
        }

        .tag_box {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .tag_item {
            // max-width: 136px;
            background: rgba(255, 156, 0, 0.1);
            border-radius: 4px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff9c00;
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
            margin-right: 10px;
            padding: 2px 8px;
          }
          .tag_item:last-child {
            margin-right: 0;
          }

          .green_tag {
            background: rgba(0, 200, 99, 0.1);
            color: #00c863;
          }
        }

        .recommend_index {
          display: flex;
          align-items: center;

          span {
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            margin-right: 4px;
          }

          img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>