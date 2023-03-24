<!--
 * @Description: 既往史详情 1.0.11版本后 此页面弃用
 * @Author: IFLS
 * @Date: 2022-06-17 22:28:10
 * @LastEditTime: 2023-03-23 17:41:20
-->
<script>
  import { defineComponent, reactive, toRefs } from "@vue/composition-api";
  import useToastGoback from "@/hooks/useToastGoback";
  import { Toast } from "vant";
  import { unFlatArr } from "@/utils/commonFun";
  import { updateUserPortrait } from "@/service/profile";

  export default defineComponent({
    setup(_, { refs, root }) {
      const { $router: router, $route: route, zgStatistics } = root;

      let historyData = JSON.parse(sessionStorage.getItem("pastHistoryDetail"));

      const history = unFlatArr(historyData, "disease_code");

      let activeNames = [];
      history.forEach((val, idx) => {
        if (val.length > 1) {
          // 展开全部面板
          activeNames.push(idx);
          val.forEach(v => {
            // 为二级checkbox添加空value 且筛选掉已存在的result
            !v.result && (v.result = []);
          });
        }
      });

      const state = reactive({
        phrId: localStorage.getItem("phrId"),
        history,
        activeNames,
        result: [],
        timer: null
      });

      const { toastAndGoback } = useToastGoback(router);

      const toggle = (item, index, event) => {
        const checkboxState = event.target.parentNode.parentNode.getAttribute("aria-checked");
        // 存在二级checkbox情况
        if (item.length > 1) {
          // 全选反选所有二级checkbox
          const hasChecked = item.some(v => v.result.length !== 0);
          refs[`checkboxesDetail${index}`].forEach(components => {
            if (checkboxState === "false" && hasChecked) {
              components.toggle(false);
            } else if (checkboxState === "true") {
              components.toggle(true);
            }
          });
        } else {
          // 一级checkbox添加选中状态
          if (checkboxState === "true") {
            item[0].result = [item[0]["id"]];
            state.history[index] = item;
          } else {
            delete state.history[index][0].result;
          }
        }
      };

      const toggleDetail = (item, index) => {
        // 注意: 此处点击事件触发时 checkbox还未改值 导致数据变更存在延迟
        clearTimeout(state.timer);
        const timer = setTimeout(() => {
          // 首次点击时 触发外层checkbox选中 避免value为空
          const hasChecked = item.some(v => v.result.length !== 0);
          hasChecked && refs.checkboxes[index].toggle(true);

          // 反选外层checkbox
          const allFalse = item.every(v => v.result.length === 0);
          allFalse && refs.checkboxes[index].toggle(false);
        }, 100);
        state.timer = timer;
      };

      const onSave = () => {
        const arr = [...new Set([...state.history, ...state.result])];
        let quotaList = [];
        arr.forEach(items => {
          // 三级数据
          if (items.length > 1) {
            items.forEach(val => {
              quotaList.push({
                quotaCode: val.result && val.result.length > 0 ? "lk1589863312232" : "!lk1589863312232",
                quotaValue: val["secondary_page_subordinate_disease_lk_code"]
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
            toastAndGoback();
          } else {
            Toast(message);
          }
        });
      };

      return {
        ...toRefs(state),
        toggle,
        toggleDetail,
        onSave
      };
    }
  });
</script>

<template>
  <div class="box">
    <van-cell-group>
      <van-cell
        v-for="(item, index) in history"
        :key="index"
        :title="item.length === 1 ? item[0].disease_name : ''"
        :class="{ 'detail-cell': item.length > 1 }"
      >
        <template #title v-if="item.length > 1">
          <van-collapse v-model="activeNames" :border="false">
            <van-collapse-item :title="item[0].disease_name" :name="index">
              <van-cell-group>
                <van-cell
                  v-for="(val, idx) in item"
                  :key="val.id"
                  :title="val.secondary_page_subordinate_disease_name"
                  :name="idx"
                  @click="toggleDetail(item, index)"
                >
                  <template #right-icon>
                    <van-checkbox-group v-model="val.result">
                      <van-checkbox :name="val.id" shape="square" :ref="`checkboxesDetail${index}`" />
                    </van-checkbox-group>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-collapse-item>
          </van-collapse>
        </template>

        <template v-else #right-icon>
          <van-checkbox-group v-model="item[0].result">
            <van-checkbox :name="item[0].id" shape="square" ref="checkboxes" @click="toggle(item, index, $event)" />
          </van-checkbox-group>
          <!-- <van-checkbox-group v-model="result">
                        <van-checkbox :name="item" shape="square" ref="checkboxes" @click="toggle(item, index, $event)" />
                    </van-checkbox-group> -->
        </template>
      </van-cell>
    </van-cell-group>

    <button class="common-btn fix-btn" v-debounce="3000" @click="onSave">保存</button>
  </div>
</template>

<style lang="scss" scoped>
  @import "../profile/index.scss";
  @import "../../assets/less/btn.css";
  .box {
    padding-bottom: 190px;
    ::v-deep.van-checkbox__icon {
      .van-icon {
        border-radius: 7px;
        border: 2px solid #abaeba;
      }
    }
    ::v-deep.detail-cell {
      position: relative;
      padding: 0 !important;
      > .van-checkbox-group {
        position: absolute;
        top: 24px;
        right: 32px;
      }
      .van-cell--clickable {
        padding: 0;
        align-items: center;
        .van-cell__title {
          flex: inherit;
          padding: 0.24rem 0.32rem;
        }
      }
      .van-collapse-item__content {
        padding-top: 0;
      }
      .van-hairline--top-bottom {
        .van-cell {
          padding-right: 0;
        }
      }
      .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border: none;
      }
    }
  }
</style>
