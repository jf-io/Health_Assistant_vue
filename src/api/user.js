import request from '../axios/index.js'

/* 注册发送验证码 */
export const getEmailCode = email => {
  return request.get('/email/code', { params: email })
}
/* 注册 */
export const register = userMess => {
  return request.post('/ha/registered', userMess)
}

/* 登录发送验证码 */
export const LogCode = email => {
  return request.get('/email/logcode', { params: email })
}
/* 发送登录请求 */
export const login = logUserMsg => {
  return request.post('/ha/login', logUserMsg)
}

/* 获取用户信息 */
export const getUserInfo = () => {
  return request.get('/ha/QueUserMsg')
}

/* 修改用户名 */
export const updateUserName = userName => {
  return request.post('/ha/ChangeUser', userName)
}

/* 修改用户密码 */
export const updateUserPassword = userPassword => {
  return request.post('/ha/ChangePassword', userPassword)
}
