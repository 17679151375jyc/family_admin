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
                <span>公司名称</span>
            </div>
            <div class="text">{{info.name}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconshouji"></i>
                <span>公司类型</span>
            </div>
            <div class="text">{{ this.$options.filters.statusName(info.companyType, 'CompanyType')}}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
            <div class="label">
                <i class="iconfont iconyonghu"></i>
                <span>联系人</span>
            </div>
            <div class="text">{{info.linkman}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconshouji"></i>
                <span>联系电话</span>
            </div>
            <div class="text">{{info.linkphone}}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
            <div class="label">
                <i class="iconfont iconshifou"></i>
                <span>是否最小公司</span>
            </div>
            <div class="text">{{info.isMincompany?'是':'否'}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconid"></i>
                <span>公司代码</span>
            </div>
            <div class="text">{{info.code}}</div>
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
                <span>创建时间</span>
            </div>
            <div class="text">{{this.$moment(info.createTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )}}</div>
            </div>
            <div class="item">
            <div class="label">
                <i class="iconfont iconshijian"></i>
                <span>更新时间</span>
            </div>
            <div class="text">{{this.$moment(info.updateTime * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              )}}</div>
            </div>
        </div>

    </div>

    
  </Modal>
</template>
<script>
import { getCompanyDetail } from "@/api/dataManage";
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
    id: {
      type: String,
      default: null
    },
  },
  data() {
    return {
        info: {
            name: null,//公司名称
            linkman: null,//联系人
            linkphone: null,//联系电话
            address: null,
            createTime: null,//创建时间
            updateTime: null,//更新时间
            provinceName: null,
            cityName: null,
            areaName: null,
            streetName: null,
            isMincompany: null,//是否最小公司
            companyType: null,//公司类型
            code: null,//公司代码
            rank:null
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
      getCompanyDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
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
    // flex: 0 0 150px;
}
</style>


