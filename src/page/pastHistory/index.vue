<!--
 * @Description: 既往史
 * @Author: IFLS
 * @Date: 2022-06-17 22:09:45
 * @LastEditTime: 2023-03-23 17:41:22
-->
<script>
  import { defineComponent, reactive, onMounted, toRefs, onBeforeUnmount } from "@vue/composition-api";
  import { Toast, Dialog } from "vant";
  import eventBus from "@/utils/eventBus.js";
  import useToastGoback from "@/hooks/useToastGoback";
  import FullLoading from "@/components/Loading";
  import { unFlatArr } from "@/utils/commonFun";
  import { queryDiseaseProfile, queryUserPortrait, updateUserPortrait } from "@/service/profile";

  export default defineComponent({
    components: {
      FullLoading
    },
    setup(_, context) {
      const { $router: router } = context.root;

      const state = reactive({
        phrId: localStorage.getItem("phrId"),
        history: [],
        loading: false,
        isClick: false
      });

      const { toastAndGoback } = useToastGoback(router);

      const queryList = async () => {
        state.loading = true;
        try {
          // 查询既往史列表
          const { code, data, message } = await queryDiseaseProfile({ diseaseName: "" });
          if (code === 0) {
            if (data) {
              try {
                // 查询已保存既往史
                const dt = await queryUserPortrait({ phrId: state.phrId });
                if (dt.code === 0) {
                  const pastHistoryActive =
                    dt.data &&
                    dt.data.reduce((total, currentVal) => {
                      if (currentVal.code === "lk1589863312232") {
                        total.push(currentVal);
                      }
                      return total;
                    }, []);
                  // 将已保存既往史选中数据添加到既往史列表 用作回显
                  data.forEach(val => {
                    pastHistoryActive &&
                      pastHistoryActive.forEach(v => {
                        // 匹配选中的code 用作既往史数据回显
                        if (
                          val["disease_lk_code"] == v.value ||
                          val["secondary_page_subordinate_disease_lk_code"] == v.value
                        ) {
                          val.result = [val.id];
                        }
                      });
                  });
                  // 数组升维
                  state.history = unFlatArr(data, "classification_of_disease_code");
                  state.loading = false;
                } else {
                  Toast(dt.message);
                }
              } catch (err) {
                console.warn(err);
                state.loading = false;
              }
            }
          } else {
            console.log("queryDiseaseProfile", message);
            // Toast(message)
          }
        } catch (err) {
          console.warn(err);
          state.loading = false;
        }
      };

      const onSave = cb => {
        const arr = [...state.history];
        let quotaList = [];
        arr.forEach(items => {
          // 三级数据
          if (items.length > 1) {
            items.forEach(val => {
              quotaList.push({
                quotaCode: val.result && val.result.length > 0 ? "lk1589863312232" : "!lk1589863312232",
                quotaValue: val["disease_lk_code"]
              });
            });
          } else {
            // 二级数据
            quotaList.push({
              quotaCode: items[0].result && items[0].result.length > 0 ? "lk1589863312232" : "!lk1589863312232",
              quotaValue: items[0]["disease_lk_code"]
            });
          }
        });

        const req = { uid: state.phrId, quotaList };
        updateUserPortrait(req).then(({ code, message }) => {
          if (code === 0) {
            if (typeof cb === "function") {
              cb();
            } else {
              toastAndGoback();
            }
          } else {
            Toast(message);
          }
        });
      };

      const onClick = () => (state.isClick = true);

      const onBack = () => {
        if (state.isClick) {
          Dialog.confirm({
            title: "提示",
            message: "您还未对修改进行保存，是否立即保存？",
            confirmButtonColor: "#4d87f9",
            beforeClose: (action, done) => {
              if (action === "confirm") {
                onSave(() => {
                  done();
                  toastAndGoback();
                });
              } else {
                done();
                router.go(-1);
              }
            }
          }).catch(() => {});
        } else {
          router.go(-1);
        }
      };

      onMounted(() => {
        queryList();
        eventBus.$on("onback", onBack);
      });

      onBeforeUnmount(() => {
        eventBus.$off("onback");
      });

      return {
        ...toRefs(state),
        onSave,
        onClick
      };
    }
  });
</script>

<template>
  <div class="box">
    <full-loading :loading="loading" />
    <div class="item-box" v-for="(item, index) in history" :key="item[0].id">
      <van-cell-group>
        <van-cell :title="item.length === 1 ? item[0].disease_name : ''" :class="{ 'detail-cell': item.length > 1 }">
          <template #title v-if="item.length > 1">
            <van-cell-group>
              <van-cell class="title">{{ item[0].classification_of_disease_name }}</van-cell>
              <van-cell
                v-for="(val, idx) in item"
                :key="val.id"
                :title="val.secondary_page_subordinate_disease_name"
                :name="idx"
              >
                <van-checkbox-group v-model="val.result">
                  <van-checkbox :name="val.id" shape="square" :ref="`checkboxesDetail${index}`" @click="onClick">
                    {{ val.disease_name }}
                  </van-checkbox>
                </van-checkbox-group>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-else #right-icon>
            <van-checkbox-group v-model="item[0].result">
              <van-checkbox :name="item[0].id" shape="square" ref="checkboxes" />
            </van-checkbox-group>
          </template>
        </van-cell>
      </van-cell-group>

      <button class="common-btn fix-btn" v-debounce="3000" @click="onSave">保存</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "../profile/index.scss";
  @import "../../assets/less/btn.css";
  .box {
    padding-bottom: 190px;
    .item-box {
      .title {
        .van-cell__value {
          position: relative;
          font-size: 28px;
          font-weight: 500;
          color: #1c1c1e;
        }
      }
      .title::before {
        position: absolute;
        top: 33px;
        left: 0;
        display: block;
        content: "";
        width: 8px;
        height: 28px;
        background: #4b7aff;
        border-radius: 0px 4px 4px 0px;
      }
      .van-cell {
        margin: 0;
        padding: 24px 28px 24px 24px;
      }
      .detail-cell {
        padding: 0;
      }
      .van-cell-group {
        margin-bottom: 20px;
      }
      .van-cell__title {
        .van-hairline--top-bottom {
          margin: 0;
        }
        .van-cell::after {
          right: 0;
          left: 0;
        }
      }
      .van-checkbox {
        justify-content: space-between;
        ::v-deep.van-checkbox__icon {
          order: 1;
        }
        ::v-deep.van-icon {
          border-radius: 8px;
        }
      }
    }
  }
  ::v-deep.van-dialog {
    .van-dialog__confirm {
      .van-button__text {
        color: linear-gradient(90deg, #5ba4ff 0%, #467ffc 100%);
      }
    }
  }
</style>
