<template>
  <Table border stripe highlight-row :loading="isLoading" :columns="tabCol" :data="list"></Table>
</template>
<script>
import { getShareInfo } from "@/api/userManage";
export default {
  props: {
    userNumber: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      list: []
    };
  },
  computed: {
    tabCol() {
      return [
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center"
        },
        {
          title: "姓名",
          key: "shareUserName",
          width: 120
        },
        {
          title: "电话",
          key: "shareUserPhone",
          width: 120
        },
        {
          title: "分享时间",
          key: "createTime",
          minWidth: 150,
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
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    /**
     * 获取分享人信息
     */
    getList() {
      getShareInfo({
        userNumber: this.userNumber
      }).then(({ data, errorCode }) => {
        this.tabIsLoading = false;
        if (errorCode === 0) {
          if (data) {
            this.list = data;
          } else {
            this.list = [];
            this.page.total = 0;
          }
        }
      });
    }
  }
};
</script>