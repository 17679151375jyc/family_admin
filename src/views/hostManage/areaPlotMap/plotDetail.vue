<template>
  <div>
    <Modal v-model="visible" title="小区详情" width="900" footer-hide>
      <div class="tab-wrapper">
        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont icongongsi"></i>
              <span>小区名称</span>
            </div>
            <div class="text">{{info.plotName}}</div>
          </div>

          <div class="item">
            <div class="label">
              <i class="iconfont iconwenhao"></i>
              <span>用于社区</span>
            </div>
            <div class="text">{{info.communityCanUse ? '是' : '否'}}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconquyuditu"></i>
              <span>省市区</span>
            </div>
            <div
              class="text"
            >{{`${info.provinceName}${info.cityName}${info.areaName}${info.streetName}`}}</div>
          </div>

          <div class="item">
            <div class="label">
              <i class="iconfont icondizhi1"></i>
              <span>详细地址</span>
            </div>
            <div class="text">{{info.address}}</div>
          </div>
        </div>
      </div>

      <Tabs style="margin-top:30px;">
        <TabPane label="物管人员" icon="null iconfont iconjianzhuwu">
          <fs-user-table :plotNumber="plotNumber" :roleType="2"></fs-user-table>
        </TabPane>
        <TabPane label="安保人员" icon="null iconfont icongongandunpai">
          <fs-user-table :plotNumber="plotNumber" :roleType="0"></fs-user-table>
        </TabPane>
        <TabPane label="维保人员" icon="null iconfont iconweixiuguanli">
          <fs-user-table :plotNumber="plotNumber" :roleType="1"></fs-user-table>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>
<script>
import { getPlotDetail } from "@/api/dataManage";
import { getServerUserList } from "@/api/userManage";
import FsUserTable from "./fsUserTable";
export default {
  components: { FsUserTable },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    plotNumber: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      tabIsLoading: false,
      serverUserList: [], // 物管人员列表
      info: {},
      page: {
        // 分页相关参数
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.getDetail();
        this.getServerUserList();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    tabCol: function() {
      return [
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
          title: "人脸图片",
          key: "picFace",
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
                    src: params.row.picFace
                  }
                })
              ]
            );
          }
        },
        {
          title: "姓名",
          key: "realName",
          width: 120
        },
        {
          title: "性别",
          key: "gender",
          width: 100,
          render: (h, params) => {
            return h("div", params.row.gender ? "男" : "女");
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          render: (h, params) => {
            return h(
              "div",
              this.$moment(params.row.createTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.serverUserList.length; i++) {
        tabData.push(this.serverUserList[i]);
      }
      return tabData;
    }
  },
  methods: {
    getDetail() {
      getPlotDetail({
        number: this.plotNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
        }
      });
    },
    getServerUserList() {
      this.tabIsLoading = true;
      let { size, current } = this.page;
      let data = {
        plotNumber: this.plotNumber,
        roleType: 2, // 物管角色
        pageSize: size,
        page: current
      };
      getServerUserList(data)
        .then(({ data, errorCode }) => {
          this.tabIsLoading = false;
          if (errorCode === 0) {
            this.serverUserList = data.list;
            this.page.total = data.total;
          }
        })
        .catch(() => {
          this.tabIsLoading = false;
        });
    },
    pageSizeChange(event) {
      this.page.current = 1;
      this.page.size = event;
      this.getServerUserList();
    },
    pageChange(event) {
      this.page.current = event;
      this.getServerUserList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.info {
  margin-top: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-weight: bold;
  color: #38f;
}

.photo-modal-wrap {
  .ivu-modal-body {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}

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