<template>
  <Modal title="编辑" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="公司类型">
          {{form.companyType | statusName('CompanyType')}}
      </FormItem>
      <FormItem prop="name" label="名称">
        <Input
          v-model.trim="form.name"
          placeholder="请输入公司名称"
          :maxlength="32"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="code" label="公司代码">
        <Input v-model.trim="form.code" placeholder="请填写公司代码" style="width:200px;" />
      </FormItem>
      <FormItem prop="linkman" label="联系人">
        <Input v-model.trim="form.linkman" placeholder="请填写公司联系人" style="width:200px;" />
      </FormItem>
      <FormItem prop="linkphone" label="联系电话">
        <Input v-model.trim="form.linkphone" placeholder="请填写联系电话" style="width:200px;" />
      </FormItem>
      <FormItem prop="province" label="省市区街道">
        <address-cascader
          ref="addressCascader"
          @onChange="addressCascaderChange"
          :valueArr="PCAS"
          style="width: 300px;"
        ></address-cascader>
      </FormItem>
      <FormItem prop="address" label="详细地址">
        <Input v-model.trim="form.address" placeholder="请输入详细地址" style="width:300px;" />
      </FormItem>
      <FormItem prop="rank" label="排序">
        <InputNumber :min="0" :max="999" v-model.trim="form.rank"></InputNumber>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { updateCompany, getCompanyDetail } from "@/api/dataManage";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    addressCascader
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getDetail();
      }
    }
  },
  computed: {
      PCAS: function() {
      let { province, city, area, street } = this.form;
      if (province) {
        return [province+'', city+'', area+'', street+''];
      } else {
        return [];
      }
    }
  },    
  data() {
    return {
      subIsShow: false,
      form: {
        id: null, //编辑的id
        name: null, // 公司名
        code: null, // 公司代码
        linkman: null, // 联系人
        linkphone: null, // 联系电话
        province: null, //省
        city: null, // 市
        area: null, // 区
        street: null, // 街道
        address: null, // 详细地址
        rank: null, // 排序
        provinceName: null, // 省名
        cityName: null,
        areaName: null,
        street: null,
        companyType: null
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入公司唯一代码",
            trigger: "blur"
          }
        ],
        linkman: [
          {
            required: true,
            message: "请输入公司联系人",
            trigger: "blur"
          }
        ],
        linkphone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) =>{
              let err = [];
              if (!this.$options.filters.phone(value)) {
                err = "请填写正确的手机号码";
              }
              callback(err);
            }
          }
        ],
        province: [
          {
            type: "number",
            required: true,
            message: "请选择省市区街道",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          }
        ],
        rank: [
          {
            type: "number",
            required: true,
            message: "请填写排序，默认为0",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    getDetail() {
      getCompanyDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          data.province = data.province-0
          data.city = data.city-0
          data.area = data.area-0
          data.street = data.street-0
          this.form = data;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            name,
            code,
            linkman,
            linkphone,
            province,
            city,
            area,
            street,
            address,
            provinceName,
            cityName,
            areaName,
            streetName,
            rank,
            id
          } = this.form;

          let data = {
            name,
            code,
            linkman,
            linkphone,
            province,
            city,
            area,
            street,
            address,
            provinceName,
            cityName,
            areaName,
            streetName,
            rank,
            id
          };
          updateCompany(data)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功");
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
     * 地址选择组件改变
     */
    addressCascaderChange(value, valueText) {
      console.log("地址内容", value, valueText);
      this.form.province = value[0]-0;
      this.form.provinceName = valueText[0].label;
      this.form.city = value[1]-0;
      this.form.cityName = valueText[1].label;
      this.form.area = value[2]-0;
      this.form.areaName = valueText[2].label;
      this.form.street = value[3]-0;
      this.form.streetName = valueText[3].label;
    }
  }
};
</script>
<style lang="stylus" scoped></style>


