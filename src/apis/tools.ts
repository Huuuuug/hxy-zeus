import { notification } from 'antd'

import type { InternalAxiosRequestConfig } from 'axios'

// 修改请求头
export const handleChangeRequestHeader = (config: InternalAxiosRequestConfig<any>) => {
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (localStorage.getItem('Access-Token')) {
    const token = localStorage.getItem('Access-Token')
    config.headers['Content-Type'] = 'application/json'
    config.headers['Access-Token'] = token
    token && localStorage.setItem('zeus_token', token)
    const userName = localStorage.getItem('user_name')
    userName && localStorage.setItem('user_name', userName)
  }
  return config
}

export const handleNetworkError = (errStatus: number) => {
  let errMessage: string
  if (errStatus) {
    switch (errStatus) {
      case 400:
        errMessage = '错误的请求'
        break
      case 401:
        errMessage = '未授权，请重新登录'
        break
      case 403:
        errMessage = '拒绝访问'
        break
      case 404:
        errMessage = '请求错误,未找到该资源'
        break
      case 405:
        errMessage = '请求方法未允许'
        break
      case 408:
        errMessage = '请求超时'
        break
      case 500:
        errMessage = '服务器端出错'
        break
      case 501:
        errMessage = '网络未实现'
        break
      case 502:
        errMessage = '网络错误'
        break
      case 503:
        errMessage = '服务不可用'
        break
      case 504:
        errMessage = '网络超时'
        break
      case 505:
        errMessage = 'http版本不支持该请求'
        break
      default:
        errMessage = `其他连接错误 --${errStatus}`
    }
  } else {
    errMessage = `无法连接到服务器！`
  }

  notification.error({
    message: '错误',
    description: errMessage,
  })
}

export const handleGeneralError = (
  errno: number,
  errorLabel: string = 'Fail',
  errMessage: string = 'request error',
) => {
  if (Number(errno) !== 200) {
    notification.error({
      message: errorLabel,
      description: errMessage,
    })
    return false
  }
  return true
}
