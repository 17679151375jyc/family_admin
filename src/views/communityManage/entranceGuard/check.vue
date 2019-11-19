<!--审核-->
<template>
  <Modal
    title="审核"
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
            <span>真实姓名</span>
          </div>
          <div class="text">{{info.contactName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>联系电话</span>
          </div>
          <div class="text">{{info.contactPhone}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconhezuoguanxi"></i>
            <span>关系</span>
          </div>
          <div class="text">{{info.contactRelation}}</div>
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
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区楼座</span>
          </div>
          <div class="text">{{info.plotName+info.buildingName+info.doorName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconrenlianshibie"></i>
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
    <div  class="tab-title">
      <i class="iconfont iconshenhe"></i>
      <span>审核操作</span>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100" style="margin-top:30px;">
      <FormItem prop="userid" label="审核人">
        <Select v-model.trim="form.userid" placeholder="请选择审核人" style="width: 200px;">
          <Option
            v-for="(item, index) in manageList"
            :key="index"
            :value="item.userNumber"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="status" label="更改状态为">
        <Select v-model.trim="form.status" placeholder="箐选择要改变的状态" style="width:200px;">
          <Option
            v-for="(item, key, index) in statusList"
            :key="index"
            :value="index"
            v-show="index!=0"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="feedback" label="不通过原因" v-show="feedbackIsShow">
        <Select v-model.trim="form.feedback" placeholder="请选择不通过原因" clearable style="width:200px;">
          <Option
            v-for="(item, index) in feedbackList"
            :key="index"
            :value="item.value"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
      <!-- 更改状态为：
      <Button type="info" @click="changeStatus(3)" v-if="info.status !== 3" :loading="subIsShow">审核中</Button>
      <Button type="error" @click="changeStatus(2)" :loading="subIsShow">不通过</Button>
      <Button type="success" @click="changeStatus(1)" :loading="subIsShow">通 过</Button>-->
    </div>
  </Modal>
</template>
<script>
import {
  getFaceDetail,
  updateFacekStatus,
  getManagePersonList
} from "@/api/communityManage";
let that;
export default {
  props: {
    faceNumber: {
      // 人脸number
      type: String,
      default: ""
    },
    plotNumber: {
      // 小区number
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
          label: "图片模糊不清",
          value: "图片模糊不清"
        },
        {
          label: "无法确认人脸真实性",
          value: "无法确认人脸真实性"
        },
        {
          label: "其它原因，请自行联系物管",
          value: "其它原因，请自行联系物管"
        }
      ],
      subIsShow: false,
      info: {
        buildingName: null,
        contactName: null,
        contactRelation: null,
        contactPhone: null,
        doorName: null,
        facePicture: null,
        faceType: null,
        lastUpdate: null,
        plotName: null,
        status: null
      },
      form: {
        userid: null, //  物管id
        status: null,
        feedback: null //不通过原因
      }
    };
  },
  computed: {
    statusList: function() {
      let statusList = this.$config.community.entranceGuard.status;
      statusList[0].isHidden = true;
      if (this.info.status === statusList[3]) {
        statusList[3].isHidden = true;
      }
      return statusList;
    },
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
        status: [
          {
            type: "number",
            required: true,
            message: "请选择要修改的状态",
            trigger: "blur"
          }
        ],
        feedback: [
          {
            validator:(rule, value, callback, source, options)=> {
              let err = [];
              if (
                that.form.status === that.statusList[2].value &&
                that.form &&
                !value
              ) {
                err = "请选择不通过的原因";
              }
              callback(err);
            }
          }
        ]
      };
    },
    feedbackIsShow: function() {
      if (this.form.status === this.statusList[2].value) {
        // 如果状态改为审核不通过，显示反馈内容
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
          this.$refs['form'].resetFields()
        this.getDetail();
        this.getManagePersonList();
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
        faceNumber: this.faceNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * 获取该小区下的物管
     */
    getManagePersonList() {
      this.manageList = []; // 清空物管列表
      getManagePersonList({
        plotNumber: this.plotNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.manageList = data;
        }
      });
    },
    /**
     * 提交数据
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsShow = true;
          let { userid, status, feedback } = this.form;
          let reviewerName
          for (let i = 0; i < this.manageList.length; i++) {
              if (userid == this.manageList[i].userNumber) {
                  reviewerName = this.manageList[i].name
              }
          }
          updateFacekStatus({
            faceNumber: this.faceNumber,
            status,
            feedback,
            userid,
            reviewerName
          })
            .then(({ data, errorCode }) => {
              this.subIsShow = false;
              if (errorCode === 0) {
                this.$Message.success("审核成功");
                this.$emit("handleClose", true);
              }
            })
            .catch(() => {
              this.subIsShow = false;
            });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
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
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>


