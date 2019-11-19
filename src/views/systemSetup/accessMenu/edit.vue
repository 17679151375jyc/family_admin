<template>
  <Modal title="编辑权限" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="name" label="名称">
        <Input v-model.trim="form.name" placeholder="请输入权限名称" style="width: 200px;"/>
      </FormItem>
      <FormItem label="code">
          {{form.code}}
      </FormItem>
      <FormItem prop="url" label="对应url">
        <Input v-model.trim="form.url" placeholder="请输入权限对应的url" style="width: 200px;"/>
      </FormItem>
      <FormItem prop="rank" label="排序">
        <Input v-model.trim="form.rank" placeholder="请填写排序" style="width: 200px;"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { updateAccess, getAccessDetail } from "@/api/systemSetup";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
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
        parentId: "",
        url: "",
        name: "",
        rank: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入权限名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getAccessDetail();
      }
    }
  },
  methods: {
    getAccessDetail() {
      getAccessDetail({
        jurisdictionId: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          let { name, parentId, code, url, rank } = data;
          this.form.name = name;
          this.form.parentId = parentId;
          this.form.rank = rank;
          this.form.url = url;
          this.form.code = code
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, url, rank, parentAllName, parentId } = this.form;
          this.subIsShow = true;
          updateAccess({
            id: this.id,
            name: name,
            allName: parentId ? `${parentAllName}.${name}` : name,
            url: url,
            parentId: parentId,
            rank: rank
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功");
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
<style lang="stylus" scoped></style>


