<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <!-- <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="50">
          <FormItem label="手机号" prop="phone">
            <Input v-model.trim="searchForm.phone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>-->
      </div>
      <div class="handle-wrapper">
        <Button icon="md-add" v-if="$options.filters.auth(['installM.comboM.add'])" type="info" @click="showAdd">添加</Button>
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
    <add @handleClose="addClose" :companyList="companyList" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情内容弹窗-start -->
    <detail @handleClose="detailClose" :isShow="detail.isShow" :id="detail.id"></detail>
    <!-- 详情内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getComboList, delCombo, setComboValid } from "@/api/installManage";
import { getCompanyList } from "@/api/dataManage";
import { mapState } from "vuex";
export default {
  components: {
    add,
    edit,
    detail
  },
  data() {
    return {
      list: [],
      companyList: [], // 公司列表
      searchForm: {
        phone: null
      },
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        id: null
      },
      detail: {
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
          title: "公司名称",
          key: "companyName",
          width: 150
        },
        {
          title: "名称",
          key: "name",
          width: 160
        },
        {
          title: "编码",
          key: "code",
          width: 100
        },
        {
          title: "包月价(元)",
          key: "monthPrice",
          align: "right",
          width: 100,
          render: (h, params) => {
            return h("div", params.row.monthPrice.toFixed(2));
          }
        },
        {
          title: "季度价(元)",
          key: "quarterPrice",
          align: "right",
          width: 100,
          render: (h, params) => {
            return h("div", params.row.quarterPrice.toFixed(2));
          }
        },
        {
          title: "包年价(元)",
          key: "yearPrice",
          align: "right",
          width: 100,
          render: (h, params) => {
            return h("div", params.row.yearPrice.toFixed(2));
          }
        },
        // {
        //   title: "现价（元）",
        //   key: "price",
        //   width: 100
        // },
        {
          title: "是否有效",
          width: 100,
          render: (h, params) => {
            if (this.$options.filters.auth(['installM.comboM.edit'])) {
              let switchBtn = h(
                "i-switch",
                {
                  props: {
                    loading: params.row.captainIsLoading,
                    value: params.row.valid ? true : false
                  },
                  on: {
                    "on-change": status => {
                      this.setDevice(status, params.index);
                    }
                  }
                },
                [
                  h(
                    "span",
                    {
                      slot: "open"
                    },
                    "是"
                  ),
                  h(
                    "span",
                    {
                      slot: "close"
                    },
                    "否"
                  )
                ]
              );
              return h("div", [switchBtn]);
            }
          }
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 300
        },
        {
          title: "更新时间",
          key: "updateTime",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              this.$moment(params.row.updateTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(['installM.comboM.detail'])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
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
            if (this.$options.filters.auth(['installM.comboM.del'])) {
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
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          companyName,
          name,
          code,
          price,
          valid,
          deleteState,
          updateTime,
          remark,
          originalPrice
        } = this.list[i];
        tabData.push({
          companyName,
          name,
          code,
          remark,
          originalPrice: originalPrice ? originalPrice.toFixed(2) : "0.00", // 原价
          price: price ? price.toFixed(2) : "0.00", //现价
          valid,
          deleteState,
          updateTime: this.$options.filters.formatTime(updateTime),
          cellClassName: {
            valid: valid ? "cell-success" : "cell-error"
          }
        });
      }
      return tabData;
    }
  },
  mounted() {
    this.getList();
    this.getCompanyList(); // 获取公司列表
  },
  methods: {
    /**
     * 获取公司列表
     */
    getCompanyList() {
      getCompanyList({
        input: {
          isMincompany: 1 //是否最后一级公司
        }
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.companyList = data.list;
        }
      });
    },
    /**
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        input: {
          name: "",
          code: "",
          valid: ""
        },
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getComboList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              let { list, total } = data;
              console.log(data);
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
     *编辑是否有效
     */
    setDevice(status, index) {
      setComboValid({
        id: this.list[index].id,
        valid: status
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("修改成功");
        }
      });
    },
    /**
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(index) {
      // 删除
      delCombo({
        id: this.list[index].id
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
      console.log(this.searchForm);
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
    showDetail(index) {
      // 显示详情弹窗
      let { id } = this.list[index];
      this.detail.id = id;
      this.detail.isShow = true;
    },
    detailClose() {
      this.detail.isShow = false;
    }
  }
};
</script>



