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
          :label-width="60"
          v-if="searchIsShow"
        >
          <FormItem label="手机号" prop="userPhone">
            <Input v-model.trim="searchForm.userPhone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
          <FormItem label="用户分类" prop="type">
            <Select v-model="searchForm.type" placeholder="请选择用户分类" style="width:120px;">
              <Option v-for="item in AreaType" :value="item.code" :key="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Form>
        <ButtonGroup class="btns" v-if="searchIsShow">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button
          icon="md-add"
          v-if="$options.filters.auth(['hostM.installArea.add'])"
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
    <detail @handleClose="detailClose" :id="detail.id" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
    
    <!-- 编辑内容弹窗-start -->
    <bind
      @handleClose="bindClose"
      :isShow="bind.isShow"
      :areaNumber="bind.areaNumber"
      :phone="bind.phone"
    ></bind>
    <!-- 编辑内容弹窗-end -->

    <!-- 添加防盗主机-start -->
    <add-host v-model="addHost.isShow" :phone="addHost.phone"></add-host>
    <!-- 添加防盗主机-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import bind from "./bind";
import detail from "./detail";
import AddHost from '@/views/hostManage/securityHost/add'
import { getAreaList } from "@/api/dataManage";
import { delDefenceAreaBySecurity } from "@/api/hostManage";
export default {
  props: {
    searchIsShow: {
      type: Boolean,
      default: true
    },
    phone: {
      type: String,
      default: null
    }
  },
  components: {
    add,
    edit,
    detail,
    bind,
    AddHost
  },
  data() {
    return {
      AreaType: this.$options.filters.statusList("AreaType"),
      list: [],
      searchForm: {
        userPhone: null // 电话
      },
      add: {
        isShow: false
      },
      detail: {
        id: null,
        isShow: false
      },
      bind: {
        phone: null,
        areaNumber: null,
        isShow: false
      },
      edit: {
        isShow: false,
        id: null
      },
      addHost: {
          isShow: false,
          phone: null
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
          title: "用户分类",
          key: "type",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              {},
              this.$options.filters.statusName(params.row.type, "AreaType")
            );
          }
        },
        {
          title: "到期时间",
          key: "effectiveTime",
          width: 150,
          render: (h, {row: {effectiveTime}}) => {
            let divs = [
              h(
                "div",
                {
                  class: {
                    "cell-error": effectiveTime * 1000 < new Date().getTime()
                  }
                },
                effectiveTime ? this.$moment(effectiveTime * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                ) : ''
              )
            ];
            if (effectiveTime * 1000 < new Date().getTime()) {
              divs.push(
                h(
                  "div",
                  {
                    class: {
                      "cell-error":
                        effectiveTime * 1000 < new Date().getTime()
                    }
                  },
                  "已过期" +
                    this.$moment(effectiveTime * 1000).toNow(true)
                )
              );
            }
            return h("div", divs);
          }
        },
        {
          title: "手机号",
          key: "userPhone",
          width: 120
        },
        {
          title: "区域名称",
          key: "areaName",
          width: 150
        },
        {
          title: "小区名称",
          key: "plotName",
          width: 150
        },
        {
          title: "楼座",
          key: "buildingName",
          width: 100
        },
        {
          title: "门号",
          key: "doorName",
          width: 100
        },
        {
          title: "地址",
          key: "address",
          minWidth: 200
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
          width: 180,
          align: "left",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["hostM.installArea.detail"])) {
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
              this.$options.filters.auth(["hostM.installArea.edit"]) &&
              params.row.type != 2
            ) {
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
                      this.showEdit(params.index);
                    }
                  }
                },
                "编辑"
              );
              btnGroup.push(btn);
            }
            if (this.$options.filters.auth(["hostM.installArea.del"])) {
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
            if (this.$options.filters.auth(['hostM.security.add'])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
                  },
                  on: {
                    click: () => {
                      this.addSecurityHost(params.row.userPhone);
                    }
                  }
                },
                "添加主机"
              );
              btnGroup.push(btn);
            }
            if (
              !params.row.isHasInstall &&
              this.$options.filters.auth(["hostM.installArea.bind"])
            ) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
                  },
                  on: {
                    click: () => {
                      this.showBind(params.index);
                    }
                  }
                },
                "绑定业务单"
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
    this.searchForm.userPhone = this.phone;
    this.getList();
    // this.getRoleList();
  },
  methods: {
    addSecurityHost(phone) {
      // 调用bindHost
      this.addHost.isShow = true
      this.addHost.phone = phone
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
      getAreaList(data)
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
    bindClose() {
      this.bind.isShow = false;
      this.getList();
    },
    showBind(val) {
      let { userPhone, areaNumber } = this.list[val];
      console.log(userPhone);
      this.bind.phone = userPhone;
      this.bind.areaNumber = areaNumber;
      this.bind.isShow = true;
    },
    /**
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(index) {
      // 删除
      delDefenceAreaBySecurity({
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
      this.getList(this.searchForm);
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
<style lang="stylus" scoped>



// .win-wrapper {



//   position: relative;



// }



</style>



