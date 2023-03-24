<script>
  import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    onActivated,
    onDeActivated,
    watch,
    ref
  } from "@vue/composition-api";
  export default defineComponent({
    props: {},
    setup(props, context) {
      const state = reactive({
        locationCityName: "廊坊",
        cityList: [
          {
            name: "廊坊",
            cityCode: "0316"
          },
          {
            name: "天津",
            cityCode: "022"
          },
          {
            name: "石家庄",
            cityCode: "0311"
          }
        ]
      });

      const selectCityHandle = item => {
        console.log("item", item);
      };

      const locationAgainFn = () => {
        console.log("获取定位信息");
      };
      return {
        ...toRefs(state),
        selectCityHandle,
        locationAgainFn
      };
    }
  });
</script>
<template>
  <div class="container">
    <div class="locationCityInfo">
      <div class="title flex-center"> 定位城市 </div>
      <div class="info flex-center">
        <div class="left flex">
          <img src="https://lk-webfont.oss-cn-beijing.aliyuncs.com/web/xinao-health/images/meal/location.png" />
          <div class="city_name">{{ locationCityName }}</div>
        </div>

        <div class="location_again" @click="locationAgainFn">重新定位</div>
      </div>
    </div>

    <div>
      <div class="title flex-center">已开通城市</div>
      <div class="city_list">
        <div class="content_item" v-for="(item, index) in cityList" :key="index" @click="selectCityHandle(item)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .title {
    padding-left: 40px;
    height: 60px;
    background: #f0f2f7;
    font-size: 26px;
    color: #999;
  }
  .info {
    height: 120px;
    padding-left: 40px;
    padding-right: 30px;
    .left {
      flex: 1;
      img {
        width: 26px;
        height: 32px;
        margin-right: 20px;
      }
      .city_name {
        font-size: 28px;
        color: #333;
      }
    }
    .location_again {
      font-size: 24px;
      color: #4b7aff;
      text-align: right;
    }
  }

  .content_item {
    padding-left: 40px;
    font-size: 28px;
    color: #333;
    line-height: 60px;
    text-align: left;
    background-color: #fff;
  }
  .content_item:active {
    filter: brightness(0.8);
    transition: 0.2s;
  }
  .city_list .content_item:first-child {
    margin-top: 20px;
  }
</style>
