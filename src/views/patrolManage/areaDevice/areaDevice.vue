<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" :model="searchForm" inline :label-width="70">
          <FormItem label="设备名称">
            <Input v-model.trim="searchForm.input.name" placeholder="请输入设备名称" style="width:120px;" />
          </FormItem>
          <FormItem label="布防区域">
            <Input v-model.trim="searchForm.input.areaName" placeholder="请输入布防区域" style="width:120px;" />
          </FormItem>
          <FormItem label="用户姓名">
            <Input v-model.trim="searchForm.input.userRealName" placeholder="请输入用户名" style="width:120px;" />
          </FormItem>
          <FormItem label="用户手机">
            <Input v-model.trim="searchForm.input.userPhone" placeholder="请输入用户手机号" style="width:120px;" />
          </FormItem>
          <FormItem label="设备类型">
            <Select v-model.trim="searchForm.input.type" placeholder="请选择设备类型" style="width:120px;">
              <Option :value='item.value' v-for='(item,index) in equipment' :key='index'>{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button icon="md-add" v-if="$options.filters.auth(['patrolM.areaDevice.add'])" type="info" @click="showAdd">添加</Button>
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

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情弹窗-start -->
    <detail
      @handleClose="detailClose"
      :areaNumber="detail.areaNumber"
      :isShow="detail.isShow"
      :id="detail.id"
    ></detail>
    <!-- 详情弹窗-end -->

    <!-- 绑定主机弹窗-start -->
    <bind @handleClose="bindClose" :isShow="bind.isShow" :id="bind.id"></bind>
    <!-- 绑定主机弹窗-end -->
  </div>
</template>
<script>
import add from "./add"; // 添加主机
import edit from "./edit"; // 编辑主机
import detail from "./detail"; // 主机详情
import bind from "./bind";
import { getRegionEquipment, unbindAreaDevice } from "@/api/patrolManage";
import { mapState } from "vuex";
export default {
  components: {
    add,
    edit,
    detail,
    bind
  },
  data() {
    return {
      hostStatusNum: 2,
      equipment: {
        // 主机状态列表
        1: {
          name: "蓝牙巡更",
          value: "1"
        }
      },
      list: [], // table数据列表
      searchForm: {
        input:{
          name: null,//设备名称
          areaName: null,//布防区域
          userRealName: null,//用户名
          userPhone: null, //用户手机
          type: null//设备类型
        }
      },
      add: {
        // 添加弹窗
        isShow: false
      },
      edit: {
        // 编辑弹窗
        isShow: false,
        id: null
      },
      detail: {
        // 详情弹窗
        id: null,
        isShow: false,
        areaNumber: null // 主机number
      },
      bind: {
        // 绑定弹窗
        id: null,
        isShow: false,
        number: null // 主机number
      },
      defenceArea: {
        // 防区列表
        isShow: false,
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
          title: "设备名称",
          key: "name",
          width: 150
        },
        {
          title: "设备号",
          key: "code",
          width: 150
        },
        {
          title: "布防区域",
          key: "areaName",
          width: 150
        },
        {
          title: "用户名",
          key: "userRealName",
          width: 100
        },
        {
          title: "用户手机",
          key: "userPhone",
          width: 120
        },
        {
          title: "设备类型",
          key: "type",
          width: 100
        },
        {
          title: "创建时间",
          key: "createTime",
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
            if (this.$options.filters.auth(['patrolM.areaDevice.detail'])) {
              // 详情按钮
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "2px"
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
            if (this.$options.filters.auth(['patrolM.areaDevice.edit'])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "2px"
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
            if (this.$options.filters.auth(['patrolM.areaDevice.unbind']) && params.row.userPhone) {
              let btn = h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要解绑吗?",
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
                        marginRight: "2px"
                      }
                    },
                    "解绑"
                  )
                ]
              );
              btnGroup.push(btn);
            }
            if (this.$options.filters.auth(['patrolM.areaDevice.bind']) && !params.row.userPhone) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "2px"
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

            return h("div", btnGroup);
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          name,
          areaName,
          code,
          userPhone,
          userRealName,
          type,
          createTime
        } = this.list[i];
        tabData.push({
          name,
          areaName,
          code,
          userPhone,
          userRealName,
          type: this.equipment[type].name,
          createTime: this.$options.filters.formatTime(createTime)
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
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getRegionEquipment(data)
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
      this.searchForm.input.name = null;
      this.searchForm.input.areaName = null;
      this.searchForm.input.userRealName = null;
      this.searchForm.input.userPhone = null;
      this.searchForm.input.type = null;
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
    /**
     * 显示详情弹窗
     * @param {Number} index 当前选择的数据的序号
     */
    showDetail(index) {
      let { id, areaNumber } = this.list[index];
      this.detail.id = id;
      this.detail.areaNumber = areaNumber;
      this.detail.isShow = true;
    },
    /**
     * 关闭详情弹窗
     */
    detailClose() {
      this.detail.isShow = false;
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
     * 解绑防盗主机
     */
    unBind(index) {
      unbindAreaDevice({
        areaDeviceId: this.list[index].id
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
      this.bind.id = this.list[index].id;
    },
    bindClose() {
      this.bind.isShow = false;
      this.getList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
}
</style>


