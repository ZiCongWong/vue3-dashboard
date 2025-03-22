export interface ResponData {
  code:number,
  message:string,
  ok:boolean
}

export interface TradeMark{
  id?:number|null,
  tmName:string,
  logoUrl:string,
}

export type Records =TradeMark[];

export interface TradeMarkResponseData extends ResponData{
  data: Records,
  total: number,
  size:number,
  currentPage:number,
  searchCount:boolean,
  pages:number,
}