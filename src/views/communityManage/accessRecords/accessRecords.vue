<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper">
        <Form class="search-form" ref="search-form" :model="searchForm" inline :label-width="66">
          <FormItem prop="plotNumber" label="小区楼座" v-if="!curPlotNumber">
            <div style="display: flex;">
              <address-cascader
                ref="addressCascader"
                @onChange="addressCascaderChange"
                :showAllText="true"
                :showAllTextLevel="2"
                :showLevel="7"
                style="width: 390px"
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
          <FormItem label="时间范围">
            <DatePicker
              ref="dataTimePicker"
              type="datetimerange"
              v-model.trim="searchForm.dateTime"
              @on-change="timeChange"
              placeholder="选择查询的时间段"
              style="width: 275px"
            ></DatePicker>
          </FormItem>

          <FormItem label="出入人姓名"  :label-width="80">
            <Input v-model.trim="searchForm.roleName" placeholder="输入出入人姓名" style="width:120px;" />
          </FormItem>
          <FormItem label="角色" prop="roleType" :label-width="50">
            <Select v-model.trim="searchForm.roleType" placeholder="请选择角色" style="width:120px;">
              <Option v-for="item in RelationType" :value="item.code" :key="item.code">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="出入类型">
            <Select v-model.trim="searchForm.recordType" placeholder="输入出入类型" style="width: 120px;">
              <Option
                v-for="(item, key) in recordType"
                :value="item.code"
                :key="key"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否开门">
            <Select v-model.trim="searchForm.openStatus" placeholder="输入出入类型" style="width: 120px;">
              <Option
                v-for="(item, key) in openStatus"
                :value="item.code"
                :key="key"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="记录类型">
            <Select v-model.trim="searchForm.openType" placeholder="输入出入类型" style="width: 120px;">
              <Option v-for="(item, key) in openType" :value="item.code" :key="key">{{ item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="业主姓名">
            <Input v-model.trim="searchForm.realName" placeholder="输入出入人姓名" style="width:120px;" />
          </FormItem>
          <FormItem label="业主电话">
            <Input v-model.trim="searchForm.phone" placeholder="输入出入人姓名" style="width:120px;" />
          </FormItem>
          <FormItem label="业主户号">
            <Input v-model.trim="searchForm.doorName" placeholder="输入出入人姓名" style="width:120px;" />
          </FormItem>
        </Form>
        <ButtonGroup class="btns">
          <Button class="search-btn" type="primary" icon="md-search" @click="search">搜索</Button>
          <Button class="search-btn" type="warning" icon="md-refresh" @click="resetSearch">重置</Button>
        </ButtonGroup>
      </div>
      <div class="handle-wrapper" style="margin-left: 30px;">
        <Button type="info" @click="generateExcle"  icon="md-download"  :loading="butLoading">生成excel表格</Button>
      </div>
      <div class="handle-wrapper">
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 表格-start -->
    <div class="win-table-wrapper" id="win-table-wrapper">
      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table>
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
    <detail @handleClose="detailClose" :recordNumber="detail.recordNumber" :isShow="detail.isShow"></detail>
    <!-- 详情-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import Add from "./add";
import Edit from "./edit";
import Detail from "./detail";
import { getRecordList } from "@/api/communityManage";
import { getPlotList } from "@/api/common";
import { mapState } from "vuex";
import AddressCascader from "@/components/addressCascader/addressCascader";
import BuildingCascader from "@/components/buildingCascader/buildingCascader";
import excel from "@/libs/excel";
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
      butLoading: false,
      RelationType: this.$options.filters.statusList("RelationType"),
      recordType: this.$options.filters.statusList("RecordType"),
      openStatus: this.$options.filters.statusList("OpenStatus"),
      openType: this.$options.filters.statusList("OpenType"),
      list: [],
      searchForm: {
        plotNumber: null,
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        streetCode: null,
        plotNumber: null,
        buildingNumber: null,
        domDoorNumber: null,
        dateTime: [],
        startTime: null,
        endTime: null,
        roleName: null, //出入人姓名
        recordType: null, //出入类型
        openStatus: null, //是否开门
        openType: null, //记录类型
        roleType: null,
        realName: null,//业主名
        phone: null,//业主手机号
        doorName: null//门号
      },
      add: {
        isShow: false
      },
      detail: {
        recordNumber: null,
        isShow: false
      },
      edit: {
        isShow: false,
        id: null
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
  watch: {},
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
          title: "社区名称",
          key: "plotName",
          width: 100
        },
        {
          title: "楼座",
          key: "buildingName",
          width: 50
        },
        {
          title: "业主户号",
          key: "doorName",
          width: 120
        },
        {
          title: "位置",
          key: "positionName",
          width: 100
        },
        {
          title: "是否开门",
          key: "openStatus",
          width: 100
        },
        {
          title: "记录类型",
          key: "openType",
          width: 100
        },
        {
          title: "出入类型",
          key: "recordType",
          width: 80
        },
        {
          title: "姓名",
          key: "roleName",
          width: 160
        },
        {
          title: "业主姓名",
          key: "realName",
          width: 120
        },
        {
          title: "业主电话",
          key: "phone",
          width: 120
        },        
        {
          title: "角色",
          key: "roleType",
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.roleType,
                "RelationType"
              )
            );
          }
        },
        {
          title: "出入时间",
          key: "triggeringTime",
          width: 150
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(['communityM.accessRecords.detail'])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
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

            return h("div", btnGroup);
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let {
          plotName, // 小区名
          buildingName, // 楼座名
          positionName, // 出口位置
          IsOpen, // 是否开门（新加）
          recordType, // 门口机类型，是出口还是入口的机
          doorName,
          realName,
          phone,
          openStatus,
          openType,
          roleType,
          roleName, // 角色名称
          triggeringTime // 发生时间
        } = this.list[i];
        tabData.push({
          plotName, // 小区名
          recordType: this.$options.filters.statusName(
            recordType,
            "RecordType"
          ),
          buildingName, // 楼座名
          positionName, // 出口位置
          roleType,
          doorName,
          realName,
          phone,
          openStatus:
            openType === 2
              ? this.$options.filters.statusName(openStatus, "OpenStatus")
              : "", //是否开门
          openType: this.$options.filters.statusName(openType, "OpenType"), //记录类型
          roleName, // 角色名称
          triggeringTime: this.$options.filters.formatTime(triggeringTime) // 发生时间
        });
      }
      return tabData;
    }
  },
  mounted() {
    console.log(this.searchForm);
    console.log(this.IsOpenType);
    this.getList();
    // this.getPlotList()
    // this.getRoleList();
  },
  methods: {
    /**
     * @method generateExcle 生成excel表格
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    generateExcle(){
      this.butLoading = true;
      let dataList = [];
      getRecordList({
        pageSize: 999999999,
        page: 1
      }).then(({data, errorCode})=>{
        if (errorCode === 0) {
          if (data.list) {
            console.log(data.list);
            let { list, total } = data;
            import('@/libs/export2Excel.js').then(excel => {
              const title = ['广东穿云箭科技有限公司', '', '', '', ''];  //标题
              const tHeader = ['出入记录', '', '', '', '', '', '', '', '']; //表头
              const filterVal = ['plotName', 'buildingName', 'positionName', 'openStatus', 'openType', 'recordType', 'roleName', 'roleType', 'triggeringTime'];
              let Accesslist = [{
                number: '序号',
                plotName: '社区名称',
                buildingName: '楼座',
                positionName: '位置',
                openStatus: '是否开门',
                openType: '记录类型',
                recordType: '出入类型',
                roleName: '姓名',
                roleType: '角色',
                triggeringTime: '出入时间'
              }];
              for(let i = 0; i < list.length; i ++){
                let {
                  plotName,
                  buildingName,
                  positionName,
                  openStatus,
                  openType,
                  recordType,
                  roleName,
                  roleType,
                  triggeringTime
                } = list[i];
                Accesslist.push({
                  number: i+1,
                  plotName,
                  buildingName,
                  positionName,
                  openStatus:  openType === 2 ? this.$options.filters.statusName(openStatus, "OpenStatus") : "",
                  openType: this.$options.filters.statusName(openType, "OpenType"),
                  recordType: this.$options.filters.statusName(recordType, "RecordType"),
                  roleName,
                  roleType: this.$options.filters.statusName(roleType, "RelationType"),
                  triggeringTime: this.$options.filters.formatTime(triggeringTime)
                })
              }
               const merges = ["A1:I1", "A2:I2"]
              const data = this.formatJson(filterVal, Accesslist)
              data.map(item => {
                  // console.log(item)
                item.map((i, index) => {
                  if (!i) {
                    item[index] = ''
                  }
                })
              })
              excel.export_json_to_excel_access({
                title: title,
                header: tHeader,
                data,
                merges,
                filename: '出入记录',
                autoWidth: true,
                bookType: 'xlsx',
              })
              this.butLoading = false;
            })
          }
        }
      })      
    },
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
      getRecordList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            if (data.list) {
              console.log(data.list);
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
      this.$refs["dataTimePicker"].handleClear();
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
      this.searchForm.roleName = null;
      this.searchForm.openStatus = null;
      this.searchForm.recordType = null;
      this.searchForm.realName = null;
      this.searchForm.phone = null;
      this.searchForm.doorName = null;
      this.searchForm.openType = null; //记录类型
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
      let { id } = this.list[index];
      this.edit.id = id;
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
      let { recordNumber } = this.list[index];
      this.detail.recordNumber = recordNumber;
      this.detail.isShow = true;
    },
    detailClose(isRefresh = false) {
      this.detail.isShow = false;
      if (isRefresh) {
        this.getList();
      }
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
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.searchForm.provinceCode = value[0];
      this.searchForm.cityCode = value[1];
      this.searchForm.areaCode = value[2];
      this.searchForm.streetCode = value[3];
      this.searchForm.plotNumber = value[4];
      this.searchForm.buildingNumber = value[5];
      this.searchForm.domDoorNumber = value[6];
    },
    /**
     * 楼座组件改变
     */
    buildingCascaderChange(value) {
      this.searchForm.buildingNumber = value[0];
      this.searchForm.domDoorNumber = value[1];
    },
    /**
     * 选择时间后
     */
    timeChange() {
      if (this.searchForm.dateTime[0]) {
        this.searchForm.startTime = new Date(this.searchForm.dateTime[0])
          .getTime()
          .toString()
          .substr(0, 10);
        this.searchForm.endTime = new Date(this.searchForm.dateTime[1])
          .getTime()
          .toString()
          .substr(0, 10);
      }
    }
  }
};
</script>



