<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import Badge from "./components/badge.vue";
  import HeadFrame from "./components/headFrame.vue";
  import { ornamentUserAll } from "@/service/achievement/index";
  /* 装饰类型字典 */
  const typeMap = { headFrame: "T", badge: "H" };

  export default defineComponent({
    components: { HeadFrame, Badge },
    props: {
      type: String
    },
    setup(props) {
      const { type = typeMap.headFrame } = props;
      const tabList = [
        { type: typeMap.headFrame, title: "头像框" },
        { type: typeMap.badge, title: "徽章" }
      ];
      const active = ref(type);

      // 配饰数据
      const headFrameList = ref([]);
      const badgeList = ref([]);
      getOrnamentUserAll();

      function getOrnamentUserAll() {
        ornamentUserAll()
          .then(({ code, data, message }) => {
            if (code === 0) {
              headFrameList.value = [];
              badgeList.value = [];
              data.forEach(item => {
                const ornamentType = item.ornamentType;
                if (ornamentType === typeMap.headFrame) {
                  headFrameList.value.push(item);
                } else if (ornamentType === typeMap.badge) {
                  badgeList.value.push(item);
                }
              });
            } else {
              console.log("ornamentUserAll:" + message);
            }
          })
          .catch(err => console.log("ornamentUserAll:" + err));
      }

      return {
        typeMap,
        tabList,
        active,
        headFrameList,
        badgeList,
        getOrnamentUserAll
      };
    }
  });
</script>

<template>
  <div class="content-box">
    <van-tabs
      title-active-color="#4B7AFF"
      title-inactive-color="#565961"
      color="#4b7aff"
      type="line"
      :line-width="30"
      :line-height="2"
      :border="true"
      animated
      v-model="active"
    >
      <van-tab
        v-for="(tab, index) in tabList"
        :title="tab.title"
        :key="index"
        :name="tab.type"
        title-style="font-size: 14px"
      >
        <HeadFrame v-if="tab.type === typeMap.headFrame" :list="headFrameList" @updateList="getOrnamentUserAll" />
        <Badge v-if="tab.type === typeMap.badge" :list="badgeList" @updateList="getOrnamentUserAll" />
      </van-tab>
    </van-tabs>
  </div>
</template>
