<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" :model="searchForm" inline :label-width="60">
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

          <!-- <FormItem label="审核状态">
            <Select v-model.trim="searchForm.status" placeholder="请选择审核状态" style="width:120px;">
              <Option
                v-for="(item, index) in statusList"
                :key="index"
                :value="item.value"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>-->

          <FormItem label="申请人">
            <Input v-model.trim="searchForm.contactName" placeholder="请输入申请人" style="width:120px;" />
          </FormItem>

          <FormItem label="手机号">
            <Input
              v-model.trim="searchForm.contactPhone"
              placeholder="请输入手机号"
              style="width:120px;"
            />
          </FormItem>

          <FormItem label="住户类型">
            <Select
              v-model.trim="searchForm.contactRelation"
              placeholder="请选择住户类型"
              style="width:120px;"
            >
              <Option
                v-for="(item, index) in relationList"
                :key="index"
                :value="item.name"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper"></div>
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
    <detail @handleClose="detailClose" :number="detail.number" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :number="edit.number"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 审核弹窗-start -->
    <check
      @handleClose="checkClose"
      :isShow="check.isShow"
      :faceNumber="check.faceNumber"
      :plotNumber="check.plotNumber"
    ></check>
    <!-- 审核弹窗-end -->
  </div>
</template>
<script>
import Add from "./add";
import Edit from "./edit";
import Detail from "./detail";
import Check from "./check";
import { getFaceList, delFace } from "@/api/communityManage";
import AddressCascader from "@/components/addressCascader/addressCascader";
import BuildingCascader from "@/components/buildingCascader/buildingCascader";
import { mapState } from "vuex";
export default {
  components: {
    Add,
    Edit,
    Detail,
    Check,
    AddressCascader,
    BuildingCascader
  },
  data() {
    return {
      relationList: {
        1000: {
          name: "业主",
          value: 1000
        },
        1001: {
          name: "家人",
          value: 1001
        },
        1002: {
          name: "朋友",
          value: 1002
        }
      },
      statusList: this.$config.community.entranceGuard.status,
      list: [],
      plotList: [],
      searchForm: {
        status: null,
        contactName: null,
        contactPhone: null,
        contactRelation: null,

        provinceCode: null,
        cityCode: null,
        areaCode: null,
        streetCode: null,
        plotNumber: null,
        buildingNumber: null,
        doorNumber: null
      },
      add: {
        isShow: false
      },
      detail: {
        number: null,
        isShow: false
      },
      edit: {
        isShow: false,
        number: null
      },
      check: {
        isShow: false,
        faceNumber: null, // 人脸number,
        plotNumber: null //小区number
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
          title: "人脸图片",
          width: 136,
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  "flex-div": true
                },
                style: {
                  display: "flex",
                  "justify-content": "center",
                  "align-items": "center",
                  width: "100px",
                  height: "100px"
                }
              },
              [
                h("img", {
                  attrs: {
                    src:
                      params.row.facePicture ||
                      require("@/assets/images/none.png")
                  },
                  style: {
                    maxWidth: "100%",
                    maxHeight: "100%"
                  }
                })
              ]
            );
          }
        },
        // {
        //   title: "审核状态",
        //   key: "status",
        //   width: 120
        // },
        {
          title: "申请人",
          key: "contactName",
          width: 120
        },
        {
          title: "手机号",
          key: "contactPhone",
          tooltip: true,
          width: 120
        },
        {
          title: "住户类型",
          key: "contactRelation",
          width: 120
        },
        {
          title: "小区楼座",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "div",
              (params.row.plotName || "") +
                (params.row.buildingName || "") +
                (params.row.doorName || "")
            );
          }
        },
        {
          title: "更新时间",
          key: "lastUpdate",
          width: 150,
          render: (h, { row: { lastUpdate } }) => {
            return h(
              "div",
              this.$moment(lastUpdate * 1000).format("YYYY-MM-DD HH:mm:ss")
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
            if (
              this.$options.filters.auth(["communityM.entranceGuard.detail"])
            ) {
              //如果状态为正常和不通过时，才显示详情
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
            // if (
            //   (params.row.status === this.statusList[0].name ||
            //     params.row.status === this.statusList[3].name) 
            // ) {
            //   // 如果为未审核和审核中，就显示出审核按钮
            //   let btn = h(
            //     "Button",
            //     {
            //       props: {
            //         type: "warning",
            //         size: "small"
            //       },
            //       style: {
            //         margin: "0 2px"
            //       },
            //       on: {
            //         click: () => {
            //           this.showCheck(params.index);
            //         }
            //       }
            //     },
            //     "审核"
            //   );
            //   btnGroup.push(btn);
            // }
            if (this.$options.filters.auth(["communityM.entranceGuard.del"])) {
              let poptip = h(
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
              btnGroup.push(poptip);
            }

            return h("div", btnGroup);
          }
        }
      ];
    }
  },
  mounted() {
    this.getList();
    // this.getRoleList();
  },
  watch: {
    "searchForm.streetCode": function(val, oldVal) {
      if (val) {
        this.getPlotList(); // 当选择了街道时，拉一下小区数据
      } else {
        this.plotList = [];
      }
    }
  },
  methods: {
    /**
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        isDelete: 0,
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getFaceList(data)
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
      delFace({
        faceNumber: this.list[index].faceNumber
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
      this.page.current = 1;
      this.searchForm.status = null;
      this.searchForm.contactName = null;
      this.searchForm.contactPhone = null;
      this.searchForm.contactRelation = null;
      this.getList();
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
    },
    /**
     * 根据省市区获取小区列表
     */
    getPlotList() {
      getPlotList({
        streetCode: this.searchForm.streetCode
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.plotList = data.list;
        }
      });
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
      let { faceNumber } = this.list[index];
      this.detail.number = faceNumber;
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
     * 显示审核弹窗
     */
    showCheck(index) {
      this.check.isShow = true;
      let { faceNumber, plotNumber } = this.list[index];
      this.check.faceNumber = faceNumber;
      this.check.plotNumber = plotNumber;
    },
    /**
     * 关闭审核弹窗
     */
    checkClose(isRefresh = false) {
      this.check.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    }
  }
};
</script>



