<!--选择出警人员-->
<template>
  <Modal title="忽略维保消息" v-model.trim="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="remarks" label="忽略备注">
        <Input v-model="form.remarks" type="textarea" :rows="4" placeholder="请填写忽略备注" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { maintenanceIgnore } from "@/api/messageManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    number: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      subIsLoading: false,
      form: {
        remarks: ""
      },
      rules: {
        remarks: [
          {
            required: true,
            message: "请填写误报备注",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    value: function(val) {
      this.visible = val;
    },
    visible: function(val) {
      if (!val) {
        this.$refs["form"].resetFields();
      }
      this.$emit("input", val);
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { remarks } = this.form;
          this.subIsLoading = true;
          maintenanceIgnore({
            number: this.number,
            remarks
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("修改成功");
                this.visible = false;
                this.subIsLoading = false;
              }
            })
            .catch(err => {
              this.subIsLoading = false;
            });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    }
  }
};
</script>