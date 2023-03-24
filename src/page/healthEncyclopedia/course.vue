<!--
 * @Description: 健康百科
 * @Author: WANGCHENGAE
 * @Date: 2022-1-5 11:00:30
 * @LastEditTime: 2023-03-23 17:36:39
-->
<script>
  import { defineComponent, reactive, toRefs, onMounted, toRef } from "@vue/composition-api";
  import { Toast } from "vant";
  import { queryCategoryArticlesPage } from "@/service/healthEncyclopedia/index";

  import ArticleCard from "@/components/ArticleCard.vue";

  export default defineComponent({
    components: {
      ArticleCard
    },

    props: {
      id: {
        type: [String, Number],
        default: "" | 0
      }
    },

    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      //从detail返回
      if (["/health-encyclopedia-detail"].includes(fromPath)) {
        next(async vm => {
          await vm.refreshSpecialPageListFn();
        });
      } else {
        //从index进入或者刷新当前页面
        next(async vm => {
          await vm.queryPageDataFn();
        });
      }
    },

    setup(props, context) {
      console.log("healthEncyclopedia course...");

      const { $router: router } = context.root;
      const idRef = toRef(props, "id");
      const state = reactive({
        articlesList: [],
        pageParams: {
          pageIndex: 1,
          pageSize: 10,
          courseId: idRef,
          articleState: 1
        },
        //控制加载list
        loading: false,
        finished: false,
        //上次被点击的卡片的index
        cardIndex: 0,
        //下拉刷新
        refreshing: false
      });

      function resetPageData() {
        state.pageParams.pageIndex = 1;
        state.articlesList = [];
        state.loading = false;
        state.finished = false;
        state.cardIndex = 0;
      }

      //1.获取首页数据
      async function queryPageDataFn() {
        resetPageData();

        //查询课程列表
        await refreshPageListFn();
      }

      async function refreshPageListFn() {
        //重置 loading
        state.loading = false;
        state.finished = false;
        await queryCategoryArticlesPageFn(true);

        //重置下拉刷新 refreshing
        state.refreshing = false;
      }

      async function queryCategoryArticlesPageFn(byHand) {
        console.log("byHand", byHand);

        if (byHand) {
          state.pageParams.pageIndex = 1;
        } else {
          state.loading = true;
          state.pageParams.pageIndex++;
        }

        const toast = Toast.loading({
          duration: 0,
          forbidClick: true
        });
        const { code, message, data } = await queryCategoryArticlesPage(state.pageParams);
        toast.clear();

        if (code === 0 && data && data.length) {
          if (byHand) {
            state.articlesList = data;
          } else {
            state.articlesList = [...state.articlesList, ...data];
            //数据加载完成
            state.loading = false;
          }
        } else {
          if (byHand) {
            state.articlesList = [];
            console.log(message || "未获取到该课程下的文章数据!");
          } else {
            //数据加载完成
            state.loading = false;
            //数据加载完毕
            state.finished = true;
          }
        }
      }

      //刷新指定页面数据，不全局刷新
      async function refreshSpecialPageListFn() {
        //推断用户点击的卡片处于哪个page,并获取那一页的最新数据
        const pageIndex = Math.floor(state.cardIndex / state.pageParams.pageSize) + 1;
        const tempPageParams = { ...state.pageParams };
        tempPageParams.pageIndex = pageIndex;

        const { code, message, data } = await queryCategoryArticlesPage(tempPageParams);

        if (code === 0 && data && data.length) {
          const mapArray = data.map(item => {
            return [item.id, item];
          });
          const idValueMap = new Map(mapArray);

          //将获取的那一页的数据，更新到全部数据上来
          state.articlesList = state.articlesList.map(item => {
            return idValueMap.get(item.id) || item;
          });
        } else {
          console.log("获取指定文章数据失败!", message);
        }
      }

      function handleCardClick({ type, id, index }) {
        state.cardIndex = index;
        router.push({ path: "health-encyclopedia-detail", query: { id } });
      }

      return {
        ...toRefs(state),
        handleCardClick,
        queryCategoryArticlesPageFn,
        queryPageDataFn,
        refreshSpecialPageListFn,
        refreshPageListFn
      };
    }
  });
</script>

<template>
  <div class="articles-course">
    <!-- pageParams: {{ pageParams }} -->
    <template v-if="articlesList && articlesList.length">
      <van-pull-refresh v-model="refreshing" @refresh="refreshPageListFn">
        <div class="articlesList">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="queryCategoryArticlesPageFn"
            offset="50"
          >
            <template v-for="(item, index) in articlesList">
              <ArticleCard
                @click="handleCardClick"
                class="cardItem"
                :index="index"
                :key="item.id"
                :id="item.id"
                :name="item.articleName"
                :detail="item.articleDetail"
                :content="item.articleContent"
                :imgUrl="item.articleImgUrl"
                :readNum="item.readNum"
              />
            </template>
          </van-list>
        </div>
      </van-pull-refresh>
    </template>
    <template v-else>
      <van-empty
        class="custom-image"
        :class="{ moreHeight: true }"
        image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
        description="暂无文章数据~"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .articles-course {
    min-height: 100%;
    padding: 0 32px;
    text-align: left;

    ::v-deep .van-empty {
      height: calc(100vh - 46px * 2 - 46px * 2 - 100px);
      padding: 0;
    }

    ::v-deep .custom-image .van-empty__image {
      width: 280px;
      height: 280px;
    }
  }
</style>
