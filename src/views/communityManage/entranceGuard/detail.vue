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
            <i class="iconfont iconyonghu"></i>
            <span>真实姓名</span>
          </div>
          <div class="text">{{info.contactName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>住户类型</span>
          </div>
          <div class="text">{{info.contactRelation}}</div>
        </div>
      </div>

      <!-- <div class="row">
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
        <div class="item">
          <div class="label">
            <i class="iconfont iconshenhe"></i>
            <span>审核人</span>
          </div>
          <div
            class="text"
          >{{info.reviewerName}}</div>
        </div>
      </div>-->
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区楼座</span>
          </div>
          <div class="text">{{`${info.plotName||''}${info.buildingName||''}${info.doorName||''}`}}</div>
        </div>
        <!-- <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>人脸类型</span>
          </div>
          <div class="text">{{info.faceType}}</div>
        </div>-->
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>更新时间</span>
          </div>
          <div class="text">{{info.lastUpdate|formatTime}}</div>
        </div>
      </div>
      <!-- <div class="row">
          <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>更新时间</span>
          </div>
          <div
            class="text"
          >{{info.lastUpdate|formatTime}}</div>
        </div>
      </div>-->
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>人脸图像</span>
          </div>
          <div class="text">
            <viewer :images="[info.facePicture]" style="margin:10px;">
              <div class="flex-imgs">
                <div class="img-item">
                  <img :src="info.facePicture" />
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
import { getFaceDetail } from "@/api/communityManage";
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
      statusList: this.$config.community.entranceGuard.status,
      subIsShow: false,
      info: {
        buildingName: null,
        contactName: null,
        contactRelation: null,
        doorName: null,
        facePicture: null,
        faceType: null,
        lastUpdate: null,
        plotName: null,
        status: null,
        reviewerName: null // 审核人
      }
    };
  },
  computed: {
    rules: function() {
      console.log(this.form);
      return {
        userid: [
          {
            required: true,
            message: "请选择审核人",
            trigger: "blur"
          }
        ],
        audit: [
          {
            required: true,
            message: "请选择要修改的状态",
            trigger: "blur"
          }
        ],
        feedback: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (that.form.status === that.statusList[2].value) {
                err = "请选择不通过的原因";
              }

              callback(err);
            }
          }
        ]
      };
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
      getFaceDetail({
        faceNumber: this.number
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
.viewer-canvas{
  z-index: 100000!important;
}
</style>


