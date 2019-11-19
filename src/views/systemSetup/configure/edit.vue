<template>
  <Modal title="编辑" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="90">
      <FormItem prop="value" label="请编辑" v-if="form.id !== 13 && form.id !== 34">
        <Input v-model.trim="form.value" placeholder="请填写新内容" style="width: 300px;" />
      </FormItem>
      <FormItem prop="value" label="请编辑" v-if="form.id == 13 ||  form.id == 34">
        <Row>
          <DatePicker type="datetime" v-model="form.value" format="yyyy-MM-dd HH:mm:ss" placeholder="请填写新内容" style="width: 200px"></DatePicker>
        </Row>
      </FormItem>
    </Form>


    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getConfigureDetail, updateConfigure } from "@/api/systemSetup";
export default {
  props: {
    number: {
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
    name: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      subIsShow: false,
      form: {
        id: null,
        name: null, 
        value: null,
      },
      rules: {
        value: [
          {
            type: 'date',
            required: true,
            message: "不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      getConfigureDetail({
        name: this.name
      }).then(({data, errorCode})=>{
        if(errorCode === 0){
          if(data.id == 13){
            this.rules.value[0].type = 'date'
            let {
              id,
              name,
              value
            } = data
            this.form = {
              id,
              name,
              value: this.$options.filters.formatTime(parseInt(value)/1000)
            }
          }else if(data.id == 34){
            this.rules.value[0].type = 'date'
            let {
              id,
              name,
              value
            } = data
            this.form = {
              id,
              name,
              value: this.$options.filters.formatTime(parseInt(value))
            }
          }else{
            this.rules.value[0].type = null
            this.form = data
          }
          console.log(data)
        }        
      })
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
          // console.log(new Date(this.form.value).getTime())
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let listValue = null;
          if(this.form.id == 13){
            listValue = {
              id: this.form.id,
              name: this.form.name,
              value: new Date(this.form.value).getTime()
            }
          }else{
            listValue = this.form
          }
          updateConfigure(listValue).then(({errorCode})=>{
            if (errorCode === 0) {
              this.$Message.success("修改成功");
              this.subIsShow = false;
              this.$emit("handleClose", true);
            }
          }).catch(err=>{
            this.subIsShow = false;
          })
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>


