<template>
  <Modal
    title="编辑"
    v-model.trim="isShow"
    width="500"
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
      <FormItem prop="typeName" label="分类名称">
        <Input v-model.trim="form.typeName" placeholder="请填写分类名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="files.path" label="logo图片">
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
import { getNoticeTypeDetail, updateNoticeType } from "@/api/dataManage";
import upload from "@/components/upload/upload";
export default {
  components: { upload },
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
    }
  },
  data() {
    return {
      subIsShow: false,
      form: {
        noticeTypeNumber: null,
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
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getNoticeTypeDetail({
        noticeTypeNumber: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          let { noticeTypeNumber, typeName, iconUrl } = data;

          this.form.typeName = typeName;
          this.form.noticeTypeNumber = noticeTypeNumber;
          this.form.files.path = iconUrl;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { typeName, noticeTypeNumber, files } = this.form;
          this.subIsShow = true;
          updateNoticeType({
            typeName,
            noticeTypeNumber,
            iconUrl: files.path
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("修改成功");
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
    },
    /**
     * 选择市省区改变时
     */
    addressOnChange(value) {
      this.$set(this.form, "province", value[0]);
      this.$set(this.form, "city", value[1]);
      this.$set(this.form, "area", value[2]);
      this.$set(this.form, "street", value[3]);
    },
    /**
     * 选择小区改变时
     */
    plotOnChange(value) {
      if (this.form.deviceType === 0) {
        // 如果是小区门口机，只需要传小区number
        this.form.plotNumber = value[0];
      } else if (this.form.deviceType === 1) {
        // 如果是楼座门口机，要传小区number和楼座number
        this.form.plotNumber = value[0];
        this.form.buildingNumber = value[1];
      }
    },
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


