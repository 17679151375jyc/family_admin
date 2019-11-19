<!--审核-->
<template>
  <Modal
    title="详情"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    footer-hide
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
            <span>来访楼座</span>
          </div>
          <div class="text">{{info.plotName+info.buildingName+info.doorName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>当前状态</span>
          </div>
          <div class="text">
            <span
              :class="[info.status !=null ? statusList[info.status].class  : '']"
            >{{info.status !=null ? statusList[info.status].name : ''}}</span>
          </div>
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
            <i class="iconfont iconyonghu"></i>
            <span>访客姓名</span>
          </div>
          <div class="text">{{info.visitorName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>访客电话</span>
          </div>
          <div class="text">{{info.visitorPhone}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconxingbie"></i>
            <span>访客性别</span>
          </div>
          <div class="text">{{info.visitorSex ? '男' : '女'}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconhezuoguanxi"></i>
            <span>同行人数</span>
          </div>
          <div class="text">{{info.visitorQuantity}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>来访时间</span>
          </div>
          <div class="text">{{info.startTime|formatTime}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>离开时间</span>
          </div>
          <div class="text">{{info.endTime|formatTime}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconId"></i>
            <span>身份证号</span>
          </div>
          <div class="text">{{info.identifyCard}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian"></i>
            <span>身份证</span>
          </div>
          <div class="text">
            <viewer :images="[info.facadePicture]"  style="margin:10px;">
              <div class="flex-imgs">
                <div class="img-item" >
                  <img :src="info.facadePicture ? info.facadePicture :  require('@/assets/images/none.png')" />
                </div>
                <span style="font-size: 12px;">点击图片查看大图</span>
              </div>
            </viewer>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getVisitorDetail } from "@/api/communityManage";
let that;
export default {
  props: {
    visitorNumber: {
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
      statusList: this.$config.community.visitor.status,
      subIsShow: false,
      info: {
        plotName: null, // 小区名
        buildingName: null, // 楼座名
        doorName: null, // 门号
        identifyCard: null, // 身份证号
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        visitorName: null, // 访客姓名
        visitorPhone: null, // 访客电话
        visitorQuantity: null, // 访客数量
        visitorSex: null, // 访客性别
        facadePicture: null, // 身份证号
        phone: null, // 业主电话
        realName:null, // 业主姓名
      }
    };
  },
  computed: {},
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
      getVisitorDetail({
        visitorNumber: this.visitorNumber
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

.img-div {
  display: flex;
  width: 250px;
  height: 250px;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>


