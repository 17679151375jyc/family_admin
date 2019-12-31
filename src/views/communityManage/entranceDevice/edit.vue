<template>
  <div>
    <Modal
      title="编辑"
      v-model.trim="isShow"
      width="540"
      :mask-closable="false"
      :loading="loading"
      :closable="false"
    >
      <!-- 右上角关闭按钮-start -->
      <a class="ivu-modal-close" @click="handleClose">
        <i class="ivu-icon ivu-icon-ios-close"></i>
      </a>
      <!-- 右上角关闭按钮-start -->

      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem prop="deviceType" label="设备类型">
          <Select v-model.trim="form.deviceType" placeholder="请选择设备类型" style="width: 200px;">
            <Option
              :value="item.value"
              v-for="(item, index) in $config.community.deviceType"
              :key="index"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="deviceRoleType" label="出入类型">
          <Select v-model.trim="form.deviceRoleType" placeholder="请选择门口机出入类型" style="width:200px;">
            <Option
              v-for="(item, index) in deviceRoleTypeList"
              :key="index"
              :value="item.value"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="provinceCode" label="小区楼座" v-show="form.deviceType===0">
          <!--小区门口机-->
          <address-cascader
            style="width: 300px;"
            ref="addressCascader0"
            :clearable="false"
            :showLevel="7"
            :valueArr="[info.provinceCode, info.cityCode, info.areaCode, info.streetCode, info.plotNumber, info.buildingNumber, info.doorNumber]"
            @onChange="addressOnChange"
          ></address-cascader>
        </FormItem>
        <FormItem prop="provinceCode" label="小区楼座" v-show="form.deviceType===1">
          <!--楼座门口机-->
          <address-cascader
            style="width: 300px;"
            ref="addressCascader1"
            :clearable="false"
            :showLevel="6"
            :valueArr="[info.provinceCode, info.cityCode, info.areaCode, info.streetCode, info.plotNumber, info.buildingNumber]"
            @onChange="addressOnChange"
          ></address-cascader>
        </FormItem>
        <FormItem prop="longitude" label="详细坐标">
          <Tag
            :color="form.longitude ? 'success' : 'default'"
          >{{`[${form.longitude ? form.longitude : '未选择'}, ${form.latitude ? form.latitude : '未选择'}]`}}</Tag>
          <Button type="info" size="small" @click="ChooseLngLat.isShow = true">地图选择</Button>
        </FormItem>
        <FormItem prop="deviceName" label="设备名称">
          <Input v-model.trim="form.deviceName" placeholder="请输入设备名称" style="width: 200px;" />
        </FormItem>
        <FormItem prop="deviceAccount" label="设备账号">
          <Input v-model.trim="form.deviceAccount" disabled placeholder="请输入设备账号" style="width: 200px;" />
        </FormItem>
        <FormItem prop="positionDesc" label="设备位置">
          <Input v-model.trim="form.positionDesc" placeholder="请输入设备位置描述" style="width:200px;" />
        </FormItem>
        <FormItem label="logo图片">
          <upload v-model="form.files.path" fileNamePrefix="entranceDevice"></upload>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="handleClose">取消</Button>
        <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
      </div>
    </Modal>
    <choose-lng-lat
      v-model="ChooseLngLat.isShow"
      :longitude="form.longitude"
      :latitude="form.latitude"
      @changeLngLat="changeLngLat"
    ></choose-lng-lat>
  </div>
</template>
<script>
import {
  getEntranceDeviceDetail,
  updateEntranceDevice
} from "@/api/communityManage";
import AddressCascader from "@/components/addressCascader/addressCascader";
import Upload from "@/components/upload/upload";
import ChooseLngLat from "@/components/chooseLngLat/chooseLngLat";
export default {
  components: {
    AddressCascader,
    Upload,
    ChooseLngLat
  },
  props: {
    number: {
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
      deviceRoleTypeList: this.$config.community.deviceRoleType,
      info: {
        province: null,
        city: null,
        area: null,
        street: null
      },
      form: {
        deviceNumber: null,
        positionDesc: null, // 设备位置描述
        deviceType: null, // 设备类型
        deviceName: null, // 设备附加名称
        deviceAccount: null, // 设备账号
        provinceName: null,
        provinceCode: null, //省
        cityName: null,
        cityCode: null, //市
        areaName: null,
        areaCode: null, //区
        streetName: null,
        streetCode: null, //街道
        plotName: null,
        plotNumber: null, // 小区id
        buildingName: null,
        buildingNumber: null, //楼座id
        doorName: null,
        doorNumber: null,
        files: {
          fileName: "门口机logo",
          path: "",
          isLoading: false
        }
      },
      rules: {
        provinceCode: [
          {
            required: true,
            message: "请选择对应小区",
            trigger: "blur"
          }
        ],
        deviceRoleType: [
          {
            type: "number",
            required: true,
            message: "请选择门口机出入类型",
            trigger: "blur"
          }
        ],
        deviceType: [
          {
            type: "number",
            required: true,
            message: "请选择设备类型",
            trigger: "blur"
          }
        ],
        streetCode: [
          {
            required: true,
            message: "请选择对应省市区",
            trigger: "blur"
          }
        ],
        plotNumber: [
          {
            required: true,
            message: "请选择对应小区或楼座",
            trigger: "blur"
          }
        ],
        deviceName: [
          {
            required: true,
            message: "请填写设备名称",
            trigger: "blur"
          }
        ],
        deviceAccount: [
          {
            required: true,
            message: "请填写设备账号",
            trigger: "blur"
          }
        ],
        positionDesc: [
          {
            required: true,
            message: "请填写设备所在位置",
            trigger: "blur"
          }
        ],
        "files.path": [
          {
            required: true,
            message: "请上传logo图片，宽高比为16:9",
            trigger: "blur"
          }
        ]
      },
      ChooseLngLat: {
        isShow: false
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.getDetail();
      } else {
        this.$refs["form"].resetFields();
        this.$refs["addressCascader0"].resetData();
        this.$refs["addressCascader1"].resetData();
      }
    },
    "form.deviceType": function(val, oldVal) {
      console.log("deviceType改变", val, oldVal);
      if (
        val !== null &&
        val !== undefined &&
        oldVal !== null &&
        oldVal !== undefined
      ) {
        this.$refs["addressCascader0"].resetData();
        this.$refs["addressCascader1"].resetData();
        this.form.provinceCode = null;
        this.form.cityCode = null;
        this.form.areaCode = null;
        this.form.streetCode = null;
        this.form.plotNumber = null;
        this.form.buildingNumber = null;
        this.form.doorNumber = null;
      }
    }
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getEntranceDeviceDetail({
        deviceNumber: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          let {
            deviceNumber,
            positionDesc, // 设备位置描述
            deviceType, // 设备类型
            deviceName, // 设备附加名称
            plotName,
            plotNumber, // 小区id
            buildingName,
            buildingNumber, // 楼座number
            deviceAccount, // 设备账号
            provinceCode, //省
            cityCode, //市
            areaCode, //区
            streetCode, //街道
            provinceName,
            cityName,
            areaName,
            streetName,
            logoUrl,
            deviceRoleType
          } = data;
          console.log(logoUrl);
          this.form = data;
          this.info = data;
          this.form.buildingNumber = buildingNumber;
          this.form.plotNumber = plotNumber;
          this.form.PCAS = [provinceCode, cityCode, areaCode, streetCode];
          this.form.files = {
            fileName: "门口机logo",
            path: logoUrl,
            isLoading: false
          };

          //   this.form.plotName = plotName;
          //   this.form.buildingName = buildingName;
          //   this.form.deviceNumber = deviceNumber;
          //   this.form.positionDesc = positionDesc;
          //   this.form.deviceType = deviceType;
          //   this.form.deviceName = deviceName;
          //   this.form.buildingNumber = buildingNumber;
          //   this.form.deviceAccount = deviceAccount;
          //   this.form.plotNumber = plotNumber;
          //   this.form.files.path = logoUrl;
          //   this.form.deviceRoleType = deviceRoleType
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * 选择市省区改变时
     */
    addressOnChange(value, obj) {
      this.form.provinceCode = obj[0] && obj[0].value;
      this.form.provinceName = obj[0] && obj[0].label;

      this.form.cityCode = obj[1] && obj[1].value;
      this.form.cityName = obj[1] && obj[1].label;

      this.form.areaCode = obj[2] && obj[2].value;
      this.form.areaName = obj[2] && obj[2].label;

      this.form.streetCode = obj[3] && obj[3].value;
      this.form.streetName = obj[3] && obj[3].label;

      this.form.plotNumber = obj[4] && obj[4].value;
      this.form.plotName = obj[4] && obj[4].label;

      this.form.buildingNumber = obj[5] && obj[5].value;
      this.form.buildingName = obj[5] && obj[5].label;

      this.form.doorNumber = obj[6] && obj[6].value;
      this.form.doorName = obj[6] && obj[6].label;
    },
    /**
     * 选择小区改变时
     */
    plotOnChange(value, valueObj) {
      console.log("小区改变了", valueObj);
      if (this.form.deviceType === 0) {
        // 如果是小区门口机，只需要传小区number
        this.form.plotNumber = value[0];
      } else if (this.form.deviceType === 1) {
        // 如果是楼座门口机，要传小区number和楼座number
        this.form.plotNumber = value[0];
        this.form.buildingNumber = value[1];
      }
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            deviceType,
            deviceNumber,
            deviceName,
            files,
            positionDesc,
            deviceRoleType,
            provinceName,
            provinceCode,
            cityName,
            cityCode,
            areaName,
            areaCode,
            streetName,
            streetCode,
            plotName,
            plotNumber,
            buildingName,
            buildingNumber,
            doorName,
            doorNumber,
            longitude,
            latitude,
            deviceAccount
          } = this.form;
          this.subIsShow = true;
          updateEntranceDevice({
            deviceType,
            deviceNumber,
            deviceName,
            logoUrl: files.path,
            positionDesc,
            deviceRoleType,
            provinceName,
            provinceCode,
            cityName,
            cityCode,
            areaName,
            areaCode,
            streetName,
            streetCode,
            plotName,
            plotNumber,
            buildingName,
            buildingNumber,
            doorName,
            doorNumber,
            longitude,
            latitude,
            deviceAccount
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("修改成功");
                this.subIsShow = false;
                this.$emit("handleClose", true);
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
     * 当选择经纬度的值改变时
     */
    changeLngLat(val) {
      this.form.longitude = val && val[0];
      this.form.latitude = val && val[1];
    }
  }
};
</script>
<style lang="stylus" scoped>
.logo-wrapper {
  position: relative;
  width: 100px;
  height: 136px;

  .logo {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    margin-bottom: 4px;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  input {
    display: block;
    position: absolute;
    width: 100px;
    height: 30px;
    left: 0;
    bottom: 0;
    opacity: 0;
  }
}
</style>


