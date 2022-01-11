/**
 * API接口管理
 */
import request from '@/utils/request'
export default{
    // 新增商品
    addProduct(params){
        return request({
            url: '/question3/addProduct',
            method: 'post',
            data: params,
        })
    },

    // 移除商品
    removeProduct(pid){
        return request({
            url: '/question3/removeProduct/'+pid,
            method: 'delete'
        })
    },

    // 更新商品數量
    updateProductNum(params){
        return request({
            url: '/question3/updateProductNum',
            method: 'patch',
            data: params,
        })
    },

    // 取得購物車總共價格
    getTotalPrice(params){
        return request({
            url: '/question3/getTotalPrice',
            method: 'get',
        })
    },

    // 取得購物車內項目清單列表(顯示品名、數量、單價、總價格)
    getProductList(){
        return request({
            url: '/question3/getCurrentProductList',
            method: 'get',
            data: {}
        })
    }
}
