<template>
  <Modal title="添加" v-model.trim="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="phone" label="手机号码">
        <Input v-model.trim="form.phone" placeholder="请输入手机号码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="password" label="密码">
        <Input v-model.trim="form.password" placeholder="请输入密码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="userName" label="真实姓名">
        <Input v-model.trim="form.userName" placeholder="请输入真实姓名" style="width: 200px;" />
      </FormItem>
      <FormItem prop="identityCard" label="身份证号">
        <Input v-model.trim="form.identityCard" placeholder="请输入身份证号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="businessNumber" label="对应商家">
        <Select
          v-model="form.businessNumber"
          filterable
          style="width: 200px;"
          placeholder="商家账号才需要选择"
        >
          <Option
            v-for="item in businessList"
            :value="item.id"
            :key="item.id"
          >{{ item.businessName }}</Option>
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
import { addClientUser } from "@/api/userManage";
import { getBusinessList } from "@/api/dataManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      businessList: [],
      roleList: [],
      subIsLoading: false,
      form: {
        phone: "", // 手机号
        password: "", // 密码
        userName: "", // 真实姓名
        identityCard: "", // 身份证号码
        businessNumber: "" //商家编号
      },
      rules: {
        phone: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.phone(value)) {
                err = "请填写正确的手机号码";
              }
              callback(err);
            }
          }
        ],
        password: [
          {
            required: true,
            message: "填写6-20位由字母和数字组成密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "密码长度在6-20个字符之间",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.password(value)) {
                err = "填写6-12位由字母和数字组成密码";
              }
              callback(err);
            }
          }
        ],
        userName: [
          {
            required: true,
            message: "请填写真实姓名",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.realName(value)) {
                err = "请填写正确真实姓名";
              }
              callback(err);
            }
          }
        ],
        identityCard: [
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value && !this.$options.filters.identityCard(value)) {
                err = "请填写正确的身份证号";
              }
              callback(err);
            }
          }
        ]
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (!val) {
        this.$refs["form"].resetFields();
      } else {
        this.getBusinessList();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    /**
     * 拉取商家列表
     */
    getBusinessList() {
      getBusinessList({
        input:{
            isEffective: 1,
        },
        pageSize: 999,
        page: 1
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.businessList = data.list;
        }
      });
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          addClientUser(this.form)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
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
<style lang="stylus" scoped></style>


