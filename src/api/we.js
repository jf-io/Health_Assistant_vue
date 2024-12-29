/* 记录体重 */
import request from '../axios/index.js'

// 更新初始化体重
export const RecordingInitialWeight = weform => {
  return request.post('/weight/recordinginitialweight', weform)
}
// 更新目标体重
export const RecordingTargetWeight = weform => {
  return request.post('/weight/recordingtargetweight', weform)
}

// 更新当前体重
export const RecordingCurrentWeight = weform => {
  return request.post('/weight/recordingcurrentweight', weform)
}
