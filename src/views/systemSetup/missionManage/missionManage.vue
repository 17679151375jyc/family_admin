<!--主机消息-->
<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" :model="searchForm" ref="search-form" inline :label-width="60">
          <!-- <FormItem label="手机号" prop="phone">
            <Input v-model.trim="searchForm.phone" placeholder="输入手机号" style="width:120px;" />
          </FormItem> -->
          <FormItem label="任务类型" prop="typeValue">
            <Select v-model.trim="searchForm.typeValue" placeholder="选择任务类型" style="width: 120px;">
              <Option
                v-for="(item,index) in QuartzType"
                :value="item.code"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="运行类型" prop="state">
            <Select v-model.trim="searchForm.state" placeholder="选择运行类型" style="width: 120px;">
              <Option
                v-for="(item,index) in taskStatusList"
                :value="item.value"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
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
    <!-- <add @handleClose="addClose" :isShow="add.isShow"></add> -->
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <!-- <edit @handleClose="editClose" :isShow="edit.isShow" :id="detail.id"></edit> -->
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getTaskList, restartJob } from "@/api/systemSetup";
export default {
  components: {
    add,
    edit,
    detail
  },
  data() {
    return {
      callType: {
        30: "提醒用户报警"
      },
      // taskStatus: {
      //   1: "运行",
      // },
      QuartzType: this.$options.filters.statusList("QuartzType"),
      taskStatusList: this.$config.community.taskStatus.type,
      tastsTypeList: {
        0: "处警消息处理",
        1: "维保消息处理",
        2: "报警智能呼叫",
        3: "报警短信通知",
        4: "访客登记超时处理"
      },
      statusList: {
        // 状态列表
        0: "未处理",
        1: "已忽略",
        2: "申报中",
        3: "已接单",
        4: "正在处理",
        5: "已完成",
        6: "评价完成"
      },
      list: [],
      searchForm: {
        phone: null,
        typeValue: null,
        state: null
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
          title: "任务名称",
          key: "taskName",
          width: 150
        },
        {
          title: " 任务描述",
          key: "description",
          width: 150
        },
        {
          title: "开始时间",
          key: "startDate",
          width: 150
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 150
        },
        {
          title: "修改时间",
          key: "updateTime",
          width: 150
        },
        {
          title: "任务关联类型",
          key: "taskType",
          minWidth: 150
        },
        {
          title: "运行的CLASS",
          key: "runJobClss",
          minWidth: 150
        },

        {
          title: "运行状态",
          key: "taskStatus",
          minWidth: 150
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "left",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            let detailBtn = null;
            if (this.$options.filters.auth(['systemM.missionM.detail'])) {
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
              //应判断时间小于当前时间,params.row.startDate<=parseInt(new Date().getTime()/1000)
              if (
                params.row.startDate &&
                this.$moment().valueOf() >
                  this.$moment(params.row.startDate).valueOf()
              ) {
                let btn = h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "你确定要重启吗?",
                      transfer: true
                    },
                    on: {
                      "on-ok": () => {
                        this.restartJobBt(params.row);
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
                      "重启"
                    )
                  ]
                );
                btnGroup.push(btn);
              }
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
          name, // 运行名称
          description, //  任务描述
          startDate, // 开始时间
          updateTime, // 修改时间
          createTime, //创建时间
          type, //任务关联类型
          runJobClass, //运行的CLASS
          state, //运行状态
          id
        } = this.list[i];
        tabData.push({
          taskName: name ? name : "无",
          description: description ? description : "无",
          startDate: startDate
            ? this.$options.filters.formatTime(startDate)
            : "无",
          updateTime: updateTime
            ? this.$options.filters.formatTime(updateTime)
            : "无",
          createTime: createTime
            ? this.$options.filters.formatTime(createTime)
            : "无",
          taskType: type ? type : "无",
          runJobClss: runJobClass ? runJobClass : "无",
          taskStatus: state >= 0 ? this.taskStatusList[state].name : "无",
          cellClassName: {
            taskStatus: state == 1 ? "cell-success" : "cell-error"
          },
          id
        });
      }
      return tabData;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    restartJobBt(row) {
      restartJob({ id: row.id }).then(data => {
        this.getList();
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
      getTaskList(data)
        .then(({ data, errorCode }) => {
          console.log(data);
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
      this.getList();
      console.log(this.searchForm);
    },
    /**
     * @method resetSearch 重置搜索条件
     */
    resetSearch() {
      this.$refs["search-form"].resetFields();
      this.searchForm.phone = null;
      this.searchForm.type = null;
      this.searchForm.code = null;
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



