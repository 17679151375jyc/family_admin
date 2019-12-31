<template>
  <Modal title="目标位置" v-model.trim="visible" footer-hide :mask-closable="false" width="800">
    <div id="map" class="map"></div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: Number,
      default: 113.094942
    },
    latitude: {
      type: Number,
      default: 22.590431
    }
  },
  data() {
    return {
      visible: false,
      map: null,
      marker: null
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.map = new AMap.Map("map", {
          resizeEnable: true,
          center: [this.longitude, this.latitude],
          zoom: 18
        });
        this.marker = new AMap.Marker({
          position: this.map.getCenter(),
        //   icon:
        //     "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        //   offset: new AMap.Pixel(-13, -30)
        });
        this.marker.setMap(this.map);
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  mounted() {}
};
</script>
<style lang="stylus" scoped>
.map {
  width: 100%;
  height: 500px;
}
</style>