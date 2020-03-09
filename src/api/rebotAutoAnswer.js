import request from '@/utils/request'

export function fetchList(query) {
  
  return request({
    baseURL: "http://192.168.10.247:9000/api",
    url: '/chat/robotMsg/listByShopId',
    method: 'get',
    params: query
  }) 

}
