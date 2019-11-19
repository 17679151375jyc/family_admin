<template>
  <Modal :title="`警情视频-${name}`" v-model="visible" :mask-closable="false" :width="800">
    <div class="playContainer">
      <div id="playWind" class="playWind"></div>
      <Spin fix v-show="isLoading"></Spin>
    </div>

    <div slot="footer">
      <Button type="primary" @click="start">初始化播放</Button>
      <!-- <Button type="info" @click="pause">暂停</Button> -->
      <Button type="warning" @click="stop">结束播放</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    deviceNumber: {
      type: String,
      default: ""
    },
    startTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    },
    token: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      decoder: null,
      isLoading: false
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      if (val) {
        this.isLoading = true;
        this.decoder = null;
        this.decoder = new EZUIKit.EZUIPlayer({
          id: "playWind",
          autoplay: true,
          url: `ezopen://YMAWML@open.ys7.com/${this.deviceNumber}/1.rec?begin=${this.startTime}&end=${this.endTime}`,
          accessToken: this.token,
          //       process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ?
          // '/FamilyBack/' :
          // '/'
          decoderPath:
            process.env.NODE_ENV === "production"
              ? "/FamilyBack/static"
              : "/static",
          width: 767,
          height: 511,
          handleError: e => {
            console.log("handleError", e);
            this.$Message.error({
              title: ``,
              content: "错误代码：" + e.retcode + "，信息：" + e.msg,
              duration: 5,
              closable: true
            });
          },
          handleSuccess: e => {
            this.isLoading = false;
            console.log("handleSuccess", "播放成功");
          }
        });
        // this.decoder.play()
      } else {
        this.decoder.stop();
      }
      this.$emit("input", val);
    }
  },
  mounted() {},
  methods: {
    start() {
      this.isLoading = true;
      this.decoder &&
        this.decoder.play({
          handleSuccess: e => {
            this.isLoading = false;
            console.log("handleSuccess", "播放成功");
          }
        });
    },
    pause() {
      this.decoder && this.decoder.pause();
    },
    stop() {
      this.isLoading = false;
      this.$Spin.hide();
      this.decoder && this.decoder.stop();
    }
  }
};
</script>
<style lang="stylus" scoped>
.playContainer {
  width: 767px;
  height: 511px;
  position: relative;
}

.playWind {
  position: relative;
}

>>>.play-window {
  border-color: #999 !important;
}
</style>