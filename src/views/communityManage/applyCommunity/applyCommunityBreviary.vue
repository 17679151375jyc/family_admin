<!--摘要列表-->
<template>
  <div class="list-wrapper" style='position: relative;'>
    <Spin size="large" style='position: absolute;left: 48%;top: 150px' v-if='tabIsLoading'></Spin>
    <div class="list-items">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="time">{{item.applyTime|formatTime}}</div>
        <div class="info">
          <div class="left">
            <div class="name">{{item.realName}}</div>
            <div class="plotName">{{`${item.plotName}-${item.buildingName}-${item.doorName}`}}</div>
          </div>
          <div class="right" v-if="$options.filters.auth(['communityM.applyList.check'])">
            <div class="more" @click="showCheck(index)">审核资料>></div>
          </div>
        </div>
      </div>
      <div v-if="list.length===0" class="nodata_css">
        <img src="@/assets/images/community/nodata_img.png">
        <div>暂无数据</div>
      </div>
    </div>

    <!-- 分页-start -->
    <Page
      placement="top"
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="page.sizeOpts"
      :current="page.current"
      class="page-wrapper"
      @on-page-size-change="pageSizeChange"
      @on-change="pageChange"
    />
    <!-- 分页-end -->

    <!-- 详情-start -->
    <detail @handleClose="detailClose" :number="detail.number" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 审核弹窗-start -->
    <check @handleClose="checkClose" :isShow="check.isShow" :number="check.number"></check>
    <!-- 审核弹窗-end -->
  </div>
</template>
<script>
import detail from "./detail";
import check from "./check";
import { getCommunityApplyList } from "@/api/communityManage";
import { getPlotList } from "@/api/common";
import { mapState } from "vuex";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    detail,
    check,
    addressCascader
  },
  props: {
    status: {
      // 审核状态
      type: Number,
      default: 0
    },
    refreshNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      plotList: [],
      statusList: this.$config.community.apply.status,
      list: [],
      searchForm: {
        phone: null, // 电话
        status: this.status,
        plotNumber: this.curPlotNumber,
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        streetCode: null
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
      check: {
        isShow: false,
        number: null
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: 20,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  computed: {
    ...mapState({
      curPlotNumber: state => state.user.curPlotNumber
    })
  },
  watch: {
    "searchForm.streetCode": function(val, oldVal) {
      if (val) {
        this.getPlotList(); // 当选择了街道时，拉一下小区数据
      } else {
        this.plotList = [];
      }
    },
    refreshNumber: function() {
      // 如果刷新的数值改变时，就重新刷新一下页面
      this.refresh();
    },
    curPlotNumber: function() {
      this.getList();
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
      console.log("status", status);
      this.list = [];
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getCommunityApplyList(data)
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
      this.$refs["addressCascader"].resetData();
      this.searchForm.daterange = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
      this.page.current = 1;
      this.getList();
    },
    /**
     * 刷新页面
     */
    refresh() {
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
      let { applyNumber } = this.list[index];
      this.detail.number = applyNumber;
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
      this.check.number = this.list[index].applyNumber;
    },
    /**
     * 关闭审核弹窗
     */
    checkClose(isRefresh = false) {
      this.check.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.searchForm.provinceCode = value[0];
      this.searchForm.cityCode = value[1];
      this.searchForm.areaCode = value[2];
      this.searchForm.streetCode = value[3];
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
    }
  }
};
</script>
<style lang="stylus" scoped>
.list-wrapper {
  display: flex;
  width: 100%;
  flex-flow: column;

  .list-items {
    flex: 1;
    background: #EBEBEB;
    overflow: auto;
    border: 2px solid #EBEBEB;

    .item {
      background: #fff;
      margin-bottom: 2px;
      padding: 10px;

      &:hover {
        background: rgba(255, 255, 255, 0.7);
      }

      .time {
        font-size: 12px;
        color: #737880;
        text-align: left;
        margin-bottom: 10px;
      }

      .info {
        display: flex;

        .left {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          overflow: hidden;

          .name {
            font-size: 14px;
            font-weight: bold;
            color: #4D4D4D;
            margin-right: 10px;
            white-space: nowrap;
          }

          .plotName {
            height: 24px;
            background: #F7F8FA;
            border-radius: 2px;
            padding: 0 4px;
            display: flex;
            align-items: center;
            color: #808080;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .right {
          flex: 0 0 80px;

          .more {
            color: #3388FF;
            font-size: 13px;
            text-decoration: underline;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              color: #f00;
            }
          }
        }
      }
    }

    .item:nth-last-child(1) {
      margin-bottom: 0px;
    }
  }

  .page-wrapper {
    height: 42px;
  }
}
.nodata_css{
  font-size: 16px;
}
.nodata_css img{
  width: 50px;
  height: 44px;
  margin-top: 40px;
}
.nodata_css div{  
  color: #7D92B3;
  margin-top: 10px;
}
</style>


