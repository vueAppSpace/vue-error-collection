<!--
 * @Description: 上传附件
 * @Author: IFLS
 * @Date: 2022-06-22 17:29:10
 * @LastEditTime: 2023-03-23 17:32:03
-->
<script>
  import { defineComponent, ref } from "@vue/composition-api";
  import { Toast } from "vant";
  import { uploadFile } from "@/service/uploadReport/index";
  import FullLoading from "@/components/Loading";
  export default defineComponent({
    components: {
      FullLoading
    },
    props: {
      // 最大数量
      maxCount: {
        type: Number,
        default: 2
      },
      // 单个文件最大尺寸 单位: MB
      maxSize: {
        type: Number,
        default: 20
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    setup(props, context) {
      const { $set } = context.root;

      const fileSize = ref(0); // 文件尺寸
      const loading = ref(false);

      const renderSize = value => {
        if (null == value || value == "") {
          return "0 Bytes";
        }
        const unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let index = 0;
        const srcsize = parseFloat(value);
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        let size = srcsize / Math.pow(1024, index);
        size = size.toFixed(2); // 保留的小数位数
        return size + unitArr[index];
      };

      const isOverSize = file => {
        const maxSize = 1024 * 1024 * props.maxSize;
        if (file.size <= maxSize) {
          fileSize.value = renderSize(file.size);
          return false;
        } else {
          Toast.fail(`pdf尺寸过大, 仅支持${maxSize}M以下文件`);
          return true;
        }
      };

      const beforeReadFile = file => {
        if (["application/pdf"].includes(file.type)) {
          return true;
        } else {
          Toast.fail("文件格式错误");
          return false;
        }
      };

      const afterReadFile = file => {
        file.status = "uploading";
        file.message = "上传中...";
        loading.value = true;

        const formdata = new FormData();
        formdata.append("file", file.file);
        uploadFile(formdata).then(({ code, data, msg }) => {
          if (code === 1000) {
            try {
              const url = data.keyList[0][Object.keys(data.info)[0]];
              const name = Object.keys(data.info)[0];
              Object.assign(file, { url, status: "success", message: "上传成功" });
              // 强制更新视图
              $set(file, "name", name);
              $set(file, "size", fileSize.value);
              loading.value = false;
            } catch (err) {
              console.warn(err);
            }
          } else {
            Object.assign(file, { status: "failed", message: "上传失败" });
            Toast.fail(msg);
          }
        });
      };

      const delFile = idx => context.attrs.value.splice(idx, 1);

      return {
        loading,
        isOverSize,
        beforeReadFile,
        afterReadFile,
        delFile
      };
    }
  });
</script>

<template>
  <div class="upload-file">
    <full-loading :loading="loading" />
    <div class="title-box">
      <div class="title">附件</div>
      <div class="add">
        <van-uploader
          class="file"
          accept="pdf"
          v-on="$listeners"
          v-bind="$attrs"
          :file-list="$attrs.value"
          :preview-image="false"
          :max-size="isOverSize"
          :before-read="beforeReadFile"
          :after-read="afterReadFile"
          :max-count="maxCount"
          :disabled="disabled"
        >
          添加附件
          <van-icon name="add-o" />
        </van-uploader>
      </div>
    </div>

    <div class="subtitle">可上传PDF文件类型, 大小不超过20M</div>
    <div class="content" v-for="(item, index) in $attrs.value" :key="index">
      <div class="content-icon">
        <img src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/uploadReport/pdf.png" alt="" />
      </div>
      <div class="content-box">
        <div class="content-title">
          {{ item.name }}
        </div>
        <div class="content-size">{{ item.size }}</div>
      </div>
      <div class="content-close" @click="delFile(index)" v-if="!disabled">
        <van-icon name="cross" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .upload-file {
    padding: 32px 32px 16px;
    margin-top: 20px;
    background-color: #fff;
    text-align: left;
    .title-box {
      display: flex;
      justify-content: space-between;
    }
    .title {
      font-size: 32px;
      font-weight: 400;
      text-align: left;
      color: #1c1c1e;
    }
    .subtitle {
      padding: 24px 0 28px 0;
      font-size: 28px;
      font-weight: 400;
      color: #9195a1;
    }
    .add {
      font-size: 32px;
      font-weight: 400;
      color: #abafba;
      .van-icon-add-o {
        color: #4b7aff;
      }
    }
    .content {
      position: relative;
      display: flex;
      padding: 16px 24px;
      margin-bottom: 16px;
      background: #f2f4f8;
      border-radius: 8px;
      border: 1px solid rgba(235, 235, 235, 0.4);
      .content-icon {
        img {
          width: 80px;
          height: 82px;
        }
      }
      .content-box {
        padding: 10px 0 0 10px;
        line-height: 48px;
        .content-title {
          font-size: 30px;
          font-weight: 400;
          color: #565961;
        }
        .content-size {
          font-size: 24px;
          font-weight: 400;
          color: #abafba;
        }
      }
      .content-close {
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translate(0, -50%);
        width: 44px;
        height: 44px;
        background-color: #e8e8e8;
        border-radius: 50%;
        .van-icon {
          position: absolute;
          top: 4px;
          left: 4px;
          font-size: 35px;
          color: #737782;
        }
      }
    }
  }
</style>
