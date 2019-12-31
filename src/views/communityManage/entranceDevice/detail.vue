<template>
  <Modal
    title="日志详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="1000"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="60">
          <FormItem prop="deviceRoleType" label="日志类型">
            <Select v-model="searchForm.type" style="width: 120px;" placeholder="选择日志类型"> 
              <Option v-for="item in typeStatus" :value="item.value" :key="item.value">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem prop="deviceName" label="日志记录">
            <Input v-model.trim="searchForm.remark" placeholder="输入日志记录" style="width:120px;" />
          </FormItem>
          <FormItem label="操作时间">
            <DatePicker
              ref="dataTimePicker"
              type="datetimerange"
              v-model.trim="searchForm.dateTime"
              @on-change="timeChange"
              placeholder="选择查询的时间段"
              style="width: 280px"
            ></DatePicker>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
    </div>
    <!-- 右上角关闭按钮-start -->
    <!-- <div class="tab-wrapper"> -->

      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="list"></Table>
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
    <!-- </div> -->
  </Modal>
</template>
<script>
import { getAdvertisementJournal } from "@/api/communityManage";
export default {
  props: {
    deviceAccount: {
      type: String,
      default: null
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchForm: {
        deviceAccount: null,
        remark: null,
        dateTime: null,
        type: null
      },
      typeStatus: {
        0: {
          value: 0,
          name: "解绑"
        },
        1:{
          value: 1,
          name: "绑定"
        },
        2:{
          value: 2,
          name: "操作"
        },
        3:{
          value: 3,
          name: "错误"
        }
      },
      list: [],
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
    isShow: async function(val) {
      if (val) {
        this.searchForm.deviceAccount = this.deviceAccount 
        this.getList();
      }
    }
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
        // {
        //   title: "门口机账号",
        //   key: "deviceAccount",
        //   width: 120
        // },
        {
          title: "日志类型",
          key: "type",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              this.typeStatus[params.row.type].name
            );
          }
        },
        {
          title: "日志记录",
          key: "remark",
          minWidth: 120
        },
        {
          title: "后台操作用户",
          key: "fbUserName",
          width: 120,
          render: (h, params) => {
            return h(
              "div",
              params.row.fbUserName?params.row.fbUserName:"自动操作"
            );
          }
        },        
        {
          title: "操作时间",
          key: "createTime",
          width: 140,
          render: (h, params) => {
            return h(
              "div",
              this.$moment(params.row.createTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
        },
      ];
    }
  },
  methods: {
    /**
     * 获取用户详情
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
      getAdvertisementJournal(data).then(({data, errorCode})=>{
        if(errorCode === 0){
          if(data.list){
            this.tabIsLoading = false,
            this.list = data.list
            this.page.total = data.total
          } else {
              this.list = [];
              this.page.total = 0;
            }
        }
      })
      
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
      this.$refs["dataTimePicker"].handleClear();
      this.searchForm.remark = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
      this.searchForm.type = null;
      this.page.current = 1;
      this.getList();
    },
    /**
     * 选择时间后
     */
    timeChange() {
      if (this.searchForm.dateTime[0]) {
        this.searchForm.startTime = new Date(this.searchForm.dateTime[0])
          .getTime()
          .toString()
          .substr(0, 10);
        this.searchForm.endTime = new Date(this.searchForm.dateTime[1])
          .getTime()
          .toString()
          .substr(0, 10);
      }
    },
    handleClose() {
      this.$emit("handleClose");
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
  }
};
</script>
<style lang="stylus" scoped>
</style>


