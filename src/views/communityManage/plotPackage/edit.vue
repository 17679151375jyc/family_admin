<template>
  <Modal title="编辑" v-model.trim="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="name" label="名称">
        <Input v-model.trim="form.name" placeholder="请输入套餐名称" style="width:200px;" />
      </FormItem>
      <FormItem prop="month" label="月数">
        <InputNumber
          placeholder="请填写月数"
          v-model="form.month"
          :min="1"
          :max="9999"
          style="width: 200px;"
        ></InputNumber>
      </FormItem>
      <FormItem prop="price" label="原价">
        <InputNumber
          placeholder="请填写原价"
          v-model="form.price"
          :precision="2"
          :max="9999"
          style="width: 200px;"
        ></InputNumber>
      </FormItem>
      <FormItem prop="discount" label="折扣价">
        <InputNumber
          placeholder="请填写折扣价(选填)"
          v-model="form.discount"
          :precision="2"
          :max="9999"
          style="width: 200px;"
        ></InputNumber>
      </FormItem>
      <FormItem></FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { updatePlotPackage, getPackageDetail } from "@/api/communityManage";
export default {
  props: {
    id: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false,
      subIsLoading: false,
      form: {
        month: null,
        price: null,
        discount: null
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写套餐名称",
            trigger: "blur"
          }
        ],
        month: [
          {
            type: "number",
            required: true,
            message: "请填写月数",
            trigger: "blur"
          }
        ],
        price: [
          {
            type: "number",
            required: true,
            message: "请填写月数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    value: function(val) {
      this.visible = val;
      if (val) {
        this.getDetail();
      }
    },
    visible: function(val) {
      if (!val) {
        this.$refs["form"].resetFields();
      }
      this.$emit("input", val);
    }
  },
  methods: {
    getDetail() {
      getPackageDetail({ id: this.id }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.form = data;
        }
      });
    },
    /**
     * 提交数据
     */
    submit() {
      this.subIsLoading = true;
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, month, price, discount, id } = this.form;
          let data = {
            id,
            name,
            month,
            price,
            discount
          };
          updatePlotPackage(data)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功!");
                this.subIsLoading = false;
                this.visible = false;
              }
            })
            .catch(err => {
              this.subIsLoading = false;
            });
        } else {
          this.subIsLoading = false;
          this.$Message.error("提交信息有误!");
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.logo-wrapper {
  position: relative;
  width: 100px;
  height: 136px;

  .logo {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    margin-bottom: 4px;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  input {
    display: block;
    position: absolute;
    width: 100px;
    height: 30px;
    left: 0;
    bottom: 0;
    opacity: 0;
  }
}
</style>


