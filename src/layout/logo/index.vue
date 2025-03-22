<script setup lang="ts" name="Logo">
import setting from '@/setting.ts'
import useLayoutSettingStore from '@/store/modules/setting.ts'

let layoutStore = useLayoutSettingStore()
</script>

<template>
  <div class="logo" v-if="setting.logoHide">
    <img :src="setting.logo" alt="">
    <p v-show="!layoutStore.fold">{{ setting.title }}</p></div>
</template>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: black;
  display: flex;
  align-items: center;
  overflow: hidden;
  p {
    font-size: $base-logo-title-fontSize;
    font-weight: bold;
  }

  img {
    width: 85px
  }
}

</style>