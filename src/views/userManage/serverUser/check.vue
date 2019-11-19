<!--审核-->
<template>
  <Modal
    title="审核"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="850"
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
            :class="['text', info.status !==null ? statusList[info.status].class : '']"
          >{{info.status!==null ? statusList[info.status].name : ''}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconlingdaitie3"></i>
            <span>角色</span>
          </div>
          <div class="text">{{info.roles.join('、')}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>省市区街道</span>
          </div>
          <div
            class="text"
          >{{info.province ? (info.province + '' + info.city + '' + info.area + '' + (info.street ? info.street:'')) : '无'}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>详细地址</span>
          </div>
          <div class="text">{{info.address || '无'}}</div>
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
          <div class="text">
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
    </div>

    <div class="tab-title">
      <i class="iconfont iconshenhe"></i>
      <span>审核操作</span>
    </div>
    <!-- 审核表格-start -->
    <Form ref="form" :model="form" :rules="rules" :label-width="100" style="margin-top: 30px;">
      <FormItem prop="status" label="更改状态">
        <Select v-model.trim="form.status" placeholder="请选择对应的审核状态" style="width: 200px;">
          <Option
            v-for="(item, index) in statusList"
            v-show="(index!= -1) && (index !=0)"
            :key="item.value"
            :value="item.value"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem
        prop="type"
        label="是否队长"
        v-if="info.propertyManage !== 1 && form.status != statusList[1].value && form.status != statusList[3].value && form.status!==null && (info.maintenance || info.security)"
      >
        <Select v-model.trim="form.type" style="width:200px;">
          <Option v-for="(item, index) in typeList" :key="index" :value="item.value">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="parentNumber" label="所属队长" v-if="form.type === typeList[0].value">
        <Select v-model="form.parentNumber" style="width:200px;">
          <Option
            v-for="(item, index) in captainList"
            :value="item.number"
            :key="index"
          >{{item.realName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="remark" label="审核备注" v-show="form.status === statusList[3].value">
        <Input
          v-model.trim="form.remark"
          type="textarea"
          :rows="4"
          style="width: 400px;"
          placeholder="审核如不通过，请输入原因备注"
        />
      </FormItem>
    </Form>
    <!-- 审核表格-end -->

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import {
  getServerDetail,
  serverUpdateStatus,
  getServerUserList
} from "@/api/userManage";
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
      statusList: this.$config.serverUser.status,
      captainList: [], // 小区的队长列表，如果注册的为队长，则一定要选择对应的队长
      info: {
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
        securityCompany: null, // 保安公司
        securityPCA: null, // 负责保安的小区的省市区
        securityPlotName: null, // 负责保安的小区
        status: null,
        roles: [] // 角色，安保、维保、物管
      },
      form: {
        // 表单
        status: null,
        parentNumber: "", // 如果为普通，就要填所属队长的number
        remark: "", // 审核不通过要填写备注
        type: null // 角色类型,0为普通，1为安保队长，2为维保队长，3为安保、维保队长
      }
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
          }
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
    typeList: function() {
      let typeList = this.$config.serverUser.type;
      if (this.info.security && !this.info.maintenance) {
        // 如果角色类型只是安保
        delete typeList[2];
        delete typeList[3];
      } else if (!this.info.security && this.info.maintenance) {
        // 如果只是维保
        delete typeList[1];
        delete typeList[3];
      } else if (this.info.security && this.info.maintenance) {
        //如果同时是安保和维保
        delete typeList[1];
        delete typeList[2];
      }
      return typeList;
    },
    rules: function() {
      return {
        // 验证规则
        status: [
          {
            type: "number",
            required: true,
            message: "请选择审核状态",
            trigger: "blur"
          }
        ],
        type: [
          {
            validator: (rule, vlaue, callback, source, options) => {
              let err = [];
              if (
                this.form.status == this.statusList[2].value &&
                this.form.type == null &&
                (this.info.maintenance || this.info.security)
              ) {
                err = "请选择是否队长";
              }
              callback(err);
            }
          }
        ],
        remark: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (
                this.form.status != null &&
                this.form.status === this.statusList[3].value &&
                !this.form.remark
              ) {
                err = "审核不通过请填写审核备注";
              }
              callback(err);
            }
          }
        ],
        parentNumber: [
          {
            validator: (rule, value, callback, soruce, options) => {
              let err = [];
              if (
                this.form.type == this.typeList[0].value &&
                !this.form.parentNumber
              ) {
                // 如果是普通类型，就判断队长number一定要选
                err = "普通类型的用户要选择所属队长";
              }
              callback(err);
            }
          }
        ]
      };
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
      this.$refs["form"].resetFields();
      if (val) {
        await this.getDetail();
        this.getCaptainList();
      }
    }
  },
  methods: {
    /**
     * 获取账号详情
     */
    getDetail() {
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
          .catch(err => {});
      });
    },
    /**
     * 触发关闭弹窗
     */
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * 提交数据
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsShow = true;
          let { remark, status, parentNumber, type } = this.form;
          let { number } = this.info;
          serverUpdateStatus({
            status,
            remark,
            number,
            // 如果状态改为通过，和当前类型为普通，要写所属队长的number
            parentNumber:
              status == this.statusList[2].value &&
              type == this.typeList[0].value
                ? parentNumber
                : "",
            captain: type // 类型
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
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 查询队长
     */
    getCaptainList() {
      let { security, maintenance } = this.info;
      let captain;
      if (security == 1 && maintenance == 1) {
        captain = 3;
      } else if (security == 1) {
        captain = 1;
      } else if (maintenance == 1) {
        captain = 2;
      }
      getServerUserList({
        status: this.statusList[2].value,
        page: 1,
        pageSize: 99,
        captain
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.captainList = data.list;
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

.work-row {
  .item {
    .text:nth-of-type(3) {
      border-left: 1px solid #eee;
    }
  }
}
</style>


