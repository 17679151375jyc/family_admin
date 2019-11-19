<template>
  <Cascader
    v-if="isShow"
    :data="list"
    :load-data="loadData"
    :clearable="clearable"
    @on-change="onChange"
    v-model.trim="selValueArr"
    style="width: 300px;"
    ref="cascader"
  ></Cascader>
</template>

<script>
import { getPlotList, getBuildingList, getDoorList } from "@/api/common";
import { setTimeout } from "timers";
export default {
  name: "plotCascader",
  props: {
    level: {
      type: Number,
      default: 3
    },
    clearable: {
      type: Boolean,
      default: true
    },
    province: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    area: {
      type: String,
      default: null
    },
    street: {
      type: String,
      default: null
    },
    plotName: {
      type: String,
      default: null
    },
    valueArr: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      isShow: true,
      list: [],
      selValueArr: []
    };
  },
  created() {
    console.log("创建完成");
    this.getPlotList();
  },
  mounted() {
      this.selValueArr = this.valueArr;
  },
  watch: {
    valueArr: {
      handler: function() {
          console.log('valueArr数组变化了')
        this.selValueArr = this.valueArr;
      },
      deep: true
    },
    street: function(val, oldVal) {
      console.log("street变化了");
      //   this.list
      this.$refs["cascader"].clearSelect();
      this.getPlotList();
    }
  },
  methods: {
    resetData() {
      this.$refs["cascader"].clearSelect();
      console.log("触发子组件事件完成");
      //   this.list = [];
      //   setTimeout(() => {
      //     this.getProvinceList();
      //   }, 100);

      //
      //   this.getProvinceList()
    },
    getPlotList() {
      console.log("执行请求");
      this.list = [];
      getPlotList({
        streetCode: this.street
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (data.list.length > 0) {
            for (let i = 0; i < data.list.length; i++) {
              let { plotName, plotNumber } = data.list[i];
              if (this.level === 1) {
                this.list.push({
                  value: plotNumber,
                  label: plotName,
                  level: 1
                  //   loading: false
                });
              } else {
                this.list.push({
                  value: plotNumber,
                  label: plotName,
                  children: [],
                  level: 1,
                  loading: false
                });
              }
            }
          }
        }
      });
    },
    async getBuildingList(plotNumber) {
      return new Promise((resolve, reject) => {
        getBuildingList({
          plotNumber: plotNumber
        })
          .then(({ data, errorCode }) => {
            console.log(data, errorCode);
            if (errorCode === 0) {
              let list = [];
              for (let i = 0; i < data.list.length; i++) {
                let { name, buildingNumber } = data.list[i];
                if (this.level === 2) {
                  list.push({
                    value: buildingNumber,
                    label: name,
                    level: 2
                  });
                } else {
                  list.push({
                    value: buildingNumber,
                    label: name,
                    children: [],
                    level: 2,
                    loading: false
                  });
                }
              }
              resolve(list);
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    async getDoorList(buildingNumber) {
      return new Promise((resolve, reject) => {
        getDoorList({
          buildingNumber: buildingNumber
        })
          .then(({ data, errorCode }) => {
            console.log(data, errorCode);
            if (errorCode === 0) {
              let list = [];
              for (let i = 0; i < data.list.length; i++) {
                let { doorName, doorNumber } = data.list[i];
                list.push({
                  value: doorNumber,
                  label: doorName,
                  level: 3
                });
              }
              resolve(list);
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    async loadData(item, callback) {
      console.log(item);
      item.loading = true;
      let { level } = item;
      if (level === 1) {
        item.children = await this.getBuildingList(item.value);
        callback();
        item.loading = false;
      } else if (level === 2) {
        item.children = await this.getDoorList(item.value);
        callback();
        item.loading = false;
      }
    },
    onChange(value, selectedData) {
      console.log(value, selectedData);
      this.$emit("onChange", value);
    }
  }
};
</script>

