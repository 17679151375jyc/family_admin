<template>
  <Modal
    title="报警消息详情"
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
            <i class="iconfont iconiconset0254"></i>
            <span>CID码</span>
          </div>
          <div class="text">{{info.cidCode}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconxiaoxi1"></i>
            <span>报警名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-zidingyi"></i>
            <span>报警类型</span>
          </div>
          <div class="text">{{info.typeValue | statusName('AlertMessageType')}}</div>
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
            <i class="iconfont icongongandunpai"></i>
            <span>防区名称</span>
          </div>
          <div class="text">{{info.defenceAreaName}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>目标地址</span>
          </div>
          <div class="text">
            <Button size="small" type="info" @click="showMap" v-show="info.longitude">查看地图</Button>
          </div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>警情视频</span>
          </div>
          <div class="text">
            <Tag color="default" v-show="cameraList.length===0">无相关视频</Tag>
            <div v-show="cameraList.length > 0">
              <Button
                size="small"
                type="info"
                @click="showVideo(index)"
                v-for="(item, index) in cameraList"
                :key="item.id"
              >查看：{{item.name}}</Button>
            </div>
          </div>
        </div>

        <!-- <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>防区名称</span>
          </div>
          <div class="text">{{info.defenceName}}</div>
        </div>-->
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian"></i>
            <span>视频截图</span>
          </div>
          <div class="text">
            <viewer :images="info.photoList" style="margin:10px 0px;">
              <!-- <div :class="{'image-box':willShow}"> -->
              <span v-if="info.photoList.length===0">暂无截图</span>
              <div class="box-div-img" v-else>
                <div v-for="(item,key) in info.photoList" :key="key" class="box-div">
                  <img :src="item.picUrl" class="img_css" />
                </div>
              </div>
            </viewer>
          </div>
        </div>
      </div>
    </div>

    <Tabs name="alarmTabs" style="margin-top:30px;" v-if="isShow">
      <TabPane label="消息进度" tab="alarmTabs" icon="null iconfont iconxiaoxi2">
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
          :type="0"
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

    <!-- 视频弹窗-start -->
    <video-modal
      v-model="video.isShow"
      :startTime="videoStartTime"
      :endTime="videoEndTime"
      :deviceNumber="video.deviceNumber"
      :token="video.token"
      :name="video.name"
    ></video-modal>
    <!-- 视频弹窗-end -->
  </Modal>
</template>
<script>
import {
  getAlramDetail,
  getAlramDataDetail,
  getAlertCamera
} from "@/api/messageManage";
import SecurityHostDetailInfo from "@/views/hostManage/securityHost/detail/detailInfo";
import MachineList from "@/views/messageManage/machine/machine";
import Video from "./video";
export default {
  components: {
    VideoModal: Video,
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
      starValue: 1,
      list: [],
      detailTableShow: true, //进度表格1
      speedTableShow: false, //进度表格2
      mapIsShow: false,
      typeList: {
        0: "一般报警",
        1: "紧急报警"
      },
      video: {
        isShow: false,
        deviceNumber: "",
        token: "",
        name: ""
      },
      info: {
        plotName: null, // 小区名字
        buildingName: null, // 座名
        doorName: null, // 门号
        defenceAreaName: null, // 防区名称
        latitude: null, // 小区纬度
        longitude: null, // 小区经度
        photoList: [], //照片
        createTime: null, // 创建时间
        applyUserPhone: null, // 申报人电话
        applyUserName: null, // 申报人名字
        requestTime: null, // 申报时间
        acceptTime: null, // 接单时间

        cidCode: null, // cid报警编号
        name: null, // 报警名称
        number: null, // 报警编号
        type: null, // 报警类型

        misstateTime: null, // 误报时间

        dealTime: null, // 上门处理时间
        dealUserName: null, // 处理人名字
        dealUserPhone: null, //处理人电话
        remarks: null, //完成处理后的备注
        completeTime: null, // 完成时间

        feedback: null, // 反馈意见
        mark: null, // 评分
        markTime: null, // 评分时间
        status: null // 状态
      },
      cameraList: [] // 视频列表
    };
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        await this.getDetail();
        this.getAlramLog();
        this.getAlertCamera();
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
        defenceAreaName, // 防区名称
        latitude, // 小区纬度
        longitude, // 小区经度
        photoList, //图片

        createTime, // 创建时间
        applyUserPhone, // 申报人电话
        applyUserName, // 申报人名字
        requestTime, // 申报时间
        acceptTime, // 接单时间

        cidCode, // cid报警编号
        name, // 报警名称
        number, // 报警编号
        type, // 报警类型

        misstateTime, // 误报时间

        dealTime, // 上门处理时间
        dealUserName, // 处理人名字
        dealUserPhone, // 处理人电话
        remarks, //完成处理后的备注
        completeTime, // 完成时间

        feedback, // 反馈意见
        mark, // 评分
        markTime, // 评分时间
        status // 状态
      } = this.info;
      if (createTime) {
        // 如果创建了
        tabData.push({
          name: "报警发生", // 报警发生时间
          person: "报警人：" + applyUserName + " " + applyUserPhone,
          time: createTime
        });
      }
      if (requestTime) {
        // 申报时间
        tabData.push({
          name: "报警申报",
          person: "申报人：" + applyUserName + " " + applyUserPhone,
          time: createTime
        });

        if (misstateTime) {
          // 误报时间
          tabData.push({
            name: "误报",
            person: "确认误报人：" + applyUserName + " " + applyUserPhone,
            time: misstateTime
          });
        }
        if (acceptTime) {
          // 接警时间
          tabData.push({
            name: "确认接警",
            person: "接警人：" + dealUserName + " " + dealUserPhone,
            time: acceptTime
          });
        }
        if (dealTime) {
          // 上门时间
          tabData.push({
            name: "上门时间",
            person: "上门人：" + dealUserName + " " + dealUserPhone,
            time: dealTime
          });
        }
        if (completeTime) {
          // 完成时间
          tabData.push({
            name: "任务完成",
            person: `完成人：${dealUserName} ${dealUserPhone}<br/>备&nbsp;&nbsp;&nbsp;&nbsp;注：${
              remarks ? remarks : "无备注"
            }`,
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
      }
      return tabData;
    },
    tableTitle: function() {
      return [
        {
          title: "申报状态",
          key: "status",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              this.$options.filters.statusName(
                params.row.status,
                "AlertMessageStatus"
              )
            );
          }
        },
        {
          title: "操作人",
          key: "operator",
          width: 120
        },
        {
          title: "操作时间",
          key: "createTime",
          width: 150
        },
        {
          title: "操作信息",
          key: "HostInfo",
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
                  // float: 'right'
                }
              })
            ]);
          }
        }
        // {
        //   title: '评价',
        //   key: "mark",
        //   width: 180,
        //   align: "center",
        //   render: (h, params) => {
        //     let btnGroup = [];
        //       let btn = h(
        //         "Rate",
        //         {
        //           props: {
        //             value: this.list[params.index].mark,
        //             disabled: true,
        //           },
        //           style: {
        //             display: this.list[params.index].mark ? 'inline' : 'none'
        //           }
        //         },
        //       );
        //       btnGroup.push(btn);
        //     return h("div", btnGroup);
        //   }
        // },
      ];
    },
    tableSpeedData: function() {
      let tableSpeedData = [];
      console.log(this.list);
      for (let i = 0; i <= this.list.length - 1; i++) {
        let { createTime, operation, operator, status, mark } = this.list[i];
        tableSpeedData.push({
          status, //申报状态
          operator: operator ? operator : "无", // 申报人
          createTime: createTime
            ? this.$options.filters.formatTime(createTime)
            : "无", //创建时间
          HostInfo: operation ? operation : "",
          mark
        });
      }

      return tableSpeedData;
    },
    videoStartTime: function() {
      if (this.info.createTime) {
        return this.$moment((this.info.createTime - 30) * 1000).format(
          "YYYYMMDDhhmmss"
        );
      } else {
        return "";
      }
    },
    videoEndTime: function() {
      if (this.info.createTime) {
        return this.$moment((this.info.createTime + 30) * 1000).format(
          "YYYYMMDDhhmmss"
        );
      } else {
        return "";
      }
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
      return new Promise((resolve, reject) => {
        getAlramDetail({
          number: this.id
        }).then(({ data, errorCode }) => {
          if (errorCode === 0) {
            this.info = data;
            resolve();
          }
        });
      });
      // 获取报警详情
      // 获取报警进度详情
      console.log(this.id);
    },
    /**
     * 获取日志进度详情
     */
    getAlramLog() {
      getAlramDataDetail({
        input: {
          alertNumber: this.id
        }
      }).then(({ data, errorCode }) => {
        if (errorCode === 0 && data.list.length > 0) {
          this.detailTableShow = false;
          this.speedTableShow = true;
          this.list = data.list;
          console.log(this.list);
        } else {
          this.detailTableShow = true;
          this.speedTableShow = false;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * 查询有没一分钟视频
     */
    getAlertCamera() {
      getAlertCamera({
        areaNumber: this.info.areaNumber, // 区域number
        defenceAreaNumber: this.info.defenceAreaNumber // 防区number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.cameraList = data;
        }
      });
    },
    /**
     * 显示视频弹窗
     */
    showVideo(index) {
      this.video.isShow = true;
      let { deviceNumber, yingShiToken, name } = this.cameraList[index];
      this.video.deviceNumber = deviceNumber;
      this.video.token = yingShiToken;
      this.video.name = name;
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

.box-div-img {
  display: flex;
  max-width: 520px;
  overflow-x: auto;
}

.box-div {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
  margin: 5px;
}

.img_css {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
</style>


