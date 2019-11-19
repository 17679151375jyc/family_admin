<template>
  <div class="header-bar">
    <div class="logo" @click="allWinHide">
      <img :src="require('_a/images/community/mahu_logo_white.png')" />
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
    <div class="start">
      <Dropdown @on-click="clickDropdown">
        <a href="javascript:void(0)" class="user">
          <div class="avatar">
            <img :src="require('./avatar.png')" />
          </div>
          <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list" style="min-width: 120px;">
          <div style="color:#333;padding: 5px 5px;" v-html="phone + '<br>' + roleName">
            <!-- {{phone}}
            <br />
            {{roleName}}-->
          </div>
          <DropdownItem
            divided
            name="setPass"
            v-if="$options.filters.auth(['communityM.accessRecords.detail'])"
          >修改密码</DropdownItem>
          <DropdownItem name="logout">注销</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <add @handleClose="addClose" :isShow="add.isShow"></add>
  </div>
</template>
<script>
import add from "./add";
import TagsNav from "./tagsNav/tagsNav";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    TagsNav,
    add
  },
  props: {
    tagsNavList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      add: {
        isShow: false
      }
    };
  },
  computed: {
    ...mapState({
      phone: state => state.user.phone,
      roleName: state => state.user.roleName
    })
  },
  methods: {
    ...mapActions(["handleLogout"]),
    // handleItem(index) {
    //   this.$emit("clickItem", index);
    // },
    addClose() {
      this.add.isShow = false;
    },
    clickDropdown(name) {
      if (name === "logout") {
        this.handleLogout();
      }
      if (name === "setPass") {
        this.add.isShow = true;
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
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(15, 41, 76, 0.7);
  display: flex;
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

  .logo {
    flex: 0 0 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    overflow: hidden;

    img {
      width: 166px;
    }
  }

  .tags-nav-wrapper {
    flex: 1;
    padding: 0;
    height: 40px;
    color: #515a6e;
  }
}
</style>
