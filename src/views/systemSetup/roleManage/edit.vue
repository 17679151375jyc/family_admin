<template>
  <Modal title="编辑角色" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="type" label="角色类型">
        <Select v-model.trim="form.type" placeholder="请选择角色类型" style="width:200px;">
          <Option
            v-for="(item, index) in roleTypeList"
            :key="index"
            :value="item.value"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" label="角色名称">
        <Input v-model.trim="form.name" placeholder="请输入角色名称" style="width: 200px;" />
      </FormItem>
      <FormItem label="选择权限">
        <Tree :data="tree" show-checkbox multiple style="margin-top: -7px;"></Tree>
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
  updateRole,
  getRoleDetail,
  getAccessMenuList
} from "@/api/systemSetup";
import {mapState} from 'vuex'
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
        type: null,
        parentId: null,
        url: null,
        name: null,
        rank: null,
        code: null
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入权限名称",
            trigger: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择角色类型",
            trigger: "blur"
          }
        ]
      },
      jurisdictions: [],
      jurisdictionsArr: [],
      tree: [],
      list: []
    };
  },
  computed: {
    ...mapState({
      roleType: state => state.user.roleType
    }),
    roleTypeList() {
        let isAdmin = false
      for (let i = 0; i < this.roleType.length; i++) {
        if (this.roleType[i] === this.$config.system.roleType[1].value) {
          // 如果角色里包含是超级管理员
          isAdmin = true
        }
      }
      if (isAdmin) {
          // 如果角色里包含是超级管理员
          return this.$config.system.roleType
        } else {
            return {
                100: this.$config.system.roleType[100]
            }
        }
    }
  },
  watch: {
    isShow: async function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        await this.getDetail();
        this.getAccessMenuList();
      }
    }
  },
  methods: {
    getAccessMenuList() {
      getAccessMenuList().then(({ data: { list }, errorCode }) => {
        console.log(list, errorCode);
        if (errorCode === 0) {
          list.sort((a, b) => {
            // 对数据进行排序
            if (a.rank > b.rank) {
              return -1;
            }
            if (a.rank < b.rank) {
              return 1;
            }
            return 0;
          });
          for (let i = 0; i < list.length; i++) {
            list[i].title = list[i].name;
            if (this.jurisdictionsArr.indexOf(list[i].id) != -1) {
              console.log("有该权限", list[i].name);
              list[i].checked = true;
            } else {
              list[i].checked = false;
              console.log("没有该权限", list[i].name);
            }
          }
          this.list = list;
          this.tree = this.traverseToTree(list);
        }
      });
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        getRoleDetail({
          roleId: this.id
        }).then(({ data, errorCode }) => {
          if (errorCode === 0) {
            let { type, roleName, jurisdictions } = data;
            this.form.type = type;
            this.form.name = roleName;
            this.jurisdictionsArr = [];
            for (let i = 0; i < jurisdictions.length; i++) {
              this.jurisdictionsArr.push(jurisdictions[i].id);
            }
            this.jurisdictions = jurisdictions;
            resolve();
          }
        });
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, type } = this.form;
          let jurisdictions = [];
          //   let jurisdiction = [],
          //     jurisdictionUrl = [];
          for (let i = 0; i < this.list.length; i++) {
            let { checked, id } = this.list[i];
            if (checked) {
              jurisdictions.push({
                id: id
              });
            }
          }
          this.subIsShow = true;
          updateRole({
            type: type,
            id: this.id,
            roleName: name,
            jurisdictions
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
    },
    /**
     * @method traverseToTree 把数据转化为树状结构
     * @param {Array} data 权限数据列表
     */
    traverseToTree(data) {
      data.forEach(item => {
        delete item.children;
      });
      var map = {};
      data.forEach(item => {
        map[item.id] = item;
      });
      var val = [];
      data.forEach(item => {
        var parent = map[item.parentId];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
          parent.checked = false; // 如果是父类，把父类的选中设为false,如果不设置，会出现如果开始选了父类，相当于全选子类，然后再添加子类，在没有勾选情况下，也帮你勾选上了
        } else {
          val.push(item);
        }
      });
      return val;
    }
  }
};
</script>
<style lang="stylus" scoped></style>


