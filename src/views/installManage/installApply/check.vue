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
            <i class="iconfont iconfl-xiaoshoudan"></i>
            <span>公司名称</span>
          </div>
          <div class="text">{{info.companyName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>用户名</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconId"></i>
            <span>身份证号</span>
          </div>
          <div class="text">{{info.credentialNo}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont icondianshi-f"></i>
            <span>小区名称</span>
          </div>
          <div class="text">{{info.plotName ? info.plotName : '无'}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>省市区街道</span>
          </div>
          <div class="text">{{info.province}}{{info.city}}{{info.area}}{{info.street}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>详细地址</span>
          </div>
          <div class="text">{{info.detailedAddress}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>联系电话</span>
          </div>
          <div class="text">{{info.contactPhone}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>状态</span>
          </div>
          <div class="text">
            <span>{{info.state | statusName('ApplyInstallState')}}</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>业务员姓名</span>
          </div>
          <div class="text">{{info.fsUserName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>业务员电话</span>
          </div>
          <div class="text">{{info.fsUserPhone}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconlingdaitie3"></i>
            <span>业务类型</span>
          </div>
          <div class="text">{{info.businessType | statusName('BusinessType')}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhifufangshi"></i>
            <span>支付方式</span>
          </div>
          <div class="text">{{info.settleAccountsType == 1?'微信支付':'支付宝支付'}}</div>
        </div>
        <!-- <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>收款类型</span>
          </div>
          <div
            class="text"
          >{{info.settleAccountsType ? $config.installManage.installApply.settleAccountsType[info.settleAccountsType].name : ''}}</div>
        </div>-->
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconliwu--"></i>
            <span>套餐名</span>
          </div>
          <div class="text">{{info.applyPackage?info.applyPackage.name:''}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhifu"></i>
            <span>是否支付</span>
          </div>
          <div class="text">{{info.isPay ? '是':'否'}}{{ info.testType ?'（测试）':'（正式）'}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>发票金额(元)</span>
          </div>
          <div class="text">{{info.invoiceAmount ? info.invoiceAmount.toFixed(2) : ''}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>押金</span>
          </div>
          <div class="text">{{info.deposit?info.deposit.toFixed(2):''}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>总金额</span>
          </div>
          <div class="text">{{info.orderPrice?info.orderPrice.toFixed(2):''}}</div>
        </div>
        <!-- <div class="item">
          <div class="label">
            <i class="iconfont iconmiaoshu"></i>
            <span>备注</span>
          </div>
          <div class="text">{{ info.remark }}</div>
        </div>-->
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>创建时间</span>
          </div>
          <div class="text">{{info.createTime|formatTime}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>更新时间</span>
          </div>
          <div class="text">{{info.updateTime|formatTime}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshebei"></i>
            <span>套餐设备</span>
          </div>
          <div class="text">
            <Table
              border
              stripe
              highlight-row
              :columns="packageCol"
              :data="packageData"
              style="margin: 10px 0;width:100%;"
            ></Table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshebei"></i>
            <span>新增设备</span>
          </div>
          <div class="text">
            <Table
              border
              stripe
              highlight-row
              :columns="tabCol"
              :data="tabData"
              style="margin: 10px 0;width:100%;"
            ></Table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshebei"></i>
            <span>补充设备</span>
          </div>
          <div class="text">
            <Table
              border
              stripe
              highlight-row
              :columns="supplementCol"
              :data="supplementData"
              style="margin: 10px 0;width:100%;"
            ></Table>
          </div>
        </div>
      </div>
      <!-- <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshebei"></i>
            <span>设备列表</span>
          </div>
          <div class="text">
            <Table
              border
              stripe
              highlight-row
              :columns="tabCol"
              :data="tabData"
              style="margin: 10px 0;"
            ></Table>
          </div>
        </div>
      </div>-->
    </div>

    <!-- <div class="tab-title">
        <i class="iconfont iconlishixiao"></i>
        <span>审核历史</span>
      </div>
      <Table
        border
        stripe
        highlight-row
        :loading="tabIsLoading"
        :columns="tabCol"
        :data="tabData"
    ></Table>-->

    <div class="tab-title">
      <i class="iconfont iconshenhe"></i>
      <span>审核操作</span>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100" style="margin-top:30px;">
      <FormItem prop="state" label="更改状态为">
        <Select v-model.trim="form.state" placeholder="请选择要改变的状态" style="width:200px;">
          <Option
            v-for="(item, key, index) in statusList"
            :key="index"
            :value="item.code"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem required prop="feedback" label="不通过原因" v-show="feedbackIsShow">
        <Input
          type="textarea"
          :autosize="{minRows: 3,maxRows: 4}"
          v-model.trim="form.feedback"
          placeholder="请填写不通过原因"
          clearable
        />
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

    <!-- 打印领料-start -->
    <receive :id="id" :isShow="isShow"></receive>
    <!-- <receive v-if="info.state>2" :id="id" :isShow="isShow"></receive> -->
    <!-- 打印领料-end -->
  </Modal>
</template>
<script>
import { getApplyDetail, toExamineApply } from "@/api/installManage";
import { mapState } from "vuex";
import Receive from "./receive/receive";
let that;
export default {
  components: {
    Receive
  },
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
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      receive: {
        isShow: false
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      subIsShow: false,
      info: {
        companyName: "", // 公司名称
        applyDevices: [], // 新增设备列表
        otherApplyDevices: [], //补充设备
        applyPackage: {
          applyDevices: []
        }, //套餐设备
        name: null, // 用户名
        province: null, // 省
        city: null, // 市
        area: null, // 区
        street: null, // 街道
        detailedAddress: null, // 详细地址
        bankAccountName: null, // 开户名
        bankAccountNo: null, // 银行账号
        bankName: null, // 银行名
        businessNo: null, //业务员编号
        businessType: null, //业务类型1家庭网关+安防设备 2加装安防
        contactPhone: null, // 联系电话
        createTime: null, //创建时间
        credentialNo: null, // 身份证号码
        invoiceAmount: null, // 发票金额
        saleChannel: null, // 销售渠道
        settleAccountsType: null, //收款类型1.押金 2购销 3押金+增配购销
        state: null, // 状态0草稿 1申请 2正在出货 100完成
        tvNo: null, // 电视编号
        updateTime: null,
        withholdAccountType: null, //代扣帐号类型1.新增/更改帐号 2.使用原帐号
        deposit: null, // 押金
        isPay: null, //是否支付
        orderPrice: null, //总金额
        testType: null, //是否测试（true为测试，false为正式）
        remark: null, //备注
        settleAccountsType: null //支付类型
      },
      form: {
        id: null,
        state: null,
        feedback: null //不通过原因
      }
    };
  },
  computed: {
    statusList: function() {
      let ApplyInstallState = this.$options.filters.statusList(
        "ApplyInstallState"
      );
      let statusList = [];
      //   statusList[0].isHidden = true;
      for (let i = 0; i < ApplyInstallState.length; i++) {
        if (
          ApplyInstallState[i].code === 2 ||
          ApplyInstallState[i].code === 3
        ) {
          statusList.push(ApplyInstallState[i]);
        }
      }
      return statusList;
    },
    rules: function() {
      return {
        state: [
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
              if (this.form.state === 2 && !value) {
                err = "请选择不通过的原因";
              }
              callback(err);
            }
          }
        ]
      };
    },
    feedbackIsShow: function() {
      if (this.form.state === 2) {
        // 如果状态改为审核不通过，显示反馈内容
        return true;
      } else {
        return false;
      }
    },
    tabCol: function() {
      return [
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center"
        },
        {
          title: "设备名称",
          key: "name",
          minWidth: 150
        },
        {
          title: "数量",
          key: "num",
          width: 100
        },
        {
          title: "总价",
          key: "price",
          width: 100
        }
      ];
    },
    tabData: function() {
      let data = [];
      for (let i = 0; i < this.info.applyDevices.length; i++) {
        let { name, num, price } = this.info.applyDevices[i];
        data.push({
          name,
          num,
          price: price ? price.toFixed(2) : ""
        });
      }
      return data;
    },
    packageCol() {
      return [
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center"
        },
        {
          title: "设备名称",
          key: "name",
          minWidth: 150
        },
        {
          title: "数量",
          key: "num",
          width: 100
        },
        {
          title: "总价",
          key: "price",
          width: 100
        }
      ];
    },
    packageData() {
      let data = [];
      if (this.info.applyPackage) {
        for (let i = 0; i < this.info.applyPackage.applyDevices.length; i++) {
          let { name, num, price } = this.info.applyPackage.applyDevices[i];
          data.push({
            name,
            num,
            price: price ? price.toFixed(2) : ""
          });
        }
      }
      return data;
    },
    supplementCol() {
      return [
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center"
        },
        {
          title: "设备名称",
          key: "name",
          minWidth: 150
        },
        {
          title: "数量",
          key: "num",
          width: 100
        },
        {
          title: "总价",
          key: "price",
          width: 100
        }
      ];
    },
    supplementData() {
      let data = [];
      console.log(this.info.otherApplyDevices);
      if (this.info.otherApplyDevices) {
        for (let i = 0; i < this.info.otherApplyDevices.length; i++) {
          for (let j = 0; j < this.info.otherApplyDevices[i].list.length; j++) {
            let { name, num, price } = this.info.otherApplyDevices[i].list[j];
            data.push({
              name,
              num,
              price: price ? price.toFixed(2) : ""
            });
          }
        }
        return data;
      } else {
        return [];
      }
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
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
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (data) {
            this.info = data;
            let { id, state } = data;
            this.form = {
              id,
              state
            };
          }
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { id, state, feedback } = this.form;
          let data = {
            id,
            state
          };
          if (state == 2) {
            let checkRemark = feedback;
            Object.assign(data, { checkRemark });
          }
          toExamineApply(data)
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
.tab-wrapper .row .item .label {
  flex: 0 0 140px;
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
</style>


