import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore',{
  state:()=>{
    return{
      fold:false,
      refresh:false
    }
  },
  actions:{
    changeFold(){
      this.fold = !this.fold
    },
    changeRefresh(){
      this.refresh = !this.refresh
    }
  },
  persist:true
})
export default useLayoutSettingStore;