//统一管理咱们项目用户相关的接口

import request from '@/utils/request'
//
// import type {
//
//   loginFormData,
//
//   loginResponseData,
//
//   userInfoReponseData,
//
// } from './type'
//
// //项目用户相关的请求地址
//
// enum API {
//   // LOGIN_URL = '/admin/acl/index/login',
//   LOGIN_URL = '/user/login',
//   USERINFO_URL = 'user/info',
//   LOGOUT_URL = '/admin/acl/index/logout',
// }
//
// //登录接口
// export const reqLogin = (data: loginFormData) => request.post<any, loginResponseData>(API.LOGIN_URL, data)
// //获取用户信息
//
// export const reqUserInfo = () => request.get<any, userInfoReponseData>(API.USERINFO_URL)
//
// //退出登录
//
// export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)

//真实API
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

export const reqLogin = (data: any) => request.post<any, any>(API.LOGIN_URL, data)

export const reqUserInfo = () => request.get<any, any>(API.USERINFO_URL)

export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)