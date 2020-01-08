<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="50">
          <FormItem label="姓名" prop="realName">
            <Input v-model.trim="searchForm.realName" placeholder="请输入姓名" style="width:120px" />
          </FormItem>
          <FormItem label="手机号" prop="phone">
            <Input v-model.trim="searchForm.phone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button
          icon="md-add"
          v-if="$options.filters.auth(['userM.client.add'])"
          type="info"
          @click="showAdd"
        >添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 表格-start -->
    <div class="win-table-wrapper" id="win-table-wrapper">
      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="list"></Table>
    </div>
    <!-- 表格-end -->

    <!-- 分页-start -->
    <Page
      placement="top"
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="page.sizeOpts"
      show-total
      show-elevator
      show-sizer
      :current="page.current"
      class="page-wrapper"
      @on-page-size-change="pageSizeChange"
      @on-change="pageChange"
    />
    <!-- 分页-end -->

    <!-- 添加内容弹窗-start -->
    <add v-model="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit v-model="edit.isShow" :userNumber="edit.userNumber"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 重置密码弹窗-start -->
    <reset @handleClose="resetClose" :isShow="reset.isShow" :phone="reset.phone"></reset>
    <!-- 重置密码弹窗-end -->

    <!-- 详情内容弹窗-start -->
    <detail
      @handleClose="detailClose"
      :isShow="detail.isShow"
      :phone="detail.phone"
      :userNumber="detail.userNumber"
    ></detail>
    <!-- 详情内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import reset from "./reset";
import detail from "./detail/detail";
import { getClientUserList } from "@/api/userManage";
import { mapState } from "vuex";
export default {
  components: {
    add,
    edit,
    detail,
    reset
  },
  data() {
    return {
      roleList: [],
      list: [],
      searchForm: {
        phone: null,
        realName: null
      },
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        userNumber: null
      },
      detail: {
        isShow: false,
        phone: null,
        userNumber: null
      },
      reset: {
        isShow: false,
        phone: null
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
  watch: {
    "add.isShow"(val) {
      if (!val) {
        this.getList();
      }
    },
    "edit.isShow": function(val) {
      if (!val) {
        this.getList();
      }
    }
  },
  computed: {
    tabCol: function() {
      return [
        // 表格标题栏
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center",
          indexMethod: row => {
            return row._index + 1 + (this.page.current - 1) * this.page.size;
          }
        },
        {
          title: "头像",
          key: "headPortrait",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  "flex-div": true
                },
                style: {
                  display: "flex",
                  "justify-content": "center",
                  "align-items": "center"
                }
              },
              [
                h("img", {
                  attrs: {
                    width: 50,
                    height: 50,
                    src:
                      this.$options.filters.cutImg(params.row.headPortrait) ||
                      require("@/assets/images/none.png")
                  }
                })
              ]
            );
          }
        },
        {
          title: "真实姓名",
          key: "realName",
          width: 100
        },
        {
          title: "昵称",
          key: "nickName",
          width: 150
        },
        {
          title: "手机号",
          key: "phone",
          width: 150
        },
        {
          title: "身份证号码",
          key: "identityCard",
          width: 200
        },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 155,
          render: (h, { row: { createTime } }) => {
            return h(
              "div",
              this.$moment(createTime * 1000).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["userM.client.detail"])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
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
            if (this.$options.filters.auth(["userM.client.edit"])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
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
            if (this.$options.filters.auth(["userM.client.resetPwd"])) {
              let btn = h(
                "Button",
                {
                  props: {
                    confirm: true,
                    title: "你确定要重置吗?",
                    transfer: true,
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
                  },
                  on: {
                    click: () => {
                      this.resetPassword(params.index);
                    }
                  }
                },
                "重置密码"
              );
              btnGroup.push(btn);
            }
            return h("div", btnGroup);
          }
        }
      ];
    }
  },
  mounted() {
    this.getList();
    // this.getRoleList();
  },
  methods: {
    /**
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        phone: null,
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getClientUserList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              let { list, total } = data;
              this.list = list;
              this.page.total = total;
            } else {
              this.list = [];
              this.page.total = 0;
            }
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
      delAccount({
        deleteUserId: this.list[index].id
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    // 重置密码
    resetPassword(val) {
      let { phone } = this.list[val];
      this.reset.isShow = true;
      this.reset.phone = phone;
      console.log(phone);
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
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      let { userNumber } = this.list[index];
      this.edit.userNumber = userNumber;
      this.edit.isShow = true;
    },
    // 关闭重置密码
    resetClose() {
      this.reset.isShow = false;
      this.getList();
    },
    showDetail(index) {
      // 显示详情弹窗
      let { userNumber, phone } = this.list[index];
      this.detail.userNumber = userNumber;
      this.detail.phone = phone;
      this.detail.isShow = true;
    },
    detailClose() {
      this.detail.isShow = false;
    }
  }
};
</script>



