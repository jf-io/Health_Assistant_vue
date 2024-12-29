import request from '../axios/index.js'
// 获取我的计划
export const getMyPlan = () => {
  return request.post('/selectMyPlan')
}

// 插入数据
export const insertMyPlan = params => {
  return request.post('/insertmyplan', params)
}
