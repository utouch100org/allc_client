import request from '@/utils/request'

const bizBaseUrl = "http://10.211.55.4:8120/api"
const bizSign = "/comp/";

export function getCompList(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'getCompList',
      method: 'get',
      params: query
    }) 
  }

  export function getCompbyid(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'getById',
      method: 'get',
      params: query
    }) 
  }

export function insertComp(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'insertComp',
    method: 'post',
    params: query
  }) 
}

export function updateComp(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'updateComp',
    method: 'post',
    params: query
  }) 
}

export function delComp(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'delComp',
    method: 'post',
    params: query
  }) 
}
