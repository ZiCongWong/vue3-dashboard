interface dataType {
  token?: string,
  user?: user,
}

interface user {
  id:number,
  username: string,
  password: string
}

export interface loginResponseData {
  code: number,
  message: string,
  data: dataType
}

export interface loginFormData {
  username: string,
  password: string,
}

export interface registerFormData {
  username: string,
  password: string,
  confirmPassword: string,
  email: string,
  phone: string,
  agreement: false
}

export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

export interface loginResponseData extends ResponseData {
  data: string
}

export interface registerRsData extends ResponseData {
  data: string
}

export interface UserInfoResponseData extends ResponseData{
  data:{
    // routes:string[],
    // buttons:string[],
    // roles:string[],
    name: string,
    avatar:string,
  }
}
