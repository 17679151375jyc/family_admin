<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="60">
          <FormItem label="名称" prop="input.name">
            <Input v-model.trim="searchForm.input.name" placeholder="请输入名称" style="width:120px;" />
          </FormItem>
          <FormItem label="编码" prop="input.code">
            <Input v-model.trim="searchForm.input.code" placeholder="请输入编码" style="width: 120px;" />
          </FormItem>
          <FormItem label="对应公司" prop="input.companyId">
            <Select
              v-model.trim="searchForm.input.companyId"
              placeholder="请选择对应公司"
              style="width: 120px;"
            >
              <Option :value="item.id" v-for="item in companyList" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button icon="md-add" v-if="$options.filters.auth(['installM.deviceM.add'])" type="info" @click="showAdd">添加</Button>
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

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :companyList="companyList" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :companyList="companyList" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情内容弹窗-start -->
    <detail
      @handleClose="detailClose"
      :companyList="companyList"
      :isShow="detail.isShow"
      :id="detail.id"
    ></detail>
    <!-- 详情内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getDeviceList, delDevice, setDeviceValid } from "@/api/installManage";
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
        input: {
          name: null,
          code: null,
          companyId: null
        }
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
          title: "名称",
          key: "name",
          width: 150
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
                "InstallDeviceType"
              )
            );
          }
        },
        {
          title: "编码",
          key: "code",
          width: 100
        },
        {
          title: "价格（元）",
          key: "price",
          width: 100
        },
        {
          title: "服务费（元）",
          key: "servicePrice",
          width: 120
        },
        {
          title: "对应公司",
          key: "companyName",
          width: 100
        },
        {
          title: "是否有效",
          width: 100,
          render: (h, params) => {
            if (this.$options.filters.auth(['installM.deviceM.edit'])) {
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
          title: "更新时间",
          key: "updateTime",
          minWidth: 150
        },
        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(['installM.deviceM.detail'])) {
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
            if (this.$options.filters.auth(['installM.deviceM.del'])) {
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

            // btnGroup.push(delBtn);
            // }
            return h("div", btnGroup);
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          name,
          code,
          price,
          valid,
          deleteState,
          updateTime,
          companyName,
          servicePrice,
          deviceType
        } = this.list[i];
        tabData.push({
          deviceType,
          name,
          code,
          price: price ? price.toFixed(2) : "0.00",
          valid,
          deleteState,
          servicePrice: servicePrice ? servicePrice.toFixed(2) : "0.00",
          updateTime: this.$options.filters.formatTime(updateTime),
          companyName: companyName ? companyName : "全部公司",
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
    this.getCompanyList(); // 获取公司数据
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
      getDeviceList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              console.log(data.list);
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
     *编辑是否有效
     */
    setDevice(status, index) {
      setDeviceValid({
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
      delDevice({
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
      console.log("id", id);
      this.detail.id = id;
      this.detail.isShow = true;
    },
    detailClose() {
      this.detail.isShow = false;
    }
  }
};
</script>



