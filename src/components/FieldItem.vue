<!--
 * @Description: 疫情登记
 * @Author: WANGCHENGAE
 * @Date: 2022-11-17 18:00:30
 * @LastEditTime: 2023-03-23 17:32:20
-->
<template>
  <div class="field" :key="index">
    <div class="title">
      <span v-if="required">*</span>
      {{ title }}
    </div>
    <template v-if="fieldType === 0">
      <van-field
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :maxLength="maxLength"
        :rules="rules"
        :value="value"
        v-model="inputValue"
      />
    </template>
    <template v-else-if="fieldType === 1">
      <van-field>
        <template #input>
          <van-checkbox-group v-model="inputValue" direction="horizontal">
            <template v-for="(text, index) in textArray">
              <van-checkbox :name="text" shape="square" :key="index">{{ text }}</van-checkbox>
            </template>
          </van-checkbox-group>
        </template>
      </van-field>
    </template>
    <template v-else-if="fieldType === 2">
      <van-field>
        <template #input>
          <van-radio-group v-model="inputValue" direction="horizontal">
            <template v-for="(item, index) in valueArray">
              <van-radio :name="item.value" shape="round" :key="index">
                {{ item.label }}
              </van-radio>
            </template>
          </van-radio-group>
        </template>
      </van-field>
    </template>
  </div>
</template>

<script>
  import { defineComponent, reactive, ref, toRef } from "@vue/composition-api";

  export default defineComponent({
    props: {
      index: {
        type: Number
      },
      required: {
        type: Boolean,
        default: false,
        required: false
      },
      title: {
        type: String,
        default: ""
      },
      name: {
        type: String,
        default: ""
      },
      value: {
        type: String | Number,
        default: "" | 0
      },
      maxLength: {
        type: Number,
        default: 50,
        required: false
      },
      placeholder: {
        type: String,
        default: ""
      },
      rules: {
        type: Array,
        default: () => [],
        required: false
      },
      //text password tel
      type: {
        type: String,
        default: "text"
      },
      //0 input,1 check, 2 radio
      fieldType: {
        type: Number,
        default: 0
      },
      valueArray: {
        type: Array,
        default: () => [],
        required: false
      }
    },
    data() {
      return {
        inputValue: this.value
      };
    },
    watch: {
      value(val) {
        this.inputValue = val;
      },
      inputValue(val) {
        this.$emit("input", {
          fieldType: this.fieldType,
          index: this.index,
          value: val
        });
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import "../style/scss/variable.scss";

  .field {
    .title {
      font-size: 28px;
      color: $primary-text-color;
      text-align: left;
      font-weight: bold;
      margin-bottom: 16px;
    }

    span {
      color: $required-color;
    }

    $input-border-color: #e6e8ef;

    ::v-deep .van-cell {
      border-radius: 8px;
      border: 2px solid $input-border-color;
      padding: 22px 26px;
      line-height: 36px;
    }

    ::v-deep .van-field__control {
      font-size: 26px;
    }

    ::v-deep .van-field__control--custom {
      flex: 1;
      min-height: initial;
    }

    ::v-deep .van-radio {
      flex: 1;
    }

    ::v-deep .van-radio__icon {
      height: initial;
      line-height: initial;
    }

    ::v-deep .van-radio__icon .van-icon {
      width: 32px;
      height: 32px;
      line-height: 0.33rem;
      font-size: 20px;
    }

    ::v-deep .van-radio-group--horizontal {
      flex: 1;
    }

    ::v-deep .van-radio__label {
      font-size: 28px;
      line-height: inherit;
    }
  }
</style>
