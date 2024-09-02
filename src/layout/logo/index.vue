<script setup lang="ts" name="Logo">
import setting from '@/setting.ts'
</script>

<template>
  <div class="logo" v-if="setting.logoHide">
    <img :src="setting.logo" alt="">
    <p>{{ setting.title }}</p></div>
</template>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  overflow: hidden;
  p {
    font-size: $base-logo-title-fontSize;
  }

  img {
    width: 85px
  }
}

</style>