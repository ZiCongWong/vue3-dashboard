<script setup lang="ts">

</script>

<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <el-icon style="margin-right: 10px">
        <component is="Expand"></component>
      </el-icon>
      <!--      BC-->
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
        <el-breadcrumb-item>promotion management</el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
        <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar_right">
      <el-button type="primary" size="default" icon="Refresh" circle></el-button>
      <el-button type="primary" size="default" icon="FullScreen" circle></el-button>
      <el-button type="primary" size="default" icon="Setting" circle></el-button>
      <img src="/public/edi-w.png" style="width: 32px;height: 32px ;margin: 0px 10px" alt="">
      <!--      dropdown-->
      <el-dropdown>
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>SignOut</el-dropdown-item>
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
  .tabbar_right{
    display: flex;
    align-items: center;

  }
}
</style>