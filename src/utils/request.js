import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
})
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
  Message.error(error.message)
  return Promise.reject(error)
})
export default service
