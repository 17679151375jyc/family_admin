import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
    // console.log(userName, password)
    let data = {
        phone: userName,
        password: password
    }
    return axios.request({
        url: 'back/user/login',
        data: data,
        method: 'post'
    })
}
export const loginByToken = (data) => { // 使用token重新登录
    return axios.request({
        url: 'back/user/getUserMessage',
        data,
        method: 'post'
    })
}

export const changePassWord = (data) => { // 修改密码
    return axios.request({
        url: 'back/user/changePassword',
        data,
        method: 'post'
    })
}