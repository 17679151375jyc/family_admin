<!--主机消息-->
<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" inline :label-width="50">
          <FormItem label="手机号" prop="phone">
            <Input v-model.trim="searchForm.phone" placeholder="输入手机号" style="width:120px;" />
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
    <!-- <detail @handleClose="detailClose" :id="detail.id" :isShow="detail.isShow"></detail> -->
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <!-- <add @handleClose="addClose" :isShow="add.isShow"></add> -->
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <!-- <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit> -->
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { getVerificationList } from "@/api/logManage";
import { mapState } from "vuex";
import { hasOneOf } from "@/libs/tools";
export default {
  components: {
    add,
    edit,
    detail
  },
  data() {
    return {
      sendTypes: this.$config.community.sendType.type,
      sendBackTypes: this.$config.community.sendBackType.type,
      sendType: {
        1: "注册",
        2: "登录",
        3: "忘记密码",
        30: "提醒用户报警",
        50: "通知民警处理"
      },
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
        phone: null,
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
          title: "手机号",
          key: "phone",
          minWidth: 150
        },
        {
          title: "验证码",
          key: "code",
          minWidth: 150
        },
        {
          title: '发送时间',
          key: 'crateTime',
          minWidth: 150
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          phone, // 手机号
          code ,// 验证码
          crateTime
        } = this.list[i];
        tabData.push({
          phone: phone ? phone : "无", // 手机号
          code: code ? code : "无" ,//验证码
          crateTime: crateTime ? this.$options.filters.formatTime(crateTime) : "无" //验证码
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
      getVerificationList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          console.log(data)
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
      this.searchForm.phone = null;
      // this.$refs["search-form"].resetFields();
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



