<template>
  <Modal
    title="日志详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :closable="false"
    width="90%"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Table border stripe max-height='600' :loading="tabLoading" :columns="tabCol" :data="tabData"></Table>
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
  </Modal>
</template>
<script>
import { preventionHost } from "@/api/hostManage";
import { getAllText } from "@/api/common";
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    },
    hostId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      operationType:{},
      list: [],
      tabLoading:false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
    }
  },
  watch: {
    isShow: function() {
      this.getDetail();
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
          title: "APP用户",
          key: "fbUserId",
          width: 150
        },
        {
          title: "后台操作用户",
          key: "fbUserName",
          width: 150
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 150
        },
        {
          title: "主机名称",
          key: "machineId",
          width: 150
        },
        {
          title: "操作类型",
          key: "operateType",
          width: 150
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 250
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
            fbUserId, // App用户
            fbUserName,  //  后台用户
            createTime,  //创建时间
            machineId,// 主机名称
            operateType  , // 操作类型
            remark, // 备注
        } = this.list[i];
        tabData.push({
          fbUserId: fbUserId ? fbUserId:'无',
          fbUserName: fbUserName?fbUserName:'无',
          createTime: createTime? this.$options.filters.formatTime(createTime):'无',
          machineId: machineId ? machineId:'无',
          operateType: this.$options.filters.statusName(operateType, 'MachineOperateType'),
          remark: remark ? remark:'无'
        });
      }
      return tabData;
    }
    
  },
  methods: {
    getDetail() {
      getAllText().then((data)=>{
        this.operationType = data.data.MachineOperateType ? data.data.MachineOperateType:{};
      })
      // 获取日志详情
      let { size, current } = this.page;
      let data = {
        input: {
          machineId: this.hostId,
        },
        pageSize: size,
        page: current
      };
      preventionHost(data).then(
        ({total, data, errorCode}) => {
        this.tabLoading = false
        if(errorCode ===0){
        this.page.total = data.total;
          if(data.list){
            this.list = data.list
            console.log(data)
          }
        }
      }).catch((err) => {
            reject(err);
        });;
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
      this.getDetail();
    },
    /**
     * @method pageSizeChange 当每页显示的数量改变时
     * @param {Number} event 当前选择每页显示的数量
     */
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getDetail();
    },
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


