<template>
  <Modal
    title="编辑用户"
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
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="companyId" label="所属公司">
        <Select
          v-model.trim="form.companyId"
          :disabled="companyType ===1 ?true: false"
          placeholder="请选择所属公司"
          style="width:200px;"
        >
          <Option :value="'暂不选择公司'">{{'暂不选择公司'}}</Option>
          <Option
            class="Option_css"
            v-for="(item, index) in companyList"
            :key="index"
            :value="item.id"
          >{{item.name}}</Option>
          <Tree class="Option_top" :data="companyListData" @on-select-change="dtList"></Tree>
        </Select>
      </FormItem>
      <FormItem prop="userName" label="账号">{{form.userName}}</FormItem>
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
import {
  updateAccount,
  getRoleList,
  getAccountDetail
} from "@/api/systemSetup";
import { getCompanyList } from "@/api/dataManage";
import { getSetupServerList } from "@/api/hostManage";
import { mapState } from "vuex";
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
      comId: "",
      listAnd: [],
      companyListData: [],
      companyList: [],
      roleList: [],
      subIsShow: false,
      serverList: [],
      form: {
        userName: "",
        roleId: [],
        userName: "",
        count: "",
        companyId: "",
        machineInstallCode: []
      },
      rules: {
        companyId: [
          {
            required: true,
            message: "请选择所属公司",
            trigger: "blur"
          }
        ],
        roles: [
          {
            type: "array",
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
      if (val) {
        this.getRoleList();
        this.getDetail();
        this.getCompanyList();
        this.getServerList();
      }
    }
  },
  computed: {
    ...mapState({
      companyType: state => state.user.companyType
    })
  },
  methods: {
    dtList(data) {
      if (data.length !== 0) {
        this.form.companyId = data[0].id;
        this.comId = data[0].id;
      } else {
        this.form.companyId = null;
      }
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
    getDetail() {
      // 获取账号详情
      console.log(this.id);
      getAccountDetail({
        objId: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          let { userName, roles, count, companyId ,machineInstallCode} = data;
          this.form.userName = userName;
          let rolesArr = [];
          for (let i = 0; i < roles.length; i++) {
            rolesArr.push(roles[i].id);
          }
          this.form.roleId = rolesArr;
          this.form.userName = userName;
          this.form.count = count;
          this.form.machineInstallCode = machineInstallCode
          console.log(data);
          this.form.companyId = companyId ? companyId : 0;
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
            roleId,
            count,
            userName,
            companyId,
            machineInstallCode
          } = this.form;
          let roleIdArr = [];
          for (let i = 0; i < roleId.length; i++) {
            roleIdArr.push({
              id: roleId[i]
            });
          }
          this.subIsShow = true;
          let data = {
            count,
            userName,
            id: this.id,
            roles: roleIdArr,
            machineInstallCode
          };
          if (companyId != '暂不选择公司') {
            data = Object.assign(data, {
              companyId
            });
          }
          else{
            data = Object.assign(data, {
              companyId: ''
            });
          }
          updateAccount(data)
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
<style lang="stylus" scoped>
.Option_css {
  width: 0;
  height: 0px;
  margin: 0;
  padding: 0;
  z-index: -100;
  overflow: hidden;
  display: block;
  opacity: 0;
  float: right;
}
</style>


