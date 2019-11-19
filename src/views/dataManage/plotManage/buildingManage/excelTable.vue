<template>
  <Modal
    title="表格门号数据"
    v-model.trim="visible"
    :mask-closable="false"
    width="800"
  >
    <Table border stripe highlight-row :columns="tabCol" :data="tabData"></Table>
    <div slot="footer">
      <Button type="text" @click="visible = false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addDoorByExcel } from "@/api/dataManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    tabCol: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tabData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    buildingNumber: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      subIsLoading: false,
      visible: false
    };
  },
  watch: {
    value: function(val) {
      this.visible = val;
    },
    visible: function(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    submit() {
      this.subIsLoading = true;
      let doors = []
      let index = 1
      for (let i = 0; i<this.tabData.length; i++) {
        let keys = Object.keys(this.tabData[i])

        for (let j = 0; j < keys.length; j++) {
            // console.log('1',this.tabData[i][keys[j]])
            doors.push({
                doorIndex: index,
                doorName: this.tabData[i][keys[j]]
            })
            index = index+1
        }
      }
      addDoorByExcel({
          buildingNumber: this.buildingNumber,
          doors: doors
      }).then(({ data, errorCode }) => {
        this.subIsLoading = false;
        if (errorCode === 0) {
          this.$Message.success("添加成功");
          this.visible = false
        }
      });
    }
  }
};
</script>