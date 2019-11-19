<template>
  <Modal
    title="详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="800"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconrenwu"></i>
            <span>任务名称</span>
          </div>
          <div class="text">{{ info.taskName }}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconmiaoshu"></i>
            <span>任务描述</span>
          </div>
          <div class="text">{{ info.taskText }}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>开始时间</span>
          </div>
          <div class="text">{{ info.startDate }}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>创建时间</span>
          </div>
          <div class="text">{{info.createTime}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>修改时间</span>
          </div>
          <div class="text">{{info.updateTime}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>任务关联类型</span>
          </div>
          <div class="text">{{info.taskType}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyunhang"></i>
            <span>运行的CLASS</span>
          </div>
          <div class="text">{{info.runJobClss}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>运行状态</span>
          </div>
          <div class="text">{{info.taskStatus}}</div>
        </div>
      </div>
    </div>
    <!-- <Modal title="目标地点" v-model.trim="mapIsShow" footer-hide :mask-closable="false" width="800">
      <div id="map" style="width: 100%;height: 500px;"></div>
    </Modal> -->
  </Modal>
</template>
<script>
import { getTaskDetail } from "@/api/systemSetup";
export default {
  props: {
    id: {
      type: String,
      default: ''
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
      mapIsShow: false,
      taskStatus: {
        1: '运行'
      },
      tastsTypeList: {
        0: '处警消息处理',
        1: '维保消息处理',
        2: '报警智能呼叫',
        3: '报警短信通知'
      },
      info: {
        taskName:null, // 呼叫类型
        taskText:null,  //  呼叫时间
        startDate:null,// 机器名称
        createTime:null, // 结果
        updateTime:null, // 手机号
        taskType: null, //任务类型
        runJobClss: null,//运行的CLASS
        taskStatus: null, //运行状态
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.getDetail();
    }
  },
  computed: {},
  methods: {
    getDetail() {
      // 获取任务详情
      getTaskDetail({
        id: this.id
      }).then(({data, errorCode}) => {
        if(errorCode ===0){
          console.log(data)
          let {
            name,
            description, 
            startDate,
            updateTime,
            createTime,
            type,
            runJobClass,
            state
          } = data;
          this.info.taskName = name ? name:'无';
          this.info.taskText =  description?description:'无';
          this.info.startDate =  startDate?this.$options.filters.formatTime(startDate):'无';
          this.info.createTime =  createTime?this.$options.filters.formatTime(createTime):'无';
          this.info.updateTime =  updateTime?this.$options.filters.formatTime(updateTime):'无';
          // this.info.taskType =  type?this.tastsTypeList[type]:'无';
          this.info.taskType =  type ? type:'无';
          this.info.runJobClss =  runJobClass?runJobClass:'无';
          this.info.taskStatus =  state?this.taskStatus[state]:'无';
        }
      })
    },
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
.tab-wrapper .row .item .label{
    flex: 0 0 130px;
}
>>>.amap-icon img {
  width: 25px;
  height: 34px;
}

>>>.amap-marker-label {
  border: 0;
  background-color: transparent;
}

>>>.info {
  position: relative;
  top: 10px;
  right: -55px;
  min-width: 0;
  background: #fff;
  padding: 4px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}
</style>


