<template>
  <div class="wrapper" :style="{'background': '#F2F3F5'}" v-if="homeIsVisible">
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
      <!-- 菜单列表-start -->
      <div class="menu-container">
        <div class="menu-wrapper">
          <div class="menu-items">
            <div
              class="item"
              v-for="(item, index) in menuList"
              :key="index"
              @click="addWinPopup(item)"
              v-show="hasOneOf(item.jurisdiction, jurisdiction)"
            >
              <div class="icon">
                <img :src="require(`_a/images/community/${item.img}`)" />
              </div>
              <div class="text">{{item.title}}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 菜单列表-end -->

      <!-- 其它信息模块-start -->
      <div class="other-container">
        <!-- 管理中心-start -->
        <div class="manage-center-wrapper">
          <div class="top">
            <div class="title">
              <div class="left">
                <div class="icon">
                  <img :src="require('_a/images/community/icon_user_center.png')" />
                </div>
                <span>管理中心</span>
                <div
                  class="refresh"
                  @click="manageCenter.refreshNumber = manageCenter.refreshNumber + 1"
                >
                  <i class="iconfont iconshuaxin"></i>
                </div>
              </div>
            </div>
            <div class="items">
              <div class="item" @click="addWinPopup({title:'住户资料', url:'residentInfo'})">
                <span>{{dataTotal.total}}</span>
                <div class="text">住户资料</div>
              </div>
              <div
                v-if="hasOneOf(['communityM.applyList.view', 'all'], jurisdiction)"
                :class="['item', manageCenter.curIndex === 1 ? 'active': '']"
                @click="manageCenter.curIndex=1"
              >
                <span class="error">{{dataTotal.noCheckNumber}}</span>
                <div class="text">待审核</div>
              </div>

              <div
                v-if="hasOneOf(['communityM.applyList.view', 'all'], jurisdiction)"
                :class="['item', manageCenter.curIndex === 2 ? 'active': '']"
                @click="manageCenter.curIndex=2"
              >
                <span class="warning">{{dataTotal.checkingNumber}}</span>
                <div class="text">审核中</div>
              </div>
              <!-- <div
                :class="['item', manageCenter.curIndex === 3 ? 'active': '']"
                @click="manageCenter.curIndex=3"
              >-->
              <!-- <div class="item"  @click="addWinPopup({title:'楼座管理', url:'#/dataManage/plotManage'})">
                <span>
                  <img :src="require('_a/images/community/icon_gallery_setting.png')" alt />
                </span>
                <div class="text">楼座管理</div>
              </div>-->
            </div>
          </div>

          <div class="list-items">
            <div class="item" v-show="manageCenter.curIndex === 1">
              <!-- 未审核 -->
              <apply-community-breviary :status="0" :refreshNumber="manageCenter.refreshNumber"></apply-community-breviary>
            </div>
            <div class="item" v-show="manageCenter.curIndex === 2">
              <!-- 审核中 -->
              <apply-community-breviary :status="3" :refreshNumber="manageCenter.refreshNumber"></apply-community-breviary>
            </div>
            <div class="item" v-show="manageCenter.curIndex === 3">
              <!--楼座管理-->
              楼座管理
            </div>
          </div>
        </div>
        <!-- 管理中心-end -->

        <!-- 问题反馈-start -->
        <div
          class="feedback-wrapper"
          v-if="hasOneOf(['communityM.feedback.view', 'all'], jurisdiction)"
        >
          <div class="top">
            <div class="title">
              <div class="left">
                <div class="icon">
                  <img :src="require('_a/images/community/icon_feedback.png')" />
                </div>
                <span>问题反馈</span>
                <div class="refresh" @click="feedback.refreshNumber = feedback.refreshNumber + 1">
                  <i class="iconfont iconshuaxin"></i>
                </div>
              </div>
              <div class="right">
                <span @click="addWinPopup({title:'问题反馈', url:'feedback'})">查看更多</span>
              </div>
            </div>
          </div>

          <div class="content-wrapper">
            <feedback-breviary :refreshNumber="feedback.refreshNumber"></feedback-breviary>
          </div>
        </div>
        <!-- 问题反馈-end -->

        <!-- 出入记录-start -->
        <div
          class="access-records-wrapper"
          v-if="hasOneOf(['communityM.accessRecords.view', 'all'], jurisdiction)"
        >
          <div class="top">
            <div class="title">
              <div class="left">
                <div class="icon">
                  <img :src="require('_a/images/community/icon_access_records.png')" />
                </div>
                <span>出入记录</span>
                <div
                  class="refresh"
                  @click="accessRecords.refreshNumber = accessRecords.refreshNumber + 1"
                >
                  <i class="iconfont iconshuaxin"></i>
                </div>
              </div>
              <div class="right">
                <span @click="addWinPopup({title:'出入记录', url:'accessRecords'})">查看更多</span>
              </div>
            </div>
          </div>

          <div class="content-wrapper">
            <access-records-breviary :refreshNumber="accessRecords.refreshNumber"></access-records-breviary>
          </div>
        </div>
        <!-- 出入记录-end -->
      </div>
      <!-- 其它信息模块-end -->

      <!-- v-show="item.isShow" -->
      <draggable-popup
        v-for="(item, index) in tagsNavList"
        :isClose="item.isClose"
        :key="index"
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
  </div>
</template>
<script>
// function stop() {
//   return false;
// }
// document.oncontextmenu = stop; // 禁止右击菜单
import HeaderBar from "./header/header";
import DraggablePopup from "_c/draggablePopup/draggablePopup";
import ApplyCommunityBreviary from "@/views/communityManage/applyCommunity/applyCommunityBreviary";
import FeedbackBreviary from "@/views/communityManage/feedback/feedbackBreviary";
import AccessRecordsBreviary from "@/views/communityManage/accessRecords/accessRecordsBreviary";
import { mapState, mapActions } from "vuex";
import { hasOneOf } from "@/libs/tools";
import { communityDataStatistics } from "@/api/communityManage";
const popupLeft = 215;
const popupTop = 0;
export default {
  components: {
    DraggablePopup,
    HeaderBar,
    ApplyCommunityBreviary,
    FeedbackBreviary,
    AccessRecordsBreviary
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      jurisdiction: state => state.user.jurisdiction,
      plots: state => state.user.plots,
      curPlotNumber: state => state.user.curPlotNumber
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
    curPlotNumber: function() {
      this.communityDataStatistics();
    }
  },
  data() {
    return {
      homeIsVisible: false,
      dataTotal: {
        total: 0,
        chingNumber: 0,
        noCheckNumber: 0
      },
      manageCenter: {
        refreshNumber: 1,
        curIndex: 1 // 当前管理中心的tab选择是那一个
      },
      feedback: {
        refreshNumber: 1
      },
      accessRecords: {
        refreshNumber: 1
      },
      ApplyStatus: this.$options.filters.statusList("ApplyStatus"),
      //   video: {
      //     url: "ezopen://open.ys7.com/C92768335/1.live",
      //     token:
      //       "at.4rgi0fd15mhccwy15iiqiltl45zxrifl-5towx1yosh-0ewedhf-srkiejo2l"
      //   },
      menuList: [
        {
          img: "icon_property.png",
          title: "物管人员",
          url: "serverUser",
          jurisdiction: ["userM.server.view", "all"]
        },
        {
          img: "icon_user_center.png",
          title: "住户资料",
          url: "residentInfo",
          jurisdiction: ["communityM.residentInfo.view", "all"]
        },
        {
          img: "icon_examine.png",
          title: "待审住户",
          url: "applyCommunity",
          jurisdiction: ["communityM.applyList.view", "all"]
        },
        {
          img: "icon_visiter.png",
          title: "访客记录",
          url: "visitor",
          jurisdiction: ["communityM.visitor.view", "all"]
        },
        {
          img: "icon_gallery_setting.png",
          title: "楼座管理",
          url: "plotManage",
          jurisdiction: ["common.plogM.view", "all"]
        },
        {
          img: "icon_face.png",
          title: "门禁人脸管理",
          url: "entranceGuard",
          jurisdiction: ["communityM.entranceGuard.view", "all"]
        },
        {
          img: "icon_door_card.png",
          title: "门卡管理",
          url: "doorCard",
          jurisdiction: ["communityM.doorCard.view", "all"]
        },
        {
          img: "icon_car.png",
          title: "车辆管理",
          url: "carManage",
          jurisdiction: ["communityM.carManage.view", "all"]
        },
        {
          img: "icon_access_records.png",
          title: "出入记录",
          url: "accessRecords",
          jurisdiction: ["communityM.accessRecords.view", "all"]
        },
        {
          img: "icon_news.png",
          title: "通知记录",
          url: "communityNotice",
          jurisdiction: ["communityM.notice.view", "all"]
        },
        {
          img: "icon_feedback.png",
          title: "问题反馈",
          url: "feedback",
          jurisdiction: ["communityM.feedback.view", "all"]
        },
        {
          img: "icon_equipment.png",
          title: "门口机管理",
          url: "entranceDevice",
          jurisdiction: ["communityM.entranceDevice.view", "all"]
        },
        {
          img: "icon_account.png",
          title: "账号管理",
          url: "accountManage",
          jurisdiction: ["systemM.accountM.view", "all"]
        },
        {
          img: "icon_identity.png",
          title: "角色管理",
          url: "roleManage",
          jurisdiction: ["systemM.roleM.view", "all"]
        }
        // {
        //   img: "icon_history.png",
        //   title: "操作记录",
        //   url: "#/communityManage/applyCommunity",
        //   jurisdiction: ["communityM.applyList.view", "all"]
        // },
        // {
        //   img: "icon_data.png",
        //   title: "报表下载",
        //   url: "#/communityManage/applyCommunity",
        //   jurisdiction: ["communityM.applyList.view", "all"]
        // }
      ],
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
    this.handleLoginByToken();
    this.communityDataStatistics();
    await this.handleGetStatusList(); // 获取系统状态列表
     setTimeout(() => {
        this.homeIsVisible = true;
    },100)
    
  },
  mounted() {},
  methods: {
    ...mapActions(["handleLoginByToken", "handleGetStatusList"]),
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
    },
    /**
     * 统计审核、未审核用户等数量
     */
    communityDataStatistics() {
      communityDataStatistics({
        plotNumber: this.curPlotNumber
      }).then(({ data, errorCode }) => {
        this.dataTotal = data;
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
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
  top: 120px;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 1340px;
  display: flex;
  padding: 15px 0px;
  box-sizing: border-box;

  .menu-container {
    width: 200px;
    overflow: hidden;

    .menu-wrapper {
      width: 218px;
      overflow-y: scroll;
      height: 100%;

      .menu-items {
        background: #fff;
        // box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
        overflow: auto;

        .item {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          margin-top: 5px;
          transition: all 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }

          .icon {
            flex: 0 0 24px;
            height: 24px;
            margin: 0 10px 0 20px;
          }

          .text {
            font-size: 18px;
            color: #26364D;
            font-weight: bold;
          }
        }

        .item:nth-child(1) {
          margin-top: 0;
        }
      }
    }
  }

  .other-container {
    flex: 1;
    margin-left: 15px;
    display: flex;

    &>div {
      margin-right: 15px;
    }

    .manage-center-wrapper {
      flex: 1;
      display: flex;
      flex-flow: column;

      .top {
        height: 153px;
        background: #fff;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);

        .title {
          height: 60px;
          position: relative;

          &:before {
            content: '';
            position: absolute;
            height: 1px;
            background: rgba(0, 0, 0, 0.1);
            left: 20px;
            right: 20px;
            bottom: 0px;
          }

          .left {
            display: flex;
            padding: 20px;
            align-items: center;

            .icon {
              flex: 0 0 24px;
              height: 24px;
            }

            span {
              font-size: 18px;
              font-weight: bold;
              color: #26364D;
              margin: 0 10px;
            }

            .refresh {
              flex: 0 0 24px;
              height: 24px;
              border-radius: 2px;
              background: #F5F5F5;
              cursor: pointer;
              transition: all 0.3s;

              i {
                color: #3388FF;
                transition: all 0.3s;
              }

              &:hover {
                background: #3388FF;
                transition: all 0.3s;

                & i {
                  color: #fff;
                  transition: all 0.3s;
                }
              }

              &:active {
                background: darken(#3388FF, 40%);
              }
            }
          }
        }

        .items {
          margin: 0 20px;
          display: flex;

          .item {
            flex: 1;
            cursor: pointer;
            transition: all 0.3s;
            padding: 20px 0;
            position: relative;

            // overflow: hidden;
            &:before {
              content: '';
              height: 2px;
              background: #3388FF;
              position: absolute;
              bottom: 0;
              left: 4px;
              right: 4px;
              transform: scale(0);
              transition: all 0.3s;
            }

            &:after {
              content: '';
              border: 10px solid transparent;
              position: absolute;
              left: 50%;
              margin-left: -10px;
              border-bottom-color: #fff;
              bottom: -20px;
              transform: scale(0);
              transition: all 0.3s;
              transform-origin: bottom center;
            }

            &.active {
              &:after {
                transform: scale(1);
              }
            }

            &.active, &:hover {
              &:before {
                transform: scale(1);
              }
            }

            &:active {
              background: rgba(0, 0, 0, 0.05);
            }

            span {
              height: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 8px;
              color: #26364D;
              font-size: 18px;
              font-weight: bold;

              &.error {
                color: #FF0000;
              }

              &.error {
                color: #FF0000;
              }
            }

            .text {
              color: #26364D;
              font-size: 14px;
              font-weight: bold;
            }
          }
        }
      }

      .list-items {
        background: #fff;
        flex: 1;
        margin-top: 20px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        overflow: hidden;

        .item {
          flex: 1;
          display: flex;
          margin: 20px;
          overflow: hidden;
        }
      }
    }

    .feedback-wrapper {
      flex: 1;
      background: #fff;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-flow: column;

      .top {
        height: 60px;
        padding: 0px 20px;
        background: #fff;

        .title {
          height: 60px;
          position: relative;
          display: flex;

          .left {
            display: flex;
            align-items: center;
            flex: 1;

            .icon {
              flex: 0 0 24px;
              height: 24px;
            }

            span {
              font-size: 18px;
              font-weight: bold;
              color: #26364D;
              margin: 0 10px;
            }

            .refresh {
              flex: 0 0 24px;
              height: 24px;
              border-radius: 2px;
              background: #F5F5F5;
              cursor: pointer;
              transition: all 0.3s;

              i {
                color: #3388FF;
                transition: all 0.3s;
              }

              &:hover {
                background: #3388FF;
                transition: all 0.3s;

                & i {
                  color: #fff;
                  transition: all 0.3s;
                }
              }

              &:active {
                background: darken(#3388FF, 40%);
              }
            }
          }

          .right {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            span {
              font-size: 14px;
              color: #3388FF;
              transition: all 0.2s;
              cursor: pointer;

              &:hover {
                color: #f00;
              }
            }
          }
        }
      }

      .content-wrapper {
        flex: 1;
        margin-bottom: 20px;
        overflow: hidden;
      }
    }

    .access-records-wrapper {
      flex: 1;
      background: #fff;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-flow: column;

      .top {
        height: 60px;
        padding: 0px 20px;
        background: #fff;

        .title {
          height: 60px;
          position: relative;
          display: flex;

          .left {
            display: flex;
            align-items: center;
            flex: 1;

            .icon {
              flex: 0 0 24px;
              height: 24px;
            }

            span {
              font-size: 18px;
              font-weight: bold;
              color: #26364D;
              margin: 0 10px;
            }

            .refresh {
              flex: 0 0 24px;
              height: 24px;
              border-radius: 2px;
              background: #F5F5F5;
              cursor: pointer;
              transition: all 0.3s;

              i {
                color: #3388FF;
                transition: all 0.3s;
              }

              &:hover {
                background: #3388FF;
                transition: all 0.3s;

                & i {
                  color: #fff;
                  transition: all 0.3s;
                }
              }

              &:active {
                background: darken(#3388FF, 40%);
              }
            }
          }

          .right {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            span {
              font-size: 14px;
              color: #3388FF;
              transition: all 0.2s;
              cursor: pointer;

              &:hover {
                color: #f00;
              }
            }
          }
        }
      }

      .content-wrapper {
        flex: 1;
        margin: 0 20px 20px 20px;
        overflow: hidden;
      }
    }
  }

  .maximize-wrapper {
    // top: 0 !important;
    // left: 0 !important;
    // width: 100% !important;
    // height: 100% !important;
    top: 0 !important;
    left: 215px !important;
    right: 0;
    bottom: 0;
    width: auto !important;
    height: auto !important;
  }
}
</style>
