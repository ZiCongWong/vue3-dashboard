<script setup lang="ts">

import useCategory from '@/store/modules/category.ts'
import { onMounted, ref } from 'vue'

let categoryStore = useCategory()

onMounted(() => {
  getC1()
})

const getC1 = () => {
  categoryStore.getC1()
}
</script>

<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select style="width: 240px" v-model="categoryStore.c1Id">
            <el-option v-for="(c1,index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name"
                       :value="c1.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select style="width: 240px">
            <el-option label="北京"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select style="width: 240px">
            <el-option label="北京"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<style scoped lang="scss">

</style>