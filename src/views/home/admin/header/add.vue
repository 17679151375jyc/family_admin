<template>
  <Modal
    title="修改密码"
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

    <!-- <span>{{companyList[0].name}}</span> -->
    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem prop="oldPassword" label="现在的密码">
        <Input
          type="password"
          v-model.trim="form.oldPassword"
          placeholder="请填写密码"
          style="width:200px;"
        />
      </FormItem>
      <FormItem prop="password" label="新密码">
        <Input
          type="password"
          v-model.trim="form.password"
          placeholder="请填写新密码"
          style="width:200px;"
        />
      </FormItem>
      <FormItem prop="otherPassword" label="再次输入新密码">
        <Input
          type="password"
          v-model.trim="form.otherPassword"
          placeholder="请填写新密码"
          style="width:200px;"
        />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { changePassWord } from "@/api/user";
import { mapActions, mapState } from "vuex";
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
      subIsShow: false,
      form: {
        oldPassword: null,
        password: null,
        otherPassword: null
      },
      rules: {
        oldPassword: [
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
            validator: (rule, value, callback, source, options) =>{
              let err = [];
              if (!this.$options.filters.password(value)) {
                err = "填写6-20位由字母和数字组成密码";
              }
              callback(err);
            }
          }
        ],
        otherPassword: [
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
            validator: (rule, value, callback, source, options) =>{
              let err = [];
              if (!this.$options.filters.password(value)) {
                err = "填写6-20位由字母和数字组成密码";
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
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["handleLogout"]),
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { oldPassword, password, otherPassword } = this.form;
          this.subIsShow = true;
          if (password == otherPassword) {
            changePassWord(this.form)
              .then(({ data, errorCode }) => {
                if (errorCode === 0) {
                  this.$Message.success("修改成功");
                  this.subIsShow = false;
                  this.$emit("handleClose", true);
                  this.handleLogout();
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$Message.error("两次输入的新密码不一致");
            this.subIsShow = false;
          }
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
.Option_css {
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
}

.Option_top {
  margin-top: -20px;
}
</style>


