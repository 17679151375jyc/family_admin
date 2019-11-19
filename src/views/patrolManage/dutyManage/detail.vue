<template>
  <Modal
    title="详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="90%"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>

    <!-- 右上角关闭按钮-start -->
    <Table border stripe highlight-row :columns="tabCol" :data="tabData"></Table>
  </Modal>
</template>
<script>
import { getDutyDetail } from "@/api/patrolManage";
export default {
  props: {
    id: {
      type: String,
      default: null
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      info: {
        allDays: [], // 所有日期
        areas: [], // 巡更区域
        dutyDays: [], //
        dutyMembers: [],
        dutyShifts: []
      }
    };
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  computed: {
    tabCol: function() {
      let tabCol = [
        {
          title: "值班日期",
          key: "date",
          width: 100
        },
        {
            type: 'html',
          title: "区域",
          key: "areas"
        }
      ];
      for (let i = 0; i< this.info.dutyShifts.length; i++) {
          let {name, time, id} = this.info.dutyShifts[i]
          tabCol.push({
              title: `${name}(${time})`,
              key: id
          })
      }
    //   tabCol.push({
    //       title: "休息日",
    //       key: "restDays"
    //     })
      return tabCol
    },
    tabData: function() {
      let tabData = [];

      //列出巡更的区域
      let areasText = [];
      for (let i = 0; i < this.info.areas.length; i++) {
        areasText.push(this.info.areas[i].plotName);
      }

      // 列出所有班次
      for (let i = 0; i < this.info.dutyShifts.length; i++) {}

      for (let i = 0; i < this.info.allDays.length; i++) {
        let obj = {
          date: this.info.allDays[i],
          areas: areasText.join("、")
        };
        for (let j = 0; j < this.info.dutyShifts.length; j++) {
          let dutyPeople = []; // 当前班的值班人员
          for (let k = 0; k < this.info.dutyDays.length; k++) {
            if (
              this.info.dutyDays[k].shiftId === this.info.dutyShifts[j].id &&
              this.info.allDays[i] ==
                this.$moment(this.info.dutyDays[k].dutyTime * 1000).format(
                  "YYYY-MM-DD"
                )
            ) {
              dutyPeople.push(this.info.dutyDays[k].fsUserName);
            }
          }
          obj[this.info.dutyShifts[j].id] = dutyPeople.join("、");
        }
        tabData.push(obj);
      }
      console.log("tabData", tabData);
      return tabData;
    }
  },
  methods: {
    /**
     * 获取用户详情
     */
    getDetail() {
      // 获取账号详情
      getDutyDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
.divider {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 30px 0;
}

>>>.ivu-tree-children>li {
  margin-top: 0;
}
</style>


