<template>
  <Modal title="添加" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="companyType" label="公司类型">
        <Select v-model.trim="form.companyType" placeholder="请选择公司类型" style="width:200px;">
          <Option v-for="(item, index) in company" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" label="名称">
        <Input
          v-model.trim="form.name"
          placeholder="请输入公司名称"
          :maxlength="32"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="code" label="公司代码" v-if="!parentId">
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
import { addCompany } from "@/api/dataManage";
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
    parentId: {
      type: String,
      default: null
    },
    code: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      company: this.$options.filters.statusList('CompanyType'),
      subIsShow: false,
      form: {
        companyType: null,
        name: null, // 公司名
        code: null, // 公司代码
        linkman: null, // 联系人
        linkphone: null, // 联系电话
        province: null, //省
        city: null, // 市
        area: null, // 区
        street: null, // 街道
        address: null, // 详细地址
        rank: 0, // 排序
        provinceName: null, // 省名
        cityName: null,
        areaName: null,
        street: null,
        parentId: this.parentId, // 父级id
        parentIds: this.parentIds // 父级id
      },
      rules: {
        companyType: [
          {
            type: "number",
            required: true,
            message: "请选择公司类型",
            trigger: "blur"
          }
        ],
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
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      this.$refs["addressCascader"].resetData();
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
            companyType,
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
            rank
          } = this.form;

          let data = {
            companyType,
            name,
            code: this.code ? this.code : code,
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
            rank
          };
          if (this.parentId) {
            // 如果有传父级id过来，就添加到字段中，没有就不添加
            data = Object.assign(data, {
              parentId: this.parentId
            });
          }
          console.log(data);
          addCompany(data)
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
     * 地址选择组件改变
     */
    addressCascaderChange(value, valueText) {
      console.log("地址内容", value, valueText);
      this.form.province = value[0];
      this.form.provinceName = valueText[0].label;
      this.form.city = value[1];
      this.form.cityName = valueText[1].label;
      this.form.area = value[2];
      this.form.areaName = valueText[2].label;
      this.form.street = value[3];
      this.form.streetName = valueText[3].label;
    }
  }
};
</script>
<style lang="stylus" scoped></style>


