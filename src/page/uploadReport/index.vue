<!--
 * @Description: 上传报告
 * @Author: IFLS
 * @Date: 2022-06-15 17:10:47
 * @LastEditTime: 2023-04-07 11:17:45
-->
<script>
  /**
   * @description: 上传报告页面url接受的参数
   * @param {string} autoback 保存成功后自动返回上一级页面
   * @param {string} add 是否为新增数据 保存调用新增接口 不调用查询接口
   * @param {string} cache 取sessionStorage缓存数据 不调用查询接口
   * @param {string} disabled 禁用上传组件 只做数据回显
   * @param {string} from 来源
   * @return void
   */
  import { defineComponent, reactive, toRefs, onMounted, onBeforeUnmount } from "@vue/composition-api";
  import { Toast } from "vant";
  import useToastGoback from "@/hooks/useToastGoback";
  import UploaderPic from "@/components/Uploader/UploaderPic";
  import UploaderFile from "@/components/Uploader/UploaderFile";
  import { addReport, updateReport, queryReport } from "@/service/uploadReport";
  import { useRouter, useRoute } from "@/hooks/useRouter";
  import { useUserStore, storeToRefs } from "@/pinia";

  export default defineComponent({
    components: {
      UploaderPic,
      UploaderFile
    },
    setup(_, context) {
      const { $router, zgStatistics } = context.root;
      const router = useRouter($router);
      const route = useRoute($router);

      const userStore = useUserStore();
      const { userInfo } = storeToRefs(userStore);

      const state = reactive({
        disabled: false,
        fileListPic: [], // 图片
        fileListFile: [], // 文件
        id: null // 数据id 用于判断是新增或修改数据
      });

      const { toastAndGoback } = useToastGoback();

      const setData = data => {
        // 保存id
        state.id = data.id;

        // 回显图片
        if (data.picUrl.length > 0) {
          const picUrlArr = data.picUrl.split(",");
          const fileListPic = picUrlArr.reduce((total, currentVal) => {
            total.push({ url: currentVal });
            return total;
          }, []);
          state.fileListPic = fileListPic;
        }

        // 回显文件
        state.fileListFile = data.files.data;
      };

      const removeData = () => {
        const { cache } = route.value.query;
        cache && sessionStorage.removeItem("reportDetailCache");
      };

      const queryData = () => {
        const req = {
          memberCode: userInfo.value.memberCode,
          memberId: userInfo.value.memberId,
          empNo: userInfo.value.empNo,
          pageSize: 1,
          pageNum: 1
        };
        queryReport(req).then(({ code, data, message }) => {
          if (code === 0) {
            // 有数据 保存时调用修改接口
            if (data.length === 1) {
              const dt = data[0];
              // 回显图片
              setData(dt);
            }
          } else {
            console.log("queryReport", message);
            // Toast(message)
          }
        });
      };

      const queryDataFromCache = () => {
        let data = sessionStorage.getItem("reportDetailCache");
        data && (data = JSON.parse(data));
        setData(data);
      };

      const onSave = () => {
        const { fileListPic, fileListFile, id } = state;

        if (fileListPic.length === 0 && fileListFile.length === 0) {
          return Toast("您未上传任何资料");
        }

        const picUrlArr = fileListPic.reduce((total, currentVal) => {
          // 发现有上传状态的图片 进行提示 打断代码执行
          if (currentVal.status === "uploading") {
            const tips = "正在上传中, 请稍后";
            Toast(tips);
            throw new Error(tips);
          } else {
            total.push(currentVal.url);
            return total;
          }
        }, []);
        const picUrl = picUrlArr.join(",");

        const files = fileListFile.reduce((total, currentVal) => {
          total.push({
            name: currentVal.name,
            size: currentVal.size,
            type: currentVal.name.split(".")[1],
            url: currentVal.url
          });
          return total;
        }, []);

        const T = [addReport, updateReport];
        // 有id时 调用修改接口 无id时 调用新增
        const idx = id ? 1 : 0;
        const { status } = route.value.query;
        // 上传时间
        const archivesDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const req = {
          memberCode: userInfo.value.memberCode,
          memberId: userInfo.value.memberId,
          empNo: userInfo.value.empNo,
          picUrl,
          archivesDate,
          files: { data: files }
        };
        // 补充时 会传来status=1 保存时传0 告知接口状态变更
        status && (req.archivesStatus = 0);
        id && (req.id = id);
        T[idx](req).then(({ code, message }) => {
          if (code === 0) {
            toastAndGoback().then(() => {
              // 从user进入时 保存成功后自动返回
              const { autoback, from } = route.value.query;
              zgStatistics("健康新奥-点击保存", {
                页面种类: from === "intro" ? "引导页" : "个人设置页",
                页面名称: "上传报告"
              });
              autoback && router.go(-1);
            });
          } else {
            Toast(message);
          }
        });
      };

      onMounted(() => {
        const { disabled, add, cache } = route.value.query;

        if (disabled) {
          state.disabled = true;
        }

        // add=1时 为新增体检报告 不调用查询接口
        if (!add && !cache) {
          queryData();
        }

        // 从列表页来 不凋接口 直接取缓存
        if (cache) {
          queryDataFromCache();
        }
      });

      onBeforeUnmount(removeData);

      return {
        ...toRefs(state),
        onSave
      };
    }
  });
</script>

<template>
  <div class="report-box">
    <ul class="tips">
      <li>1.请上传历史体检报告</li>
      <li>2.上传成功后2个工作日内健康管理师进行解读</li>
    </ul>
    <div class="card upload-pic">
      <div class="title">图片 ({{ fileListPic.length }})</div>
      <div class="subtitle">可上传jpg、jpeg、png、bmp、raw格式图片, 大小不超过10M</div>
      <uploader-pic v-model="fileListPic" :max-count="30" :max-size="10" :disabled="disabled" />
    </div>
    <uploader-file v-model="fileListFile" :max-count="1" :max-size="20" :disabled="disabled" />

    <button class="common-btn fix-btn" v-if="!disabled" @click="onSave">保存</button>
  </div>
</template>

<style lang="scss" scoped>
  @import "../../assets/less/btn.css";
  @import "./index.scss";
</style>
