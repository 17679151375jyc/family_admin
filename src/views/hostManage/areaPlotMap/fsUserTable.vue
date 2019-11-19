<template>
  <div>
    <Table border stripe highlight-row :columns="tabCol" :data="tabData" :loading="tabIsLoading"></Table>
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
  </div>
</template>
<script>
import { getServerUserList } from "@/api/userManage";
export default {
  props: {
    roleType: {
      type: Number,
      default: null
    },
    plotNumber: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      FsUserRoleType: this.$options.filters.statusList("FsUserRoleType"),
      tabIsLoading: false,
      list: [],
      page: {
        // 分页相关参数
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  watch: {
    plotNumber(val) {
      if (val) {
        this.getList();
      }
    }
  },
  computed: {
    tabCol: function() {
      return [
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
          title: "人脸图片",
          key: "picFace",
          width: 88,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  "flex-div": true
                }
              },
              [
                h("img", {
                  attrs: {
                    src: params.row.picFace
                  }
                })
              ]
            );
          }
        },
        {
          title: "姓名",
          key: "realName",
          width: 120
        },
        {
          title: "手机号",
          key: "phone",
          width: 120
        },
        {
          title: "紧急联系电话",
          key: "telephone",
          width: 120
        },
        {
          title: "性别",
          key: "gender",
          width: 100,
          render: (h, params) => {
            return h("div", params.row.gender ? "男" : "女");
          }
        },
        // {
        //   title: "角色",
        //   key: "security",
        //   width: 100,
        //   render: (h, params) => {
        //     return h("div", params.row.security ? "安保" : "");
        //   }
        // },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "div",
              this.$moment(params.row.createTime * 1000).format(
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
        tabData.push(this.list[i]);
      }
      return tabData;
    }
  },
  methods: {
    getList() {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        status: 2, // 审核通过
        plotNumber: this.plotNumber,
        pageSize: size,
        page: current
      };
      let roleTypeObj = {};
      if (this.roleType === 0) {
        // 角色为安保
        roleTypeObj = { security: 1 };
      } else if (this.roleType === 1) {
        //角色为维保
        roleTypeObj = { maintenance: 1 };
      } else if (this.roleType === 2) {
        // 角色为物管
        roleTypeObj = { propertyManage: 1 };
      }
      data = Object.assign(data, roleTypeObj);
      getServerUserList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            this.list = data.list;
            this.page.total = data.total;
          }
        })
        .catch(() => {
          this.tabIsLoading = false;
        });
    },
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getList();
    },
    pageChange(event) {
      this.page.current = event;
      this.getList();
    }
  }
};
</script>