<!--摘要列表-->
<template>
  <div class="list-wrapper">
    <!-- 表格-start -->
    <!-- <Table style="width:100%;" border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table> -->
    <!-- 表格-end -->
    <div class="list-items" style="position: relative;">
      <Spin size="large" style="position: absolute;left: 48%;top: 150px" v-if="tabIsLoading"></Spin>
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="time">{{item.triggeringTime | formatTime}}</div>
        <div class="info">
          <div :class="['role']" v-if="item.roleType!=null">
            <span>{{item.roleType |statusName("RelationType")}}</span>
          </div>
          <div class="name">{{item.roleName || '暂无'}}</div>
          <div
            class="address"
          >{{`${item.buildingName||''}${item.positionName ? ' - '+item.positionName : ''} `}}</div>
        </div>
      </div>
      <div v-if="list.length===0" class="nodata_css">
        <img src="@/assets/images/community/nodata_img.png" />
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
    <detail
      @handleClose="detailClose"
      :feedbackNumber="detail.feedbackNumber"
      :isShow="detail.isShow"
    ></detail>
    <!-- 详情-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import edit from "./edit";
import detail from "./detail";
import { getRecordList } from "@/api/communityManage";
import { getPlotList } from "@/api/common";
import { mapState } from "vuex";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    edit,
    detail,
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
      roleTypeList: this.$config.community.entranceGuard.faceType,
      typeList: this.$config.community.feedback.type,
      list: [],
      searchForm: {
        userPhone: null, // 电话
        feedbackType: null, //类型
        auditStatus: null //状态
      },
      add: {
        isShow: false
      },
      detail: {
        feedbackNumber: null,
        isShow: false
      },
      edit: {
        isShow: false,
        id: null
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: 10,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  computed: {},
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
      getRecordList(data)
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
      this.searchForm.daterange = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
      this.searchForm.userPhone = null;
      this.searchForm.feedbackType = null;
      this.searchForm.auditStatus = null;
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
      let { feedbackNumber } = this.list[index];
      this.detail.feedbackNumber = feedbackNumber;
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
     * 刷新页面
     */
    refresh() {
      this.page.current = 1;
      this.getList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.list-wrapper {
  display: flex;
  width: 100%;
  flex-flow: column;
  height: 100%;

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
        color: #A1A8B3;
        font-size: 12px;
        text-align: left;
        margin-bottom: 5px;
      }

      .info {
        display: flex;
        align-items: center;

        .role {
          height: 20px;
          padding: 0 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;

          span {
            font-size: 12px;
            font-weight: bold;
          }
        }

        .name {
          margin: 0 15px 0 5px;
          font-size: 12px;
          color: #3388FF;
        }

        .address {
          font-size: 12px;
          color: #26364D;
        }
      }
    }

    .item:nth-last-child(1) {
      margin-bottom: 0px;
    }
  }

  .page-wrapper {
    height: 42px;
    // >>>.ivu-page-item{
    // min-width:24px;
    // margin-right: 2px;
    // }
    // >>>.ivu-page-item-jump-next{
    // min-width:20px;
    // margin-right:2px
    // }
    // >>>.ivu-page-next, >>>.ivu-page-prev{
    // min-width: 24px;
    // }
  }
}

.nodata_css {
  font-size: 16px;
}

.nodata_css img {
  width: 50px;
  height: 44px;
  margin-top: 40px;
}

.nodata_css div {
  color: #7D92B3;
  margin-top: 10px;
}
</style>


