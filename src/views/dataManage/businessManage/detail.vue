<template>
<div>
  <Modal title="详情" footer-hide v-model.trim="visible" :mask-closable="false" width="800">
    <!-- 右上角关闭按钮-start -->
    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>商家名称</span>
          </div>
          <div class="text">{{info.businessName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>联系人</span>
          </div>
          <div class="text">{{info.contactName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>联系电话</span>
          </div>
          <div class="text">{{info.contactPhone}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconiconset0254"></i>
            <span>是否有效</span>
          </div>
          <div class="text">{{info.isEffective ? '有效' : '无效'}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconquyuditu"></i>
            <span>省市区街道</span>
          </div>
          <div
            class="text"
          >{{info.provinceName ? info.provinceName + info.cityName + info.areaName + info.streetName: ''}}</div>
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
              <span>目标位置</span>
            </div>
            <div class="text">
              <Button type="primary" size="small" @click="showMarker">查看地图</Button>
            </div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont iconshijian01"></i>
              <span>更新时间</span>
            </div>
            <div class="text">{{$moment(info.updateTime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian"></i>
            <span>营业执照</span>
          </div>
          <div class="text">
            <viewer :images="[info.businessLicense]" style="margin:10px;" v-if="info.businessLicense">
              <div class="flex-imgs">
                <div class="img-item">
                  <img :src="info.businessLicense" />
                </div>
                <span style="font-size: 12px;">点击图片查看大图</span>
              </div>
            </viewer>
            <span v-if="!info.businessLicense">暂无上传营业执照</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian"></i>
            <span>商家简介</span>
          </div>
          <div class="text">
            {{info.description}}
          </div>
        </div>
      </div>
      
    </div>
  </Modal>
  <!-- 地图显示坐标点-start -->
    <amap-marker v-model="map.isShow" :longitude="map.longitude" :latitude="map.latitude"></amap-marker>
    <!-- 地图显示坐标点-end -->
    </div>
</template>
<script>
import { getBusinessDetail } from "@/api/dataManage";
import AmapMarker from "@/components/amapMarker/amapMarker";
export default {
    components: { AmapMarker },
  props: {
    id: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      info: {},
      map: {
          isShow:false,
          longitude:null,
          latitude: null
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.getDetail();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
    // isShow: async function(val, oldVal) {
    //   if (val) {
    //     this.getDetail();
    //   }
    // }
  },
  methods: {
    /**
     * 获取用户详情
     */
    getDetail() {
      // 获取账号详情
      getBusinessDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
        }
      });
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
.divider {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 30px 0;
}

>>>.ivu-tree-children>li {
  margin-top: 0;
}

.flex-imgs {
  width: 100px;
  height: 130px;
  display: inline-block;
  margin-right: 10px;

  .img-item {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);

    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }
  span {
    display: block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
}
</style>


