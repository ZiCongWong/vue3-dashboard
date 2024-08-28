<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue'
import { reqLogin } from '@/api/user'
import { onMounted } from 'vue'

onMounted(() => {
  reqLogin({ username: 'admin', password: '111111' })

})
</script>

<template>
  <div>
    <router-view></router-view>
    <svg-icon name="home" color="red"></svg-icon>
  </div>
</template>

<style scoped lang="scss">
div {
  color: antiquewhite;

  div {
    color: $color;
  }
}
</style>
