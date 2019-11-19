<template>
  <Modal v-model="visible" :title="`${date} ${user.realName} - 巡更详情`" footer-hide width="800">
    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icongongandunpai"></i>
            <span>负责区域</span>
          </div>
          <div class="text">{{areasName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconlingdaitie3"></i>
            <span>是否队长</span>
          </div>
          <div class="text">{{captain ?'队长':'普通保安'}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icongeren"></i>
            <span>巡更保安</span>
          </div>
          <div class="text">{{user.realName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>保安电话</span>
          </div>
          <div class="text">{{user.phone}}</div>
        </div>
      </div>

      <div class="row" v-if="user.captainName || user.captainPhone">
        <div class="item">
          <div class="label">
            <i class="iconfont icongeren"></i>
            <span>所属队长</span>
          </div>
          <div class="text">{{user.captainName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>队长电话</span>
          </div>
          <div class="text">{{user.captainPhone}}</div>
        </div>
      </div>
    </div>
    <div class="info">
      <span>今天任务</span>
    </div>
    <Table border stripe highlight-row :columns="tabCol" :data="tabData"></Table>

    <Table border stripe highlight-row :columns="logCol" :data="logData" style="margin-top: 40px;"></Table>
  </Modal>
</template>
<script>
import { getTaskMemberDetail, getTaskLog } from "@/api/patrolManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    fsUserNumber: {
      type: String,
      default: ""
    },
    captain: {
      type: Number,
      default: 0
    },
    checkNum: {
      type: Number,
      default: 0
    },
    date: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      areas: [], // 巡查区域
      days: [], // 巡查信息
      user: {}, // 用户信息
      logList: [], // 日志信息
      page: {
        // 分页相关参数
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      }
    };
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
          title: "值班时间",
          key: "shiftTime"
        },
        {
          title: "已巡更户数",
          key: "donePoint"
        },
        {
          title: "未巡更户数",
          key: "unDonePoint"
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      for (let i = 0; i < this.days.length; i++) {
        let { shiftTime, taskPoints } = this.days[i];
        let donePoint = 0; // 已巡查的点
        let unDonePoint = 0; // 未巡查的点
        for (let j = 0; j < taskPoints.length; j++) {
          if (taskPoints[j].checkNum) {
            donePoint = donePoint + 1;
          } else {
            unDonePoint = unDonePoint + 1;
          }
        }
        tabData.push({
          shiftTime,
          donePoint,
          unDonePoint
        });
      }
      return tabData;
    },
    areasName: function() {
      let areas = [];
      for (let i = 0; i < this.areas.length; i++) {
        areas.push(this.areas[i].plotName);
      }
      return areas.join("、");
    },
    logCol: function() {
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
          title: "区域",
          key: "fsAreaName"
        },
        {
          title: "巡更时间",
          key: "createTime"
        },
        {
          title: "操作"
        }
      ];
    },
    logData: function() {
      let logData = [];
      for (let i = 0; i < this.logList.length; i++) {
        let { createTime, fsAreaName, photo } = this.logList[i];
        logData.push({
          createTime: this.$options.filters.formatTime(createTime),
          fsAreaName,
          photo
        });
      }
      return logData;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.areas = [];
        this.days = [];
        this.user = {};
        this.logList = [];
        this.getDetail();
        this.getTaskLog();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getDetail() {
      getTaskMemberDetail({
        day: this.date,
        fsUserNumber: this.fsUserNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.user = data.user;
          this.days = data.days;
          this.areas = data.areas;
        }
      });
    },
    getTaskLog() {
      getTaskLog({
        page: 1,
        pageSize: 999,
        input: {
          startTime: this.date,
          endTime: this.date + ' 23:59:59',
          fsUserNumber: this.fsUserNumber
        }
      }).then(({ data, errorCode }) => {
        this.logList = data.list;
      });
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
</style>