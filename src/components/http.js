//导入axios
import axios from 'axios'

//定义对象
const HttpServer = {}

//自定义插件
HttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use(function (config) {
    console.log('拦截器被触发')
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  Vue.prototype.$http = axios
}
//导出插件
export default HttpServer
