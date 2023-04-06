<!--
 * @Date: 2023-02-27 11:29:45
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-04-06 14:16:50
 * @FilePath: \lk-xinaohealth-h5\src\page\healthEducation\searchPage.vue
-->
<script>
  import { Toast } from "vant";
  import { defineComponent, reactive, toRefs, onMounted, watch } from "@vue/composition-api";
  import { queryHealthMission } from "@/service/healthEducation/index";
  import { useRouter } from "@/hooks/useRouter";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    components: {},
    setup(_, context) {
      const { zgStatistics, $router } = context.root;
      const router = useRouter($router);

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        listDatas: [],
        //控制加载list
        loading: false,
        finished: false,
        queryName: "",
        finishedText: "没有更多了"
      });

      onMounted(() => {});

      function queryUnionArticlePageFn(e) {
        console.log(e);
      }

      function handleToDetail({ educationAnswer }) {
        zgStatistics("健康新奥-点击卡片", {
          所属功能: "服务",
          页面类型: "页面",
          所属模块: "健康宣教",
          卡片名称: educationQuestion,
          搜索词: state.queryName
        });
        localStorage.setItem("educationAnswer", educationAnswer);
        router.push({ path: "arcitle-detail" });
      }

      //列表数据
      async function queryHealthMissionFn() {
        const toast = Toast.loading({
          message: "加载中...",
          duration: 0,
          forbidClick: true
        });
        let params = {
          phrId: userInfo.value.phrId,
          tagList: null,
          max: 50,
          query: state.queryName == "" ? null : state.queryName
        };
        try {
          const { code, message, data } = await queryHealthMission(params);
          toast.clear();
          state.finished = true;
          if (data.length) {
            state.finishedText = "没有更多了";
          } else {
            state.finishedText = "没有相关数据";
          }
          if (code == 0) {
            state.listDatas = data;
          }
        } catch (error) {
          toast.clear();
          Toast("查询数据出错请稍后再试");
        }
      }

      watch(
        () => state.queryName,
        (newValue, oldValue) => {
          if (newValue != "") {
            queryHealthMissionFn();
          } else {
            state.listDatas = [];
            state.finishedText = "没有相关数据";
          }
        }
      );

      return {
        ...toRefs(state),
        handleToDetail,
        queryUnionArticlePageFn
      };
    }
  });
</script>

<template>
  <div class="health_education_search">
    <!-- 右侧的内容 -->
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishedText"
      :immediate-check="false"
      @load="queryUnionArticlePageFn"
      offset="50"
    >
      <div class="search_box">
        <img
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/search_icon.png"
          alt=""
        />
        <van-field v-model="queryName" label="" placeholder="请输入搜索关键词" :clearable="true" />
      </div>
      <div class="picture_box">
        <div class="picture_item" v-for="(item, index) in listDatas" :key="index" @click="handleToDetail(item)">
          <img :src="item.educationPicture169" alt="" />
          <div class="title_bar">
            {{ item.educationQuestion }}
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
  .health_education_search {
    display: flex;
    flex-direction: column;
    margin: 0 32px;
    overflow: auto;
    .search_box {
      width: 100%;
      height: 60px;
      margin-top: 24px;
      display: flex;
      align-items: center;
      background: #f2f2f2;
      border-radius: 28px;
      margin-bottom: 22px;
      padding: 10px;
      font-size: 22px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9da0a1;
      ::v-deep.van-field {
        background: #f2f2f2;
        padding: 0;
      }
      img {
        width: 32px;
        height: 32px;
        margin-right: 14px;
      }
    }
    .picture_box {
      width: 100%;
      display: flex;
      flex-direction: column;
      .picture_item {
        width: 100%;
        height: 255px;
        position: relative;
        margin-bottom: 10px;
        border-radius: 0 0 8px 8px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0 0 8px 8px;
        }
        .title_bar {
          width: 100%;
          padding: 10px 24px;
          text-align: left;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden; //溢出内容隐藏
          text-overflow: ellipsis; //文本溢出部分用省略号表示
          display: -webkit-box; //特别显示模式
          -webkit-line-clamp: 2; //行数
          line-clamp: 2;
          -webkit-box-orient: vertical; //盒子中内容竖直排列
          background: rgba(0, 0, 0, 0.7);
          position: absolute;
          bottom: 0;
          left: 0;
          border-radius: 0 0 8px 8px;
          font-size: 22px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
</style>
