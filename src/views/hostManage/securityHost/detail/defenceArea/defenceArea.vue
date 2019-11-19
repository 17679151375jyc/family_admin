<template>
  <div>
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="handle-title"></div>
      <div class="handle-wrapper">
        <Button
          icon="md-add"
          v-if="$options.filters.auth(['hostM.security.detail.defence.add'])"
          type="info"
          @click="showAdd"
        >添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 表格-start -->
    <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="list"></Table>
    <!-- 表格-end -->

    <!-- 详情弹窗-start -->
    <detail @handleClose="detailClose" :isShow="detail.isShow" :number="detail.number"></detail>
    <!-- 详情弹窗-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow" :macNumber="macNumber" :list="list"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :number="edit.number"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getDefenceByMacNumber, delDefence } from "@/api/hostManage";
export default {
  components: {
    add,
    edit,
    detail
  },
  props: {
    macNumber: {
      type: String,
      default: false
    }
  },
  data() {
    return {
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
        id: null,
        number: null
      },
      detail: {
        isShow: false,
        id: null,
        number: null
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
    tabCol: function() {
      return [
        {
          title: "防区编号",
          key: "defenceIndex",
          width: 120,
          sortable: true,
          render: (h, params) => {
            return h(
              "div",
              params.row.defenceIndex - 0 >= 10
                ? params.row.defenceIndex
                : 0 + "" + params.row.defenceIndex
            );
          }
        },
        {
          title: "防区名称",
          key: "name",
          minWidth: 100
        },
        {
          title: "防区属性",
          key: "property",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.property,
                "DefenceAreaProperty"
              )
            );
          }
        },
        {
          title: "设备类型",
          key: "deviceType",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.deviceType,
                "DeviceType"
              )
            );
          }
        },
        {
          title: "防区位置",
          key: "position",
          width: 150
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          flxed: "right",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(['hostM.security.detail.defence.detail'])) {
              // 详情按钮
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.showDetail(params.index);
                    }
                  }
                },
                "详情"
              );
              btnGroup.push(btn);
            }
            if (true) {
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
                      this.showEdit(params.index);
                    }
                  }
                },
                "编辑"
              );
              btnGroup.push(btn);
            }
            if (this.$options.filters.auth(['hostM.security.detail.defence.del'])) {
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
                      this.delItem(params.index);
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
    }
  },
  watch: {
    macNumber: function(val, oldVal) {
      if (val) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let data = {
        machineNumber: this.macNumber
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getDefenceByMacNumber(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            this.list = data;
          }
        })
        .catch(err => {
          this.tabIsLoading = false;
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
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(index) {
      // 删除
      delDefence({
        id: this.list[index].id
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    /**
     * 显示详情弹窗
     * @param {Number} index 当前选择的数据的序号
     */
    showDetail(index) {
      let { number } = this.list[index];
      this.detail.number = number;
      this.detail.isShow = true;
    },
    /**
     * 关闭详情弹窗
     */
    detailClose() {
      this.detail.isShow = false;
    },
    /**
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      let { number } = this.list[index];
      this.edit.number = number;
      console.log(this.edit.number);
      this.edit.isShow = true;
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


