<template>
  <Modal
    title="维保消息详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="1000"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <div class="tab-wrapper" style="margin-bottom: 50px;">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconweixiuguanli"></i>
            <span>维保名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>状态</span>
          </div>
          <div class="text">{{info.status}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <div class="iconfont iconshijian"></div>
            <span>创建时间</span>
          </div>
          <div class="text">{{$moment(info.createTime*1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
        <div class="item">
          <div class="label">
            <div class="iconfont iconshouji"></div>
            <span>申报人手机</span>
          </div>
          <div class="text">{{info.userPhone}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区名称</span>
          </div>
          <div class="text">{{info.plotName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconicon-test"></i>
            <span>座名</span>
          </div>
          <div class="text">{{info.buildingName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconmenchuangmenchuangwujinanzhuang"></i>
            <span>门号</span>
          </div>
          <div class="text">{{info.doorName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>详细地址</span>
          </div>
          <div class="text">{{info.address}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icondituzhankai"></i>
            <span>目标地址</span>
          </div>
          <div class="text">
            <Button size="small" type="info" @click="showMap" v-show="info.longitude">查看地图</Button>
          </div>
        </div>
      </div>
    </div>

    <Tabs name="alarmTabs" style="margin-top:30px;" v-if="isShow">
      <TabPane label="消息进度" tab="alarmTabs" icon="null iconfont iconxiaoxi2">
        <!-- <Table stripe :columns="tabCol" :data="tabData" v-if="detailTableShow"></Table>
        <Table
          stripe
          border
          max-height="300"
          :columns="tableTitle"
          :data="tableSpeedData"
          v-if="speedTableShow"
        ></Table>-->

        <Table stripe :columns="tabCol" :data="tabData" v-if="detailTableShow"></Table>
        <Table
          stripe
          border
          max-height="300"
          :columns="tableTitle"
          :data="tableSpeedData"
          v-if="speedTableShow"
        ></Table>
      </TabPane>

      <TabPane
        label="消息汇总"
        icon="null iconfont iconyonghuzhongxin-xiaoxitongzhi"
        v-if="info.machineNumber"
      >
        <machine-list
          style="position:relative"
          :machineNumber="info.machineNumber"
          :type="1"
          :searchIsShow="false"
        ></machine-list>
      </TabPane>
      <TabPane
        label="主机详情"
        tab="alarmTabs"
        icon="null iconfont iconzhujiruqinfangyu"
        v-if="info.machineNumber && $options.filters.auth(['hostM.security.detail'])"
      >
        <security-host-detail-info :macNumber="info.machineNumber"></security-host-detail-info>
      </TabPane>
    </Tabs>

    <Modal title="目标地点" v-model.trim="mapIsShow" footer-hide :mask-closable="false" width="800">
      <div id="map" style="width: 100%;height: 500px;"></div>
    </Modal>
  </Modal>
</template>
<script>
import { getMaintenanceDetail, getWeibaoDetail } from "@/api/messageManage";
import MachineList from "@/views/messageManage/machine/machine";
import SecurityHostDetailInfo from "@/views/hostManage/securityHost/detail/detailInfo";
export default {
  components: {
    SecurityHostDetailInfo,
    MachineList
  },
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
      list: [],
      detailTableShow: true, //进度表格1
      speedTableShow: false, //进度表格2
      mapIsShow: false,
      statusList: {
        // 状态列表
        0: "未处理",
        1: "已忽略",
        2: "申报中",
        3: "已接单",
        4: "正在处理",
        5: "已完成",
        6: "评价完成"
      },
      info: {
        plotName: null, // 小区名字
        buildingName: null, // 座名
        doorName: null, // 门号
        defenceName: null, // 防区名称
        latitude: null, // 小区纬度
        longitude: null, // 小区经度

        createTime: null, // 创建时间
        applyUserPhone: null, // 申报人电话
        applyUserName: null, // 申报人名字
        requestTime: null, // 申报时间
        orderTime: null, // 预约时间
        accepTime: null, // 接单时间

        cidCode: null, // cid报警编号
        name: null, // 报警名称
        number: null, // 报警编号
        type: null, // 报警类型

        misstateTime: null, // 误报时间

        dealTime: null, // 上门处理时间
        dealUserName: null, // 处理人名字
        remarks: null, //完成处理后的备注
        completeTime: null, // 完成时间

        feedback: null, // 反馈意见
        mark: null, // 评分
        markTime: null, // 评分时间
        status: null // 状态
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  computed: {
    tabCol: function() {
      return [
        {
          title: "进度名称",
          key: "name",
          width: 150
        },
        {
          type: "html",
          title: "相关人员",
          key: "person"
        },
        {
          title: "时间",
          key: "time",
          width: 150
        }
      ];
    },
    tabData: function() {
      let tabData = [];
      let {
        plotName, // 小区名字
        buildingName, // 座名
        doorName, // 门号
        latitude, // 小区纬度
        longitude, // 小区经度

        createTime, // 创建时间
        applyUserPhone, // 申报人电话
        applyUserName, // 申报人名字
        content, // 内容
        orderTime, // 预约时间
        requestTime, // 申报时间

        name, // 维保名称
        number, // 维保编号

        dealTime, // 上门处理时间
        dealUserName, // 处理人名字
        completeTime, // 完成时间
        remarks, // 处理备注

        feedback, // 反馈意见

        mark, // 评分
        markTime, // 评分时间
        status // 状态
      } = this.info;
      if (createTime) {
        // 如果创建了
        tabData.push({
          name: "维保申请", // 报警发生时间
          person: `申&nbsp;&nbsp;请&nbsp;&nbsp;人：${applyUserName} ${applyUserPhone}<br>预约时间：${orderTime}`,
          time: createTime
        });

        if (dealUserName) {
          // 如果有人接单
          tabData.push({
            name: "上门维保",
            person: `维保人员：${dealUserName}`,
            time: dealTime ? dealTime : "未上门"
          });
        }
        if (completeTime) {
          // 是否完成
          tabData.push({
            name: "完成维保",
            person: `处理备注：${remarks ? remarks : "无备注"}`,
            time: completeTime
          });
        }
        if (markTime) {
          // 用户反馈时间
          tabData.push({
            name: "用户反馈",
            person: `评&nbsp;&nbsp;&nbsp;&nbsp;分：${mark}分<br>内&nbsp;&nbsp;&nbsp;&nbsp;容：${
              feedback ? feedback : "无评价内容"
            }`,
            time: markTime
          });
        }
        return tabData;
      }
    },
    tableTitle: function() {
      return [
        {
          title: "维保状态",
          key: "status",
          width: 100
        },
        {
          title: "维保人",
          key: "operator",
          width: 100
        },
        // {
        //   title: '维保人电话',
        //   key: "phone",
        //   width: 120
        // },
        // {
        //   title: '维保进度',
        //   key: "operation",
        //   width: 245
        // },
        {
          title: "创建时间",
          key: "createTime",
          width: 150
        },
        {
          title: "反馈",
          key: "feedback",
          minWidth: 100
        },
        {
          title: "维保信息",
          key: "operation",
          minWidth: 245,
          render: (h, params) => {
            return h("div", [
              h(
                "div",
                this.list[params.index].operation
                  ? this.list[params.index].operation
                  : ""
              ),
              h(
                "span",
                {
                  style: {
                    display: this.list[params.index].mark ? "inline" : "none",
                    fontWeight: "bold"
                  }
                },
                "评分:"
              ),
              h("Rate", {
                props: {
                  value: this.list[params.index].mark,
                  disabled: true
                },
                style: {
                  display: this.list[params.index].mark ? "inline" : "none"
                }
              })
            ]);
          }
        }
      ];
    },
    tableSpeedData: function() {
      let tableSpeedData = [];
      for (let i = 0; i <= this.list.length - 1; i++) {
        let {
          createTime,
          feedback,
          operation,
          operator,
          status,
          mark
        } = this.list[i];
        tableSpeedData.push({
          status: status >= 0 ? this.statusList[status] : "", //维保状态
          createTime: createTime
            ? this.$options.filters.formatTime(createTime)
            : "无", //创建时间
          operation: operation ? operation : "无",
          operator: operator ? operator : "无", // 维保人
          feedback: feedback ? feedback : "无"
        });
      }

      return tableSpeedData;
    }
  },
  methods: {
    showMap() {
      this.mapIsShow = true;
      let address =
        this.info.plotName + this.info.buildingName + this.info.doorName;
      let lng = this.info.longitude;
      let lat = this.info.latitude;
      // 显示地图弹窗
      var map = new AMap.Map("map", {
        resizeEnable: true,
        center: [lng, lat],
        zoom: 13
      });

      var marker = new AMap.Marker({
        position: map.getCenter(),
        icon:
          "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        offset: new AMap.Pixel(-13, -30)
      });

      marker.setMap(map);

      // 设置鼠标划过点标记显示的文字提示
      marker.setTitle("我是marker的title");

      // 设置label标签
      // label默认蓝框白底左上角显示，样式className为：amap-marker-label
      marker.setLabel({
        offset: new AMap.Pixel(20, 20), //设置文本标注偏移量
        content: `<div class='info'>${address}</div>`, //设置文本标注内容
        direction: "top" //设置文本标注方位
      });
    },
    getDetail() {
      // 获取账号详情
      getMaintenanceDetail({
        number: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          console.log(data);
          this.info = data;
          //   let {
          //     plotName, // 小区名字
          //     buildingName, // 座名
          //     doorName, // 门号
          //     latitude, // 小区纬度
          //     longitude, // 小区经度

          //     createTime, // 创建时间
          //     applyUserPhone, // 申报人电话
          //     applyUserName, // 申报人名字
          //     content, // 内容
          //     orderTime, // 预约时间
          //     requestTime, // 申报时间

          //     name, // 维保名称
          //     number, // 维保编号

          //     dealTime, // 上门处理时间
          //     dealUserName, // 处理人名字
          //     completeTime, // 完成时间
          //     remarks, // 处理备注

          //     feedback, // 反馈意见
          //     mark, // 评分
          //     markTime, // 评分时间
          //     status // 状态
          //   } = data;
          //   //   this.info = data;
          //   this.info = {
          //     name, // 报警名称
          //     number, // 报警编号

          //     plotName, // 小区名字
          //     buildingName, // 座名
          //     doorName, // 门号
          //     latitude, // 小区纬度
          //     longitude, // 小区经度
          //     content,
          //     createTime: this.$options.filters.formatTime(createTime), // 创建时间

          //     applyUserPhone, // 申报人电话
          //     applyUserName, // 申报人名字
          //     requestTime: requestTime
          //       ? this.$options.filters.formatTime(requestTime)
          //       : "", // 申报时间
          //     orderTime: orderTime
          //       ? this.$options.filters.formatTime(orderTime, "Y-M-D")
          //       : "", // 预约时间
          //     dealUserName, // 处理人名字
          //     dealTime: dealTime
          //       ? this.$options.filters.formatTime(dealTime)
          //       : "", // 上门处理时间
          //     completeTime: completeTime
          //       ? this.$options.filters.formatTime(completeTime)
          //       : "", // 完成时间
          //     remarks, // 处理备注

          //     feedback, // 反馈意见
          //     mark, // 评分
          //     markTime: markTime
          //       ? this.$options.filters.formatTime(markTime)
          //       : "", // 评分时间
          //     status: status // 状态
          //   };
        }
      });
      // 获取维保进度详情
      getWeibaoDetail({
        input: {
          maintainNumber: this.id
        }
      }).then(({ data, errorCode }) => {
        if (errorCode === 0 && data.list.length > 0) {
          this.detailTableShow = false;
          this.speedTableShow = true;
          this.list = data.list;
          console.log(data);
        } else {
          this.detailTableShow = true;
          this.speedTableShow = false;
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


