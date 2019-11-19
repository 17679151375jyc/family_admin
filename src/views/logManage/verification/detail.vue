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
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>手机号</span>
          </div>
          <div class="text">{{info.phone}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconneirongguanli"></i>
            <span>验证码</span>
          </div>
          <div class="text">{{info.code}}</div>
        </div>
      </div>


    </div>
    <Modal title="目标地点" v-model.trim="mapIsShow" footer-hide :mask-closable="false" width="800">
      <div id="map" style="width: 100%;height: 500px;"></div>
    </Modal>
  </Modal>
</template>
<script>
import { getSendlDetail } from "@/api/logManage";
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
        phone: null, // 发送类型
        code: null, //  发送内容
      }
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.getDetail();
    }
  },
  computed: {},
  methods: {
    getDetail() {
      console.log(this.id)
      // 获取账号详情
      getSendlDetail({
        id: this.id
      }).then((data) => {
        console.log(data)        
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


