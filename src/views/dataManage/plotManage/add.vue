<template>
  <Modal
    title="添加"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="130">
      <FormItem prop="plotName" label="小区名称">
        <Input v-model.trim="form.plotName" placeholder="请输入小区名称，最多32个字符" style="width: 250px;" />
      </FormItem>
      <FormItem prop="street" label="省市区街道">
        <address-cascader
          style="width: 250px;"
          ref="addressCascader"
          :clearable="false"
          @onChange="addressOnChange"
        ></address-cascader>
      </FormItem>
      <FormItem prop="address" label="详细地址">
        <Input v-model.trim="form.address" placeholder="请输入详细地址, 最多32个字符" style="width:250px;" />
      </FormItem>
      <FormItem prop="longitude" label="详细坐标">
        <Tag
          :color="form.longitude ? 'success' : 'default'"
        >{{`[${form.longitude ? form.longitude : '未选择'}, ${form.latitude ? form.latitude : '未选择'}]`}}</Tag>
        <Button type="info" size="small" @click="showAmap">地图选择</Button>
      </FormItem>
      <FormItem prop="latitude" label="详细坐标" v-show="false"></FormItem>
      <FormItem prop="plotPhone" label="联系手机">
        <Input v-model.trim="form.plotPhone" placeholder="请输入联系手机" style="width:250px;" />
      </FormItem>
      <FormItem prop="communityCanUse" label="小区类型">
        <RadioGroup v-model.trim="form.communityCanUse">
          <Radio :label="1">用于社区和安装区域</Radio>
          <Radio :label="0">仅用于安装区域</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem required prop="companyId" label="物管公司" v-if="form.communityCanUse==1 && form.city">
        <Select v-model.trim="form.companyId" placeholder="请选择物管公司" style="width:250px;">
          <Option v-for="(item, index) in companyList" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem prop="parkId" label="停车场ID" v-if="form.communityCanUse==1">
        <Input v-model.trim="form.parkId" placeholder="请填写停车场ID" style="width:250px;" />
      </FormItem>
      <FormItem prop="faceCount" label="添加家人人脸个数" v-if="form.communityCanUse">
        <InputNumber
          :max="9999"
          v-model="form.faceCount"
          style="width:250px;"
          placeholder="请输入要添加的家人人脸个数"
        ></InputNumber>
      </FormItem>
      <FormItem prop="accountCount" label="　每户账号个数 （包含邀请家人)" v-if="form.communityCanUse">
        <InputNumber
          :max="9999"
          v-model="form.accountCount"
          style="width:250px;"
          placeholder="请输入每户账号个数"
        ></InputNumber>
      </FormItem>
      <FormItem prop="payType" label="收费类型" v-if="form.communityCanUse">
        <Select v-model="form.payType" placeholder="请选择收费类型" style="width: 250px;">
          <Option v-for="(item, index) in PayTypeList" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem
        prop="effectiveTime"
        :label="form.payType===2 ? '免费天数' : '有效时间'"
        v-if="(form.payType!=null || form.payType!=undefined) && form.communityCanUse"
      >
        <DatePicker
          ref="effectiveTime"
          v-if="form.payType===0 || form.payType===1"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          placeholder="请选择到期时间"
          style="width: 250px"
          @on-change="chooseDate"
        ></DatePicker>

        <InputNumber
          v-model.trim="form.effectiveTime"
          v-if="form.payType===2"
          :max="99"
          :min="1"
          placeholder="请填写有效天数"
          style="width:250px;"
        ></InputNumber>
      </FormItem>
      <!-- <FormItem>
      </FormItem>-->
      <FormItem prop="temporaryCount" label="访客可预约车辆个数" v-if="form.communityCanUse">
        <InputNumber
          :max="9999"
          :min="0"
          v-model="form.temporaryCount"
          style="width: 250px;"
          placeholder="请输入访客可预约车辆个数"
        ></InputNumber>
      </FormItem>

      <FormItem prop="realNameStatus" label="访客是否需填姓名" v-if="form.communityCanUse">
        <i-switch v-model="form.realNameStatus">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem prop="idcardStatus" label="访客是否需填身份证" v-if="form.communityCanUse">
        <i-switch v-model="form.idcardStatus">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem prop="phoneStatus" label="访客是否需填手机号" v-if="form.communityCanUse">
        <i-switch v-model="form.phoneStatus">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem prop="remark" label="备注">
        <Input type="textarea" v-model="form.remark" :rows="4" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
    <amap
      :isShow="amap.isShow"
      :address="(form.provinceName + form.cityName + form.areaName + form.streetName + form.address) ? (form.provinceName + form.cityName + form.areaName + form.streetName + form.address) : ''"
      :longitude="form.longitude"
      :latitude="form.latitude"
      @handleClose="amapClose"
      @selLngLat="selLngLat"
    ></amap>
  </Modal>
</template>
<script>
import { addPlot, getCompanyList } from "@/api/dataManage";
import amap from "./amap";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    addressCascader,
    amap
  },
  props: {
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
    let self = this;
    return {
      companyList: [], //公司列表
      amap: {
        // 转码组件
        isShow: false
      },
      subIsShow: false,
      form: {
        province: "",
        city: "",
        area: "",
        street: "",
        provinceName: "",
        areaName: "",
        cityName: "",
        streetName: "",
        plotName: null,
        plotPhone: null,
        address: "",
        longitude: null, // 经度
        latitude: null, //纬度
        communityCanUse: null, // 小区是否用于加入社区
        companyId: null, // 公司id
        parkId: null,
        faceCount: 3, // 人脸免费个数
        accountCount: 3, // 加入社区账号个数
        payType: null, // 收费类型
        effectiveTime: null, // 有效时间，收费类型是0，1时为具体时间 ，2时为天数
        remark: null, // 备注
        temporaryCount: 0, //预约车数量
        idcardStatus: true, // 访客是否需填身份证号
        realNameStatus: true, // 访客是否需填姓名
        phoneStatus: true // 访客是否需要填手机号
      },
      PayTypeList: this.$options.filters.statusList("PayType")
    };
  },
  computed: {
    rules: function() {
      let that = this;
      return {
        street: [
          {
            required: true,
            message: "请选择对应省市区街道",
            trigger: "blur"
          }
        ],
        plotName: [
          {
            required: true,
            message: "请填写小区名称",
            trigger: "blur"
          },
          {
            max: 32,
            message: "长度不超过32个字符",
            trigger: "blur"
          }
        ],
        plotPhone: [
          {
            required: true,
            message: "请填写联系手机",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) =>{
              let err = [];
              if (!this.$options.filters.phone(value)) {
                err = "请填写正确的手机号码";
              }
              callback(err);
            }
          }
        ],
        address: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur"
          },
          {
            max: 32,
            message: "长度不超过32个字符",
            trigger: "blur"
          }
        ],
        longitude: [
          {
            type: "float",
            required: true,
            message: "请选择地址坐标",
            trigger: "blur"
          }
        ],
        latitude: [
          {
            type: "float",
            required: true,
            message: "请选择地址坐标",
            trigger: "blur"
          }
        ],
        communityCanUse: [
          {
            type: "number",
            required: true,
            message: "请选择小区类型",
            trigger: "blur"
          }
        ],
        companyId: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (that.form.communityCanUse === 1 && !that.form.companyId) {
                //如果类型为社区，就要选公司
                err = "当前类型为社区，请选择对应物管公司";
              }
              callback(err);
            }
          }
        ],
        faceCount: [
          {
            type: "number",
            required: true,
            message: "请输入要添加的家人人脸个数",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (value < 3) {
                err = "人脸个数最少设置为3个";
              }
              callback(err);
            }
          }
        ],
        accountCount: [
          {
            type: "number",
            required: true,
            message: "请输入每户账号个数",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (value < 3) {
                err = "每户账号个数最少设置3个";
              }
              callback(err);
            }
          }
        ],
        payType: [
          {
            type: "number",
            required: true,
            message: "请选择支付方式",
            trigger: "blur"
          }
        ],
        effectiveTime: [
          {
            type: "number",
            required: true,
            message: "请选择有效时间",
            trigger: "blur"
          }
        ],
        temporaryCount: [
          {
            type: "number",
            required: true,
            message: "请填写预约车数量",
            trigger: "blur"
          }
        ]
      };
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      this.$refs["addressCascader"].resetData();
      this.form.city = "";
    },
    "form.city": function(val, oldVal) {
      if (val && oldVal) {
        // 当城市变更时，把公司设置为空，因为要重新拉对应城市的公司列表
        this.form.companyId = null;
      }
      if (val) {
        this.getCompanyList(); // 当城市化时，重新拉一次公司数据
      } else {
        this.companyList = [];
      }
    },
    "form.payType": function(val, oldVal) {
      this.form.effectiveTime = null;
      this.$refs["effectiveTime"] && this.$refs["effectiveTime"].handleClear();
    }
  },
  mounted() {
    //   setTimeout(() => {
    //       console.log('5秒后')
    //       this.marker.position =  [122.59996, 31.197646]
    //   }, 5000)
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            plotName,
            plotPhone,
            province,
            area,
            city,
            street,
            provinceName,
            areaName,
            cityName,
            streetName,
            address,
            longitude,
            latitude,
            communityCanUse,
            companyId,
            parkId,
            faceCount,
            accountCount,
            payType,
            effectiveTime,
            remark,
            temporaryCount,
            isIdentity
          } = this.form;
          this.subIsShow = true;
          addPlot({
            plotName,
            province,
            area,
            city,
            street,
            provinceName,
            areaName,
            cityName,
            streetName,
            address,
            longitude,
            latitude,
            communityCanUse,
            companyId,
            parkId,
            faceCount,
            accountCount,
            payType,
            effectiveTime,
            remark,
            temporaryCount,
            isIdentity,
            plotPhone
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.$emit("handleClose", true);
                this.subIsShow = false;
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
    addressOnChange(value, valueObj) {
      this.$set(this.form, "province", valueObj[0].value);
      this.$set(this.form, "city", valueObj[1].value);
      this.$set(this.form, "area", valueObj[2].value);
      this.$set(this.form, "street", valueObj[3].value);

      this.$set(this.form, "provinceName", valueObj[0].label);
      this.$set(this.form, "cityName", valueObj[1].label);
      this.$set(this.form, "areaName", valueObj[2].label);
      this.$set(this.form, "streetName", valueObj[3].label);
    },
    plotOnChange(value) {
      this.form.plotNumber = value[0];
      this.form.buildingNumber = value[1];
      this.form.doorNumber = value[2];
    },
    /**
     * 显示地图转码经纬度
     */
    showAmap() {
      this.amap.isShow = true;
    },
    /**
     * 关闭地图
     */
    amapClose() {
      this.amap.isShow = false;
    },
    /**
     * 当前选择的坐标的值
     */
    selLngLat(position) {
      this.$set(this.form, "longitude", position[0]);
      this.$set(this.form, "latitude", position[1]);
      this.amapClose();
    },
    /**
     * 获取公司列表
     */
    getCompanyList() {
      getCompanyList({
        input: {
          city: this.form.city,
          inCompanyTypes: [1], //获取物管公司
          isMincompany: 1 //是否最后一级公司
        }
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.companyList = data.list;
        }
      });
    },
    /**
     * 选择有效时间
     */
    chooseDate(e) {
      this.form.effectiveTime = new Date(e).getTime() / 1000;
      // console.log((new Date(e)).getTime()/1000)
      // // this.form.effectiveTime =
      // console.log('chooseDate', e)
    }
  }
};
</script>
<style lang="stylus" scoped>
.amap-container {
  position: relative;
  width: 600px;
  height: 500px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);

  .data-info {
    width: 400px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: absolute;
    right: 270px;
    top: 2px;
    padding: 10px;

    p {
      margin-bottom: 5px;
      color: grey;
    }

    .option {
      display: flex;
      border: 1px solid #ced4da;
      height: 30px;
      line-height: 30px;
      border-radius: 2px;
      margin-bottom: 5px;

      .left {
        flex: 0 0 60px;
        background: #e9ecef;
        text-align: center;
        border-right: 1px solid #ced4da;
      }

      .right {
        flex: 1;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .container {
    width: 100%;
    height: 500px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }

  .info {
    position: absolute;
    top: 4px;
    right: 4px;
    padding-left: 10px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    padding: 10px;

    .tips {
      padding: 15px 0 10px 0;
      border-top: 1px solid #e8eaec;
      display: flex;
      align-items: center;
    }

    .lnglat {
      display: flex;
      align-items: center;

      span {
        font-size: 13px;
        margin-right: 15px;
      }
    }

    .items {
      border: 1px solid #2d8cf0;
      border-radius: 3px;
      padding: 0 10px;
      max-height: 498px;
      overflow-y: auto;

      .title {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #e8eaec;
        text-align: center;
        color: #2d8cf0;
      }

      .empty {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        color: #aaa;
      }

      .item {
        border-bottom: 1px solid #e8eaec;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;

        &:nth-last-child(1) {
          border: none;
        }

        span {
          cursor: pointer;
          display: flex;
          flex-direction: column;

          b {
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>