<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="80">
          <FormItem prop="plotNumber" label="小区楼座" v-if="!curPlotNumber">
            <div style="display: flex;">
              <address-cascader
                ref="addressCascader"
                @onChange="addressCascaderChange"
                :showAllText="true"
                :showAllTextLevel="2"
                :showLevel="7"
                style="width: 250px"
              ></address-cascader>
            </div>
          </FormItem>
          <FormItem label="楼座门号" v-if="curPlotNumber">
            <building-cascader
              ref="buildingCascader"
              :showAllText="true"
              :showAllTextLevel="2"
              @onChange="buildingCascaderChange"
              style="width: 150px;"
            ></building-cascader>
          </FormItem>
          <FormItem prop="deviceName" label="名称">
            <Input v-model.trim="searchForm.deviceName" placeholder="设备名称" style="width:120px;" />
          </FormItem>
          <FormItem prop="positionDesc" label="位置">
            <Input v-model.trim="searchForm.positionDesc" placeholder="位置" style="width:120px;" />
          </FormItem>
          <FormItem prop="deviceRoleType" label="出入类型">
            <Select v-model="searchForm.deviceRoleType" style="width: 120px;">
              <Option v-for="item in RecordType" :value="item.code" :key="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="deviceType" label="设备类型">
            <Select v-model="searchForm.deviceType" style="width: 120px;">
              <Option v-for="item in DeviceType" :value="item.code" :key="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button
          icon="md-add"
          v-if="$options.filters.auth(['hostM.entranceDevice.add'])"
          type="info"
          @click="showAdd"
        >添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 表格-start -->
    <div class="win-table-wrapper" id="win-table-wrapper">
      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="list"></Table>
    </div>
    <!-- 表格-end -->

    <!-- 分页-start -->
    <Page
      placement="top"
      :total="page.total"
      :page-size="page.size"
      :page-size-opts="page.sizeOpts"
      show-total
      show-elevator
      show-sizer
      :current="page.current"
      class="page-wrapper"
      @on-page-size-change="pageSizeChange"
      @on-change="pageChange"
    />
    <!-- 分页-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :number="edit.number"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情内容弹窗-start -->
    <detail @handleClose="detailClose" :isShow="detail.isShow" :deviceAccount="detail.deviceAccount"></detail>
    <!-- 详情内容弹窗-end -->
  </div>
</template>
<script>
import Add from "./add";
import Edit from "./edit";
import Detail from "./detail";
import {
  getEntranceDevice,
  unbindEntranceDevice,
  updateEntranceDevice,
  delEntranceDevice
} from "@/api/communityManage";
import { mapState } from "vuex";
import AddressCascader from "@/components/addressCascader/addressCascader";
import BuildingCascader from "@/components/buildingCascader/buildingCascader";
export default {
  components: {
    Add,
    Edit,
    Detail,
    AddressCascader,
    BuildingCascader
  },
  data() {
    return {
      DeviceActionType: this.$options.filters.statusList("DeviceActionType"), //门口机操作
      DeviceType: this.$options.filters.statusList("DeviceSortType"),
      RecordType: this.$options.filters.statusList("RecordType"),
      searchForm: {
        deviceType: null,
        deviceRoleType: null
      },
      list: [],
      searchForm: {
        phone: null
      },
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        number: null
      },
      detail: {
        isShow: false,
        deviceAccount: null
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  computed: {
    ...mapState({
      curPlotNumber: state => state.user.curPlotNumber
    }),
    tabCol: function() {
      return [
        // 表格标题栏
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center",
          indexMethod: row => {
            return row._index + 1 + (this.page.current - 1) * this.page.size;
          }
        },
        {
          title: "logo",
          key: "logoUrl",
          width: 88,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  "flex-div": true
                }
              },
              [
                h("img", {
                  attrs: {
                    src:
                      params.row.logoUrl || require("@/assets/images/none.png")
                  }
                })
              ]
            );
          }
        },
        {
          title: "是否在线",
          key: "onLine",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  "cell-success": params.row.onLine,
                  "cell-error": !params.row.onLine
                }
              },
              params.row.onLine ? "在线" : "离线"
            );
          }
        },
        {
          title: "门口机名称",
          key: "deviceName",
          minWidth: 150
        },
        {
          title: "门口机号",
          key: "deviceAccount",
          width: 150
        },
        {
          title: "位置",
          key: "positionDesc",
          width: 150
        },
        {
          title: "出入类型",
          key: "deviceRoleType",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.deviceRoleType,
                "RecordType"
              )
            );
          }
        },
        {
          title: "省市区街道",
          key: "PCAS",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              (params.row.provinceName || "") +
                (params.row.cityName || "") +
                (params.row.areaName || "") +
                (params.row.streetName || "")
            );
          }
        },
        {
          title: "所属小区",
          key: "plotName",
          width: 120
        },

        {
          title: "楼座",
          key: "buildingName",
          width: 70
        },
        {
          title: "门号",
          key: "doorName",
          width: 70
        },
        {
          title: "类型",
          key: "deviceType",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.deviceType,
                "DeviceSortType"
              )
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 210,
          align: "left",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (
              this.$options.filters.auth(["hostM.entranceDevice.edit"])
            ) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
                  },
                  on: {
                    click: () => {
                      this.showEdit(params.index);
                    }
                  }
                },
                params.row.plotNumber ? "编辑" : "绑定"
              );
              btnGroup.push(btn);
            }
            if (
              this.$options.filters.auth(['hostM.entranceDevice.log'])
            ) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    margin: "2px"
                  },
                  on: {
                    click: () => {
                      this.showDetail(params.index);
                    }
                  }
                },
                "查看日志"
              );
              btnGroup.push(btn);
            }
            if (
              this.$options.filters.auth(["hostM.entranceDevice.edit"])
            ) {
              let items = [];
              for (let i = 0; i < this.DeviceActionType.length; i++) {
                let { name, code } = this.DeviceActionType[i];
                let item = h(
                  "DropdownItem",
                  {
                    props: {
                      name: params.row.deviceNumber + "," + code
                      //   on: {
                      //     click: () => {
                      //       this.triggerAction({
                      //         deviceNumber: params.row.deviceNumber,
                      //         actionType: code
                      //       });
                      //     }
                      //   }
                    }
                  },
                  name
                );
                items.push(item);
                // let btn = h(
                //   "Button",
                //   {
                //     props: {
                //       type: "info",
                //       size: "small"
                //     },
                //     style: {
                //       margin: "2px"
                //     },
                //     on: {
                //       click: () => {
                //         this.triggerAction({
                //           deviceNumber: params.row.deviceNumber,
                //           actionType: code
                //         });
                //       }
                //     }
                //   },
                //   name
                // );
              }
              let dropDown = h(
                "Dropdown",
                {
                  props: {
                    trigger: "click",
                    transfer: true
                  },
                  style: {
                    margin: "0 2px"
                  },
                  on: {
                    "on-click": e => {
                      this.triggerAction(e);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "info",
                        size: "small"
                      }
                    },
                    [
                      "更多操作",
                      h("Icon", {
                        props: {
                          type: "ios-arrow-down"
                        },
                        style: {
                          marginLeft: "4px"
                        }
                      })
                    ]
                  ),
                  h(
                    "DropdownMenu",
                    {
                      props: {
                        slot: "list"
                      },
                      slot: "list"
                    },
                    items
                  )
                ]
              );
              btnGroup.push(dropDown);
            }
            if (
              this.$options.filters.auth([
                "hostM.entranceDevice.unbind"
              ]) &&
              params.row.provinceCode
            ) {
              let btn = h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要解绑吗?",
                    transfer: true
                  },
                  style: {
                    margin: "0 2px"
                  },
                  on: {
                    "on-ok": () => {
                      this.unbind(params.row.id);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      }
                    },
                    "解绑"
                  )
                ]
              );
              btnGroup.push(btn);
            }
            if (
              this.$options.filters.auth(["hostM.entranceDevice.del"]) &&
              !params.row.plotNumber
            ) {
              let btn = h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?",
                    transfer: true
                  },
                  style: {
                    margin: "0 2px"
                  },
                  on: {
                    "on-ok": () => {
                      this.delItem(params.row.deviceNumber);
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
              );
              btnGroup.push(btn);
            }
            return h("div", { style: { margin: "2px 0" } }, btnGroup);
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
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      getEntranceDevice(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              let { list, total } = data;
              this.list = list;
              this.page.total = total;
            } else {
              this.list = [];
              this.page.total = 0;
            }
          }
        })
        .catch(err => {
          this.tabIsLoading = false;
        });
    },
    /**
     * 解绑设备
     */
    unbind(id) {
      unbindEntranceDevice({ id }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("解绑成功");
          this.getList();
        }
      });
    },
    /**
     * @method pageSizeChange 当每页显示的数量改变时
     * @param {Number} event 当前选择每页显示的数量
     */
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getList();
    },
    /**
     * @method pageChange 当页数改变时
     * @param {Number} event 当前选择的页数
     */
    pageChange(event) {
      this.page.current = event;
      this.getList();
    },
    /**
     * @method search 提交搜索
     */
    search() {
      this.page.current = 1;
      console.log(this.searchForm);
      this.getList();
    },
    /**
     * @method resetSearch 重置搜索条件
     */
    resetSearch() {
      this.$refs["search-form"].resetFields();
      this.$refs["addressCascader"] &&
        this.$refs["addressCascader"].resetData();
      this.$refs["buildingCascader"] &&
        this.$refs["buildingCascader"].resetData();
      this.page.current = 1;
      this.getList();
    },
    /**
     * @method showAdd 显示添加弹窗
     */
    showAdd() {
      this.add.isShow = true;
    },
    /**
     * @method addClose 添加的弹窗关闭时触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    addClose(isRefresh = false) {
      this.add.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      let { deviceNumber } = this.list[index];
      this.edit.number = deviceNumber;
      this.edit.isShow = true;
    },
    /**
     * @method editClose 编辑框关闭触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    editClose(isRefresh = false) {
      this.edit.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    showDetail(index) {
      // 显示详情弹窗
      let { deviceAccount } = this.list[index];
      console.log(deviceAccount)
      this.detail.deviceAccount = deviceAccount;
      this.detail.isShow = true;
    },
    detailClose() {
      this.detail.isShow = false;
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.searchForm.provinceCode = value[0];
      this.searchForm.cityCode = value[1];
      this.searchForm.areaCode = value[2];
      this.searchForm.streetCode = value[3];
      this.searchForm.plotNumber = value[4];
      this.searchForm.buildingNumber = value[5];
      this.searchForm.doorNumber = value[6];
    },
    /**
     * 楼座组件改变
     */
    buildingCascaderChange(value) {
      this.searchForm.buildingNumber = value[0];
      this.searchForm.doorNumber = value[1];
    },
    /**
     * 触发操作方法
     */
    triggerAction(e) {
      let arr = e.split(",");
      let deviceNumber = arr[0];
      let actionType = arr[1];
      updateEntranceDevice({
        deviceNumber,
        actionType
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("操作成功");
        }
      });
    },
    /**
     * 删除数据
     */
    delItem(deviceNumber) {
      delEntranceDevice({
        deviceNumber
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    }
    // triggerAction({ deviceNumber, actionType }) {
    //   updateEntranceDevice({
    //     deviceNumber,
    //     actionType
    //   }).then(({ data, errorCode }) => {
    //     if (errorCode === 0) {
    //       this.$Message.success("操作成功");
    //     }
    //   });
    // }
  }
};
</script>
<style lang="stylus" scoped>
>>>.flex-div {
  width: 50px;
  height: 50px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>


