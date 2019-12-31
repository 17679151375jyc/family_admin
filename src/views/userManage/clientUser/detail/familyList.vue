<template>
  <div>
    <Table border stripe highlight-row :columns="tabCol" :data="list" :loading="isLoading"></Table>
  </div>
</template>
<script>
import { getFalimyInfo, getFamilyInfo } from "@/api/userManage";
import { truncate } from "fs";
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
          type: "index",
          title: "序号",
          width: 64,
          align: "center"
        },
        {
            title: '来源',
            key: 'type',
            width: 100
        },
        {
          title: "姓名",
          key: "name",
          width: 100
        },
        {
          title: "电话",
          key: "phone",
          width: 150
        },
        {
          title: "关系",
          key: "relation",
          width: 100
        },
        {
          title: "小区名称",
          key: "plotName",
          width: 100
        },
        {
          title: "楼座门号",
          minWidth: 150,
          render: (h, { row: { buildingName, doorName } }) => {
            return h("div", buildingName + doorName);
          }
        }
      ];
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      //   this.isLoading = true;
      //   getFalimyInfo({
      //     userNumber: this.userNumber
      //   }).then(({ data, errorCode }) => {
      //     this.isLoading = false;
      //     if (errorCode === 0) {
      //       if (data) {
      //         this.list = data;
      //         console.log(this.list);
      //       } else {
      //         this.list = [];
      //         this.page.total = 0;
      //       }
      //     }
      //   });
      this.isLoading = true;
      getFamilyInfo({
        userNumber: this.userNumber
      }).then(({ data, errorCode }) => {
        this.isLoading = false;
        if (errorCode === 0) {
          let list = [];
          for (let i = 0; i < data[0].length; i++) {
            // 人脸数据
            let {
              contactName,
              contactPhone,
              contactRelation,
              plotName,
              buildingName,
              doorName
            } = data[0][i];
            list.push({
              name: contactName,
              phone: contactPhone,
              relation: contactRelation,
              plotName,
              buildingName,
              doorName,
              type: '人脸数据'
            });
          }
          for (let i = 0; i < data[1].length; i++) {
            // 社区信息
            let {
              realName,
              domicilePhone,
              contactRelation,
              plotName,
              buildingName,
              doorName
            } = data[1][i];
            list.push({
              name: realName,
              phone: domicilePhone,
              relation: contactRelation,
              plotName,
              buildingName,
              doorName,
              type: '申请社区'
            });
          }
          this.list = list;
        }
      });
    }
  }
};
</script>