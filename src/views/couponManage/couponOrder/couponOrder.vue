<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="70">
          <FormItem label="商家名称" prop="businessName" :label-width="80">
            <Input
              v-model.trim="searchForm.businessName"
              placeholder="输入商家名称"
              style="width:120px;"
            />
          </FormItem>
          <FormItem label="使用者电话" prop="userPhone" :label-width="80">
            <Input v-model.trim="searchForm.userPhone" placeholder="输入使用者电话" style="width:120px;" />
          </FormItem>
          <FormItem label="使用状态" prop="status">
            <Select v-model="searchForm.status" placeholder="使用状态" style="width:120px;">
              <Option
                v-for="item in UserCouponStatus"
                :value="item.code"
                :key="item.code"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否有效" prop="isEffective">
            <Select v-model="searchForm.isEffective" placeholder="是否有效" style="width:120px;">
              <Option :value="0">无效</Option>
              <Option :value="1">有效</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="商家名称" prop="input.businessName">
            <Input
              v-model.trim="searchForm.input.businessName"
              placeholder="输入商家名称"
              style="width:120px;"
            />
          </FormItem>
          <FormItem label="联系人" prop="input.contactPhone" :label-width="60">
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
          </FormItem>-->
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <!-- <div class="handle-wrapper">
        <Button
          icon="md-add"
          v-if="$options.filters.auth(['couponM.couponOrder.issueCoupon'])"
          type="info"
          @click="showAdd"
        >发放优惠券</Button>
      </div>-->
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
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getCouponOrderList } from "@/api/couponManage";
import { mapState } from "vuex";
import { hasOneOf } from "@/libs/tools";

export default {
  components: {
    add,
    edit,
    detail
  },
  data() {
    return {
      UserCouponStatus: this.$options.filters.statusList("UserCouponStatus"),
      list: [],
      searchForm: {
        businessName: null,
        userPhone: null
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
          title: "优惠券名称",
          key: "couponName",
          minWidth: 155
        },
        {
          title: "优惠券商家",
          key: "businessName",
          width: 150
        },
        {
          title: "使用人",
          key: "userName",
          width: 100
        },
        {
          title: "使用人电话",
          key: "userPhone",
          width: 120
        },
        {
          title: "是否有效",
          width: 100,
          render: (h, { row: { isEffective } }) => {
            return h("div", {
                'cell-success': isEffective,
                'cell-error': !isEffective
            }, isEffective ? "有效" : "无效");
          }
        },
        {
          title: "状态",
          key: "status",
          width: 100,
          render: (h, { row: { status } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-error": status === 0, //已使用
                  "cell-success": status === 1, // 未使用
                  "cell-warning": status === 2 // 过期
                }
              },
              this.$options.filters.statusName(status, "UserCouponStatus")
            );
          }
        },
        {
          title: "类型",
          key: "type",
          width: 100,
          render: (h, { row: { couponType } }) => {
            return h(
              "div",
              this.$options.filters.statusName(couponType, "CouponType")
            );
          }
        },
        // {
        //   title: "是否有效",
        //   key: "isEffective",
        //   width: 100,
        //   render: (h, { row: { isEffective } }) => {
        //     return h(
        //       "div",
        //       {
        //         class: {
        //           "cell-success": isEffective,
        //           "cell-error": !isEffective
        //         }
        //       },
        //       isEffective ? "有效" : "无效"
        //     );
        //   }
        // },
        {
          title: "商家名称",
          key: "businessName",
          width: 150
        },
        {
          title: "商家价值",
          key: "price",
          width: 100,
          render: (h, { row: { couponType, price } }) => {
            let txt = null;
            if (couponType === 0) {
              // 折扣券
              txt = ((price - 0) * 10).toFixed(2) + "折";
            } else if (couponType === 1) {
              txt = price.toFixed(2) + "元";
            }
            return h("div", txt);
          }
        },
        {
          title: "使用条件",
          width: 150,
          render: (h, { row: { enoughPrice } }) => {
            return h("div", `满${enoughPrice}元可用`);
          }
        },
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
        {
          title: "使用时间",
          width: 155,
          render: (h, { row: { useTime } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-success": !useTime
                }
              },
              useTime
                ? this.$moment(useTime * 1000).format("YYYY-MM-DD HH:mm:ss")
                : "未使用"
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
        // {
        //   title: "操作",
        //   key: "handle",
        //   width: 160,
        //   align: "center",
        //   fixed: "right",
        //   render: (h, params) => {
        //     let btnGroup = [];
        //     if (this.$options.filters.auth(["couponM.couponOrder.detail"])) {
        //       let btn = h(
        //         "Button",
        //         {
        //           props: {
        //             type: "success",
        //             size: "small"
        //           },
        //           style: {
        //             margin: "2px"
        //           },
        //           on: {
        //             click: () => {
        //               this.showDetail(params.row.id);
        //             }
        //           }
        //         },
        //         "详情"
        //       );
        //       //   btnGroup.push(btn);
        //     }

        //     // btnGroup.push(delBtn);
        //     // }
        //     return h("div", btnGroup);
        //   }
        // }
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
      getCouponOrderList(data)
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
    }
  }
};
</script>



