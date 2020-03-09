import request from '@/utils/request'

const bizBaseUrl = "http://10.211.55.4:8120/api"
const bizSign = "/area/";

export function getSysList(query) {
    return request({
      baseURL: bizBaseUrl,
      url: bizSign + '/syslist',
      method: 'get',
      params: query
    }) 
  }