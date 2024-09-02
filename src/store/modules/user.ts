import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { loginFormData, loginResponseData, userInfo } from '@/api/user/type.ts'
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
    async userLogin(data: any) {
      let res: any = await reqLogin(data)
      if (res.code === 200) {
        this.token = res.data as string
        localStorage.setItem('token', res.data)
        return 'OK'
      } else {
        return Promise.reject(new Error(res.data))
      }
    },
    async userInfo() {
      let res = await reqUserInfo()
      if (res.code === 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    async userLogout() {
      let res = await reqLogout()
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