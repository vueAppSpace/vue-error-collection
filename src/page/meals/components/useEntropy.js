import { useUserStore, storeToRefs } from "@/pinia";
import { getCurrentEntropy } from "@/service/health/index";

export default async function (afterDate = "") {
  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);

  const userId = userInfo.value.phrId;
  let [entropyData, isResponded, status] = [{}, false, -1];

  try {
    const req = { userId, afterDate };
    const { code, data, message } = await getCurrentEntropy(req);
    isResponded = true;
    if (code === 0) {
      const { code: lifeCode, data: lifeData } = data;
      if (lifeCode === 200 && lifeData.status === 200 && lifeData.entropyVal) {
        entropyData = lifeData;
        status = 200;
      } else {
        status = lifeData.status;
        console.log("生命熵数据不完整: ", lifeData.msg);
      }
    } else {
      console.log("getCurrentEntropyMessage", message);
    }
  } catch (err) {
    isResponded = true;
    console.log("getCurrentEntropyErr", err);
  }

  return { entropyData, isResponded, status };
}
