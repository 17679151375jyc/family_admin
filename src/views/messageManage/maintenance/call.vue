<!--选择出警人员-->
<template>
  <Modal title="请求维保" v-model.trim="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="orderTime" label="预约时间">
        <DatePicker
          v-model.trim="form.orderTime"
          :options="orderTimeOptions"
          type="date"
          placeholder="选择预约时间"
          style="width: 250px"
        ></DatePicker>
      </FormItem>
      <FormItem prop="content" label="内容">
        <Input v-model="form.content" type="textarea" :rows="4" placeholder="请填写内容" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { maintenanceCallUser } from "@/api/messageManage";
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
      orderTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      form: {
        content: "",
        orderTime: null
      },
      rules: {
        content: [
          {
            required: true,
            message: "请填写误报备注",
            trigger: "blur"
          }
        ],
        orderTime: [
          {
            type: "date",
            required: true,
            message: "请选择预约上门时间",
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
      this.$emit("input", val);
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { content, orderTime } = this.form;
          this.subIsLoading = true;
          maintenanceCallUser({
            number: this.number,
            content,
            orderTime: (new Date(orderTime).getTime() / 1000).toFixed(0)
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