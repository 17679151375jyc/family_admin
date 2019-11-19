<template>
  <Modal
    title="详情"
    footer-hide
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
            <i class="iconfont iconfl-xiaoshoudan"></i>
            <span>公司名称</span>
          </div>
          <div class="text">{{info.companyName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont icondianshi-f"></i>
            <span>电视编号</span>
          </div>
          <div class="text">{{info.tvNo ? info.tvNo : '无'}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>用户名</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconId"></i>
            <span>身份证号</span>
          </div>
          <div class="text">{{info.credentialNo}}</div>
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
        </div>         -->
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
        </div>  -->        
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
    </div>

    <!-- 打印领料-start -->
    <receive :id="id" :isShow="isShow"></receive>
    <!-- <receive v-if="info.state>2" :id="id" :isShow="isShow"></receive> -->
    <!-- 打印领料-end -->
  </Modal>
</template>
<script>
import { getApplyDetail } from "@/api/installManage";
import { mapState } from "vuex";
import Receive from "./receive/receive";
export default {
  components: {
    Receive
  },
  props: {
    id: {
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
      BusinessType: this.$options.filters.statusList("BusinessType"),
      receive: {
        isShow: false
      },
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
        businessNo: null, //
        fsUserName: null,//业务员姓名
        fsUserNumber: null, //业务员编号
        fsUserPhone: null,//业务员电话
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
        deposit: null,  // 押金
        isPay: null,  //是否支付
        orderPrice: null, //总金额
        testType: null,//是否测试（true为测试，false为正式）
        remark: null,//备注
        settleAccountsType: null,//支付类型
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.getDetail();
    }
  },
  computed: {
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
        let {
          name,
          num,
          price
        } = this.info.applyDevices[i]
        data.push({  
          name,        
          num,
          price: price ? price.toFixed(2):''
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
          let {
            name,
            num,
            price
          } = this.info.applyPackage.applyDevices[i]
          data.push({  
            name,        
            num,
            price: price ? price.toFixed(2):''
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
      if(this.info.otherApplyDevices){
        for (let i = 0; i < this.info.otherApplyDevices.length; i++) {
          for (let j = 0; j < this.info.otherApplyDevices[i].list.length; j++) {
            let {
              name,
              num,
              price
            } = this.info.otherApplyDevices[i].list[j]
            data.push({  
              name,        
              num,
              price: price ? price.toFixed(2):''
            });
          }
        }
        return data;
      }else{
        return [];
      }
    }
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getApplyDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          console.log(data);
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
.tab-wrapper .row .item .label {
  flex: 0 0 140px;
}

.but_top {
  margin-top: 30px;
}

.but_button {
  float: right;
}
</style>


