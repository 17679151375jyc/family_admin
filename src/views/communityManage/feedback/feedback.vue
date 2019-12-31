<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="80">
          <FormItem prop="plotNumber" label="小区楼座" v-if="!curPlotNumber">
            <div style="display: flex;">
              <address-cascader
                ref="addressCascader"
                @onChange="addressCascaderChange"
                :showAllText="true"
                :showAllTextLevel="2"
                :showLevel="7"
                style="width: 250px"
              ></address-cascader>
            </div>
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
          <FormItem label="手机号">
            <Input v-model.trim="searchForm.userPhone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
          <FormItem label="类型">
            <Select v-model.trim="searchForm.feedbackType" placeholder="选择类型" style="width: 120px;">
              <Option
                v-for="(item, key, index) in typeList"
                :key="index"
                :value="item.value"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否查阅">
            <Select v-model.trim="searchForm.auditStatus" placeholder="选择状态" style="width: 120px;">
              <Option
                v-for="(item, key, index) in auditStatusList"
                :key="index"
                :value="item.status"
              >{{ item.name }}</Option>
            </Select>
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
    <detail
      @handleClose="detailClose"
      :feedbackNumber="detail.feedbackNumber"
      :isShow="detail.isShow"
    ></detail>
    <!-- 详情-end -->


    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import Edit from "./edit";
import Detail from "./detail";
import { getFeedbackList } from "@/api/communityManage";
import { mapState } from "vuex";
import AddressCascader from "@/components/addressCascader/addressCascader";
import BuildingCascader from "@/components/buildingCascader/buildingCascader";
export default {
  components: {
    Edit,
    Detail,
    AddressCascader,
    BuildingCascader
  },
  data() {
    return {
      auditStatusList: {
        0: {
          name: "未查阅",
          status: 0,
          class: ""
        },
        1: {
          name: "已查阅",
          status: 1,
          class: ""
        }
      },
      typeList: this.$config.community.feedback.type,
      list: [],
      searchForm: {
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        streetCode: null,
        plotNumber: null,
        userPhone: null, // 电话
        feedbackType: null, //类型
        auditStatus: null //状态
      },
      add: {
        isShow: false
      },
      detail: {
        feedbackNumber: null,
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
      curPlotNumber: state => state.user.curPlotNumber
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
        {
          title: "类型",
          key: "feedbackType",
          width: 100
        },
        {
          title: "反馈人",
          key: "realName",
          width: 100
        },
        {
          title: "反馈人电话",
          key: "userPhone",
          width: 150
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
          title: "反馈内容",
          key: "feedback",
          minWidth: 150
        },
        {
          title: "查阅人",
          key: "auditReader",
          width: 100
        },
        {
          title: "反馈时间",
          key: "postDate",
          width: 150
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (
              this.$options.filters.auth(["communityM.feedback.detail"]) &&
              params.row.auditReader !== "未查阅"
            ) {
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

            if (
              this.$options.filters.auth(["communityM.feedback.edit"]) &&
              params.row.auditReader == "未查阅"
            ) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "warning",
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
                "处理"
              );
              btnGroup.push(btn);
            }
            // delBtn = h(
            //   "Poptip",
            //   {
            //     props: {
            //       confirm: true,
            //       title: "你确定要删除吗?",
            //       transfer: true
            //     },
            //     on: {
            //       "on-ok": () => {
            //         this.delItem(params.index);
            //       }
            //     }
            //   },
            //   [
            //     h(
            //       "Button",
            //       {
            //         props: {
            //           type: "error",
            //           size: "small"
            //         }
            //       },
            //       "删除"
            //     )
            //   ]
            // );
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
          auditReader, // 查阅人
          auditStatus, // 查阅状态 0未阅，1已阅
          realName, // 提交人名称
          userPhone, // 提交人号码
          plotName, // 小区名
          buildingName, // 楼座名
          doorName, // 门号名
          feedback, // 反馈内容
          feedbackType, // 反馈类型，1报障，2建议
          postDate // 发布时间
        } = this.list[i];
        tabData.push({
          auditReader: auditReader ? auditReader : "未查阅", // 查阅人
          auditStatus, // 查阅状态 0未阅，1已阅
          realName, // 提交人名称
          userPhone, // 提交人号码
          plotName, // 小区名
          buildingName, // 楼座名
          doorName, // 门号名
          feedback, // 反馈内容
          feedbackType: this.typeList[feedbackType].name, // 反馈类型，1报障，2建议
          postDate: this.$options.filters.formatTime(postDate), // 发布时间
          cellClassName: {
            auditReader: auditReader ? "" : "cell-error",
            feedbackType: this.typeList[feedbackType].class
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
      getFeedbackList(data)
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
      this.searchForm.daterange = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
      this.searchForm.userPhone = null;
      this.searchForm.feedbackType = null;
      this.searchForm.auditStatus = null;
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
      let { feedbackNumber } = this.list[index];
      this.detail.feedbackNumber = feedbackNumber;
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
     * 地址选择组件改变
     */ addressCascaderChange(value) {
      this.searchForm.provinceCode = value[0];
      this.searchForm.cityCode = value[1];
      this.searchForm.areaCode = value[2];
      this.searchForm.streetCode = value[3];
      this.searchForm.plotNumber = value[4];
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



