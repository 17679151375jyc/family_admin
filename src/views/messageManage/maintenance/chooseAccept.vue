<!--选择出警人员-->
<template>
  <Modal title="指定维保人员" v-model.trim="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="userNumber" label="维保人员">
        <Select v-model="form.userNumber" filterable style="width: 200px;" placeholder="请选择指定的维保人员">
          <Option value="null" disabled>
            <span>名称</span>
            <span class="select-right-span-disabled" style="padding-right:0;">手机号</span>
          </Option>
          <Option
            v-for="item in list"
            :key="item.number"
            :value="item.number"
            :label="item.realName"
          >
            <span>{{item.realName}}</span>
            <span class="select-right-span" style="padding-right:0;">{{item.phone}}</span>
          </Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getServerUserList } from "@/api/userManage";
import { maintenanceAcceptUser } from "@/api/messageManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    number: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      list: [],
      visible: false,
      subIsLoading: false,
      form: {
        userNumber: ""
      },
      rules: {
        userNumber: [
          {
            required: true,
            message: "请选择指定人员",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    value: function(val) {
      this.visible = val;
    },
    visible: function(val) {
      if (!val) {
        this.$refs["form"] && this.$refs["form"].resetFields();
      }
      this.$emit("input", val);
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getServerUserList({
        status: 2, //审核通过
        maintenance: 1, // 维保
        page: 1,
        pageSize: 99
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.list = data.list;
        }
      });
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { userNumber } = this.form;
          this.subIsLoading = true;
          maintenanceAcceptUser({
            userNumber,
            number: this.number
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("指定成功");
                this.visible = false;
                this.subIsLoading = false;
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