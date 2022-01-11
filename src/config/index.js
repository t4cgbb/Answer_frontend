/**
 * [環境配置封裝]
 */

const env = import.meta.env.MODE || 'prod'
const EnvConfig ={
    // 開發環境用
    dev: {
        baseApi: '/api',
        mockApi: '#'
    },
    // 測試環境用
    test:{
        baseApi: '/apitest',
        mockApi: '#'
    },
    // 正式環境用
    prod:{
        baseApi: '/api',
        mockApi: '#'
    }
}

export default{
    env,
    mock: false,
    namespace: 'vue3',
    ...EnvConfig[env]
}