<!--审核-->
<template>
  <Modal
    title="详情"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    footer-hide
    width="900"
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
            <i class="iconfont iconshouji"></i>
            <span>手机号</span>
          </div>
          <div class="text">{{info.phone}}，紧急电话：{{info.telephone}}</div>
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
            <i class="iconfont iconxingbie"></i>
            <span>性别</span>
          </div>
          <div class="text">{{info.gender ? '男' : '女'}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>状态</span>
          </div>
          <div
            class="text"
            :class="statusClass[info.status]"
          >{{info.status!==null ? statusList[info.status] : ''}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>省市区街道</span>
          </div>
          <div
            class="text"
          >{{info.province ? (info.province + '' + info.city + '' + info.area + '' + (info.street ? info.street:'')) : '无'}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>详细地址</span>
          </div>
          <div class="text">{{info.address || '无'}}</div>
        </div>
        <div class="item">
            <div class="label">
                <i class="iconfont iconshijian"></i>
                <span>注册时间</span>
            </div>
            <div class="text">
                {{$moment(info.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}
            </div>
        </div>
      </div>
      <div class="row" v-if="info.captainName">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>所属队长</span>
          </div>
          <div class="text">{{info.captainName}}</div>
        </div>
        <div class="item">
            <div class="label">
                <i class="iconfont iconshijian"></i>
                <span>更新时间</span>
            </div>
            <div class="text">
                {{$moment(info.updateTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}
            </div>
        </div>
      </div>

      <div class="row work-row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconlingdaitie3"></i>
            <span>职务名称</span>
          </div>
          <div class="text">{{info.roles.join('、')}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icongongsi"></i>
            <span>公司名称</span>
          </div>
          <div class="text">{{info.companyName}}</div>
        </div>
      </div>
      <div class="row" v-if="info.security">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>安保区域</span>
          </div>
          <div class="text"><Tree :data="securityTree"></Tree></div>
        </div>
      </div>
      <div class="row" v-if="info.maintenance">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>维保区域</span>
          </div>
          <div class="text"><Tree :data="maintainTree"></Tree></div>
        </div>
      </div>
      <div class="row" v-if="info.propertyManage">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>物管小区</span>
          </div>
          <div class="text">
              <span
              v-for="(item , index) in (info.propertyPlotName ? info.propertyPlotName.split(',') : [])"
              :key="index"
            >
              {{info.propertyPCA + ' ' + item}}
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian"></i>
            <span>证件图片</span>
          </div>
          <div class="text" :class="statusClass[info.status]">
            <viewer :images="imgList" style="margin:10px;">
              <!-- <div :class="{'image-box':willShow}"> -->
              <div v-for="(item, index) in imgList" :key="index" class="flex-imgs">
                <div class="img-item">
                  <img :src="item.url" :alt="item.title" />
                </div>

                <span>{{item.title}}</span>
              </div>

              <!-- </div> -->
            </viewer>
          </div>
        </div>
      </div>
      <div class="row" v-if="info.remark && info.status">
        <div class="item">
          <div class="label">
            <i class="iconfont iconxiaoxi2"></i>
            <span>审核备注</span>
          </div>
          <div class="text">{{info.remark}}</div>
        </div>
      </div>
    </div>

    <div class="tab-title" style="margin-bottom:10px;" v-if="info.captain!=0">
      <i class="iconfont iconyonghu"></i>
      <span>下属队员</span>
    </div>
    <Table border stripe highlight-row :columns="tabCol" :data="tabData" v-if="info.captain!=0"></Table>
  </Modal>
</template>
<script>
import { getServerUserList, getServerDetail } from "@/api/userManage";
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
      subIsShow: false,
      statusList: {
        "-1": "未提交资料",
        "0": "等待审核",
        "1": "审核中",
        "2": "审核通过",
        "3": "审核不通过"
      },
      statusClass: {
        "-1": "cell-sub-title",
        "0": "cell-title",
        "1": "cell-info",
        "2": "cell-success",
        "3": "cell-error"
      },
      info: {
        captainName: null, // 所属队长
        remarkReason: null, // 审核不通过原因
        number: null,
        telephone: null, // 电话
        realName: null, // 真实姓名
        captain: null, // 是否队长，0否1是
        province: null, //省
        city: null, // 市
        area: null, //区
        street: null, // 街道
        address: null, //详细地址
        gender: null, // 0男，1女
        headPortrait: null, // 头像
        id: null, // id
        identityCard: null, //身份证号码

        maintenance: null, // 是否维保人员, 0否，1是
        maintenCompany: null, //所属维保公司
        maintenancePCA: null, // 负责维保的小区的省市区
        maintenancePlotName: null, // 负责维保的小区的名称
        propertyManage: null, // 是否物管人员，0否，1是
        manageCompany: null, // 所属物管公司，0否，1是
        propertyPCA: null, // 负责物管的小区的省市区
        propertyPlotName: null, // 负责物管的小区的名称
        picFace: null, // 人脸图片
        picIdcardFront: null, //身份证正面
        picIdcardBack: null, //身份证背面
        picNocriminal: null, //无犯罪记录证明
        remark: null, //备注
        security: null, //是否保安，0否，1是，
        securityCompany: null, // 保安公司,
        securityPCA: null, // 负责保安的小区的省市区
        securityPlotName: null, // 负责保安的小区
        status: null,
        roles: [] // 角色，安保、维保、物管
      },
      memberList: [] // 下属队员
    };
  },
  computed: {
    imgList: function() {
      let imgList = [];
      if (this.info.propertyManage === 1) {
        imgList = [
          {
            url: this.info.picFace,
            title: "人脸图像"
          }
        ];
      } else {
        imgList = [
          {
            url: this.info.picFace,
            title: "人脸图像"
          },
        //   {
        //     url: this.info.picIdcardFront,
        //     title: "身份证正面"
        //   },
        //   {
        //     url: this.info.picIdcardBack,
        //     title: "身份证后面"
        //   },
        //   {
        //     url: this.info.picNocriminal,
        //     title: "无犯罪证明"
        //   }
        ];
      }
      return imgList;
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
          title: "姓名",
          key: "name"
        },
        {
          title: "电话",
          key: "phone"
        },
        {
          title: "性别",
          key: "gender",
          render: (h, params) => {
            return h(
              "div",
              {},
              params.row.gender === 0
                ? "女"
                : params.row.gender === 1
                ? "男"
                : ""
            );
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.memberList.length; i++) {
        let { realName, telephone, gender } = this.memberList[i];
        tabData.push({
          name: realName,
          phone: telephone,
          gender
        });
      }
      return tabData;
    },
    securityTree: function() {
      let securityTree = [];
      if (this.info.securityList && this.info.securityList.length !== 0) {
        for (let i = 0; i < this.info.securityList.length; i++) {
          let { securityPca, securityPlotName } = this.info.securityList[i];

          let securityPlotNames = securityPlotName.split(",");
          let children = [];
          for (let j = 0; j < securityPlotNames.length; j++) {
            children.push({
              title: securityPlotNames[j]
              //   expand: true
            });
          }
          securityTree.push({
            title: securityPca,
            expand: false,
            children
          });
        }
      }
      return securityTree;
    },
    maintainTree: function() {
      let maintainTree = [];
      if (this.info.maintainList && this.info.maintainList.length !== 0) {
        for (let i = 0; i < this.info.maintainList.length; i++) {
          let { maintainPca, maintainStreetName } = this.info.maintainList[i];

          let maintainStreetNames = maintainStreetName.split(",");
          let children = [];
          for (let j = 0; j < maintainStreetNames.length; j++) {
            children.push({
              title: maintainStreetNames[j]
              //   expand: true
            });
          }
          maintainTree.push({
            title: maintainPca,
            expand: false,
            children
          });
        }
      }
      return maintainTree;
    }
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        await this.getDetail();
        this.getMemberList();
      }
    }
  },
  methods: {
    /**
     * 获取账号详情
     */
    async getDetail() {
      return new Promise((resolve, reject) => {
        getServerDetail({
          userNumber: this.number
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              this.info = data;
              this.info.roles = [];
              if (data.propertyManage) {
                this.info.roles.push("物管");
              }
              if (data.security) {
                this.info.roles.push("安保");
              }

              if (data.maintenance) {
                this.info.roles.push("维保");
              }
              if (data.salesman) {
                this.info.roles.push("业务");
              }
              resolve();
            } else {
              reject();
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     *如果是队长，就列出所有下属队员
     */
    getMemberList() {
      getServerUserList({
        page: 1,
        pageSize: 99,
        captainPhone: this.info.phone
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.memberList = data.list;
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
.classify-item {
  .text {
    border-right: 1px solid #eee;
  }

  .text:nth-last-child(1) {
    border-right: none;
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
</style>


