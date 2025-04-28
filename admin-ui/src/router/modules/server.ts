import type { RouteRecordRaw } from "vue-router";
export const Layout = () => import("@/layout/index.vue");

const serverRoutes: RouteRecordRaw[] = [
  {
    path: "/server",
    component: Layout,
    redirect: "index",
    meta: {
      title: "服务器列表",
      icon: "table",
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/server/index.vue"),
        name: "serverIndex",
        meta: {
          title: "服务器列表",
          icon: "table",
          alwaysShow: true,
        },
      },
    ],
  },
];

export default serverRoutes;
