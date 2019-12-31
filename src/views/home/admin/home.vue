<template>
  <div
    v-if="homeIsVisible"
    class="wrapper"
    :style="{'background': 'url(' + require('_a/images/bg.jpg') + ')', 'background-size': 'cover'}"
  >
    <!-- 顶部内容-start -->
    <header-bar
      :tagsNavList="tagsNavList"
      @clickTagsNav="clickTagsNav"
      @closeNav="closeNav"
      @clostNavItem="close"
      @allWinHide="allWinHide"
    ></header-bar>
    <!-- 顶部内容-end -->

    <!-- 桌面-start -->
    <div class="desktop-wrapper">
      <!-- <div class="menu-items">
          <div class="item">
              <div class="title">系统设置</div>
              <div class="options">
                  <div class="opti">权限菜单</div>
                  <div class="opti">账号管理</div>
                  <div class="opti">角色管理</div>
              </div>
          </div>
      </div>-->
      <!-- <div class="menu-list">
        <div
          class="item"
          v-for="(item, index) in menuList"
          :key="index"
          @dblclick="addWinPopup(item)"
        >
          
          <i class="iconfont" :class="item.icon"></i>
          <span>{{item.title}}</span>
        </div>
        <div class="item-without"></div>
      </div>-->

      <!-- 菜单列表-start -->
      <div class="menu-list-wrapper">
        <div class="menu-list-container">
          <div class="menu-list">
            <div
              class="items"
              v-for="(item, index) in menuList"
              :key="index"
              v-show="hasOneOf(item.jurisdiction, jurisdiction)"
            >
              <div class="item">
                <i :class="['iconfont', item.icon]"></i>
                <span>{{item.title}}</span>
              </div>
              <div class="options">
                <div
                  class="option"
                  @click="addWinPopup(option)"
                  v-for="(option, idx) in item.children"
                  :key="idx"
                  v-show="hasOneOf(option.jurisdiction, jurisdiction)"
                >{{option.title}}</div>
              </div>
            </div>
            <!-- <div class="item-without"></div> -->
          </div>
        </div>
      </div>

      <!-- 菜单列表-end -->

      <!-- 展示数据信息-start -->
      <div class="other-wrapper">
        <!-- 消息中心-start -->
        <div class="message-center">
          <div class="title">消息中心</div>
          <div class="items">
            <div class="item">报警(10)</div>
            <div class="item">出警(1)</div>
            <div class="item">故障(2)</div>
            <div class="item">主机(121)</div>
          </div>
        </div>
        <!-- 消息中心-end -->

        <!-- 数据监测-start -->
        <div class="data-center">
          <div class="title">数据监测</div>
          <div class="items">
            <div class="item">
              <div class="chart"></div>
              <span>用户</span>
            </div>
            <div class="item">
              <div class="chart"></div>
              <span>出警</span>
            </div>
            <div class="item">
              <div class="chart"></div>
              <span>误报</span>
            </div>
            <div class="item">
              <div class="chart"></div>
              <span>其他数据</span>
            </div>
          </div>
          <!-- <div id="playWind" style="width: 300px; height: 200px;"></div> -->
          <!-- <button @click="play">播放</button> -->
        </div>
        <!-- 数据监测-end -->

        <!-- 报表数据-start -->
        <div class="statement">
          <div class="title">报表数据</div>
          <div class="items">
            <div class="item">应急服务人员</div>
            <div class="item">出警报表</div>
            <div class="item">操作日志</div>
            <div class="item">派单汇总表</div>
            <div class="item">客户数据</div>
            <div class="item">自动呼叫汇总表</div>
            <div class="item">设备信息报表</div>
            <div class="item">验证码记录</div>
          </div>
        </div>
        <!-- 报表数据-end -->
      </div>
      <!-- 展示数据信息-end -->

      <!-- 操作记录-start -->
      <div class="operating-record">
        <div class="title">操作记录</div>
        <div class="items">
          <div class="item" v-for="item in 30" :key="item">
            <div class="time">2019-01-01 08:10:12</div>
            <div class="info">
              <span class="role">业务员</span>
              <span class="name">刘华</span>
              <span class="detail">添加了客户数据添加了客户数据添加了客户数据</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 操作记录-end -->
      <!-- KKKKK
      <router-view
        name="a"
        style="z-index:99999;background: red;width:500px;height:500px;"
      >KKKKK</router-view>-->
      <!-- v-show="item.isShow"    v-if="!item.isClose" -->
      <draggable-popup
        v-for="(item, index) in tagsNavList"
        :key="index"
        :isClose="item.isClose"
        :url="item.url"
        :zIndex="item.zIndex"
        :maximize="item.isMaximize"
        :x="item.left"
        :y="item.top"
        :isShow="item.isShow"
        :isStick="item.isStick"
        @activated="activated(index)"
        @minimize="minimize(index)"
        @maximize="maximize(index)"
        @close="close(index)"
        @dragStart="dragStart(index)"
        @onDrag="onDrag($event, index)"
        @newWinOpen="newWinOpen(index)"
        :class="[item.isMaximize ? 'maximize-wrapper' : '']"
      >
        <!-- :style="{'left': (item.left === null ? 300 : item.left) + 'px !important', top: (item.top === null ? 50 : item.top) + 'px !important'}" -->
        <div slot="title">{{item.title}}</div>
      </draggable-popup>
    </div>
    <!-- 桌面-end -->
    <!-- 定时请求报警消息-start -->
    <alarm-message-timer @openAlarmWindow="addWinPopup({title: '报警消息', url: 'alarm'})"></alarm-message-timer>
    <!-- 定时请求报警消息-end -->

    <!-- 定时检测是否在线-start -->
    <check-on-line></check-on-line>
    <!-- 定时检测是否在线-end -->
  </div>
</template>
<script>
// function stop() {
//   return false;
// }
// document.oncontextmenu = stop; // 禁止右击菜单
import HeaderBar from "./header/header";
import DraggablePopup from "_c/draggablePopup/draggablePopup";
import { mapState, mapActions } from "vuex";
import { hasOneOf } from "@/libs/tools";
import AlarmMessageTimer from "@/components/alarmMessageTimer/alarmMessageTimer";
import CheckOnLine from "@/components/checkOnLine/checkOnLine";
const popupLeft = 320;
const popupTop = 50;
export default {
  components: {
    DraggablePopup,
    HeaderBar,
    AlarmMessageTimer,
    CheckOnLine
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      jurisdiction: state => state.user.jurisdiction,
      companyType: state => state.user.companyType,
      openHostManageTime: state => state.common.openHostManageTime
    }),
    tagsNavList: function() {
      let indexArr = [];
      this.winList.forEach(item => {
        indexArr.push(item.zIndex);
      });
      let index = indexArr.indexOf(Math.max(...indexArr));
      let tagsNavList = [];
      for (let i = 0; i < this.winList.length; i++) {
        let {
          isClose,
          title,
          isShow,
          isMaximize,
          url,
          left,
          top,
          zIndex
        } = this.winList[i];
        tagsNavList.push({
          isClose,
          zIndex,
          url,
          left,
          top,
          title,
          isShow,
          isMaximize,
          isStick: index === i ? true : false // 是否最顶层窗口
        });
      }
      return tagsNavList;
    }
  },
  watch: {
    token: function(val, oldVal) {
      if (!val) {
        this.$router.push({
          name: "login"
        });
      }
    },
    openHostManageTime(val) { //打开防盗主机页
      this.addWinPopup({ title: "防盗主机", url: "securityHost" });
    }
  },
  data() {
    return {
      homeIsVisible: false,
      CompanyType: this.$options.filters.statusList("CompanyType"),
      video: {
        url: "ezopen://open.ys7.com/C92768335/1.live",
        token:
          "at.4rgi0fd15mhccwy15iiqiltl45zxrifl-5towx1yosh-0ewedhf-srkiejo2l"
      },
      menuList: [
        {
          icon: "iconxiaoxi",
          title: "消息管理",
          jurisdiction: [
            "msgM.alarm.view",
            "msgM.mac.view",
            "msgM.maintenance.view",
            "all"
          ],
          children: [
            {
              title: "报警消息",
              url: "alarm",
              jurisdiction: ["msgM.alarm.view", "all"]
            },
            {
              title: "主机消息",
              url: "machine",
              jurisdiction: ["msgM.mac.view", "all"]
            },
            {
              title: "维保消息",
              url: "maintenance",
              jurisdiction: ["msgM.maintenance.view", "all"]
            }
          ]
        },
        {
          icon: "iconyiliaohangyedeICON-",
          title: "用户管理",
          jurisdiction: ["userM.client.view", "userM.server.view", "all"],
          children: [
            {
              title: "用户端用户",
              url: "clientUser",
              jurisdiction: ["userM.client.view", "all"]
            },
            {
              title: "服务端用户",
              url: "serverUser",
              jurisdiction: ["userM.server.view", "all"]
            }
          ]
        },
        {
          icon: "iconcommunity",
          title: "社区管理",
          jurisdiction: [
            "communityM.applyList.view",
            "communityM.residentInfo.view",
            "communityM.notice.view",
            "communityM.accessRecords.view",
            "communityM.entranceGuard.view",
            "communityM.feedback.view",
            "communityM.visitor.view",
            "communityM.advertisement.view",
            "communityM.doorCard.view",
            "communityM.carManage.view",
            "communityM.carManage.view",
            "all"
          ],
          children: [
            {
              title: "申请列表",
              url: "applyCommunity",
              jurisdiction: ["communityM.applyList.view", "all"]
            },
            {
              title: "住户信息",
              url: "residentInfo",
              jurisdiction: ["communityM.residentInfo.view", "all"]
            },
            {
              title: "通知管理",
              url: "communityNotice",
              jurisdiction: ["communityM.notice.view", "all"]
            },
            {
              title: "出入记录",
              url: "accessRecords",
              jurisdiction: ["communityM.accessRecords.view", "all"]
            },

            {
              title: "门禁信息",
              url: "entranceGuard",
              jurisdiction: ["communityM.entranceGuard.view", "all"]
            },
            {
              title: "反馈管理",
              url: "feedback",
              jurisdiction: ["communityM.feedback.view", "all"]
            },
            {
              title: "访客管理",
              url: "visitor",
              jurisdiction: ["communityM.visitor.view", "all"]
            },
            {
              title: "广告管理",
              url: "advertisement",
              jurisdiction: ["communityM.advertisingM.view", "all"]
            },
            {
              title: "门卡信息",
              url: "doorCard",
              jurisdiction: ["communityM.doorCard.view", "all"]
            },
            {
              title: "车辆管理",
              url: "carManage",
              jurisdiction: ["communityM.carManage.view", "all"]
            },
            {
              title: "备城门套餐",
              url: "plotPackage",
              jurisdiction: ["communityM.plotPackage.view", "all"]
            }
          ]
        },
        {
          icon: "iconkaishixunhu",
          title: "巡更管理",
          jurisdiction: ["dutyManage", "dutyMap", "areaDevice", "all"],
          children: [
            {
              title: "值班安排",
              url: "dutyManage",
              jurisdiction: ["all"]
            },
            {
              title: "巡更地图",
              url: "dutyMap",
              jurisdiction: ["all"]
            },
            {
              title: "区域设备",
              url: "areaDevice",
              jurisdiction: ["all"]
            }
          ]
        },
        {
          icon: "iconshenqing",
          title: "申请安装",
          jurisdiction: [
            "installM.deviceM.view",
            "installM.comboM.view",
            "installM.apply.view",
            "all"
          ],
          children: [
            {
              title: "设备管理",
              url: "deviceManage",
              jurisdiction: ["installM.deviceM.view", "all"]
            },
            {
              title: "套餐配置",
              url: "comboManage",
              jurisdiction: ["installM.comboM.view", "all"]
            },
            {
              title: "申请列表",
              url: "installApply",
              jurisdiction: ["installM.apply.view", "all"]
            }
          ]
        },
        {
          icon: "iconyunzhuji",
          title: "设备管理",
          jurisdiction: [
            "hostM.installArea.view",
            "hostM.security.view",
            "hostM.security.view",
            "hostM.areaPlotMap",
            "hostM.entranceDevice.view",
            "all"
          ],
          children: [
            {
              title: "安装区域",
              url: "installArea",
              jurisdiction: ["hostM.installArea.view", "all"]
            },
            {
              title: "服务器配网",
              url: "setupServer",
              jurisdiction: ["hostM.setupServer", "all"]
            },
            {
              title: "防盗主机",
              url: "securityHost",
              jurisdiction: ["hostM.security.view", "all"]
            },
            {
              title: "区域小区地图",
              url: "areaPlotMap",
              jurisdiction: ["hostM.areaPlotMap", "all"]
            },
            {
              title: "门口设备",
              url: "entranceDevice",
              jurisdiction: ["hostM.entranceDevice.view", "all"]
            }
          ]
        },
        {
            icon: 'iconyouhuiquan',
            title: '优惠券管理',
            jurisdiction: [
                'couponM.couponList.view',
                'couponM.couponOrder.view',
                "all"
            ],
            children: [
                {
                    title:'优惠券列表',
                    url: 'couponList',
                    jurisdiction: ["couponM.couponList.view", 'all']
                },
                {
                    title:'优惠券订单',
                    url: 'couponOrder',
                    jurisdiction: ["couponM.couponOrder.view", 'all']
                }
            ]
        },
        {
          icon: "iconyunshujuku",
          title: "公用数据",
          jurisdiction: [
            "common.plogM.view",
            "common.companyM.view",
            "common.noticeType.view",
            "common.business.view",
            "all"
          ],
          children: [
            {
              title: "小区数据",
              url: "plotManage",
              jurisdiction: ["common.plogM.view", "all"]
            },
            {
              title: "公司数据",
              url: "companyManage",
              jurisdiction: ["common.companyM.view", "all"]
            },
            {
              title: "商家数据",
              url: "businessManage",
              jurisdiction: ["common.business.view", "all"]
            },
            {
              title: "物业通知分类",
              url: "noticeType",
              jurisdiction: ["common.noticeType.view", "all"]
            }
          ]
        },
        // {
        //     icon: 'iconxierushujuku',
        //     title: '录入管理',
        //     children: [
        //         {
        //             title: '报装信息录入'
        //         },
        //         {
        //             title: '人员录入'
        //         },
        //         {
        //             title: '小区录入'
        //         },
        //         {
        //             title: '楼座录入',
        //         },
        //         {
        //             title: '门号录入'
        //         }
        //     ]
        // },
        // {
        //     icon: 'iconthin-_home_flat',
        //     title: '社区管理',
        //     children: [
        //         {
        //             title: '小区通知分类'
        //         },
        //         {
        //             title: '业主申请审核'
        //         }
        //     ]
        // },

        {
          icon: "iconxitongshezhixianxing",
          title: "系统设置",
          jurisdiction: [
            "systemM.accessM.view",
            "systemM.accountM.view",
            "systemM.roleM.view",
            "systemM.missionM.view",
            "systemM.configurE.view",
            "all"
          ],
          children: [
            {
              //   icon: "iconicon-quanxianxg",
              title: "权限菜单",
              url: "accessMenu",
              jurisdiction: ["systemM.accessM.view", "all"]
            },
            {
              //   icon: "iconzhuzhanghaoliebiao",
              title: "账号管理",
              url: "accountManage",
              jurisdiction: ["systemM.accountM.view", "all"]
            },
            {
              //   icon: "iconjiaoseguanli",
              title: "角色管理",
              url: "roleManage",
              jurisdiction: ["systemM.roleM.view", "all"]
            },
            {
              //   icon: "iconjiaoseguanli",
              title: "任务管理",
              url: "missionManage",
              jurisdiction: ["systemM.missionM.view", "all"]
            },
            {
              //   icon: "iconjiaoseguanli",
              title: "配置模块",
              url: "configure",
              jurisdiction: ["systemM.configurE.view", "all"]
            }
          ]
        },
        {
          icon: "iconxierushujuku",
          title: "日志管理",
          jurisdiction: [
            "logM.call.view",
            "logM.send.view",
            "logM.verification.view",
            "all"
          ],
          children: [
            {
              title: "呼叫模块",
              url: "call",
              jurisdiction: ["logM.call.view", "all"]
            },
            {
              title: "发送模块",
              url: "send",
              jurisdiction: ["logM.send.view", "all"]
            },
            {
              title: "验证模块",
              url: "verification",
              jurisdiction: ["logM.verification.view", "all"]
            }
          ]
        }
      ],
      //   popupLeft: popupLeft,
      //   popupTop: popupTop,
      curPopupIndex: 1,
      winList: [
        // {
        //   isClose: false,
        //   url: '',
        //   title: "窗口一",
        //   zIndex: 0,
        //   isShow: true,
        //   isMaximize: false,
        //   left: popupLeft, // 离左边距离
        //   top: popupTop // 离顶部距离
        // }
      ]
    };
  },
  async created() {
    if (this.companyType === 1) {
      // 如果公司类型为物管，就跳到物管首页
      this.$router.push({
        name: this.$config.communityHomeName
      });
    }
    this.handleLoginByToken();
    await this.handleGetStatusList(); // 获取系统状态列表
    setTimeout(() => {
        this.homeIsVisible = true;
    },100)
    
  },
  mounted() {},
  methods: {
    ...mapActions(["handleLoginByToken", "handleGetStatusList"]),
    play() {},
    hasOneOf(arr, jurisdiction) {
      return hasOneOf(arr, jurisdiction);
    },
    activated(index) {
      // 触发激活窗口
      console.log("点击激活了对话框", index);
    },
    minimize(index) {
      // 点击最小化按钮
      console.log("最少化", index);
      this.winList[index].isShow = false;
    },
    maximize(index) {
      // 点击最大化按钮
      console.log("最大化", index);
      this.$set(
        this.winList[index],
        "isMaximize",
        !this.winList[index].isMaximize
      );
    },
    close(index) {
      // 关闭一项
      this.winList[index].isClose = true;
      console.log(this.winList);
    },
    allWinHide() {
      // 所有展开的窗口最小化
      for (let i = 0; i < this.winList.length; i++) {
        this.winList[i].isShow = false;
      }
    },
    dragStart(index) {
      console.log("dragStart", index);
      if (this.winList[index].zIndex !== this.curPopupIndex) {
        console.log("不等于最大");
        this.curPopupIndex = this.curPopupIndex + 1;
        this.$set(this.winList[index], "zIndex", this.curPopupIndex);
      }
    },
    clickTagsNav(index) {
      // 点击头部tab菜单时，切换显示和隐藏
      if (this.tagsNavList[index].isStick) {
        this.winList[index].isShow = !this.winList[index].isShow;
      } else if (!this.tagsNavList[index].isShow) {
        this.winList[index].isShow = true;
      }
      this.dragStart(index);
    },
    dbclickChangeSize(index) {
      // 双击改变尺寸
      console.log("双击了");
    },
    onDrag({ x, y }, index) {
      console.log("app", x, y, index);
      // this.winList[index].left
      this.$set(this.winList[index], "left", x);
      this.$set(this.winList[index], "top", y);
    },

    addWinPopup({ title, url }) {
      // 添加新的小窗口
      let isHas = false; // 是否已经打开窗地址的窗口
      this.winList.forEach((val, index) => {
        if (val.url === url && !val.isClose) {
          this.curPopupIndex = this.curPopupIndex + 1;
          this.winList[index].zIndex = this.curPopupIndex;
          this.winList[index].isShow = true;
          isHas = true;
        }
      });
      if (!isHas) {
        this.curPopupIndex = this.curPopupIndex + 1;
        this.winList.push({
          isClose: false,
          url: url,
          title: title,
          zIndex: this.curPopupIndex,
          isShow: true,
          isMaximize: true,
          left: popupLeft, // 离左边距离
          top: popupTop // 离顶部距离
        });
      }
    },
    closeNav(index) {
      if (index) {
        // 如果有值就只保留这一个窗口
        this.winList[index].isClose = true;
      } else {
        // 否则全部关闭
        this.winList = [];
      }
    },
    newWinOpen(index) {
      let url = this.winList[index].url;
      console.log(url);
      window.open(url, "_blank");
    }
  }
};
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

// .vdr {
// .handle-bar {
// display: block !important;
// right: -1px;
// bottom: -1px;
// background: #0063b1;
// border: 1px solid #0063b1;
// z-index: 1;
// height: 20px;
// width: 20px;
// opacity: 0;
// min-width: 1340px;
// }
// }
.desktop-wrapper {
  position: absolute;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 1340px;
  display: flex;
  justify-content: space-between;

  .maximize-wrapper {
    // top: 0 !important;
    // left: 0 !important;
    // width: 100% !important;
    // height: 100% !important;
    top: 0 !important;
    left: 320px !important;
    right: 0;
    bottom: 0;
    width: auto !important;
    height: auto !important;
  }

  .menu-list-wrapper {
    flex: 0 0 320px;
    overflow: hidden;
  }

  .menu-list-container {
    width: 338px;
    overflow-y: scroll;
    height: 100%;
    margin-right: -18px;

    .menu-list {
      width: 320px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .items {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
        margin: 10px 10px 0 10px;
        color: #333;
        width: 300px;
        padding: 10px 15px;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
        }

        .item {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          margin-bottom: 6px;
          align-items: center;

          i {
            color: #26364D;
            font-size: 22px;
            padding-right: 10px;
          }

          span {
            color: #26364D;
            font-size: 20px;
            font-weight: bold;
          }
        }

        .options {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;

          .option {
            flex: 0 0 90px;
            height: 28px;
            line-height: 28px;
            text-align: left;
            font-size: 13px;
            cursor: pointer;
            color: #26364D;

            &:hover {
              color: #597eb3;
            }
          }
        }
      }

      // flex-flow: wrap;
      .item-without {
        width: 4096px;
        height: 76px;
      }
    }
  }

  .other-wrapper {
    margin: 10px 0px;
    flex: 1;
    overflow-y: auto;

    .message-center {
      background: rgba(255, 255, 255, 1);
      padding: 10px 15px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;

      &:hover {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      }

      .title {
        font-size: 20px;
        margin-bottom: 10px;
        color: #26364d;
        font-weight: bold;
      }

      .items {
        display: flex;

        .item {
          flex: 1;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #f7f7f7;
          }
        }
      }
    }

    .data-center {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      padding: 10px 15px;

      &:hover {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      }

      .title {
        font-size: 20px;
        margin-bottom: 10px;
        color: #26364d;
        font-weight: bold;
      }

      .items {
        display: flex;
        flex-wrap: wrap;

        .item {
          flex: 0 0 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;

          .chart {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #3388FF;
          }

          span {
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }

    .statement {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      padding: 10px 15px;

      &:hover {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      }

      .title {
        font-size: 20px;
        margin-bottom: 10px;
        color: #26364d;
        font-weight: bold;
      }

      .items {
        display: flex;
        flex-wrap: wrap;

        .item {
          height: 40px;
          line-height: 40px;
          flex: 0 0 25%;
          font-size: 14px;
          color: #597EB3;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #f7f7f7;
          }
        }
      }
    }
  }

  .operating-record {
    background: rgba(255, 255, 255, 1);
    flex: 0 0 300px;
    margin: 10px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    padding: 10px 5px 10px 15px;
    display: flex;
    flex-direction: column;

    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    }

    .title {
      font-size: 20px;
      color: #2c3e50;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .items {
      flex: 1;
      overflow-y: scroll;
      padding-right: 10px;

      .item {
        text-align: left;
        margin-bottom: 20px;

        .time {
          width: 100%;
          color: #A1A8B3;
          margin-bottom: 4px;
        }

        .info {
          display: flex;

          .role {
            background: #3388FF;
            height: 20px;
            color: #fff;
            font-size: 12px;
            display: flex;
            line-height: 20px;
            padding: 0 8px;
            border-radius: 10px;
            margin-right: 10px;
          }

          .name {
            font-size: 12px;
            color: #3388FF;
            margin-right: 10px;
          }

          .detail {
            flex: 1;
            font-size: 12px;
            color: #26364D;
          }
        }
      }
    }
  }
}
</style>
