import request from '../axios/index.js'
// 获取运动列表
export const RecordingInitialWeightMo = () => {
  return request.post('/motion/seleall')
}
// 更新数据
export const UpdateMo = data => {
  return request.post('/motion/UpAthle', data)
}
