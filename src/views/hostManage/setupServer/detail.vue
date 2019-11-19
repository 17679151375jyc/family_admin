<!--详情页-->
<template>
  <Modal
    title="详情"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="800"
    footer-hide
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
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>服务器名称</span>
          </div>
          <div class="text">{{info.areaMachineName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconbianhao"></i>
            <span>主机区域码</span>
          </div>
          <div class="text">{{info.installCode}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconip"></i>
            <span>ip地址</span>
          </div>
          <div class="text">{{info.ip}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconduankou"></i>
            <span>端口号</span>
          </div>
          <div class="text">{{info.port}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconduankou"></i>
            <span>服务器上传端口</span>
          </div>
          <div
            class="text">{{info.uploadPort}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>省市区</span>
          </div>
          <div
            class="text">{{info.provinceName + info.cityName + info.areaName}}</div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getHostNetworkDetail } from "@/api/hostManage";
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
    },
  },

  data() {
    return {
      subIsShow: false,
      info: {
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        id: null,
        uploadPort: null,
        provinceName: null,
        cityName: null,
        areaName: null,//省市区
        areaMachineName: null,//服务器名称
        installCode: null,//主机区域码
        ip: null,//ip地址
        port: null,//端口号
        uploadPort: null//服务器上传端口

      }
    };
  },
  computed: {
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getHostNetworkDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          console.log(this.info)
        }
      });
    },
    submit() {},
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
.tab-wrapper .row .item .label{
  flex: 0 0 140px;
}
>>>.ivu-tree-children>li {
  margin-top: 0;
}
</style>


