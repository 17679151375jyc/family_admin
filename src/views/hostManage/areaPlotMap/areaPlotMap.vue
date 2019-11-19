<template>
  <div class="win-wrapper">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="map">
      <!-- 地图容器-start -->
      <div id="area-plot-amap-container"></div>
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
          <!-- <div class="time">
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
          </div>-->
          <div class="item-quantity">
            <i>{{areaPointList.length}}</i>
            <span>安装区域</span>
          </div>
          <div class="item-quantity">
            <i>{{plotList.length}}</i>
            <span>小区</span>
          </div>

          <div class="item" @click="areaPointIsShow = !areaPointIsShow">
            <img
              :src="areaPointIsShow ? require('./icon_installation_show.png') : require('./icon_installation_hide.png')"
            />
            <span>{{areaPointIsShow?'显示安装区域':'隐藏安装区域'}}</span>
          </div>
          <div class="item" @click="plotIsShow = !plotIsShow">
            <!-- <img :src="require('./icon_security_show.png')" /> -->
            <img
              :src="areaPointIsShow ? require('./icon_region_show.png') : require('./icon_region_show.png')"
            />
            <span>{{plotIsShow ? '显示小区' : '隐藏小区'}}</span>
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

    <!-- 小区详情-start -->
    <plot-detail v-model="plotDetail.isShow" :plotNumber="plotDetail.plotNumber"></plot-detail>
    <!-- 小区详情-end -->

    <!-- 安装区域详情-start -->
    <area-detail
      v-model="areaDetail.isShow"
      :id="areaDetail.id"
      :plotNumber="areaDetail.plotNumber"
    ></area-detail>
    <!-- 安装区域详情-end -->
  </div>
</template>

<script>
import PlotDetail from "./plotDetail";
import AreaDetail from "./areaDetail";
import {
  getCityList,
  getAreaList,
  getProvinceAllInfo,
  getStreetList,
  getPlotList
} from "@/api/common";
import { getAreaPoints, getPlotPoints } from "@/api/hostManage";
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
    PlotDetail,
    AreaDetail
  },
  data() {
    return {
      spinShow: false,
      markerZIndex: 9999,
      map: null,
      areaPointList: [], // 巡更点
      areaPointMarkers: [], // 安装区域marker
      plotList: [], //小区列表
      plotMarkers: [], // 小区marker
      areaPointIsShow: true,
      plotDetail: {
        isShow: false,
        plotNumber: null
      },
      infoWindowIsShow: true,
      plotIsShow: true,
      areaDetail: {
        // 安装区域详情
        isShow: false,
        id: null,
        plotNumber: null
      },
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
    areaPointList: function(val, oldVal) {
      this.addAreaPointMarkers();
    },
    areaPointIsShow: function(val, oldVal) {
      this.addAreaPointMarkers();
    },
    plotList: function(val, oldVal) {
      // 把巡更人员的点添加到地图
      this.addPlotMarkers();
    },
    plotIsShow: function() {
      this.addPlotMarkers();
    },
    infoWindowIsShow: function() {
      this.addAreaPointMarkers();
      this.addPlotMarkers();
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
          this.spinShow = true;
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
        //   debugger
        // 如果全部都没传，就默认把当前市所有区加入
        for (let i = 0; i < this.areaList.length; i++) {
          let { code } = this.areaList[i];
          areas.push(code);
        }
      }
      //   debugger
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
      this.map = new AMap.Map("area-plot-amap-container", {
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
    getAreaPoints() {
      if (this.areas.length === 0) {
        this.spinShow = false;
        return;
      }
      getAreaPoints({
        streetCodes: this.streets.join(","),
        areaCodes: this.areas.join(","),
        plotNumbers: this.plotNumbers.join(",")
      }).then(({ data, errorCode }) => {
        this.spinShow = false;
        if (errorCode === 0) {
          this.areaPointList = data;
        }
      });
    },
    /**
     * 获取小区的点
     */
    getPlotPoints() {
      if (this.areas.length === 0) {
        this.spinShow = false;
        return;
      }
      getPlotPoints({
        communityCanUse: true,
        streetCodes: this.streets.join(","),
        areaCodes: this.areas.join(","),
        plotNumbers: this.plotNumbers.join(",")
      }).then(({ data, errorCode }) => {
        this.spinShow = false;
        if (errorCode === 0) {
          this.plotList = data;
        }
      });
    },
    /**
     * 显示巡更点详情
     */
    showAreaDetail(id, plotNumber) {
      this.areaDetail.isShow = true;
      this.areaDetail.id = id;
      this.areaDetail.plotNumber = plotNumber;
    },
    /**
     * 显示巡更人员详情
     */
    showPlotDetail(plotNumber) {
      this.plotDetail.isShow = true;
      this.plotDetail.plotNumber = plotNumber;
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
      this.plotDetail.isShow = false;
      this.areaDetail.isShow = false;
      this.map ? this.map.clearMap() : "";
      this.getAreaPoints(); // 查询对应的巡更点
      this.getPlotPoints(); // 查询对应的巡更人员
    },
    /**
     * 添加客户点到地图上
     */
    addAreaPointMarkers() {
      this.map && this.map.remove(this.areaPointMarkers);
      this.areaPointMarkers = [];
      if (this.areaPointIsShow) {
        for (let i = 0; i < this.areaPointList.length; i++) {
          let {
            id,
            areaName,
            areaNumber,
            provinceName,
            cityName,
            zoneName,
            streetName,
            plotName,
            plotNumber,
            buildingName,
            doorName,
            effectiveTime,
            longitude,
            latitude,
            address
          } = this.areaPointList[i];
          let options = {};
          if (this.infoWindowIsShow) {
            // 如果显示信息窗
            options = {
              map: this.map,
              position: [longitude, latitude],
              content: `<div class="point-info-window">
                <div class="left">
                    <div class="name">${areaName}</div>
                    <div class="phone">有效时间至：${this.$moment(
                      effectiveTime * 1000
                    ).format("YYYY-MM-DD HH:mm:ss")}</div>
                    <div class="address">${provinceName || ""}${cityName ||
                ""}${zoneName || ""}${streetName || ""}${plotName ||
                ""}${buildingName || ""}${doorName || ""}${address || ""}</div>
                </div>
                <div class="icon">
                    <img src="${require("./icon_customer.png")}" />
                </div>  
            </div>`,
              anchor: "bottom-center", //设置锚点
              offset: new AMap.Pixel(0, -35), //设置偏移量
              extData: i,
              clickable: true
            };
          } else {
            options = {
              map: this.map,
              position: [longitude, latitude],
              icon: require("./icon_customer.png"),
              offset: new AMap.Pixel(-35, -35), //设置偏移量
              extData: i,
              clickable: true
            };
          }
          let item = new AMap.Marker(options);
          //   this.map.add(item);

          AMap.event.addListener(item, "click", () => {
            this.markerZIndex = this.markerZIndex + 1;
            console.log(this.markerZIndex);
            item.setzIndex(this.markerZIndex);
            this.showAreaDetail(id, plotNumber);
          });
          this.areaPointMarkers.push(item);
        }
      }

      //   this.map && this.map.setFitView();
    },
    /**
     * 添加安保点到地图上
     */
    addPlotMarkers() {
      this.map && this.map.remove(this.plotMarkers);
      this.plotMarkers = [];
      if (this.plotIsShow) {
        for (let i = 0; i < this.plotList.length; i++) {
          let {
            communityCanUse,
            plotNumber,
            address,
            provinceName,
            cityName,
            areaName,
            streetName,
            plotName,
            longitude,
            latitude,
            companyName,
            fsUserNames
          } = this.plotList[i];
          if (longitude) {
            let options = {};
            if (this.infoWindowIsShow) {
              options = {
                map: this.map,
                content:
                  `<div class="plot-info-window">
                <div class="left">
                    <div class="name">${plotName}</div>
                    <div class="phone">${
                      communityCanUse ? companyName : "仅用于安装区域"
                    }</div>
                    <div class="address">${address}</div>
                </div>` +
                  `${
                    communityCanUse
                      ? `<div class="right">
                    <span>物管人数</span>
                    <i>${fsUserNames ? fsUserNames.length : 0}</i>
                </div>`
                      : ""
                  }` +
                  `
                <div class="icon">
                    <img src="${require("./icon_plot.png")}" />
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
                position: [longitude, latitude],
                icon: require("./icon_plot.png"),
                offset: new AMap.Pixel(-35, -35), //设置偏移量
                extData: i,
                clickable: true
              };
            }
            let item = new AMap.Marker(options);
            item.setzIndex(999 + i);
            AMap.event.addListener(item, "click", () => {
              this.markerZIndex = this.markerZIndex + 1;
              console.log(this.markerZIndex);
              item.setzIndex(this.markerZIndex);
              this.showPlotDetail(plotNumber);
            });
            this.plotMarkers.push(item);
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
  // position: relative;
  position: absolute;
  background: gray;

  .map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    #area-plot-amap-container {
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

      >>>.plot-info-window {
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
          border-color: #ffbb33;
          transition: all 0.5s;
        }

        &:hover:before {
          border-top-color: #ffbb33;
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

      >>>.marker-icon {
        width: 70px;
        height: 70px;
        position: relative;

        img {
          width: 70px;
          height: 70px;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
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