<template>
  <div>
    <Modal
      title="楼座管理"
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
      <Tree :data="buildingData" :render="renderContent"></Tree>
    </Modal>

    <!-- 添加楼号的弹窗-start -->
    <Modal title="添加楼座" v-model.trim="addBuildingModel" :mask-closable="true" width="400">
      <Form
        ref="buildingForm"
        :model="addBuildingForm"
        :rules="addBuildingRules"
        :label-width="100"
      >
        <FormItem prop="name" label="楼座">
          <Input v-model.trim="addBuildingForm.name" placeholder="请输入楼号,不超过8个字符" style="width: 200px;" />
        </FormItem>
      </Form>
      <div slot="footer">
        <!-- <Button type="text" @click="handleClose">取消</Button> -->
        <Button type="primary" @click="submitAddBuilding" :loading="addBuildingIsShow">确定</Button>
      </div>
    </Modal>
    <!-- 添加楼号的弹窗-end -->

    <!-- 添加门号的弹窗-start -->
    <Modal title="添加门号" v-model.trim="addDoorModel" :mask-closable="true" width="400">
      <Form ref="doorForm" :model="addDoorForm" :rules="addDoorRules" :label-width="100">
        <FormItem prop="name" label="门号号">
          <Input v-model.trim="addDoorForm.name" placeholder="请输入门号,不超过8个字符" style="width: 200px;" />
        </FormItem>
      </Form>
      <div slot="footer">
        <!-- <Button type="text" @click="handleClose">取消</Button> -->
        <Button type="primary" @click="submitAddDoor" :loading="addDoorIsShow">确定</Button>
      </div>
    </Modal>
    <!-- 添加门号的弹窗-end -->
  </div>
</template>
<script>
import { getBuildingList, addBuilding, addDoor } from "@/api/dataManage";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    addressCascader
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
      buildingNumber: null, // 要添加门号时的楼座number
      addBuildingModel: false, // 添加楼号弹出窗
      addDoorModel: false, // 添加门号弹出窗
      subIsShow: false,
      addBuildingIsShow: false, // 添加楼座loading按钮是否显示
      addDoorIsShow: false, // 添加门号loading是不是显示
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
               //验证规则
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
            validator:(rule, value, callback, source, options)=>{
              let err = [];
              if (!this.$options.filters.latitude(value)) {
                err = "请填写正确的纬度";
              }
              callback(err);
            }
          }
        ]
      },
      addBuildingForm: {
        // 添加楼号表格
        name: null // 楼座名
      },
      addBuildingRules: {
        name: [
          {
            required: true,
            message: "请填写楼座号",
            trigger: "blur"
          },
          {
            max: 8,
            message: "长度不超过8个字符",
            trigger: "blur"
          }
        ]
        // 添加楼座验证规则
      },
      addDoorForm: {
        // 添加门号表格
        name: null // 门号名
      },
      addDoorRules: {
        // 添加门号验证规则
        name: [
          {
            required: true,
            message: "请填写门号",
            trigger: "blur"
          },
          {
            max: 8,
            message: "长度不超过8个字符",
            trigger: "blur"
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
            if (this.$options.filters.auth(['common.plogM.buildingM.addBuilding'])) {
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
                        type: "primary"
                      }),
                      style: {
                        // width: "64px"
                        marginRight: "8px"
                      },
                      on: {
                        click: () => {
                          this.addBuilding(data);
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
    }
  },
  methods: {
    getList() {
      getBuildingList({
        plotNumber: this.plotNumber
      })
        .then(({ data, errorCode }) => {
          if (errorCode === 0) {
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
      let addBtn = [];
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
        if (this.$options.filters.auth(['common.plogM.buildingM.addDoor'])) {
          addBtn = [
            h(
              "Button",
              {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add"
                }),
                style: {
                  marginRight: "-16px"
                },
                on: {
                  click: () => {
                    this.addDoor(data);
                  }
                }
              },
              "添加门号"
            )
          ];
        }
      } else {
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
            width: "100%"
          }
        },
        [
          h("span", [icon, h("span", data.title)]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            addBtn
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
    addBuilding(data) {
      // 添加楼座
      console.log(data);
      this.addBuildingModel = true;
    },
    addDoor(data) {
      // 添加门号
      this.buildingNumber = data.number;
      console.log(data);
      this.addDoorModel = true;
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
    submitAddBuilding() {
      this.$refs["buildingForm"].validate(async valid => {
        if (valid) {
          this.addBuildingIsShow = true;
          addBuilding({
            plotNumber: this.plotNumber,
            buildingName: this.addBuildingForm.name
          })
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.addBuildingModel = false;
                this.getList();
              }
              this.addBuildingIsShow = false;
            })
            .catch(() => {
              this.addBuildingIsShow = false;
            });
        }
      });
    },
    submitAddDoor() {
      this.$refs["doorForm"].validate(async valid => {
        if (valid) {
          this.addDoorIsShow = true;
          addDoor({
            plotNumber: this.plotNumber,
            buildingNumber: this.buildingNumber,
            doorName: this.addDoorForm.name
          })
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.addDoorModel = false;
                this.$Message.success("添加成功");
                this.getList();
              }
              this.addDoorIsShow = false;
            })
            .catch(() => {
              this.addDoorIsShow = false;
            });
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
</style>


