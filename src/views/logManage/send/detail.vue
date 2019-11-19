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
            <span>发送类型</span>
          </div>
          <div class="text">{{info.sendType}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>发送时间</span>
          </div>
          <div class="text">{{info.createTime}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>手机号</span>
          </div>
          <div class="text">{{info.phone}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>返回类型</span>
          </div>
          <div class="text">{{info.backType}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconcanshu"></i>
            <span>发送参数</span>
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
            <span>发送结果</span>
          </div>
          <div class="text">
              <json-viewer :value="info.result"></json-viewer>
          </div>          
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
      sendTypes: {
          1: "注册",
          2: "登录",
          3: "忘记密码",
          30: '提醒用户报警',
          50: '通知民警处理'
      },
      mapIsShow: false,
      info: {
        sendType: null, // 发送类型
        param: '',
        result: '',
        // sendText: null, //  发送内容
        // sendTime: null, // 发送时间
        // machieName: null, // 机器名称
        createTime: null, // 创建时间
        phone: null, // 手机号
        backType: null // 返回类型
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
      }).then(({ data, errorCode }) => {
        console.log(data)
        if (errorCode === 0){
          let {
            code,
            createTime,
            param,
            result,
            phone,
            type
          } = data
          this.info.sendType = this.sendTypes[type];
          this.info.param = param ? JSON.parse(param):'无',
          this.info.result = result ? JSON.parse(result):'无',
          this.info.createTime =  createTime ? this.$options.filters.formatTime(createTime):'无';
          this.info.phone =  phone?phone:'无';
          this.info.backType = code==200 && code ? '返回成功':'返回失败' // 返回类型
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


