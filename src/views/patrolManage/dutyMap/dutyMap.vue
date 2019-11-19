<template>
  <div class="win-wrapper">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="map">
      <!-- 地图容器-start -->
      <div id="duty-amap-container"></div>
      <!-- 地图容器-end -->

      <!-- 左侧区域列表-start -->
      <div class="left">
        <Dropdown trigger="click" @on-click="cityChange" style="pointer-events: auto;">
          <div class="city">
            <span>{{cityName}}</span>
            <i class="ivu-icon ivu-icon-ios-arrow-down"></i>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="item in cityData"
              :key="item.id"
              :name="`${item.code}-${item.name}`"
            >{{item.name}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div class="area">
          <Tree
            :data="areaList"
            :load-data="loadAreaData"
            show-checkbox
            multiple
            style="pointer-events: auto;"
          ></Tree>
        </div>
      </div>
      <!-- 左侧区域列表-end -->

      <!-- 右上菜单栏-start -->
      <div class="right">
        <div class="handle-wrapper">
          <div class="time">
            <img :src="require('./icon_time.png')" />
            <span>
              <DatePicker
                type="date"
                @on-change="dateChange"
                :value="date"
                :options="dateOptions"
                :format="'yyyy-MM-dd'"
                :clearable="false"
                class="date-picker"
              ></DatePicker>
            </span>
          </div>
          <div class="item-quantity">
            <i>{{memberList.length}}</i>
            <span>在巡保安</span>
          </div>
          <div class="item-quantity">
            <i>{{donePoints}}</i>
            <span>已巡客户</span>
          </div>
          <div class="item-quantity">
            <i>{{unDonePoints}}</i>
            <span>未巡客户</span>
          </div>
          <div class="item-quantity">
            <i>{{dueOptions}}</i>
            <span>将到期客户</span>
          </div>
          <div class="item" @click="pointIsShow = !pointIsShow">
            <img
              :src="pointIsShow ? require('./icon_customer_show.png') : require('./icon_customer_hide.png')"
            />
            <span>{{pointIsShow?'显示客户':'隐藏客户'}}</span>
          </div>
          <div class="item" @click="memberIsShow = !memberIsShow">
            <img
              :src="memberIsShow ? require('./icon_security_show.png') : require('./icon_security_hide.png')"
            />
            <span>{{memberIsShow ? '显示保安' : '隐藏保安'}}</span>
          </div>
          <div class="item" @click="infoWindowIsShow = !infoWindowIsShow">
            <img
              :src="infoWindowIsShow ? require('./icon_msg_win_show.png') : require('./icon_msg_win_hide.png')"
            />
            <span>{{infoWindowIsShow ? '显示信息窗': '隐藏信息窗'}}</span>
          </div>
          <div class="item">
            <img :src="require('./icon_self_adaption.png')" alt />
            <span @click="fitView">自适应显示</span>
          </div>
          <!-- <div class="item">
            <img :src="require('./icon_history_2.png')" />
            <span>巡更记录</span>
          </div>-->
          <div class="refresh-wrapper">
            <Button type="primary" icon="ios-refresh" @click="refresh">刷新数据</Button>
          </div>
        </div>
        <div class="info-wrapper"></div>
      </div>
      <!-- 右上菜单栏-end -->
    </div>

    <!-- 巡更点详情-start -->
    <point-detail
      v-model="pointDetail.isShow"
      :date="date"
      :fsAreaNumber="pointDetail.fsAreaNumber"
      :address="pointDetail.address"
      :areaName="pointDetail.areaName"
      :checkNum="pointDetail.checkNum"
      :effectiveTime="pointDetail.effectiveTime"
      :type="pointDetail.type"
      :userPhone="pointDetail.userPhone"
    ></point-detail>
    <!-- 巡更点详情-end -->

    <!-- 巡更人详情-start -->
    <member-detail
      v-model="memberDetail.isShow"
      :date="date"
      :fsUserNumber="memberDetail.fsUserNumber"
      :captain="memberDetail.captain"
      :checkNumm="memberDetail.checkNum"
    ></member-detail>
    <!-- 巡更人详情-end -->
  </div>
</template>

<script>
import PointDetail from "./pointDetail";
import MemberDetail from "./memberDetail";
import {
  getCityList,
  getAreaList,
  getProvinceAllInfo,
  getStreetList,
  getPlotList
} from "@/api/common";
import { getAllTaskPoint, getTaskMember } from "@/api/patrolManage";
import Vue from "vue";
import VueAMap from "vue-amap";
import { lazyAMapApiLoaderInstance } from "vue-amap";
import { mapState } from "vuex";
import config from "@/config/index";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: config.amap.key,
  plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType"],
  uiVersion: "1.0", // ui库版本，不配置不加载,
  v: "1.4.15"
});
export default {
  components: {
    PointDetail,
    MemberDetail
  },
  data() {
    return {
      spinShow: false,
      markerZIndex: 9999,
      map: null,
      pointList: [], // 巡更点
      pointMarkers: [], // 巡更点marker
      memberList: [], //巡更人列表
      memberMarkers: [], // 巡更人marker
      pointIsShow: true,
      pointDetail: {
        isShow: false,
        fsAreaNumber: "",
        address: "",
        areaName: "",
        checkNum: 0,
        effectiveTime: 0,
        type: 0,
        userPhone: ""
      },
      memberIsShow: true,
      memberDetail: {
        // 巡更人员详情弹窗
        isShow: false,
        fsUserNumber: "", //巡更人员number
        captain: 0 //是否队长
      },
      infoWindowIsShow: true,
      cityData: [],
      cityName: "",
      cityCode: "",
      cityList: [], // 城市列表
      areaList: [],
      streetList: [],
      plotList: [],
      date: this.$moment().format("YYYY-MM-DD"),
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      dueDays: 30, // 即将到期提醒天数
      timer: null // 定时请求新的点的信息
    };
  },
  watch: {
    pointList: function(val, oldVal) {
      this.addPointMarkers();
    },
    pointIsShow: function(val, oldVal) {
      this.addPointMarkers();
    },
    memberList: function(val, oldVal) {
      // 把巡更人员的点添加到地图
      this.addMemberMarkers();
    },
    memberIsShow: function() {
      this.addMemberMarkers();
    },
    infoWindowIsShow: function() {
      this.addPointMarkers();
      this.addMemberMarkers();
    },
    date: {
      handler: function() {
        this.refresh();
      }
    },
    // 监听areaList
    "areas.length": {
      handler: function(val, oldVal) {
        console.log("areas改变了", val, oldVal);
        if (val != oldVal) {
          this.spinShow = true;
          this.refresh();
          if (oldVal != 0) {
          }
        }
      },
      deep: true
    },
    "streets.length": {
      handler: function(val, oldVal) {
        console.log("街道改变了", val, oldVal);
        if (val != oldVal) {
          this.refresh();
          if (oldVal != 0) {
          }
        }
      },
      deep: true
    },
    "plotNumbers.length": {
      handler: function(val, oldVal) {
        console.log("小区改变了", val, oldVal);
        if (val != oldVal) {
          this.spinShow = true;
          this.refresh();
          if (oldVal != 0) {
          }
        }
      },
      deep: true
    },
    cityCode: function() {
      this.getCityAllPlot(this.cityCode);
    }
  },
  computed: {
    donePoints: function() {
      // 已巡更的点
      let quantity = 0;
      for (let i = 0; i < this.pointList.length; i++) {
        if (this.pointList[i].checkNum > 0) {
          quantity++;
        }
      }
      return quantity;
    },
    unDonePoints: function() {
      // 未巡更的点
      let quantity = 0;
      for (let i = 0; i < this.pointList.length; i++) {
        if (this.pointList[i].checkNum == 0) {
          quantity++;
        }
      }
      return quantity;
    },
    dueOptions: function() {
      // 即将到期的客户
      let quantity = 0;
      let now = (new Date().valueOf() / 1000).toFixed(0) - 0;
      for (let i = 0; i < this.pointList.length; i++) {
        if (this.pointList[i].effectiveTime - now < this.dueDays * 86400) {
          quantity++;
        }
      }
      return quantity;
    },
    areas: function() {
      // 当前选中的区
      let areas = [];
      for (let i = 0; i < this.areaList.length; i++) {
        let { checked, code } = this.areaList[i];
        if (checked) {
          areas.push(code);
        }
      }
      if (
        areas.length === 0 &&
        this.streets.length === 0 &&
        this.plotNumbers.length === 0
      ) {
        // 如果全部都没传，就默认把当前市所有区加入
        for (let i = 0; i < this.areaList.length; i++) {
          let { code } = this.areaList[i];
          areas.push(code);
        }
      }
      return areas;
    },
    streets: function() {
      // 当前选中的街道
      let streets = [];
      for (let i = 0; i < this.streetList.length; i++) {
        let { checked, code } = this.streetList[i];
        if (checked) {
          streets.push(code);
        }
      }
      return streets;
    },
    plotNumbers: function() {
      // 当前选中的小区
      let plotNumbers = [];
      for (let i = 0; i < this.plotList.length; i++) {
        let { checked, code } = this.plotList[i];
        if (checked) {
          plotNumbers.push(code);
        }
      }
      return plotNumbers;
    }
  },
  async created() {
    await this.getCityList();
    this.cityCode = this.cityData[6].code; // 进来默认选择第一个城市
    this.cityName = this.cityData[6].name;
  },
  mounted() {
    lazyAMapApiLoaderInstance.load().then(() => {
      // your code ...
      this.map = new AMap.Map("duty-amap-container", {
        center: new AMap.LngLat(113.094942, 22.590431),
        zoom: 16,
        resizeEnable: true // 自适应显示全部点
      });

      this.refresh(); // 执行刷新操作
    });
  },
  methods: {
    /**
     * 查询对应的区域巡查点
     */
    getAllTaskPoint() {
      if (this.areas.length === 0) {
        this.spinShow = false;
        return;
      }
      getAllTaskPoint({
        startTime: this.date,
        pointTypes: [1, 2], // 查询商企的点
        streets: this.streets,
        areas: this.areas,
        plotNumbers: this.plotNumbers
      }).then(({ data, errorCode }) => {
        this.spinShow = false;
        if (errorCode === 0) {
          this.pointList = data;
        }
      });
    },
    /**
     * 获取巡查人员
     */
    getTaskMember() {
      if (this.areas.length === 0) {
        this.spinShow = false;
        return;
      }
      getTaskMember({
        startTime: this.date,
        streets: this.streets,
        areas: this.areas,
        plotNumbers: this.plotNumbers
      }).then(({ data, errorCode }) => {
        this.spinShow = false;
        if (errorCode === 0) {
          this.memberList = data;
        }
      });
    },
    /**
     * 显示巡更点详情
     */
    showPointDetail(data) {
      this.pointDetail.isShow = true;
      this.pointDetail.address = data.address;
      this.pointDetail.fsAreaNumber = data.areaNumber;
      this.pointDetail.areaName = data.areaName;
      this.pointDetail.checkNum = data.checkNum;
      this.pointDetail.effectiveTime = data.effectiveTime;
      this.pointDetail.type = data.type;
      this.pointDetail.userPhone = data.userPhone;
      console.log(data, "显示巡更点详情");
    },
    /**
     * 显示巡更人员详情
     */
    showMemberDetail({ fsUserNumber, captain, checkNum }) {
      this.memberDetail.isShow = true;
      this.memberDetail.fsUserNumber = fsUserNumber;
      this.memberDetail.captain = captain;
      this.memberDetail.checkNum = checkNum;
    },
    /**
     * 获取城市列表
     */
    async getCityList() {
      return new Promise((resolve, reject) => {
        getCityList({
          provinceCode: 440000
        }).then(({ data, errorCode }) => {
          if (errorCode === 0) {
            this.cityData = this.cityData.concat(data.list);
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    /**
     * 传省id返回全部市区街道信息
     */
    getCityAllPlot(cityCode) {
      getProvinceAllInfo({
        code: cityCode
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          //   let {area, city, plot, street} = data
          this.cityList = data.city;
          this.areaList = data.area;
          this.streetList = data.street;
          this.plotList = data.plot;
          for (let i = 0; i < this.streetList.length; i++) {
            //遍历所有小区，添加到对应的街道里
            this.streetList[i].title = this.streetList[i].name;
            this.streetList[i].children = [];
            for (let j = 0; j < this.plotList.length; j++) {
              //   console.log(plot[j].street, street[i].code)
              if (this.plotList[j].street == this.streetList[i].code) {
                //   console.log('相等')
                this.plotList[j].title = this.plotList[j].plotName;
                this.plotList[j].code = this.plotList[j].plotNumber;
                //   console.log(plotName, plotNumber)
                this.streetList[i].children.push(this.plotList[j]);
              }
            }
          }
          for (let i = 0; i < this.areaList.length; i++) {
            // 遍历所有街道添加到对应的区
            this.areaList[i].title = this.areaList[i].name;
            this.areaList[i].children = [];
            for (let j = 0; j < this.streetList.length; j++) {
              if (this.areaList[i].code == this.streetList[j].parentCode) {
                this.areaList[i].children.push(this.streetList[j]);
              }
            }
          }
          console.log("area", this.areaList);
          this.areaList;
        }
      });
    },
    /**
     * 当城市改变时
     */
    cityChange(name) {
      name.split("-");
      this.cityCode = name.split("-")[0];
      this.cityName = name.split("-")[1];
    },
    /**
     *获取街道列表
     */
    getStreetList() {
      getStreetList();
    },
    /**
     * 获取小区列表
     */
    getPlotList() {},
    /**
     * 动态加载tree数据
     */
    loadAreaData(item) {
      // 省是level=2,市是3，区4，街道5
      console.log(item);
    },

    /**
     * 当日期改变时
     */
    dateChange(e) {
      this.date = e;
    },
    /**
     * 刷新拉取数据
     */
    refresh() {
      this.spinShow = true;
      this.pointDetail.isShow = false;
      this.memberDetail.isShow = false;
      this.map ? this.map.clearMap() : "";
      this.getAllTaskPoint(); // 查询对应的巡更点
      this.getTaskMember(); // 查询对应的巡更人员
    },
    /**
     * 添加客户点到地图上
     */
    addPointMarkers() {
      this.map && this.map.remove(this.pointMarkers);
      this.pointMarkers = [];
      if (this.pointIsShow) {
        for (let i = 0; i < this.pointList.length; i++) {
          let {
            address,
            areaName,
            areaNumber,
            checkNum,
            effectiveTime,
            type,
            userPhone,
            longitude,
            latitude
          } = this.pointList[i];
          let options = {};
          if (this.infoWindowIsShow) {
            options = {
              map: this.map,
              content: `<div class="point-info-window">
                <div class="left">
                    <div class="name">${areaName}</div>
                    <div class="phone">${userPhone}</div>
                    <div class="address">${address}</div>
                </div>
                <div class="right">
                    <span>巡更次数</span>
                    <i>${checkNum}</i>
                </div>
                <div class="icon">
                    <img src="${require("./icon_customer.png")}" />
                </div>  
            </div>`,
              anchor: "bottom-center",
              offset: new AMap.Pixel(0, -35),
              position: [longitude, latitude],
              extData: i,
              clickable: true
            };
          } else {
            options = {
              map: this.map,
              icon: require("./icon_customer.png"),
              offset: new AMap.Pixel(-35, -35), //设置偏移量
              position: [longitude, latitude],
              extData: i,
              clickable: true
            };
          }
          let item = new AMap.Marker(options);

          AMap.event.addListener(item, "click", () => {
            this.markerZIndex = this.markerZIndex + 1;
            console.log(this.markerZIndex);
            item.setzIndex(this.markerZIndex);
            this.showPointDetail({
              address,
              areaName,
              areaNumber,
              checkNum,
              effectiveTime,
              type,
              userPhone,
              longitude,
              latitude
            });
          });
          this.pointMarkers.push(item);
        }
      }

      //   this.map.setFitView();
    },
    /**
     * 添加安保点到地图上
     */
    addMemberMarkers() {
      this.map && this.map.remove(this.memberMarkers);
      this.memberMarkers = [];
      if (this.memberIsShow) {
        for (let i = 0; i < this.memberList.length; i++) {
          let {
            parentName,
            parentPhone,
            captain,
            checkNum,
            fsUserNumber,
            phone,
            real_name,
            longitude,
            latitude
          } = this.memberList[i];
          if (longitude) {
            let options = {};
            if (this.infoWindowIsShow) {
              options = {
                map: this.map,
                content: `<div class="member-info-window" @click="clickMember">
                <div class="left">
                    <div class="member-info">
                        <div class="avatar">
                            <img src="${require("./avatar.png")}"/>
                        </div>
                        <div class="msg">
                            <div class="name">${real_name}</div>
                            <div class="phone">${phone}</div>
                        </div>
                    </div>
                    <div class="captain-info">
                        <span>保安队长</span><b>${
                          captain ? real_name : parentName
                        }</b><span>${captain ? phone : parentPhone}</span>
                    </div>
                </div>
                <div class="right">
                    <span>巡更次数</span>
                    <i>${checkNum}</i>
                </div>
                <div class="icon">
                    <img src="${require("./icon_security.png")}" />
                </div>  
            </div>`,
                anchor: "bottom-center",
                offset: new AMap.Pixel(0, -35),
                position: [longitude, latitude],
                clickable: true
              };
            } else {
              options = {
                map: this.map,
                icon: require("./icon_security.png"),
                offset: new AMap.Pixel(-35, -35), //设置偏移量
                position: [longitude, latitude],
                clickable: true
              };
            }
            let item = new AMap.Marker(options);
            item.setzIndex(999 + i);
            AMap.event.addListener(item, "click", () => {
              this.markerZIndex = this.markerZIndex + 1;
              console.log(this.markerZIndex);
              item.setzIndex(this.markerZIndex);
              this.showMemberDetail({
                parentName,
                parentPhone,
                captain,
                checkNum,
                fsUserNumber,
                phone,
                real_name,
                longitude,
                latitude
              });
            });
            this.memberMarkers.push(item);
          }
        }
      }
    },
    /**
     * 自适应把当前所有点显示出来
     */
    fitView() {
      this.map && this.map.setFitView();
    }
  }
};
</script>

<style lang="stylus" scoped>
.win-wrapper {
//   position: relative;
  background: gray;

  .map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    #duty-amap-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #333;

      >>>.amap-info-content {
        padding: 10px !important;
      }

      >>>.amap-info-close {
        right: 10px !important;
      }

      >>>.point-info-window {
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 10px;
        min-width: 300px;
        // height: 108px;
        background: #fff;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
        position: relative;

        &:hover:after {
          border-color: #3388ff;
          transition: all 0.5s;
        }

        &:hover:before {
          border-top-color: #3388ff;
          transition: all 0.2s;
        }

        &:after {
          content: '';
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: block;
          position: absolute;
          border: 1px solid transparent;
        }

        &:before {
          content: '';
          display: block;
          border: 8px solid transparent;
          bottom: -16px;
          left: 50%;
          width: 0;
          height: 0;
          position: absolute;
          margin-left: -8px;
          border-top-color: #ffffff;
        }

        .icon {
          width: 70px;
          height: 70px;
          position: absolute;
          left: 50%;
          margin-left: -35px;
          bottom: -70px;
        }

        .left {
          flex: 1;
          text-align: left;

          .name {
            color: #3388FF;
            font-size: 15px;
          }

          .phone {
            height: 30px;
            line-height: 30px;
            color: #26364D;
            font-size: 12px;
          }

          .address {
            font-size: 12px;
            color: #979899;
          }
        }

        .right {
          flex: 0 0 80px;
          height: 80px;
          border-radius: 5px;
          background: #f5f5f5;
          display: flex;
          flex-flow: column;

          span {
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #26364D;
            position: relative;

            &:before {
              content: '';
              display: block;
              position: absolute;
              bottom: 0;
              left: 6px;
              right: 6px;
              height: 1px;
              background: #E3E4E6;
            }
          }

          i {
            display: flex;
            height: 50px;
            justify-content: center;
            align-items: center;
            font-style: normal;
            color: #0F294D;
            font-size: 25px;
            font-weight: bold;
          }
        }
      }

      >>>.member-info-window {
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding: 10px;
        min-width: 300px;
        // height: 108px;
        background: #fff;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
        position: relative;

        &:hover:after {
          border-color: #194480;
          transition: all 0.5s;
        }

        &:hover:before {
          border-top-color: #194480;
          transition: all 0.2s;
        }

        &:after {
          content: '';
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: block;
          position: absolute;
          border: 1px solid transparent;
        }

        &:before {
          content: '';
          display: block;
          border: 8px solid transparent;
          bottom: -16px;
          left: 50%;
          width: 0;
          height: 0;
          position: absolute;
          margin-left: -8px;
          border-top-color: #ffffff;
        }

        .icon {
          width: 70px;
          height: 70px;
          position: absolute;
          left: 50%;
          margin-left: -35px;
          bottom: -70px;
        }

        .left {
          flex: 1;
          text-align: left;

          .member-info {
            display: flex;

            .avatar {
              flex: 0 0 40px;
              height: 40px;
              margin-right: 10px;
              margin-bottom: 8px;

              img {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
              }
            }

            .msg {
              flex: 1;
              display: flex;
              flex-flow: column;

              .name {
                color: #26364D;
                font-size: 14px;
              }

              .phone {
                font-size: 12px;
                color: #7a7a7a;
              }
            }
          }

          .captain-info {
            font-size: 12px;
            background: #f5f5f5;
            height: 30px;
            line-height: 30px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            span {
              color: #26364D;
            }

            b {
              color: #3388FF;
              font-weight: bold;
            }
          }
        }

        .right {
          flex: 0 0 80px;
          height: 80px;
          border-radius: 5px;
          background: #f5f5f5;
          display: flex;
          flex-flow: column;
          margin-left: 5px;

          span {
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #26364D;
            position: relative;

            &:before {
              content: '';
              display: block;
              position: absolute;
              bottom: 0;
              left: 6px;
              right: 6px;
              height: 1px;
              background: #E3E4E6;
            }
          }

          i {
            display: flex;
            height: 50px;
            justify-content: center;
            align-items: center;
            font-style: normal;
            color: #0F294D;
            font-size: 25px;
            font-weight: bold;
          }
        }
      }
    }

    .left {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 204px;
      display: flex;
      flex-flow: column;
      pointer-events: none;

      .city {
        width: 200px;
        height: 60px;
        margin: 4px;
        box-shadow: 5px 2px 10px rgba(0, 0, 0, 0.2);
        background: #fff;
        border-radius: 2px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: bold;
        pointer-events: auto;

        span {
          margin-right: 10px;
        }
      }

      >>>.ivu-select-dropdown {
        width: 200px !important;
      }

      >>>.ivu-dropdown-item {
        font-size: 14px !important;
      }

      .area {
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 4px;
        pointer-events: auto;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
        text-align: left;
        margin-left: 4px;
        background: #fff;
        padding-left: 4px;

        .items:nth-last-child(1) {
          margin-bottom: 0;
        }

        .items {
          background: #fff;
          margin: 0px 4px 4px 4px;
          width: 200px;
          border-radius: 2px;
          text-align: left;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

          .title {
            height: 50px;
            font-size: 16px;
            color: #2c3e50;
            font-weight: bold;
            padding-left: 5px;
            position: relative;
            display: flex;
            align-items: center;
            cursor: pointer;

            span {
              margin-left: 5px;
            }

            &:before {
              content: '';
              position: absolute;
              left: 2px;
              right: 2px;
              bottom: 0;
              height: 1px;
              background: #ececec;
            }
          }

          .item {
            padding: 2px;
            color: #808080;

            .sub-title {
              height: 36px;
              line-height: 36px;
              padding-left: 15px;
              border-radius: 2px;
              cursor: pointer;
              display: flex;
              align-items: center;

              span {
                margin-left: 2px;
              }

              &:hover {
                background: #3388FF;
                color: #fff;
              }
            }

            .option {
              height: 32px;
              line-height: 32px;
              padding-left: 35px;
              cursor: pointer;

              &:hover {
                background: lighten(#3388ff, 10%);
                color: #fff;
              }
            }
          }
        }
      }
    }

    .right {
      position: absolute;
      top: 4px;
      left: 210px;
      background: #fff;
      border-radius: 2px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
      height: 60px;
      right: 4px;

      .handle-wrapper {
        height: 60px;
        overflow: hidden;
        display: flex;
        align-items: center;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);

        .name {
          color: #26364D;
          font-size: 17px;
          font-weight: bold;
          padding: 0 30px;
        }

        .time {
          height: 50px;
          margin: 0px 20px 0 5px;
          background: #f5f5f5;
          border-radius: 5px;
          display: flex;
          align-items: center;
          padding: 0 15px;

          img {
            display: block;
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }

          span {
            // color: #26364D;
            // font-size: 17px;
            // font-weight: bold;
            .date-picker {
              width: 125px;

              >>>.ivu-input {
                font-size: 16px !important;
                font-weight: bold !important;
              }
            }
          }
        }

        .item-quantity {
          width: 80px;
          display: flex;
          flex-flow: column;

          i {
            font-style: normal;
            font-size: 18px;
            color: #26364D;
            font-weight: bold;
          }

          span {
            font-size: 12px;
            color: #26364D;
          }
        }

        .item {
          height: 40px;
          padding: 0 10px;
          background: #F5F5F5;
          border-radius: 5px;
          margin: 0 5px;
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            display: block;
            width: 24px;
            height: 24px;
            margin-right: 5px;
          }

          &:hover {
            background: darken(#f5f5f5, 5%);
          }

          &:active {
            background: darken(#f5f5f5, 10%);
          }
        }

        .refresh-wrapper {
          flex: 1;
          text-align: right;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>