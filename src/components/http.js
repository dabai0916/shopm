//导入axios
import axios from 'axios'

//定义对象
const HttpServer = {}

//自定义插件
HttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log("拦截器被触发----");

    // 1. headers请求头
    // 2. url 请求标识路径
    console.log(config);
    // 如果请求是login, 直接发送请求
    if (config.url !== 'login') {
      // console.log(localStorage.getItem("token"));
      
      const AUTH_TOKEN = localStorage.getItem("token");
      config.headers["Authorization"] = AUTH_TOKEN;
    }
    // 当请求不是login, 先加头部,然后继续发送请求

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  Vue.prototype.$http = axios
}
//导出插件
export default HttpServer
