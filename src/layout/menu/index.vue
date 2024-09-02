<script setup lang="ts" name='Menu'>
import useLayoutSettingStore from '@/store/modules/setting.ts'

defineProps({
  menuList: {
    type: Array,
    default: () => [],
  },
})
let useSettingStore = useLayoutSettingStore()
</script>


<template>
  <template v-for="(item, index) in menuList" :key="index">
    <template v-if="!item.children">
      <el-menu-item v-if="!item.meta.hidden" :index="item.path">
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

</template>

<style scoped lang="scss">

</style>