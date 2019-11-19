// 首页-start
import home from '@/views/home/admin/home'
import communityHome from '@/views/home/community/home'
// 首页-end

// 登录-start
import login from '@/views/login/login'
// 登录-end

//用户管理-start
import userManage from '@/views/userManage/userManage'
import clientUser from '@/views/userManage/clientUser/clientUser'
import serverUser from '@/views/userManage/serverUser/serverUser'
//用户管理-end

// 主机管理-start
import hostManage from '@/views/hostManage/hostManage'
import securityHost from '@/views/hostManage/securityHost/securityHost'
import installArea from '@/views/hostManage/installArea/installArea'
import setupServer from '@/views/hostManage/setupServer/setupServer'
import areaPlotMap from '@/views/hostManage/areaPlotMap/areaPlotMap'
// 主机管理-end

//消息管理-start
import messageManage from '@/views/messageManage/messageManage'
import alarm from '@/views/messageManage/alarm/alarm'
import maintenance from '@/views/messageManage/maintenance/maintenance'
import machine from '@/views/messageManage/machine/machine'
//消息管理-end

// 数据管理-start
import dataManage from '@/views/dataManage/dataManage'
import plotManage from '@/views/dataManage/plotManage/plotManage'
import companyManage from '@/views/dataManage/companyManage/companyManage'
import noticeType from '@/views/dataManage/noticeType/noticeType'
//数据管理-end

//安装管理-start
import installManage from '@/views/installManage/installManage'
import deviceManage from '@/views/installManage/deviceManage/deviceManage'
import comboManage from '@/views/installManage/comboManage/comboManage'
import installApply from '@/views/installManage/installApply/installApply'
//安装管理-end

//社区管理-start
import communityManage from '@/views/communityManage/communityManage'
import residentInfo from '@/views/communityManage/residentInfo/residentInfo'
import applyCommunity from '@/views/communityManage/applyCommunity/applyCommunity'
import applyCommunityBreviary from '@/views/communityManage/applyCommunity/applyCommunityBreviary'
import entranceGuard from '@/views/communityManage/entranceGuard/entranceGuard'
import notice from '@/views/communityManage/notice/notice'
import accessRecords from '@/views/communityManage/accessRecords/accessRecords'
import entranceDevice from '@/views/communityManage/entranceDevice/entranceDevice'
import feedback from '@/views/communityManage/feedback/feedback'
import visitor from '@/views/communityManage/visitor/visitor'
import advertisement from '@/views/communityManage/advertisement/advertisement'
import doorCard from '@/views/communityManage/doorCard/doorCard'
import carManage from '@/views/communityManage/carManage/carManage'
import plotPackage from '@/views/communityManage/plotPackage/plotPackage'
//社区管理-end

//巡更管理-start
import patrolManage from '@/views/patrolManage/patrolManage'
import dutyManage from '@/views/patrolManage/dutyManage/dutyManage'
import dutyMap from '@/views/patrolManage/dutyMap/dutyMap'
import areaDevice from '@/views/patrolManage/areaDevice/areaDevice'
// 巡更管理-end

// 系统设置-start
import systemSetup from '@/views/systemSetup/systemSetup'
import accessMenu from '@/views/systemSetup/accessMenu/accessMenu'
import accountManage from '@/views/systemSetup/accountManage/accountManage'
import roleManage from '@/views/systemSetup/roleManage/roleManage'
import missionManage from '@/views/systemSetup/missionManage/missionManage'
import configure from '@/views/systemSetup/configure/configure'
// 系统设置-end

//日志管理-start
import logManage from '@/views/logManage/logManage'
import call from '@/views/logManage/call/call'
import send from '@/views/logManage/send/send'
import verification from '@/views/logManage/verification/verification'
//日志管理-end

export default [{
        path: '/',
        name: 'login',
        component: login
    },
    // {
    //     path: '/system',
    //     // name: 'home',
    //     // component: home
    //     components: {
    //         default: home,
    //         kkk: plotManage
    //     }
    // },
    {
        path: '/system',
        name: 'system',
        component: home,
        children: [{
            path: 'home',
            name: 'home',
            components: {
                //消息管理-messageManage
                alarm, // 报警消息
                machine, // 主机消息
                maintenance, // 维保消息
                //用户管理-userManage
                clientUser, // 用户端用户
                serverUser, // 服务端用户
                //社区管理-communityManage
                applyCommunity, // 申请列表
                applyCommunityBreviary, // 物管专用页的申请列表
                residentInfo, // 住户信息
                communityNotice: notice, //物业通知 
                accessRecords, // 出入记录
                entranceDevice, // 门口机设备
                entranceGuard, //门禁信息
                feedback, // 反馈管理
                visitor, // 访客管理
                advertisement, // 广告管理
                doorCard, //门卡信息
                carManage, // 车辆管理
                plotPackage, // 备城门套餐
                //巡更管理-patrolManage
                dutyManage, // 值班管理
                dutyMap, //巡更地图
                areaDevice, // 区域设备
                //申请安装-installManage
                deviceManage, //设备管理
                comboManage, //套餐配置
                installApply, //申请列表
                //主机管理-hostManage
                installArea, // 安装区域
                setupServer, //服务器配网
                securityHost, //防盗主机
                areaPlotMap, //区域小区地图
                //公用数据-dataManage
                plotManage, // 社区管理
                companyManage, // 公司管理
                noticeType, // 物业通知分类
                //系统设置-systemSetup
                accessMenu, //权限菜单
                accountManage, //账号管理
                roleManage, //角色管理
                missionManage, //任务管理
                configure, // 配置模块
                //日志管理-logManage
                call, // 呼叫模块
                send, //发送模块
                verification, //验证模块
            },
        }],
    },
    {
        path: '/community',
        name: 'community',
        component: communityHome,
        children: [{
            path: 'home',
            name: 'communityHome',
            components: {
                //消息管理-messageManage
                alarm, // 报警消息
                machine, // 主机消息
                maintenance, // 维保消息
                //用户管理-userManage
                clientUser, // 用户端用户
                serverUser, // 服务端用户
                //社区管理-communityManage
                applyCommunity, // 申请列表
                applyCommunityBreviary, // 物管专用页的申请列表
                residentInfo, // 住户信息
                communityNotice: notice, //物业通知 
                accessRecords, // 出入记录
                entranceDevice, // 门口机设备
                entranceGuard, //门禁信息
                feedback, // 反馈管理
                visitor, // 访客管理
                advertisement, // 广告管理
                doorCard, //门卡信息
                carManage, // 车辆管理
                //巡更管理-patrolManage
                dutyManage, // 值班管理
                dutyMap, //巡更地图
                areaDevice, // 区域设备
                //申请安装-installManage
                deviceManage, //设备管理
                comboManage, //套餐配置
                installApply, //申请列表
                //主机管理-hostManage
                installArea, // 安装区域
                setupServer, //服务器配网
                securityHost, //防盗主机
                areaPlotMap, //区域小区地图
                //公用数据-dataManage
                plotManage, // 社区管理
                companyManage, // 公司管理
                noticeType, // 物业通知分类
                //系统设置-systemSetup
                accessMenu, //权限菜单
                accountManage, //账号管理
                roleManage, //角色管理
                missionManage, //任务管理
                configure, // 配置模块
                //日志管理-logManage
                call, // 呼叫模块
                send, //发送模块
                verification, //验证模块
            },
        }],
    },
    {
        path: '/communityHome',
        name: 'communityHome',
        component: communityHome
    },
    // {
    //     path: '/home',
    //     name: 'home',
    //     component: home
    // },
    // {
    //     path: '/login',
    //     name: 'login',
    //     component: login
    // },
    {
        path: '/userManage',
        name: 'userManage',
        meta: {
            title: '用户管理'
        },
        component: userManage,
        children: [{
                path: 'clientUser',
                name: 'clientUser',
                meta: {
                    title: '用户端用户'
                },
                component: clientUser
            },
            {
                path: 'serverUser',
                name: 'serverUser',
                meta: {
                    title: '服务端用户'
                },
                component: serverUser
            }
        ]
    },
    {
        path: '/hostManage',
        name: 'hostManage',
        meta: {
            title: '主机管理'
        },
        component: hostManage,
        children: [
            // {
            //     path: 'videoHost',
            //     name: 'videoHost',
            //     meta: {
            //         title: '视频主机'
            //     },
            //     component: videoHost
            // },
            // {
            //     path: 'defenceArea',
            //     name: 'defenceArea',
            //     meta: {
            //         title: '防区管理'
            //     },
            //     component: defenceArea
            // },
            {
                path: 'installArea',
                name: 'installArea',
                meta: {
                    title: '安装区域'
                },
                component: installArea
            },
            {
                path: 'setupServer',
                name: 'setupServer',
                meta: {
                    title: '主机配网'
                },
                component: setupServer
            },
            {
                path: 'securityHost',
                name: 'securityHost',
                meta: {
                    title: '防盗主机'
                },
                component: securityHost
            },
            {
                path: 'areaPlotMap',
                name: 'areaPlotMap',
                meta: {
                    title: '区域小区地图'
                },
                component: areaPlotMap
            }
        ]
    },
    {
        path: '/communityManage',
        name: 'communityManage',
        meta: {
            title: '社区管理'
        },
        component: communityManage,
        children: [{
                path: 'applyCommunity',
                name: 'applyCommunity',
                meta: {
                    title: '申请列表'
                },
                component: applyCommunity

            },
            {
                path: 'applyCommunityBreviary',
                name: 'applyCommunityBreviary',
                meta: {
                    title: '申请列表' // 缩略型
                },
                component: applyCommunityBreviary
            }, {
                path: 'residentInfo',
                name: 'residentInfo',
                meta: {
                    title: '住户信息'
                },
                component: residentInfo
            },
            {
                path: 'communityNotice',
                name: 'communityNotice',
                meta: {
                    title: '物业通知'
                },
                component: notice
            },
            {
                path: 'accessRecords',
                name: 'accessRecords',
                meta: {
                    title: '出入记录'
                },
                component: accessRecords

            },
            {
                path: 'entranceDevice',
                name: 'entranceDevice',
                meta: {
                    title: '门口机设备'
                },
                component: entranceDevice
            },
            {
                path: 'entranceGuard',
                name: 'entranceGuard',
                meta: {
                    title: '门禁出入信息'
                },
                component: entranceGuard
            },
            {
                path: 'feedback',
                name: 'feedback',
                meta: {
                    title: '反馈消息'
                },
                component: feedback
            },
            {
                path: 'visitor',
                name: 'visitor',
                meta: {
                    title: '访客管理'
                },
                component: visitor
            },
            {
                path: 'advertisement',
                name: 'advertisement',
                meta: {
                    title: '广告模块'
                },
                component: advertisement
            },
            {
                path: 'doorCard',
                name: 'doorCard',
                meta: {
                    title: '门卡信息'
                },
                component: doorCard
            },
            {
                path: 'carManage',
                name: 'carManage',
                meta: {
                    title: '车辆管理'
                },
                component: carManage
            },
            {
                path: 'plotPackage',
                name: 'plotPackage',
                meta: {
                    title: '备城门套餐'
                },
                component: plotPackage
            }
        ]
    },
    {
        path: '/messageManage',
        name: 'messageManage',
        meta: {
            title: '消息管理'
        },
        component: messageManage,
        children: [{
                path: 'alarm',
                name: 'alarm',
                meta: {
                    title: '报警消息'
                },
                component: alarm
            }, {
                path: 'machine',
                name: 'machine',
                meta: {
                    title: '主机消息'
                },
                component: machine
            },
            {
                path: 'maintenance',
                name: 'maintenance',
                meta: {
                    title: '维保消息'
                },
                component: maintenance
            },
        ]
    },
    {
        path: '/installManage',
        name: 'installManage',
        meta: {
            title: '申请安装'
        },
        component: installManage,
        children: [{
                path: 'deviceManage',
                name: 'deviceManage',
                meta: {
                    title: '设备管理'
                },
                component: deviceManage
            },
            {
                path: 'comboManage',
                name: 'comboManage',
                meta: {
                    title: '套餐配置'
                },
                component: comboManage
            },
            {
                path: 'installApply',
                name: 'installApply',
                meta: {
                    title: '申请列表'
                },
                component: installApply
            }
        ]
    },
    {
        path: '/dataManage',
        name: 'dataManage',
        meta: {
            title: '数据管理'
        },
        component: dataManage,
        children: [{
                path: 'plotManage',
                name: 'plotManage',
                meta: {
                    title: '社区管理'
                },
                component: plotManage
            },
            {
                path: 'companyManage',
                name: 'companyManage',
                meta: {
                    title: '公司管理'
                },
                component: companyManage
            },
            {
                path: 'noticeType',
                name: 'noticeType',
                meta: {
                    title: '物业通知分类'
                },
                component: noticeType
            }
        ]
    },
    {
        path: '/systemSetup',
        name: 'systemSetup',
        meta: {
            title: '系统设置'
        },
        component: systemSetup,
        children: [{
                path: 'accessMenu',
                name: 'accessMenu',
                meta: {
                    title: '权限菜单'
                },
                component: accessMenu
            },
            {
                path: 'accountManage',
                name: 'accountManage',
                meta: {
                    title: '账号管理'
                },
                component: accountManage
            },
            {
                path: 'roleManage',
                name: 'roleManage',
                component: roleManage
            },
            {
                path: 'missionManage',
                name: 'missionManage',
                component: missionManage
            },
            {
                path: 'configure',
                name: 'configure',
                component: configure
            }

        ]
    },
    {
        path: '/logManage',
        name: 'logManage',
        meta: {
            title: '日志管理'
        },
        component: logManage,
        children: [{
                path: 'call',
                name: 'call',
                meta: {
                    title: '呼叫模块'
                },
                component: call
            },
            {
                path: 'send',
                name: 'send',
                meta: {
                    title: '发送模块'
                },
                component: send
            },
            {
                path: 'verification',
                name: 'verification',
                meta: {
                    title: '验证码模块'
                },
                component: verification
            }
        ]
    },
    {
        path: '/patrolManage',
        name: 'patrolManage',
        meta: {
            title: '巡更管理'
        },
        component: patrolManage,
        children: [{
                path: 'dutyManage',
                name: 'dutyManage',
                meta: {
                    title: '值班管理'
                },
                component: dutyManage
            },
            {
                path: 'dutyMap',
                name: 'dutyMap',
                meta: {
                    title: '巡更地图'
                },
                component: dutyMap
            },
            {
                path: 'areaDevice',
                name: 'areaDevice',
                meta: {
                    title: '区域设备',

                },
                component: areaDevice
            }
        ]
    },
    {
        path: '*',
        name: 'error_404',
        meta: {},
        component: () =>
            import ('@/views/error-page/404.vue')
    }

]