//社区管理模块api
import axios from '@/libs/api.request'

// 社区申请管理-start
export const getCommunityApplyList = (data) => {
    return axios.request({
        url: 'back/sqApply/getPageInfo',
        data,
        method: 'post'
    })
}

export const getApplyDetail = (data) => { // 获取申请详情
    return axios.request({
        url: 'back/sqApply/getByNum',
        data,
        method: 'post'
    })
}

export const updateApplyStatus = (data) => { // 更新申请状态
    return axios.request({
        url: 'back/domicile/applyDomicile',
        data,
        method: 'post'
    })
}

//社区申请管理-end

export const getNoticeList = (data) => { // 物管通知列表
    return axios.request({
        url: 'back/notice/getPageInfo',
        data,
        method: 'post'
    })
}

export const getNoticeType = (data) => { // 获取通知分类
    return axios.request({
        url: 'back/noticeType/noticeType',
        data,
        method: 'post'
    })
}

export const addNotice = (data) => { // 添加通知
    return axios.request({
        url: 'back/notice/add',
        data,
        method: 'post'
    })
}

export const getNoticeDetail = (data) => { // 获取通知详情
    return axios.request({
        url: 'back/notice/search',
        data,
        method: 'post'
    })
}

export const getManagePersonList = (data) => { // 获取当前小区下物管人员
    return axios.request({
        url: 'back/fsUser/searchByPlot',
        data,
        method: 'post'
    })
}

export const getRecordList = (data) => { // 获取出入记录列表 
    return axios.request({
        url: 'back/record/getPageInfo',
        data,
        method: 'post'
    })
}

export const getRecordDetail = (data) => { // 获取出入详情
    return axios.request({
        url: 'back/record/getByNumber',
        data,
        method: 'post'
    })
}

export const getEntranceDevice = (data) => { // 获取门口机设备列表
    return axios.request({
        url: 'back/device/getDeviceList',
        data,
        method: 'post'
    })
}

export const addEntranceDevice = (data) => { // 添加门口机设备 
    return axios.request({
        url: 'back/device/addDevice',
        data,
        method: 'post'
    })
}

export const unbindEntranceDevice = (data) => { // 解绑门口机
    return axios.request({
        url: 'back/device/unbundingDevice',
        data,
        method: 'post'
    })
}

export const delEntranceDevice = (data) => { // 删除门口机
    return axios.request({
        url: 'back/device/deleteDevice',
        data,
        method: 'post'
    })
}


export const getEntranceDeviceDetail = (data) => { // 获取门口机详情
    return axios.request({
        url: 'back/device/getDeviceByDeviceNum',
        data,
        method: 'post'
    })
}

export const updateEntranceDevice = (data) => { // 更新门口机数据
    return axios.request({
        url: 'back/device/updateDevice',
        data,
        method: 'post'
    })
}

export const getFaceList = (data) => { // 人脸列表
    return axios.request({
        url: 'back/Face/faceList',
        data,
        method: 'post'
    })
}

export const getFaceDetail = (data) => { // 单条人脸详情
    return axios.request({
        url: 'back/Face/getFace',
        data,
        method: 'post'
    })
}

export const updateFacekStatus = (data) => { // 审核人脸状态 
    return axios.request({
        url: 'back/Face/checkFace',
        data,
        method: 'post'
    })
}
export const delFace = (data) => {
    return axios.request({
        url: 'back/Face/deleteFace',
        data,
        method: 'post'
    })
}

// 反馈消息列表-start
export const getFeedbackList = (data) => { // 查询反馈列表
    return axios.request({
        url: 'back/feedback/getFeedbackByPhone',
        data,
        method: 'post'
    })
}
export const getFeedbackDetail = (data) => { // 反馈详情
    return axios.request({
        url: 'back/feedback/searchFeedbackByNumber',
        data,
        method: 'post'
    })
}
export const processFeedback = (data) => { // 处理反馈
        return axios.request({
            url: 'back/feedback/updateFeedbackStatus',
            data,
            method: 'post'
        })
    }
    //反馈消息列表 -end

// 访客列表-start
export const getVisitorList = (data) => {
    return axios.request({
        url: 'back/visitor/getPageInfo',
        data,
        method: 'post'
    })
}

export const getVisitorDetail = (data) => {
    return axios.request({
        url: 'back/visitor/getByNumber',
        data,
        method: 'post'
    })
}

export const getResidentList = (data) => { // 获取用户信息列表
    return axios.request({
        url: 'back/domicile/getPageInfo',
        data,
        method: 'post'
    })
}

export const getResidentDetail = (data) => { // 获取用户信息详情
    return axios.request({
        url: 'back/domicile/findDomicileByDomicileNumber',
        data,
        method: 'post'
    })
}
export const changeResidentStatus = (data) => { // 更改住户信息状态
    return axios.request({
        url: 'back/domicile/modifyStatus',
        data,
        method: 'post'
    })
}

export const residentRemoveDisable = (data) => { // 住户解除禁用
    return axios.request({
        url: 'back/domicile/recoverStatus',
        data,
        method: 'post'
    })
}

export const residentSetOwner = (data) => { // 设置为业主
    return axios.request({
        url: 'back/domicile/modifyOwner',
        data,
        method: 'post'
    })
}
export const residentRemoveOwner = (data) => { // 取消业主
    return axios.request({
        url: 'back/domicile/removeOwner',
        data,
        method: 'post'
    })
}

export const communityDataStatistics = (data) => { // 统计社区用户数据
    return axios.request({
        url: 'back/sqPlot/checkNumber',
        data,
        method: 'post'
    })
}
export const getAdvertisementList = (data) => { // 获取广告列表
    return axios.request({
        url: 'back/advertisement/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const DelAdvertisementList = (data) => { // 删除门口机广告
    return axios.request({
        url: 'back/advertisement/delAdvertisement',
        data,
        method: 'post'
    })
}
export const AddAdvertisementList = (data) => { // 添加门口机广告
    return axios.request({
        url: 'back/advertisement/addAdvertisement',
        data,
        method: 'post'
    })
}
export const UpdateAdvertisementList = (data) => { // 更新门口机广告
    return axios.request({
        url: 'back/advertisement/updateById',
        data,
        method: 'post'
    })
}
export const getAdvertisementDetail = (data) => { // 获取广告详情
    return axios.request({
        url: 'back/advertisement/getById',
        data,
        method: 'post'
    })
}


// 门卡信息
export const getDoorCardList = (data) => { // 获取门卡列表
    return axios.request({
        url: 'back/card/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const addDoorCard = (data) => { // 添加门卡
    return axios.request({
        url: 'back/card/addCard',
        data,
        method: 'post'
    })
}

export const updateDoorCard = (data) => { // 编辑门卡
    return axios.request({
        url: 'back/card/updateCard',
        data,
        method: 'post'
    })
}

// 车辆管理-start
export const getCarList = (data) => { //获取车辆列表
    return axios.request({
        url: 'back/userCar/getPageInfo',
        data,
        method: 'post'
    })
}
export const getCarDetail = (data) => {
    return axios.request({
        url: 'back/userCar/getById',
        data,
        method: 'post'
    })
}
export const updateCar = (data) => {
    return axios.request({
        url: 'back/userCar/updateStatus',
        data,
        method: 'post'
    })
}
export const delCar = (data) => {
        return axios.request({
            url: 'back/userCar/delete',
            data,
            method: 'post'
        })
    }
    // 车辆管理-end

// 套餐管理
export const getPlotPackageList = (data) => { // 获取备城门套餐列表
    return axios.request({
        url: 'back/plotPackage/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const addPlotPackage = (data) => { // 添加套餐
    return axios.request({
        url: 'back/plotPackage/add',
        data,
        method: 'post'
    })
}
export const plotPackageSetValid = (data) => { // 套餐设置是否有效
    return axios.request({
        url: 'back/plotPackage/setValid',
        data,
        method: 'post'
    })
}
export const getPackageDetail = (data) => { // 套餐详情
    return axios.request({
        url: 'back/plotPackage/getById',
        data,
        method: 'post'
    })
}
export const updatePlotPackage = (data) => { // 编辑套餐
    return axios.request({
        url: 'back/plotPackage/update',
        data,
        method: 'post'
    })
}