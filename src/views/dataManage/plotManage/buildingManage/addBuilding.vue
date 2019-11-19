<template>
  <!-- 添加楼号的弹窗-start -->
  <Modal title="添加楼座" v-model.trim="isShow" :mask-closable="true" width="400">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="50">
      <FormItem prop="name" label="楼座">
        <Input v-model.trim="form.name" placeholder="请输入楼号,不超过8个字符" style="width: 200px;" />
      </FormItem>
    </Form>
    <div slot="footer">
      <!-- <Button type="text" @click="handleClose">取消</Button> -->
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
  <!-- 添加楼号的弹窗-end -->
</template>
<script>
import { addBuilding } from "@/api/dataManage";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    plotNumber: {
        type: String,
        default: ''
    }
  },
  watch: {
      isShow: function () {
          this.$refs['form'].resetFields();
      }
  },
  data() {
    return {
      subIsLoading: false, // 是否提交中
      form: {
        name: null // 楼座名
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写楼座号",
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
  methods: {
    /**
     * 关闭操作
     */
    handleClose(isRefresh = false) {
      this.$emit("handleClose", isRefresh);
    },
    /**
     * 提交操作
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          let {name} = this.form
          addBuilding({
            plotNumber: this.plotNumber,
            buildingName: name
          })
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.handleClose(true)
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