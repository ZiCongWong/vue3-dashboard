<script setup lang="ts" name="Layout">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useMenuStore from '@/store/modules/menu.ts'
import { useRoute } from 'vue-router'
import Tabbar from './tabbar/index.vue'
import useLayoutSettingStore from '@/store/modules/setting.ts'
import { nextTick, ref, watch } from 'vue'

let useSettingStore = useLayoutSettingStore()
let route = useRoute()
let menuStore = useMenuStore()
let flag = ref(true)
watch(() => useSettingStore.refresh, () => {
  console.log(123)
  flag.value = false
  nextTick(() => {
    flag.value = true
  })
})
</script>


<template>
  <div class="layout_container">
    <!--  左侧菜单-->
    <div class="layout_slider" :class="{fold:useSettingStore.fold}">
      <Logo></Logo>
      <el-scrollbar class="scrollBar">
        <el-menu background-color="#001529" text-color="white" mode="vertical"
                 router
                 active-text-color='pink' :default-active="route.path" :collapse="useSettingStore.fold"
                 collapse-transition>
          <Menu :menuList="menuStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--  顶部菜单-->
    <div class="layout_tabBar" :class="{fold:useSettingStore.fold}">
      <Tabbar></Tabbar>
    </div>
    <!--  内容展示区-->
    <div class="layout_main" :class="{fold:useSettingStore.fold}">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" v-if="flag" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;


  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: white;
    transition: all 0.3s;

    .scrollBar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-mini-width;
    }
  }

  .layout_tabBar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    padding: 0 20px 0 0;
    transition: all 0.3s;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.6);

    &.fold {
      width: calc(100vw - $base-menu-mini-width);
      left: $base-menu-mini-width
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-mini-width);
      left: $base-menu-mini-width
    }
  }
}

//animate
.page-fade-enter-active,
.page-fade-leave-active {
  animation-duration: 0.4s;
}

.page-fade-enter-from {
  animation-name: fadeIn;
}

.page-fade-leave-to {
  animation-name: fadeOut;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

</style>