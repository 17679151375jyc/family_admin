<template>
  <Modal title="编辑" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="userName" label="账号">
        <Input v-model.trim="form.userName" placeholder="输入账号" style="width: 200px;" disabled/>
      </FormItem>
      <FormItem prop="roleId" label="所属角色">
        <Select v-model.trim="form.roleId" placeholder="请选择所属角色" style="width: 200px;">
          <Option v-for="(item,index) in roleList" :key="index" :value="item.id">{{item.roleName}}</Option>
        </Select>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import {
  updateAccount,
  getRoleList,
  getAccountDetail
} from "@/api/systemSetup";
export default {
  props: {
    id: {
      type: Number,
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
      roleList: [],
      subIsShow: false,
      form: {
        userName: "",
        roleId: ""
      },
      rules: {
        roleId: [
          {
            type: "number",
            required: true,
            message: "请选择对应的角色",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      this.getRoleList();
      this.getDetail();
    }
  },
  methods: {
    /**
     * @method getRoleList 获取角色列表
     */
    getRoleList() {
      getRoleList({}).then(({ data: { list }, errorCode }) => {
        if (errorCode === 0) {
          this.roleList = list;
        }
      });
    },
    getDetail() {
      // 获取账号详情
      getAccountDetail({
        objId: this.id
      }).then(({ data: { userName, roleId }, errorCode }) => {
        if (errorCode === 0) {
          this.form.userName = userName;
          this.form.roleId = roleId;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { roleId } = this.form;
          this.subIsShow = true;
          updateAccount({
            objId: this.id,
            roleId: roleId
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
    }
  }
};
</script>
<style lang="stylus" scoped></style>


