import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})
// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if(token){
      config.headers['token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const {data, config} = response
    console.log('响应数据', data);
    
    if(data.code === '200'){
      return data.data
    } else {
      if(data.code === '-1'){
        // 登录过期
        if(!config.url?.includes('/login')){
          ElMessage.error(data.msg || '登录过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/auth/login'
        } else {
          ElMessage.error(data.msg || '登录过期，请重新登录')
          return Promise.reject('网络请求失败......')
        }
      }
    }
    return data
  },
  error => {
    return Promise.reject(error)
  }
)
export default request