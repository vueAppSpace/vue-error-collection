<template>
  <div class="wrap">
    <div class="container">
      <div @click="handleSelectTopic(item)" v-for="(item, index) in items" class="item" :key="index">
        <div class="left-part">
          <span :class="computeIndex(index)">{{ index | filterIndex }}</span>
          <span class="title">@{{ item.title }}</span>
        </div>
        <span class="participate">{{ item.clockInNum }}人参与</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { getTopics } from "@/service/activity";
  import { mapState, useNavStore } from "@/pinia";
  export default {
    name: "topic",
    data() {
      return {
        items: []
      };
    },
    filters: {
      filterIndex(value) {
        value += 1;
        if (value < 10) {
          return "0" + value;
        } else {
          return value;
        }
      }
    },
    computed: {
      computeIndex() {
        return value => {
          if (value == 0) {
            return "red-index";
          } else if (value == 1) {
            return "yellow-index";
          } else if (value == 2) {
            return "blue-index";
          } else {
            return "grey-index";
          }
        };
      },
      ...mapState(useNavStore, ["onback"])
    },
    methods: {
      getList() {
        let params = { pageIndex: 1, pageSize: 1000, publishOrg: null, status: 1, activity: 1 };
        getTopics(params).then(res => {
          if (res) {
            this.items = res.data;
            console.log(res.data, "?????");
          }
        });
      },
      handleSelectTopic(item) {
        this.$router.replace({
          name: "publish",
          query: Object.assign(this.$route.query, {
            id: item.id,
            name: encodeURI(item.title),
            goTopic: true,
            from: "topics"
          })
        });
        // 为了恢复到publish路由而且不是replace后的页面
        // this.$router.go(-1);
      }
    },
    mounted() {
      // 监听返回事件
      this.onback(() => {
        this.$router.replace({
          path: "/publish",
          query: {
            from: "topics"
          }
        });
      });
      this.getList();
    }
  };
</script>
<style scoped lang="scss">
  @mixin index {
    font-size: 36px;
    font-weight: bold;
    line-height: 88px;
    margin-right: 12px;
  }

  .container {
    // margin-top: 32px;
    min-height: calc(100vh - 32px);
    background-color: #f0f2f7;
    box-sizing: border-box;
  }

  .wrap {
    padding-top: 32px;
    background-color: #fff;
  }

  .red-index {
    @include index();
    color: #ed6066;
  }

  .yellow-index {
    @include index();
    color: #ff9500;
  }

  .blue-index {
    @include index();
    color: #4b7aff;
  }

  .grey-index {
    @include index();
    color: #abafba;
  }

  .left-part {
    display: flex;
  }

  .title {
    font-size: 28px;
    color: #1c1c1e;
    line-height: 88px;
  }

  .participate {
    font-size: 28px;
    color: #9195a1;
    line-height: 88px;
  }

  .item {
    display: flex;
    height: 88px;
    border-bottom: 1px solid #f0f2f7;
    padding-left: 32px;
    padding-right: 32px;
    background-color: #fff;
    justify-content: space-between;
  }
</style>
