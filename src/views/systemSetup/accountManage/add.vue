<template>
  <Modal
    title="添加用户"
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

    <!-- <span>{{companyList[0].name}}</span> -->
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="companyId" label="所属公司">
        <Select v-model.trim="form.companyId" placeholder="请选择所属公司" style="width:200px;">
          <Option :value="0" v-if="companyType!=1">{{'暂无'}}</Option>
          <Option class="Option_css" :value="comId">{{companyName}}</Option>
          <Tree class="Option_top" :data="companyListData" @on-select-change="dtList"></Tree>
        </Select>
      </FormItem>
      <FormItem prop="phone" label="手机号码">
        <Input v-model.trim="form.phone" placeholder="请输入手机号码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="password" label="密码">
        <Input v-model.trim="form.password" placeholder="请输入密码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="roleId" label="所属角色">
        <Select v-model.trim="form.roleId" placeholder="请选择所属角色" multiple style="width: 200px;">
          <Option v-for="(item,index) in roleList" :key="index" :value="item.id">{{item.roleName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="machineInstallCode" label="主机区域">
        <Select
          placeholder="客服角色请选择"
          multiple
          v-model="form.machineInstallCode"
          style="width: 200px;"
        >
          <Option
            v-for="item in serverList"
            :key="item.id"
            :value="item.installCode"
          >{{item.installCode+' - '+item.areaMachineName}}</Option>
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
import { addAccount, getRoleList } from "@/api/systemSetup";
import { getCompanyList } from "@/api/dataManage";
import { getSetupServerList } from "@/api/hostManage";
import { mapState } from "vuex";
export default {
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
      comId: "",
      listAnd: [],
      companyName: null,
      companyListData: [],
      companyList: [],
      roleList: [],
      subIsShow: false,
      serverList: [],
      form: {
        phone: "",
        password: "",
        roleId: [],
        companyId: null, // 公司id
        machineInstallCode: []
      },
      rules: {
        // companyId: [
        //   {
        //     required: true,
        //     message: "请选择所属公司",
        //     trigger: "blur"
        //   }
        // ],
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
                err = "填写6-20位由字母和数字组成密码";
              }
              callback(err);
            }
          }
        ],
        roleId: [
          {
            type: "array",
            required: true,
            message: "请选择对应的角色",
            trigger: "blur"
          }
        ],
        companyId: [
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (this.companyType === 1 && !value) {
                err = "物管添加账号需要选择对应的公司";
              }
              callback(err);
            }
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getCompanyList();
        this.getRoleList();
        this.getServerList();
      }
    }
  },
  computed: {
    ...mapState({
      curPlotNumber: state => state.user.curPlotNumber,
      companyType: state => state.user.companyType // 1是物管公司
    })
  },
  mounted() {},
  methods: {
    maxTagPlaceholder(num) {
      return "more" + 10;
    },
    dtList(data) {
      if (data.length !== 0) {
        this.form.companyId = data[0].id;
        this.comId = data[0].id;
        this.companyName = data[0].name;
      } else {
        this.form.companyId = null;
        this.companyName = null;
      }
    },
    /**
     * 获取安装区域码列表
     */
    getServerList() {
      getSetupServerList({
        page: 1,
        pageSize: 99
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.serverList = data.list;
        }
      });
    },
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
    /**
     * 获取公司列表
     */
    getCompanyList() {
      getCompanyList({}).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.companyList = data.list;
          // 数据转化为树形结构
          let dataList = data.list;
          let map = {};
          dataList.forEach(item => {
            map[item.id] = item;
          });
          var val = [];
          dataList.forEach(item => {
            var parent = map[item.parentId];
            if (parent) {
              (parent.children || (parent.children = [])).push(item);
            } else {
              val.push(item);
            }
          });
          for (let item of val) {
            item.title = item.name;
            item.expand = true;
            if (item.children) {
              item.children[0].title = item.children[0].name;
              item.children[0].expand = true;
            }
          }
          this.companyListData = val;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            phone,
            password,
            roleId,
            companyId,
            machineInstallCode
          } = this.form;
          let roleIdArr = [];
          for (let i = 0; i < roleId.length; i++) {
            roleIdArr.push({
              id: roleId[i]
            });
          }
          console.log(companyId);
          this.subIsShow = true;
          addAccount({
            machineInstallCode,
            count: phone,
            userName: phone,
            password,
            roles: roleIdArr,
            companyId: companyId == 0 ? "" : companyId
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
.Option_css {
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
}

.Option_top {
  margin-top: -20px;
}
</style>


