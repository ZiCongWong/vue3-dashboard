//统一管理项目用户相关的接口
import request from '@/utils/request'
import type {loginFormData,loginResponseData,UserInfoResponseData,registerFormData} from '@/api/user/type.ts'

//真实API
enum API {
  STATSURL = '/admin/acl/device/stats'
}

export const getStats = () => request.get<statsRspData>(API.STATSURL)
