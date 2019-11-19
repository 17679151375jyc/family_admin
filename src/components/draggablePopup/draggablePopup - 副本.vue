<template>
  <transition name="minimize">
    <vue-draggable-resizable
      v-if="!isClose"
      v-show="isShow"
      class="draggable-wrapper maximize"
      :drag-handle="'.drag-handle'"
      :parent="true"
      :w="width"
      :h="height"
      :minWidth="minWidth"
      :minHeight="minHeight"
      :handles="['br']"
      :style="{'z-index': zIndex}"
      :x="x"
      :y="y"
      @activated="onActivated"
      :on-drag-start="onDragStartCallback"
      @dragging="onDrag"
      @dragstop="onDragStop"
      :on-resize-start="onResizeStartCallback"
      @resizestop="onResizeStop"
    >
      <div class="drag-handle">
        <div class="title">
          <slot name="title"></slot>
        </div>
        <div class="btns">
          <!-- <div class="btn" @click="newWinOpen">
            <i class="iconfont iconchuangkou1"></i>
          </div>
          <div class="btn" @click="refresh">
            <i class="iconfont iconshuaxin"></i>
          </div> -->
          <div class="btn minimize" @click="onMinimize">
            <i class="iconfont iconjian"></i>
          </div>
          <div class="btn maximize" @click="onMaximize">
            <i :class="['iconfont', maximize ? 'iconzuidahua' : 'iconweibiaoti-']"></i>
          </div>
          <div class="btn close" @click="onClose">
            <i class="iconfont iconguanbi"></i>
          </div>
        </div>
      </div>
      <div class="content">
        <!-- <div class="mark" v-show="markIsShow || !isStick"></div> -->
        <!-- <iframe
          v-if="iframeIsShow"
          :src="url"
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
        ></iframe>-->
        <router-view :name="url" style="position:absolute;top:0;left:0;right:0;bottom:0;">11</router-view>
      </div>
    </vue-draggable-resizable>
  </transition>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable";
import { setTimeout } from "timers";
export default {
  name: "draggablePopup",
  components: {
    VueDraggableResizable
  },
  props: {
    url: { // 路由名称
      type: String,
      default: ""
    },
    zIndex: {
      type: Number,
      default: 1
    },
    maximize: {
      // 是否最大化,
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    isShow: {
      type: Boolean,
      default: true
    },
    isStick: {
      // 是否置顶的
      type: Boolean,
      default: false
    },
    isClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iframeIsShow: true,
      markIsShow: false,
      width: 1070,
      height: 700,
      minWidth: 400,
      minHeight: 300,
      minimize: false, //  是否最小化
      close: false // 是否关闭
    };
  },
  created() {
    console.log("当前窗口", this.url);
  },
  methods: {
    refresh() {
      console.log("点击了刷新");
      // window.location.reload();
      // this.$refs['iframe'].location.reload();
      this.iframeIsShow = false;
      setTimeout(() => {
        this.iframeIsShow = true;
      }, 0);

      //   document.frames("aa").location.reload();
    },
    onResizeStartCallback() {
      this.markIsShow = true;
    },
    onResizeStop() {
      this.markIsShow = false;
    },
    onDragStartCallback() {
      console.log("点击选中了");
    },
    onDrag(x, y) {
      this.markIsShow = true;
      this.$emit("onDrag", { x, y });
    },
    onDragStop() {
      this.markIsShow = false;
    },
    onActivated() {
      // 触发激活窗口
      this.$emit("activated");
    },
    onMinimize() {
      // 触发最少化窗口
      this.$emit("minimize");
    },
    onMaximize() {
      // 触发最大化窗口
      this.$emit("maximize");
    },
    onClose() {
      // 触发关闭窗口
      this.$emit("close");
    },
    onDragStartCallback() {
      //拖动时触发
      this.$emit("dragStart");
    },
    /**
     * 新窗口打开
     */
    newWinOpen() {
      this.$emit("newWinOpen");
    }
  }
};
</script>
<style lang="stylus" scoped>
.draggable-wrapper {
  overflow: hidden;
  background: #fff;
  border: none !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid #024b84 !important;

  .drag-handle {
    height: 34px;
    display: flex;
    background: #0063b1;
    color: #fff;
    align-items: center;
    cursor: move;

    .title {
      flex: 1;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
    }

    .btns {
      flex: 0 0 144px;
      display: flex;
      cursor: default;

      .btn {
        flex: 1;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        &.close {
          &:hover {
            background: #E81123;
          }
        }
      }
    }
  }

  .content {
    position: absolute;
    overflow: hidden;
    top: 34px;
    left: 0;
    right: 0;
    bottom: 0;

    .mark {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
    }
  }
}
</style>

