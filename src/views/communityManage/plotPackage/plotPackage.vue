<!--权限菜单管理-->
<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="70">
          <FormItem prop="input.valid" label="是否有效">
            <Select v-model.trim="searchForm.input.valid" style="width:120px;">
              <Option :value="1">有效</Option>
              <Option :value="0">无效</Option>
            </Select>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button
          v-if="$options.filters.auth(['communityM.plotPackage.add'])"
          icon="md-add"
          type="info"
          @click="showAdd"
        >添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->
    <div class="win-table-wrapper" id="win-table-wrapper">
      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="list"></Table>
    </div>
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
    <!-- 权限树状表-end -->

    <!-- 添加内容弹窗-start -->
    <add v-model="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit v-model="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import { getPlotPackageList, plotPackageSetValid } from "@/api/communityManage";
import { mapState } from "vuex";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    add,
    edit,
    addressCascader
  },
  data() {
    return {
      arrdessPolt: [],
      IsAsver: {
        0: "有效",
        1: "无效"
      },
      IsAll: {
        0: "是",
        1: "否"
      },
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      searchForm: {
        input: {
          valid: null
        }
      },
      companyTypeList: this.$config.dataManage.company.type,
      list: [],
      add: {
        isShow: false
      },
      edit: {
        id: null,
        isShow: false
      },
      tabIsLoading: false,
      tree: []
    };
  },
  watch: {
    "add.isShow": function(val) {
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
    ...mapState({
      curPlotNumber: state => state.user.curPlotNumber
    }),
    tabCol: function() {
      let arr = [
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
          title: "名称",
          key: "name",
          width: 150
        },
        {
          title: "月数",
          key: "month",
          minWidth: 100
        },
        {
          title: "原价",
          key: "price",
          width: 100,
          align: "right",
          render: (h, params) => {
            return h(
              "div",
              params.row.price ? params.row.price.toFixed(2) : "无价格"
            );
          }
        },
        {
          title: "折扣价",
          key: "discount",
          width: 120,
          align: "right",
          render: (h, params) => {
            return h(
              "div",
              params.row.discount ? params.row.discount.toFixed(2) : "无价格"
            );
          }
        },
        {
          title: "是否有效",
          key: "effective",
          align: "center",
          width: 120,
          render: (h, params) => {
            // return h("div", params.row.effective ? "有效" : "无效");
            let switchBtn = h(
              "i-switch",
              {
                props: {
                  size: "large",
                  loading: params.row.isLoading,
                  value: params.row.valid
                },
                on: {
                  "on-change": status => {
                    this.validChange(params.row.id, status, params.index);
                  }
                }
              },
              [
                h(
                  "span",
                  {
                    slot: "open"
                  },
                  "有效"
                ),
                h(
                  "span",
                  {
                    slot: "close"
                  },
                  "无效"
                )
              ]
            );
            return h("div", [switchBtn]);
          }
        },
        {
          title: "更新时间",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {},
              this.$moment(params.row.updateTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
        },
        {
          title: "创建时间",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {},
              this.$moment(params.row.createTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            // if (this.$options.filters.auth(["communityM.plotPackage.detail"])) {
            //   let btn = h(
            //     "Button",
            //     {
            //       props: {
            //         type: "success",
            //         size: "small"
            //       },
            //       style: {
            //         marginRight: "5px"
            //       },
            //       on: {
            //         click: () => {
            //           this.showDetail(this.list[params.index].id);
            //         }
            //       }
            //     },
            //     "详情"
            //   );
            //   btnGroup.push(btn);
            // }
            if (this.$options.filters.auth(["communityM.plotPackage.edit"])) {
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
                      this.showEdit(params.row.id);
                    }
                  }
                },
                "编辑"
              );
              btnGroup.push(btn);
            }

            // if (this.J_del) {
            //   let btn = h(
            //     "Poptip",
            //     {
            //       props: {
            //         confirm: true,
            //         title: "你确定要删除吗?",
            //         transfer: true
            //       },
            //       on: {
            //         "on-ok": () => {
            //           this.delItem(this.list[params.index].id);
            //         }
            //       }
            //     },
            //     [
            //       h(
            //         "Button",
            //         {
            //           props: {
            //             type: "error",
            //             size: "small"
            //           }
            //         },
            //         "删除"
            //       )
            //     ]
            //   );
            //   btnGroup.push(btn);
            // }
            return h("div", btnGroup);
          }
        }
      ];
      return arr;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    /**
     * @method getList 获取当前的数据列表
     */

    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      this.list = [];
      getPlotPackageList(data)
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
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(index) {
      // 删除
      DelAdvertisementList({
        id: index
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getList();
    },
    pageChange(event) {
      this.page.current = event;
      this.getList();
    },
    /**
     * @method showAdd 显示添加弹窗
     */
    showAdd(data) {
      console.log("点击了");
      this.add.isShow = true;
    },

    /**
     * 显示编辑
     */
    showEdit(id) {
      this.edit.id = id;
      this.edit.isShow = true;
    },
    /**
     * @method editClose 编辑的弹窗关闭时触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    editClose(isRefresh = false) {
      this.edit.isShow = false;
      if (isRefresh) {
        this.getList();
      }
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
     * 改变卡片是否有效
     */
    validChange(id, valid, index) {
      this.list[index].isLoading = true;
      plotPackageSetValid({
        id,
        valid
      }).then(({ data, errorCode }) => {
        this.list[index].isLoading = false;
        if (errorCode === 0) {
          this.$Message.success("修改成功");
          this.getList();
        } else {
          this.getList();
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
>>>.flex-div {
  width: 50px;
  height: 50px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>


