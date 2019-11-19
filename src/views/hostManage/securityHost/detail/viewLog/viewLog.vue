<template>
  <div>
    <Table border stripe :loading="tabLoading" :columns="tabCol" :data="list"></Table>
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
      style="text-align: center;"
    />
  </div>
</template>
<script>
import { preventionHost } from "@/api/hostManage";
export default {
  props: {
    hostId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: [],
      tabLoading: false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  watch: {
    hostId() {
      this.getList();
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
          title: "用户",
          key: "comUserName",
          width: 120
        },
        {
          title: "操作人",
          key: "fbUserName",
          width: 120
        },

        {
          title: "主机名称",
          key: "machineId",
          width: 150
        },
        {
          title: "操作类型",
          key: "operateType",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.operateType,
                "MachineOperateType"
              )
            );
          }
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
          title: "备注",
          key: "remark",
          fixed: "right",
          minWidth: 250
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          fbUserId, // App用户
          fbUserName, //  后台用户
          createTime, //创建时间
          machineId, // 主机名称
          operateType, // 操作类型
          remark // 备注
        } = this.list[i];
        tabData.push({
          fbUserId: fbUserId ? fbUserId : "无",
          fbUserName: fbUserName ? fbUserName : "无",
          createTime: createTime
            ? this.$options.filters.formatTime(createTime)
            : "无",
          machineId: machineId ? machineId : "无",
          operateType: this.$options.filters.statusName(
            operateType,
            "MachineOperateType"
          ),
          remark: remark ? remark : "无"
        });
      }
      return tabData;
    }
  },
  methods: {
    getList() {
      this.tabLoading = true;
      // 获取日志详情
      let { size, current } = this.page;
      let data = {
        input: {
          machineId: this.hostId
        },
        pageSize: size,
        page: current
      };
      preventionHost(data)
        .then(({ total, data, errorCode }) => {
          this.tabLoading = false;
          if (errorCode === 0) {
            this.page.total = data.total;
            if (data.list) {
              this.list = data.list;
            }
          }
        })
        .catch(err => {
          this.tabLoading = false;
          reject(err);
        });
    },
    handleClose() {
      this.$emit("handleClose");
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
     * @method pageSizeChange 当每页显示的数量改变时
     * @param {Number} event 当前选择每页显示的数量
     */
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getList();
    }
  }
};
</script>
<style lang="stylus" scoped>
>>>.amap-icon img {
  width: 25px;
  height: 34px;
}

>>>.amap-marker-label {
  border: 0;
  background-color: transparent;
}

>>>.info {
  position: relative;
  top: 10px;
  right: -55px;
  min-width: 0;
  background: #fff;
  padding: 4px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}
</style>


