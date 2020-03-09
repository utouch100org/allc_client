import request from '@/utils/request'

const bizBaseUrl = "http://10.211.55.4:8120/api"
const bizSign = "/biz/";

export function getBizList(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'getbizlist',
      method: 'get',
      params: query
    }) 
  }

  export function getBizById(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'getbizbyid',
      method: 'get',
      params: query
    }) 
  }

export function insertBiz(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'insertbiz',
    method: 'post',
    params: query
  }) 
}

export function updateBiz(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'updatebiz',
    method: 'post',
    params: query
  }) 
}

export function delBiz(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'delbiz',
    method: 'post',
    params: query
  }) 
}


export function getDSList(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'getdslist',
    method: 'get',
    params: query
  }) 
}

export function getDSById(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'getdsbyid',
    method: 'get',
    params: query
  }) 
}

export function insertDS(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'insertds',
    method: 'post',
    params: query
  }) 
}

export function updateDS(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'updateds',
    method: 'post',
    params: query
  }) 
}

export function delDS(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'delds',
    method: 'post',
    params: query
  }) 
}

export function saveBizConfig(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'savebizconf',
    method: 'post',
    data: query
  }) 
}

// export function saveBizConfig1(query) {
//   debugger
//   return request({
//     baseURL: bizBaseUrl,
//     url: bizSign + 'savebizconf1',
//     // dataType:"json",
//     // contentType:"application/json", // 指定这个协议很重要
//     // contentType:"application/x-www-form-urlencoded", // 指定这个协议很重要
//     method: 'post',
//     data: query
//   }) 
// }

export function getBizConfigByBizId(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'getbizconfbyid',
    method: 'get',
    params: query
  }) 
}


export function saveBizConfigNotGetParams(data) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'saveBizParams',
    method: 'post',
    data: data
  }) 
}


export function getNotGetBizParams(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'getBizParams',
    method: 'get',
    params: query
  }) 
}
