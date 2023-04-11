import { reactive, toRefs } from "@vue/composition-api";
import serviceData from "../data.js";
import { getHealthService } from "@/service/service";
import { Toast } from "vant";
import { useUserStore, storeToRefs } from "@/pinia";

export function useService() {
  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);

  const state = reactive({
    myServiceData: [],
    allServiceData: [],
    isEmpty: true,
    id: ""
  });

  /* 初始化，增加 已添加到我的服务的属性 added */
  async function initServiceData() {
    try {
      const { code, data, message } = await getHealthService({
        memberCode: userInfo.value.memberCode,
        pageSize: 1,
        pageIndex: 1
      });
      if (code === 0) {
        state.isEmpty = !data.length;

        let myService = [];
        const resData = data.length ? data[0] : null;
        if (resData) {
          myService = resData.myService.myService;
          state.id = resData.id;
        }

        // 处理数据
        const myServiceData = [];
        serviceData.forEach(item => {
          item.children.forEach(child => {
            const serviceId = myService.find(serviceId => serviceId === child.id);
            if (serviceId) {
              child.added = true;
              // 把我的服务项和全部服务项进行绑定，方便增删操作
              myServiceData.push({ ...child, origin: child });
            } else {
              child.added = false;
            }
          });
        });
        state.allServiceData = serviceData;
        state.myServiceData = myServiceData;
      } else {
        //console.log("getHealthService: ", message);
      }
    } catch (err) {
      //console.log("getHealthService: ", err);
    }
  }

  function editService(service, type, index) {
    if (type === "add") {
      if (state.myServiceData.length === 8) {
        Toast("最多可添加 8 个我的服务");
        return;
      } else {
        service.added = true;
        state.myServiceData.push({ ...service, origin: service });
      }
    } else if (type === "reduce") {
      service.origin.added = false;
      state.myServiceData.splice(index, 1);
    }
  }

  return {
    ...toRefs(state),
    initServiceData,
    editService
  };
}
