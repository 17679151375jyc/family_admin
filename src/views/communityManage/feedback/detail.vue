<template>
  <Modal
    :title="title"
    :footer-hide='!feedbackShow'
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
            <span>小区名称</span>
          </div>
          <div class="text">{{info.plotName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconicon-test"></i>
            <span>楼座门号</span>
          </div>
          <div class="text">{{info.buildingName + info.doorName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>用户姓名</span>
          </div>
          <div class="text">{{info.realName || '暂无'}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>用户手机</span>
          </div>
          <div class="text">{{info.userPhone}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchayueyuanjuan"></i>
            <span>查阅人</span>
          </div>
          <div class="text">{{info.auditReader || '未查阅'}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>反馈时间</span>
          </div>
          <div class="text">{{info.postDate|formatTime}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>处理状态</span>
          </div>
          <div class="text">{{info.complete ? '已处理' : '未处理'}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>反馈类型</span>
          </div>
          <div class="text">{{info.feedbackType!=null ? typeList[info.feedbackType].name : ''}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconneirongguanli"></i>
            <span>查阅内容</span>
          </div>
          <div class="text">{{info.feedback}}</div>
        </div>
      </div>
      <div class="row" v-if='!feedbackShow'>
        <div class="item">
          <div class="label">
            <i class="iconfont iconneirongguanli"></i>
            <span>处理意见</span>
          </div>
          <div class="text">{{info.auditAdvice}}</div>
        </div>
      </div>
    </div>
    <div class="tab-title" v-if='feedbackShow'>
      <i class="iconfont iconfankui"></i>
      <span>反馈处理</span>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100" style="margin-top:30px;"  v-if='feedbackShow'>
      <FormItem prop="userNumber" label="处理人">
        <Select v-model.trim="form.userNumber" placeholder="请选择处理人" style="width: 200px;">
          <Option
            v-for="(item, index) in manageList"
            :key="index"
            :value="item.userNumber"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="feedback" label="处理意见">
        <Input type='textarea' show-word-limit maxlength="100" v-model.trim="form.feedback" placeholder="请填写处理意见" style="width: 200px;"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getFeedbackDetail, processFeedback, getManagePersonList } from "@/api/communityManage";
export default {
  props: {
    feedbackNumber: {
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
      subIsShow: false,
      title:"详情",
      manageList: [],//物管理表
      feedbackShow: false,
      form: {
        userNumber: null,
        feedback: null
      },
      rules: {
        feedback: [
          {
            required: true,
            message: "请填写反馈内容",
            trigger: "blur"
          }
        ],
        userNumber: [
          {
            required: true,
            message: "请选择查阅人",
            trigger: "blur"
          }
        ]
      },
      typeList: this.$config.community.feedback.type,
      info: {
        auditAdvice: null,//处理意见
        auditReader: null, // 查询人
        auditStatus: null, // 是否已查询
        buildingName: null, // 楼座
        buildingNumber: null, // 楼座number
        doorName: null, // 门号
        doorNumber: null, // 门号number
        feedback: null, // 反馈内容
        feedbackNumber: null,
        feedbackType: null, // 反馈类型
        pics: null, // 反馈图片
        plotName: null, //小区名称
        plotNumber: null,
        postDate: null, // 时间
        realName: null, //真实姓名
        userNumber: null,
        userPhone: null // 用户手机
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getFeedbackDetail({
        feedbackNumber: this.feedbackNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          console.log(data)
          if(data.auditStatus == 0){
            this.title = "处理"
            this.feedbackShow = true
            this.getManagePersonList(data.plotNumber);
          }else{
            this.title = "详情"
            this.feedbackShow = false
          }
        }
      });
    },
    /**
     * 获取该小区下的物管
     */
    getManagePersonList(val) {
      this.manageList = []; // 清空物管列表
      getManagePersonList({
        plotNumber: val
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.manageList = data;
        }
      });
    },
    submit(){
      this.$refs["form"].validate(async valid => {
        if(valid){
          this.subIsShow = true;
          let { userNumber, feedback } = this.form
          processFeedback({
            feedbackNumber: this.feedbackNumber,
            auditNumber: userNumber,
            auditAdvice: feedback,
            complete: true
          }).then(({data, errorCode})=>{
            this.subIsShow = false;
            if (errorCode === 0) {
              this.$Message.success("处理成功");
              this.$emit("handleClose", true);
            }
          })
          .catch(() => {
            this.subIsShow = false;
          });
        }else {
          this.$Message.error("提交信息有误");
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
>>>.amap-icon img {
  width: 25px;
  height: 34px;
}

>>>.amap-marker-label {
  border: 0;
  background-color: transparent;
}

>>>.info {
  position: relative;
  top: 10px;
  right: -55px;
  min-width: 0;
  background: #fff;
  padding: 4px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}
</style>


