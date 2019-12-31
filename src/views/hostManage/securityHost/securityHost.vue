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
          :label-width="70"
          v-if="searchIsShow"
        >
          <FormItem label="用户手机" prop="phone">
            <Input v-model.trim="searchForm.phone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
          <FormItem label="设备名称" prop="name">
            <Input v-model.trim="searchForm.name" placeholder="请输入设备名称" style="width:120px;" />
          </FormItem>
          <FormItem label="主机状态" prop="status">
            <Select v-model.trim="searchForm.status" placeholder="主机状态" style="width: 120px;">
              <Option
                v-for="(item, index) in machineStatus"
                :key="index"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="主机类型" prop="type">
            <Select v-model="searchForm.type" placeholder="请选择主机类型" style="width:120px;">
              <Option v-for="item in machineType" :key="item.code" :value="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="安装区域码" prop="installCode" :label-width="80">
            <Select v-model="searchForm.installCode" placeholder="请选择" style="width: 120px;">
              <Option
                v-for="item in serverList"
                :key="item.id"
                :value="item.installCode"
              >{{item.installCode}}</Option>
            </Select>
          </FormItem>
          <FormItem label="主机登录号" prop="queryAccount" :label-width="80">
            <Input v-model.trim="searchForm.queryAccount" style="width:120px;" placeholder="主机登录号" />
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
          v-if="$options.filters.auth(['hostM.security.add'])"
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
    <add v-model="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit
      @handleClose="editClose"
      :isShow="edit.isShow"
      :number="edit.number"
      :areaNumber="edit.areaNumber"
      :phone="edit.phone"
    ></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情弹窗-start -->
    <detail v-model="detail.isShow" :macNumber="detail.macNumber"></detail>
    <!-- 详情弹窗-end -->

    <!-- 绑定主机弹窗-start -->
    <bind @handleClose="bindClose" :isShow="bind.isShow" :number="bind.number"></bind>
    <!-- 绑定主机弹窗-end -->
  </div>
</template>
<script>
import add from "./add"; // 添加主机
import edit from "./edit"; // 编辑主机
import detail from "./detail/detail"; // 主机详情
import bind from "./bind";
import {mapState} from 'vuex'
import {
  getSecurityHostList,
  unBindSectorHost,
  hostStatus,
  getSetupServerList
} from "@/api/hostManage";
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
    bind
  },
  data() {
    return {
      serverList: [],
      hostStatusNum: 2,
      machineStatus: this.$options.filters.statusList("MachineStatus"),
      machineType: this.$options.filters.statusList("MachineType"),
      list: [], // table数据列表
      searchForm: {
        // 搜索表单
        name: null,
        phone: null,
        status: null,
        type: null // 主机类型
      },
      add: {
        // 添加弹窗
        isShow: false
      },
      edit: {
        // 编辑弹窗
        phone: null,
        areaNumber: null, // 区域number
        isShow: false,
        number: null
      },
      detail: {
        // 详情弹窗
        isShow: false,
        macNumber: null // 主机number
      },
      bind: {
        // 绑定弹窗
        isShow: false,
        number: null // 主机number
      },
      defenceArea: {
        // 防区列表
        isShow: false,
        macNumber: null // 防盗主机number
      },
      videoHost: {
        // 视频主机
        isShow: false,
        phone: null, // 用户电话
        macNumber: null // 防盗主机number
      },
      tabIsLoading: false, // 表格是否loading状态
      page: {
        // 分页相关参数
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  watch: {
    "add.isShow"(val) {
      if (!val) {
        this.getList();
      }
    },
    openHostManageTime(val) {
      //打开防盗主机页
      this.getList()
    }
  },
  computed: {
    ...mapState({
      openHostManageTime: state => state.common.openHostManageTime
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
          title: "主机类型",
          key: "type",
          width: 90,
          render: (h, params) => {
            return h(
              "div",
              {},
              this.$options.filters.statusName(params.row.type, "MachineType")
            );
          }
        },

        {
          title: "主机状态",
          key: "status",
          width: 90
        },
        {
          title: "是否在线",
          key: "onLine",
          width: 90,
          render: (h, params) => {
            return h("div", {}, params.row.onLine ? "在线" : "离线");
          }
        },
        {
          title: "设备名称",
          key: "name",
          width: 140
        },
        {
          title: "安装区域码",
          key: "installCode",
          width: 100
        },
        {
          title: "用户手机",
          key: "phone",
          width: 120
        },
        {
          title: "主机登录号",
          key: "account",
          width: 120
        },
        {
          title: "主机序列号",
          key: "serialNumber",
          width: 120
        },
        {
          title: "主机安装位置",
          key: "position",
          minWidth: 120
        },

        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            let editBtn = null;
            let delBtn = null;
            if (this.$options.filters.auth(["hostM.security.detail"])) {
              // 详情按钮
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    margin: " 0 2px"
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

            if (this.$options.filters.auth(["hostM.security.edit"])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "0 2px"
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
            if (
              this.$options.filters.auth(["hostM.security.unbinding"]) &&
              params.row.phone
            ) {
              let btn = h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: `你确定要解绑吗?`,
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.unBind(params.index);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      },
                      style: {
                        margin: "0 2px"
                      }
                    },
                    "解绑"
                  )
                ]
              );
              btnGroup.push(btn);
            }
            if (
              this.$options.filters.auth(["hostM.security.binding"]) &&
              !params.row.phone
            ) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    margin: "0 2px"
                  },
                  on: {
                    click: () => {
                      this.showBind(params.index);
                    }
                  }
                },
                "绑定"
              );
              btnGroup.push(btn);
            }

            return h("div", { style: { margin: "2px" } }, btnGroup);
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          type,
          phone,
          account,
          areaNumber,
          buildingName,
          doorName,
          name,
          number,
          plotName,
          position,
          serialNumber,
          status,
          userNumber,
          installCode,
          onLine
        } = this.list[i];
        let statusClass;
        if (status == "布防" && status) {
          statusClass = "cell-success";
        } else if (status == "撤防" && status) {
          statusClass = "cell-warning";
        } else if (status == "留守布防" && status) {
          statusClass = "cell-success";
        } else {
          statusClass = "";
        }
        tabData.push({
          type,
          phone,
          account,
          areaNumber,
          buildingName,
          doorName,
          name,
          number,
          plotName,
          position,
          serialNumber,
          status: type === 1 ? "" : status,
          userNumber,
          installCode,
          onLine,
          cellClassName: {
            status: statusClass
          }
        });
      }
      return tabData;
    }
  },
  mounted() {
    this.searchForm.phone = this.phone;
    this.getSetupServerList();
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
      getSecurityHostList(data)
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
      this.page.current = 1;
      this.searchForm.status = null;
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
      let { number, areaNumber, phone } = this.list[index];
      this.edit.phone = phone;
      this.edit.areaNumber = areaNumber;
      this.edit.number = number;
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
    /**
     * 显示详情弹窗
     * @param {Number} index 当前选择的数据的序号
     */
    showDetail(index) {
      let { number } = this.list[index];
      this.detail.macNumber = number;
      this.detail.isShow = true;
    },
    /**
     * 显示防区列表弹窗
     */
    showDefenceArea(index) {
      let { number } = this.list[index];
      this.defenceArea.macNumber = number;
      this.defenceArea.isShow = true;
    },
    /**
     * 防区列表弹窗关闭
     */
    defenceAreaClose() {
      this.defenceArea.isShow = false;
    },
    /**
     * 显示视频主机列表弹窗
     */
    showViodeHost(index) {
      let { number, phone } = this.list[index];
      this.videoHost.isShow = true;
      this.videoHost.phone = phone;
      this.videoHost.macNumber = number;
    },
    /**
     * 视频主机列表弹窗关闭
     */
    videoHostClose() {
      this.videoHost.isShow = false;
    },
    /**
     * 解绑防盗主机
     */
    unBind(index) {
      unBindSectorHost({
        number: this.list[index].number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("解绑成功");
          this.getList();
        }
      });
    },
    /**
     * 显示绑定弹窗
     */
    showBind(index) {
      this.bind.isShow = true;
      this.bind.number = this.list[index].number;
    },
    bindClose() {
      this.bind.isShow = false;
      this.getList();
    },
    getSetupServerList() {
      getSetupServerList({
        page: 1,
        pageSize: 99
      })
        .then(({ data, data: { list, total }, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            this.serverList = list;
          }
        })
        .catch(err => {
          this.tabIsLoading = false;
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
// .win-wrapper{
// position: relative;
// }
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
}
</style>


