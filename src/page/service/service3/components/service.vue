<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import ServiceList from "./serviceList.vue";
  import { useService } from "./useService.js";
  import { healthServiceInsert, healthServiceUpdate } from "@/service/service";
  import { Toast } from "vant";

  export default defineComponent({
    components: {
      ServiceList
    },
    props: {
      editFlag: {
        type: Boolean,
        default: false
      }
    },
    setup(_, ctx) {
      const { $router: router } = ctx.root;

      const active = ref(0);
      const editType = ["reduce", "add"];
      const { id, isEmpty, myServiceData, allServiceData, initServiceData, editService } = useService();

      function goEdit() {
        router.push("/service-edit");
      }

      function saveEdit() {
        const myService = myServiceData.value.map(item => item.id);
        let saveEditFn, params;
        if (isEmpty.value) {
          params = { myService: { myService } };
          saveEditFn = healthServiceInsert;
        } else {
          params = { myService: { myService }, id: id.value };
          saveEditFn = healthServiceUpdate;
        }

        saveEditFn(params)
          .then(({ code, message }) => {
            if (code === 0) {
              Toast({
                message: "保存成功",
                onClose() {
                  router.go(-1);
                }
              });
            } else {
              //console.log("saveEdit", message);
            }
          })
          .catch(err => console.log("saveEdit", err));
      }

      return {
        active,
        editType,
        myServiceData,
        allServiceData,
        initServiceData,
        goEdit,
        saveEdit,
        editService
      };
    },
    activated() {
      this.initServiceData();
    }
  });
</script>

<template>
  <div class="service-content" :class="{ 'service-content-bottom': editFlag }">
    <div class="my-service box-style" :class="{ 'my-service-bottom': !myServiceData.length }">
      <div class="top">
        <div class="title font-medium">我的服务</div>
        <div v-if="!editFlag" class="edit font-regular" @click="goEdit">编辑</div>
      </div>

      <ServiceList
        v-if="myServiceData.length"
        :list="myServiceData"
        :type="editType[0]"
        :editFlag="editFlag"
        @editService="editService"
      />
      <div v-else class="guide">
        暂无服务，点击<span v-if="editFlag">加号</span
        ><span v-else style="color: #4b7aff" @click="goEdit">编辑</span>进行添加吧～
      </div>
    </div>
    <div class="all-service box-style">
      <van-tabs
        v-model="active"
        shrink
        title-inactive-color="#3D3E42"
        title-active-color="#4B7AFF"
        animated
        :swipe-threshold="3"
      >
        <van-tab :title="item.title" v-for="item in allServiceData" :key="item.id">
          <ServiceList :list="item.children" :type="editType[1]" :editFlag="editFlag" @editService="editService" />
        </van-tab>
      </van-tabs>
    </div>

    <div v-if="editFlag" class="save-btn font-medium" @click="saveEdit">保存</div>
  </div>
</template>

<style lang="scss" scoped>
  .service-content {
    &.service-content-bottom {
      padding-bottom: 200px;
    }
    .box-style {
      width: 690px;
      margin: 30px auto 0;
      border-radius: 16px;
      overflow: hidden;
      background: #fff;
    }
    .my-service {
      padding-top: 24px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px 0 30px;
        .title {
          font-size: 34px;
          line-height: 48px;
          color: #1c1c1e;
        }
        .edit {
          font-size: 26px;
          line-height: 36px;
          color: #4b7aff;
        }
      }
      .guide {
        width: 642px;
        height: 136px;
        background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/my_service_guide.png")
          no-repeat;
        background-size: 100% 100%;
        margin: 20px auto 0;
        font-size: 26px;
        line-height: 36px;
        text-align: left;
        color: #1c1c1e;
        padding: 54px 0 0 69px;
      }
    }
    .my-service-bottom {
      padding-bottom: 28px;
    }
    .all-service {
      padding-top: 24px;
      ::v-deep .van-tabs--line .van-tabs__wrap {
        height: auto;
      }
      ::v-deep .van-tabs__nav--line {
        padding: 0 9px 14px;
      }
      ::v-deep .van-tab {
        flex: none;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        font-size: 28px;
        line-height: 40px;
        padding: 0;
        margin: 0 15px;
      }
      ::v-deep .van-tab--active {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        font-size: 34px;
        line-height: 48px;
      }
      ::v-deep .van-tabs__line {
        background: url("https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/service/tab_line.png")
          no-repeat;
        background-size: 100% 100%;
        border-radius: 0 !important;
        bottom: 0px;
        width: 48px;
        height: 8px;
      }
    }
    .save-btn {
      width: 686px;
      height: 88px;
      background: #4b7aff;
      border-radius: 44px;
      font-size: 32px;
      line-height: 88px;
      text-align: center;
      color: #fff;
      position: fixed;
      left: 50%;
      bottom: 64px;
      transform: translateX(-50%);
    }
  }
</style>
