<template>
  <div>
    <Modal
      title="添加"
      v-model.trim="isShow"
      :mask-closable="false"
      :loading="loading"
      :closable="false"
      width="540"
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
              :value="item.code"
              v-for="(item, index) in DeviceSortType"
              :key="index"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="deviceRoleType" label="出入类型">
          <Select v-model.trim="form.deviceRoleType" placeholder="请选择门口机出入类型" style="width:200px;">
            <Option
              v-for="(item, index) in RecordType"
              :key="index"
              :value="item.code"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="provinceCode" label="小区楼座" v-show="form.deviceType===0">
          <!--小区门口机-->
          <address-cascader
            style="width: 400px;"
            ref="addressCascader0"
            :clearable="false"
            :showLevel="7"
            @onChange="addressOnChange"
          ></address-cascader>
        </FormItem>
        <FormItem prop="provinceCode" label="小区楼座" v-show="form.deviceType===1">
          <!--楼座门口机-->
          <address-cascader
            style="width: 400px;"
            ref="addressCascader1"
            :clearable="false"
            :showLevel="6"
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
          <Input v-model.trim="form.deviceName" maxlength="20" show-word-limit placeholder="请输入设备名称" style="width: 200px;" />
        </FormItem>
        <FormItem prop="deviceAccount" label="设备账号">
          <Input v-model.trim="form.deviceAccount" placeholder="请输入设备账号" style="width: 200px;" />
        </FormItem>
        <FormItem prop="positionDesc" label="设备位置">
          <Input v-model.trim="form.positionDesc" maxlength="10" show-word-limit placeholder="请输入设备位置描述" style="width:200px;" />
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
import { addEntranceDevice } from "@/api/communityManage";
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
      DeviceSortType: this.$options.filters.statusList("DeviceSortType"),
      RecordType: this.$options.filters.statusList("RecordType"),
      form: {
        positionDesc: null, // 设备位置描述
        deviceType: null, // 设备类型
        deviceName: null, // 设备附加名称
        buildingNumber: null, // 楼座number
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
        deviceRoleType: null, // 门口机出入类型
        longitude: null,
        latitude: null,
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
        deviceRoleType: [
          {
            type: "number",
            required: true,
            message: "请选择门口机出入类型",
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
        ],
        longitude: [
          {
            type: "number",
            required: true,
            message: "请选择门口机放置的坐标",
            trigger: "blur"
          }
        ]
      },
      ChooseLngLat: {
        isShow: false
      }
    };
  },
  computed: {
    showLevel: function() {
      if (this.form.deviceType === 0) {
        // 小区门口机
        return 7;
      } else if (this.form.deviceType === 1) {
        // 楼座门口机
        return 6;
      }
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
    },
    "form.deviceType": function() {
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
  },
  methods: {
    handleClose() {
      // 当窗口关闭时触发
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
      if (this.form.deviceType === 0){ // 小区门口机
        this.form.positionDesc = this.form.doorName
        
      } else if (this.form.deviceType === 1){ // 楼座门口机
        this.form.positionDesc = this.form.buildingName
      }
    },
    /**
     * 选择小区改变时
     */
    plotOnChange(value) {
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
            positionDesc,
            deviceType,
            deviceName,
            deviceAccount,
            files,
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
            latitude
          } = this.form;
          this.subIsShow = true;
          addEntranceDevice({
            positionDesc,
            deviceType,
            deviceName,
            deviceAccount,
            deviceRoleType,
            logoUrl: files.path,
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
            latitude
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
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


