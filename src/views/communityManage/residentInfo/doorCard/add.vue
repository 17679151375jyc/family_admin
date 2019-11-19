<template>
  <Modal title="添加门卡" v-model="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="cardNumber" label="卡号">
        <Input v-model.trim="form.cardNumber" placeholder="请填写卡号" style="width:200px;" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" :loading="subIsLoading" @click="submit">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addDoorCard } from "@/api/communityManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    plotNumber: {
      type: String,
      default: ""
    },
    domicileNumber: {
      type: String,
      default: ""
    },
    buildingNumber: {
      type: String,
      default: ""
    },
    buildingName: {
      type: String,
      default: ""
    },
    doorNumber: {
      type: String,
      default: ""
    },
    doorName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      subIsLoading: false,
      form: {
        cardNumber: "",
        type: 2 // 2表示业主卡，1表示物管卡
      },
      rules: {
        cardNumber: [
          {
            required: true,
            message: "请填写卡号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      if (!val) {
        this.$refs["form"].resetFields();
      }
      this.$emit("input", val);
    }
  },
  methods: {
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          let { cardNumber } = this.form;
          addDoorCard({
            cardNumber,
            type: 2,
            domicileNumber: this.domicileNumber,
            plotNumber: this.plotNumber,
            buildingNumber: this.buildingNumber,
            buildingName: this.buildingName,
            doorNumber: this.doorNumber,
            doorName: this.doorName
          })
            .then(({ data, errorCode }) => {
              this.subIsLoading = false;
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.visible = false;
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
