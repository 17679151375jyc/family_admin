<template>
  <Modal
    title="详情"
    footer-hide
    v-model.trim="visible"
    :mask-closable="false"
    :loading="loading"
    :width="700"
  >
    <!-- 右上角关闭按钮-start -->
    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconleixing-guibingjiedian"></i>
            <span>广告类型</span>
          </div>
          <div class="text">{{info.type | statusName('AdvertisementType')}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>有效时间</span>
          </div>
          <div class="text">{{ $moment(info.effectiveTime*1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
      </div>
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
            }}
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconguanggao"></i>
            <span>广告是否有效</span>
          </div>
          <div class="text">{{ info.effective?'无效':'有效' }}</div>
        </div>
      </div>

      <div class="row" v-if='!info.effective'>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>广告生效时间</span>
          </div>
          <div class="text">{{ $moment(info.startTime*1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconwenhao"></i>
            <span>是否分时广告</span>
          </div>
          <div class="text">{{ info.glodenStatus?'是':'否' }}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijianduan"></i>
            <span>分时时间段</span>
          </div>
          <div class="text">{{getGlodenTime(info.glodenStart, info.glodenEnd)}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item" v-if="info.type!==0">
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
            <i class="iconfont iconneirongguanli"></i>
            <span>备注</span>
          </div>
          <div class="text">{{ info.remark }}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icontupian1"></i>
            <span>{{info.type===0?'广告视频':(info.type===1?'广告图片':'')}}</span>
          </div>
          <div class="text" v-if="info.type === 1">
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
          <div class="text" v-if="info.type === 0 && visible && info.url">
            <video controls autoplay name="media" class="video-div">
              <source :src="info.url" type="video/mp4" />
            </video>
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
    value: {
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
    }
  },
  data() {
    return {
      visible: false,
      info: {
        id: null,
        time: null, //轮播时间
        url: null, //广告图片
        plotNumber: null, //小区number
        effective: null, //是否有效
        startTime: null,//生效时间
        glodenStatus: null,//是否分时广告
        glodenStart: null,//分时开始时间
        glodenEnd: null,//分时结束时间
        globleStatus: null, //是否全局
        provinceCode: null, //省号
        cityCode: null, //城号
        areaCode: null, //区号
        streetCode: null, //街道号
        provinceName: null, //省名
        cityName: null, //市名
        areaName: null, //区名
        streetName: null, //街道名
        plotName: null, //小区名
        remark: null, // 备注
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.getDetail();
      } else {
          this.info.url = null
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getGlodenTime(startTime, endTime){      
      startTime = startTime<10? '0'+ startTime : startTime + ''
      startTime = startTime.indexOf('.') > -1?startTime.replace('.', ':'):startTime + ':00'
      startTime = startTime.length<5?startTime+'0':startTime
      endTime = endTime<10? '0'+ endTime : endTime + ''
      endTime = endTime.indexOf('.') > -1?endTime.replace('.', ':'):endTime + ':00'
      endTime = endTime.length<5?endTime+'0':endTime
      if(this.info.glodenStatus){
        return startTime + '-' + endTime
      }else{
        return '00:00-24:00'
      }
    },
    getDetail() {
      getAdvertisementDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (data) {
            this.info = data;
            console.log(this.info);
          }
        }
      });
    }
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
.video-div{
    width: 300px;
    height:200px;
    background:#000;
    margin: 10px 0;
}
</style>


