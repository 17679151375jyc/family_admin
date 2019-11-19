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
            <span>设备名称</span>
          </div>
          <div
            class="text">{{ info.name }}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>布防区域</span>
          </div>
          <div class="text">{{ info.areaName }}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>创建时间</span>
          </div>
          <div
            class="text">{{ info.createTime | formatTime }}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconbianhao"></i>
            <span>设备号</span>
          </div>
          <div class="text">{{ info.code }}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>设备类型</span>
          </div>
          <div
            class="text">{{ info.type ? equipment[info.type].name : ''}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>用户名</span>
          </div>
          <div class="text">{{ info.userRealName }}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>用户电话</span>
          </div>
          <div
            class="text">{{ info.userPhone  }}</div>
        </div>
      </div>
    </div>


    <!-- 视频主机-start -->
    <!-- <video-host @changeDel="refresh" :isShow="isShow" :id='id' :areaNumber='areaNumber' :cameras='info.cameras'></video-host> -->
    <!-- 视频主机-end -->
  </Modal>
</template>
<script>
import {
  getSectorByNumber,
  getDefenceByMacNumber,
  getVideoHostByMacNum
} from "@/api/hostManage";
// import videoHost from "./videoHost/videoHost";
import { getRegionEquipmentDetail } from "@/api/patrolManage";
export default {
  components: {
    // videoHost
  },
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
    },
    areaNumber: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      hostId: null,
      subIsShow: false,
      form: {
        userName: "",
        roleId: ""
      },
      equipment: {
        // 主机状态列表
        1: {
          name: "蓝牙巡更",
          value: '1',
        }
      },
      info: {
        name: null,//设备名称
        areaName: null,//布防区域
        cameras: [],//视频主机
        areaNumber: null, // 布防区域Number
        createTime: null, // 创建时间
        code: null, // 设备号
        deleteState: null, // 
        id: null, //  
        type: null, //类型
        userPhone: null, // 用户电话
        userRealName: null, // 用户名
      }
    };
  },
  computed: {
    'info.cameras': function(val, oldVal) {
        this.getDetail()
    }
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    refresh(val){
      if(val){
        this.getDetail()
      }
    },
    getDetail() {
      console.log(this.id)
      // 获取账号详情
      getRegionEquipmentDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
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

>>>.ivu-tree-children>li {
  margin-top: 0;
}
</style>


