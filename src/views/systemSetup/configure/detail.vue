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
  
    <!-- <view-log :macNumber="macNumber" :hostId='hostId' :isShow="isShow" :phone="info.phone"></view-log> -->
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->
    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconkey"></i>
            <span>键名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconkey"></i>
            <span>键值</span>
          </div>
          <div class="text">{{info.value}}</div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getConfigureDetail } from "@/api/systemSetup";
export default {
  props: {
    macNumber: {
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
    },
    name: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      hostId: null,
      subIsShow: false,
      defenceList: [], // 防区列表
      videoList: [], // 视频主机列表
      info: {
        id: null,
        name: null, // 主机名字
        value: null,
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
    getDetail() {
      getConfigureDetail({
        name: this.name
      }).then(({data, errorCode})=>{
        if(errorCode === 0){
          if(data){
            console.log(data)
            this.info = data
          }
        }
        
      })
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


