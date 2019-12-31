<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="70">
          <FormItem label="商家名称" prop="input.businessName">
            <Input
              v-model.trim="searchForm.input.businessName"
              placeholder="输入商家名称"
              style="width:120px;"
            />
          </FormItem>
          <FormItem label="联系人" prop="input.contactName" :label-width="60">
            <Input
              v-model.trim="searchForm.input.contactName"
              placeholder="输入联系人姓名"
              style="width:120px;"
            />
          </FormItem>
          <FormItem label="联系电话" prop="input.contactPhone">
            <Input
              v-model.trim="searchForm.input.contactPhone"
              placeholder="输入联系电话"
              style="width:120px;"
            />
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
          v-if="$options.filters.auth(['couponM.couponList.add'])"
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
    <edit :isShow="edit.isShow" :number="edit.number"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情内容弹窗-start -->
    <detail v-model="detail.isShow" :id="detail.id"></detail>
    <!-- 详情内容弹窗-end -->

    <!-- 发放优惠券-start -->
    <issue v-model="issue.isShow" :id="issue.id"></issue>
    <!-- 发放优惠券-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import issue from "./issue";
import { getCouponList } from "@/api/couponManage";
import { mapState } from "vuex";
import { hasOneOf } from "@/libs/tools";

export default {
  components: {
    add,
    edit,
    detail,
    issue
  },
  data() {
    return {
      list: [],
      searchForm: {
        input: {
          businessName: null,
          contactPhone: null,
          contactName: null
        }
      },
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        number: null
      },
      detail: {
        isShow: false,
        id: null
      },
      issue: {
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
          title: "名称",
          key: "couponName",
          minWidth: 155
        },
        {
          title: "类型",
          key: "type",
          width: 100,
          render: (h, { row: { type } }) => {
            return h(
              "div",
              this.$options.filters.statusName(type, "CouponType")
            );
          }
        },
        {
          title: "是否有效",
          key: "isEffective",
          width: 100,
          render: (h, { row: { isEffective } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-success": isEffective,
                  "cell-error": !isEffective
                }
              },
              isEffective ? "有效" : "无效"
            );
          }
        },
        {
          title: "商家名称",
          key: "businessName",
          width: 155
        },
        {
          title: "联系人",
          key: "contactName",
          width: 100
        },
        {
          title: "联系电话",
          key: "contactPhone",
          width: 100
        },
        {
          title: "优惠券价值",
          key: "businessValue",
          width: 100,
          align: 'right',
          render: (h, { row: { type, businessValue } }) => {
            let txt = null;
            if (type === 0) {
              // 折扣券
              txt = ((businessValue - 0) * 10).toFixed(2) + "折";
            } else if (type === 1) {
              txt = businessValue.toFixed(2) + "元";
            }
            return h("div", txt);
          }
        },
        {
          title: "使用条件",
          width: 130,
          render: (h, { row: { enoughPrice } }) => {
            return h("div", `满${enoughPrice}元可用`);
          }
        },
        {
          title: "库存",
          key: "stock",
          width: 70,
          align: 'right',
         
        },
        // {
        //   title: "描述",
        //   key: "description",
        //   minWidth: 200
        // },
        {
          title: "有效时间",
          width: 155,
          render: (h, { row: { effectiveTime } }) => {
            return h(
              "div",
              this.$moment(effectiveTime * 1000).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        // {
        //   title: "更新时间",
        //   width: 155,
        //   render: (h, { row: { updateTime } }) => {
        //     return h(
        //       "div",
        //       this.$moment(updateTime * 1000).format("YYYY-MM-DD HH:mm:ss")
        //     );
        //   }
        // },
        {
          title: "操作",
          key: "handle",
          width: 110,
          align: "left",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["couponM.couponList.detail"])) {
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
                      this.showDetail(params.row.id);
                    }
                  }
                },
                "详情"
              );
                btnGroup.push(btn);
            }
            if (this.$options.filters.auth(["couponM.couponList.edit"])) {
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
                      this.showEdit(params.row.id);
                    }
                  }
                },
                "编辑"
              );
              //   btnGroup.push(btn);
            }
            if (
              this.$options.filters.auth(["couponM.couponList.issueCoupon"]) && params.row.isEffective && params.row.stock!==0
            ) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
                  },
                  on: {
                    click: () => {
                      this.showIssue(params.row.id);
                    }
                  }
                },
                "发券"
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
    "add.isShow"(val) {
      if (!val) {
        this.getList();
      }
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
      getCouponList(data)
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
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      this.edit.isShow = true;
    },
    showDetail(id) {
      // 显示详情弹窗
      this.detail.id = id;
      this.detail.isShow = true;
    },
    /**
     * 显示发券弹窗
     */
    showIssue(id) {
      this.issue.id = id;
      this.issue.isShow = true;
    }
  }
};
</script>



