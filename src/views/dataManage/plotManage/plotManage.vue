<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container" v-if="companyType!==1">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" :model="searchForm" inline :label-width="80">
          <FormItem label="小区名称" prop="plotName">
            <Input v-model.trim="searchForm.plotName" placeholder="输入小区名称" style="width:120px;" />
          </FormItem>
          <FormItem label="省市区街道" prop="roleId">
            <address-cascader ref="addressCascader" :clearable="false" @onChange="addressOnChange"></address-cascader>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button
          v-if="$options.filters.auth(['common.plogM.add'])"
          icon="md-add"
          type="info"
          @click="showAdd"
        >添加</Button>
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
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 添加楼座-start -->
    <building-manage
      @handleClose="addBuildingClose"
      :isShow="addBuilding.isShow"
      :plotName="addBuilding.plotName"
      :plotNumber="addBuilding.plotNumber"
    ></building-manage>
    <!-- 添加楼座-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :number="edit.number"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import buildingManage from "./buildingManage/buildingManage";
import { getPlotList, delPlots } from "@/api/dataManage";
import { mapState } from "vuex";
import { hasOneOf } from "@/libs/tools";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    add,
    edit,
    buildingManage,
    addressCascader
  },
  data() {
    return {
      roleList: [],
      list: [],
      searchForm: {
        plotName: null,
        province: null,
        city: null,
        area: null,
        street: null
      },
      add: {
        isShow: false
      },
      addBuilding: {
        isShow: false,
        plotNumber: null,
        plotName: null
      },
      edit: {
        isShow: false,
        number: null
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
      companyType: state => state.user.companyType
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
          title: "物管公司",
          key: "companyName",
          width: 150
        },
        {
          title: "小区名称",
          key: "plotName",
          width: 150
        },
        {
          title: "类型",
          key: "communityCanUse",
          width: 200
        },
        {
          title: "省",
          key: "provinceName",
          width: 100
        },
        {
          title: "市",
          key: "cityName",
          width: 100
        },
        {
          title: "区",
          key: "areaName",
          width: 100
        },
        {
          title: "街道",
          key: "streetName",
          width: 150
        },
        {
          title: "详细地址",
          key: "address",
          minWidth: 150
        },
        // {
        //     title: '坐标',
        //     key: 'map',
        //     width: 100,
        //     align: 'center',
        //     render: (h, params) => {
        //         let btn = h(
        //             "Button",
        //             {
        //                 props: {
        //                     type: 'info',
        //                     size: 'small'
        //                 },
        //                 on: {
        //                     click: () => {

        //                     }
        //                 }
        //             },
        //             "查看位置"
        //         )
        //         return h('div', [btn])
        //     }
        // },
        {
          title: "操作",
          key: "handle",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["common.plogM.buildingM.view"])) {
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
                      this.showBuildingManage(params.index);
                    }
                  }
                },
                "楼座管理"
              );
              btnGroup.push(btn);
            }
            if (this.$options.filters.auth(["common.plogM.edit"])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showEdit(params.index);
                    }
                  }
                },
                "编辑"
              );
              btnGroup.push(btn);
            }
            if (true) {
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
          provinceName,
          cityName,
          areaName,
          streetName,
          plotName,
          address,
          latitude,
          longitude,
          communityCanUse
        } = this.list[i];
        tabData.push({
          companyName,
          plotName,
          provinceName,
          cityName,
          areaName,
          streetName,
          address,
          coordinates: [longitude, latitude],
          communityCanUse: communityCanUse
            ? "用于社区和安装区域"
            : "仅用于安装区域"
        });
      }
      return tabData;
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
        page: current,
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getPlotList(data)
        .then(({ data, data: { list, total }, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            this.list = list;
            this.page.total = total;
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
      delPlots({
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
      this.$refs["addressCascader"].resetData();
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
    showBuildingManage(index) {
      // 添加楼座
      let { plotName, plotNumber } = this.list[index];
      console.log(plotName, plotNumber);
      this.$set(this.addBuilding, "plotName", plotName);
      this.$set(this.addBuilding, "plotNumber", plotNumber);
      this.addBuilding.isShow = true;
    },
    addBuildingClose() {
      // 添加楼座关闭
      this.addBuilding.isShow = false;
    },
    /**
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      let { plotNumber } = this.list[index];
      this.edit.number = plotNumber;
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
    addressOnChange(value) {
      this.searchForm.province = value[0];
      this.searchForm.city = value[1];
      this.searchForm.area = value[2];
      this.searchForm.street = value[3];
    }
  }
};
</script>



