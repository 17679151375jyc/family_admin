<template>
  <Modal
    title="详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="1000"
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
                <i class="iconfont icongongsi"></i>
                <span>小区名称</span>
            </div>
            <div class="text">{{info.plotName}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconshouji"></i>
                <span>小区手机号</span>
            </div>
            <div class="text">{{info.plotPhone}}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
            <div class="label">
                <i class="iconfont iconsuobanxin"></i>
                <span>预约车数量</span>
            </div>
            <div class="text">{{info.temporaryCount}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconsuobanxin"></i>
                <span>人脸免费个数</span>
            </div>
            <div class="text">{{info.faceCount}}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
            <div class="label">
                <i class="iconfont iconsuobanxin"></i>
                <span>加入社区账号个数</span>
            </div>
            <div class="text">{{info.accountCount}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconleixing-guibingjiedian"></i>
                <span>收费类型</span>
            </div>
            <div class="text">{{info.payType==0?'购买':(info.payType==1?'租用':'运营')}}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
            <div class="label">
                <i class="iconfont iconId"></i>
                <span>是否需填身份证</span>
            </div>
            <div class="text">{{info.isIdentity?'需要':'不需要'}}</div>
            </div>
             <div class="item">
            <div class="label">
                <i class="iconfont iconleixing-guibingjiedian"></i>
                <span>小区类型</span>
            </div>
            <div class="text">{{info.communityCanUse? "用于社区和安装区域":"仅用于安装区域"}}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
            <div class="label">
                <i class="iconfont iconquyuditu"></i>
                <span>省市区街道</span>
            </div>
            <div class="text">{{info.provinceName}}-{{info.cityName}}-{{info.areaName}}-{{info.streetName}}</div>
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
                <i class="iconfont iconshijian"></i>
                <span>有效时间</span>
            </div>
            <div class="text">{{info.payType!==2?this.$moment(info.effectiveTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              ):effectiveTime+'天'}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconshijian"></i>
                <span>创建时间</span>
            </div>
            <div class="text">{{this.$moment(info.createTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )}}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
            <div class="label">
                <i class="iconfont iconmiaoshu"></i>
                <span>备注</span>
            </div>
            <div class="text">{{info.remark}}</div>
            </div>
        </div>

    </div>

    
  </Modal>
</template>
<script>
import { getPlotDetail } from "@/api/dataManage";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    number: {
      type: String,
      default: null
    },
  },
  data() {
    return {
        info: {
            plotName: null,//小区名称
            address:null,                    //详细地址
            latitude: null,                //经度
            longitude:null,              //纬度
            communityCanUse: null,//小区类型
            provinceName:null,
            cityName: null,
            areaName: null,
            streetName: null,
            temporaryCount: null,          //预约车数量
            faceCount: null,               //人脸免费个数
            accountCount: null,            //加入社区账号个数
            payType: null,                 //收费类型0购买1租用2运营
            effectiveTime: null,  //有效时间(收费类型01为具体时间2为天数)
            remark: null,                 //备注
            isIdentity: null,              //是否需填身份证(0不1需)
            idcardStatus: null,
            realNameStatus: null,
            phoneStatus: null,
            createTime: null,     //创建时间
            plotPhone: null   //小区手机号
        }
    }
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    /**
     * 获取用户详情
     */
    getDetail() {
      // 获取账号详情
      getPlotDetail({
        number: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data
          console.log(this.info)
        }
      });
      
    },
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
>>>.tab-wrapper .row .item .label{
    flex: 0 0 150px;
}
</style>


