<template>
  <!-- 添加楼号的弹窗-start -->
  <Modal title="编辑楼座" v-model.trim="isShow" :mask-closable="true" width="400">
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
import { getBuildingDetail, updateBuilding } from "@/api/dataManage";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    buildingNumber: {
      type: String,
      default: ""
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getDetail();
      }
    }
  },
  data() {
    return {
      subIsLoading: false, // 是否提交中
      info: {
        buildingIndex: null,
        buildingName: null,
        buildingNumber: null,
        id: null,
        plotNumber: null
      },
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
     * 获取详情
     */
    getDetail() {
      getBuildingDetail({
        buildingNumber: this.buildingNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          this.form.name = data.buildingName
        }
      });
    },
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
          let {buildingNumber} = this.info
          let { name } = this.form;
          updateBuilding({
            buildingNumber,
            buildingName: name
          })
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功");
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