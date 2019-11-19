<template>
  <Modal title="添加门号" v-model.trim="isShow" :mask-closable="true" width="400">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->
    <Form ref="form" :model="form" :rules="rules" :label-width="50">
      <FormItem prop="name" label="门号">
        <Input v-model.trim="form.name" placeholder="请输入门号,不超过8个字符" style="width: 200px;" />
      </FormItem>
    </Form>
    <div slot="footer">
      <!-- <Button type="text" @click="handleClose">取消</Button> -->
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addDoor } from "@/api/dataManage";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    plotNumber: {
      type: String,
      default: ""
    },
    buildingNumber: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      subIsLoading: false,
      form: {
          name: null,
      },
      rules: {
          name: [
              {
            required: true,
            message: "请填写门号",
            trigger: "blur"
          },
          {
            max: 8,
            message: "长度不超过8个字符",
            trigger: "blur"
          }
          ]
      }
    };
  },
  watch: {
      isShow:function () {
          this.$refs['form'].resetFields()
      }
  },
  methods: {
    /**
     * 关闭操作
     */
    handleClose(isRefresh = false) {
      this.$emit("handleClose", isRefresh);
    },
    /**
     * 提交
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          let {name} = this.form
          addDoor({
            plotNumber: this.plotNumber,
            buildingNumber: this.buildingNumber,
            doorName: name
          })
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.handleClose(true);
              }
              this.subIsLoading = false;
            })
            .catch(() => {
              this.subIsLoading = false;
            });
        }
      });
    }
  }
};
</script>