<!--主机消息-->
<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" inline :label-width="50">
          <FormItem label="手机号" prop="phone">
            <Input v-model.trim="searchForm.input.phone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
        </Form>
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" inline :label-width="60">
          <FormItem label="呼叫类型" prop="type">
            <Select v-model.trim="searchForm.input.type" placeholder="输入呼叫类型" style="width: 120px;">
              <Option
                v-for="(item,index) in callTypes"
                :value="item.value"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Form>

        <Form class="search-form" @keyup.enter.native="search" ref="search-form" inline :label-width="60">
          <FormItem label="返回类型">
            <Select v-model.trim="searchForm.input.code" placeholder="输入返回类型" style="width: 120px;">
              <Option
                v-for="(item,index) in callBackTypes"
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
import { getCallList } from "@/api/logManage";
export default {
  components: {
    add,
    edit,
    detail
  },
  data() {
    return {
      callTypes: this.$config.community.callType.type,
      callBackTypes: this.$config.community.callBackType.type,
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
        input: {
          phone: null,
          type: null,
          code: null
        }
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
          title: "呼叫类型",
          key: "callType",
          width: 150
        },
        // {
        //   title: "呼叫时间",
        //   key: "alarmtime",
        //   width: 150
        // },
        // {
        //   title: "机器名称",
        //   key: "machiename",
        //   width: 150
        // },
        {
          title: "手机号",
          key: "phone",
          width: 150
        },
        {
          title: "返回类型",
          key: "backStatus",
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
            let detailBtn = null;
            if (this.$options.filters.auth(['logM.call.detail'])) {
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
          type, // 呼叫类型
          alarmtime, //  呼叫时间
          param,
          machiename, // 机器名称
          code, // 结果
          phone // 手机号
        } = this.list[i];
        let listText = this.list[i];
        tabData.push({
          callType: this.callTypes[type].name,
          // alarmtime: JSON.parse(param).alarmtime ? JSON.parse(listText.param).alarmtime : "无",
          // machiename: JSON.parse(param).machiename ? JSON.parse(listText.param).machiename : "无",
          backStatus: code == 200 && code ? "返回成功" : "返回失败",
          phone: phone ? phone : "无",
          cellClassName: {
            backStatus: code == 200 ? "cell-success" : "cell-error"
          }
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
      getCallList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              let { list, total } = data;
              this.list = list;
              console.log(list);
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
      this.getList();
      console.log(this.searchForm);
    },
    /**
     * @method resetSearch 重置搜索条件
     */
    resetSearch() {
      this.$refs["search-form"].resetFields();
      this.searchForm.input.phone = null;
      this.searchForm.input.type = null;
      this.searchForm.input.code = null;
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



