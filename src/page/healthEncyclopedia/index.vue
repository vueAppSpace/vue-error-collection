<!--
 * @Description: 健康百科
 * @Author: WANGCHENGAE
 * @Date: 2022-1-5 11:00:30
 * @LastEditTime: 2023-03-23 17:36:44
-->
<script>
  import { defineComponent, reactive, toRefs } from "@vue/composition-api";
  import ArticleCard from "@/components/ArticleCard.vue";
  import { Toast } from "vant";
  import { selectListByType, queryCategoryList, queryUnionArticlePage } from "@/service/healthEncyclopedia/index";

  import { TYPE } from "./constData";

  export default defineComponent({
    components: {
      ArticleCard
    },
    beforeRouteEnter(to, from, next) {
      const fromPath = from.path;
      //从course或者detail返回
      if (["/health-encyclopedia-course", "/health-encyclopedia-detail"].includes(fromPath)) {
        next(async vm => {
          await vm.refreshSpecialPageListFn();
        });
      } else {
        //从service进入或者刷新当前页面
        next(async vm => {
          await vm.queryPageDataFn();
        });
      }
    },
    setup(_, context) {
      console.log("healthEncyclopedia index...");

      const { $router: router } = context.root;
      const state = reactive({
        activeCategoryId: "",
        categoryList: [],
        unionArticleList: [],
        //分页查询参数
        unionPageParams: {
          pageIndex: 1,
          pageSize: 10,
          categoryId: ""
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
        state.activeCategoryId = "";
        state.categoryList = [];
        state.unionArticleList = [];
        state.unionPageParams.pageIndex = 1;
        state.unionPageParams.categoryId = "";
        state.loading = false;
        state.finished = false;
        state.cardIndex = 0;
      }

      //1.获取首页数据
      async function queryPageDataFn() {
        resetPageData();

        const toast = Toast.loading({
          duration: 0,
          forbidClick: true
        });

        //1.查询栏目类型
        const {
          success,
          data: data0,
          msg
        } = await selectListByType({
          dictType: "xinaohealth_article_catalogue_type"
        });

        if (success) {
          const catalogue = data0.find(item => item.dictValue === "健康百科");
          if (!catalogue) {
            toast.clear();
            console.log(msg || "查询栏目类型失败!");
          } else {
            //2.查询该栏目类型下的分类
            const { code, message, data } = await queryCategoryList({
              catalogueType: catalogue.dictId
            });
            toast.clear();
            if (code === 0 && data && data.length) {
              state.categoryList = data;
              state.activeCategoryId = data[0].id;
              //构造分页参数 categoryId
              state.unionPageParams.categoryId = state.activeCategoryId;

              //3.查询文章和课程
              await refreshPageListFn();
            } else {
              console.log(message || "查询分类数据失败!");
            }
          }
        } else {
          toast.clear();
          console.log(msg || "查询栏目类型失败!");
        }
      }

      //刷新指定页面数据，不全局刷新
      async function refreshSpecialPageListFn() {
        //推断用户点击的卡片处于哪个page,并获取那一页的最新数据
        const pageIndex = Math.floor(state.cardIndex / state.unionPageParams.pageSize) + 1;
        const tempPageParams = { ...state.unionPageParams };
        tempPageParams.pageIndex = pageIndex;

        const { code, message, data } = await queryUnionArticlePage(tempPageParams);

        if (code === 0 && data && data.length) {
          const mapArray = data.map(item => {
            return [item.id, item];
          });
          const idValueMap = new Map(mapArray);

          //将获取的那一页的数据，更新到全部数据上来
          state.unionArticleList = state.unionArticleList.map(item => {
            return idValueMap.get(item.id) || item;
          });
        } else {
          console.log("获取指定文章数据失败!", message);
        }
      }

      //分页查询该分类下的文章
      async function queryUnionArticlePageFn(switchCategory) {
        console.log("switchCategory", switchCategory);

        if (switchCategory) {
          state.unionPageParams.pageIndex = 1;
          state.unionArticleList = [];
        } else {
          //加载中
          state.loading = true;
          state.unionPageParams.pageIndex++;
        }

        const { code, message, data } = await queryUnionArticlePage(state.unionPageParams);

        if (code === 0 && data && data.length) {
          //切换分类需要重置 unionArticleList
          if (switchCategory) {
            state.unionArticleList = data;
          } else {
            //分页处理
            state.unionArticleList = [...state.unionArticleList, ...data];
            //数据加载完成
            state.loading = false;
          }
        } else {
          if (switchCategory) {
            state.unionArticleList = [];
            console.log(message || "未获取到该分类下的文章数据!");
          } else {
            //数据加载完成
            state.loading = false;
            //数据加载完毕
            state.finished = true;
          }
        }
      }

      //用户手动点击 nav 标签
      async function handleCategoryChangeFn() {
        state.unionPageParams.categoryId = state.activeCategoryId;
        await refreshPageListFn();
      }

      async function refreshPageListFn() {
        //重置 loading
        state.loading = false;
        state.finished = false;
        await queryUnionArticlePageFn(true);

        //重置下拉刷新 refreshing
        state.refreshing = false;
      }

      //文章card被点击
      function handleCardClick({ type, id, name, index }) {
        state.cardIndex = index;

        if (TYPE.ARTICLE === type) {
          router.push({ path: "health-encyclopedia-detail", query: { id } });
        } else if (TYPE.COURSE === type) {
          router.push({
            path: "health-encyclopedia-course",
            query: { id, navTitle: name }
          });
        }
      }

      return {
        ...toRefs(state),
        handleCardClick,
        queryUnionArticlePageFn,
        queryPageDataFn,
        handleCategoryChangeFn,
        refreshSpecialPageListFn,
        refreshPageListFn
      };
    }
  });
</script>

<template>
  <div class="health-encyclopedia">
    <template v-if="categoryList && categoryList.length">
      <div>
        <van-tabs
          title-active-color="#4B7AFF"
          title-inactive-color="#565961"
          type="line"
          :border="true"
          v-model="activeCategoryId"
          @change="handleCategoryChangeFn"
        >
          <van-tab v-for="item in categoryList" :title="item.categoryName" :name="item.id" :key="item.id"> </van-tab>
        </van-tabs>
      </div>

      <template v-if="unionArticleList && unionArticleList.length">
        <van-pull-refresh v-model="refreshing" @refresh="refreshPageListFn">
          <div class="unionArticleList">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :immediate-check="false"
              @load="queryUnionArticlePageFn"
              offset="50"
            >
              <template v-for="(item, index) in unionArticleList">
                <ArticleCard @click="handleCardClick" class="cardItem" v-bind="item" :index="index" :key="item.id" />
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
    </template>

    <template v-else>
      <van-empty
        class="custom-image"
        image="http://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/healthEncyclopedia/empty-image-default.png"
        description="暂无分类数据~"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .health-encyclopedia {
    min-height: 100%;
    text-align: left;

    ::v-deep .van-tab {
      font-size: 28px;
      padding: 0 24px;
    }

    ::v-deep .van-tabs__line {
      width: 60px;
      height: 4px;
      background: #4b7aff;
      border-radius: 2px;
    }

    ::v-deep .van-tabs__nav--line.van-tabs__nav--complete {
      padding-left: 8px;
      padding-right: 8px;
    }

    ::v-deep .van-empty {
      height: calc(100vh - 46px * 2 - 46px * 2 - 100px);
      padding: 0;

      &.moreHeight {
        height: calc(100vh - 46px * 2 - 46px * 2 - 100px - 50px);
      }
    }

    ::v-deep .custom-image .van-empty__image {
      width: 280px;
      height: 280px;
    }

    .unionArticleList {
      padding: 0 32px;
    }
  }
</style>
