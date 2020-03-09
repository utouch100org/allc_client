import request from '@/utils/request'

const bizBaseUrl = "http://10.211.55.4:8120/api"
const bizSign = "/sys/";

export function getSysList(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'syslist',
      method: 'get',
      params: query
    }) 
  }

  export function getSysById(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'sysbyid',
      method: 'get',
      params: query
    }) 
  }

  export function insertSys(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'insertsys',
      method: 'post',
      params: query
    }) 
  }
  
export function updateSys(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'updatesys',
      method: 'post',
      params: query
    }) 
  }

  export function delSys(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + '/delsys',
      method: 'post',
      params: query
    }) 
  }
