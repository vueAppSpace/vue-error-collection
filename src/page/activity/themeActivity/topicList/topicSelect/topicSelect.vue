<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { getListByHot } from "@/service/activity";
  import eventBus from "@/utils/eventBus.js";
  export default defineComponent({
    components: {},
    setup(_, context) {
      const { $router: router, $route: route, zgStatistics } = context.root;

      const state = reactive({
        topicList: [],
        pageIndex: 1,
        pageSize: 20,
        loading: false,
        finished: false
      });

      // 话题列表
      const getListByHotFn = () => {
        let params = {
          pageIndex: state.pageIndex,
          pageSize: state.pageSize,
          status: 1
        };
        getListByHot(params).then(({ code, data, message, page }) => {
          if (code === 0) {
            state.topicList = [...state.topicList, ...data];
            state.loading = false;
            if (state.topicList.length == page.total) {
              state.finished = true;
            }
          } else {
          }
        });
      };

      const ArrConcat = (oldArr, newArr) => {
        let obj = {},
          tempArr = oldArr.concat(newArr);
        let result = tempArr.reduce((cur, next) => {
          obj[next] ? "" : (obj[next] = true && cur.push(next));
          return cur;
        }, []);
        return result;
      };

      const handleSelectTopic = item => {
        zgStatistics("健康新奥-活动-点击选择话题", { 话题名称: item.content });

        router.replace({
          name: "publish",
          query: Object.assign(route.query, {
            topicTitle: encodeURI(item.content),
            goTopic: true,
            from: "topicSelect",
            source: "topicSelect"
          })
        });
        // 为了恢复到publish路由而且不是replace后的页面
        // router.go(-1);
      };

      const onLoad = () => {
        state.pageIndex = ++state.pageIndex;
        getListByHotFn();
      };

      const init = () => {
        getListByHotFn();
      };

      onMounted(() => {
        init();
        // 监听返回事件
        eventBus.$on("onback", closeFn => {
          // closeFn() 关闭当前页
          this.$router.replace({
            path: "/topicSelect",
            query: {
              from: "topicSelect"
            }
          });
        });
      });

      return {
        ...toRefs(state),
        onLoad,
        handleSelectTopic,
        ArrConcat
      };
    }
  });
</script>

<template>
  <div class="wrap">
    <div class="containter">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="topic_list_item" @click="handleSelectTopic(item)" v-for="(item, index) in topicList" :key="index">
          <div class="left_content">
            <span class="serial_no"><span v-if="index < 9">0</span>{{ index + 1 }}</span>
            <span class="hopic_text">#{{ item.content }}</span>
          </div>
          <div class="right_content">{{ item.topicCount }}人讨论</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "./topicSelect.scss";
</style>
