<template>
  <Modal title="添加" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="phone" label="手机号码">
        <Input v-model.trim="form.phone" placeholder="请输入手机号码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="areaNumber" label="区域" v-show="areaList.length > 0">
        <Select v-model.trim="form.areaNumber" placeholder="请选择所属区域" style="width: 200px;">
          <Option
            v-for="(item,index) in areaList"
            :key="index"
            :value="item.areaNumber"
          >{{item.areaName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" label="主机名称">
          <Input v-model.trim="form.name" placeholder="请填写主机名称" style="width: 200px;"/>
      </FormItem>
      <FormItem prop="account" label="主机号">
        <Input v-model.trim="form.account" placeholder="请填写主机上的设备号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="position" label="安装位置">
        <Input v-model.trim="form.position" placeholder="请填写安装位置" style="width: 200px;" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getAreaByPhone } from "@/api/dataManage";
import { addSectorHost } from "@/api/hostManage";
export default {
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
      areaList: [], // 区域列表
      subIsShow: false,
      form: {
        name: "", // 主机名称
        phone: "", // 电话
        areaNumber: "",
        account: "", // 主机唯一账号
        position: "" // 安装位置
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写主机名称",
            trigger: "blur"
          }
        ],
        phone: [
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
        account: [
          {
            required: true,
            message: "请填写主机上的设备号",
            trigger: "blur"
          }
        ],
        areaNumber: [
          {
            required: true,
            message: "请选择对应的区域",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
    },
    "form.phone": function(val, oldVal) {
      if (this.$options.filters.phone(val)) {
        this.getAreaList();
      } else {
        this.areaList = [];
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    getAreaList() {
      getAreaByPhone({
        userPhone: this.form.phone
      })
        .then(({ data, errorCode }) => {
          if (errorCode === 0) {
            if (data.list.length > 0) {
              this.areaList = data.list;
            } else {
              this.$Message.warning({
                closable: true,
                content: "该用户没有添加区域，请先添加",
                duration: 5
              });
            }
          }
        })
        .catch(() => {});
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, account, areaNumber, position } = this.form;
          this.subIsShow = true;
          addSectorHost({
            name,
            account,
            areaNumber,
            position
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


