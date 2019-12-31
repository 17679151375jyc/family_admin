<template>
  <Modal title="添加车辆" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="plotNumber" label="所属小区">
        <div style="display: flex;">
          <address-cascader
            ref="addressCascader"
            @onChange="addressCascaderChange"
            :showLevel="5"
            style="width: 250px"
          ></address-cascader>
        </div>
      </FormItem>
      <FormItem prop="carNumber" label="车牌号">
        <Input :value="form.carNumber" @input="e=> form.carNumber = e.toUpperCase()" placeholder="请填写车牌号" style="width: 250px;" />
      </FormItem>
      <FormItem prop="carOwnPhone" label="车主手机号">
        <Input v-model.trim="form.carOwnPhone" placeholder="请填写车主手机号" style="width: 250px;" />
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
import { addCar } from "@/api/communityManage";
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
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        streetCode: null,
        plotNumber: null,
        carNumber: null,
        carOwnPhone: null
      },
      rules: {
        carNumber: [
          {
            required: true,
            message: "请填写车牌号",
            trigger: "blur"
          },
          {
            validator:(rule, value, callback)=> {
              let err = [];
              let reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
              if ( !reg.test(value) ) {
                err = "请填写正确的车牌号";
              }
              callback(err);
            }
          }
        ],
        carOwnPhone: [
          {
            required: true,
            message: "请填写用户手机号码",
            trigger: "blur"
          },
          {
            validator:(rule, value, callback, source, options)=> {
              let err = [];
              if (!this.$options.filters.phone(value)) {
                err = "请填写正确的手机号码";
              }
              callback(err);
            }
          }
        ],
        plotNumber: [
          {
            required: true,
            message: "请选择对应省市区街道小区",
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
          this.subIsShow = true;
          let {
            carNumber,
            plotNumber,
            carOwnPhone
          } = this.form
          let data = {
            carNumber,
            plotNumber,
            carOwnPhone
          }
          addCar(data).then(({ errorCode }) => {
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
    addressCascaderChange(value) {
      this.form.provinceCode = value[0];
      this.form.cityCode = value[1];
      this.form.areaCode = value[2];
      this.form.streetCode = value[3];
      this.form.plotNumber = value[4];
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