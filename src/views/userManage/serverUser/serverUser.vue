<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" @keyup.enter.native="search" ref="search-form" :model="searchForm" inline :label-width="40">
          <FormItem prop="companyId" label="所属公司" :label-width="70">
            <Select v-model.trim="searchForm.companyId" placeholder="请选择所属公司" style="width: 120px;">
              <Option v-for="item in companyList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="plotNumber" label="小区" v-if="companyType!==1">
            <div style="display: flex;">
              <address-cascader
                ref="addressCascader"
                @onChange="addressCascaderChange"
                :showLevel="5"
                style="width: 250px"
              ></address-cascader>
            </div>
          </FormItem>
          <FormItem label="状态" prop="status">
            <Select v-model.trim="searchForm.status" placeholder="请选择状态" style="width: 120px;">
              <Option v-for="item in fsUserStatus" :key="item.code" :value="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="roleType" label="角色" v-if="companyType!==1">
            <Select v-model.trim="searchForm.roleType" placeholder="请选择角色" style="width:100px;">
              <Option
                v-for="item in FsUserRoleType"
                :key="item.code"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="姓名" prop="realName">
            <Input v-model.trim="searchForm.realName" placeholder="请输入姓名" style="width:120px" />
          </FormItem>
          <FormItem label="手机号" prop="phone" :label-width="50">
            <Input v-model.trim="searchForm.phone" placeholder="输入手机号" style="width:120px;" />
          </FormItem>
          <FormItem prop="captainPhone" label="队长手机" :label-width="80">
            <Input v-model="searchForm.captainPhone" placeholder="队长手机号" style="width:120px;" />
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper">
        <Button icon="md-add" type="info" @click="showAdd">添加</Button>
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
    <add v-model="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 详情内容弹窗-start -->
    <detail @handleClose="detailClose" :isShow="detail.isShow" :number="detail.number"></detail>
    <!-- 详情内容弹窗-end -->

    <!-- 审核资料-start -->
    <check @handleClose="checkClose" :isShow="check.isShow" :number="check.number"></check>
    <!-- 审核资料-end -->

    <!-- 编辑资料-start -->
    <edit v-model="edit.isShow" :number="edit.number"></edit>
    <!-- 编辑资料-end -->

    <!-- 修改队长弹窗-start -->
    <Modal title="取消队长" v-model="captainModal.isShow" :mask-closable="false" :closable="false">
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem prop="parentNumber" label="新队长">
          <Select v-model="form.parentNumber" placeholder="选择新队长才能取消" style="width:200px;">
            <Option
              v-for="item in captainList"
              :key="item.id"
              v-show="item.number!=curUserNumber"
              :value="item.number"
            >{{item.realName}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="captainModalClose">取消</Button>
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>
    <!-- 修改队长弹窗-end -->
  </div>
</template>
<script>
import Add from "./add";
import Detail from "./detail";
import Check from "./check";
import Edit from "./edit";
import { getServerUserList, setCaptain, resetCaptain } from "@/api/userManage";
import { getCompanyList } from "@/api/dataManage";
import { getPlotList } from "@/api/common";
import { mapState } from "vuex";
import AddressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    Add,
    Detail,
    Check,
    Edit,
    AddressCascader
  },
  computed: {
    ...mapState({
      companyType: state => state.user.companyType
    }),
    tabCol: function() {
      let tabCol = [
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
          title: "姓名",
          key: "realName",
          width: 100,
          render: (h, { row: { realName } }) => {
            return h("div", realName ? realName : "");
          }
        },
        {
          title: "手机号",
          key: "phone",
          width: 120
        },
        {
          title: "紧急联系人",
          key: "telephone",
          width: 120
        },
        {
          title: "性别",
          key: "gender",
          width: 50,
          render: (h, { row: { gender } }) => {
            return h("div", gender === 0 ? "女" : gender === 1 ? "男" : "");
          }
        },
        {
          title: "用户状态",
          key: "status",
          width: 100,
          render: (h, { row: { status } }) => {
            return h(
              "div",
              this.$options.filters.statusName(status, "FsUserStatus")
            );
          }
        },
        // {
        //   title: "是否队长",
        //   key: "captain",
        //   width: 100
        // },
        {
          title: "角色-负责区域",
          key: "position",
          minWidth: 150,
          render: (
            h,
            {
              row: {
                security,
                maintenance,
                propertyManage,
                salesman,
                propertyPCA,
                propertyPlotName,
                securityList, 
                maintainList
              }
            }
          ) => {
            let position = [];
            // if (security) {
            //   position.push("安保");
            // }
            if (maintenance) {
              position.push("维保");
            }
            // if (propertyManage) {
            //   position.push("物管");
            // }
            // if (salesman) {
            //   position.push("业务");
            // }
            let html = [];
            if (propertyManage && propertyPCA && propertyPlotName) {  // 如果是物管
              html.push(h("div", '物管'))
              html.push(h("div", propertyPCA + "-" + propertyPlotName));
            }
            if (security) { // 安保
                html.push(h('div', '安保'))
                if (securityList && securityList.length > 0) {
                    for (let i= 0; i< securityList.length; i++) {
                        let {securityPca, securityPlotName} = securityList[i]
                        securityPlotName = securityPlotName.split(',')
                        for (let j = 0; j< securityPlotName.length; j++) {
                            html.push(h('div',securityPca + "-" + securityPlotName[j] ))
                        }
                    }
                }
            }
            if (maintenance) { // 维保
                html.push(h('div', '维保'))
                if (maintainList && maintainList.length > 0) {
                    for (let i= 0; i< maintainList.length; i++) {
                        let {maintainPca, maintainStreetName} = maintainList[i]
                        maintainStreetName = maintainStreetName.split(',')
                        for (let j = 0; j< maintainStreetName.length; j++) {
                            html.push(h('div',maintainPca + "-" + maintainStreetName[j] ))
                        }
                    }
                }
            }
            if (salesman) { // 业务
                html.push(h('div', '业务'))
            }
            return h("div", html);
          }
        },
        {
          title: "所属公司",
          key: "companyName",
          minWidth: 150
        },
        // {
        //   type: "html",
        //   title: "安保小区",
        //   key: "securityPlot",
        //   width: 170
        // },
        // {
        //   type: "html",
        //   title: "维保小区",
        //   key: "maintenPlot",
        //   width: 170
        // },
        // {
        //   type: "html",
        //   title: "物管小区",
        //   key: "propertyPlot",
        //   width: 170
        // },
        // {
        //   title: "地址",
        //   key: "address",
        //   minWidth: 150
        // },
        {
          title: "更新时间",
          key: "updateTime",
          width: 155,
          render: (h, { row: { updateTime } }) => {
            return h(
              "div",
              this.$moment(updateTime * 1000).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        //默认为0,0:不是队长,1:保安队长,2维保队长,3安保与维保队长
        {
          title: "是否保安队长",
          fixed: "right",
          align: "center",
          width: 120,
          render: (h, params) => {
            if (params.row.security === 1 && params.row.status === 2) {
              let switchBtn = h(
                "i-switch",
                {
                  props: {
                    loading: params.row.captainIsLoading,
                    disabled: !this.$options.filters.auth([
                      "userM.server.changeCaptain"
                    ]),
                    value:
                      params.row.captain == 1 || params.row.captain == 3
                        ? true
                        : false
                  },
                  on: {
                    "on-change": status => {
                      this.captainChange(status, params.index, "security");
                    }
                  }
                },
                [
                  h(
                    "span",
                    {
                      slot: "open"
                    },
                    "是"
                  ),
                  h(
                    "span",
                    {
                      slot: "close"
                    },
                    "否"
                  )
                ]
              );
              return h("div", [switchBtn]);
            } else if (params.row.security === 1 && params.row.status === 2) {
              let tag;
              if (params.row.captain) {
                tag = h(
                  "Tag",
                  {
                    props: {
                      color: "primary"
                    }
                  },
                  "是"
                );
              } else {
                tag = h(
                  "Tag",
                  {
                    props: {
                      color: "default"
                    }
                  },
                  "否"
                );
              }
              return h("div", [tag]);
            }
          }
        },
        {
          title: "是否维保队长",
          fixed: "right",
          align: "center",
          width: 120,
          render: (h, params) => {
            if (params.row.maintenance === 1 && params.row.status === 2) {
              let switchBtn = h(
                "i-switch",
                {
                  props: {
                    loading: params.row.captainIsLoading,
                    disabled: !this.$options.filters.auth([
                      "userM.server.changeCaptain"
                    ]),
                    value:
                      params.row.captain == 2 || params.row.captain == 3
                        ? true
                        : false
                  },
                  on: {
                    "on-change": status => {
                      this.captainChange(status, params.index, "maintenance");
                    }
                  }
                },
                [
                  h(
                    "span",
                    {
                      slot: "open"
                    },
                    "是"
                  ),
                  h(
                    "span",
                    {
                      slot: "close"
                    },
                    "否"
                  )
                ]
              );
              return h("div", [switchBtn]);
            } else if (
              params.row.maintenance === 1 &&
              params.row.status === 2
            ) {
              let tag;
              if (params.row.captain) {
                tag = h(
                  "Tag",
                  {
                    props: {
                      color: "primary"
                    }
                  },
                  "是"
                );
              } else {
                tag = h(
                  "Tag",
                  {
                    props: {
                      color: "default"
                    }
                  },
                  "否"
                );
              }
              return h("div", [tag]);
            }
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "left",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (
              (params.row.status === 0 || params.row.status === 1) &&
              this.$options.filters.auth(["userM.server.check"])
            ) {
              console.log(params);
              let btn = h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginLeft: "2px",
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      this.ShowCheck(params.index);
                    }
                  }
                },
                "审核"
              );
              btnGroup.push(btn);
            } else if (
              //   params.row.status ===
              //     this.$options.filters.statusName("2", "FsUserStatus") &&
              this.$options.filters.auth(["userM.server.detail"])
            ) {
              // 如果是审核通过就显示详情
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
              if (params.row.status === 2) {
                let editBtn = h(
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
                btnGroup.push(editBtn);
              }
            } else if (params.row.status === -1) {
              let btn = h(
                "Button",
                {
                  props: {
                    size: "small",
                    disabled: true
                  },
                  style: {
                    marginLeft: "2px",
                    marginRight: "2px"
                  },
                  on: {
                    click: () => {
                      //   this.ShowCheck(params.index);
                    }
                  }
                },
                "暂无资料"
              );
              btnGroup.push(btn);
            }
            return h("div", btnGroup);
          }
        }
      ];
      if (this.companyType === 1) {
        tabCol.splice(-3, 2);
        return tabCol;
      } else {
        return tabCol;
      }
    }
  },
  watch: {
    "searchForm.streetCode": function(val, oldVal) {
      if (val) {
        this.getPlotList(); // 当选择了街道时，拉一下小区数据
      } else {
        this.plotList = [];
      }
    },
    "captainModal.isShow": function(val, oldVal) {
      this.$refs["form"].resetFields();
    },
    "add.isShow": function(val) {
      if (!val) {
        this.getList();
      }
    },
    "edit.isShow": function(val) {
      if (!val) {
        this.getList();
      }
    }
  },
  data() {
    return {
      list: [],
      curUserNumber: null,
      fsUserStatus: this.$options.filters.statusList("FsUserStatus"),
      FsUserRoleType: this.$options.filters.statusList("FsUserRoleType"),
      captainList: [], // 队长列表
      dismissCaptainNumber: null, // 要解除队长的number
      plotList: [], // 小区列表
      searchForm: {
        phone: null,
        status: null,
        roleType: null, // 角色id
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        streetCode: null,
        plotNumber: null,
        captainPhone: null,
        realName: null,
        companyId: null
      },
      companyList: [],
      add: {
        isShow: false
      },
      edit: {
        isShow: false,
        number: null
      },
      check: {
        isShow: false,
        number: null
      },
      detail: {
        isShow: false,
        number: null
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      captainModal: {
        isShow: false
      },
      form: {
        parentNumber: ""
      },
      rules: {
        parentNumber: [
          {
            required: true,
            message: "请选择新队长",
            trigger: "blur"
          }
        ]
      }
    };
  },

  mounted() {
    this.getCompanyList();
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
        userName: null,
        pageSize: size,
        page: current
      };
      if (Object.keys(searchData).length > 0) {
        data = Object.assign(data, searchData);
      }
      if (this.companyType === 1) {
        // 如果公司类型是物管角色，要把roleType设为2
        data.roleType = 2;
      }
      delete data.provinceCode;
      delete data.cityCode;
      delete data.areaCode;
      delete data.streetCode;

      getServerUserList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              let { list, total } = data;
              for (let i = 0; i < list.length; i++) {
                list[i].captainIsLoading = false;
              }
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
      delAccount({
        deleteUserId: this.list[index].id
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
      console.log(this.searchForm);
      this.getList();
    },
    /**
     * @method resetSearch 重置搜索条件
     */
    resetSearch() {
      this.$refs["search-form"].resetFields();
      if (this.companyType !== 1) {
        this.$refs["addressCascader"].resetData();
      }
      this.searchForm.status = null;
      this.searchForm.realNam = null;
      this.searchForm.phone = null;
      this.searchForm.captainPhone = null;
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
     * 显示审核弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    ShowCheck(index) {
      let { number } = this.list[index];
      this.check.number = number;
      this.check.isShow = true;
    },
    /**
     * 审核弹窗关闭
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    checkClose(isRefresh = false) {
      console.log("isRefresh", isRefresh);
      this.check.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * @method showEdit 显示编辑弹窗
     * @param {Number} index 当前要编辑的数据的序号
     */
    showEdit(index) {
      let { number } = this.list[index];
      this.edit.number = number;
      this.edit.isShow = true;
    },
    /**
     * 显示详情弹窗
     */
    showDetail(index) {
      let { number } = this.list[index];
      this.detail.number = number;
      this.detail.isShow = true;
    },
    detailClose() {
      this.detail.isShow = false;
    },
    /**
     * 改变当前服务人员是否为队长
     * @param {Boolean} status  当前改变后的状态，true为1即为队长，0为普通
     * @param {Number} index 当前操作是list中那一条数据
     * @param {String} type maintenance维保，安保security
     */
    //默认为0,0:不是队长,1:保安队长,2维保队长,3安保与维保队长
    async captainChange(status, index) {
      console.log(status, index);
      this.curUserNumber = this.list[index].number;
      this.list[index].captainIsLoading = true; // 按钮状态显示为loading
      let { security, maintenance, captain, number } = this.list[index]; // 当前是否队长
      let type; //0:不是队长,1:保安队长,2维保队长,3安保与维保队长
      // 如果是从普通设置为队长
      if (security && maintenance) {
        // 设置为安保、维保队长
        type = 3;
      } else if (security) {
        // 设置为安保队长
        type = 1;
      } else if (maintenance) {
        // 设置为维保队长
        type = 2;
      }
      if (status && !captain) {
        setTimeout(() => {
          setCaptain({
            userNumber: this.list[index].number,
            type
          }).then(({ data, errorCode }) => {
            if (errorCode === 0) {
              this.list[index].captainIsLoading = false;
              this.$Message.success("设置队长成功");
              this.list = [];
              this.getList();
            }
          });
        }, 300);
      } else if (!status && captain) {
        // 如果撤销队长，要弹出新队长选择
        this.captainModal.isShow = true;
        this.dismissCaptainNumber = number;
        await this.getCaptainList(captain);
      }
      return;
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
    },
    /**
     * 根据省市区获取小区列表
     */
    getPlotList() {
      getPlotList({
        streetCode: this.searchForm.streetCode
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.plotList = data.list;
        }
      });
    },
    /**
     * 查询队长
     */
    async getCaptainList(captain) {
      return new Promise((resolve, reject) => {
        getServerUserList({
          status: 2, // 审核通过
          page: 1,
          pageSize: 99,
          captain
        }).then(({ data, errorCode }) => {
          if (errorCode === 0) {
            this.captainList = data.list;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    /**
     * 设置队长弹窗关闭
     */
    captainModalClose() {
      this.captainModal.isShow = false;
      this.list = [];
      this.getList();
    },
    /**
     * 提交新队长设置
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          resetCaptain({
            userNumber: this.dismissCaptainNumber,
            parentNumber: this.form.parentNumber
          }).then(({ data, errorCode }) => {
            if (errorCode === 0) {
              this.$Message.success("设置成功");
              this.captainModal.isShow = false;
              this.list = [];
              this.getList();
            }
          });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 获取公司列表
     */
    getCompanyList() {
      getCompanyList({
        input: {
          //   inCompanyTypes: [this.form.companyType],
          isMincompany: 1
        }
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.companyList = data.list;
        }
      });
    }
  }
};
</script>



