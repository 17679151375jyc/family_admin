<!--主机消息-->
<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container" v-if="searchIsShow">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" :model="searchForm" inline :label-width="50">
          <FormItem label="主机区域码" prop="machineInstallCode" :label-width="80">
            <Select
              v-model.trim="searchForm.machineInstallCode"
              placeholder="主机区域码"
              style="width:120px;"
            >
              <Option
                v-for="item in installCodeList"
                :key="item.id"
                :value="item.installCode"
              >{{item.installCode}}</Option>
            </Select>
          </FormItem>
          <FormItem label="主机号" prop="machineAccount">
            <Input v-model.trim="searchForm.machineAccount" placeholder="主机号" style="width:120px;" />
          </FormItem>
          <FormItem label="手机号" prop="userPhone">
            <Input v-model.trim="searchForm.userPhone" placeholder="手机号" style="width:120px;" />
          </FormItem>

          <FormItem label="时间">
            <DatePicker
              v-model.trim="searchForm.daterange"
              type="daterange"
              format="yyyy-MM-dd"
              show-week-numbers
              :clearable="false"
              @on-change="changeDate"
              placeholder="选择查询时间"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
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

    <!-- 详情-start -->
    <detail @handleClose="detailClose" :id="detail.id" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getMachineMessageList } from "@/api/messageManage";
import { getSetupServerList } from "@/api/hostManage";
export default {
  props: {
    machineNumber: {
      type: String,
      default: null
    },
    type: {
      // 0安保报警，1维保
      type: Number,
      default: null
    },
    searchIsShow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    add,
    edit,
    detail
  },
  data() {
    return {
      MachineMessageType: this.$options.filters.statusList(
        "MachineMessageType"
      ),
      installCodeList: [],
      list: [],
      searchForm: {
        machineInstallCode: null, //主机区域码
        machineAccount: null, // 主机号
        daterange: null, // 时间范围
        userPhone: null, // 电话
        // type: null,
        status: null, //状态
        startTime: null, //报警时间(前闭)
        endTime: null //报警时间(后闭)
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
          title: "状态",
          key: "status",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              (params.row.type === 0
                ? this.$options.filters.statusName(
                    params.row.status,
                    "AlertMessageStatus"
                  )
                : "") + //报警消息
                (params.row.type === 1
                  ? this.$options.filters.statusName(
                      params.row.status,
                      "MaintainMessageStatus"
                    )
                  : "") // 维保消息
            );
          }
        },
        {
          title: "手机号",
          key: "userPhone",
          width: 120
        },
        {
          title: "主机号",
          key: "machineAccount",
          width: 100
        },
        {
          title: "主机区域码",
          key: "machineInstallCode",
          width: 100
        },
        {
          title: "类型",
          key: "type",
          width: 90,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.type,
                "MachineMessageType"
              )
            );
          }
        },

        {
          title: "CID码",
          key: "cidCode",
          width: 100
        },
        {
          title: "防区名称",
          key: "defenceAreaName",
          minWidth: 100
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
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
            let detailBtn = null;
            if (this.$options.filters.auth(['msgM.mac.detail'])) {
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
            return h("div", btnGroup);
          }
        }
      ];
    }
  },
  watch: {
    machineNumber(val) {
      //   this.searchForm.type = this.type;
      this.getList();
    }
  },
  mounted() {
    this.getInstallCode();
    this.getList();
    // this.getRoleList();
  },
  methods: {
    /**
     * 主机区域码
     */
    getInstallCode() {
      getSetupServerList({
        page: 1,
        pageSize: 99
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.installCodeList = data.list;
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
        machineNumber: this.machineNumber,
        type: this.type,
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getMachineMessageList(data)
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
      this.searchForm.daterange = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
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



