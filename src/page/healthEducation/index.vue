<!--
 * @Date: 2023-02-27 11:29:45
 * @LastEditors: yanghaifengb yanghaifengb@enn.cn
 * @LastEditTime: 2023-03-31 14:01:23
 * @FilePath: \lk-xinaohealth-h5\src\page\healthEducation\index.vue
-->
<script>
  import { Toast } from "vant";
  import { defineComponent, reactive, toRefs, onMounted, nextTick, ref } from "@vue/composition-api";
  import { queryHealthMission, queryHealthMissionTagList } from "@/service/healthEducation/index";
  import { useRouter } from "@/hooks/useRouter";

  export default defineComponent({
    components: {},
    setup(_, context) {
      const { zgStatistics, $router } = context.root;
      const router = useRouter($router);

      const state = reactive({
        tagDatas: [],
        listDatas: [],
        tagCode: null,
        //控制加载list
        loading: false,
        finished: false,
        activeTagItem: {
          tagMetadataCodeList: null,
          itemName: "全部"
        }
      });

      const mianscroll = ref("mianscroll");

      onMounted(() => {
        // 标签
        queryHealthMissionTagListFn();
        // 列表
        queryHealthMissionFn();
      });

      function queryUnionArticlePageFn(e) {
        console.log(e);
      }

      function clickTag(e) {
        zgStatistics("健康新奥-点击切换菜单", {
          所属功能: "服务",
          类型: "菜单",
          所属模块: "健康宣教",
          所点菜单名称: e.itemName
        });
        state.activeTagItem = e;
        queryHealthMissionFn();
      }

      function handleToDetail({ educationAnswer }) {
        zgStatistics("健康新奥-点击卡片", {
          所属功能: "服务",
          页面类型: "页面",
          所属模块: "健康宣教",
          所属分类: state.activeTagItem.itemName,
          卡片名称: educationQuestion,
          跳转内容链接: "arcitle-detail"
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
          phrId: localStorage.getItem("phrId"),
          tagList: state.activeTagItem.tagMetadataCodeList,
          max: 50
        };
        try {
          const { code, message, data } = await queryHealthMission(params);
          toast.clear();
          state.finished = true;
          if (code == 0) {
            state.listDatas = data;
          }
          nextTick(() => {
            if (mianscroll.value) {
              mianscroll.value.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }
          });
        } catch (error) {
          toast.clear();
          Toast("查询数据出错请稍后再试");
        }
      }

      // 标签数据
      async function queryHealthMissionTagListFn() {
        const { code, message, data } = await queryHealthMissionTagList();
        if (code == 0) {
          state.tagDatas = [{ tagMetadataCodeList: null, itemName: "全部" }, ...data.splice(0, 5)];
        }
      }

      function toSearchPage() {
        zgStatistics("健康新奥-点击搜索", {
          所属功能: "服务",
          所属模块: "健康宣教"
        });
        router.push({ path: "search-page" });
      }

      return {
        ...toRefs(state),
        clickTag,
        handleToDetail,
        queryUnionArticlePageFn,
        toSearchPage,
        mianscroll
      };
    }
  });
</script>

<template>
  <div class="health_education">
    <div class="left_tag">
      <div
        :class="['item_tag', activeTagItem.itemName == item.itemName ? 'active_tag' : '']"
        v-for="(item, index) in tagDatas"
        :key="index"
        @click="clickTag(item)"
      >
        {{ item.itemName }}
      </div>
    </div>
    <!-- 右侧的内容 -->
    <div class="right_list">
      <div class="search_box" @click="toSearchPage">
        <img
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/icon/search_icon.png"
          alt=""
        />
        <span>请输入搜索关键词</span>
      </div>
      <div class="right_list_content" ref="mianscroll">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="queryUnionArticlePageFn"
          offset="50"
        >
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .health_education {
    display: flex;
    height: 100%;
    overflow: hidden;
    .left_tag {
      width: 260px;
      height: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column;
      background: #f4f5f6;
      white-space: nowrap;
      .item_tag {
        height: 90px;
        line-height: 90px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        padding-left: 24px;
        text-align: left;
      }
      .active_tag {
        position: relative;
        font-size: 28px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #4b7aff;
        // -webkit-text-stroke: 1px #4b7aff;
        //   text-stroke: 1px #4b7aff;
        &::after {
          display: inline-block;
          content: "";
          width: 5px;
          height: 16px;
          background: #4b7aff;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .right_list {
      margin: 0 32px;
      flex: 1;
      height: 100vh;
      overflow: hidden;
      .search_box {
        width: 100%;
        height: 56px;
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
        img {
          width: 32px;
          height: 32px;
          margin-right: 14px;
        }
      }
      .right_list_content {
        height: calc(100vh - 220px);
        overflow: auto;
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
    }
  }
</style>
