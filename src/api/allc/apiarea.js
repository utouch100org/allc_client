import request from '@/utils/request'

const bizBaseUrl = "http://10.211.55.4:8120/api"
const bizSign = "/area/";

export function getAreaList(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'getAreaList',
    method: 'get',
    params: query
  }) 
}

export function getAreaById(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'getAreaById',
      method: 'get',
      params: query
    }) 
  }


export function addArea(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'addArea',
      method: 'post',
      params: query
    //   header: { // 已经在request.js里面进行全局设置，也可以在请求里面局部设置其他headers
    //         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //     }

    }) 
  }

  
export function updateArea(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'updateArea',
      method: 'post',
      params: query
    }) 
  }

  
export function delArea(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'delArea',
      method: 'post',
      params: query
    }) 
  }
  
