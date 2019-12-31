<template>
  <div>
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
              <i class="iconfont iconshijian01"></i>
              <span>安装时间</span>
            </div>
            <div class="text">{{ info.createTime }}</div>
          </div>
          <div class="item" v-if="info.type!=2">
            <div class="label">
              <i class="iconfont iconshijian01"></i>
              <span>服务到期时间</span>
            </div>
            <div class="text">{{ info.effectiveTime }}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconfl-jia"></i>
              <span>区域名称</span>
            </div>
            <div class="text">{{ info.areaName }}</div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont icongongsi"></i>
              <span>小区名称</span>
            </div>
            <div class="text">{{ info.plotName }}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconicon-test"></i>
              <span>楼座号码</span>
            </div>
            <div class="text">{{ info.buildingName }}</div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont iconmenchuangmenchuangwujinanzhuang"></i>
              <span>门牌号码</span>
            </div>
            <div class="text">{{ info.doorName }}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconquyuditu"></i>
              <span>所在区域</span>
            </div>
            <div
              class="text"
            >{{ info.provinceName }}-{{ info.cityName }}-{{ info.zoneName }}-{{ info.streetName }}</div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont icondizhi1"></i>
              <span>详细地址</span>
            </div>
            <div class="text">{{ info.address }}</div>
          </div>
        </div>
        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont icondituzhankai"></i>
              <span>目标位置</span>
            </div>
            <div class="text">
              <Button type="primary" size="small" @click="showMarker">查看地图</Button>
            </div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont icondituzhankai"></i>
              <span>用户分类</span>
            </div>
            <div class="text">
              {{info.type | statusName('AreaType')}}
            </div>
          </div>
        </div>
      </div>
      <!-- <Modal title="目标地点" v-model.trim="mapIsShow" footer-hide :mask-closable="false" width="800">
      <div id="map" style="width: 100%;height: 500px;"></div>
      </Modal>-->
    </Modal>

    <!-- 地图显示坐标点-start -->
    <amap-marker v-model="map.isShow" :longitude="map.longitude" :latitude="map.latitude"></amap-marker>
    <!-- 地图显示坐标点-end -->
  </div>
</template>
<script>
import { getDefenceAreaBySecurityDetail } from "@/api/hostManage";
import AmapMarker from "@/components/amapMarker/amapMarker";
export default {
  components: { AmapMarker },
  props: {
    id: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      mapIsShow: false,
      info: {
        address: null, // 地址
        area: null, //
        areaName: null, // 区域名称
        areaNumber: "", //
        buildingName: "", //楼座
        buildingNumber: null, //
        city: null, //
        cityName: null, //市名
        createTime: null, //安装时间
        deleteState: null, //删除标志
        doorName: null, //门号
        doorNumber: null, //
        effectiveTime: null, //服务到期时间
        id: null, //
        plotName: null, //小区名称
        plotNumber: null, //
        province: null, //
        provinceName: null, //省名
        street: null, //
        streetName: null, //街道名
        type: null, // 类型，0安防，1商铺，2备城门
        userNumber: null, //
        zoneName: null //区名
      },
      map: {
        isShow: false,
        longitude: null,
        latitude: null
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
      console.log(this.id);
      // 获取账号详情
      getDefenceAreaBySecurityDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        console.log(data);
        if (data) {
          let {
            address, // 地址
            areaName, // 区域名称
            buildingName, //楼座
            cityName, //市名
            createTime, //安装时间
            deleteState, //删除标志
            doorName, //门号
            effectiveTime, //服务到期时间
            plotName, //小区名称
            provinceName, //省名
            streetName, //街道名
            type, // 类型，0安防，1商铺，2备城门
            zoneName, //区名
            longitude,
            latitude
          } = data;
          this.info = {
            address, // 地址
            areaName, // 区域名称
            buildingName, //楼座
            cityName, //市名
            createTime: this.$options.filters.formatTime(createTime), //安装时间
            deleteState, //删除标志
            doorName, //门号
            effectiveTime: this.$options.filters.formatTime(effectiveTime), //服务到期时间
            plotName, //小区名称
            provinceName, //省名
            streetName, //街道名
            type, // 类型，0安防，1商铺，2备城门
            zoneName, //区名
            longitude,
            latitude
          };
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * 显示坐标点在地图上
     */
    showMarker() {
      console.log("点击触发显示marker弹窗");
      this.map.isShow = true;
      this.map.longitude = this.info.longitude;
      this.map.latitude = this.info.latitude;
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


