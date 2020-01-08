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
          :label-width="50"
        >
          <FormItem label="安装区域码" prop="installCode" :label-width="80">
            <Select v-model.trim="searchForm.installCode" placeholder="主机区域码" style="width:120px;">
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
            <Input v-model.trim="searchForm.userPhone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
          <FormItem label="状态" prop="statusValue">
            <Select
              :transfer="true"
              v-model.trim="searchForm.statusValue"
              placeholder="选择状态"
              style="width: 120px;"
            >
              <Option
                v-for="item in AlertMessageStatus"
                :key="item.code"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
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
      <!-- <div class="handle-wrapper">
        <Button icon="md-add" type="info" @click="showAdd">添加</Button>
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

    <!-- 详情-start -->
    <detail @handleClose="detailClose" :id="detail.id" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <!-- <add @handleClose="addClose" :isShow="add.isShow"></add> -->
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <!-- <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit> -->
    <!-- 编辑内容弹窗-end -->

    <!-- 选择指派人员-start -->
    <choose-accept v-model="chooseAccept.isShow" :alertNumber="chooseAccept.alertNumber"></choose-accept>
    <!-- 选择指派人员-end -->

    <!-- 误报弹窗-start -->
    <mistake v-model="mistake.isShow" :alertNumber="mistake.alertNumber"></mistake>
    <!-- 误报弹窗-end -->
  </div>
</template>
<script>
import Add from "./add";
import Edit from "./edit";
import Detail from "./detail";
import { getAlramList, alertRuquestPolice } from "@/api/messageManage";
import { getSetupServerList } from "@/api/hostManage";
import ChooseAccept from "./chooseAccept";
import Mistake from "./mistake";
export default {
  components: {
    Add,
    Edit,
    Detail,
    ChooseAccept,
    Mistake
  },
  data() {
    return {
      phone: "",
      AlertMessageStatus: this.$options.filters.statusList(
        "AlertMessageStatus"
      ),
      textTime: null,
      typeList: {
        0: "一般报警",
        1: "紧急报警"
      },
      installCodeList: [],
      list: [],
      searchForm: {
        installCodeList: null, // 主机区域码
        machineAccount: null, // 主机号
        daterange: null, // 时间范围
        userPhone: null, // 电话
        statusValue: null, //状态
        startTime: null, //报警时间(前闭)
        endTime: null //报警时间(后闭)
      },
      chooseAccept: {
        isShow: false,
        alertNumber: null
      },
      mistake: {
        isShow: false,
        alertNumber: null
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
  watch: {
    "chooseAccept.isShow": function(val) {
      if (!val) {
        this.getList();
      }
    },
    "mistake.isShow": function(val) {
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
          title: "报警名称",
          key: "name",
          width: 120
        },
        {
          title: "状态",
          key: "statusValue",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  "cell-error": params.row.statusValue === 0
                }
              },
              this.$options.filters.statusName(
                params.row.statusValue,
                "AlertMessageStatus"
              )
            );
          }
        },
        {
          title: "申报人电话",
          key: "userPhone",
          width: 120
        },
        {
          title: "主机号",
          key: "machineAccount",
          width: 100
        },
        {
          title: "安装区域码",
          key: "installCode",
          width: 100
        },
        {
          title: "CID码",
          key: "cidCode",
          width: 80
        },
        {
          title: "报警类型",
          key: "typeValue",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.typeValue,
                "AlertMessageType"
              )
            );
          }
        },

        {
          title: "小区名字",
          key: "plotName",
          width: 150
        },
        {
          title: "座名",
          key: "buildingName",
          width: 70
        },
        {
          title: "门号",
          key: "doorName",
          width: 70
        },
        {
          title: "防区名称",
          key: "defenceAreaName",
          minWidth: 120
        },

        {
          title: "创建时间",
          key: "createTime",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  "cell-error": params.row.statusValue === 0
                }
              },
              this.$moment(params.row.createTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              ) +
                (params.row.statusValue === 0
                  ? "已过" +
                    this.$moment(params.row.createTime * 1000).toNow(true) +
                    "未处理"
                  : "")
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 120,
          align: "left",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["msgM.alarm.detail"])) {
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
            if (
              this.$options.filters.auth(["msgM.alarm.mistake"]) &&
              params.row.statusValue === 0
            ) {
              // 未处理可以改为误报
              let btn = h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
                  },
                  on: {
                    click: () => {
                      this.showMistake(params.row.number);
                    }
                  }
                },
                "误报"
              );
              btnGroup.push(btn);
            }
            if (
              this.$options.filters.auth(["msgM.alarm.request"]) &&
              params.row.statusValue === 0
            ) {
              // 如果是未处理
              let btn = h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要请求出警吗?",
                    transfer: true
                  },
                  on: {
                    'on-ok': () => {
                      this.alertRuquestPolice(params.row.number);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "info",
                        size: "small"
                      },
                      style: {
                        margin: "2px"
                      }
                    },
                    "请求出警"
                  )
                ]
              );
              btnGroup.push(btn);
            }
            //
            if (
              this.$options.filters.auth(["msgM.alarm.chooseAccept"]) &&
              (params.row.statusValue === 0 ||
                params.row.statusValue === 2 ||
                params.row.statusValue === 3)
            ) {
              //当前状态是未处理或请求出警
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
                      this.showChooseAccept(params.row.number); // 指定出警人员
                    }
                  }
                },
                "出警指定"
              );
              btnGroup.push(btn);
            }

            return h("div", { style: { margin: "2px" } }, btnGroup);
          }
        }
      ];
    }
  },
  mounted() {
    this.getInstallCode();
    this.getList();
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
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getAlramList(data)
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
      let { number } = this.list[index];
      this.detail.id = number;
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
    },
    /**
     * 手动请求出警
     */
    alertRuquestPolice(number) {
      alertRuquestPolice({
        alertNumber: number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("请求出警成功");
          this.getList();
        }
      });
    },
    /**
     * 指定出警人员
     */
    showChooseAccept(number) {
      this.chooseAccept.isShow = true;
      this.chooseAccept.alertNumber = number;
    },
    /**
     * 消息改为误报
     */
    showMistake(number) {
      this.mistake.isShow = true;
      this.mistake.alertNumber = number;
    }
  }
};
</script>



