<template>
  <Modal title="坐标选择" v-model.trim="isShow" :mask-closable="false" :closable="false" width="900">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->
    <div class="map-wrapper">
      <!-- <div class="container" id="mapwrapper"></div> -->
      <el-amap
        class="container"
        :center="center"
        :amap-manager="amapManager"
        :zoom="zoom"
        :events="events"
      >
        <el-amap-marker vid="marker" :position="marker.position" v-if="marker.position[0]"></el-amap-marker>
      </el-amap>
      <div class="info">
        <Form inline>
          <FormItem style="width:400px;">
            <Input placeholder="输入详细地址搜索" v-model.trim="keyword" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search">搜索</Button>
          </FormItem>
          <FormItem label="当前选择经纬度为" style="width: 260px;">
            <Tag
              :color="marker.position[0] ? 'success' : 'error'"
            >{{ marker.position[0] ? marker.position.join(',') : '未选择坐标'}}</Tag>
          </FormItem>
        </Form>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit">确定</Button>
    </div>
  </Modal>
</template>
<script>
import Vue from "vue";
import VueAMap from "vue-amap";
import config from '@/config/index'
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: config.amap.key,
  plugin: [
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.Geocoder",
    "PlaceSearch"
  ],
  v: "1.4.15"
});
let amapManager = new VueAMap.AMapManager();
var placeSearch;
export default {
  props: {
    address: {
      type: String,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: Number,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    }
  },
  data() {
    let self = this;
    return {
      keyword: null,
      zoom: 16,
      center: [113.094942, 22.590431],
      amapManager,
      marker: {
        position: [null, null]
      },
      placeSearch: null,
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          // 点击后重新设置marker的值
          self.marker.position = [lng, lat];
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function(status, result) {
            console.log(status, result);
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                // self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        },
        init(o) {
          placeSearch = new AMap.PlaceSearch({ city: "全国" });
          console.log(placeSearch.search);
          //   let marker = new AMap.Marker({
          //     position: [121.59996, 31.197646]
          //   });

          //   marker.setMap(o);
        }
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.keyword = this.address;
        if (this.longitude) {
          this.marker.position[0] = this.longitude;
          this.marker.position[1] = this.latitude;
          this.getLngLatByAddress(false);
        } else {
          this.getLngLatByAddress(true);
        }
      }
    }
  },
  methods: {
    getLngLatByAddress(isSearch = false) {
      // 通过输入地址获取经纬度
      placeSearch.search(this.keyword, (status, result) => {
        console.log("开始搜索");
        if (
          result &&
          result.poiList &&
          result.poiList.pois &&
          result.poiList.pois.length > 0
        ) {
          let { lng, lat } = result.poiList.pois[0].location;
          console.log("地图中心点要移动到", lng, lat);

          if (!isSearch) {
            // 有传经纬度进来
            this.$Message.success("已切换到坐标地点");
            this.center = [this.longitude, this.latitude];
          } else {
            this.$Message.success("已切换到对应地点");
            this.center = [lng, lat];
          }
        } else {
          //   if (this.isShow) {
          //     this.$Message.warning("请输入详细地点");
          //   }
        }
      });
    },
    search() {
      this.getLngLatByAddress(true);
    },
    // change() {
    //   this.$set(this.marker, "position", [12.59996, 31.197646]);
    //   //   this.marker.position = [121.69996, 31.197646]
    // },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      if (!this.marker.position[0]) {
        this.$Message.warning("请点击地图选择对应坐标");
      } else {
        this.$emit("selLngLat", this.marker.position);
      }
    },
    test(lng, lat) {
      this.lng = lng;
      this.lat = lat;
    }
  }
};
</script>
<style lang="stylus" scoped>
>>>.ivu-form-item {
  margin-bottom: 0;
}

.map-wrapper {
  position: relative;

  .data-info {
    width: 400px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: absolute;
    right: 270px;
    top: 2px;
    padding: 10px;

    p {
      margin-bottom: 5px;
      color: grey;
    }

    .option {
      display: flex;
      border: 1px solid #ced4da;
      height: 30px;
      line-height: 30px;
      border-radius: 2px;
      margin-bottom: 5px;

      .left {
        flex: 0 0 60px;
        background: #e9ecef;
        text-align: center;
        border-right: 1px solid #ced4da;
      }

      .right {
        flex: 1;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .container {
    width: 100%;
    height: 500px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  }

  .info {
    position: absolute;
    top: 4px;
    right: 4px;
    padding-left: 10px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    padding: 10px;

    .tips {
      padding: 15px 0 10px 0;
      border-top: 1px solid #e8eaec;
      display: flex;
      align-items: center;
    }

    .lnglat {
      display: flex;
      align-items: center;

      span {
        font-size: 13px;
        margin-right: 15px;
      }
    }

    .items {
      border: 1px solid #2d8cf0;
      border-radius: 3px;
      padding: 0 10px;
      max-height: 498px;
      overflow-y: auto;

      .title {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #e8eaec;
        text-align: center;
        color: #2d8cf0;
      }

      .empty {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        color: #aaa;
      }

      .item {
        border-bottom: 1px solid #e8eaec;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;

        &:nth-last-child(1) {
          border: none;
        }

        span {
          cursor: pointer;
          display: flex;
          flex-direction: column;

          b {
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>