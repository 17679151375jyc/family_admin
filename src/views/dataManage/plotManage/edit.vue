<template>
  <Modal
    title="编辑"
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
        <Input v-model.trim="form.plotName" disabled placeholder="请输入小区名称，最多32个字符" style="width: 250px;" />
      </FormItem>
      <FormItem prop="street" label="省市区街道">
        <address-cascader
          style="width: 300px;"
          ref="addressCascader"
          :clearable="false"
          :valueArr="PCAS"
          :disabled="true"
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

      <FormItem prop="faceCount" label="添加家人人脸个数" v-if='form.communityCanUse'>
        <InputNumber
          :max="9999"
          :min="5"
          v-model="form.faceCount"
          style="width:250px;"
          placeholder="请输入家人人脸个数"
        ></InputNumber>
      </FormItem>
      <FormItem prop="accountCount" label="　每户账号个数 （包含邀请家人)" v-if='form.communityCanUse'>
        <InputNumber
          :max="9999"
          :min="5"
          v-model="form.accountCount"
          style="width:250px;"
          placeholder="请输入每户账号个数"
        ></InputNumber>
      </FormItem>
      <FormItem prop="payType" label="收费类型" v-if='form.communityCanUse'>
        <Select v-model="form.payType" placeholder="请选择收费类型" style="width: 250px;">
          <Option v-for="(item, index) in PayTypeList" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
        <FormItem
          prop="effectiveTime"
          :label="form.payType===2 ? '免费天数' : '有效时间'"
          v-if="(form.payType!=null || form.payType!=undefined)&&form.communityCanUse"
        >
          <DatePicker
            ref="effectiveTime"
            v-if="form.payType===0 || form.payType===1"
            type="datetime"
            :value="effectiveTime"
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
      <FormItem prop="temporaryCount" label="访客可预约车辆个数"  v-if='form.communityCanUse'>
        <InputNumber
          :max="9999"
          :min="0"
          v-model="form.temporaryCount"
          style="width: 250px;"
          placeholder="请输入访客可预约车辆个数"
        ></InputNumber>
      </FormItem>
      <FormItem prop="isIdentity" label="访客是否填写身份证" v-if='form.communityCanUse'>
          <i-switch v-model="form.isIdentity" :true-value="1" :false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
          </i-switch>
      </FormItem>
      <FormItem prop="remark" label="备注">
        <Input type="textarea" :rows="4" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>

    <amap
      :isShow="amap.isShow"
      :address="form.address"
      :longitude="form.longitude"
      :latitude="form.latitude"
      @handleClose="amapClose"
      @selLngLat="selLngLat"
    ></amap>
  </Modal>
</template>
<script>
import { getPlotDetail, updatePlot, getCompanyList } from "@/api/dataManage";
import addressCascader from "@/components/addressCascader/addressCascader";
import amap from "./amap";
export default {
  components: {
    amap,
    addressCascader
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
      isReady: false,
      amap: {
        // 转码组件
        isShow: false
      },
      companyList: [],
      subIsShow: false,
      PayTypeList: this.$options.filters.statusList("PayType"),
      effectiveTime: null,
      form: {
        plotName: null,
        province: null,
        city: null,
        area: null,
        street: null,
        provinceName: null,
        areaName: null,
        cityName: null,
        streetName: null,
        address: null,
        longitude: null, // 经度
        latitude: null, //纬度
        communityCanUse: null, // 小区是否用于加入社区
        companyId: null,
        parkId: null,
        faceCount: 5, // 人脸免费个数
        accountCount: 5, // 加入社区账号个数
        payType: null, // 收费类型
        effectiveTime: null, // 有效时间，收费类型是0，1时为具体时间 ，2时为天数
        remark: null, // 备注
        temporaryCount: 0, //预约车数量
        isIdentity: 0, // 是否需要填身份证
      },
      info: {
        address: null,
        areaName: null,
        area: null,
        city: null,
        cityName: null,
        communityCanUse: null,
        id: null,
        latitude: null,
        longitude: null,
        plotName: null,
        plotNumber: null,
        province: null,
        provinceName: null,
        street: null,
        streetName: null,
        parkId: null,
        faceCount: 5, // 人脸免费个数
        accountCount: 5, // 加入社区账号个数
        payType: null, // 收费类型
        effectiveTime: null, // 有效时间，收费类型是0，1时为具体时间 ，2时为天数
        remark: null, // 备注
        temporaryCount: 0 //预约车数量
      }
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
            message: "请输入人脸免费人数",
            trigger: "blur"
          }
        ],
        accountCount: [
          {
            type: "number",
            required: true,
            message: "请输入免费加入社区账号个数",
            trigger: "blur"
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
            message: "请选择有效时间"
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
    },
    PCAS: function() {
      let { province, city, area, street } = this.form;
      if (province) {
        return [province, city, area, street];
      } else {
        return [];
      }
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.info = {
          address: null,
          areaName: null,
          area: null,
          city: null,
          cityName: null,
          communityCanUse: null,
          id: null,
          latitude: null,
          longitude: null,
          plotName: null,
          plotNumber: null,
          province: null,
          provinceName: null,
          street: null,
          streetName: null
        };
        this.getDetail();
      } else {
        this.isReady = false;
        this.effectiveTime = null;
        this.$refs["form"].resetFields();
        this.$refs["effectiveTime"] &&
          this.$refs["effectiveTime"].handleClear();
      }
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
      if (this.isReady) {
        this.form.effectiveTime = null;
        this.$refs["effectiveTime"] &&
          this.$refs["effectiveTime"].handleClear();
      }
    }
  },
  methods: {
    getDetail() {
      // 获取详情
      getPlotDetail({
        number: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          let {
            longitude,
            latitude,
            address,
            communityCanUse,
            plotName,
            province,
            provinceName,
            city,
            cityName,
            area,
            areaName,
            street,
            streetName,
            companyId,
            parkId,
            faceCount,
            accountCount,
            payType,
            effectiveTime,
            remark,
            temporaryCount,
            isIdentity
          } = data;
          this.info = data;
          this.form.longitude = longitude;
          this.form.latitude = latitude;
          this.form.address = address;
          this.form.communityCanUse = communityCanUse ? 1 : 0;
          this.form.plotName = plotName;
          this.form.province = province;
          this.form.provinceName = provinceName;
          this.form.city = city;
          this.form.cityName = cityName;
          this.form.area = area;
          this.form.areaName = areaName;
          this.form.street = street;
          this.form.streetName = streetName;
          this.form.companyId = companyId;
          this.form.parkId = parkId;
          this.form.faceCount = faceCount;
          this.form.accountCount = accountCount;
          this.form.payType = payType;
          this.form.effectiveTime = effectiveTime;
          this.form.temporaryCount = temporaryCount;
          this.form.remark = remark;
          this.form.isIdentity = isIdentity
          if ((payType === 0 || payType === 1) && effectiveTime) {
            this.effectiveTime = this.$moment(effectiveTime * 1000).format(
              "YYYY-MM-DD HH:mm"
            );
          }
          setTimeout(() => {
            this.isReady = true;
          }, 100);
        }
      });
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
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { id } = this.info;
          let {
            companyId,
            province,
            area,
            city,
            street,
            provinceName,
            areaName,
            cityName,
            streetName,
            address,
            plotName,
            longitude,
            latitude,
            communityCanUse,
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
          updatePlot({
            companyId,
            id,
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
            parkId,
            faceCount,
            accountCount,
            payType,
            effectiveTime,
            remark,
            temporaryCount,
            isIdentity
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
     * 省市区选择改变时
     */
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
<style lang="stylus" scoped></style>


