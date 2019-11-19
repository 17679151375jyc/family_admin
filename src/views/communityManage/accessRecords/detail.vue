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
            <i class="iconfont iconyonghu"></i>
            <span>姓名</span>
          </div>
          <div class="text">{{info.roleName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>类型</span>
          </div>
          <div class="text">{{info.roleType | statusName('RelationType')}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区</span>
          </div>
          <div class="text">{{info.plotName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconicon-test"></i>
            <span>楼座</span>
          </div>
          <div class="text">{{info.buildingName}}</div>
        </div>
      </div>
      <!-- <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconmenchuangmenchuangwujinanzhuang"></i>
            <span>户号</span>
          </div>
          <div class="text">{{info.doorName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>业主姓名</span>
          </div>
          <div class="text">{{info.realName}}</div>
        </div>
      </div> -->

      <div class="row">
        <!-- <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>业主电话</span>
          </div>
          <div class="text">{{info.phone}}</div>
        </div> -->

        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>出入类型</span>
          </div>
          <div class="text">{{info.recordType | statusName('RecordType')}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>时间</span>
          </div>
          <div class="text">{{info.triggeringTime|formatTime}}</div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getRecordDetail } from "@/api/communityManage";
export default {
  props: {
    recordNumber: {
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
        plotName: null,
        buildingName: null,
        positionName: null,
        recordType: null,
        roleName: null,
        roleType: null,
        triggeringTime: null,
        phone: null,
        realName: null,
        doorName: null,
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getRecordDetail({
        recordNumber: this.recordNumber
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
<style lang="stylus" scoped></style>


