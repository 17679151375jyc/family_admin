<template>
  <Modal
    title="详情" 
    footer-hide
    v-model.trim="isShow" 
    :mask-closable="false" 
    :loading="loading" 
    :closable="false"
    :width='700'>
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->
    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区名称</span>
          </div>
          <div class="text">
            {{ info.globleStatus?
              `${info.provinceName}-
              ${info.cityName}-
              ${info.areaName}-
              ${info.streetName}-
              ${info.plotName}`
              :'全部小区'
               }}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconguanggao"></i>
            <span>广告是否有效</span>
          </div>
          <div class="text">{{ info.effective?'无效':'有效' }}</div>
        </div>       
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian01"></i>
            <span>轮播时间</span>
          </div>
          <div class="text">{{ info.time }}秒</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconwenhao"></i>
            <span>是否全局</span>
          </div>
          <div class="text">{{ info.globleStatus?'否':'是' }}</div>
        </div>       
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian1"></i>
            <span>广告logo</span>
          </div>
          <div class="text">
            <!-- <img :src="info.url"> -->
            <viewer :images="[info.facePicture]" style="margin:10px;">
              <div class="flex-imgs">
                <div class="img-item">
                  <img :src="info.url" />
                </div>
                <span style="font-size: 12px;">点击图片查看大图</span>
              </div>
            </viewer>
          </div>
        </div>     
      </div>
    </div>
  </Modal>
</template>
<script>
import { getAdvertisementDetail } from "@/api/communityManage";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      info: {
        id: null,
        time: null, //轮播时间
        url: null, //广告图片
        plotNumber: null, //小区number
        effective: null, //是否有效
        globleStatus: null, //是否全局
        provinceCode: null,//省号
        cityCode: null,//城号
        areaCode: null,//区号
        streetCode: null,//街道号
        provinceName: null,//省名
        cityName: null,//市名
        areaName: null,//区名
        streetName: null,//街道名
        plotName: null,//小区名
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.getList();
    },
  },
  methods: {
    getList(){
      console.log(this.id)
      getAdvertisementDetail({
        id: this.id
      }).then(({ data, errorCode })=>{
        if(errorCode === 0){
          if(data){
            this.info = data
            console.log( this.info )
          }
        }
      })
    },
    handleClose() {
      this.$emit("handleClose");
    },
  }
};
</script>
<style lang="stylus" scoped>
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
.img-div {
  display: flex;
  width: 250px;
  height: 250px;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>


