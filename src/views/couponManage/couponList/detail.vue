<template>
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
          <div class="text">
            <span
              :class="[info.isEffective ? 'cell-success':'cell-error']"
            >{{info.isEffective ? '有效' : '无效'}}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>优惠券名称</span>
          </div>
          <div class="text">{{info.couponName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>类型</span>
          </div>
          <div class="text">{{info.type | statusName('CouponType')}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>本金</span>
          </div>
          <div class="text">
            <span
              :class="{'cell-success': info.originPrice > 0 , 'cell-error': info.originPrice < 0}"
            >{{info.originPrice > 0 ? `收益${info.originPrice}` : (info.originPrice < 0 ? `亏损${Math.abs(info.originPrice)}`: info.originPrice )}}元</span>
          </div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>优惠券价值</span>
          </div>
          <div
            class="text"
          >{{`${info.type===0 ? (info.businessValue*10).toFixed(2) : info.businessValue}${info.type===0 ? '折':(info.type===1? '元': '')}`}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>使用条件</span>
          </div>
          <div class="text">满{{info.enoughPrice}}元可用</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>库存</span>
          </div>
          <div class="text">{{info.stock}}张</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>每个账号最多可用此券多少张</span>
          </div>
          <div class="text">{{info.restrictionNumber}}张</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>有效时间</span>
          </div>
          <div class="text">{{$moment(info.effectiveTime*1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconchengshifuwu"></i>
            <span>描述</span>
          </div>
          <div class="text">{{info.description || '无相关描述'}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconzhujiruqinfangyu"></i>
            <span>优惠卷二维码</span>
          </div>
          <div class="text" ref="qrCodeDivAll">
            <div  ref="qrCodeDiv" style="float: left;"></div>

          </div>
        </div>
      </div>

    </div>
  </Modal>
</template>
<script>
import { getCouponDetail } from "@/api/couponManage";
import QRCode from "qrcodejs2";

export default {
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
        isShow: false,
        longitude: null,
        latitude: null
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.$refs.qrCodeDiv.innerHTML = ""; //清楚前一张二维码
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
    bindQRCode(val) {
      new QRCode(this.$refs.qrCodeDiv, {
        text: val,
        width: 160,
        height: 160,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
      });
    },
    /**
     * 获取用户详情
     */
    getDetail() {
      // 获取账号详情
      getCouponDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          this.bindQRCode(`https://mahu.cyjaf.cn/othersHtml/scan.html?id=${this.info.id}&type=coupon`)
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

.tab-wrapper .row .item .label {
  flex: 0 0 132px;
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


