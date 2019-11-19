<template>
  <div>
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper"></div>
      <div class="handle-wrapper">
        <Button icon="md-add" type="info" @click="showAdd">添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->
    <Table
      border
      stripe
      highlight-row
      :loading="tabIsLoading"
      :columns="tabCol"
      :data="tabData"
      :width="767"
    ></Table>
    <!-- 分页-start -->
    <Page 
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="page.sizeOpts"
      show-total
      show-elevator
      show-sizer
      placement="top"
      :current="page.current"
      class="page-wrapper"
      @on-page-size-change="pageSizeChange"
      @on-change="pageChange"
    />
    <!-- 分页-end -->

    <!-- 添加弹窗-start -->
    <add
      v-model="add.isShow"
      :domicileNumber="domicileNumber"
      :plotNumber="plotNumber"
      :doorNumber="doorNumber"
      :doorName="doorName"
      :buildingNumber="buildingNumber"
      :buildingName="buildingName"
    ></add>
    <!-- 添加弹窗-end -->
  </div>
</template>
<script>
import { getDoorCardList, updateDoorCard } from "@/api/communityManage";
import Add from "./add";
export default {
  components: {
    Add
  },
  props: {
    domicileNumber: {
      type: String,
      default: ""
    },
    plotNumber: {
      type: String,
      default: ""
    },
    buildingNumber: {
      type: String,
      default: ""
    },
    buildingName: {
      type: String,
      default: ""
    },
    doorNumber: {
      type: String,
      default: ""
    },
    doorName: {
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
      },
      add: {
        isShow: false
      }
    };
  },
  watch: {
    domicileNumber: function(val) {
      if (val) {
        this.getList();
      } else {
        this.list = [];
      }
    },
    "add.isShow": function(val) {
      if (!val) {
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
        {
          title: "卡号",
          key: "cardNumber",
          width: 120
        },
        {
          title: "是否有效",
          key: "effective",
          width: 100,
          render: (h, params) => {
            // return h("div", params.row.effective ? "有效" : "无效");
            let switchBtn = h(
              "i-switch",
              {
                props: {
                  size: "large",
                  loading: params.row.isLoading,
                  value: params.row.effective ? true : false
                },
                on: {
                  "on-change": status => {
                    this.effectiveChange(params.row.id, status, params.index);
                    //this.captainChange(status, params.index, "security");
                  }
                }
              },
              [
                h(
                  "span",
                  {
                    slot: "open"
                  },
                  "有效"
                ),
                h(
                  "span",
                  {
                    slot: "close"
                  },
                  "无效"
                )
              ]
            );
            return h("div", [switchBtn]);
          }
        },
        {
          title: "小区名称",
          key: "plotName",
          width: 120
        },
        {
          title: "楼座",
          key: "buildingName",
          width: 80
        },
        {
          title: "门号",
          key: "doorName",
          width: 80
        },
        {
          title: "更新时间",
          key: "cardUpdateTime",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "div",
              this.$moment(params.row.cardUpdateTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          cardNumber,
          cardUpdateTime,
          domicileName,
          domicileNumber,
          effective,
          phone,
          id,
          plotName,
          plotNumber,
          buildingName,
          buildingNumber,
          doorNumber,
          doorName
        } = this.list[i];
        tabData.push({
          cardNumber,
          cardUpdateTime,
          domicileName,
          domicileNumber,
          effective,
          phone,
          id,
          plotName,
          plotNumber,
          buildingName,
          buildingNumber,
          doorNumber,
          doorName
        });
      }
      return tabData;
    }
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
        input: {
          plotNumber: this.plotNumber,
          buildingNumber: this.buildingNumber,
          doorNumber: this.doorNumber,
          domicileNumber: this.domicileNumber
        }
      };
      getDoorCardList(data).then(({ data, errorCode }) => {
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
    },
    /**
     * 显示添加弹窗
     */
    showAdd() {
      this.add.isShow = true;
    },
    /**
     * 改变卡片是否有效
     */
    effectiveChange(id, effective, index) {
      this.list[index].isLoading = true;
      updateDoorCard({
        id,
        effective: effective ? 1 : 0
      }).then(({ data, errorCode }) => {
        this.list[index].isLoading = false;
        if (errorCode === 0) {
          this.$Message.success("修改成功");
          this.getList();
        } else {
          this.getList();
        }
      });
    }
  }
};
</script>