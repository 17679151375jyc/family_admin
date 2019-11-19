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
            <i class="iconfont icondabiaoti"></i>
            <span>通知标题</span>
          </div>
          <div class="text">{{info.noticeTitle}}</div>
        </div>

        
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区名称</span>
          </div>
          <div class="text">{{info.plotName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>发布人</span>
          </div>
          <div class="text">{{info.realName}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>发布时间</span>
          </div>
          <div class="text">{{info.postDate|formatTime}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>状态</span>
          </div>
          <div class="text">
            <span
              :class="[info.operateStatus!=null ? operateStatusList[info.operateStatus].class : '']"
            >{{info.operateStatus!=null ? operateStatusList[info.operateStatus].name :''}}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian"></i>
            <span>图片</span>
          </div>
          <div class="text">
            <viewer :images="imgList" style="margin:10px;">
              <!-- <div :class="{'image-box':willShow}"> -->
              <div v-for="(item, index) in imgList" :key="index" class="flex-imgs">
                <div class="img-item">
                  <img :src="item" />
                </div>

                <!-- <span>{{item.title}}</span> -->
              </div>

              <!-- </div> -->
            </viewer>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconneirongguanli"></i>
            <span>通知内容</span>
          </div>
          <div class="text disClass" v-html='info.noticeContent'></div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getNoticeDetail } from "@/api/communityManage";
export default {
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
    }
  },
  data() {
    return {
      operateStatusList: this.$config.community.notice.operateStatusList,
      info: {
        noticeTitle: null, // 通知标题
        noticeContent: null, // 通知内容
        operateStatus: null, // 状态
        pictureLink: null, // 图片列表，用逗号隔开，
        plotName: null, // 小区名称
        postDate: null, // 发布时间
        realName: null // 发布人
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.getDetail();
    }
  },
  computed: {
    imgList: function() {
      let arr = [];
      if (this.info.pictureLink) {
        arr = this.info.pictureLink.split(",");
      }
      return arr;
    }
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail() {
      getNoticeDetail({
        noticeNumber: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
        }
      });
    },
    /**
     * 触发关闭操作
     */
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
.flex-imgs {
  width: 100px;
  height: 100px;
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
>>>.disClass{
  display: block!important;
}
</style>


