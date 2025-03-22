import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout, reqRegister } from '@/api/user'
import type { UserInfoResponseData, loginResponseData, loginFormData, registerFormData } from '@/api/user/type.ts'
import type { UserState } from '@/store/modules/type.ts'

const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: localStorage.getItem('token'),
      username: '',
      avatar: '',
    }
  },
  actions: {
    async userRegister(data:registerFormData){
      let res: registerRsData = await reqRegister(data)
      if (res.code === 200) {
        return 'OK'
      }else {
        return Promise.reject(new Error(res.data))
      }
    },
    async userLogin(data: loginFormData) {
      let res: loginResponseData = await reqLogin(data)
      if (res.code === 200) {
        this.token = res.data.token as string
        // console.log(this.token)
        localStorage.setItem('token', res.data.token)
        return 'OK'
      } else {
        return Promise.reject(new Error(res.data))
      }
    },
    async userInfo() {
      let res:UserInfoResponseData = await reqUserInfo(this.username)
      if (res.code === 200) {
        this.username = res.data.nickname
        this.avatar = res.data.avatar
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    async userLogout() {
      let res:any = await reqLogout()
      if (res.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        localStorage.removeItem('token')
        return 'OK'
      }else{
        return Promise.reject(new Error(res.message))
      }

    },
  },
})

export default useUserStore