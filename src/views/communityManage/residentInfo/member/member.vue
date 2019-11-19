<template>
  <div>
    <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="list"></Table>
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
  </div>
</template>
<script>
import { getResidentList } from "@/api/communityManage";
export default {
  props: {
    doorNumber: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
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
    doorNumber: function(val) {
      if (val) {
        this.getList();
      } else {
        this.list = [];
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
        {
          title: "姓名",
          key: "realName",
          width: 100
        },
        {
          title: "是否业主",
          key: "isOwner",
          width: 100,
          render: (h, { row: { isOwner } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-primary": isOwner,
                  "cell-error": !isOwner
                }
              },
              isOwner ? "是" : "否"
            );
          }
        },
        {
          title: "性别",
          key: "sex",
          width: 100,
          render: (h, params) => {
            return h("div", params.row.sex ? "男" : "女");
          }
        },
        {
          title: "电话",
          key: "phone",
          minWidth: 120
        }
      ];
    },
  },
  mounted() {},
  methods: {
    /**
     * 获取成员列表
     */
    getList() {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        pageSize: size,
        page: current,
        doorNumber: this.doorNumber
      };
      getResidentList(data).then(({ data, errorCode }) => {
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
    }
  }
};
</script>