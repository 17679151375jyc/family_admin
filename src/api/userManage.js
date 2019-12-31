import axios from '@/libs/api.request'

export const getClientUserList = (data) => { // 获取用户端用户列表
    return axios.request({
        url: 'back/comUser/getComUserByPhone',
        data: data,
        method: 'post'
    })
}

export const addClientUser = (data) => { // 添加用户端用户
    return axios.request({
        url: 'back/comUser/regist',
        data,
        method: 'post'
    })
}

export const resetPassWord = (data) => { // 重置密码
    return axios.request({
        url: 'back/comUser/resetPassword',
        data,
        method: 'post'
    })
}


export const getClientUserDetail = (data) => { // 获取一条用户信息详情
    return axios.request({
        url: 'back/comUser/findComUserByUserNumber',
        data,
        method: 'post'
    })
}

export const updateClientUser = (data) => {
    return axios.request({
        url: 'back/comUser/update',
        data,
        method: 'post'
    })
}

export const getServerUserList = (data) => { // 获取服务端用户列表
    return axios.request({
        url: 'back/fsUser/getFsUser',
        data: data,
        method: 'post'
    })
}

export const addServerUser = (data) => { // 添加服务人员
    return axios.request({
        url: 'back/fsUser/saveFsUser',
        data,
        method: 'post'
    })
}

export const getServerDetail = (data) => { // 获取服务端详情
    return axios.request({
        url: 'back/fsUser/findFsUserByUserNumber',
        data: data,
        method: 'post'
    })
}

export const serverUpdateStatus = (data) => { // 审核服务端用户的资料
    return axios.request({
        url: 'back/fsUser/updateStatus',
        data: data,
        method: 'post'
    })
}
export const setCaptain = (data) => { // 设置为队长
    return axios.request({
        url: 'back/fsUser/setCaptain',
        data,
        method: 'post'
    })
}

export const resetCaptain = (data) => { // 解绑并重选队长
    return axios.request({
        url: 'back/fsUser/resetCaptin',
        data,
        method: 'post'
    })
}

export const getFalimyInfo = (data) => { // 获取家人信息
    return axios.request({
        url: 'back/Face/getFamilyByUserNumber',
        data,
        method: 'post'
    })
}

export const getFamilyInfo = (data) => { // 获取家人信息
    return axios.request({
        url: 'back/Face/getFamilyAllByUserNumber',
        data,
        method: 'post'
    })
}

export const getShareInfo = (data) => { // 获取分享人信息
    return axios.request({
        url: 'back/machine/checkShareMessage',
        data,
        method: 'post'
    })
}
export const getContactsInfo = (data) => { // 获取联系人信息
    return axios.request({
        url: 'back/sqLinkman/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const addContacts = (data) => { // 添加联系人
    return axios.request({
        url: 'back/sqLinkman/add',
        data,
        method: 'post'
    })
}
export const delContacts = (data) => { // 删除联系人
    return axios.request({
        url: 'back/sqLinkman/deleteById',
        data,
        method: 'post'
    })
}
export const getContactsDetail = (data) => { // 获取联系人详情
    return axios.request({
        url: 'back/sqLinkman/getById',
        data,
        method: 'post'
    })
}
export const updateContacts = (data) => { // 编辑联系人
    return axios.request({
        url: 'back/sqLinkman/update',
        data,
        method: 'post'
    })
}