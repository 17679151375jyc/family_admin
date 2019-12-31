<template>
  <Modal title="添加" v-model.trim="visible" :mask-closable="false" :loading="loading">
    <Form ref="form" :model="form" :rules="rules" :label-width="110">
      <FormItem label="角色类型" prop="curRole" required>
        <Select multiple style="width:200px;" v-model="form.curRole">
          <Option
            v-for="(item, index) in roleTypeList"
            :key="index"
            :value="item.value"
            :disabled="(form.curRole.includes('propertyManage') && item.value!='propertyManage') || ((form.curRole.includes('security') || form.curRole.includes('maintenance') || form.curRole.includes('salesman')) && item.value=='propertyManage')"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <!-- <FormItem prop="fsUserRoleType" label="服务人员类型">
        <Select v-model="form.fsUserRoleType" placeholder="请选择用户类型" style="width:200px;">
          <Option v-for="item in FsUserRoleType" :value="item.code" :key="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>-->

      <!-- 物管要选择 -->
      <FormItem prop="companyId" label="所属公司">
        <Select v-model.trim="form.companyId" placeholder="请选择所属公司" style="width: 200px;">
          <Option v-for="item in companyList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem
        prop="propertyPlotRelation"
        required
        label="物管小区"
        v-if="form.curRole.includes('propertyManage')"
      >
        <Select v-model="form.propertyPlotRelation" placeholder="请选择物管小区" style="width: 200px;">
          <Option
            v-for="item in plotList"
            :value="item.plotNumber"
            :key="item.plotNumber"
          >{{item.plotName}}</Option>
        </Select>
      </FormItem>
      <!-- 物管要选择 -->

      <FormItem
        prop="securityPlotRelation"
        label="安保服务社区"
        required
        v-if="form.curRole.includes('security')"
      >
        <address-cascader
          ref="securityAddress"
          :showLevel="2"
          style="width: 200px;"
          @onChange="securityAddressChange"
        ></address-cascader>
        <Select
          v-model="form.securityPlotRelation"
          placeholder="请选择服务的社区"
          multiple
          filterable
          style="width: 350px;margin-top: 2px;"
        >
          <Option value="null" disabled>
            <span>名称</span>
            <span class="select-right-span-disabled" style="padding-right:20px;">区、街道</span>
          </Option>

          <Option
            v-for="item in securityPlotList"
            :value="item.plotNumber"
            :key="item.plotNumber"
            :label="item.plotName"
          >
            <span>{{item.plotName}}</span>
            <span
              class="select-right-span"
              style="padding-right:20px;"
            >{{item.areaName+' - '+item.streetName}}</span>
          </Option>
        </Select>
      </FormItem>

      <FormItem
        prop="maintenPlotRelation"
        label="维保服务街道"
        required
        v-if="form.curRole.includes('maintenance')"
      >
        <address-cascader
          ref="maintenAddress"
          :showLevel="2"
          style="width: 200px;"
          @onChange="maintenanceAddressChange"
        ></address-cascader>
        <Tree
          class="streetTree"
          :data="areaList"
          show-checkbox
          multiple
          style="pointer-events: auto;"
        ></Tree>
      </FormItem>

      <FormItem prop="phone" label="手机号码">
        <Input v-model.trim="form.phone" placeholder="请输入手机号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="telephone" label="紧急联系人">
        <Input v-model.trim="form.telephone" placeholder="请输入紧急联系人手机号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="password" label="密码">
        <Input v-model.trim="form.password" placeholder="请填写密码" style="width:200px;" />
      </FormItem>
      <FormItem prop="realName" label="真实姓名">
        <Input v-model.trim="form.realName" placeholder="请填写真实姓名" style="width:200px;" />
      </FormItem>
      <FormItem prop="gender" label="性别">
        <RadioGroup v-model="form.gender">
          <Radio :label="0">女</Radio>
          <Radio :label="1">男</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop="identityCard" label="身份证">
        <Input v-model.trim="form.identityCard" placeholder="请填写身份证号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="province" label="现居城市">
        <address-cascader
          ref="addressCascader"
          @onChange="addressOnChange"
          :showLevel="4"
          style="width: 270px;"
        ></address-cascader>
      </FormItem>
      <FormItem prop="address" label="详细地址">
        <Input v-model.trim="form.address" placeholder="请填写详细地址" style="width: 270px;" />
      </FormItem>
      <FormItem prop="picFace" label="人脸图像">
        <upload v-model.trim="form.picFace" pathName="picFace"></upload>
      </FormItem>
      <!-- <FormItem prop="picIdcardFront" label="身份证前面" v-if="form.fsUserRoleType!=2">
        <upload v-model.trim="form.picIdcardFront" pathName="picIdcardFront"></upload>
      </FormItem>
      <FormItem prop="picIdcardBack" label="身份证后面" v-if="form.fsUserRoleType!=2">
        <upload v-model.trim="form.picIdcardBack" pathName="picIdcardBack"></upload>
      </FormItem>
      <FormItem prop="picNocriminal" label="无犯罪记录证明" v-if="form.fsUserRoleType!=2">
        <upload v-model.trim="form.picNocriminal" pathName="picNocriminal"></upload>
      </FormItem>-->
    </Form>

    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addServerUser } from "@/api/userManage";
import { addAccount, getRoleList } from "@/api/systemSetup";
import { getCompanyList, getPlotList } from "@/api/dataManage";
import { getProvinceAllInfo } from "@/api/common";
import AddressCascader from "@/components/addressCascader/addressCascader";
import Upload from "@/components/upload/upload";
import { mapState } from "vuex";
export default {
  components: {
    AddressCascader,
    Upload
  },
  props: {
    value: {
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
      visible: false,
      subIsShow: false,
      companyList: [], //公司列表
      plotList: [], //小区列表
      securityPlotList: [], // 安保的小区列表
      cityList: [],
      areaList: [], //一个市下所有街道
      streetList: [],

      form: {
        curRole: [], // 当前的用户角色,
        securityProvinceCode: "", // 安保所属区域的省
        securityCityCode: "", // 安保所属的市
        securityPlots: [], // 安保要巡更的小区
        maintenanceProvinceCode: "",
        maintenanceCityCode: "",
        plotNumber: "", // 物管管理的小区
        companyType: "", // 公司类型
        // fsUserRoleType: "", // 用户类型
        phone: "", //手机号
        telephone: "", // 紧急联系人手机
        password: "", // 密码
        realName: "", //真实姓名
        gender: "", //
        identityCard: "", //身份证
        province: "", //省
        provinceCode: "", //省码
        city: "", //市
        cityCode: "", // 市码
        area: "", // 区
        areaCode: "", // 区码
        street: "", // 街道
        streetCode: "", // 街道码
        address: "", // 详细地址
        picFace: "", // 人脸图像
        // picNocriminal: "", // 无犯罪证明
        // picIdcardFront: "", // 身份证正面
        // picIdcardBack: "", // 身份证反面
        companyId: "", //所属公司
        securityCompany: "", // 所属安保公司
        maintenCompany: "", // 所属维保公司
        manageCompany: "", // 所属物管公司
        salesman: 0, // 是否业务
        security: 0, //是否安保，0不是，1是
        maintenance: 0, //是否维保，0不是，1是
        propertyManage: 0, //是否物管，0不是，1是
        securityPlotRelation: "", // 安保服务社区编号，多个以逗号分隔
        maintenPlotRelation: "", //维保服务街道代码，多个以逗号分隔
        propertyPlotRelation: "" // 物管服务社区
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      this.$refs['addressCascader'].resetData()
    },
    visible(val) {
      if (!val) {
        //弹窗不显示时，清空表单
        this.$refs["form"].resetFields();
      } else {
        this.getCompanyList();
      }
      this.$emit("input", val);
    },
    "form.curRole": {
      handler: function(val) {
        this.$refs["securityAddress"] &&
          this.$refs["securityAddress"].resetData();
        this.$refs["maintenAddress"] &&
          this.$refs["maintenAddress"].resetData();
        this.form.companyId = null;
        this.form.securityPlotRelation = [];
      },
      deep: true
    },
    // "form.companyType": function(val) {
    //   this.getCompanyList();
    // },
    "form.companyId": async function(val) {
      this.form.plotNumber = null;
      this.plotList = [];
      if (this.form.curRole.includes("propertyManage") && val) {
        // 物管
        this.plotList = await this.getPlotList(val);
      }
    },
    "form.securityCityCode": async function(val) {
      this.securityPlotList = [];
      this.form.securityPlotRelation = [];
      if (val) {
        this.securityPlotList = await this.getPlotList(
          "",
          this.form.securityProvinceCode,
          val
        );
      }
    },
    "form.maintenanceCityCode": function(val) {
      this.areaList = [];
      this.streetList = [];
      if (val) {
        this.getCityAllStreet(val);
      }
    }
  },
  computed: {
    ...mapState({
      companyType: state => state.user.companyType
    }),
    rules: function() {
      return {
        curRole: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (value.length === 0) {
                err = "请选择角色类型";
              }
              callback(err);
            }
          }
        ],
        companyId: [
          {
            required: true,
            message: "请选择所属公司",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.phone(value)) {
                err = "请填写正确的手机号码";
              }
              callback(err);
            }
          }
        ],
        telephone: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.phone(value)) {
                err = "请填写正确的手机号码";
              }
              callback(err);
            }
          }
        ],
        password: [
          {
            required: true,
            message: "请填写密码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.password(value)) {
                err = "填写6-20位由字母和数字组成密码";
              }
              callback(err);
            }
          }
        ],
        realName: [
          {
            required: true,
            message: "请填写真实姓名",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.realName(value)) {
                err = "请填写2-4位中文名称";
              }
              callback(err);
            }
          }
        ],
        gender: [
          {
            type: "number",
            required: true,
            message: "请选择性别",
            trigger: "blur"
          }
        ],
        identityCard: [
          {
            required: true,
            message: "请填写身份证号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.identityCard(value)) {
                err = "请填写正确的身份证号码";
              }
              callback(err);
            }
          }
        ],
        province: [
          {
            required: true,
            message: "请选择现居城市",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur"
          }
        ],
        securityPlotRelation: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (
                this.form.curRole.includes("security") &&
                value.length === 0
              ) {
                // 如果当前用户为安保
                err = "安保必须选择安保服务社区";
              }
              callback(err);
            }
          }
        ],
        propertyPlotRelation: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (this.form.curRole.includes("propertyManage") && !value) {
                err = "物管必须选择所属公司和管理的小区";
              }
              callback(err);
            }
          }
        ],
        maintenPlotRelation: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              let hasStreet = false;
              for (let i = 0; i < this.streetList.length; i++) {
                if (this.streetList[i].checked) {
                  hasStreet = true;
                  break;
                }
              }
              console.log("maintenPlotRelation", hasStreet);
              if (this.form.curRole.includes("maintenance") && !hasStreet) {
                err = "维保必须选择最少一个服务街道";
              }
              callback(err);
            }
          }
        ],
        picFace: [
          {
            required: true,
            message: "请上传人脸图像",
            trigger: "blur"
          }
        ]
        // picIdcardFront: [
        //   {
        //     required: true,
        //     message: "请上传身份证正面照片",
        //     trigger: "blur"
        //   }
        // ],
        // picIdcardBack: [
        //   {
        //     required: true,
        //     message: "请上传身份证反面照片",
        //     trigger: "blur"
        //   }
        // ],
        // picNocriminal: [
        //   {
        //     required: true,
        //     message: "请上传无犯罪记录证明",
        //     trigger: "blur"
        //   }
        // ]
      };
    },
    // FsUserRoleType: function() {
    //   let type = [];
    //   if (this.companyType === 1) {
    //     type = [{ code: 2, name: "物管" }];
    //   } else {
    //     type = this.$options.filters.statusList("FsUserRoleType");
    //   }
    //   return type;
    // }
    roleTypeList: function() {
      if (this.companyType === 1) {
        return [
          {
            name: "物管",
            value: "propertyManage"
          }
        ];
      } else {
        return [
          {
            name: "安保",
            value: "security"
          },
          {
            name: "维保",
            value: "maintenance"
          },
          {
            name: "物管",
            value: "propertyManage"
          },
          {
            name: "业务",
            value: "salesman"
          }
        ];
      }
    }
  },
  methods: {
    /**
     * @method getRoleList 获取角色列表
     */
    getRoleList() {
      getRoleList({}).then(({ data: { list }, errorCode }) => {
        if (errorCode === 0) {
          this.roleList = list;
        }
      });
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            curRole,
            telephone,
            phone,
            password,
            realName,
            gender,
            identityCard,
            province,
            provinceCode,
            city,
            cityCode,
            area,
            areaCode,
            street,
            streetCode,
            address,
            // fsUserRoleType,
            companyId,
            securityPlotRelation,
            propertyPlotRelation,
            picFace,
            picIdcardFront,
            picIdcardBack,
            picNocriminal
          } = this.form;
          let basData = {
            // 基础数据，再根据不同的用户类型去添加不同的字段
            curRole,
            telephone,
            phone,
            password,
            realName,
            gender,
            identityCard,
            province,
            provinceCode,
            city,
            cityCode,
            area,
            areaCode,
            street,
            streetCode,
            address,
            companyId,
            picFace,
            picIdcardFront,
            picIdcardBack,
            picNocriminal
          };
          let data = {};
          if (curRole.includes("security")) {
            //安保
            data = Object.assign(basData, {
              security: 1,
              securityPlotRelation: securityPlotRelation.join(",")
            });
          }
          if (curRole.includes("maintenance")) {
            // 维保
            let streetArr = [];
            for (let i = 0; i < this.streetList.length; i++) {
              if (this.streetList[i].checked) {
                streetArr.push(this.streetList[i].code);
              }
            }
            data = Object.assign(basData, {
              maintenance: 1,
              maintenPlotRelation: streetArr.join(",")
            });
          }
          if (curRole.includes("propertyManage")) {
            // 物管
            data = Object.assign(basData, {
              propertyManage: 1,
              propertyPlotRelation
            });
          }
          if (curRole.includes("salesman")) {
            // 业务
            data = Object.assign(basData, {
              salesman: 1
            });
          }
          this.subIsShow = true;
          addServerUser(data)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.subIsShow = false;
                this.visible = false;
              }
            })
            .catch(err => {
              this.subIsShow = false;
            });
        } else {
            this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 选择了省市区街道
     */
    addressOnChange(val, valObj) {
      this.form.province = valObj[0] && valObj[0].label;
      this.form.provinceCode = valObj[0] && valObj[0].value;
      this.form.city = valObj[1] && valObj[1].label;
      this.form.cityCode = valObj[1] && valObj[1].value;
      this.form.area = valObj[2] && valObj[2].label;
      this.form.areaCode = valObj[2] && valObj[2].value;
      this.form.street = valObj[3] && valObj[3].label;
      this.form.streetCode = valObj[3] && valObj[3].value;
    },
    /**
     * 获取公司列表
     */
    getCompanyList() {
      getCompanyList({
        input: {
          //   inCompanyTypes: [this.form.companyType],
          isMincompany: 1
        }
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.companyList = data.list;
        }
      });
    },
    /**
     * 获取物管对应的小区
     */
    async getPlotList(companyId, province, city, area, street) {
      return new Promise((resolve, reject) => {
        getPlotList({
          companyId,
          province,
          city,
          area,
          street
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              resolve(data.list);
            } else {
              reject([]);
            }
          })
          .catch(() => {
            reject([]);
          });
      });
    },
    /**
     * 安保的省市变了
     */
    securityAddressChange(val) {
      this.form.securityProvinceCode = val[0];
      this.form.securityCityCode = val[1];
    },
    /**
     * 维保的省市变了
     */
    maintenanceAddressChange(val) {
      this.form.maintenanceProvinceCode = val[0];
      this.form.maintenanceCityCode = val[1];
    },
    /**
     * 传省id返回全部市区街道信息
     */
    getCityAllStreet(cityCode) {
      getProvinceAllInfo({
        code: cityCode
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          //   let {area, city, plot, street} = data
          this.cityList = data.city;
          this.areaList = data.area;
          this.streetList = data.street;
          //   this.plotList = data.plot;
          for (let i = 0; i < this.streetList.length; i++) {
            //遍历所有小区，添加到对应的街道里
            this.streetList[i].title = this.streetList[i].name;
            this.streetList[i].children = [];
            // for (let j = 0; j < this.plotList.length; j++) {
            //   //   console.log(plot[j].street, street[i].code)
            //   if (this.plotList[j].street == this.streetList[i].code) {
            //     //   console.log('相等')
            //     this.plotList[j].title = this.plotList[j].plotName;
            //     this.plotList[j].code = this.plotList[j].plotNumber;
            //     //   console.log(plotName, plotNumber)
            //     this.streetList[i].children.push(this.plotList[j]);
            //   }
            // }
          }
          for (let i = 0; i < this.areaList.length; i++) {
            // 遍历所有街道添加到对应的区
            this.areaList[i].title = this.areaList[i].name;
            this.areaList[i].children = [];
            for (let j = 0; j < this.streetList.length; j++) {
              if (this.areaList[i].code == this.streetList[j].parentCode) {
                this.areaList[i].children.push(this.streetList[j]);
              }
            }
          }
          console.log("area", this.areaList);
          this.areaList;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.streetTree {
  border: 1px solid #dcdee2;
  padding-left: 4px;
  border-radius: 4px;
  width: 200px;
  margin-top: 2px;
}

.ivu-form-item-error {
  .streetTree {
    border-color: red !important;
  }
}
</style>


