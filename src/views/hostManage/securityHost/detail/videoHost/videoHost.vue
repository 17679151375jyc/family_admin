<template>
  <div>
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="handle-title">
        <i class="iconfont iconshexiangtou"></i>
        <span>视频主机</span>
      </div>
      <div class="handle-wrapper">
        <Button v-show="$options.filters.auth(['hostM.security.detail.video.add'])" icon="md-add" type="info" @click="showAdd">添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 表格-start -->
    <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table>
    <!-- 表格-end -->

    <!-- 分页-start -->
    <!-- <Page 
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
    />-->
    <!-- 分页-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow" :macNumber="macNumber" :phone="phone"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit
      @handleClose="editClose"
      :isShow="edit.isShow"
      :cameraNumber="edit.cameraNumber"
      :machineNumber="edit.machineNumber"
    ></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import { getVideoHostByMacNum, delVideoHost } from "@/api/hostManage";
export default {
  components: {
    add,
    edit
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      default: null
    },
    macNumber: {
      // 根据防盗主机number查出相关视频主机
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      searchForm: {
        phone: null,
        deviceNumber: null
      },
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        cameraNumber: null,
        machineNumber: null
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
          title: "视频序列号",
          key: "deviceNumber",
          width: 140
        },
        {
          title: "视频主机名字",
          key: "name",
          width: 150
        },
        {
          title: "拍摄防区",
          key: "defenceName",
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
            if (this.$options.filters.auth(['hostM.security.detail.video.edit'])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
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

            if (this.$options.filters.auth(['hostM.security.detail.video.del'])) {
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

            // }
            return h("div", btnGroup);
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      let map = {};
      for (let i = 0; i < this.list.length; i++) {
        let {
          machineNumber,
          deviceNumber,
          name,
          userName,
          defenceAreaList,
          phone,
          machineName
        } = this.list[i];
        let defenceAreaArr = [];
        for (let i = 0; i < defenceAreaList.length; i++) {
          defenceAreaArr.push(defenceAreaList[i].defenceName);
        }
        tabData.push({
          machineName,
          machineNumber,
          deviceNumber,
          name,
          userName,
          defenceName: defenceAreaArr.join("、"),
          phone
        });
      }
      return tabData;
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.getList();
      }
    }
  },
  methods: {
    /**
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let data = {
        machineNumber: this.macNumber
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getVideoHostByMacNum(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            this.list = data;
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
      delVideoHost({
        cameraNumber: this.list[index].cameraNumber
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
    },
    /**
     * @method resetSearch 重置搜索条件
     */
    resetSearch() {
      this.$refs["search-form"].resetFields();
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
      let { cameraNumber, machineNumber } = this.list[index];
      this.edit.cameraNumber = cameraNumber;
      this.edit.machineNumber = machineNumber;
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
     * 当主窗口关闭
     */
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
.handle-title {
  display: flex;
  align-items: center;

  i {
    margin: 0 5px;
  }

  span {
    font-size: 16px;
  }
}
</style>


