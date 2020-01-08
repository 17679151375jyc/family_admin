<!--权限菜单管理-->
<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper"></div>
      <div class="handle-wrapper">
        <Button v-show="$options.filters.auth(['common.companyM.add'])" icon="md-add" type="info" @click="showAdd">添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 权限树状表-start -->
    <tree-table
      expand-key="name"
      border
      stripe
      heightlight-row
      :expand-type="false"
      :selectable="false"
      :columns="tabCol"
      :data="tree"
    >
      <template slot="handle" slot-scope="scope">
        <Button
          v-show="$options.filters.auth(['common.companyM.edit'])"
          type="success"
          size="small"
          @click="showDetail(scope.row.id)"
          style="margin-right: 5px;"
        >详情</Button>
        <Button
          v-show="$options.filters.auth(['common.companyM.edit'])"
          type="primary"
          size="small"
          @click="showEdit(scope.row.id)"
          style="margin-right: 5px;"
        >编辑</Button>
        <Button
          v-show="$options.filters.auth(['common.companyM.add'])"
          type="info"
          size="small"
          @click="showAdd(scope.row)"
          style="margin-right: 5px;"
        >添加下级</Button>
        <Poptip
          v-show="$options.filters.auth(['common.companyM.del'])"
          confirm
          :transfer="true"
          title="你确定要删除吗?"
          @on-ok="delItem(scope.row)"
        >
          <Button type="error" size="small">删除</Button>
        </Poptip>
      </template>
    </tree-table>
    <!-- 权限树状表-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow" :parentId="add.parentId" :code="add.code"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->

    <!-- 详情内容弹窗-start -->
    <detail @handleClose="detailClose" :isShow="detail.isShow" :id="detail.id"></detail>
    <!-- 详情内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import { delCompany, getCompanyList } from "@/api/dataManage";
export default {
  components: {
    add,
    detail,
    edit
  },
  data() {
    return {
      list: [],
      add: {
        parentId: null,
        code: null,
        isShow: false
      },
      detail: {
        id: null,
        isShow: false
      },
      edit: {
        id: null,
        isShow: false
      },
      tabIsLoading: false,
      tree: []
    };
  },
  computed: {
    tabCol: function() {
      let arr = [
        {
          title: "公司名称",
          key: "name",
          minWidth: 200,
          align: "left"
        },
        {
            title: '公司类型',
            key: "companyTypeName",
            width: 100
        },
        {
          title: "省市区街道",
          key: "PCAS",
          width: 240
        },
        {
          title: "联系人",
          key: "linkman",
          width: 100
        },
        {
          title: "联系电话",
          key: "linkphone",
          width: 150
        },
        {
          title: "排序",
          key: "rank",
          width: 100,
          align: "center"
        },
        {
          title: "操作",
          key: "handle",
          width: 230,
          type: "template",
          template: "handle",
          align: "center"
        }
      ];
      return arr;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 详情
    showDetail(id){
      this.detail.id = id;
      this.detail.isShow = true;
    },
    detailClose(){
      this.detail.isShow = false;
    },
    /**
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      getCompanyList({
        page: 1,
        pageSize: 999
      })
        .then(({ data, data: { list, total }, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            list.sort((a, b) => {
              // 对数据进行排序
              if (a.rank > b.rank) {
                return -1;
              }
              if (a.rank < b.rank) {
                return 1;
              }
              return 0;
            });
            for (let i = 0; i < list.length; i++) {
              let { provinceName, cityName, areaName, streetName, companyType } = list[i];
              list[i].PCAS = provinceName + cityName + areaName + streetName;
              list[i].companyTypeName = this.$options.filters.statusName(companyType, 'CompanyType')
            }
            this.list = list;
            this.tree = this.traverseToTree(list);
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
    delItem(row) {
      let { children, id } = row;
      if (children) {
        this.$Message.error("请先删除子公司");
      } else {
        delCompany({
          id: id
        }).then(({ errorCode }) => {
          if (errorCode === 0) {
            this.$Message.success("删除成功");
            this.getList();
          }
        });
      }
      // 删除
    },
    /**
     * @method showAdd 显示添加弹窗
     */
    showAdd(data) {
      if (data) {
        let { id, code } = data;
        this.add.parentId = id;
        this.add.code = code;
      } else {
        this.add.parentId = null;
        this.add.parentIds = null;
      }
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
     * @param {Number} id 要编辑的数据的对应id
     */
    showEdit(id) {
      this.edit.id = id;
      this.edit.isShow = true;
    },
    /**
     * @method editClose 编辑的弹窗关闭时触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    editClose(isRefresh = false) {
      this.edit.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * @method editClose 编辑的弹窗关闭时触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    editClose(isRefresh = false) {
      this.edit.isShow = false;
      if (isRefresh) {
        this.getList();
      }
    },
    /**
     * @method traverseToTree 把数据转化为树状结构
     * @param {Array} data 权限数据列表
     */
    traverseToTree(data) {
      data.forEach(item => {
        delete item.children;
      });
      console.log(data)
      var map = {};
      data.forEach(item => {
        console.log(item)
        map[item.id] = item;
      });
      var val = [];
      data.forEach(item => {
        var parent = map[item.parentId];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          val.push(item);
        }
      });
      console.log(val)
      return val;
    }
  }
};
</script>



