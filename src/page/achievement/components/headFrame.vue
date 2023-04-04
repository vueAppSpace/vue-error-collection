<script>
  import { defineComponent } from "@vue/composition-api";
  import tips from "@/components/Tips.vue";
  import { useOrnament } from "./useOrnament.js";

  export default defineComponent({
    components: { tips },
    props: {
      list: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    emit: ["updateList"],
    setup(_, { emit }) {
      const ornamentData = useOrnament(emit);

      return {
        ...ornamentData
      };
    }
  });
</script>

<template>
  <div>
    <div class="content-box">
      <div
        class="head"
        :class="`head-${index % 3}`"
        v-for="(item, index) in list"
        :key="item.ornamentId"
        @click="onSelectOrnament(item)"
      >
        <img :src="item.ornamentImgUrl" alt="" />
        <div
          class="btn font-regular"
          :class="{
            used: item.wearState === 1,
            useable: item.wearState === 0 && item.isHave === 1,
            unavailable: item.isHave === 0
          }"
        >
          {{ getBtnText(item) }}
        </div>
      </div>
    </div>
    <tips :value.sync="showTips" title="" titleNum="" :exp="0">
      <template>
        <div class="tips-content">
          <img class="head" :src="selectedOrnament.ornamentImgUrl" alt="" />
          <div class="head-name">
            <img class="wing wing-left" :src="ImgsMap.blue_wing_left" alt="" />
            <div class="name font-medium">{{ selectedOrnament.ornamentName }}</div>
            <img class="wing" :src="ImgsMap.blue_wing_right" alt="" />
          </div>
          <div class="get-way font-regular">获得方式：{{ selectedOrnament.ornamentDesc }}</div>
          <div
            class="btn font-regular"
            :class="{
              used: selectedOrnament.wearState === 1,
              useable: selectedOrnament.wearState === 0 && selectedOrnament.isHave === 1,
              unavailable: selectedOrnament.isHave === 0
            }"
            @click="onHandleOrnament"
          >
            {{ getBtnText(selectedOrnament) }}
          </div>
        </div>
      </template>
    </tips>
  </div>
</template>

<style lang="scss" scoped>
  .content-box {
    overflow-x: hidden;
    min-height: 50vh;
    background: linear-gradient(180deg, #f3f7ff 0%, #ffffff 100%);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 364px;
    padding: 48px 0 68px;
    img {
      display: block;
    }
    .head {
      img {
        width: 248px;
        height: 228px;
        object-fit: contain;
      }
      .btn {
        width: 156px;
        height: 64px;
        border-radius: 32px;
        font-size: 28px;
        line-height: 64px;
        color: #fff;
        margin: 24px auto 0;
      }
      .useable {
        background: #4b7aff;
      }
      .used {
        border: 2px solid #4b7aff;
        color: #4b7aff;
      }
      .unavailable {
        background: #d0d4dc;
      }
    }
    .head-0 {
      justify-self: start;
    }
    .head-1 {
      justify-self: center;
    }
    .head-2 {
      justify-self: end;
    }
  }
  .tips-content {
    padding-bottom: 28px;
    .head {
      width: 348px;
      height: 320px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
    .head-name {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      .wing {
        width: 38px;
        height: 34px;
        object-fit: contain;
        display: block;
      }
      .name {
        color: #1b1c1e;
        font-size: 34px;
        line-height: 48px;
        margin: 0 10px;
      }
    }
    .get-way {
      margin: 20px auto 0;
      width: 500px;
      font-size: 28px;
      line-height: 40px;
      color: #2b2c2f;
    }
    .btn {
      box-sizing: border-box;
      width: 460px;
      height: 90px;
      border-radius: 90px;
      font-size: 32px;
      line-height: 90px;
      color: #fff;
      margin: 48px auto 0;
    }
    .useable {
      background: #4b7aff;
    }
    .used {
      border: 2px solid #4b7aff;
      color: #4b7aff;
    }
    .unavailable {
      background: #d0d4dc;
    }
  }
</style>
