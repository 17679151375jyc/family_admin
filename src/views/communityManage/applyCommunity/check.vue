<!--审核-->
<template>
  <Modal
    title="审核"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
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
            <span
              :class="[info.status !=null ? statusList[info.status].class  : '']"
            >{{info.status !=null ? statusList[info.status].name : ''}}</span>
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
          <div class="text">{{info.address}}</div>
        </div>
      </div>
    </div>

    <div class="tab-title">
      <i class="iconfont iconlishixiao"></i>
      <span>该门牌号审核历史</span>
    </div>
    <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table>

    <div class="tab-title">
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
      <FormItem prop="audit" label="更改状态为">
        <Select v-model.trim="form.audit" placeholder="请选择要改变的状态" style="width:200px;">
          <Option
            v-for="item in statusList"
            :value="item.code"
            :key="item.code"
            v-show="!item.isHidden"
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
  getApplyDetail,
  updateApplyStatus,
  getManagePersonList,
  getCommunityApplyList
} from "@/api/communityManage";
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
      searchForm: {
        plotNumber: null,
        buildingNumber: null,
        doorNumber: null
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      manageList: [], //物管列表
      feedbackList: [
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
        status: null // 状态
      },
      form: {
        userid: null, //  物管id
        audit: null,
        feedback: null //不通过原因
      },
      failureList: []
    };
  },
  computed: {
    statusList: function() {
      let statusList = this.$options.filters.statusList("ApplyStatus");
      
      for (let i = 0; i < statusList.length; i++) {
        if (statusList[i].code === 0) {
          statusList[i].isHidden = true;
        } else {
            statusList[i].isHidden = false
        }
      }
      //   statusList[0].isHidden = true;
      if (this.info.status === 3) {
        // statusList[3].isHidden = true;
        for (let i = 0; i < statusList.length; i++) {
          if (statusList[i].code === 3) {
            statusList[i].isHidden = true;
          }
        }
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
        audit: [
          {
            type: "number",
            required: true,
            message: "请选择要修改的状态",
            trigger: "blur"
          }
        ],
        feedback: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (that.form.audit === 2 && that.form && !value) {
                err = "请选择不通过的原因";
              }

              callback(err);
            }
          }
        ]
      };
    },
    feedbackIsShow: function() {
      if (this.form.audit === 2) {
        // 如果状态改为审核不通过，显示反馈内容
        return true;
      } else {
        return false;
      }
    },
    tabCol: function() {
      return [
        // 表格标题栏
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center",
          indexMethod: row => {
            return row._index + 1 + (this.page.current - 1) * this.page.size;
          }
        },
        {
          title: "姓名",
          key: "realName",
          width: 100
        },
        {
          title: "电话",
          key: "phone",
          width: 100
        },
        {
          title: "审核状态",
          key: "status",
          width: 100
        },
        {
          title: "失败原因",
          key: "feedBack",
          tooltip: true,
          minWidth: 150
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      console.log(this.failureList)
      for (let i = 0; i < this.failureList.length; i++) {
        let {
          province,
          city,
          area,
          street,
          plotName,
          buildingName,
          doorName,
          phone,
          feedBack,
          realName,
          status,
          applyNumber
        } = this.failureList[i];
        // if (status == 2) {
          tabData.unshift({
            // address: province + city + area + street,
            realName,
            phone,
            status: this.statusList[status].name,
            // plotAddress: plotName + buildingName + doorName,
            feedBack
          });
        // }
      }
      return tabData;
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getDetail();
      }
    },
    "info.plotNumber": function(val, oldVal) {
      if (val) {
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
      getApplyDetail({
        applyNumber: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          console.log(this.info);
          let { plotNumber, buildingNumber, doorNumber } = this.info;
          this.searchForm = {
            plotNumber,
            buildingNumber,
            doorNumber
          };
          this.getPassDetai();
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    getPassDetai(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let { plotNumber, buildingNumber, doorNumber } = this.searchForm;
      let data = {
        pageSize: size,
        page: current,
        plotNumber,
        buildingNumber,
        doorNumber
      };
      getCommunityApplyList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              this.failureList = data.list;
              console.log(this.failureList)
            } else {
              this.failureList = [];
              this.page.total = 0;
            }
          }
        })
        .catch(err => {
          this.tabIsLoading = false;
        });
    },
    changeStatus(status) {
      if (status === 3 && !this.info.remarkReason) {
        // status为1即通过，为2不通过
        this.$Message.error("请填写审核不通过的原因备注");
      } else {
        this.subIsShow = true;
        let { id, status, feedback } = this.form;
        updateApplyStatus({
          status: status,
          remark: remarkReason,
          number: number
        })
          .then(({ data, errorCode }) => {
            this.subIsShow = false;
            if (errorCode === 0) {
              this.$Message.success("修改成功");
              this.$emit("handleClose", true);
            }
          })
          .catch(() => {
            this.subIsShow = false;
          });
      }
    },
    /**
     * 获取该小区下的物管
     */
    getManagePersonList() {
      this.manageList = []; // 清空物管列表
      getManagePersonList({
        plotNumber: this.info.plotNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.manageList = data;
          console.log(data);
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
          let { applyNumber } = this.info;
          let { userid, audit, feedback } = this.form;
          updateApplyStatus({
            applyId: applyNumber,
            userid,
            audit,
            feedback
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
</style>


