<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form
          class="search-form"
          @keyup.enter.native="search"
          ref="search-form"
          :model="searchForm"
          inline
          :label-width="70"
        >
          <FormItem label="商家名称" prop="input.businessName">
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
          </FormItem>
          <FormItem label="是否有效" prop="input.isEffective">
            <Select v-model="searchForm.input.isEffective" style="width:120px;">
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
          icon="md-add"
          v-if="$options.filters.auth(['common.business.add'])"
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
    <edit v-model="edit.isShow" :id="edit.id"></edit>
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
import { getBusinessList, delBusiness } from "@/api/dataManage";
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
      list: [],
      searchForm: {
        input: {
          businessName: null, // 商家姓名
          contactPhone: null, //联系人电话
          contactName: null, // 联系人姓名
          isEffective: null // 是否有效
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
          title: "商家名称",
          key: "businessName",
          minWidth: 150
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
          title: "省市区街道",
          minWidth: 150,
          render: (
            h,
            { row: { provinceName, cityName, areaName, streetName } }
          ) => {
            return h(
              "div",
              provinceName
                ? provinceName + cityName + areaName + streetName
                : ""
            );
          }
        },
        {
          title: "更新时间",
          width: 155,
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
          width: 160,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["common.business.detail"])) {
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
            if (this.$options.filters.auth(["common.business.edit"])) {
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
              btnGroup.push(btn);
            }
            if (this.$options.filters.auth(["common.business.del"])) {
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
                      },
                      style: {
                        margin: "2px"
                      }
                    },
                    "删除"
                  )
                ]
              );
              btnGroup.push(btn);
            }

            // btnGroup.push(delBtn);
            // }
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
      getBusinessList(data)
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
      delBusiness({
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
      this.searchForm.input.contactName = null;
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
    showEdit(id) {
      this.edit.id = id;
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



