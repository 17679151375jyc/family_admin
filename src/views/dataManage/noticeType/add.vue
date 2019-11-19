<template>
  <Modal
    title="添加"
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
    <!-- positionDesc: null, // 设备位置描述
        deviceType: null, // 设备类型
        logoUrl: null, // 上传的logo
        deviceName: null, // 设备附加名称 
        buildingNumber: null, // 楼座number
        plotNumber: null, // 小区编号 
    deviceAccount: null, // 设备账号-->
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="typeName" label="分类名称">
        <Input v-model.trim="form.typeName" placeholder="请填写分类名称" style="width:200px;" />
      </FormItem>
      <FormItem prop="files.path" label="icon图片">
        <upload v-model="form.files.path" fileNamePrefix="noticeType"></upload>
        <Tag color="warning">*icon图片建议大小为80*80像素</Tag>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addNoticeType } from "@/api/dataManage";
import upload from "@/components/upload/upload";
export default {
  components: { upload },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      subIsShow: false,
      form: {
        typeName: null,
        files: {
          fileName: "通知分类icon",
          path: "",
          isLoading: false
        }
      },

      rules: {
        typeName: [
          {
            required: true,
            message: "请填写分类名称",
            trigger: "blur"
          }
        ],
        "files.path": [
          {
            required: true,
            message: "请上传图片，建议尺寸为56*56像素",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
    }
  },
  methods: {
    handleClose() {
      // 当窗口关闭时触发
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { typeName, files } = this.form;
          this.subIsShow = true;
          addNoticeType({
            typeName,
            iconUrl: files.path
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
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


