import request from '../axios/index.js'

export const QueryIngestfood = data => {
  return request.post('/Query/Queryingestfood', data)
}

// 请求运动消耗的热量
export const QuerySport = data => {
  return request.post('/Query/QueryAthlet', data)
}
