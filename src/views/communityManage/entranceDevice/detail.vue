<template>
  <Modal
    title="详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="800"
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
            <i class="iconfont iconshebei"></i>
            <span>设备名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconiconset0254"></i>
            <span>设备编码</span>
          </div>
          <div class="text">{{info.code}}</div>
        </div>
      </div>

      <div class="row">
          <div class="item">
          <div class="label">
            <i class="iconfont iconfl-xiaoshoudan"></i>
            <span>销售渠道</span>
          </div>
          <div class="text">{{info.saleChannel ? $config.installManage.deviceManage.saleChannel[info.saleChannel].name : ''}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconwenhao"></i>
            <span>是否有效</span>
          </div>
          <div class="text">{{info.valid ? '有效' : '无效'}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>价格</span>
          </div>
          <div class="text">{{info.price ? info.price.toFixed(2) : ''}}元</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>服务费</span>
          </div>
          <div class="text">{{info.servicePrice ? info.servicePrice.toFixed(2) : '0.00'}}元</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>更新时间</span>
          </div>
          <div class="text">{{info.updateTime}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>创建时间</span>
          </div>
          <div class="text">{{info.createTime}}</div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getDeviceDetail } from "@/api/installManage";
export default {
  props: {
    id: {
      type: String,
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
      info: {
        saleChannel: null, // 销售渠道
        code: null, // 设备编码
        createTime: null, // 创建时间
        name: null, //设备名称
        noEdit: null, // 是否可以编辑
        price: null, //价格
        servicePrice: null, // 服务费
        updateTime: null, //更新时间
        valid: null, // 是否有效
        
      }
    };
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    /**
     * 获取用户详情
     */
    getDetail() {
      // 获取账号详情
      getDeviceDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          data.createTime = this.$options.filters.formatTime(data.createTime);
          data.updateTime = this.$options.filters.formatTime(data.updateTime);
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
.divider {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 30px 0;
}

>>>.ivu-tree-children>li {
  margin-top: 0;
}
</style>


