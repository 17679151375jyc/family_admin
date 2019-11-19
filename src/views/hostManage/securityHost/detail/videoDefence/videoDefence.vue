<template>
  <div>
    <!-- 表格-start -->
    <Table border stripe highlight-row :columns="tabCol" :data="tabData"></Table>
    <!-- 表格-end -->
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    tabCol: function() {
      return [
        {
          type: "index",
          title: "序号",
          width: 60
        },
        {
          title: "主机名称",
          key: "machineName"
        },
        {
          title: "防区名称",
          key: "defenceName"
        }
      ];
    },
    tabData: function() {
      let data = [];
      for (let i = 0; i < this.list.length; i++) {
        let { defenceName, machineName } = this.list[i];
        data.push({ defenceName, machineName });
      }
      return data;
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
