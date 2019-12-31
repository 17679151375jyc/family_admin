import axios from '@/libs/api.request'

export const getPlotList = (data) => { // 获取小区列表
    return axios.request({
        url: 'back/sqPlot/getPageInfo',
        data: data,
        method: 'post'
    })
}
export const getPlotDetail = (data) => { // 获取小区详情
    return axios.request({
        url: 'back/sqPlot/getByNumber',
        data,
        method: 'post'
    })
}

export const delPlots = (data) => { // 删除小区
    return axios.request({
        url: 'back/sqPlot/deletePlots',
        data,
        method: 'post'
    })
}

export const updatePlot = (data) => { // 更新小区信息
    return axios.request({
        url: 'back/sqPlot/updatePlot',
        data,
        method: 'post'
    })
}

export const addPlot = (data) => { // 录入小区
    return axios.request({
        url: 'back/sqPlot/addSqPlot',
        data: data,
        method: 'post'
    })
}

export const addBuilding = (data) => { // 添加楼座号
    return axios.request({
        url: 'back/sqBuilding/addSqBuilding',
        data,
        method: 'post'
    })
}
export const getBuildingDetail = (data) => { // 获取楼座详情
    return axios.request({
        url: 'back/sqBuilding/getBuildingByNum',
        data,
        method: 'post'
    })
}
export const updateBuilding = (data) => { // 更新楼座信息
    return axios.request({
        url: 'back/sqBuilding/updateBuildingByNum',
        data,
        method: 'post'
    })
}
export const delBuilding = (data) => { // 删除楼座
    return axios.request({
        url: 'back/sqBuilding/deleteBuilding',
        data,
        method: 'post'
    })
}

export const addDoor = (data) => { // 添加门号
    return axios.request({
        url: 'back/sqDoor/addSqDoor',
        data,
        method: 'post'
    })
}

export const addDoorByExcel = (data) => { // 通过导入excel表格批量添加门号
    return axios.request({
        url: 'back/sqDoor/saveListDoor',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const getDoorDetail = (data) => { // 获取门号详情
    return axios.request({
        url: 'back/sqDoor/getSqDoorByNum',
        data,
        method: 'post'
    })
}

export const updateDoor = (data) => { //更新门号信息
    return axios.request({
        url: 'back/sqDoor/updateSqDoorByNum',
        data,
        method: 'post'
    })
}
export const delDoor = (data) => { // 删除门号
    return axios.request({
        url: 'back/sqDoor/deleteSqDoor',
        data,
        method: 'post'
    })
}

export const getBuildingList = (data) => { //  获取楼座门号列表
    return axios.request({
        url: 'back/sqBuilding/getSqBuildingByPlotNumber',
        data: data,
        method: 'post'
    })
}



//用户我家管理-start
export const getAreaList = (data) => { // 获取区域列表
    return axios.request({
        url: 'back/area/getList',
        data,
        method: 'post'
    })
}
export const addArea = (data) => { // 添加区域
        return axios.request({
            url: 'back/area/add',
            data,
            method: 'post'
        })
    }
    // export const getAreaDetail = (data) => { // 获取区域详情
    //     return axios.request({
    //         url: 'back/area/getByUserPhone',
    //         data,
    //         method: 'post'
    //     })
    // }
export const getAreaByPhone = (data) => {
        return axios.request({
            url: 'back/area/getByUserPhone',
            data,
            method: 'post'
        })
    }
    //用户我家管理-end

export const getCompanyList = (data) => { // 获取公司列表
    return axios.request({
        url: 'back/comCompany/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const getCompanyDetail = (data) => { // 获取公司详情
    return axios.request({
        url: 'back/comCompany/getById',
        data,
        method: 'post'
    })
}

export const addCompany = (data) => { // 添加公司
    return axios.request({
        url: 'back/comCompany/saveObj',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const updateCompany = (data) => { // 更新公司数据
    return axios.request({
        url: 'back/comCompany/updateCompany',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const delCompany = (data) => { // 删除公司
    return axios.request({
        url: 'back/comCompany/deleteCompany',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const getNoticeTypeList = (data) => { // 获取物管消息分类
    return axios.request({
        url: 'back/noticeType/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const getNoticeTypeDetail = (data) => { // 获取消息通知详情  
    return axios.request({
        url: 'back/noticeType/searchNoticeType',
        data,
        method: 'post'
    })
}
export const addNoticeType = (data) => { // 增加物管消息分类
    return axios.request({
        url: 'back/noticeType/addNoticeType',
        data,
        method: 'post'
    })
}
export const updateNoticeType = (data) => { // 更新通知消息分类
    return axios.request({
        url: 'back/noticeType/updateNoticeType',
        data,
        method: 'post'
    })
}

export const delNoticeType = (data) => { // 删除通知分类 
    return axios.request({
        url: 'back/noticeType/deleteNoticeType',
        data,
        method: 'post'
    })
}

//商家管理
export const getBusinessList = (data) => { // 商家列表
    return axios.request({
        url: 'back/business/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const addBusiness = (data) => { // 添加商家
    return axios.request({
        url: 'back/business/add',
        data,
        method: 'post'
    })
}

export const getBusinessDetail = (data) => { // 商家详情
    return axios.request({
        url: 'back/business/getById',
        data,
        method: 'post'
    })
}

export const updateBusiness = (data) => { // 更新商家
    return axios.request({
        url: 'back/business/update',
        data,
        method: 'post'
    })
}

export const delBusiness = (data) => { // 删除商家
    return axios.request({
        url: 'back/business/deleteBusiness',
        data,
        method: 'post'
    })
}