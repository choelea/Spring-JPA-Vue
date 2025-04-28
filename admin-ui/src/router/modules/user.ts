import type { RouteRecordRaw } from "vue-router";
export const Layout = () => import("@/layout/index.vue");

const userRoutes: RouteRecordRaw[] = [
  {
    path: "/user",
    component: Layout,
    redirect: "index",
    meta: {
      title: "客户列表",
      icon: "table",
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/user/index.vue"),
        name: "userIndex",
        meta: {
          title: "客户列表",
          icon: "table",
          alwaysShow: true,
        },
      },
    ],
  },
];

export default userRoutes;
