<!--审核-->
<template>
  <Modal
    title="详情"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    footer-hide
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
            <i class="iconfont iconyonghu"></i>
            <span>真实姓名</span>
          </div>
          <div class="text">{{info.realName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>当前状态</span>
          </div>
          <div class="text">
            <span>{{info.status | statusName('ApplyStatus')}}（审核人：{{info.serverUserName}}）</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconxingbie"></i>
            <span>性别</span>
          </div>
          <div class="text">{{info.sex ? '男' : '女'}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>手机号</span>
          </div>
          <div class="text">
            <span>{{info.domicilePhone}}</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconId"></i>
            <span>身份证</span>
          </div>
          <div class="text">{{info.identityCard}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>申请时间</span>
          </div>
          <div class="text">{{info.applyTime|formatTime}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区楼座</span>
          </div>
          <div class="text">{{info.plotName+info.buildingName+info.doorName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>省市区</span>
          </div>
          <div class="text">{{info.province+info.city+info.area+info.street}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>详细地址</span>
          </div>
          <div class="text">{{info.address || '暂未填写地址'}}</div>
        </div>
      </div>
      <div class="row" v-if="info.status!=1">
        <div class="item">
          <div class="label">
            <i class="iconfont iconxiaoxi2"></i>
            <span>反馈信息</span>
          </div>
          <div class="text">{{info.feedBack}}</div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getApplyDetail, updateApplyStatus } from "@/api/communityManage";
let that;
export default {
  props: {
    number: {
      type: String,
      default: ""
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
      manageList: [], //物管列表
      feedbackList: [
        {
          label: "",
          value: ""
        },
        {
          label: "资料不足或不符",
          value: "资料不足或不符"
        },
        {
          label: "无法确认信息真实性",
          value: "无法确认信息真实性"
        },
        {
          label: "其它原因，请自行联系物管",
          value: "其它原因，请自行联系物管"
        }
      ],
      subIsShow: false,
      info: {
        street: null, //街道
        address: null, // 地址
        applyTime: null, // 申请时间
        area: null, // 区域
        buildingName: null, //楼座
        city: null, // 市
        doorName: null, //门号
        id: null, // id
        identityCard: null, // 身份证
        phone: null, // 电话
        plotName: null, // 小区名
        province: null, // 省
        realName: null, // 真实姓名
        sex: null, // 0女，1男
        status: null, // 状态
        feedback: null // 反馈信息
      }
    };
  },
  computed: {
    reverseSum() {
      return this.failureList.reverse();
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  created() {
    that = this;
  },
  methods: {
    /**
     * 获取数据详情
     */
    getDetail() {
      getApplyDetail({
        applyNumber: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
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
.flex-imgs {
  width: 100px;
  height: 130px;
  display: inline-block;
  margin-right: 10px;

  .img-item {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);

    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }

  span {
    display: block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
}
</style>


