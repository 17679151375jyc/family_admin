<template>
  <div>
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="handle-title"></div>
      <div class="handle-wrapper">
        <Button icon="md-add" v-if="$options.filters.auth(['userM.client.detail.linkman.add'])" type="info" @click="showAdd">添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 表格-start -->
    <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table>
    <!-- 表格-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :userNumber="userNumber" :isShow="add.isShow" :list="list"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import { getContactsInfo, delContacts } from "@/api/userManage";
export default {
  components: {
    add,
    edit
  },
  props: {
    isShow: {
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
      contactsList: [],
      devTypeList: [],
      list: [],
      searchForm: {
        userName: null,
        roleId: null
      },
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        id: null
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  computed: {
    tabCol() {
      return [
        {
          title: "姓名",
          key: "name",
          width: 100
        },
        {
          title: "性别",
          key: "sex",
          width: 100
        },
        {
          title: "联系方式",
          key: "phone",
          minWidth: 150
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(['userM.client.detail.linkman.edit'])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editContacts(this.contactsList[params.index].id);
                    }
                  }
                },
                "编辑"
              );
              btnGroup.push(btn);
            }
            if (this.$options.filters.auth(['userM.client.detail.linkman.del'])) {
              let btn = h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.delContactsContent(
                        this.contactsList[params.index].id
                      );
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              );
              btnGroup.push(btn);
            }
            return h("div", btnGroup);
          }
        }
      ];
    },
    tabData() {
      let tabData = [];
      for (let i = 0; i < this.contactsList.length; i++) {
        let { name, sex, phone } = this.contactsList[i];
        tabData.push({
          name,
          sex: sex == 0 ? "男" : "女",
          phone
        });
      }
      return tabData;
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.getList();
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    /**
     * @method getList 获取当前的信息列表
     */
    getList() {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        input: {
          userNumber: this.userNumber
        },
        pageSize: size,
        page: current
      };
      console.log(data);
      getContactsInfo(data).then(({ data, errorCode }) => {
        this.tabIsLoading = false;
        if (errorCode === 0) {
          if (data.list) {
            this.contactsList = data.list;
          }
        }
      });
    },
    editContacts(id) {
      console.log(id);
      this.edit.id = id;
      this.edit.isShow = true;
    },
    /**
     * 删除联系人
     */
    delContactsContent(val) {
      delContacts({
        id: val
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    /**
     * @method pageSizeChange 当每页显示的数量改变时
     * @param {Number} event 当前选择每页显示的数量
     */
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getList();
    },
    /**
     * @method pageChange 当页数改变时
     * @param {Number} event 当前选择的页数
     */
    pageChange(event) {
      this.page.current = event;
      this.getList();
    },
    /**
     * @method search 提交搜索
     */
    search() {
      this.page.current = 1;
      this.getList();
    },
    /**
     * @method resetSearch 重置搜索条件
     */
    resetSearch() {
      this.$refs["search-form"].resetFields();
      this.page.current = 1;
      this.getList();
    },
    /**
     * @method showAdd 显示添加弹窗
     */
    showAdd() {
      this.add.isShow = true;
    },
    /**
     * @method addClose 添加的弹窗关闭时触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    addClose(isRefresh = false) {
      this.add.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      let { id } = this.list[index];
      this.edit.id = id;
      this.edit.isShow = true;
    },
    /**
     * @method editClose 编辑框关闭触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    editClose(isRefresh = false) {
      this.edit.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * 当主窗口关闭
     */
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
.handle-title {
  display: flex;
  align-items: center;

  i {
    margin: 0 5px;
  }

  span {
    font-size: 16px;
  }
}
</style>


