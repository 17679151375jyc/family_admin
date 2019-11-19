<template>
  <Modal title="添加" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="userPhone" label="用户手机号">
        <Input v-model.trim="form.userPhone" placeholder="请输入用户手机号" style="width: 250px;" />
      </FormItem>
      <FormItem prop="areaName" label="区域名称">
        <Input v-model.trim="form.areaName" placeholder="请输入区域名称" style="width: 250px;" />
      </FormItem>
      <FormItem prop="street" label="省市区街道" v-if="isShow">
        <address-cascader
          style="width: 250px;"
          ref="addressCascader"
          :clearable="false"
          @onChange="addressOnChange"
        ></address-cascader>
      </FormItem>
      <FormItem prop="doorNumber" label="门牌号" v-if="form.street">
        <plot-cascader
          style="width: 250px;"
          :province="form.province"
          :city="form.city"
          :area="form.area"
          :street="form.street"
          :clearable="true"
          @onChange="plotOnChange"
        ></plot-cascader>
      </FormItem>
      <FormItem prop="address" label="详细地址">
          <Input v-model.trim="form.address" placeholder="请填写详细地址，不超过32个字符" style="width: 250px;"/>
      </FormItem>

      <FormItem prop="effectiveTime" label="服务结束时间">
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
  </Modal>
</template>
<script>
import { addArea } from "@/api/dataManage";
import addressCascader from "@/components/addressCascader/addressCascader";
import plotCascader from "@/components/plotCascader/plotCascader";
export default {
  components: {
    addressCascader,
    plotCascader
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
      effectiveTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      form: {
        address: null, // 详细地址
        province: null,
        city: null,
        area: null,
        street: null,
        areaName: null,
        userPhone: null,
        effectiveTime: null,
        plotNumber: null,
        buildingNumber: null,
        doorNumber: null
      },
      rules: {
        street: [
          {
            type: "number",
            required: true,
            message: "请选择对应省市区街道",
            trigger: "blur"
          }
        ],
        doorNumber: [
          {
            required: true,
            message: "请选择门牌号",
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
            validator: (rule, value, callback, source, options) =>{
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
                message: '请填写详细地址',
                trigger: 'blur'
            },
            {
                max: 32,
                message: '地址长度不超过32个字符',
                trigger: 'blur'
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
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
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
            plotNumber,
            buildingNumber,
            doorNumber,
            address
          } = this.form;
          this.subIsShow = true;
          console.log("准备发送请求");
          addArea({
            userPhone,
            areaName,
            province,
            city,
            area,
            street,
            plotNumber,
            buildingNumber,
            doorNumber,
            address,
            effectiveTime: new Date(effectiveTime).getTime() / 1000
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
    addressOnChange(value) {
      this.$set(this.form, "province", value[0]);
      this.$set(this.form, "city", value[1]);
      this.$set(this.form, "area", value[2]);
      this.$set(this.form, "street", value[3]);
    },
    plotOnChange(value) {
      this.form.plotNumber = value[0];
      this.form.buildingNumber = value[1];
      this.form.doorNumber = value[2];
    }
  }
};
</script>
<style lang="stylus" scoped></style>