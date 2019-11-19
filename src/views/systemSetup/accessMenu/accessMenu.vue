<!--权限菜单管理-->
<template>
  <div class="win-wrapper">
    <!-- 顶部操作内容-start -->
    <div class="handle-container">
      <div class="search-wrapper"></div>
      <div class="handle-wrapper">
        <Button v-show="$options.filters.auth(['systemM.accessM.add'])" icon="md-add" type="info" @click="showAdd">添加</Button>
      </div>
    </div>
    <!-- 顶部操作内容-end -->

    <!-- 树状结构-start -->
    <div class="tree-title">
      <div class="title">权限名称</div>
      <div class="code">code名称</div>
      <div class="url">对应Url</div>
      <div class="rank">排序</div>
      <div class="handleBtns">操作</div>
    </div>
    <Tree :data="tree" :render="renderContent"></Tree>
    <!-- 树状结构-end -->

    <!-- 添加内容弹窗-start -->
    <add @handleClose="addClose" :isShow="add.isShow" :parentId="add.parentId" :code="add.code"></add>
    <!-- 添加内容弹窗-end -->

    <!-- 编辑内容弹窗-start -->
    <edit @handleClose="editClose" :isShow="edit.isShow" :id="edit.id"></edit>
    <!-- 编辑内容弹窗-end -->
  </div>
</template>
<script>
import add from "./add";
import edit from "./edit";
import { getAccessMenuList, delAccess } from "@/api/systemSetup";
import { mapState } from "vuex";
import { hasOneOf } from "@/libs/tools";
export default {
  components: {
    add,
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
      edit: {
        id: null,
        isShow: false
      },
      tabIsLoading: false,
      tree: []
    };
  },
  computed: {
    ...mapState({
      jurisdiction: state => state.user.jurisdiction
    }),
    tabCol: function() {
      let arr = [
        {
          title: "权限名称",
          key: "name",
          width: 350,
          align: "left"
        },
        {
          title: "code",
          key: "code",
          width: 200
        },
        {
          title: "节点地址",
          key: "url",
          minWidth: 200
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
          width: 180,
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
    /**
     * @method getList 获取当前的数据列表
     */
    getList(searchData = this.searchForm) {
      this.tabIsLoading = true;
      getAccessMenuList()
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
            this.list = list;
            for (let i = 0; i < list.length; i++) {
              list[i].title = list[i].name;
            //   list[i].expand = true
            }
            this.tree = this.traverseToTree(list);
          }
        })
        .catch(err => {
          this.tabIsLoading = false;
        });
    },
    /**
     * @method 渲染树状数据
     */
    renderContent(h, { root, node, data }) {
      
      return h(
        "span",
        {
          style: {
            display: "flex",
            width: "100%",
            flex: "1"
          }
        },
        [
          h(
            "span",
            {
              class: {
                "span-flex": true
              }
            },
            [
              h("Icon", {
                props: {
                  type: "ios-paper-outline"
                },
                style: {
                  margin: "0 4px 0 4px"
                }
              }),
              h(
                "span",
                { style: { flex: "1", "text-align": "left" } },
                data.title
              ),
              h(
                "span",
                {
                  style: {
                    flex: "0 0 300px",
                    "border-left": "1px solid #e8eaec",
                    "border-right": "1px solid #e8eaec",
                    'text-align': 'left',
                    'padding': '0 4px'
                  }
                },
                data.code
              ),
              h(
                "span",
                {
                  style: {
                    flex: "0 0 300px",
                    "border-right": "1px solid #e8eaec",
                    'text-align': 'left',
                    'padding': '0 4px'
                  }
                },
                data.url
              ),
              h(
                "span",
                {
                  style: {
                    flex: "0 0 80px",
                    "border-right": "1px solid #e8eaec"
                  }
                },
                data.rank
              )
            ]
          ),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right"
              }
            },
            [
              this.$options.filters.auth(['systemM.accessM.edit']) ? h(
                "Button",
                {
                  props: Object.assign({}, this.buttonProps, {
                    type: "primary",
                    size: "small"
                  }),
                  style: {
                    margin: "0 4px 0 4px"
                  },
                  on: {
                    click: () => {
                      console.log(data);
                      this.showEdit(data.id);
                    }
                  }
                },
                "编辑"
              ) : '',
              this.$options.filters.auth(['systemM.accessM.add']) ? h(
                "Button",
                {
                  props: Object.assign({}, this.buttonProps, {
                    type: "info",
                    size: "small"
                  }),
                  on: {
                    click: () => {
                      this.showAdd(data);
                      // this.remove(root, node, data);
                    }
                  }
                },
                "添加下级"
              ) :'',
              this.$options.filters.auth(['systemM.accessM.del']) ? h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      console.log("点击了删除", data);
                      this.delItem(data);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: Object.assign({}, this.buttonProps, {
                        type: "error",
                        size: "small"
                      }),
                      style: {
                        margin: "0 4px 0 4px"
                      }
                      //   on: {
                      //     click: () => {
                      //       this.sho(data);
                      //       // this.remove(root, node, data);
                      //     }
                      //   }
                    },
                    "删除"
                  )
                ]
              ) :''
            ]
          )
        ]
      );
    },
    /**
     * @method delItem 删除该项数据
     * @param {Number} index 要删除的内容在列表中的序号
     */
    delItem(row) {
      let { children, id } = row;
      if (children) {
        this.$Message.error("请先删除子节点");
      } else {
        delAccess({
          jurisdictionId: id
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
        console.log("有父级", data);
        let { id, code } = data;
        this.add.parentId = id;
        this.add.code = code;
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
     * @method traverseToTree 把数据转化为树状结构
     * @param {Array} data 权限数据列表
     */
    traverseToTree(data) {
      data.forEach(item => {
        delete item.children;
      });
      var map = {};
      data.forEach(item => {
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
      return val;
    }
  }
};
</script>
<style lang="stylus" scoped>
.tree-title {
  width: 100%;
  display: flex;
  height: 40px;
  line-height: 38px;
  background: #f8f8f9;
  border: 1px solid #e8eaec;
  box-sizing: border-box;
  color: #515a6e;
  font-weight: bold;

  div {
    border-right: 1px solid #e8eaec;
  }

  div:nth-last-child(1) {
    border-right: none;
  }

  .title {
    flex: 1;
  }

  .code {
    flex: 0 0 300px;
  }

  .url {
    flex: 0 0 300px;
  }

  .rank {
    flex: 0 0 80px;
  }

  .handleBtns {
    flex: 0 0 160px;
  }
}

>>>.span-flex {
  display: flex;
  align-items: center;
  flex: 1;
}
>>>.ivu-tree span{
    word-wrap: break-word;
    // overflow: hidden;
    white-space: normal;
}
>>>.ivu-tree ul li {
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 100%;
  background: #fbfbfb;
  border: 1px solid #e8eaec;
  padding: 5px 0;

  &:hover {
    border: 1px solid #b8b8b8;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2)
  }
}

>>>.ivu-tree li ul {
  flex: 0 0 100%;
}

>>>.ivu-tree-arrow {
  display: flex;
  align-items: center;

  i {
    position: relative;



    &:after {
      content: '';
      display: block;
      left: 0px;
      right: -400px;
      top: -10px;
      bottom: -10px;
      position: absolute;
    }
  }
}
>>>.ivu-icon-ios-arrow-forward{
    &:after{
    }
}
>>>.ivu-tree-arrow-open i:after{
    transform: rotate(-90deg);
    transform-origin: 7px;
}
</style>


