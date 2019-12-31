<template>
  <Modal
    title="编辑"
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
      <FormItem label="使用默认密码">
        <Tooltip content="默认密码为:（q123456）" placement="right-end" theme="light" :delay="500">
            <i-switch v-model="openStatus" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </Tooltip>
      </FormItem>
      <FormItem prop="password" label="输入密码" style='width: 300px' v-if='!openStatus'>
        <Input v-model="form.password" placeholder="请输入密码" type='password'/>
      </FormItem>
      <FormItem prop="againPassWord" label="再次确认密码" style='width: 300px'  v-if='!openStatus'>
        <Input v-model="form.againPassWord" placeholder="请二次输入密码" type='password'/>
      </FormItem>     
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>

  </Modal>
</template>
<script>
import { resetPassWord } from '@/api/userManage'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    phone: {
      type: String,
      default: null
    },
    areaNumber: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      businessList: [],
      subIsShow: false,
      openStatus: false,
      form: {
        phone: null,
        password: null,
        againPassWord: null
      },
      rules: {
          password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              let datas = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,18})$/;
              if (!datas.test(value)) {
                err = "请输入请正确的密码";
              }
              callback(err);
            }
          }
        ],
        againPassWord: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if(val){

      }
    }
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
        if(!this.openStatus){
            this.$refs["form"].validate(async valid => {
                if (valid) {
                    if(this.form.password == this.form.againPassWord){
                        resetPassWord({
                            phone: this.phone,
                            password: this.form.password
                        }).then(({ errorCode }) => {
                            if (errorCode === 0) {
                                this.$Message.success("重置成功");
                                this.subIsShow = false;
                                this.$emit("handleClose");
                            }
                        }).catch(err => {
                            this.subIsShow = false;
                        });
                    }else{
                        this.$Message.error("两次密码输入不一致");
                    }
                } else {
                this.$Message.error("提交信息有误");
                }
            });
        }else{
            resetPassWord({
                phone: this.phone,
                password: 'q123456'
            }).then(({ errorCode }) => {
                if (errorCode === 0) {
                    this.$Message.success("重置成功");
                    this.subIsShow = false;
                    this.$emit("handleClose");
                }
            }).catch(err => {
                this.subIsShow = false;
            });       
        }
      
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>