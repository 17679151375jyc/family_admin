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

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="phone" label="手机号码">
        <Input v-model.trim="form.phone" placeholder="请输入手机号码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="password" label="密码">
        <Input v-model.trim="form.password" placeholder="请输入密码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="roleId" label="所属角色">
        <Select v-model.trim="form.roleId" placeholder="请选择所属角色" style="width: 200px;">
          <Option v-for="(item,index) in roleList" :key="index" :value="item.id">{{item.roleName}}</Option>
        </Select>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addAccount, getRoleList } from "@/api/systemSetup";
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
      roleList: [],
      subIsShow: false,
      form: {
        phone: "",
        password: "",
        roleId: ""
      },
      rules: {
        phone: [
          {
            required: true,
            message: "请填写手机号码",
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
        password: [
          {
            required: true,
            message: "填写6-20位由字母和数字组成密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "密码长度在6-20个字符之间",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.password(value)) {
                err = "填写6-20位由字母和数字组成密码";
              }
              callback(err);
            }
          }
        ],
        roleId: [
          {
            type: "number",
            required: true,
            message: "请选择对应的角色",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      this.getRoleList();
    }
  },
  methods: {
    /**
     * @method getRoleList 获取角色列表
     */
    getRoleList() {
      getRoleList({}).then(({ data: { list }, errorCode }) => {
        if (errorCode === 0) {
          this.roleList = list;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { phone, password, roleId } = this.form;
          this.subIsShow = true;
          addAccount({
            phone,
            password,
            roleId
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


