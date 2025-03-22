import request from '@/utils/request.ts'
import type { TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type.ts'

enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

export const reqHasTrademark = (page: number, limit: number) => request.get<TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    return request.put<any>(API.UPDATETRADEMARK_URL, data)
  } else {
    return request.post<any>(API.ADDTRADEMARK_URL, data)
  }
}

export const reqDeleteTrademark = (id: number) => request.delete<any>(API.DELETE_URL + id)