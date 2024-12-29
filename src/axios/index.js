import axios from 'axios'
import { UserStore } from '@/stores/user.js'
import router from '@/router'

import { showToast } from 'vant'

const baseURL = 'http://localhost:8081'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 5000,
})
// 请求发送前
instance.interceptors.request.use(
  config => {
    // TODO 2. 携带token
    if (UserStore().token) {
      config.headers.Authorization = UserStore().token
    }
    return config
  },
  err => Promise.reject(err),
)

instance.interceptors.response.use(
  res => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    // if (res.code != 200 || res.code != 0) {
    //   return Promise.reject(res.data)
    // } else return res
    console.log(res.data)
    if (res.data.code === 421) {
      showToast('请重新登录')
      router.push('/login')
      // router.push('/login')
      console.log('zhixingle')
    }
    return res
  },
  err => {
    console.log(err)
    // TODO 5. 处理401错误
    if (err.response?.status === 401) {
      // Vrouter.push('/loing')
    }
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
