<template>
  <Modal title="编辑" v-model.trim="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="手机账号">
        <span>{{form.phone}}</span>
      </FormItem>
      <FormItem prop="headPortrait" label="头像">
        <upload v-model="form.headPortrait"></upload>
      </FormItem>
      <FormItem prop="nickName" label="昵称">
        <Input v-model.trim="form.nickName" placeholder="输入昵称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="realName" label="真实姓名">
        <Input v-model.trim="form.realName" placeholder="输入真实姓名" style="width: 200px;" />
      </FormItem>
      <FormItem prop="identityCard" label="身份证号">
        <Input v-model.trim="form.identityCard" placeholder="输入身份证" style="width: 200px;" />
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
import { getClientUserDetail, updateClientUser } from "@/api/userManage";
import Upload from "@/components/upload/upload";
import { getBusinessList } from "@/api/dataManage";
export default {
  components: {
    Upload
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userNumber: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      subIsLoading: false,
      businessList: [],
      form: {
        id: null,
        nickName: null,
        headPortrait: null,
        realName: null,
        identityCard: null,
        businessNumber: null
      },
      rules: {
        nickName: [
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value && value.length > 13) {
                err = "请填写少于13位字符的昵称";
              }
              callback(err);
            }
          }
        ],
        realName: [
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value && !this.$options.filters.realName(value)) {
                err = "请填写2-4位中文名";
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
      if (val) {
        this.getDetail();
        this.getBusinessList();
      } else {
        this.$refs["form"].resetFields();
      }
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
    // isShow: function(val, oldVal) {
    //   this.$refs["form"].resetFields();
    //   this.getDetail();
    // }
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
    /**
     * 获取用户详情
     */
    getDetail() {
      // 获取账号详情
      getClientUserDetail({
        userNumber: this.userNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.form = data;
        }
      });
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          updateClientUser(this.form)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("修改成功");
                this.subIsLoading = false;
                this.visible = false;
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


