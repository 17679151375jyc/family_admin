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
            <span>呼叫类型</span>
          </div>
          <div class="text">{{ info.callType }}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>手机号</span>
          </div>
          <div class="text">{{info.phone}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>返回类型</span>
          </div>
          <div class="text">{{info.backStatus}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconcanshu"></i>
            <span>呼叫参数</span>
          </div>
          <div class="text">
              <json-viewer :value="info.param"></json-viewer>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontongjijieguo"></i>
            <span>呼叫结果</span>
          </div>
          <div class="text">
              <json-viewer :value="info.result"></json-viewer>
          </div>
        </div>
      </div>
    </div>
    <!-- <Modal title="目标地点" v-model.trim="mapIsShow" footer-hide :mask-closable="false" width="800">
      <div id="map" style="width: 100%;height: 500px;"></div>
    </Modal> -->
  </Modal>
</template>
<script>
import { getCallDetail } from "@/api/logManage";
export default {
  props: {
    id: {
      type: String,
      default: ''
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
        callType:null, // 呼叫类型
        backStatus:null, // 结果
        phone:null, // 手机号
        param: '',
        result: ''
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
      getCallDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        console.log(data)
        let {
          type,
          param,
          code,
          phone,
          result
        } = data;
        if (errorCode === 0){
          this.info.callType = type ==30 && type ? '提醒用户报警':'无';
          this.info.backStatus =  code == 200 && code? '返回成功':'返回失败';
          this.info.phone =  phone ? phone : '无';
          this.info.param = param ? JSON.parse(param) : '无',
          this.info.result = result ? JSON.parse(result) : '无'
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


