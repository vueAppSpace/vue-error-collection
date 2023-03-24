/*
 * @Description: 仿vue3 setup中使用useRouter userRoute形式调用路由
 * @Author: IFLS
 * @Date: 2023-03-23 16:01:52
 * @LastEditTime: 2023-03-23 16:04:21
 */
/*
import { useRoute, useRouter } from '@/hooks/useRouter'
setup() {
    const route = useRoute()
    const router = useRouter()

    watch(route, () => {
      console.log('route change', route.value)
    })

    function routeChange() {
      router.push({ path: '/home', query: { key: Date.now() } })
    }

    return {
      routeChange
    }
  }
*/
import { getCurrentInstance, shallowRef } from "@vue/composition-api";
import { router } from "@/router";

export function useRouter() {
  const vm = getCurrentInstance();

  if (vm) {
    return router;
  }

  console.warn("请在 setup 中调用。");

  return undefined;
}

let currentRoute = shallowRef();

export function useRoute() {
  if (!currentRoute.value) {
    const vm = getCurrentInstance();

    if (!vm) {
      console.warn("请在 setup 中调用。");
      return;
    }

    currentRoute.value = vm.proxy.$route;

    // 每次路由切换时，更新 route 参数
    const router = useRouter();
    router.afterEach(to => (currentRoute.value = to));
  }

  return currentRoute;
}
