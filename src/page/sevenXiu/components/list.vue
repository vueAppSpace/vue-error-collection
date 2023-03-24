<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import { videoCourseUnionList } from "@/service/sevenXiu";

  export default defineComponent({
    props: ["id", "type"],
    emits: ["playVideo", "clickCard"],
    setup(props, context) {
      const { _router: router, zgStatistics } = context.root;
      const pageData = { pageIndex: 1, pageSize: 10 };
      const loading = ref(false);
      const finished = ref(false);
      const list = ref([]);

      function onLoad() {
        console.log("loading");
        videoCourseUnionList({ ...pageData, categoryId: props.id })
          .then(({ code, data, message }) => {
            if (code === 0) {
              list.value = [...list.value, ...data];
              pageData.pageIndex++;
              loading.value = false;
              if (data.length < pageData.pageSize) {
                finished.value = true;
              }
            } else {
              loading.value = false;
              finished.value = true;
              console.log("videoCourseUnionList", message);
            }
          })
          .catch(err => {
            loading.value = false;
            finished.value = true;
            console.log(err);
          });
      }

      function coursePlay(data) {
        let link;
        if (data.type === "1") {
          router.push({
            path: "/seven-xiu-course",
            query: {
              navTitle: data.name,
              categoryId: data.categoryId,
              courseId: data.id
            }
          });
          link = "/seven-xiu-course";
        } else if (data.type === "2") {
          context.emit("playVideo", { ...data, type: props.type, name: data.name });
          link = data.videoUrl;
        }

        context.emit("clickCard", zgStatistics, { type: props.type, name: data.name, link });
      }

      return {
        list,
        loading,
        finished,
        onLoad,
        coursePlay
      };
    }
  });
</script>

<template>
  <van-list class="list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <div class="video-box" v-for="(item, index) in list" :key="index" @click="coursePlay(item)">
      <img class="cover" :src="item.imgUrl" alt="" />
      <div class="play-icon" v-if="item.type === '2'">
        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/sevenXiu/video_2.png" />
      </div>
    </div>
  </van-list>
</template>

<style lang="scss" scoped>
  .list {
    padding-top: 24px;
    .video-box {
      position: relative;
      width: 686px;
      margin: 0 auto 24px;
      .cover {
        display: block;
        width: 686px;
        height: 320px;
        border-radius: 24px;
        object-fit: cover;
      }
      .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
          display: block;
          width: 90px;
          height: 90px;
        }
      }
    }
  }
</style>
