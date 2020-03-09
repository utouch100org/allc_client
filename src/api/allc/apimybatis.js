import request from '@/utils/request'

export function getTNList(query) {
  return request({
    baseURL: "http://10.211.55.4:8120/api",
    url: '/dbi/getti',
    method: 'get',
    params: query
  }) 
}

export function getMybatisConfig(query){
    return request({
      baseURL: "http://10.211.55.4:8120/api",
      url: '/dbi/getsql',
      method: 'get',
      params: query
    }) 
}

export function getEntityInfo(query){
  return request({
    baseURL: "http://10.211.55.4:8120/api",
    url: '/dbi/getei',
    method: 'get',
    params: query
  })
}

export function getEntityJsonInfo(query){
  return request({
    baseURL: "http://10.211.55.4:8120/api",
    url: '/dbi/geteij',
    method: 'get',
    params: query
  })
}