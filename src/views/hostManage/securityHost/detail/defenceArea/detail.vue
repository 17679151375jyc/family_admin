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
            <span>防区名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>防区属性</span>
          </div>
          <div class="text">{{info.property | statusName('DefenceAreaProperty')}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>设备类型</span>
          </div>
          <div class="text">{{info.deviceType | statusName('DeviceType')}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>防区编号</span>
          </div>
          <div class="text">{{info.defenceIndex - 0 >= 10 ? info.defenceIndex : 0 + '' + info.defenceIndex}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>防区位置</span>
          </div>
          <div class="text">{{info.position}}</div>
        </div>
        <div class="item">
              <div class="label">
                  <i class="iconfont iconzhujiruqinfangyu"></i>
                  <span>关联视频主机名称</span>
              </div>
              <div class="text">
                  {{cameraNames}}
              </div>
          </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getDefenceDetail } from "@/api/hostManage";
export default {
  components: {},
  props: {
    number: {
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
    cameraList: {
        type: Array, 
        default: function () {
            return []
        }
    }
  },

  data() {
    return {
      hostId: null,
      subIsShow: false,
      info: {
        name: "", // 防区名称
        study: false, // 是否学习
        defenceIndex: 0, // 防区编号
        deviceType: "", //设备类型
        property: "" //防区属性
      }
    };
  },
  computed: {
      cameraNames: function () {
          let cameraNames = []
          for(let i = 0; i < this.cameraList.length; i++) {
            cameraNames.push(this.cameraList[i].name)
          }
          return cameraNames.join('、')
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
    getDetail() {
      console.log(this.number);
      // 获取账号详情
      getDefenceDetail({
        number: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (data) {
            this.info = data;
            console.log(this.info);
          }
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
.tab-wrapper{
    .row{
        .item{
            .label{
                flex: 0 0 160px;
            }
        }
    }
}
</style>


