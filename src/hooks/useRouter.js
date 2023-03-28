/*
 * @Description: 仿vue3 setup中使用useRouter userRoute形式调用路由
 * 从context.root解构出来的$route不是响应式路由 需要在此处转化 才能在setup函数中使用
 * @Author: IFLS
 * @Date: 2023-03-23 16:01:52
 * @LastEditTime: 2023-03-28 10:21:18
 */
import { getCurrentInstance, shallowRef } from "@vue/composition-api";

export function useRouter(Router) {
  const vm = getCurrentInstance();

  if (vm) {
    return Router;
  }

  console.warn("请在 setup 中调用。");

  return undefined;
}

let currentRoute = shallowRef();

export function useRoute(Router) {
  if (!currentRoute.value) {
    const vm = getCurrentInstance();

    if (!vm) {
      console.warn("请在 setup 中调用。");
      return;
    }

    currentRoute.value = vm.proxy.$route;

    // 每次路由切换时，更新 route 参数
    const router = useRouter(Router);
    router.afterEach(to => (currentRoute.value = to));
  }

  return currentRoute;
}
