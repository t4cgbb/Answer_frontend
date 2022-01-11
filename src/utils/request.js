/**
 * Axios封裝
 */
import axios from 'axios'
import config from '@/config'
import { ElMessage} from 'element-plus'
const NETWORK_ERROR = '網路請求異常，請稍後重新嘗試！'

// 創建axios，添加global配置
const service = axios.create({
    baseURL:config.mock ? config.mockApi:config.baseApi,
    timeout: 8000 
})

// 請求攔截
service.interceptors.request.use((req) => {
    const headers = req.headers
    if(!headers.Authorization) headers.Authorization = 'Bear Jack'
    return req
})

// 回傳攔截
service.interceptors.response.use((res) => {
    const {status, data} = res
    if(status === 200){
        return data
    } else if(status === 404){
        return Promise.reject('查無資源')
    } else{
        ElMessage.error(NETWORK_ERROR)
        return Promise.reject(NETWORK_ERROR)
    }
})

/**
 * 請求回傳
 * @param   {*}  options 　請求配置
 * @return  {obj}          Axios物件
 */
function request(options){
    options.method = options.method || 'GET'

    if(options.method.toUpperCase() === 'get'){
        options.params = options.data
    }
    return service(options)
}


export default request

