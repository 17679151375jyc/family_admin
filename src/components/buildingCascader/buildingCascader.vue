<template>
  <Cascader
    v-if="isShow"
    :data="list"
    :load-data="loadData"
    :clearable="clearable"
    :disabled="disabled"
    @on-change="onChange"
    style="width: 300px;"
    ref="cascader"
    v-model.trim="selValueArr"
    placeholder="选择对应的楼座门号"
  ></Cascader>
</template>

<script>
import { getBuildingList, getDoorList } from "@/api/common";
import {
    getResidentList
} from "@/api/communityManage"
import { mapState } from "vuex";
export default {
  name: "buildingCascader",
  props: {
    valueArr: {
      // 选中的内容
      type: Array,
      default: function() {
        return [];
      }
    },
    clearable: {
      //是否显示清空按钮
      type: Boolean,
      default: true
    },
    showAllText: {
      // 显示全部字体
      type: Boolean,
      default: false
    },
    showAllTextLevel: {
      // 1表示省和之后都有，2表示市和之后都有，3表示区和之后都有
      type: Number,
      default: 1
    },
    showLevel: {
      // 显示层级，如果是1显示省,2显示到市,3显示到区,4就显示到街道,5显示小区,6显示楼座,7显示门号
      type: Number,
      default: 2
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: true,
      list: [],
      selValueArr: []
    };
  },
  watch: {
    valueArr: {
      handler: function() {
        this.selValueArr = this.valueArr;
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      plotNumber: state => state.user.curPlotNumber
    })
  },
  created() {
    console.log("创建完成");

    this.getBuildingList();
  },
  mounted() {},
  methods: {
    resetData() {
      console.log("触发子组件事件完成");
      this.$refs["cascader"].clearSelect();
    },
    getProvinceList() {
      console.log("执行请求");
      getProvinceList({}).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (this.showAllText && this.showAllTextLevel <= 1) {
            this.list.push({
              value: null,
              label: "全部"
            });
          }
          for (let i = 0; i < data.list.length; i++) {
            let { code, name } = data.list[i];
            if (this.showLevel > 1) {
              // 如果显示的层级大于1，表示要显示市，所以要列出所有市
              this.list.push({
                value: code,
                label: name,
                children: [],
                level: 1,
                loading: false
              });
            } else if (this.showLevel === 1) {
              // 只显示到省级
              this.list.push({
                value: code,
                label: name,
                level: 1
              });
            }
          }
          console.log(this.list);
        }
      });
    },
    /**
     * 查询所有楼座
     */
    getBuildingList() {
      getBuildingList({
        plotNumber: this.plotNumber
      })
        .then(({ data, errorCode }) => {
          if (errorCode === 0) {
            if (data.list.length === 0) {
              this.$Message.warning("无对应楼座数据");
            } else {
              if (this.showAllText && this.showAllTextLevel <= 1) {
                this.list.push({
                  value: null,
                  label: "全部"
                });
              }
            }

            for (let i = 0; i < data.list.length; i++) {
              let { buildingNumber, name } = data.list[i];
              if (this.showLevel > 1) {
                this.list.push({
                  value: buildingNumber,
                  label: name,
                  level: 1,
                  children: [],
                  loading: false
                });
              } else if (this.showLevel === 1) {
                this.list.push({
                  value: buildingNumber,
                  label: name,
                  level: 1
                });
              }
            }
          } else {
          }
        })
        .catch(() => {});
    },
    /**
     * 查询所有门号
     */
    async getDoorList(buildingNumber) {
      return new Promise((resolve, reject) => {
        getDoorList({
          buildingNumber
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              let list = [];
              if (data.list.length === 0) {
                this.$Message.warning("无对应门号数据");
              } else {
                if (this.showAllText && this.showAllTextLevel <= 2) {
                  list.push({
                    value: null,
                    label: "全部"
                  });
                }
              }

              for (let i = 0; i < data.list.length; i++) {
                let { doorNumber, doorName } = data.list[i];
                if (this.showLevel > 2) {
                  list.push({
                    value: doorNumber,
                    label: doorName,
                    level: 2,
                    children: [],
                    loading: false
                  });
                } else if (this.showLevel === 2) {
                  list.push({
                    value: doorNumber,
                    label: doorName,
                    level: 2
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
    /**
     * 查询所有用户
     */
    async getResidentList(doorNumber) {
      return new Promise((resolve, reject) => {
        getResidentList({
          doorNumber
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              let list = [];
              if (data.list.length === 0) {
                this.$Message.warning("无对用户数据");
              } else {
                if (this.showAllText && this.showAllTextLevel <= 3) {
                  list.push({
                    value: null,
                    label: "全部"
                  });
                }
              }

              for (let i = 0; i < data.list.length; i++) {
                let { realName, domicileNumber } = data.list[i];
                if (this.showLevel > 3) {
                  list.push({
                    value: domicileNumber,
                    label: realName,
                    level: 3,
                    children: [],
                    loading: false
                  });
                } else if (this.showLevel === 3) {
                  list.push({
                    value: domicileNumber,
                    label: realName,
                    level: 3
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

    async loadData(item, callback) {
      console.log(item);
      item.loading = true;
      let { level } = item;
      if (level === 1) {
        item.children = await this.getDoorList(item.value);
        callback();
        item.loading = false;
      } else if (level === 2) {
        item.children = await this.getResidentList(item.value);
        callback();
        item.loading = false;
      }
    },
    onChange(value, selectedData) {
      console.log(value, selectedData);
      this.$emit("onChange", value, selectedData);
    }
  }
};
</script>

