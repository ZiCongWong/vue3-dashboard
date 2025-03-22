import { defineStore } from 'pinia'
import { reqC1 } from '@/api/product/attr'

let useCategory = defineStore('Category', {
  state: () => {
    return {
      c1Arr: [],
      c1Id:''
    }
  },
  actions: {
    async getC1() {
      let res: any = await reqC1()
      if (res.code === 200) {
        this.c1Arr = res.data
      }
    },
  },
  getters: {},
})

export default useCategory