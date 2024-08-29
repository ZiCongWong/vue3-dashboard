<script setup lang="ts">

defineProps({
  menuList: {
    type: Array,
    default: () => [],
  },
})
const goRoute = (vc: any) => {


}
</script>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<template>
  <template v-for="(item, index) in menuList" :key="index">
    <template v-if="!item.children">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <template v-if="item.children&&item.children.length==1">
      <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path">
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <el-sub-menu v-if="item.children&&item.children.length > 1" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
  <!--  <el-menu-item index="1">HOME</el-menu-item>-->
  <!--  <el-menu-item index="2">DataScreen</el-menu-item>-->
  <!--  <el-sub-menu index="3">-->
  <!--    <template #title>-->
  <!--      <span>PermissionsManagement</span>-->
  <!--    </template>-->
  <!--    <el-menu-item index="2-1">UserManagement</el-menu-item>-->
  <!--    <el-menu-item index="2-2">RoleManagement</el-menu-item>-->
  <!--    <el-menu-item index="2-3">MenuManagement</el-menu-item>-->
  <!--  </el-sub-menu>-->
</template>

<style scoped lang="scss">

</style>