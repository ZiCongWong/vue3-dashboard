<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting.ts'
import useUserStore from '@/store/modules/user.ts'
import * as querystring from 'node:querystring'

let route = useRoute()
let router = useRouter()
let useSettingStore = useLayoutSettingStore()
const changeIcon = () => {
  useSettingStore.changeFold()
}
const updateRefresh = () => {
  useSettingStore.changeRefresh()
}
const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
let userStore = useUserStore()

const Ulogout = async () => {
  await userStore.userLogout()
  await router.push({ path: '/login', query: { redirect: route.path } })
}
</script>

<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <el-icon style="margin-right: 10px" @click="changeIcon">
        <component :is="useSettingStore.fold?'Fold':'Expand'"></component>
      </el-icon>
      <!--      BC-->
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in route.matched" :key="index" :to="item.path"
                            v-show="item.meta.title">
          <el-icon style="margin: 0 3px; vertical-align: top">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>

      </el-breadcrumb>
    </div>
    <div class="tabbar_right">
      <el-button size="default" icon="Refresh" circle @click="updateRefresh"></el-button>
      <el-button size="default" icon="FullScreen" circle @click="fullScreen"></el-button>
      <el-button size="default" icon="Setting" circle></el-button>
      <img :src="userStore.avatar" style="border-radius: 50%; width: 32px;height: 32px ;margin: 0px
      10px"
           alt="">
      <!--      dropdown-->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="Ulogout">logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 20px;

  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;

  }
}
</style>