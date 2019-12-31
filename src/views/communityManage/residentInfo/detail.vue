<!--审核-->
<template>
  <Modal
    title="详情"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    footer-hide
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
            >{{info.status | statusName('DomicileStatus')}}</span>
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
            <span>审核时间</span>
          </div>
          <div class="text">{{info.applyTime|formatTime}}</div>
        </div>
      </div>

      

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>省市区</span>
          </div>
          <div class="text">{{info.provinceName+info.cityName+info.areaName+info.streetName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区楼座</span>
          </div>
          <div
            class="text"
          >{{info.plotName + (info.buildingName ? info.buildingName+info.doorName:'')}}</div>
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
        <div class="item">
          <div class="label">
            <i class="iconfont iconwenhao"></i>
            <span>是否业主</span>
          </div>
          <div class="text">
            <span
              :class="[info.isOwner ? 'cell-info' : 'cell-error']"
            >{{info.isOwner ? '业主' : '否'}}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>邀请人</span>
          </div>
          <div class="text">{{info.inviterName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>邀请人手机</span>
          </div>
          <div class="text">{{info.inviterPhone}}</div>
        </div>
      </div>
    </div>

    <Tabs name="residentInfoTabs" style="margin-top:30px;">
      <TabPane label="门户成员" tab="residentInfoTabs" icon="null iconfont iconjiaren1">
        <member :doorNumber="info.doorNumber"></member>
      </TabPane>
      <TabPane label="门卡管理" tab="residentInfoTabs" icon="null iconfont iconhuabanfuben">
        <door-card
          :plotNumber="info.plotNumber"
          :domicileNumber="info.domicileNumber"
          :buildingNumber="info.buildingNumber"
          :buildingName="info.buildingName"
          :doorNumber="info.doorNumber"
          :doorName="info.doorName"
        ></door-card>
      </TabPane>
    </Tabs>
  </Modal>
</template>
<script>
import { getResidentDetail } from "@/api/communityManage";
import Member from "./member/member";
import DoorCard from "./doorCard/doorCard";
let that;
export default {
  components: {
    Member,
    DoorCard
  },
  props: {
    domicileNumber: {
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
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      list: [],
      searchForm: {
        plotNumber: null,
        buildingNumber: null,
        doorNumber: null
      },
      tabIsLoading: false,
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
      statusList: this.$config.community.residentInfo.status,
      subIsShow: false,
      info: {
        streetName: null, //街道
        address: null, // 地址
        applyTime: null, // 申请时间
        areaName: null, // 区域
        buildingName: null, //楼座
        cityName: null, // 市
        doorName: null, //门号
        id: null, // id
        identityCard: null, // 身份证
        phone: null, // 电话
        plotName: null, // 小区名
        provinceName: null, // 省
        realName: null, // 真实姓名
        sex: null, // 0女，1男
        status: null, // 状态
        feedback: null // 反馈信息
      }
    };
  },
  computed: {
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
          title: "性别",
          key: "sex",
          width: 100
        },
        {
          title: "电话",
          key: "phone",
          minWidth: 120
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      console.log(this.list);
      for (let i = 0; i < this.list.length; i++) {
        let { realName, sex, phone } = this.list[i];
        tabData.push({
          realName,
          sex: sex ? "男" : "女",
          phone
        });
      }
      return tabData;
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
      getResidentDetail({
        domicileNumber: this.domicileNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          console.log(this.info);
          let { plotNumber, buildingNumber, doorNumber } = this.info;
          this.searchData = {
            plotNumber,
            buildingNumber,
            doorNumber
          };
          //   this.getPassDetai();
        }
      });
    },
    // getPassDetai(searchData = this.searchForm) {
    //   this.tabIsLoading = true;
    //   let { size, current } = this.page;
    //   let { plotNumber, buildingNumber, doorNumber } = this.searchData;
    //   let data = {
    //     pageSize: size,
    //     page: current,
    //     plotNumber,
    //     buildingNumber,
    //     doorNumber
    //   };
    //   console.log(data);
    //   getResidentList(data)
    //     .then(({ data, errorCode }) => {
    //       this.tabIsLoading = false;
    //       if (errorCode === 0) {
    //         if (data.list) {
    //           this.list = data.list;
    //         } else {
    //           this.list = [];
    //           this.page.total = 0;
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       this.tabIsLoading = false;
    //     });
    // },
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

>>>.ivu-icon-null {
  font-size: 14px;
}
</style>


