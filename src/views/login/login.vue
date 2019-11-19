<template>
  <div class="wrapper" :style="{'background-image': `url(${require('_a/images/bg.jpg')})`}">
    <div class="login">
      <div class="login-img">
        <img :src="require('_a/logo.png')" width="300" height="53" />
      </div>
      <div class="form-wrapper">
        <Form
          ref="loginForm"
          :model="form"
          :rules="rules"
          @keyup.enter.native="handleSubmit('loginForm')"
          :label-width="60"
          class="form"
        >
          <FormItem prop="userName" label="账号" class="form-item">
            <Input type="text" v-model.trim="form.userName" placeholder="请输入您的手机账号"></Input>
          </FormItem>
          <FormItem prop="password" label="密码" class="form-item">
            <Input type="password" v-model.trim="form.password" placeholder="请输入您的密码"></Input>
          </FormItem>
          <Button type="primary" class="sub" @click="handleSubmit('loginForm')">登 录</Button>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import { login } from "@/api/user";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      CompanyType: this.$options.filters.statusList('CompanyType'),
      form: {
        userName: "",
        password: ""
      },
      rules: {
        userName: {
          //   required: true,
          message: "用户名不能为空",
          trigger: "blur"
        },
        password: {
          //   required: true,
          message: "密码不能为空",
          trigger: "blur"
        }
      }
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      companyType: state => state.user.companyType
    })
  },
  methods: {
    ...mapActions(["handleLogin"]),
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          //   return new Promise((resolve, reject) => {
          //     login({
          //       userName: this.form.userName,
          //       password: this.form.password
          //     })
          //       .then(res => {
          //         console.log("打印请求数据", res);
          //         resolve();
          //       })
          //       .catch(err => {
          //         reject(err);
          //       });
          //   });
          this.handleLogin({
            userName: this.form.userName,
            password: this.form.password
          }).then(res => {
            console.log("请求成功", this.$config.homeName);
            console.log(this.companyType);
            if (this.companyType === 1) { // 如果公司类型为物管，就跳到物管首页
                this.$router.push({
                name: this.$config.communityHomeName
              });
            } else {
              this.$router.push({
                name: this.$config.homeName
              });
            }
          });
        } else {
          this.$Message.error("提交信息有误!");
        }
      });
    },
    enterClick() {
      console.log("点击了enter");
    }
  }
};
</script>
<style lang="stylus" scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-origin: center center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .login {
    width: 600px;
    height: 650px;
    background: #fff;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);

    .login-img {
      margin: 80px 0;
    }

    .form-wrapper {
      margin-top: 20px;
      margin-bottom: 100px;

      .form {
        width: 400px;
        margin: 0 auto;

        >>>.ivu-form-item-label {
          font-size: 20px;
          color: #333;
        }

        .form-item {
          height: 60px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);

          >>>.ivu-form-item-content {
            margin-left: 0 !important;
            flex: 1 !important;

            .ivu-input {
              height: 40px;
              font-size: 14px;
              border: none;
            }
          }
        }
        .sub {
          width: 400px;
          height: 60px;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>

