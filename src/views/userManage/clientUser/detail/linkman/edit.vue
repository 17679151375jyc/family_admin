<template>
  <Modal title="编辑家人信息" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="80">

      <FormItem prop="name" label="姓名">
        <Input v-model.trim="form.name" placeholder="请填写姓名" style="width: 200px;" />
      </FormItem>

      <FormItem prop="sex" label="性别">
        <RadioGroup v-model.trim="form.sex">
          <Radio label="0">男</Radio>
          <Radio label="1">女</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem prop="phone" label="联系方式">
        <Input v-model.trim="form.phone" placeholder="请填写联系方式" style="width: 200px;" />
      </FormItem>

    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getContactsDetail, updateContacts } from "@/api/userManage";
export default {
  props: {
    macNumber: {
      type: String,
      default: null
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      subIsShow: false,
      form: {
        name: null, 
        sex: null, 
        phone: null,
        userNumber: null
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写姓名",
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请填写电话",
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
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        // console.log(this.userNumber)
        this.getDetail()
      }
    }
  },
  mounted() {
  },
  methods: {
    getDetail(){
      console.log(this.id)
      getContactsDetail({
        id: this.id
      }).then(({data, errorCode}) => {
        if(errorCode === 0){
          if(data){
            this.form = data
            this.form.sex = data.sex.toString()
          }
            
        }
      })
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          console.log(this.form)
          updateContacts(this.form)
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
    }
  }
};
</script>
<style lang="stylus" scoped></style>


