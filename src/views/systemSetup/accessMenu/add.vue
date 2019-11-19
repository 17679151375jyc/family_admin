<template>
  <Modal title="添加权限" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="name" label="名称">
        <Input v-model.trim="form.name" placeholder="请输入权限名称" style="width: 200px;"/>
      </FormItem>
      <FormItem prop="code" label="code">
          <Input v-model.trim="form.code" placeholder="请输入唯一的code" style="width: 200px;"/>
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
import { addAccessMenu } from "@/api/systemSetup";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    parentId: {
        default: 0
    },
    code: {
        type: String,
        default: ''
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
        url: "",
        name: "",
        code: '',
        rank: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入权限名称",
            trigger: "blur"
          }
        ],
        code: [
            {
                required: true,
                message: '请输入code',
                trigger: 'blur'
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
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, url, rank, code} = this.form;
          this.subIsShow = true;
          let data = {
            name: name,
            code: this.parentId ? `${this.code}.${code}` : code,
            url: url,
            parentId: this.parentId || 0,
            rank: rank || 0
          }
          addAccessMenu({
            name: name,
            code: this.parentId ? `${this.code}.${code}` : code,
            url: url,
            parentId: this.parentId || 0,
            rank: rank || 0
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
<style lang="stylus" scoped></style>


