import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false,
      refresh: false,
      pageSize: 3,
    }
  },
  actions: {
    changeFold() {
      this.fold = !this.fold
    },
    changeRefresh() {
      this.refresh = !this.refresh
    },
    changePageSize(pageSize: any) {
      this.pageSize = pageSize
    },
  },
  persist: true,
})
export default useLayoutSettingStore