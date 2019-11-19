<template>
  <Modal
    title="添加视频主机"
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
      <FormItem prop="defenceNumber" label="拍摄防区">
        <Select v-model.trim="form.defenceNumber" multiple placeholder="请选择所属防区" style="width: 200px;">
          <Option v-for="(item,index) in sectorList" :key="index" :value="item.number">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" label="视频主机名称">
        <Input v-model.trim="form.name" placeholder="请输入视频主机名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="deviceNumber" label="萤石序列号">
        <Input v-model.trim="form.deviceNumber" placeholder="请输入萤石视频序列号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="validateCode" label="设备验证码">
        <Input v-model.trim="form.validateCode" placeholder="设备机身上的六位大写字母" style="width: 200px;" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addVideoHost, getDefenceByMacNumber } from "@/api/hostManage";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    macNumber: {
      // 防盗主机number
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sectorListIsShow: false,
      sectorList: [],
      subIsShow: false,
      form: {
        defenceNumber: [],
        name: "",
        userPhone: "",
        deviceNumber: "",
        validateCode: ""
      },
      rules: {
        defenceNumber: [
          {
            type: "array",
            required: true,
            message: "请选择拍摄防区",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入视频主机名称",
            trigger: "blur"
          }
        ],
        userPhone: [
          {
            required: true,
            message: "请填写手机号码",
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
        deviceNumber: [
          {
            required: true,
            message: "请填写序列号",
            trigger: "blur"
          }
        ],
        validateCode: [
          {
            required: true,
            message: "请填写设备验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.$refs["form"].resetFields();
        this.getDefenceByMacNumber();
      }
      //   this.getRoleList();
    }
  },
  methods: {
    getDefenceByMacNumber() {
      getDefenceByMacNumber({
        machineNumber: this.macNumber
      })
        .then(({ data, errorCode }) => {
          this.sectorList = [];
          if (errorCode === 0) {
            this.sectorList = data;
          }
        })
        .catch(err => {});
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        console.log(valid);
        if (valid) {
          let { defenceNumber, name, deviceNumber, validateCode } = this.form;
          this.subIsShow = true;
          addVideoHost({
            defenceAreaNumber: defenceNumber.join(','),
            name,
            userPhone: this.phone,
            deviceNumber,
            validateCode
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
    }
  }
};
</script>
<style lang="stylus" scoped></style>


