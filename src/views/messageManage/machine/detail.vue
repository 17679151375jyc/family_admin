<template>
  <Modal
    title="详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="700"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconxiaoxi1"></i>
            <span>消息类型</span>
          </div>
          <div class="text">{{info.type}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>状态</span>
          </div>
          <div class="text">{{info.status}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>消息名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconiconset0254"></i>
            <span>CID码</span>
          </div>
          <div class="text">{{info.cidCode}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>用户手机</span>
          </div>
          <div class="text">{{info.userPhone}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icongongandunpai"></i>
            <span>防区名称</span>
          </div>
          <div class="text">{{info.defenceAreaName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>发生时间</span>
          </div>
          <div class="text">{{info.createTime}}</div>
        </div>
      </div>
    </div>
    <Modal title="目标地点" v-model.trim="mapIsShow" footer-hide :mask-closable="false" width="800">
      <div id="map" style="width: 100%;height: 500px;"></div>
    </Modal>
  </Modal>
</template>
<script>
import { getMachineMessageDetail } from "@/api/messageManage";
export default {
  props: {
    id: {
      type: Number,
      default: null
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mapIsShow: false,
      info: {
        userPhone: null, // 用户手机
        name: null, //  消息名称
        createTime: null, // 发生时间
        cidCode: null, // cid码
        defenceAreaName: null, // 防区名称
        status: null // 状态
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.getDetail();
    }
  },
  computed: {},
  methods: {
    getDetail() {
      // 获取账号详情
      getMachineMessageDetail({
        messageId: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          data.createTime = this.$options.filters.formatTime(data.createTime);
          console.log(data.type)
          if (data.type === 0) {
            // 报警消息
            data.status = this.$config.alarm.status[data.status].name;
            data.type = '报警消息'
          } else if (data.type === 1) {
            // 维保消息
            data.status = this.$config.maintenance.status[data.status].name;
            data.type = '维保消息'
          } else {
            // 其它消息
            console.log('else')
            data.status = "";
            data.type = '其它消息'
          }

          console.log(data)
          this.info = data;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
>>>.amap-icon img {
  width: 25px;
  height: 34px;
}

>>>.amap-marker-label {
  border: 0;
  background-color: transparent;
}

>>>.info {
  position: relative;
  top: 10px;
  right: -55px;
  min-width: 0;
  background: #fff;
  padding: 4px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}
</style>


