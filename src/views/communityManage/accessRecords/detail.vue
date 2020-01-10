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
            <i class="iconfont iconjianzhuwu"></i>
            <span>社区名称</span>
          </div>
          <div class="text">{{info.plotName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>楼座</span>
          </div>
          <div class="text">{{info.buildingName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconmenchuangmenchuangwujinanzhuang"></i>
            <span>业主户号</span>
          </div>
          <div class="text">{{info.doorName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>位置</span>
          </div>
          <div class="text">{{info.positionName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconwenhao"></i>
            <span>是否开门</span>
          </div>
          <div class="text">{{$options.filters.statusName(info.openStatus, "OpenStatus")}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>记录类型</span>
          </div>
          <div class="text">{{ $options.filters.statusName(info.openType, "OpenType")}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-guibingjiedian"></i>
            <span>出入类型</span>
          </div>
          <div class="text">{{info.recordType | statusName('RecordType')}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>姓名</span>
          </div>
          <div class="text">{{info.roleName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>业主姓名</span>
          </div>
          <div class="text">{{info.realName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>业主电话</span>
          </div>
          <div class="text">{{info.phone}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiaoseguanli"></i>
            <span>角色</span>
          </div>
          <div class="text">{{$options.filters.statusName(info.roleType ,"RelationType")}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>出入时间</span>
          </div>
          <div class="text">{{$options.filters.formatTime(info.triggeringTime)}}</div>
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
        doorName: null,
        positionName: null,
        openStatus: null,
        openType: null,
        recordType: null,
        roleName: null,
        realName: null,
        phone: null,
        roleType: null,
        triggeringTime: null,
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


