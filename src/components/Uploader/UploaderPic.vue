<!--
 * @Description: 上传图片
 * @Author: IFLS
 * @Date: 2022-06-22 14:28:55
 * @LastEditTime: 2023-03-23 17:32:05
-->
<script>
  import { defineComponent } from "@vue/composition-api";
  import { Toast } from "vant";
  import { uploadPic } from "@/service/uploadReport/index";
  import Compressor from "compressorjs";
  export default defineComponent({
    props: {
      // 最大数量
      maxCount: {
        type: Number,
        default: 10
      },
      // 单个文件最大尺寸 单位: MB
      maxSize: {
        type: Number,
        default: 5
      },
      disabled: {
        type: Boolean,
        default: false
      },
      uploadText: {
        type: String,
        default: ""
      }
    },
    setup(props) {
      const isOverSize = file => {
        const maxSize = 1024 * 1024 * props.maxSize;
        if (file.size <= maxSize) {
          return false;
        } else {
          Toast.fail(`图片尺寸过大, 仅支持${props.maxSize}M以下图片`);
          return true;
        }
      };

      const beforeReadPic = file => {
        if (file instanceof Array) {
          Toast.fail("每次仅支持选择一张图片");
          return false;
        }
        if (!["image/png", "image/bmp", "image/jpg", "image/jpeg", "image/raw"].includes(file.type)) {
          Toast.fail("图片格式错误");
          return false;
        }
        // compressorjs 默认开启 checkOrientation 选项 用于修正图片方向
        return new Promise(resolve => {
          new Compressor(file, {
            success(result) {
              const newFile = new File([result], file.name, { type: file.type });
              resolve(newFile);
            },
            error(err) {
              console.log("图片转换失败", err.message);
            }
          });
        });
      };

      const afterReadPic = file => {
        file.status = "uploading";
        file.message = "上传中...";
        const formdata = new FormData();
        formdata.append("file", file.file);
        uploadPic(formdata).then(({ code, data, msg }) => {
          if (code === 1000) {
            try {
              const url = data.keyList[0][Object.keys(data.info)[0]];
              const name = Object.keys(data.info)[0];
              Object.assign(file, { url, name, status: "success", message: "上传成功" });
            } catch (err) {
              console.warn(err);
            }
          } else {
            Object.assign(file, { status: "failed", message: "上传失败" });
            Toast.fail(msg);
          }
        });
      };

      return {
        isOverSize,
        beforeReadPic,
        afterReadPic
      };
    }
  });
</script>

<template>
  <van-uploader
    class="uploader-pic"
    v-on="$listeners"
    v-bind="$attrs"
    :file-list="$attrs.value"
    :max-size="isOverSize"
    :before-read="beforeReadPic"
    :after-read="afterReadPic"
    :max-count="maxCount"
    :disabled="disabled"
    :show-upload="!disabled"
    :deletable="!disabled"
    :upload-text="uploadText"
    upload-icon="plus"
  />
</template>

<style lang="scss" scoped>
  .uploader-pic {
    ::v-deep.van-uploader__upload-icon {
      color: #737782;
      font-size: 90px;
      font-weight: 500;
    }
    ::v-deep .van-uploader__preview {
      margin: 0 5px 0 0;
      .van-uploader__preview-image {
        width: 220px;
        height: 220px;
      }
      .van-uploader__preview-delete {
        width: 46px;
        height: 46px;
        background-color: #e8e8e8;
        border-radius: 50%;
        .van-uploader__preview-delete-icon {
          font-size: 55px;
          color: #737782;
        }
      }
    }
    ::v-deep.van-uploader__upload {
      width: 220px;
      height: 220px;
    }
  }
</style>
