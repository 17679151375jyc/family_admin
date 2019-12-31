import axios from '@/libs/api.request'
// 优惠券列表
export const getCouponList = (data) => { // 优惠券列表
    return axios.request({
        url: 'back/coupon/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const addCoupon = (data) => { // 新增优惠券
    return axios.request({
        url: 'back/coupon/add',
        data,
        method: 'post'
    })
}
export const getCouponDetail = (data) => { // 优惠券详情
    return axios.request({
        url: 'back/coupon/getById',
        data,
        method: 'post'
    })
}
export const updateCoupon = (data) => { // 更新优惠券
    return axios.request({
        url: 'back/coupon/update',
        data,
        method: 'post'
    })
}


//优惠券订单
export const getCouponOrderList = (data) => { // 优惠券订单列表
    return axios.request({
        url: 'back/comUserCoupon/getPageInfo',
        data,
        method: 'post'
    })
}

export const couponOrderDetail = (data) => { // 优惠券详情
    return axios.request({
        url: 'back/comUserCoupon/getById',
        data,
        method: 'post'
    })
}

export const issueCoupon = (data) => { // 发放优惠券
    return axios.request({
        url: 'back/coupon/selectCouponForUser',
        data,
        method: 'post',
        // headers: {
        //     'Content-Type': 'application/json;charset=UTF-8',
        // }
    })
}

export const checkCoupon = (data) => { // 发券前，检测账号优惠的发送情况
    return axios.request({
        url: 'back/coupon/checkCoupon',
        data,
        method: 'post'
    })
}