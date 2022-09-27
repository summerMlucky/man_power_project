import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
const TimeOut = 1000 * 3600
function IsCheckTimeOut() {
  const TimeNow = Date.now()// 接口真正调用的时间
  const LoginTime = store.getters.hrsaasTime
  return (TimeNow - LoginTime) > TimeOut
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      store.dispatch('user/logout')
      router.push('login')
      return Promise.reject(new Error('token 超时'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 1.考虑把哪些数据抛出去
  // 2.接口成功 并且业务成功
  // 3.没有成功 Promise.reject 抛出错误
  const { data, success, message } = response.data
  if (success) { // 业务逻辑成功 data为token
    console.log(data)
    return data
  }
  // 业务没有成功
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  // console.log(error.response)
  if (error.response?.status === 401) {
    store.dispatch('user/logout')
    router.push('login')
    Message.error('token 错误')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default service
