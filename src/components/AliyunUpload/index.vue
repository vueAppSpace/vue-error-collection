<template>
  <div class="container">
    <div class="upload">
      <div>
        <input
          type="file"
          v-show="false"
          id="fileUpload"
          ref="fileUpload"
          :accept="accept"
          :multiple="multiple"
          @change="fileChange($event)"
        />
      </div>
      <div @click="handleClick" class="content-file-select">
        <img
          src="https://lk-webfont.oss-accelerate.aliyuncs.com/web/xinao-health/images/active/add.png"
          alt=""
          srcset=""
        />
      </div>
      <!-- <van-button type="success" @click="authUpload" :disabled="uploadDisabled">开始上传</van-button> -->
      <!-- <div class="upload-type">
        上传状态:
        <span>{{ statusText }}</span>
        <span style="margin-left:30px;">
          上传进度:
          <span>{{ authProgress }}</span> %
        </span>
      </div> -->
    </div>
  </div>
</template>

<script>
  // import "../../aliyun/aliyun-upload-sdk/lib/es6-promise.min.js"
  // import "../../aliyun/aliyun-upload-sdk/lib/aliyun-oss-sdk-6.13.0.min.js"
  // import "../../aliyun/aliyun-upload-sdk/aliyun-upload-sdk-1.5.2.min.js"
  import { loadScript } from "@/utils/commonFun";
  import scriptUrl from "@/utils/url";
  loadScript(scriptUrl.aliyunUpload);
  loadScript(scriptUrl.aliyunOss);
  //分类id
  // 七修课程 （1000221282）
  // 测试视频 （1000221368）
  // 经络穴位 （1000237336）
  import { createUploadVideo, refreshUploadVideo, getVideoUrl } from "@/service/aliyunUpload";
  // import { duration } from "moment";
  export default {
    props: ["index", "accept", "multiple"],
    data() {
      return {
        file: null,
        authProgress: 0,
        uploadDisabled: false,
        uploader: null,
        statusText: "未上传",
        videoId: "",
        cover: ""
      };
    },
    methods: {
      getVideosDuration(file) {
        return new Promise(resolve => {
          const oVideo = document.createElement("video");
          // const oVideo = document.getElementById('video');
          oVideo.currentTime = 7;
          oVideo.onloadedmetadata = e => {
            let canvas = document.createElement("canvas");
            URL.revokeObjectURL(file);
            let width = oVideo.videoWidth; //获取视频的宽
            let height = oVideo.videoHeight; //获取视频的高
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d");
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(oVideo, 0, 0, width, height);
            // 这里是把已经绘制好的 canvas 转成base64
            var dataURL = canvas.toDataURL("image/png");
            console.log(dataURL, "dataUrl------");
            // 视频总长度，秒为单位
            resolve({ duration: oVideo.duration, cover: dataURL });
            // oVideo.get(0).play();
          };
          oVideo.src = URL.createObjectURL(file);
        });
      },
      handleClick() {
        this.$refs.fileUpload.click();
      },
      //选择文件
      fileChange(e) {
        this.file = e.target.files[0];
        let tempFiles = e.target.files;
        console.log(tempFiles, "tempFiles");
        let arrayLikeFiles = Array.from(tempFiles);
        let allImage = arrayLikeFiles.every(item => {
          return item.type.indexOf("image") != -1;
        });
        let allVideo = arrayLikeFiles.every(item => {
          return item.type.indexOf("video") != -1;
        });
        if (!this.file) {
          return;
        }
        if (this.file.size / (1024 * 1024) > 25) {
          this.$toast({
            message: "文件过大，请重新选择"
          });
          return;
        }
        var userData = '{"Vod":{}}';
        if (this.uploader) {
          this.uploader.stopUpload();
          this.authProgress = 0;
          this.statusText = "";
        }
        if (this.file.type.indexOf("video") !== -1) {
          var file = document.getElementById("fileUpload");
          file.value = "";
          if (!allVideo) {
            this.$toast("请选择视频格式");
            return;
          }
          this.getVideosDuration(this.file).then(({ duration, cover }) => {
            let long = Math.floor(duration);
            this.cover = cover;
            if (long < 30 || long == 30) {
              this.uploader = this.createUploader();
              this.uploader.addFile(this.file, null, null, null, userData);
              this.authUpload();
            } else {
              this.$toast({
                message: "视频超长，请重新上传"
              });
            }
          });
        } else if (this.file.type.indexOf("image") !== -1) {
          if (!allImage) {
            let file = document.getElementById("fileUpload");
            file.value = "";
            this.$toast("请全部选择图片");
            return;
          }
          if (e.target.files.length > 9) {
            let file = document.getElementById("fileUpload");
            file.value = "";
            this.$toast("最多选择9个");
            return;
          } else {
            this.$emit("imagesSelect", e.target.files);
          }

          var file = document.getElementById("fileUpload");
          console.log(file, "file----");
          file.value = "";
        }

        this.uploadDisabled = false;
      },
      //点击开始上传
      authUpload() {
        // 然后调用 startUpload 方法, 开始上传
        if (this.uploader !== null) {
          this.uploader.startUpload();
          this.uploadDisabled = true;
        }
      },
      //获取上传凭证的方法
      getVideoCredential(uploadInfo, uploader) {
        let params = {
          description: "",
          fileName: this.file.name,
          title: this.file.name.split(".")[0],
          coverURL: "",
          cateId: localStorage.getItem("cateId"),
          zone: "beijing"
        };
        console.log(params);
        createUploadVideo(params).then(res => {
          console.log(res, "上传凭证");
          console.log(uploader, "uploader");
          if (res.code == 1000) {
            let uploadAuth = res.data.UploadAuth;
            let uploadAddress = res.data.UploadAddress;
            let videoId = res.data.VideoId;
            this.videoId = res.data.VideoId;
            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
          }
        });
      },

      //刷新上传凭证的方法
      refreshUploadCredential(uploadInfo, uploader) {
        let params = {
          videoId: uploadInfo.videoId
        };
        refreshUploadVideo(params).then(res => {
          console.log(res, "刷新上传凭证");
          if (res.code == 1000) {
            let uploadAuth = res.data.UploadAuth;
            let uploadAddress = res.data.UploadAddress;
            let videoId = res.data.VideoId;
            this.videoId = res.data.VideoId;
            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
          }
        });
      },

      //凭证超时
      credentialOvertime(uploadInfo, uploader) {
        let params = {
          videoId: uploadInfo.videoId
        };
        refreshUploadVideo(params).then(res => {
          console.log(res, "刷新上传凭证");
          if (res.code == 1000) {
            let uploadAuth = res.data.UploadAuth;
            uploader.resumeUploadWithAuth(uploadAuth);
          }
        });
      },
      //获取视频信息
      // getVideoInfo(uploadInfo) {
      //   let params = {
      //     videoId: this.videoId
      //   };
      //   getVideoUrl(params).then(res => {
      //     console.log(res, "获取视频地址和时长");
      //     if (res.code == 1000) {
      //       console.log(res);
      //     }
      //   });
      // },

      createUploader(type) {
        let self = this;
        let uploader = new AliyunUpload.Vod({
          timeout: 600000,
          partSize: 1048576,
          parallel: 5,
          retryCount: 3,
          retryDuration: 2,
          region: "cn-beijing",
          userId: "1448801287043470",
          // 添加文件成功
          addFileSuccess: function (uploadInfo) {
            self.uploadDisabled = false;
            self.statusText = "添加文件成功, 等待上传...";
            console.log("addFileSuccess: " + uploadInfo.file.name);
          },
          // 开始上传
          onUploadstarted: function (uploadInfo) {
            console.log(uploadInfo, "uploadInfo之前");
            // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
            // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
            // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
            // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
            // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
            // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
            if (!uploadInfo.videoId) {
              self.getVideoCredential(uploadInfo, uploader); //调用获取凭证的方法
              self.statusText = "文件开始上传...";
            } else {
              // 如果videoId有值，根据videoId刷新上传凭证
              self.refreshUploadCredential(uploadInfo, uploader);
            }
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo) {
            self.statusText = "文件上传成功!";
            self.$emit("getVideo", uploadInfo, self.cover);
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo, code, message) {
            self.statusText = "文件上传失败!";
          },
          // 取消文件上传
          // onUploadCanceled: function(uploadInfo, code, message) {
          //   self.statusText = "文件已暂停上传";
          // },
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function (uploadInfo, totalSize, progress) {
            let progressPercent = Math.ceil(progress * 100);
            console.log("progress", progressPercent);
            self.$emit("progress", progressPercent);
          },
          // 上传凭证超时
          onUploadTokenExpired: function (uploadInfo) {
            // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
            // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
            // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
            // let refreshUrl =
            //   "https://demo-vod.cn-beijing.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=" +
            //   uploadInfo.videoId;
            // axios.get(refreshUrl).then(({ data }) => {
            //   let uploadAuth = data.UploadAuth;
            //   uploader.resumeUploadWithAuth(uploadAuth);
            //   console.log(
            //     "upload expired and resume upload with uploadauth " + uploadAuth
            //   );
            // });

            self.credentialOvertime(uploadInfo, uploader);
            self.statusText = "文件超时...";
          },
          // 全部文件上传结束
          onUploadEnd: function (uploadInfo) {
            console.log("onUploadEnd: uploaded all the files");
            self.statusText = "文件上传完毕";
          }
        });
        return uploader;
      }
    }
  };
</script>
<style scoped lang="scss">
  .content-file-select {
    width: 220px;
    height: 220px;
    background-color: #f2f4f8;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;

    img {
      width: 66px;
      height: 66px;
    }
  }
</style>
