import request from '@/utils/request'

const bizBaseUrl = "http://10.211.55.4:8120/api"
const bizSign = "/tbl/";

export function getTableList(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'gettbllist',
      method: 'get',
      params: query
    }) 
  }

  export function getTableById(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'gettblbyid',
      method: 'get',
      params: query
    }) 
  }

  export function insertTable(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'inserttbl',
      method: 'post',
      params: query
    }) 
  }
  
export function updateTable(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + 'updatetbl',
      method: 'post',
      params: query
    }) 
  }

  export function delTable(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + '/deltbl',
      method: 'post',
      params: query
    }) 
  }

// --------- 数据表 列处理 ---------

export function getTableColList(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'gettblcolbylist',
    method: 'get',
    params: query
  }) 
}

export function getTableColById(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'gettblcolbyid',
    method: 'get',
    params: query
  }) 
}

export function getTableColByTid(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'gettblcolbytid',
    method: 'get',
    params: query
  }) 
}

export function insertTableCol(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'inserttblcol',
    method: 'post',
    params: query
  }) 
}

export function updateTableCol(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'updatetblcol',
    method: 'post',
    params: query
  }) 
}

export function delTableCol(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'deltblcol',
    method: 'post',
    params: query
  }) 
}

export function getdstbllistbydsid(query) {
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'getdstbllistbydsid',
    method: 'get',
    params: query
  }) 
}

export function savedstbllist(query) {
  debugger
  return request({
    baseURL: bizBaseUrl,
    url: bizSign + 'savedstbllist',
    method: 'post',
    data: query
  }) 
}
