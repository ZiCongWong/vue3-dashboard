import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import type { loginFormData, loginResponseData } from '@/api/user/type.ts'
import { ref } from 'vue'
import type { UserState } from '@/store/modules/type.ts'

const useUserStore = defineStore('user', () => {
  const token = ref<UserState>('')
  const userLogin = async (data: loginFormData) => {
    let res: loginResponseData = await reqLogin(data)
    if (res.code === 200) {
      token.value = res.data.token as string
      return 'OK'
    } else {
      return Promise.reject(new Error(res.data.message))
    }
  }
  return {
    userLogin,
    token,
  }
}, { persist: true })

export default useUserStore