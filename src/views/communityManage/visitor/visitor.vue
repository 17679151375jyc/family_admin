<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="80">
          <FormItem label="小区楼座" v-if="!curPlotNumber">
            <address-cascader
              ref="addressCascader"
              @onChange="addressCascaderChange"
              :showAllText="true"
              :showAllTextLevel="5"
              :showLevel="7"
              style="width: 250px"
            ></address-cascader>
          </FormItem>
          <FormItem label="楼座门号" v-if="curPlotNumber">
            <building-cascader
              ref="buildingCascader"
              :showAllText="true"
              :showAllTextLevel="2"
              @onChange="buildingCascaderChange"
              style="width: 150px;"
            ></building-cascader>
          </FormItem>
          <FormItem label="业主电话" prop="phone">
            <Input v-model.trim="searchForm.phone" placeholder="输入业主电话" style="width:120px;" />
          </FormItem>
          <FormItem label="访客电话" prop="visitorPhone">
            <Input
              v-model.trim="searchForm.visitorPhone"
              placeholder="输入访客电话"
              style="width:120px;"
            />
          </FormItem>
          <FormItem label="时间范围">
            <DatePicker
              ref="dataTimePicker"
              type="datetimerange"
              v-model.trim="searchForm.dateTime"
              @on-change="timeChange"
              placeholder="选择查询的时间段"
              style="width: 300px"
            ></DatePicker>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <!-- <Button icon="md-add"  type="info" @click="showAdd">添加</Button> -->
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
    <detail
      @handleClose="detailClose"
      :visitorNumber="detail.visitorNumber"
      :isShow="detail.isShow"
    ></detail>
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
import { getVisitorList } from "@/api/communityManage";
import { mapState } from "vuex";
import { hasOneOf } from "@/libs/tools";
import AddressCascader from "@/components/addressCascader/addressCascader";
import BuildingCascader from "@/components/buildingCascader/buildingCascader";
export default {
  components: {
    add,
    edit,
    detail,
    AddressCascader,
    BuildingCascader
  },
  data() {
    return {
      statusList: this.$config.community.visitor.status,
      list: [],
      searchForm: {
        phone: null, // 电话
        visitorPhone: null,
        dateTime: [],
        startTime: null,
        endTime: null,
        plotNumber: null,
        buildingNumber: null,
        doorNumber: null
      },
      add: {
        isShow: false
      },
      detail: {
        visitorNumber: null,
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
    ...mapState({
      curPlotNumber: state => state.user.curPlotNumber,
      jurisdiction: state => state.user.jurisdiction
    }),
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
        // {
        //   title: "访客身份证",
        //   width: 100,
        //   align: "center",
        //   render: (h, params) => {
        //     return h(
        //       "div",
        //       {
        //         class: {
        //           "flex-div": true
        //         },
        //         style: {
        //           display: "flex",
        //           "justify-content": "center",
        //           "align-items": "center"
        //         }
        //       },
        //       [
        //         h("img", {
        //           attrs: {
        //             width: 50,
        //             height: 50,
        //             src:
        //               params.row.facadePicture ||
        //               require("@/assets/images/none.png")
        //           }
        //         })
        //       ]
        //     );
        //   }
        // },
        {
          title: "状态",
          key: "status",
          width: 100
        },
        {
          title: "小区名称",
          key: "plotName",
          width: 100
        },
        {
          title: "楼座名",
          key: "buildingName",
          width: 100
        },
        {
          title: "门号",
          key: "doorName",
          width: 100
        },
        {
          title: "业主姓名",
          key: "realName",
          width: 100
        },
        {
          title: "业主电话",
          key: "phone",
          width: 120
        },
        {
          title: "访客姓名",
          key: "visitorName",
          width: 100
        },
        {
          title: "访客性别",
          key: "visitorSex",
          width: 100
        },
        {
          title: "访客电话",
          key: "visitorPhone",
          width: 150
        },
        {
          title: "同行人数",
          key: "visitorQuantity",
          width: 100
        },
        {
          title: "来访时间",
          key: "startTime",
          minWidth: 150
        },
        {
          title: "离开时间",
          key: "endTime",
          minWidth: 150
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["communityM.visitor.detail"])) {
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
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          plotName, // 小区名
          buildingName, // 楼座名
          doorName, // 门号
          startTime, // 开始时间
          endTime, // 结束时间
          visitorName, // 访客名
          visitorSex, // 访客性别
          visitorPhone, //防客电话
          facadePicture, // 身份证图片,
          status, // 状态
          visitorQuantity, // 同行人数
          phone, // 业主电话
          realName //业主姓名
        } = this.list[i];
        tabData.push({
          plotName, // 小区名
          buildingName, // 楼座名
          doorName, // 门号
          startTime: this.$options.filters.formatTime(
            startTime * 1000,
            "Y-M-D h:m:s"
          ), // 开始时间
          endTime: this.$options.filters.formatTime(
            endTime * 1000,
            "Y-M-D h:m:s"
          ), // 结束时间
          visitorName, // 访客名
          visitorSex: visitorSex ? "男" : "女", // 访客性别
          visitorPhone, //防客电话
          facadePicture, // 身份证图片
          status: this.statusList[status].name, // 状态
          visitorQuantity, // 同行人数
          phone, // 业主电话
          realName, //业主姓名
          cellClassName: {
            status: this.statusList[status].class
          }
        });
      }
      return tabData;
    }
  },
  mounted() {
    this.getList();
    // this.getRoleList();
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
      getVisitorList(data)
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
      this.$refs["addressCascader"] &&
        this.$refs["addressCascader"].resetData();
      this.$refs["buildingCascader"] &&
        this.$refs["buildingCascader"].resetData();
      this.$refs["dataTimePicker"].handleClear();
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
      let { visitorNumber } = this.list[index];
      this.detail.visitorNumber = visitorNumber;
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
     * 选择时间后
     */
    timeChange() {
      if (this.searchForm.dateTime[0]) {
        this.searchForm.startTime = new Date(this.searchForm.dateTime[0])
          .getTime()
          .toString()
          .substr(0, 10);
        this.searchForm.endTime = new Date(this.searchForm.dateTime[1])
          .getTime()
          .toString()
          .substr(0, 10);
      }
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.searchForm.provinceCode = value[0];
      this.searchForm.cityCode = value[1];
      this.searchForm.areaCode = value[2];
      this.searchForm.streetCode = value[3];
      this.searchForm.plotNumber = value[4];
      this.searchForm.buildingNumber = value[5];
      this.searchForm.doorNumber = value[6];
    },
    /**
     * 楼座组件改变
     */
    buildingCascaderChange(value) {
      this.searchForm.buildingNumber = value[0];
      this.searchForm.doorNumber = value[1];
    }
  }
};
</script>



