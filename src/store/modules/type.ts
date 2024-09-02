import type { RouteRecordRaw } from 'vue-router'

export interface UserState {
  token: string | null;
  username: string;
  avatar: string;
}

export interface MenuSate {
  menuRoutes: RouteRecordRaw[]
}