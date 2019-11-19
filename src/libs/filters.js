import store from '@/store/index'
import { hasOneOf } from "@/libs/tools";

// 格式化日期，如月、日、时、分、秒保证为2位数
const formatNumber = (n) => {
        n = n.toString()
        return n[1] ? n : '0' + n;
    }
    // 参数number为毫秒时间戳，format为需要转换成的日期格式
export const formatTime = (number, format) => {
    if (!number) {
        return
    }
    if (number.toString().length === 10) {
        number = number * 1000
    }
    if (!format) { // 如果不传格式，就默认
        format = 'Y-M-D h:m:s'
    }
    // 如需要调用上述方法，使用formatTime(1545903266795, 'Y年M月D日 h:m:s')或者formatTime(1545903266795, 'Y-M-D h:m:s')即可
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
        format = format.replace(formatArr[i], newArr[i])
    }
    return format;
}

let statusListArr = store.state.common.statusList
    // 过滤状态 
export const statusName = (code, typeName) => {
    let name
    if (statusListArr[typeName]) {
        for (let i = 0; i < statusListArr[typeName].length; i++) {
            if (code == statusListArr[typeName][i].code) {
                name = statusListArr[typeName][i].name
                break
            }
        }
    }

    if (name) {
        return name
    } else {
        return '暂无定义'
    }
}

//传对应的分类名进来，只返回对应的分类
export const statusList = (typeName) => {
    if (statusListArr[typeName]) {
        return statusListArr[typeName]
    } else {
        []
    }
}


//是否电话
export const phone = (val) => {
    let reg = /^1[2|3|4|5|6|7|8|9][0-9]{9}$/
    return reg.test(val) ? true : false
}

// 过滤ip
export const ip = (val) => {
    let reg = /(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/
    return reg.test(val) ? true : false
}

//过滤密码
export const password = (val) => {
    let reg = /^(?![^a-zA-Z]+$)(?!\D+$)/
    return reg.test(val) ? true : false
}

//经度
export const longitude = (val) => {
        let reg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
        return reg.test(val) ? true : false
    }
    //纬度
export const latitude = (val) => {
    let reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
    return reg.test(val) ? true : false
}

//安装区域码4位数字
export const installCode = (val) => {
    let reg = /^[a-zA-Z0-9]{1,10}$/
    return reg.test(val) ? true : false
}

//2-4字的真实姓名
export const realName = (val) => {
    let reg = /^[\u4e00-\u9fa5]{2,4}$/; //验证规则
    return reg.test(val) ? true : false
}

//身份证过滤
export const identityCard = (val) => {
    let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/; //验证规则
    return reg.test(val) ? true : false
}

// 验证是否有权限
export const auth = (authArr) => {
    authArr.push('all')
    return hasOneOf(authArr, store.state.user.jurisdiction)
}