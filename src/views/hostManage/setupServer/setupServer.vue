<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="80">
          <FormItem label="选择小区">
            <div style="display: flex;">
              <address-cascader
                ref="addressCascader"
                @onChange="addressCascaderChange"
                :showLevel="3"
                style="width: 160px"
              ></address-cascader>
            </div>
          </FormItem>
          <FormItem label="主机区域码">
            <Select v-model.trim="searchForm.input.installCode" placeholder="选择主机区域码" style="width:120px;" >
              <Option v-for='(item,index) in list' :key='index' :value="item.installCode">{{ item.installCode }}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否在线">
            <Select v-model.trim="searchForm.input.onLine" placeholder="选择是否在线" style="width: 120px;">
              <Option :value='1'>{{ '在线' }}</Option>
              <Option :value='0'>{{ '离线' }}</Option>
            </Select>
          </FormItem>
          <FormItem label="ip地址">
            <Input v-model.trim="searchForm.input.ip" placeholder="输入ip地址" style="width:120px;" />
          </FormItem>
          <FormItem label="端口号">
            <Input v-model.trim="searchForm.input.port" placeholder="输入端口号" style="width:120px;" />
          </FormItem>
          <FormItem label="上传端口">
            <Input v-model.trim="searchForm.input.uploadPort" placeholder="输入上传端口" style="width:120px;" />
          </FormItem>
          <FormItem label="服务器名称">
            <Input v-model.trim="searchForm.input.areaMachineName" placeholder="输入服务器名称" style="width:120px;" />
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button
          v-show="$options.filters.auth(['hostM.setupServer.add'])"
          icon="md-add"
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

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 详情弹窗-start -->
    <detail @handleClose="detailClose" :isShow="detail.isShow" :id="detail.id"></detail>
    <!-- 详情弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getSetupServerList, delHostNetworkDetail } from "@/api/hostManage";
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
      roleList: [],
      list: [],
      searchForm: {
        input: {
          installCode: null,//主机区域码
          onLine: null,//是否在线
          ip: null,//ip地址
          port: null,//端口号
          uploadPort: null,//上传端口号
          areaMachineName: null,//服务器名称
          provinceCode: null,
          cityCode: null,
          areaCode: null,// 省市区
        }
      },
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        id: null
      },
      detail: {
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
          title: "主机区域码",
          key: "installCode",
          width: 100
        },
        {
            title: '是否在线',
            key: 'onLine',
            width:100,
            render: (h, params) => {
                return h('div', params.row.onLine ? '在线' : '离线')
            }
        },
        {
          title: "ip地址",
          key: "ip",
          width: 120
        },
        {
          title: "端口号",
          key: "port",
          width: 100
        },
        {
          title: "上传端口号",
          key: "uploadPort",
          width: 100
        },
        {
          title: "服务器名称",
          key: "areaMachineName",
          minWidth: 100
        },
        {
          title: "地区",
          key: "arrderss",
          width: 180,
          render: (h, {row:{provinceName,cityName, areaName}}) => {
              return h('div', `${provinceName}-${cityName}-${areaName}`)
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
            if (this.$options.filters.auth(['hostM.setupServer.detail'])) {
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
            if (this.$options.filters.auth(['hostM.setupServer.edit'])) {
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
      getSetupServerList(data)
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
    showDetail(index) {
      let { id } = this.list[index];
      this.detail.id = id;
      this.detail.isShow = true;
    },
    /**
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(index) {
      // 删除
      delHostNetworkDetail({
        id: this.list[index].id
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    /**
     * 关闭详情弹窗
     */
    detailClose() {
      this.detail.isShow = false;
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
      this.searchForm.input.installCode = null,//主机区域码
      this.searchForm.input.onLine = null,//是否在线
      this.searchForm.input.ip = null,//ip地址
      this.searchForm.input.port = null,//端口号
      this.searchForm.input.uploadPort = null,//上传端口号
      this.searchForm.input.areaMachineName = null,//服务器名称
      this.page.current = 1;
      this.getList();
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.searchForm.input.provinceCode = value[0];
      this.searchForm.input.cityCode = value[1];
      this.searchForm.input.areaCode = value[2];
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
      this.edit.id = index;
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
    }
  }
};
</script>



