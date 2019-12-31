<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form
          class="search-form"
          @keyup.enter.native="search"
          ref="search-form"
          :model="searchForm"
          inline
          :label-width="70"
          v-if="searchIsShow"
        >
          <!-- <FormItem>
            <i-switch :before-change="handleBeforeChange" />
          </FormItem>-->
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
          <FormItem label="手机号" prop="domicilePhone">
            <Input
              v-model.trim="searchForm.domicilePhone"
              placeholder="输入手机号"
              style="width:120px;"
            />
          </FormItem>
          <!-- <FormItem label="手机号" prop="phone">
            <Input v-model.trim="searchForm.phone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>-->
          <FormItem label="真实姓名" prop="realName">
            <Input v-model.trim="searchForm.realName" placeholder="请输入真实姓名" style="width: 120px;" />
          </FormItem>

          <FormItem label="状态" prop="status">
            <Select v-model.trim="searchForm.status" placeholder="请选择状态" style="width:120px;">
              <Option
                v-for="(item, index) in DomicileStatus"
                v-show="item.isValid"
                :key="index"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
        </Form>
        <ButtonGroup class="btns" v-if="searchIsShow">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper"></div>
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

    <!-- 详情-start -->
    <detail
      @handleClose="detailClose"
      :domicileNumber="detail.domicileNumber"
      :isShow="detail.isShow"
    ></detail>
    <!-- 详情-end -->

    <!-- 详情-start -->
    <remove-owner :domicileNumber="setOwner.domicileNumber" v-model="setOwner.isShow"></remove-owner>
    <!-- 详情-end -->
    <!-- 编辑内容弹窗-start -->
    <edit v-model="edit.isShow" :domicileNumber="edit.domicileNumber"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 审核弹窗-start -->
    <check @handleClose="checkClose" :isShow="check.isShow" :number="check.number"></check>
    <!-- 审核弹窗-end -->
  </div>
</template>
<script>
import Edit from "./edit";
import Detail from "./detail";
import RemoveOwner from "./removeOwner";
import Check from "./check";
import DoorCard from "./doorCard/doorCard";
import { getPlotList } from "@/api/common";
import {
  getResidentList,
  changeResidentStatus,
  residentRemoveDisable,
  residentSetOwner,
  residentRemoveOwner,
  delResident
} from "@/api/communityManage";
import { mapState } from "vuex";
import AddressCascader from "@/components/addressCascader/addressCascader";
import BuildingCascader from "@/components/buildingCascader/buildingCascader";
export default {
  components: {
    RemoveOwner,
    Edit,
    Detail,
    Check,
    DoorCard,
    AddressCascader,
    BuildingCascader
  },
  props: {
    phone: {
      type: String,
      default: null
    },
    searchIsShow: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      curInviterType: null,
      gender: {
        0: "女",
        1: "男"
      },
      plotList: [],
      list: [],
      searchForm: {
        domicilePhone: null, // 电话
        status: null,
        plotNumber: null,
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        streetCode: null,
        plotNumber: null,
        buildingNumber: null,
        doorNumber: null
      },
      add: {
        isShow: false
      },
      detail: {
        domicileNumber: null,
        isShow: false
      },
      setOwner: {
        domicileNumber: null,
        isShow: false
      },
      edit: {
        isShow: false,
        domicileNumber: null
      },
      check: {
        isShow: false,
        number: null
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
          title: "手机号",
          key: "domicilePhone",
          width: 120
        },
        {
          title: "真实姓名",
          key: "realName",
          width: 100
        },
        {
          title: "审核状态",
          key: "status",
          align: "center",
          width: 120,
          render: (h, { row: { status } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-success": status === 1,
                  "cell-error": status === 3
                }
              },
              this.$options.filters.statusName(status, "DomicileStatus")
            );
          }
        },
        {
          title: "是否业主",
          key: "isOwner",
          align: "center",
          width: 100,
          render: (h, { row: { isOwner } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-primary": isOwner,
                  "cell-error": !isOwner
                }
              },
              isOwner ? "是" : "否"
            );
          }
        },
        {
          title: "是否邀请账号",
          width: 200,
          render: (
            h,
            { row: { inviterName, inviterNumber, inviterPhone } }
          ) => {
            let divGroup = [
              h("div", "被邀账号"),
              h("div", `邀请人：${inviterName}`),
              h("div", `手机号：${inviterPhone}`)
            ];
            return h(
              "div",
              {
                style: {
                  margin: "2px"
                },
                class: {
                  //   "cell-info": inviterNumber,
                  "cell-error": !inviterNumber
                }
              },
              inviterNumber ? divGroup : "否"
            );
          }
        },
        {
          title: "小区",
          key: "plotName",
          width: 150
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

        // {
        //   title: "详细地址",
        //   key: "address",
        //   minWidth: 150
        // },
        {
          title: "审核时间",
          key: "applyTime",
          minWidth: 150,
          render: (h, { row: { applyTime } }) => {
            return h(
              "div",
              this.$moment(applyTime * 1000).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 270,
          fixed: "right",
          render: (h, params) => {
            if (params.row.delete) {
              return h(
                "div",
                {
                  style: {
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center"
                  }
                },
                [
                  h(
                    "Tag",
                    {
                      props: {
                        color: "default"
                      },
                      style: {
                        "text-align": "center"
                      }
                    },
                    "已退出社区"
                  )
                ]
              );
            } else {
              let btnGroup = [];
              if (
                this.$options.filters.auth(["communityM.residentInfo.detail"])
              ) {
                //如果状态为正常和不通过时，才显示详情
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
                  "详情"
                );
                btnGroup.push(btn);
              }
              if (
                this.$options.filters.auth(["communityM.residentInfo.edit"])
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
                  "编辑"
                );
                btnGroup.push(btn);
              }
              if (
                this.$options.filters.auth([
                  "communityM.residentInfo.isOwner"
                ]) &&
                !params.row.isOwner
              ) {
                let btn = h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "是否设为业主?",
                      transfer: true
                    },
                    on: {
                      "on-ok": () => {
                        this.residentSetOwner(params.row.domicileNumber);
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
                        },
                        style: {
                          margin: "2px"
                        }
                      },
                      "设为业主"
                    )
                  ]
                );
                btnGroup.push(btn);
              }
              if (
                this.$options.filters.auth([
                  "communityM.residentInfo.isOwner"
                ]) &&
                params.row.isOwner
              ) {
                let btn = h(
                  "Button",
                  {
                    props: {
                      type: "warning",
                      size: "small"
                    },
                    style: {
                      margin: "2px"
                    },
                    on: {
                      click: () => {
                        this.showSetOwner(params.index);
                      }
                    }
                  },
                  "取消业主"
                );
                btnGroup.push(btn);
              }
              if (
                this.$options.filters.auth([
                  "communityM.residentInfo.changeStatus"
                ]) &&
                params.row.status === 1
              ) {
                let btn = h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "是否要禁用?",
                      transfer: true
                    },
                    on: {
                      "on-ok": () => {
                        this.disableItem(params.index);
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
                        },
                        style: {
                          margin: "2px"
                        }
                      },
                      "禁用"
                    )
                  ]
                );
                btnGroup.push(btn);
              }
              if (
                this.$options.filters.auth([
                  "communityM.residentInfo.removeDisable"
                ]) &&
                params.row.status === 3
              ) {
                let btn = h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "是否要解除禁用?",
                      transfer: true
                    },
                    on: {
                      "on-ok": () => {
                        this.removeDisableItem(params.index);
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
                        },
                        style: {
                          margin: "2px"
                        }
                      },
                      "解禁"
                    )
                  ]
                );
                btnGroup.push(btn);
              }
              if (this.$options.filters.auth(["communityM.residentInfo.del"])) {
                let btn = h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "是否确定删除?",
                      transfer: true
                    },
                    on: {
                      "on-ok": () => {
                        this.delItem(params.index);
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
                        },
                        style: {
                          margin: "2px"
                        }
                      },
                      "删除"
                    )
                  ]
                );
                btnGroup.push(btn);
              }
              return h("div", { style: { margin: "2px" } }, btnGroup);
            }
          }
        }
      ];
    },

    DomicileStatus: function() {
      let status = this.$options.filters.statusList("DomicileStatus");
      for (let i = 0; i < status.length; i++) {
        if (status[i].code === 1 || status[i].code === 3) {
          status[i].isValid = true;
        }
      }
      return status;
    }
  },
  mounted() {
    this.searchForm.domicilePhone = this.phone;
    this.getList();
  },
  watch: {
    "setOwner.isShow": function(val) {
      if (!val) {
        this.getList();
      }
    },
    "edit.isShow"(val) {
      if (!val) {
        this.getList();
      }
    }
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
      getResidentList(data)
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
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(index) {
      // 删除
      delResident({
        domicileNumber: this.list[index].domicileNumber
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
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
      this.searchForm.daterange = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
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
      let { domicileNumber } = this.list[index];
      this.edit.domicileNumber = domicileNumber;
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
      let { domicileNumber } = this.list[index];
      this.detail.domicileNumber = domicileNumber;
      this.detail.isShow = true;
    },
    detailClose(isRefresh = false) {
      this.detail.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * 弹开设置业主
     */
    showSetOwner(index) {
      let { domicileNumber } = this.list[index];
      this.setOwner.domicileNumber = domicileNumber;
      this.setOwner.isShow = true;
    },
    changeDate(e) {
      if (e[0]) {
        let bt =
          e[0].replace(/[年月]/g, "/").replace(/[日]/g, " ") + " 00:00:00";
        let et =
          e[1].replace(/[年月]/g, "/").replace(/[日]/g, " ") + " 23:59:59";

        this.searchForm.startTime = new Date(bt).getTime() / 1000;
        this.searchForm.endTime = new Date(et).getTime() / 1000;
      } else {
        this.searchForm.startTime = null;
        this.searchForm.endTime = null;
      }
    },
    /**
     * 显示审核弹窗
     */
    showCheck(index) {
      this.check.isShow = true;
      this.check.number = this.list[index].applyNumber;
    },
    /**
     * 关闭审核弹窗
     */
    checkClose(isRefresh = false) {
      this.check.isShow = false;
      if (isRefresh) {
        this.getList();
      }
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
     * 禁用数据
     */
    disableItem(index) {
      let { domicileNumber } = this.list[index];
      changeResidentStatus({
        domicileNumber,
        status: 3 // 禁用
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("禁用成功");
          this.getList();
        }
      });
    },
    /**
     * 解除禁用
     */
    removeDisableItem(index) {
      let { domicileNumber } = this.list[index];
      residentRemoveDisable({
        domicileNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("解除禁用成功");
          this.getList();
        }
      });
    },
    /**
     * 更改switch时触发
     */
    handleBeforeChange(index) {
      //   console.log('函数内打印出来', domicileNumber)
      return new Promise(resolve => {
        let { isOwner, domicileNumber } = this.list[index];

        this.$Modal.confirm({
          title: isOwner ? "取消业主" : "设为业主",
          content: isOwner ? "是否取消业主？" : "是否设为业主？",
          onOk: async () => {
            if (this.curInviterType) {
              if (isOwner) {
                if (this.curInviterType) {
                  // 如果本来是业主，则调用取消接口
                  await this.residentRemoveOwner(domicileNumber, index);
                  resolve();
                } else {
                  this.$Message.warning("取消业主必须选择与业主关系");
                }
              } else {
                await this.residentSetOwner(domicileNumber, index);
                resolve();
              }
            } else {
              this.$Message.warning("请选择与业主关系");
              this.handleBeforeChange(index);
            }
          },
          onCancel: () => {
            this.$set(this.list[index], "isOwnerIsLoading", false);
          },
          render: h => {
            let selectOptions = [];
            let InviterType = this.$options.filters.statusList("InviterType");
            for (let i = 0; i < InviterType.length; i++) {
              let { code, name } = InviterType[i];
              if (code != 1000) {
                selectOptions.push(
                  h(
                    "Option",
                    {
                      props: {
                        value: code
                      }
                    },
                    name
                  )
                );
              }
            }
            return h(
              "Select",
              {
                props: {
                  value: this.curInviterType
                },
                on: {
                  "on-change": value => {
                    this.curInviterType = value;
                  }
                }
              },
              selectOptions
            );
          }
        });
      });
    },
    /**
     * 设置业主
     */
    residentSetOwner(domicileNumber) {
      residentSetOwner({ domicileNumber }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("设置成功");
          this.getList();
        }
      });
    },
    /**
     * 取消业主
     */
    async residentRemoveOwner(domicileNumber, index) {
      this.$set(this.list[index], "isOwnerIsLoading", true);
      return new Promise((resolve, reject) => {
        residentRemoveOwner({ domicileNumber })
          .then(({ data, errorCode }) => {
            this.$set(this.list[index], "isOwnerIsLoading", false);
            if (errorCode === 0) {
              this.$Message.success("取消成功");
              this.$set(this.list[index], "isOwner", 0);
              resolve();
            }
          })
          .catch(err => {
            this.$set(this.list[index], "isOwnerIsLoading", false);
          });
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>


