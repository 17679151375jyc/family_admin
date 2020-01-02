export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: 'iView-admin',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: true,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        development: 'http://172.31.1.162:8182/family/', // 开发环境地址  http://172.31.1.162:8182
        test: 'https://' + window.location.host + '/family/', // 测试环境地址 //https://mickw.club/family  http://jtbhtcs.cn1.utools.club/family/
        production: 'https://' + window.location.host + '/family/', // 生产环境地址 'http://jtbhtcs.cn1.utools.club/family/'
        // dev: '/',
        // pro: 'https://jtbhtkf.cn1.utools.club/family/' //  开发：https://jtbhtkf.cn1.utools.club/family/      测试：http://jtbhtcs.cn1.utools.club/family/
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    communityHomeName: 'communityHome', // 如果公司类型为物管，就跳到物管专用首页
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    },
    page: {
        size: 10,
        sizeOpts: [10, 20, 30, 50, 100]
    },
    cos: {
        bucket: 'family-1257195390',
        region: 'ap-guangzhou'
    },
    amap: {
        key: '13269fa2c095c2e92f8869d33c936eab'
    },
    regs: { // 正则表达式
        phone: /^1[3|4|5|6|7|8][0-9]{9}$/,
        ip: /(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/
    },
    serverUser: { // 服务人员数据
        status: { // 对应审核状态
            '-1': {
                name: '未提交资料',
                value: -1,
                class: 'cell-title'
            },
            0: {
                name: '等待审核',
                value: 0,
                class: 'cell-warning'
            },
            1: {
                name: '审核中',
                value: 1,
                class: 'cell-primary'
            },
            2: {
                name: '审核通过',
                value: 2,
                class: 'cell-success'
            },
            3: {
                name: '审核不通过',
                value: 3,
                class: 'cell-error'
            }
        },
        type: { // 服务人员类型
            0: {
                name: '普通',
                value: 0
            },
            1: {
                name: '保安队长',
                value: 1
            },
            2: {
                name: '维保队长',
                value: 2
            },
            3: {
                name: '安保与维保队长',
                value: 3
            }
        },
        role: {
            0: {
                name: '安保',
                value: 0
            },
            1: {
                name: '维保',
                value: 1
            },
            2: {
                name: '物管',
                value: 2
            }
        }
    },
    communityApply: { // 社区申请数据
        status: { // 数据对应状态
            0: {
                name: '未审核',
                class: 'cell-warning',
                value: 0
            },
            3: {
                name: '审核中',
                class: 'cell-info',
                value: 3
            },
            1: {
                name: '正常',
                class: 'cell-success',
                value: 1
            },
            2: {
                name: '审核不通过',
                class: 'cell-error',
                value: 2
            }
        },

    },
    alarm: { // 报警消息
        status: {
            0: {
                name: '未处理',
                class: 'cell-error'
            },
            1: {
                name: '误报',
                class: 'cell-title'
            },
            2: {
                name: '申报中',
                class: 'cell-error'
            },
            3: {
                name: '已接单',
                class: 'cell-primary'
            },
            4: {
                name: '正在处理',
                class: 'cell-warning'
            },
            5: {
                name: '已完成',
                class: 'cell-success'
            },
            6: {
                name: '评价完成',
                class: 'cell-success'
            }
        }
    },
    maintenance: { // 维保消息
        status: {
            0: {
                name: '未处理'
            },
            1: {
                name: '已忽略'
            },
            2: {
                name: '申报中'
            },
            3: {
                name: '已接单'
            },
            4: {
                name: '正在处理'
            },
            5: {
                name: '已完成'
            },
            6: {
                name: '评价完成'
            }
        }
    },
    installManage: {
        deviceManage: { // 设备管理相关变量
            saleChannel: { // 设备销售渠道
                1: {
                    name: '穿云箭',
                    value: 1
                },
                2: {
                    name: '广电',
                    value: 2
                }
            }
        },
        installApply: { //安装申请的模块
            state: {
                0: {
                    name: '草稿'
                },
                1: {
                    name: '申请'
                },
                2: {
                    name: '正在出货'
                },
                100: {
                    name: '完成'
                }
            },
            businessType: { // 业务类型
                1: {
                    name: '家庭网关+安防设备'
                },
                2: {
                    name: '加装安防'
                }
            },
            settleAccountsType: { // 收款类型
                1: {
                    name: '押金'
                },
                2: {
                    name: '购销'
                },
                3: {
                    name: '押金+增配购销'
                }
            },
            withholdAccountType: { // 代扣帐号类型
                1: {
                    name: '新增/更改帐号'
                },
                2: {
                    name: '使用原帐号'
                }
            }
        }
    },
    community: {
        // 0投诉 1报障 2建议
        feedback: { // 反馈信息模块
            type: {
                0: {
                    name: '投诉',
                    value: 0,
                    class: 'cell-warning',
                    bgClass: 'cell-bg-warning'
                },
                1: {
                    name: '报障',
                    value: 1,
                    class: 'cell-error',
                    bgClass: 'cell-bg-error'
                },
                2: {
                    name: '建议',
                    value: 2,
                    class: 'cell-info',
                    bgClass: 'cell-bg-info'
                }
            }
        },
        apply: {
            status: { // 数据对应状态
                0: {
                    name: '未审核',
                    class: 'cell-warning',
                    value: 0
                },
                3: {
                    name: '审核中',
                    class: 'cell-info',
                    value: 3
                },
                1: {
                    name: '审核通过',
                    class: 'cell-success',
                    value: 1
                },
                2: {
                    name: '审核不通过',
                    class: 'cell-error',
                    value: 2
                }
            }
        },
        residentInfo: {
            status: { // 数据对应状态
                0: {
                    name: '未审核',
                    class: 'cell-warning',
                    value: 0,
                    isValid: false
                },
                3: {
                    name: '禁用',
                    class: 'cell-error',
                    value: 3,
                    isValid: true
                },
                1: {
                    name: '正常',
                    class: 'cell-success',
                    value: 1,
                    isValid: true
                },
                2: {
                    name: '审核不通过',
                    class: 'cell-error',
                    value: 2,
                    isValid: false
                }
            }
        },
        deviceType: {
            0: {
                name: '小区门口机',
                value: 0
            },
            1: {
                name: '楼座门口机',
                value: 1
            }
        },
        deviceRoleType: {
            0: {
                name: '入口机',
                subName: '进入',
                value: 0,
                class: 'cell-success'
            },
            1: {
                name: '出口机',
                subName: '离开',
                value: 1,
                class: 'cell-info'
            }
        },
        accessRecords: {
            openStatus: {
                0: {
                    name: '关门',
                    value: 0
                },
                1: {
                    name: '开门',
                    value: 1
                },
                2: {
                    name: '开门中',
                    value: 2
                },
                3: {
                    name: '开门超时',
                    value: 3
                }
            },
            openType: {
                0: {
                    name: '人脸',
                    value: 0
                },
                1: {
                    name: '二维码',
                    value: 1
                },
                2: {
                    name: '门铃',
                    value: 2
                }
            }
        },
        notice: {
            operateStatusList: {
                0: {
                    name: '正常',
                    class: 'cell-success'
                },
                1: {
                    name: '已撤回',
                    class: 'cell-error'
                }
            }
        },
        entranceGuard: { // 门禁出入信息状态 
            status: { // 数据对应状态
                0: {
                    name: '未审核',
                    class: 'cell-warning',
                    value: 0
                },
                3: {
                    name: '审核中',
                    class: 'cell-info',
                    value: 3
                },
                1: {
                    name: '审核通过',
                    class: 'cell-success',
                    value: 1
                },
                2: {
                    name: '审核不通过',
                    class: 'cell-error',
                    value: 2
                },
                4: {
                    name: '禁用',
                    class: 'cell-error',
                    value: 4
                }
            },
            faceType: {
                1000: {
                    name: '业主',
                    value: 1000,
                    class: 'cell-primary',
                    bgClass: 'cell-bg-primary-light'
                },
                1001: {
                    name: '家人',
                    value: 1001,
                    class: 'cell-info',
                    bgClass: 'cell-bg-info-light'
                },
                1002: {
                    name: '朋友',
                    value: 1002,
                    class: 'cell-success',
                    bgClass: 'cell-bg-success-light'
                },
                1100: {
                    name: '访客',
                    value: 1100,
                    class: 'cell-warning',
                    bgClass: 'cell-bg-warning-light'
                }
            }
        },
        visitor: {
            status: { // 访客记录的状态
                0: {
                    name: '待同意',
                    class: 'cell-warning',
                    value: 0
                },
                1: {
                    name: '已同意',
                    class: 'cell-success',
                    value: 1
                },
                2: {
                    name: '不同意',
                    class: 'cell-error',
                    value: 2
                }
            }
        },
        callType: { //呼叫类型
            type: {
                30: {
                    name: '提醒用户报警',
                    value: 30
                },
                50: {
                    name: '接警提醒',
                    value: 50
                },
                51: {
                    name: '接维保提醒',
                    value: 51
                },
                100: {
                    name: '门铃提醒',
                    value: 100
                },
                120: {
                    name: '服务器心跳检测',
                    value: 120
                },
            }
        },
        callBackType: { //呼叫返回类型
            type: {
                1: {
                    name: '返回成功',
                    value: 200
                },
                2: {
                    name: '返回失败',
                    value: 500
                }
            }
        },
        sendType: { //发送类型
            type: {
                1: {
                    name: '注册',
                    value: 1
                },
                2: {
                    name: '登录',
                    value: 2
                },
                3: {
                    name: '忘记密码',
                    value: 3
                },
                30: {
                    name: '提醒用户报警',
                    value: 30
                },
                50: {
                    name: '通知民警处理',
                    value: 50
                },
            }

        },
        sendBackType: { // 发送返回类型
            type: {
                1: {
                    name: '返回成功',
                    value: 200
                },
                2: {
                    name: '返回失败',
                    value: 500
                }
            }
        },
        taskType: { //任务类型
            type: {
                0: {
                    name: '处警消息处理',
                    value: 0
                },
                1: {
                    name: '维保消息处理',
                    value: 1
                },
                2: {
                    name: '报警智能呼叫',
                    value: 2
                },
                3: {
                    name: '报警短信通知',
                    value: 3
                },
                4: {
                    name: '访客登记超时处理',
                    value: 4
                }
            }
        },
        taskStatus: {
            type: {
                0: {
                    name: '不运行',
                    value: '0'
                },
                1: {
                    name: '运行',
                    value: 1
                }
            }
        }
    },
    dataManage: {
        company: {
            type: {
                1: {
                    name: '物管',
                    value: 1
                },
                2: {
                    name: '安保',
                    value: 2
                },
                3: {
                    name: '维保',
                    value: 3
                },
                4: {
                    name: '安保、维保',
                    value: 4
                }
            }
        }
    },
    system: {
        roleType: {
            1: {
                name: '超级管理员',
                value: 1
            },
            50: {
                name: '公司管理员',
                value: 50
            },
            100: {
                name: '普通',
                value: 100
            }
        }
    }
}