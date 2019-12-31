<template>
  <div>
    <Modal
      title="小区管理"
      v-model.trim="isShow"
      :mask-closable="false"
      :loading="loading"
      :closable="false"
      :footer-hide="true"
    >
      <!-- 右上角关闭按钮-start -->
      <a class="ivu-modal-close" @click="handleClose">
        <i class="ivu-icon ivu-icon-ios-close"></i>
      </a>
      <!-- 右上角关闭按钮-start -->
      <div class="excel-handler">
        <Button type="success" icon="md-download" :loading="exportLoading" @click="exportExcel">门号模板</Button>
      </div>

      <Tree :data="buildingData" :render="renderContent"></Tree>
    </Modal>

    <!-- 添加楼座-start -->
    <add-building
      :isShow="addBuilding.isShow"
      :plotNumber="plotNumber"
      @handleClose="addBuildingClose"
    ></add-building>
    <!-- 添加楼座-end -->

    <!-- 编辑楼座-start -->
    <edit-building
      :isShow="editBuilding.isShow"
      :buildingNumber="buildingNumber"
      @handleClose="editBuildingClose"
    ></edit-building>
    <!-- 编辑楼座-end -->

    <!-- 添加门号的弹窗-start -->
    <add-door
      :isShow="addDoor.isShow"
      :plotNumber="plotNumber"
      :buildingNumber="buildingNumber"
      @handleClose="addDoorClose"
    ></add-door>
    <!-- 添加门号的弹窗-end -->
    <!-- 编辑门号的弹窗-start -->
    <edit-door :isShow="editDoor.isShow" :doorNumber="doorNumber" @handleClose="editDoorClose"></edit-door>
    <!-- 编辑门号的弹窗-end -->

    <!-- excel表格数据导入-start -->
    <excel-table
      v-model="excelTable.isShow"
      :buildingNumber="excelTable.buildingNumber"
      :tabCol="excelTable.tabCol"
      :tabData="excelTable.tabData"
    ></excel-table>
    <!-- excel表格数据导入-end -->
  </div>
</template>
<script>
import {
  getBuildingList,
  delBuilding,
  delDoor,
  addBuilding
} from "@/api/dataManage";
import AddressCascader from "@/components/addressCascader/addressCascader";
import AddBuilding from "./addBuilding";
import EditBuilding from "./editBuilding";
import AddDoor from "./addDoor";
import ExcelTable from "./excelTable";
import EditDoor from "./editDoor";
import excel from "@/libs/excel";
export default {
  components: {
    AddressCascader,
    AddBuilding,
    EditBuilding,
    AddDoor,
    EditDoor,
    ExcelTable
  },
  props: {
    plotName: {
      type: String,
      default: null
    },
    plotNumber: {
      type: String,
      default: null
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      excelTable: {
        isShow: false,
        tabCol: [],
        tabData: [],
        buildingNumber: ""
      },
      uploadLoading: false,
      exportLoading: false,
      addBuilding: {
        isShow: false
      },
      editBuilding: {
        isShow: false
      },
      addDoor: {
        isShow: false,
        buildingNumber: null
      },
      editDoor: {
        isShow: false,
        buildingNumber: null
      },
      buildingNumber: null, //  当前编辑数据的楼座number
      doorNumber: null, // 当前编辑数据的门号number
      subIsShow: false,
      form: {
        province: null,
        city: null,
        area: null,
        street: null,
        plotName: null,
        address: null,
        longitude: null, // 经度
        latitude: null //纬度
      },
      rules: {
        // 验证规则
        street: [
          {
            type: "number",
            required: true,
            message: "请选择对应省市区街道",
            trigger: "blur"
          }
        ],
        plotName: [
          {
            required: true,
            message: "请填写小区名称",
            trigger: "blur"
          },
          {
            max: 32,
            message: "长度不超过32个字符",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur"
          },
          {
            max: 32,
            message: "长度不超过32个字符",
            trigger: "blur"
          }
        ],
        longitude: [
          {
            required: true,
            message: "请填写经度",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.longitude(value)) {
                err = "请填写正确的经度";
              }
              callback(err);
            }
          }
        ],
        latitude: [
          {
            required: true,
            message: "请填写纬度",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.latitude(value)) {
                err = "请填写正确的纬度";
              }
              callback(err);
            }
          }
        ]
      },

      buttonProps: {
        type: "default",
        size: "small"
      },
      buildingList: []
    };
  },
  computed: {
    buildingData: function() {
      return [
        {
          title: this.plotName,
          expand: true,
          render: (h, { root, node, data }) => {
            let addBuilding;
            if (
              this.$options.filters.auth(["common.plogM.buildingM.addBuilding"])
            ) {
              addBuilding = h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    float: "right",
                    marginRight: "8px"
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: Object.assign({}, this.buttonProps, {
                        icon: "ios-add",
                        type: "info"
                      }),
                      style: {
                        marginRight: "2px"
                      },
                      on: {
                        click: () => {
                          this.addPlotDoor();
                        }
                      }
                    },
                    "添加小区门口"
                  ),
                  h(
                    "Button",
                    {
                      props: Object.assign({}, this.buttonProps, {
                        icon: "ios-add",
                        type: "info"
                      }),
                      style: {
                        // width: "64px"
                        marginRight: "8px"
                      },
                      on: {
                        click: () => {
                          this.showAddBuilding(data);
                        }
                      }
                    },
                    "添加楼座"
                  )
                ]
              );
            } else {
              addBuilding = h();
            }
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%"
                }
              },
              [
                h("span", [
                  h("i", {
                    class: {
                      iconfont: true,
                      iconjianzhuwu: true
                    },
                    style: {
                      marginRight: "2px",
                      marginLeft: "5px"
                    }
                  }),
                  h("span", data.title)
                ]),
                addBuilding
              ]
            );
          },
          children: this.buildingList
        }
      ];
    }
  },
  watch: {
    plotNumber: function(val, oldVal) {
      if (val) {
        this.getList();
      }
    },
    addBuildingModel: function(val, oldVal) {
      this.$refs["buildingForm"].resetFields();
    },
    addDoorModel: function(val, oldVal) {
      this.$refs["doorForm"].resetFields();
    },
    "excelTable.isShow": function(val) {
      if (!val) {
        this.getList();
      }
    }
  },
  methods: {
    getList() {
      getBuildingList({
        plotNumber: this.plotNumber
      })
        .then(({ data, errorCode }) => {
          if (errorCode === 0) {
            // for(let i=0; i<data.length; i++){
            //   data[i].children = data[i].children.reverse()
            // }
            this.buildingList = data;
            for (let i = 0; i < this.buildingList.length; i++) {
              //   this.buildingList[i].expand = true
              this.buildingList[i].level = 1;
            }
          }
        })
        .catch(() => {});
    },
    renderContent(h, { root, node, data }) {
      let importBtn = []; // 导入门号列表
      let addBtn = []; // 添加门号按钮
      let editBtn = []; // 编辑楼座按钮
      let editDoorBtn = []; // 编辑门号按钮
      let delBuildingBtn = []; // 删除楼座按钮
      let delDoorBtn = []; // 删除门号按钮
      let icon = null;
      if (data.level) {
        icon = h("i", {
          class: {
            iconfont: true,
            "iconicon-test": true
          },
          style: {
            marginRight: "2px",
            marginLeft: "5px"
          }
        });
        if (this.$options.filters.auth(["common.plogM.buildingM.addDoor"])) {
          console.log("data", data);
          importBtn = [
            h(
              "Upload",
              {
                props: {
                  "before-upload": this.handleBeforeUpload,
                  accept: ".xls, .xlsx",
                  action: ""
                },
                style: {
                  display: "inline-block",
                  marginRight: "4px"
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      icon: "ios-cloud-upload-outline",
                      loading: this.uploadLoading,
                      size: "small",
                      type: "success"
                    },
                    on: {
                      click: () => {
                        this.handleUploadFile(data.number);
                      }
                    }
                  },
                  "导入门号"
                )
              ]
            )
            // h(
            //   "Button",
            //   {
            //     props: Object.assign({}, this.buttonProps, {
            //       icon: "ios-cloud-upload-outline",
            //       type: "success"
            //     }),
            //     style: {
            //       marginRight: "4px"
            //     },
            //     on: {
            //       click: () => {
            //         this.showImport(data);
            //       }
            //     }
            //   },
            //   "导入门号"
            // )
          ];
          addBtn = [
            h(
              "Button",
              {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add",
                  type: "info"
                }),
                style: {
                  marginRight: "4px"
                },
                on: {
                  click: () => {
                    this.showAddDoor(data);
                  }
                }
              },
              "添加门号"
            )
          ];
        }
        if (
          this.$options.filters.auth(["common.plogM.buildingM.editBuilding"])
        ) {
          editBtn = [
            h(
              "Button",
              {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-create",
                  type: "primary"
                }),
                style: {
                  marginRight: "4px"
                },
                on: {
                  click: () => {
                    this.showEditBuilding(data);
                  }
                }
              },
              "编辑楼座"
            )
          ];
        }
        if (
          this.$options.filters.auth(["common.plogM.buildingM.delBuilding"])
        ) {
          delBuildingBtn = [
            h(
              "Poptip",
              {
                props: {
                  confirm: true,
                  title: "你确定要删除该楼座吗?",
                  transfer: true
                },
                style: {
                  marginRight: "4px"
                },
                on: {
                  "on-ok": () => {
                    this.delBuilding(data);
                  }
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    }
                  },
                  "删除"
                )
              ]
            )
          ];
        }
      } else {
        if (this.$options.filters.auth(["common.plogM.buildingM.editDoor"])) {
          // 如果有编辑门号权限
          editDoorBtn = [
            h(
              "Button",
              {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-create",
                  type: "primary"
                }),
                style: {
                  marginRight: "103px"
                },
                on: {
                  click: () => {
                    this.showEditDoor(data);
                  }
                }
              },
              "编辑门号"
            )
          ];
        }
        if (this.$options.filters.auth(["common.plogM.buildingM.delDoor"])) {
          delDoorBtn = [
            h(
              "Poptip",
              {
                props: {
                  confirm: true,
                  title: "你确定要删除该门号吗?",
                  transfer: true
                },
                style: {
                  marginRight: "4px"
                },
                on: {
                  "on-ok": () => {
                    this.delDoor(data);
                  }
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    }
                  },
                  "删除"
                )
              ]
            )
          ];
        }
        icon = h("i", {
          class: {
            iconfont: true,
            iconslidebar_menjin: true
          },
          style: {
            marginRight: "2px",
            marginLeft: "5px"
          }
        });
      }
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
            paddingRight: "12px"
          }
        },
        [
          h("span", [icon, h("span", data.title)]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right"
              }
            },
            importBtn
              .concat(addBtn)
              .concat(delBuildingBtn)
              .concat(delDoorBtn)

            // [
            //   ,
            // //   h("Button", {
            // //     props: Object.assign({}, this.buttonProps, {
            // //       icon: "ios-remove"
            // //     }),
            // //     on: {
            // //       click: () => {
            // //         this.remove(root, node, data);
            // //       }
            // //     }
            // //   })
            // ]
          )
        ]
      );
    },
    /**
     * 显示添加楼座
     */
    showAddBuilding() {
      this.addBuilding.isShow = true;
    },
    /**
     * 楼座弹窗关闭
     */
    addBuildingClose(isRefresh = false) {
      this.addBuilding.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * 显示编辑楼座
     */
    showEditBuilding(data) {
      this.buildingNumber = data.number;
      this.editBuilding.isShow = true;
    },
    /**
     * 编辑楼座关闭
     */
    editBuildingClose(isRefresh = false) {
      this.editBuilding.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * 显示添加门号
     */
    showAddDoor(data) {
      this.buildingNumber = data.number;
      this.addDoor.isShow = true;
    },
    /**
     * 门号弹窗关闭
     */
    addDoorClose(isRefresh = false) {
      this.addDoor.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * 显示编辑门号
     */
    showEditDoor(data) {
      console.log("showEditDoor", data);
      this.doorNumber = data.number;
      this.editDoor.isShow = true;
    },
    /**
     * 门号弹窗关闭
     */
    editDoorClose(isRefresh = false) {
      this.editDoor.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    // append(data) {
    //   this.addBuildingModel = true;
    //   const children = data.children || [];
    //   children.push({
    //     title: "appended node",
    //     expand: true
    //   });
    //   this.$set(data, "children", children);
    // },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            plotName,
            province,
            area,
            city,
            street,
            address,
            longitude,
            latitude
          } = this.form;
          this.subIsShow = true;
          addPlot({
            plotName,
            province,
            area,
            city,
            street,
            address,
            longitude,
            latitude
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.subIsShow = false;
                this.$emit("handleClose", true);
              }
            })
            .catch(err => {
              this.subIsShow = false;
            });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 删除楼座
     */
    delBuilding(data) {
      let { number } = data;
      delBuilding({
        id: number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除楼座成功");
          this.getList();
        }
      });
    },
    /**
     * 删除门号
     */
    delDoor(data) {
      let { number } = data;
      delDoor({
        id: number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除楼座成功");
          this.getList();
        }
      });
    },
    /**
     * 导出门号模板
     */
    exportExcel() {
      this.exportLoading = true;
      const params = {
        title: [
          //   "楼座",
          "门号1",
          "门号2",
          "门号3",
          "门号4",
          "门号5",
          "门号6",
          "门号7",
          "门号8"
        ],
        key: [
          //   "building",
          "door1",
          "door2",
          "door3",
          "door4",
          "door5",
          "door6",
          "door7",
          "door8"
        ],
        data: [
          {
            // building: "1",
            door1: "0101",
            door2: "0102",
            door3: "0103",
            door4: "0104",
            door5: "0105",
            door6: "0106",
            door7: "0107",
            door8: "0108"
          },
          {
            // building: "1",
            door1: "0201",
            door2: "0202",
            door3: "0203",
            door4: "0204",
            door5: "0205",
            door6: "0206",
            door7: "0207",
            door8: "0208"
          },
          {
            // building: "1",
            door1: "0301",
            door2: "0302",
            door3: "0303",
            door4: "0304",
            door5: "0305",
            door6: "0306",
            door7: "0307",
            door8: "0308"
          }
        ],
        autoWidth: true,
        filename: "门号模板"
      };
      excel.export_array_to_excel(params);
      this.exportLoading = false;
    },
    /**
     * 导入excel
     */
    showImport(data) {
      console.log("导入", data);
    },
    /**
     * 导入操作
     */
    handleBeforeUpload(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file);
        this.file = file;
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc:
            "文件：" +
            file.name +
            "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。"
        });
      }
      return false;
    },
    initUpload() {
      this.file = null;
      this.showProgress = false;
      this.loadingProgress = 0;
      this.tableData = [];
      this.tableTitle = [];
    },
    handleUploadFile(buildingNumber) {
      this.excelTable.buildingNumber = buildingNumber;
      this.initUpload();
    },
    /**
     * 读取文件
     */
    readFile(file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadstart = e => {
        this.uploadLoading = true;
        this.tableLoading = true;
        this.showProgress = true;
      };
      reader.onprogress = e => {
        this.progressPercent = Math.round((e.loaded / e.total) * 100);
      };
      reader.onerror = e => {
        this.$Message.error("文件读取出错");
      };
      reader.onload = e => {
        this.$Message.info("文件读取成功");
        this.excelTable.isShow = true;
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        const tableTitle = header.map(item => {
          return { title: item, key: item };
        });

        this.excelTable.tabData = results;
        this.excelTable.tabCol = tableTitle;

        this.uploadLoading = false;
        this.tableLoading = false;
        this.showRemoveFile = true;
      };
    },
    /**
     * 一键添加一个叫门口的楼座
     */
    addPlotDoor() {
      addBuilding({
        plotNumber: this.plotNumber,
        buildingName: '门口'
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("添加成功");
          this.getList();
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
>>>.ivu-tree>.ivu-tree-children>li>ul>li {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.excel-handler {
  text-align: right;
}
</style>


