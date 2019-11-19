<template>
  <div>
    <Modal v-model="visible" :title="`${date} ${areaName} - 巡查记录`" width="800" footer-hide>
      <div class="tab-wrapper">
        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont icongongandunpai"></i>
              <span>区域名称</span>
            </div>
            <div class="text">{{areaName}}</div>
          </div>

          <div class="item">
            <div class="label">
              <i class="iconfont iconshouji"></i>
              <span>联系手机</span>
            </div>
            <div class="text">{{userPhone}}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconlishixiao"></i>
              <span>到期时间</span>
            </div>
            <div class="text">{{effectiveTime|formatTime('Y-M-D')}}</div>
          </div>

          <div class="item">
            <div class="label">
              <i class="iconfont iconleixing-guibingjiedian"></i>
              <span>用户类型</span>
            </div>
            <div class="text">{{type | statusName('AreaType')}}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont icondizhi1"></i>
              <span>用户地址</span>
            </div>
            <div class="text">{{address}}</div>
          </div>

          <!-- <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>地理位置</span>
          </div>
          <div class="text">蓬江区环市二路10号1幢</div>
          </div>-->
        </div>
      </div>

      <div class="info">今日被巡次数：{{checkNum}}次</div>

      <Table border stripe highlight-row :columns="tabCol" :data="tabData"></Table>
    </Modal>
    <Modal
      v-model="photoModal.isShow"
      title="抓拍图片"
      footer-hide
      width="800"
      fullscreen
      class="photo-modal"
      　class-name="photo-modal-wrap"
    >
      <img :src="photoModal.url" />
    </Modal>
  </div>
</template>
<script>
import { getTaskLog } from "@/api/patrolManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: ""
    },
    fsAreaNumber: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    areaName: {
      type: String,
      default: ""
    },
    checkNum: {
      type: Number,
      default: 0
    },
    effectiveTime: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    },
    userPhone: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      logList: [],
      page: {
        // 分页相关参数
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      photoModal: {
        isShow: false,
        url: ""
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.logList = [];
        this.getTaskLog();
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
          title: "所属区域",
          key: "fsAreaName"
        },
        {
          title: "巡更时间",
          key: "createTime"
        },
        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          flxed: "right",
          render: (h, params) => {
            let btnGroup = [];
            let photo = params.row.photo;
            if (photo) {
              let viewBtn = h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.showPhoto(photo);
                    }
                  }
                },
                "查看抓图"
              );
              btnGroup.push(viewBtn);
            } else {
              let tag = h(
                "Tag",
                {
                  props: {
                    color: "default"
                  }
                },
                "暂无抓图"
              );
              btnGroup.push(tag);
            }
            return h("div", btnGroup);
          }
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.logList.length; i++) {
        let { createTime, dutyDayId, fsAreaName, photo } = this.logList[i];
        tabData.push({
          createTime: this.$options.filters.formatTime(createTime),
          fsAreaName,
          photo
        });
      }
      return tabData;
    }
  },
  methods: {
    getTaskLog() {
      getTaskLog({
        page: 1,
        pageSize: 999,
        input: {
          startTime: this.date,
          endTime: this.date + " 23:59:59",
          fsAreaNumber: this.fsAreaNumber
        }
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.logList = data.list;
        }
      });
    },
    showPhoto(url) {
      console.log("url", JSON.parse(url));
      this.photoModal.isShow = true;
      this.photoModal.url = JSON.parse(url)[0];
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
</style>