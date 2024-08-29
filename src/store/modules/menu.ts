import { defineStore } from 'pinia'
import { constantRoute } from '@/router/routes.ts'

const useMenuStore = defineStore('menu', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      menuRoutes: constantRoute,
    }
  },
})

export default useMenuStore