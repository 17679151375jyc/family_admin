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
    placeholder="请选择省市区街道"
  ></Cascader>
</template>

<script>
import {
  getProvinceList,
  getCityList,
  getAreaList,
  getStreetList,
  getPlotList,
  getBuildingList,
  getDoorList
} from "@/api/common";
import { getResidentList } from "@/api/communityManage";
export default {
  name: "addressCascader",
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
      default: 4
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allText: {
      type: String,
      default: "全部"
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
      handler: function(val, oldVal) {
        console.log("执行地址选择组件赋值", val, oldVal);
        this.selValueArr = [];
        for (let i = 0; i < this.valueArr.length; i++) {
          this.selValueArr.push(this.valueArr[i]);
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    console.log("创建完成");

    this.getProvinceList();
  },
  mounted() {},
  methods: {
    resetData() {
      console.log("触发子组件事件完成");
      this.$refs["cascader"].clearSelect();

      //   this.list = [];
      //   setTimeout(() => {
      //     this.getProvinceList();
      //   }, 100);

      //
      //   this.getProvinceList()
    },
    getProvinceList() {
      console.log("执行请求");
      getProvinceList({}).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (this.showAllText && this.showAllTextLevel <= 1) {
            this.list.push({
              value: null,
              label: this.allText
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
    async getCityList(provinceCode) {
      return new Promise((resolve, reject) => {
        getCityList({
          provinceCode: provinceCode
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              let list = [];
              if (this.showAllText && this.showAllTextLevel <= 2) {
                list.push({
                  value: null,
                  label: this.allText
                });
              }
              console.log("打印list", list);
              for (let i = 0; i < data.list.length; i++) {
                let { code, name } = data.list[i];
                if (this.showLevel > 2) {
                  // 如果显示的层级大于2，表示要显示区，所以要列出所有区
                  list.push({
                    value: code,
                    label: name,
                    children: [],
                    level: 2,
                    loading: false
                  });
                } else if (this.showLevel === 2) {
                  // 只显示到市
                  list.push({
                    value: code,
                    label: name,
                    level: 2
                  });
                }
                // list.push({
                //   value: code,
                //   label: name,
                //   children: [],
                //   level: level - 1,
                //   loading: false
                // });
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
    async getAreaList(cityCode) {
      return new Promise((resolve, reject) => {
        getAreaList({
          cityCode: cityCode
        })
          .then(({ data, errorCode }) => {
            console.log(data, errorCode);
            if (errorCode === 0) {
              let list = [];
              if (this.showAllText && this.showAllTextLevel <= 3) {
                list.push({
                  value: null,
                  label: this.allText
                });
              }
              for (let i = 0; i < data.list.length; i++) {
                let { code, name } = data.list[i];
                if (this.showLevel > 3) {
                  // 如果显示的层级大于3，表示要显示街道，所以要列出所有街道
                  list.push({
                    value: code,
                    label: name,
                    children: [],
                    level: 3,
                    loading: false
                  });
                } else if (this.showLevel === 3) {
                  // 只显示到区
                  list.push({
                    value: code,
                    label: name,
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
    /**
     * 查询街道列表
     */
    async getStreetList(areaCode) {
      return new Promise((resolve, reject) => {
        getStreetList({
          areaCode: areaCode
        })
          .then(({ data, errorCode }) => {
            console.log(data, errorCode);
            if (errorCode === 0) {
              let list = [];
              if (this.showAllText && this.showAllTextLevel <= 4) {
                list.push({
                  value: null,
                  label: this.allText
                });
              }
              for (let i = 0; i < data.list.length; i++) {
                let { code, name } = data.list[i];
                if (this.showLevel > 4) {
                  list.push({
                    value: code,
                    label: name,
                    level: 4,
                    children: [],
                    loading: false
                  });
                } else if (this.showLevel === 4) {
                  list.push({
                    value: code,
                    label: name,
                    level: 4
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
     * 查询所有小区
     */
    async getPlotList(streetCode) {
      return new Promise((resolve, reject) => {
        getPlotList({
          streetCode: streetCode
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              let list = [];
              if (data.list.length === 0) {
                this.$Message.warning("无对应小区数据");
              } else {
                if (this.showAllText && this.showAllTextLevel <= 5) {
                  list.push({
                    value: null,
                    label: this.allText
                  });
                }
              }

              for (let i = 0; i < data.list.length; i++) {
                let { plotNumber, plotName } = data.list[i];
                if (this.showLevel > 5) {
                  list.push({
                    value: plotNumber,
                    label: plotName,
                    level: 5,
                    children: [],
                    loading: false
                  });
                } else if (this.showLevel === 5) {
                  list.push({
                    value: plotNumber,
                    label: plotName,
                    level: 5
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
     * 查询所有楼座
     */
    async getBuildingList(plotNumber) {
      return new Promise((resolve, reject) => {
        getBuildingList({
          plotNumber
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              let list = [];
              if (data.list.length === 0) {
                this.$Message.warning("无对应楼座数据");
              } else {
                if (this.showAllText && this.showAllTextLevel <= 6) {
                  list.push({
                    value: null,
                    label: this.allText
                  });
                }
              }

              for (let i = 0; i < data.list.length; i++) {
                let { buildingNumber, name } = data.list[i];
                if (this.showLevel > 6) {
                  list.push({
                    value: buildingNumber,
                    label: name,
                    level: 6,
                    children: [],
                    loading: false
                  });
                } else if (this.showLevel === 6) {
                  list.push({
                    value: buildingNumber,
                    label: name,
                    level: 6
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
                if (this.showAllText && this.showAllTextLevel <= 7) {
                  list.push({
                    value: null,
                    label: this.allText
                  });
                }
              }

              for (let i = 0; i < data.list.length; i++) {
                let { doorNumber, doorName } = data.list[i];
                if (this.showLevel > 7) {
                  list.push({
                    value: doorNumber,
                    label: doorName,
                    level: 7,
                    children: [],
                    loading: false
                  });
                } else if (this.showLevel === 7) {
                  list.push({
                    value: doorNumber,
                    label: doorName,
                    level: 7
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
          status: 1, //正常状态用户
          doorNumber
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              let list = [];
              if (data.list.length === 0) {
                this.$Message.warning("无对用户数据");
              } else {
                if (this.showAllText && this.showAllTextLevel <= 8) {
                  list.push({
                    value: null,
                    label: this.allText
                  });
                }
              }

              for (let i = 0; i < data.list.length; i++) {
                let { realName, domicileNumber } = data.list[i];
                if (this.showLevel > 8) {
                  list.push({
                    value: domicileNumber,
                    label: realName,
                    level: 8,
                    children: [],
                    loading: false
                  });
                } else if (this.showLevel === 8) {
                  list.push({
                    value: domicileNumber,
                    label: realName,
                    level: 8
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
      item.loading = true;
      let { level } = item;
      if (level === 1) {
        item.children = await this.getCityList(item.value);
        callback();
        item.loading = false;
      } else if (level === 2) {
        item.children = await this.getAreaList(item.value);
        callback();
        item.loading = false;
      } else if (level === 3) {
        item.children = await this.getStreetList(item.value);
        callback();
        item.loading = false;
      } else if (level === 4) {
        item.children = await this.getPlotList(item.value);
        callback();
        item.loading = false;
      } else if (level === 5) {
        item.children = await this.getBuildingList(item.value);
        callback();
        item.loading = false;
      } else if (level === 6) {
        item.children = await this.getDoorList(item.value);
        callback();
        item.loading = false;
      } else if (level === 7) {
        item.children = await this.getResidentList(item.value);
        callback();
        item.loading = false;
      }
    },
    onChange(value, selectedData) {
      this.$emit("onChange", value, selectedData);
    }
  }
};
</script>

