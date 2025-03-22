//统一管理项目用户相关的接口
import request from '@/utils/request'
import type {loginFormData,loginResponseData,UserInfoResponseData,registerFormData} from '@/api/user/type.ts'

//真实API
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
  REGISTER_URL = '/admin/acl/index/register',
}

export const reqLogin = (data: loginFormData) => request.post<loginResponseData>(API.LOGIN_URL, data)

export const reqUserInfo = () => request.get<UserInfoResponseData>(API.USERINFO_URL)

export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)

export const reqRegister = (data: registerFormData)=> request.post<any,any>(API.REGISTER_URL,data)