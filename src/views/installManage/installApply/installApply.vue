<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" :model="searchForm" inline :label-width="80">
          <FormItem label="省市区街道">
            <div style="display: flex;">
              <address-cascader
                ref="addressCascader"
                @onChange="addressCascaderChange"
                :showAllText="true"
                :showAllTextLevel="2"
                :showLevel="4"
                style="width: 300px"
              ></address-cascader>
            </div>
          </FormItem>
          <FormItem label="公司名称" prop="roleType">
            <Select
              v-model.trim="searchForm.input.companyId"
              placeholder="请选择公司名称"
              style="width:120px;"
            >
              <Option
                v-for="(item, index) in companyList"
                :key="index"
                :value="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="手机号" prop="phone">
            <Input
              v-model.trim="searchForm.input.contactPhone"
              placeholder="输入手机号"
              style="width:120px;"
            />
          </FormItem>
          <FormItem label="审核状态" prop="roleType">
            <Select
              v-model.trim="searchForm.input.state"
              placeholder="请选择审核状态"
              style="width:120px;"
            >
              <Option
                v-for="(item, index) in statusName"
                :key="index"
                :value=" item.code "
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="用户姓名" prop="phone">
            <Input v-model.trim="searchForm.input.name" placeholder="输入用户姓名" style="width:120px;" />
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <!-- <Button icon="md-add" type="info" @click="showAdd">添加</Button> -->
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 表格-start -->
    <div class="win-table-wrapper" id="win-table-wrapper">
      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table>
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

    <!-- 详情-start -->
    <detail @handleClose="detailClose" :id="detail.id" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 审核弹窗-start -->
    <check @handleClose="checkClose" :isShow="check.isShow" :id="check.id"></check>
    <!-- 审核弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import check from "./check";
import { getApplyList } from "@/api/installManage";
import { getCompanyList } from "@/api/dataManage";
import AddressCascader from "@/components/addressCascader/addressCascader";
import { mapState } from "vuex";
export default {
  components: {
    add,
    edit,
    detail,
    check,
    AddressCascader
  },
  data() {
    return {
      statusName: this.$options.filters.statusList("ApplyInstallState"),
      companyList: [],
      list: [],
      searchForm: {
        input: {
          provinceCode: null,
          cityCode: null,
          areaCode: null,
          streetCode: null,
          companyId: null,
          name: null,
          state: null,
          contactPhone: null // 电话
        }
      },
      add: {
        isShow: false
      },
      detail: {
        id: null,
        isShow: false
      },
      edit: {
        isShow: false,
        id: null
      },
      check: {
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
        // name,
        //     province,
        //     city,
        //     area,
        //     street,
        //     contactPhone
        //     detailedAddress
        {
          title: "公司名称",
          key: "companyName",
          width: 120
        },
        {
          title: "审核状态",
          key: "state",
          width: 120,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.state,
                "ApplyInstallState"
              )
            );
          }
        },
        {
          title: "用户姓名",
          key: "name",
          width: 120
        },
        {
          title: "省",
          key: "province",
          width: 70
        },
        {
          title: "市",
          key: "city",
          width: 70
        },
        {
          title: "区",
          key: "area",
          width: 70
        },
        {
          title: "街道",
          key: "street",
          width: 120
        },
        {
          title: "详细地址",
          key: "detailedAddress",
          minWidth: 150
        },
        {
          title: "联系电话",
          key: "contactPhone",
          width: 120
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "left",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (
              this.$options.filters.auth(["installM.apply.detail"]) 
              // && params.row.state > 1
            ) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    margin: "0 2px"
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
            if (
              this.$options.filters.auth(["installM.apply.check"]) &&
              params.row.state == 1
            ) {
              // 如果为未审核和审核中，就显示出审核按钮
              let btn = h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "0 2px"
                  },
                  on: {
                    click: () => {
                      this.showCheck(params.index);
                    }
                  }
                },
                "审核"
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
          province,
          city,
          area,
          street,
          contactPhone,
          detailedAddress,
          state
        } = this.list[i];
        tabData.push({
          companyName,
          name,
          province,
          city,
          area,
          street,
          contactPhone,
          detailedAddress,
          state
          //   state: this.$options.filters.statusName(state, 'ApplyInstallState')
        });
      }
      return tabData;
    }
  },
  mounted() {
    console.log("申请状态", this.$config.community.apply.status);
    this.getList();
    this.getCompanyList();
  },
  methods: {
    getCompanyList() {
      getCompanyList({
        page: 1,
        pageSize: 999
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.companyList = data.list;
          console.log(this.companyList);
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
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getApplyList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              let { list, total } = data;
              this.list = list;
              console.log(list);
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
      delAccount({
        deleteUserId: this.list[index].id
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
      this.$refs["addressCascader"] &&
        this.$refs["addressCascader"].resetData();
      this.searchForm.daterange = null;
      this.searchForm.input.provinceCode = null;
      this.searchForm.input.cityCode = null;
      this.searchForm.input.areaCode = null;
      this.searchForm.input.streetCode = null;
      this.searchForm.input.companyId = this.searchForm.input.state = null;
      this.searchForm.input.contactPhone = null;
      (this.searchForm.input.name = null), (this.searchForm.startTime = null);
      this.searchForm.endTime = null;
      this.page.current = 1;
      this.getList();
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.searchForm.input.provinceCode = value[0];
      this.searchForm.input.cityCode = value[1];
      this.searchForm.input.areaCode = value[2];
      this.searchForm.input.streetCode = value[3];
      // this.searchForm.input.plotNumber = value[4];
      // this.searchForm.input.buildingNumber = value[5];
      // this.searchForm.input.doorNumber = value[6];
    },
    /**
     * 显示审核弹窗
     */
    showCheck(index) {
      this.check.isShow = true;
      this.check.id = this.list[index].id;
    },
    /**
     * 关闭审核弹窗
     */
    checkClose(isRefresh = false) {
      this.check.isShow = false;
      if (isRefresh) {
        this.getList();
      }
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
      let { id } = this.list[index];
      this.detail.id = id;
      this.detail.isShow = true;
    },
    detailClose(isRefresh = false) {
      this.detail.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    changeDate(e) {
      if (e[0]) {
        let bt =
          e[0].replace(/[年月]/g, "/").replace(/[日]/g, " ") + " 00:00:00";
        let et =
          e[1].replace(/[年月]/g, "/").replace(/[日]/g, " ") + " 23:59:59";

        this.searchForm.startTime = new Date(bt).getTime() / 1000;
        this.searchForm.endTime = new Date(et).getTime() / 1000;
      } else {
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;
      }
    }
  }
};
</script>



