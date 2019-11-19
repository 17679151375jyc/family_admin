<template>
  <div>
    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>主机类型</span>
          </div>
          <div class="text">{{info.type | statusName('MachineType')}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>主机区域码</span>
          </div>
          <div class="text">{{info.installCode}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>主机名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconbianhao"></i>
            <span>主机序列号</span>
          </div>
          <div class="text">{{info.serialNumber}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>用户手机</span>
          </div>
          <div class="text">{{info.phone}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>主机登录号</span>
          </div>
          <div class="text">{{info.account}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>省市区街道</span>
          </div>
          <div
            class="text"
          >{{`${info.provinceName ? info.provinceName+info.cityName+info.areaName+info.streetName : ''}`}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>区域信息</span>
          </div>
          <div
            class="text"
          >{{`${info.plotName ? info.plotName + info.buildingName + info.doorName : ''}`}}</div>
        </div>
      </div>

      <div class="row" v-if="info.type!==1">
        <div class="item">
          <div class="label">
            <i class="iconfont iconduankou"></i>
            <span>服务器上传端口</span>
          </div>
          <div class="text">{{ info.uploadPort }}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconip"></i>
            <span>ip</span>
          </div>
          <div class="text">{{ info.ip }}</div>
        </div>
      </div>

      <div class="row" v-show="info.type!==1">
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>主机二维码</span>
          </div>
          <div class="text" ref="qrCodeDivAll">
            <div id="qrCode" ref="qrCodeDiv" style="float: left;"></div>
            <div v-if="codeShow" style="text-algin: justify;margin-top: 10px;float: left;">
              <span v-if="info.installCode">{{`主机区域码： ${info.installCode}` }}</span>
              <br />
              <span v-if="info.account">{{`主机登录号： ${info.account}` }}</span>
              <br />
              <span v-if="info.uploadPort">{{`上 传 端 口： ${info.uploadPort}` }}</span>
              <br />
              <span v-if="info.ip">{{`IP： ${info.ip}` }}</span>
            </div>
            <Button
              class="no-print"
              style="margin-left: 20px;"
              type="primary"
              v-if="codeShow"
              @click="printCode"
            >打印</Button>
          </div>
        </div>
      </div>
    </div>

    <Tabs name="securityHost" style="margin-top: 30px;">
      <TabPane
        label="防区信息"
        tab="securityHost"
        icon="null iconfont icongongandunpai"
        v-if="info.type!==1"
      >
        <!-- 防盗主机的防区信息 -->
        <defence-area :macNumber="macNumber"></defence-area>
      </TabPane>
      <TabPane
        label="绑定防区"
        tab="securityHost"
        icon="null iconfont iconshexiangtou"
        v-if="info.type===1"
      >
        <!-- 视频主机绑定的防区 -->
        <video-defence :list="info.cameraList[0].defenceAreaList"></video-defence>
      </TabPane>
      <TabPane label="日志信息" tab="securityHost" icon="null iconfont iconxitongrizhi">
        <view-log :macNumber="macNumber" :hostId="hostId" :phone="info.phone"></view-log>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import {
  getSectorByNumber,
  getDefenceByMacNumber,
  getVideoHostByMacNum
} from "@/api/hostManage";
import defenceArea from "./defenceArea/defenceArea";
import videoHost from "./videoHost/videoHost";
import viewLog from "./viewLog/viewLog";
import videoDefence from "./videoDefence/videoDefence";
import QRCode from "qrcodejs2";
export default {
  components: {
    defenceArea,
    videoHost,
    viewLog,
    videoDefence
  },
  props: {
    macNumber: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      codeShow: false,
      hostId: null,
      subIsShow: false,
      form: {
        userName: "",
        roleId: ""
      },
      defenceList: [], // 防区列表
      //   videoList: [], // 视频主机列表
      info: {
        account: null,
        type: null, // 主机类型
        id: null,
        installCode: null, //主机区域码
        name: null, // 主机名字
        serialNumber: null, // 主机number,
        phone: null, // 用户手机号
        userName: null, // 用户名
        provinceName: null, //  省
        cityName: null, //市
        areaName: null, // 区
        streetName: null, // 街道
        plotName: null, // 小区名称
        buildingName: null, // 楼座号
        doorName: null, //门号
        uploadPort: null, //
        ip: null, //
        cameralList: []
      }
    };
  },
  computed: {},
  watch: {
    macNumber: {
      handler: function(val, oldVal) {
        if (val) {
          this.getDetail();
        }
      },
      immediate: true
    }
  },
  methods: {
    printCode() {
      this.$print(this.$refs.qrCodeDivAll);
    },
    BindQRCode(val) {
      new QRCode(this.$refs.qrCodeDiv, {
        text: `${JSON.stringify(val)}`,
        width: 80,
        height: 80,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
      });
    },
    getDetail() {
      // 获取账号详情
      getSectorByNumber({
        number: this.macNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          this.hostId = data.id;
          this.$refs.qrCodeDiv.innerHTML = ""; //清楚前一张二维码
          if (data.installCode) {
            this.codeShow = true;
            let dataList = {
              installCode: data.installCode,
              account: data.account,
              uploadPort: data.uploadPort,
              ip: data.ip
            };
            this.BindQRCode(dataList);
          } else {
            this.codeShow = false;
          }
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
#qrCode {
  margin: 10px;
}

.divider {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 30px 0;
}

.tab-wrapper .row .item .label {
  flex: 0 0 140px;
}

>>>.ivu-tree-children>li {
  margin-top: 0;
}
</style>