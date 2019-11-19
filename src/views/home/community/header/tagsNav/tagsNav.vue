<template>
  <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer @on-click="handleTagsOption" style="margin-top:6px;">
        <Button size="small" type="text">
          <Icon :size="18" type="ios-close-circle-outline"/>
        </Button>
        <DropdownMenu slot="list">
          <!-- <DropdownItem name="close-others">关闭其他</DropdownItem> -->
          <DropdownItem name="close-all">关闭所有</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <ul
      v-show="visible"
      :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}"
      class="contextmenu"
    >
      <li v-for="(item, key) of menuList" @click="handleTagsOption(key)" :key="key">{{item}}</li>
    </ul>
    <div class="btn-con left-btn">
      <Button type="text" @click="handleScroll(240)">
        <Icon :size="18" type="ios-arrow-back"/>
      </Button>
    </div>
    <div class="btn-con right-btn">
      <Button type="text" @click="handleScroll(-240)">
        <Icon :size="18" type="ios-arrow-forward"/>
      </Button>
    </div>
    <div
      class="scroll-outer"
      ref="scrollOuter"
      @DOMMouseScroll="handlescroll"
      @mousewheel="handlescroll"
    >
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            type="dot"
            v-for="(item, index) in list"
            v-show="!item.isClose"
            ref="tagsPageOpened"
            :key="`tag-nav-${index}`"
            :name="item.name"
            :data-route-item="item"
            @on-close="handleClose(item)"
            @click.native="handleClick(index)"
            :closable="item.name !== $config.homeName"
            :color="item.isStick ? 'primary' : 'default'"
            @contextmenu.prevent.native="contextMenu(item, $event)"
          >{{item.title}}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { showTitle, routeEqual } from "@/libs/util";
import beforeClose from "@/router/before-close";
export default {
  name: "TagsNav",
  props: {
    value: Object,
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tagBodyLeft: 0,
      rightOffset: 40,
      outerPadding: 4,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      visible: false,
      menuList: {
        // others: "关闭其他",
        all: "关闭所有"
      },
      rightClickItemUrl: "", // 右击菜单中，选中的一项的地址
      closeItemIndex: null, // 关闭单项对应的index
    };
  },
  computed: {
    currentRouteObj() {
      //   const { name, params, query } = this.value
      //   return { name, params, query }
    },
    curHandleIndex() {
      // 当前右击菜单操作的是tagsnav中那一项
      let index = null;
      if (this.rightClickItemUrl) {
        for (let i = 0; i < this.list.length; i++) {
          console.log(this.list[i]);
          let url = this.list[i].url;
          if (url === this.rightClickItemUrl) {
            index = i;
            break;
          }
        }
      } else {
        for (let i = 0; i < this.list.length; i++) {
          let isStick = this.list[i].isStick;
          if (isStick) {
            index = i;
            break;
          }
        }
      }
      return index;
    }
  },
  methods: {
    handlescroll(e) {
      var type = e.type;
      let delta = 0;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      this.handleScroll(delta);
    },
    handleScroll(offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft;
          } else {
            this.tagBodyLeft = Math.max(
              this.tagBodyLeft + offset,
              outerWidth - bodyWidth
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
    },
    handleTagsOption(type) {
      console.log("关闭其它", type);
      console.log(this.list);

      if (type.includes("all")) {
        console.log("要触发关闭全部");
        // // 关闭所有，除了home
        // let res = this.list.filter(item => item.name === this.$config.homeName);
        // this.$emit("on-close", res, "all");
        this.$emit("on-close")
      } else if (type.includes("others")) {
        console.log("要触发关闭其它");
        this.$emit("on-close", this.curHandleIndex)
        // // 关闭除当前页和home页的其他页
        // let res = this.list.filter(
        //   item =>
        //     routeEqual(this.currentRouteObj, item) ||
        //     item.name === this.$config.homeName
        // );
        // this.$emit("on-close", res, "others", this.currentRouteObj);
        // setTimeout(() => {
        //   this.getTagElementByName(this.currentRouteObj.name);
        // }, 100);
      }
    },
    handleClose(current) {
        console.log('关闭单项', current)
        let url = current.url
        let index = null
        for (let i = 0; i < this.list.length; i++) {
            if (url === this.list[i].url && !this.list[i].isClose) {
                index = i
                break
            }
        }
        this.$emit('clostNavItem', index)
    //   if (
    //     current.meta &&
    //     current.meta.beforeCloseName &&
    //     current.meta.beforeCloseName in beforeClose
    //   ) {
    //     new Promise(beforeClose[current.meta.beforeCloseName]).then(close => {
    //       if (close) {
    //         this.close(current);
    //       }
    //     });
    //   } else {
    //     this.close(current);
    //   }
    },
    close(route) {
      //   let res = this.list.filter(item => !routeEqual(route, item))
      //   this.$emit('on-close', res, undefined, route)
    },
    handleClick(index) {
      console.log("点击了", index);
      this.$emit("clickTagsNav", index);
    },
    showTitleInside(item) {
      //   return showTitle(item, this)
    },
    isCurrentTag(item) {
      //   return routeEqual(this.currentRouteObj, item)
    },
    moveToView(tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0;
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding;
      } else if (
        tag.offsetLeft > -this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding
        );
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(
          tag.offsetLeft -
          (outerWidth - this.outerPadding - tag.offsetWidth)
        );
      }
    },
    getTagElementByName(route) {
      //   this.$nextTick(() => {
      //     this.refsTag = this.$refs.tagsPageOpened;
      //     this.refsTag.forEach((item, index) => {
      //       if (routeEqual(route, item.$attrs["data-route-item"])) {
      //         let tag = this.refsTag[index].$el;
      //         this.moveToView(tag);
      //       }
      //     });
      //   });
    },
    contextMenu(item, e) {
      this.rightClickItemUrl = item.url;
      console.log(this.rightClickItemUrl);
      this.visible = true;
      const offsetLeft = this.$el.getBoundingClientRect().left;
      this.contextMenuLeft = e.clientX - offsetLeft + 10;
      this.contextMenuTop = e.clientY - 0;
    },
    closeMenu() {
      // 关闭可击的菜单（关闭所有、关闭其它）
      console.log("关闭了菜单");
      this.rightClickItemUrl = null;
      this.visible = false;
    }
  },
  watch: {
    $route(to) {
      this.getTagElementByName(to);
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.getTagElementByName(this.$route);
    }, 200);
  }
};
</script>

<style lang="stylus" scoped>
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.size {
  width: 100%;
  height: 100%;
}

.tags-nav {
  height: 40px;
  margin: 4px 0;
  position: relative;
  border-top: 1px solid rgba(15, 41, 76, 0.7);
  border-bottom: 1px solid rgba(15, 41, 76, 0.7);

  .no-select, .size, .close-con {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 32px;
    background: rgba(15, 41, 76, 0.7);
    text-align: center;
    z-index: 10;
  }

  .btn-con {
    position: absolute;
    top: 0px;
    height: 100%;
    background: rgba(15, 41, 76, 0.7);
    padding-top: 3px;
    z-index: 10;

    button {
      padding: 6px 4px;
      line-height: 14px;
      text-align: center;
    }

    &.left-btn {
      left: 0px;
    }

    &.right-btn {
      right: 32px;
      border-right: 1px solid #F0F0F0;
    }
  }

  .scroll-outer {
    overflow: hidden;
    position: absolute;
    left: 28px;
    right: 61px;
    top: 0;
    bottom: 0;
    box-shadow: 0px 0 3px 2px rgba(100, 100, 100, 0.1) inset;

    .scroll-body {
      display: inline-block;
      padding: 1px 4px 0;
      position: absolute;
      overflow: visible;
      white-space: nowrap;
      transition: left 0.3s ease;

      .ivu-tag-dot-inner {
        transition: background 0.2s ease;
      }
    }
  }

  .contextmenu {
    position: absolute;
    margin: 0;
    padding: 5px 0;
    background: #fff;
    z-index: 100;
    list-style-type: none;
    border-radius: 4px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 5px 15px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}

.ivu-tag:hover {
  opacity: 0.9 !important;
}

.ivu-btn-text {
  color: #d8d8d8;

  &:hover {
    background: none !important;
    color: #fff;
  }
}
</style>
