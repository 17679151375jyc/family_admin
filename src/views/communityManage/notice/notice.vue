<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" inline :label-width="80">
          <FormItem label="选择小区" v-if="!curPlotNumber">
            <div style="display: flex;">
              <address-cascader
                ref="addressCascader"
                @onChange="addressCascaderChange"
                :showLevel="5"
                style="width: 250px"
              ></address-cascader>
            </div>
          </FormItem>
          <FormItem label="通知类型">
            <Select
              v-model.trim="searchForm.noticeTypeNumber"
              placeholder="输入通知类型"
              style="width: 120px;"
            >
              <Option
                v-for="(item,index) in roleList"
                :value="item.noticeTypeNumber"
                :key="index"
              >{{ item.typeName }}</Option>
            </Select>
          </FormItem>

          <FormItem label="标题">
            <Input v-model.trim="searchForm.noticeTitle" placeholder="输入标题" style="width:120px;" />
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
          v-if="$options.filters.auth(['communityM.notice.add'])"
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

    <!-- 详情-start -->
    <detail @handleClose="detailClose" :number="detail.number" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow" :noticeType="noticeType"></add>
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
import { getNoticeList, getNoticeType } from "@/api/communityManage";
import { mapState } from "vuex";
import { getPlotList } from "@/api/common";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    add,
    edit,
    detail,
    addressCascader
  },
  data() {
    return {
      plotList: [],
      roleList: [],
      OperateStatusList: this.$options.filters.statusList("OperatorStatus"),
      list: [],
      noticeType: {},
      searchForm: {
        plotNumber: null,
        noticeTypeNumber: null, //  通知类型
        noticeTitle: null, //标题
        provinceCode: null, //省
        cityCode: null, //市
        areaCode: null, //区
        streetCode: null //小区
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
    "searchForm.streetCode": function(val, oldVal) {
      if (val) {
        this.getPlotList(); // 当选择了街道时，拉一下小区数据
      } else {
        this.plotList = [];
      }
    }
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
          title: "社区名称",
          key: "plotName",
          width: 120
        },
        {
          title: "通知类型",
          key: "typeName",
          width: 120
        },
        {
          title: "标题",
          key: "noticeTitle",
          minWidth: 120,
          type: "html"
        },
        // {
        //   title: "通知内容",
        //   key: "noticeContent",
        //   minWidth: 180
        // },
        {
          title: "发布人",
          key: "realName",
          width: 100
        },
        {
          title: "发布时间",
          key: "postDate",
          width: 155
        },
        {
          title: "状态",
          key: "operateStatus",
          width: 150,
          render: (h, {row:{operateStatus}}) => {
              return h('div', this.$options.filters.statusName(operateStatus, 'OperatorStatus'))
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
            if (this.$options.filters.auth(["communityM.notice.detail"])) {
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
  async mounted() {
    await this.getNoticeType();
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
      getNoticeList(data)
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
     * 获取物业通知分类
     */
    getNoticeType() {
      return new Promise((resolve, reject) => {
        getNoticeType({})
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              this.roleList = data;
              for (let i = 0; i < data.length; i++) {
                this.noticeType[data[i].noticeTypeNumber] = data[i];
              }
              resolve();
            }
          })
          .catch(() => {
            reject();
          });
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
      if(!this.curPlotNumber){
        this.$refs["addressCascader"].resetData();
      }
      // this.searchForm.daterange = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
      this.searchForm.noticeTypeNumber = null; //  通知类型
      this.searchForm.noticeTitle = null; //标题
      this.searchForm.plotNumber = null;
      this.searchForm.provinceCode = null; //省
      this.searchForm.cityCode = null; //市
      this.searchForm.areaCode = null; //区
      this.searchForm.streetCode = null; //小区
      this.page.current = 1;
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
      let { noticeNumber } = this.list[index];
      this.detail.number = noticeNumber;
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



