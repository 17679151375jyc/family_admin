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

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="type" label="用户分类">
        <Select v-model="form.type" placeholder="请选择用户分类" style="width:250px;">
          <Option v-for="item in AreaType" :key="item && item.code" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="userPhone" label="绑定账号ID">
        <Input v-model.trim="form.userPhone" placeholder="请输入用户手机" style="width: 250px;" />
      </FormItem>
      <FormItem prop="street" label="省市区街道" v-if="isShow">
        <address-cascader
          style="width: 380px;"
          ref="addressCascader"
          :clearable="false"
          :showAllText="true"
          :showAllTextLevel="6"
          :showLevel="7"
          allText="暂不选择"
          @onChange="addressOnChange"
        ></address-cascader>
      </FormItem>
      <FormItem prop="address" label="详细地址">
        <Input v-model.trim="form.address" placeholder="请填写详细地址，不超过32个字符" style="width: 250px;" />
      </FormItem>
      <FormItem prop="longitude" label="详细坐标">
        <Tag
          :color="form.longitude ? 'success' : 'default'"
        >{{`[${form.longitude ? form.longitude : '未选择'}, ${form.latitude ? form.latitude : '未选择'}]`}}</Tag>
        <Button type="info" size="small" @click="showAmap">地图选择</Button>
      </FormItem>
      <FormItem prop="areaName" label="区域名称">
        <Input v-model.trim="form.areaName" placeholder="请输入区域名称" style="width: 250px;" />
      </FormItem>
      <!-- <FormItem prop="doorNumber" label="对应小区" v-if="form.street">
        <plot-cascader
          style="width: 250px;"
          :province="form.province"
          :city="form.city"
          :area="form.area"
          :street="form.street"
          :clearable="true"
          @onChange="plotOnChange"
        ></plot-cascader>
      </FormItem>-->

      <FormItem prop="effectiveTime" label="服务结束时间" v-if="form.type == 0 || form.type==1">
        <DatePicker
          v-model.trim="form.effectiveTime"
          :options="effectiveTimeOptions"
          type="date"
          placeholder="选择服务结束时间"
          style="width: 250px"
        ></DatePicker>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>

    <!-- 地图坐标点选取-start -->
    <amap
      :isShow="amap.isShow"
      :address="(form.provinceName + form.cityName + form.zoneName + form.streetName + form.address) ? (form.provinceName + form.cityName + form.zoneName + form.streetName + form.address) : ''"
      :longitude="form.longitude"
      :latitude="form.latitude"
      @handleClose="amapClose"
      @selLngLat="selLngLat"
    ></amap>
    <!-- 地图坐标点选取-end -->
  </Modal>
</template>
<script>
import { addArea, getPlotDetail} from "@/api/dataManage";
import amap from "./amap";
import { mapState } from "vuex";
import addressCascader from "@/components/addressCascader/addressCascader";
import plotCascader from "@/components/plotCascader/plotCascader";
export default {
  components: {
    addressCascader,
    plotCascader,
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
    return {
      AreaType: this.$options.filters.statusList("AreaType"),
      subIsShow: false,
      effectiveTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      amap: {
        // 转码组件
        isShow: false
      },
      form: {
        type: null, //分类
        address: null, // 详细地址
        province: null,
        city: null,
        area: null,
        street: null,
        provinceName: null,
        cityName: null,
        areaName: null,
        streetName: null,
        userPhone: null,
        effectiveTime: null,
        plotNumber: null,
        buildingNumber: null,
        buildingName: null,
        doorNumber: null,
        doorName: null,
        longitude: null, //经度
        latitude: null // 纬度
      },
      rules: {
        type: [
          {
            type: "number",
            required: true,
            message: "请选择区域分类",
            trigger: "blur"
          }
        ],
        street: [
          {
            required: true,
            message: "请选择对应省市区街道",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (this.form.type === 2 && !this.form.doorNumber) {
                err = "备城门类用户要选择到最后一级门号";
              }
              callback(err);
            }
          }
        ],
        doorNumber: [
          {
            required: true,
            message: "请选择对应小区",
            trigger: "blur"
          }
        ],
        userPhone: [
          {
            required: true,
            message: "请填写用户手机号码",
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
        address: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur"
          },
          {
            max: 32,
            message: "地址长度不超过32个字符",
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
        effectiveTime: [
          {
            type: "date",
            required: true,
            message: "请选择服务结束时间",
            trigger: "blur"
          }
        ],
        areaName: [
          {
            required: true,
            message: "请填写区域名称",
            trigger: "blur"
          },
          {
            max: 250,
            message: "最多不超过10个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
    },
    "form.buildingName": {
      handler: function(val) {
        if (this.form.buildingName && this.form.buildingName != "暂不选择") {
          this.form.areaName =
            this.form.buildingName +
            (this.form.doorName && this.form.doorName !== "暂不选择"
              ? this.form.doorName
              : "");
        } else {
          this.form.areaName = "";
        }
      },
      immediate: true
    },
    "form.doorName": {
      handler: function(val) {
        if (this.form.buildingName && this.form.buildingName != "暂不选择") {
          this.form.areaName =
            this.form.buildingName +
            (this.form.doorName && this.form.doorName !== "暂不选择"
              ? this.form.doorName
              : "");
        } else {
          this.form.areaName = "";
        }
      },
      immediate: true
    },
    'form.plotNumber':function (val) {
        if (val){
            getPlotDetail({
                number: val
            }).then(({data, errorCode}) => {
                if (errorCode === 0) {
                    this.form.address = data.address
                }
            })
        } else {
            this.form.address = null
        }
    }
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            userPhone,
            areaName,
            effectiveTime,
            province,
            city,
            area,
            street,
            provinceName,
            cityName,
            zoneName,
            streetName,
            plotNumber,
            buildingNumber,
            doorNumber,
            address,
            type,
            longitude,
            latitude
          } = this.form;
          this.subIsShow = true;
          console.log("准备发送请求");
          addArea({
            type,
            longitude,
            latitude,
            userPhone,
            province,
            areaName,
            city,
            area,
            street,
            provinceName,
            cityName,
            zoneName,
            streetName,
            plotNumber,
            buildingNumber,
            doorNumber,
            address,
            effectiveTime: effectiveTime
              ? new Date(effectiveTime).getTime() / 1000
              : ""
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.subIsShow = false;
                this.$emit("handleClose", true);
                this.openHostManage()
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
    addressOnChange(value, obj) {
      this.form.province = obj[0] && obj[0].value;
      this.form.provinceName = obj[0] && obj[0].label;
      this.form.city = obj[1] && obj[1].value;
      this.form.cityName = obj[1] && obj[1].label;
      this.form.area = obj[2] && obj[2].value;
      this.form.zoneName = obj[2] && obj[2].label;
      this.form.street = obj[3] && obj[3].value;
      this.form.streetName = obj[3] && obj[3].label;
      this.form.plotNumber = obj[4] && obj[4].value;
      this.form.plotName = obj[4] && obj[4].label;
      this.form.buildingNumber = obj[5] && obj[5].value;
      this.form.buildingName = obj[5] && obj[5].label;
      this.form.doorNumber = obj[6] && obj[6].value;
      this.form.doorName = obj[6] && obj[6].label;
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
    
  }
};
</script>
<style lang="stylus" scoped></style>