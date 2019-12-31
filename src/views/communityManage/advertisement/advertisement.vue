<!--权限菜单管理-->
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
        >
          <FormItem label="楼座门号">
            <address-cascader
              ref="addressCascader"
              @onChange="addressCascaderChange"
              :showAllText="true"
              :showAllTextLevel="5"
              :showLevel="5"
              style="width: 250px"
            ></address-cascader>
          </FormItem>
          <FormItem prop="input.type" label="广告分类">
            <Select v-model="searchForm.input.type" style="width:120px;">
              <Option
                v-for="item in AdvertisementType"
                :key="item.code"
                :value="item.code"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="input.effective" label="是否有效">
            <Select v-model.trim="searchForm.input.effective" style="width:120px;">
              <Option :value="0">有效</Option>
              <Option :value="1">无效</Option>
            </Select>
          </FormItem>
          <FormItem prop="input.globleStatus" label="是否全局">
            <Select v-model.trim="searchForm.input.globleStatus" style="width:120px;">
              <Option :value="0">全局</Option>
              <Option :value="1">非全局</Option>
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
          v-show="$options.filters.auth(['communityM.advertisingM.add'])"
          icon="md-add"
          type="info"
          @click="showAdd"
        >添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->
    <div class="win-table-wrapper" id="win-table-wrapper">
      <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="list"></Table>
    </div>
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
    <!-- 权限树状表-end -->

    <!-- 详情-start -->
    <detail v-model="detail.isShow" :id="detail.id"></detail>
    <!-- 详情-end -->
    <!-- 添加内容弹窗-start -->
    <add v-model="add.isShow" :parentId="add.parentId" :code="add.code"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit v-model="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import detail from "./detail";
import {
  getAdvertisementList,
  DelAdvertisementList
} from "@/api/communityManage";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    add,
    edit,
    detail,
    addressCascader
  },
  data() {
    return {
      arrdessPolt: [],
      AdvertisementType: this.$options.filters.statusList("AdvertisementType"),
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      searchForm: {
        input: {
          type: null,
          provinceCode: null,
          cityCode: null,
          areaCode: null,
          streetCode: null,
          plotNumber: null,
          effective: null,
          globleStatus: null
        }
      },
      companyTypeList: this.$config.dataManage.company.type,
      list: [],
      add: {
        parentId: null,
        code: null,
        isShow: false
      },
      edit: {
        id: null,
        isShow: false
      },
      detail: {
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
          type: "index",
          title: "序号",
          width: 64,
          align: "center",
          indexMethod: row => {
            return row._index + 1 + (this.page.current - 1) * this.page.size;
          }
        },
        {
          title: "广告",
          key: "url",
          width: 88,
          align: "center",
          render: (h, { row: { url, type } }) => {
            let html = [];
            if (type === 0) {
              // 视频
              html = h("i", {
                class: {
                  iconfont: true,
                  iconiconfonttubiao_shipinzhibo: true
                },
                style: {
                  "font-size": "40px",
                  color: "#3388ff"
                }
              });
            } else if (type === 1) {
              // 图片
              html = h("img", {
                attrs: {
                  src: url
                }
              });
            }
            return h(
              "div",
              {
                class: {
                  "flex-div": true
                }
              },
              [html]
            );
          }
        },
        // {
        //   title: "小区ID",
        //   key: "plotNumber",
        //   width: 250
        // },
        {
          title: "广告类型",
          width: 100,
          render: (h, { row: { type } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-primary": type === 0,
                  "cell-success": type === 1
                }
              },
              this.$options.filters.statusName(type, "AdvertisementType")
            );
          }
        },
        {
          title: "小区名称",
          key: "plotNames",
          width: 300,
          render: (
            h,
            {
              row: {
                plotNumber,
                provinceName,
                cityName,
                areaName,
                streetName,
                plotName
              }
            }
          ) => {
            return h(
              "div",
              {
                class: {
                  "cell-primary": !plotNumber
                }
              },
              plotNumber
                ? provinceName +
                    cityName +
                    areaName +
                    streetName +
                    "-" +
                    plotName
                : "全部小区"
            );
          }
        },
        {
          title: "广告是否有效",
          key: "effective",
          minWidth: 80,
          render: (h, { row: { effective } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-error": effective,
                  "cell-success": !effective
                }
              },
              effective ? "无效" : "有效"
            );
          }
        },
        {
          title: "轮播时间",
          key: "time",
          minWidth: 120,
          render: (h, { row: { time } }) => {
            return h("div", time ? time + "秒" : "");
          }
        },
        {
          title: "是否全局",
          minWidth: 120,
          render: (h, { row: { globleStatus } }) => {
            return h(
              "div",
              {
                class: {
                  "cell-error": globleStatus,
                  "cell-success": !globleStatus
                }
              },
              globleStatus ? "否" : "是"
            );
          }
        },
        {
          title: "有效时间",
          minWidth: 150,
          render: (h, { row: { effectiveTime } }) => {
            let html = [
              h(
                "div",
                this.$moment(effectiveTime * 1000).format("YYYY-MM-DD HH:mm:ss")
              )
            ];
            if (effectiveTime * 1000 < new Date().getTime()) {
              html.push(
                h(
                  "div",
                  {},
                  "已失效" + this.$moment(effectiveTime * 1000).toNow(true)
                )
              );
            }
            return h(
              "div",
              {
                class: {
                  "cell-error": effectiveTime * 1000 < new Date().getTime()
                }
              },
              html
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let btnGroup = [];
            if (this.$options.filters.auth(["communityM.advertisingM.edit"])) {
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
            if (this.$options.filters.auth(["communityM.advertisingM.edit"])) {
              let btn = h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showEdit(this.list[params.index].id);
                    }
                  }
                },
                "编辑"
              );
              btnGroup.push(btn);
            }

            if (this.$options.filters.auth(["communityM.advertisingM.del"])) {
              let btn = h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.delItem(this.list[params.index].id);
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
            return h("div", btnGroup);
          }
        }
      ];
      return arr;
    },
    tabData: function() {
      let tabData = [];
      console.log(this.list);
      for (let i = 0; i < this.list.length; i++) {
        let {
          url,
          plotNumber, //小区
          effective, //广告是否有效
          time, //轮播时间
          globleStatus, //是否全局
          provinceName,
          cityName,
          areaName,
          streetName,
          plotName,
          effectiveTime
        } = this.list[i];
        tabData.push({
          plotNumber: plotNumber ? plotNumber : "全部小区",
          effective,
          time: time ? time + "秒" : null,
          globleStatus,
          plotNames: plotNumber
            ? provinceName + cityName + areaName + streetName + "-" + plotName
            : "全部小区",
          effectiveTime
        });
      }
      return tabData;
    }
  },
  watch: {
    "add.isShow"(val) {
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
      getAdvertisementList(data)
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
    showDetail(index) {
      let { id } = this.list[index];
      this.detail.id = id;
      this.detail.isShow = true;
    },
    detailClose() {
      this.detail.isShow = false;
      this.getList();
    },
    delItem(index) {
      // 删除
      DelAdvertisementList({
        id: index
      }).then(({ errorCode }) => {
        if (errorCode === 0) {
          this.$Message.success("删除成功");
          this.getList();
        }
      });
    },
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getList();
    },
    pageChange(event) {
      this.page.current = event;
      this.getList();
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
     * @method showEdit 显示编辑弹窗
     * @param {Number} id 要编辑的数据的对应id
     */
    showEdit(id) {
      this.edit.id = id;
      this.edit.isShow = true;
    },
    /**
     * @method traverseToTree 把数据转化为树状结构
     * @param {Array} data 权限数据列表
     */
    traverseToTree(data) {
      data.forEach(item => {
        delete item.children;
      });
      console.log(data);
      var map = {};
      data.forEach(item => {
        console.log(item);
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
      console.log(val);
      return val;
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
      this.$refs["addressCascader"].resetData();
      this.searchForm.daterange = null;
      this.searchForm.startTime = null;
      this.searchForm.endTime = null;
      this.page.current = 1;
      this.getList();
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.searchForm.input.provinceCode = value[0];
      this.searchForm.input.cityCode = value[1];
      this.searchForm.input.areaCode = value[2];
      this.searchForm.input.streetCode = value[3];
      this.searchForm.input.plotNumber = value[4];
    }
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


