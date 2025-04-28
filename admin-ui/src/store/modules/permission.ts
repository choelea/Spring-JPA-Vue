import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { dynamicRoutes } from "@/router/dynamicRoutes";
import { store } from "@/store";
import router from "@/router";
// import MenuAPI, { MenuVO } from "@/api/system/menu";

export const usePermissionStore = defineStore("permission", () => {
  // 储所有路由，包括静态路由和动态路由
  const routes = ref<RouteRecordRaw[]>([]);
  // 混合模式左侧菜单路由
  const mixedLayoutLeftRoutes = ref<RouteRecordRaw[]>([]);
  // 路由是否加载完成
  const isRoutesLoaded = ref(false);

  /**
   * 生成路由，直接使用已经融合的路由
   *
   * @returns Promise<RouteRecordRaw[]> 合并后的路由列表
   */
  async function generateRoutes() {
    // let userMenuIds = ref<number[]>([]);
    // try {
    //   userMenuIds.value = (await MenuAPI.getUserMenuIds()).menus.map((menu: MenuVO) => menu.type);
    // } catch (error) {
    //   console.log("error: ", error);
    // }
    // // 根据用户菜单权限过滤动态路由
    // const filteredDynamicRoutes = dynamicRoutes.filter((route) => {
    //   return userMenuIds.value.includes(route.meta?.role as number);
    // });
    // 合并静态路由和过滤后的动态路由
    const allRoutes = [...constantRoutes, ...dynamicRoutes];
    routes.value = allRoutes;
    isRoutesLoaded.value = true;
    return allRoutes;
  }

  /**
   * 根据父菜单路径设置混合模式左侧菜单
   *
   * @param parentPath 父菜单的路径，用于查找对应的菜单项
   */
  const setMixedLayoutLeftRoutes = (parentPath: string) => {
    const matchedItem = routes.value.find((item) => item.path === parentPath);
    if (matchedItem && matchedItem.children) {
      mixedLayoutLeftRoutes.value = matchedItem.children;
    }
  };

  /**
   * 重置路由
   */
  const resetRouter = () => {
    //  从 router 实例中移除动态路由
    routes.value.forEach((route) => {
      if (route.name && !constantRoutes.find((r) => r.name === route.name)) {
        router.removeRoute(route.name);
      }
    });

    // 清空本地存储的路由和菜单数据
    routes.value = [];
    mixedLayoutLeftRoutes.value = [];
    isRoutesLoaded.value = false;
  };

  return {
    routes,
    mixedLayoutLeftRoutes,
    isRoutesLoaded,
    generateRoutes,
    setMixedLayoutLeftRoutes,
    resetRouter,
  };
});

/**
 * 在组件外使用 Pinia store 实例 @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
