<template>
  <Modal
    title="绑定业务单"
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
      <FormItem prop="installId" label="选择业务单">
        <Select v-model='form.installId' style='width: 200px'>
          <Option :value='item.id' v-for='(item, index) in businessList' :key='index'>{{ item.name }}</Option>
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
import { choiceBusiness, bindBusiness} from '@/api/hostManage'
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
      form: {
        areaNumber: null,
        installId: null
      },
      rules: {
        installId: [
          {
            required: true,
            message: "请选择业务单",
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
        this.getDetail()
        this.form.areaNumber = this.areaNumber;
      }
    }
  },
  methods: {
    getDetail(){
      console.log(this.phone)
      choiceBusiness({
        phone: this.phone
      }).then(({errorCode, data})=>{
        if(errorCode === 0){
          if(data){
            console.log(data)
            this.businessList = data;
          }else{
            this.businessList = [];
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
          bindBusiness(this.form).then(({ errorCode }) => {
            if (errorCode === 0) {
              this.$Message.success("绑定成功");
              this.subIsShow = false;
              this.$emit("handleClose", true);
            }
          }).catch(err => {
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