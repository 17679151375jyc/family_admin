<template>
  <div class="header-bar">
    <div class="info">
      <div class="left">
        <div class="logo" @click="allWinHide">
          <img :src="require('_a/images/community/mahu_logo_white.png')" width="166" height="30" />
        </div>
        <div class="type">物 业</div>
        <div class="plotName">
          <i class="iconfont icondizhi1"></i>
          <span>{{curPlotNumber ? plots[curPlotNumber].plotName : ''}}</span>
        </div>
        <div class="plot-dropdown" v-if="Object.keys(plots).length > 1">
          <Dropdown @on-click="clickPlotDropdown">
            <a href="javascript:void(0)">
              切换小区
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem
                :name="item.plotNumber"
                v-for="(item, index) in plots"
                :key="index"
              >{{item.plotName}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="right">
        <div class="name">{{companyName}} {{phone.substr(0, 3) + '****' + phone.substr(7, 10)}}</div>
        <div class="roleName">{{roleName}}</div>
        <div class="logout" @click="handleLogout">退出账号</div>
      </div>
    </div>
    <div class="tags-nav-wrapper">
      <tags-nav
        :list="tagsNavList"
        @clickTagsNav="clickTagsNav"
        @on-close="closeNav"
        @clostNavItem="clostNavItem"
      ></tags-nav>
    </div>
    <!-- <div class="bars">
      <div
        class="item"
        v-for="(item, index) in winList"
        :key="index"
        @click="handleItem(index)"
      >{{item.title}}</div>
    </div>-->
    <!-- <div class="start">
      <Dropdown @on-click="clickDropdown">
        <a href="javascript:void(0)" class="user">
          <div class="avatar">
            <img :src="require('./avatar.png')" />
          </div>
          <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list" style="min-width: 120px;">
          <div style="color:#333;padding: 5px 5px;" v-html="phone + '<br>' + roleName">
          </div>
          <DropdownItem name="logout">注销</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>-->
  </div>
</template>
<script>
import TagsNav from "./tagsNav/tagsNav";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    TagsNav
  },
  props: {
    tagsNavList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      phone: state => state.user.phone,
      roleName: state => state.user.roleName,
      companyName: state => state.user.companyName,
      plots: state => state.user.plots,
      curPlotNumber: state => state.user.curPlotNumber
    })
  },
  methods: {
    ...mapActions(["handleLogout"]),
    // handleItem(index) {
    //   this.$emit("clickItem", index);
    // },
    clickPlotDropdown(name) {
      console.log(name);
      this.$store.dispatch("setCurPlot", { plotNumber: name });
      setTimeout(() => {
        window.location.reload();
      }, 10);
    },
    clickDropdown(name) {
      if (name === "logout") {
        this.handleLogout();
      }
      console.log("点击了");
    },
    clickTagsNav(index) {
      console.log(index);
      this.$emit("clickTagsNav", index);
    },
    closeNav(index) {
      this.$emit("closeNav", index);
    },
    clostNavItem(index) {
      this.$emit("clostNavItem", index);
    },
    allWinHide() {
      // 触发事件，所有窗口先最小化
      this.$emit("allWinHide");
    }
  }
};
</script>
<style lang="stylus" scoped>
.header-bar {
  height: 120px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #0F294D;
  display: flex;
  flex-flow: column;
  min-width: 1340px;

  .start {
    flex: 0 0 110px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    .user {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .avatar {
        flex: 0 0 34px;
        height: 34px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s linear;

        img {
          width: 80%;
          height: 80%;
        }
      }
    }

    i {
      color: #fff;
    }

    &:hover {
      .avatar {
        transition: all 0.3s linear;
        box-shadow: 0 0 1px 3px rgba(255, 255, 255, 0.4);
      }

      i {
        // color: #1e91ea;
      }
    }
  }

  .bars {
    flex: 1;
    display: flex;
    overflow-x: auto;

    .item {
      flex: 1;
      max-width: 92px;
      height: 34px;
      font-size: 12px;
      white-space: nowrap;
      line-height: 34px;
      overflow: hidden;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0 10px;
      text-overflow: ellipsis;
      background: #fff;
      color: #333;
      margin: 3px 0 3px 3px;

      &:hover {
        // background: #194260;
        cursor: default;
      }

      &.active {
        background: #004275;
      }
    }
  }

  .info {
    margin-top: 0 !important;
    height: 72px;
    display: flex;
    align-items: center;
    color: #fff;

    .left {
      display: flex;
      flex: 1;
      justify-content: flex-start;

      .logo {
        flex: 0 0 166px;
        height: 30px;
        margin-left: 10px;
      }

      .type {
        flex: 0 0 70px;
        height: 30px;
        border-radius: 15px;
        background: #fff;
        color: #26364D;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        margin: 0 37px 0 24px;
      }

      .plotName {
        height: 30px;
        background: #000;
        padding: 0 15px;
        display: flex;
        align-items: center;
        overflow: hidden;
        border-radius: 3px;
        box-shadow: 0 0 3px rgba(255, 255, 255, 0.05);

        i {
          margin-right: 5px;
        }

        span {
          font-size: 15px;
          font-weight: bold;
        }
      }

      .plot-dropdown {
        margin-left: 30px;

        a {
          height: 30px;
          line-height: 30px;
          color: #fff;
        }
      }
    }

    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 20px;

      .name {
        font-size: 14px;
        color: #fff;
        font-weight: bold;
        margin-right: 10px;
      }

      .roleName {
        height: 30px;
        padding: 0 10px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        font-size: 12px;
        display: flex;
        align-items: center;
        margin-right: 30px;
      }

      .logout {
        text-decoration: underline;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: #f00;
        }
      }
    }
  }

  .tags-nav-wrapper {
    flex: 1;
    padding: 0;
    height: 40px;
    color: #515a6e;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
}
</style>
