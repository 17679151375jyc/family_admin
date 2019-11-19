<template>
  <div>
    <Table border stripe highlight-row :columns="tabCol" :data="list" :loading="isLoading"></Table>
  </div>
</template>
<script>
import { getFalimyInfo } from "@/api/userManage";
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
    tabCol: function() {
      return [
        {
          title: "家人姓名",
          key: "contactName",
          width: 150
        },
        {
          title: "联系方式",
          key: "contactPhone",
          minWidth: 150
        }
      ];
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.isLoading = true;
      getFalimyInfo({
        userNumber: this.userNumber
      }).then(({ data, errorCode }) => {
        this.isLoading = false;
        if (errorCode === 0) {
          if (data) {
            this.list = data;
            console.log(this.list);
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