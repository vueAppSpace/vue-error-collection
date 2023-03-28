<script>
  import { defineComponent, reactive, toRefs, onMounted } from "@vue/composition-api";
  import { getListByHot } from "@/service/activity";
  import { useRouter } from "@/hooks/useRouter";
  export default defineComponent({
    components: {},
    setup(_, context) {
      const { $router } = context.root;
      const router = useRouter($router);

      const state = reactive({
        topicList: [],
        pageIndex: 1,
        pageSize: 20,
        loading: false,
        finished: false,
        topStatus: false
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
            if (state.topicList[0].top == 1) {
              // 有置顶的
              state.topStatus = true;
            } else {
              state.topStatus = false;
            }
            if (state.topicList.length == page.total) {
              state.finished = true;
            }
          } else {
          }
        });
      };

      const goToTopicDetail = (item, index) => {
        router.push({
          path: "/topicDetail",
          query: {
            topicId: item.id,
            ranking: index
          }
        });
      };

      const onLoad = () => {
        state.pageIndex = ++state.pageIndex;
        getListByHotFn();
      };

      const init = () => {
        getListByHotFn();
      };

      onMounted(init);

      return {
        ...toRefs(state),
        onLoad,
        goToTopicDetail
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
        <div
          :class="['topic_list_item', topStatus == true ? 'top_topic' : '']"
          v-for="(item, index) in topicList"
          :key="index"
          @click="goToTopicDetail(item, index)"
        >
          <div class="left_content">
            <!-- 不置顶 -->
            <span class="serial_no" v-if="topStatus == false">
              <span v-if="index < 9">0</span>
              <span>{{ index + 1 }}</span>
            </span>
            <!-- 置顶 -->
            <span class="serial_no" v-if="topStatus == true && item.top == 0">
              <span v-if="index < 10">0</span>
              <span>{{ index }}</span>
            </span>
            <span class="serial_no" v-if="topStatus == true && item.top == 1">
              <img
                src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/activity/top_icon.png"
                alt=""
              />
            </span>

            <span class="hopic_text">#{{ item.content }}</span>
          </div>
          <div class="right_content">{{ item.topicCount }}人讨论</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "./topicList.scss";
</style>
