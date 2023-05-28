import axios from 'axios'
import qs from 'qs'
import { ElNotification } from 'element-plus'
// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:8080/SideWindows_war_exploded', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers.token = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    const msg = res.msg
    console.log(response.data)
    // if the custom code is not 200, it is judged as an error.
    if (res.status >= 200 && res.status < 300) {
      if (typeof msg == "string") {
        ElNotification.success({
          message: msg,
          position: 'top-right',
          duration: 1500,
          showClose: false,
        })
      }
      return response.data
    }
    else if (res.status >= 400) {
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    else
      return response.data
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

const http = {
  post(url, params) {
    return service.post(url, params, {
      method: 'post',
      transformRequest: [params => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  get(url, params) {
    return service.get(url, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      }
    })
  },
  getRestApi(url, ...params) {
    if (Object.is(params, null)) {
      return service.get(url)
    }
    else {
      let _params = ''
      for (let j = 0; j < params.length; j++) {
        _params += `/${params[j]}`
      } if (_params) {
        return service.get(`${url}${_params}`)
      }
    }
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [params => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  delete(url, ...params) {
    if (Object.is(params, null)) {
      return service.delete(url)
    }
    else {
      let _params = ''
      for (let j = 0; j < params.length; j++) {
        _params += `/${params[j]}`
      } if (_params) {
        return service.delete(`${url}${_params}`)
      }
    }
  }
}
export default http
