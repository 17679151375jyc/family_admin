<template>
  <div>
    <Modal title="添加" v-model.trim="visible" :mask-closable="false">
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem prop="businessName" label="商家名称">
          <Input v-model.trim="form.businessName" placeholder="请填写商家名称" style="width:200px;" />
        </FormItem>
        <FormItem prop="contactName" label="联系人">
          <Input v-model.trim="form.contactName" placeholder="请填写商家联系人" style="width:200px;" />
        </FormItem>
        <FormItem prop="contactPhone" label="联系电话">
          <Input v-model.trim="form.contactPhone" placeholder="请填写联系电话" style="width:200px;" />
        </FormItem>
        <FormItem prop="isEffective" label="是否有效">
          <i-switch size="large" v-model.trim="form.isEffective" :true-value="1" :false-value="0">
            <span slot="open">有效</span>
            <span slot="close">无效</span>
          </i-switch>
        </FormItem>
        <FormItem prop="description" label="介绍描述">
          <Input
            maxlength="100"
            show-word-limit
            type="textarea"
            :rows="4"
            v-model.trim="form.description"
            placeholder="请填写商家介绍描述"
            style="width:250px; "
          />
        </FormItem>
        <FormItem prop="businessLicense" label="营业执照">
          <upload v-model="form.businessLicense" fileNamePrefix="business"></upload>
        </FormItem>

        <FormItem prop="streetCode" label="省市区街道">
          <address-cascader
            style="width: 250px;"
            ref="addressCascader"
            :showLevel="4"
            allText="暂不选择"
            @onChange="addressOnChange"
          ></address-cascader>
        </FormItem>
        <FormItem prop="address" label="详细地址">
          <Input v-model.trim="form.address" placeholder="请填写详细地址" style="width: 250px" />
        </FormItem>

        <FormItem prop="longitude" label="详细坐标">
          <Tag
            :color="form.longitude ? 'success' : 'default'"
          >{{`[${form.longitude ? form.longitude : '未选择'}, ${form.latitude ? form.latitude : '未选择'}]`}}</Tag>
          <Button type="info" size="small" @click="ChooseLngLat.isShow = true">地图选择</Button>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" @click="visible=false">取消</Button>
        <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
      </div>
    </Modal>

    <choose-lng-lat
      v-model="ChooseLngLat.isShow"
      :longitude="form.longitude"
      :latitude="form.latitude"
      :keyword="lngLatKeyWord"
      @changeLngLat="changeLngLat"
    ></choose-lng-lat>
  </div>
</template>
<script>
import { addBusiness } from "@/api/dataManage";
import Upload from "@/components/upload/upload";
import AddressCascader from "@/components/addressCascader/addressCascader";
import ChooseLngLat from "@/components/chooseLngLat/chooseLngLat";
export default {
  components: {
    Upload,
    AddressCascader,
    ChooseLngLat
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      subIsLoading: false,
      ChooseLngLat: {
        isShow: false
      },
      form: {
        businessName: null, // 商家名称
        contactName: null, //联系人
        contactPhone: null, // 联系人电话
        isEffective: 1, //是否有效
        description: null, // 介绍描述
        businessLicense: null,
        provinceCode: null,
        provinceName: null,
        cityCode: null,
        cityName: null,
        areaCode: null,
        areaName: null,
        streetCode: null,
        streetName: null,
        longitude: null,
        latitude: null,
        address: null
      },
      rules: {
        businessName: [
          {
            required: true,
            message: "请填写商家名称",
            trigger: "blur"
          }
        ],
        contactName: [
          {
            required: true,
            message: "请填写联系人姓名",
            trigger: "blur"
          }
        ],
        contactPhone: [
          {
            required: true,
            message: "请填写联系人电话",
            trigger: "blur"
          },
        //   {
        //     validator: (rule, value, callback) => {
        //       let err = [];
        //       if (!this.$options.filters.phone(value)) {
        //         err = "请填写正确的手机号码";
        //       }
        //       callback(err);
        //     }
        //   }
        ],
        streetCode: [
          {
            required: true,
            message: "请选择省市区街道",
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
        longitude: [
          {
            type: "number",
            required: true,
            message: "请选择商家详细坐标点",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (!val) {
        this.$refs["form"].resetFields();
        this.$set(this.form, "latitude", null);
        this.$set(this.form, "longitude", null);
        this.$refs["addressCascader"].resetData();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    lngLatKeyWord() {
      let lngLatKeyWord = "";
      let { provinceName, cityName, areaName, streetName, address } = this.form;
      if (provinceName) {
        lngLatKeyWord = provinceName + cityName + areaName + streetName;
      }
      if (address) {
        lngLatKeyWord = lngLatKeyWord + address;
      }
      return lngLatKeyWord;
    }
  },
  methods: {
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          addBusiness(this.form)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.visible = false;
                this.subIsLoading = false;
              }
            })
            .catch(err => {
              this.subIsLoading = false;
            });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 省市区地址数据变化
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


