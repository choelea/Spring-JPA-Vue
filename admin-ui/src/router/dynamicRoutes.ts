import type { RouteRecordRaw } from "vue-router";
import serverRoutes from "./modules/server";
import userRoutes from "./modules/user";

export const dynamicRoutes: RouteRecordRaw[] = [...serverRoutes, ...userRoutes];
