<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useMenuStore from '@/store/modules/menu.ts'
import { useRoute } from 'vue-router'
import Tabbar from './tabbar/index.vue'

let route = useRoute()
let menuStore = useMenuStore()

</script>

<template>
  <div class="layout_container">
    <!--  左侧菜单-->
    <div class="layout_slider">
      <Logo></Logo>
      <el-scrollbar class="scrollBar">
        <el-menu class="el-menu" background-color="$base-menu-background" text-color="white" router
                 active-text-color='pink' :default-active="route.path">
          <Menu :menuList="menuStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--  顶部菜单-->
    <div class="layout_tabBar">
      <Tabbar></Tabbar>
    </div>
    <!--  内容展示区-->
    <div class="layout_main">
      <p style="height: 9000px"></p>
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

    .scrollBar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabBar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    padding: 0 20px 0 0;
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    background: aquamarine;
    padding: 20px;
    overflow: auto;
  }
}
</style>