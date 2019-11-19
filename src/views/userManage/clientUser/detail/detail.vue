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
            <i class="iconfont iconyonghu"></i>
            <span>真实姓名</span>
          </div>
          <div class="text">{{realName ? realName : '暂无资料'}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconnicheng"></i>
            <span>用户昵称</span>
          </div>
          <div class="text">{{nickName ? nickName : '暂无资料'}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>用户手机</span>
          </div>
          <div class="text">{{phone}}</div>
        </div>
      </div>
    </div>

    <Tabs name="clientUserTabs" style="margin-top:30px;" v-if="isShow">
      <TabPane
        label="分享人信息"
        tab="clientUserTabs"
        v-if="$options.filters.auth(['userM.client.detail.share.view'])"
        icon="null iconfont iconjiaren1"
      >
        <Share :userNumber="userNumber"></Share>
      </TabPane>
      <TabPane
        label="联系人信息"
        tab="clientUserTabs"
        v-if="$options.filters.auth(['userM.client.detail.linkman.view'])"
        icon="null iconfont icongeren"
      >
        <linkman :userNumber="userNumber" :isShow="isShow"></linkman>
      </TabPane>
      <TabPane
        label="家人信息"
        tab="clientUserTabs"
        v-if="$options.filters.auth(['userM.client.detail.familyUser.view'])"
        icon="null iconfont iconjiaren1"
      >
        <family-list :userNumber="userNumber"></family-list>
      </TabPane>
      <TabPane
        label="申请社区"
        tab="clientUserTabs"
        v-if="$options.filters.auth(['communityM.applyList.view'])"
        icon="null iconfont iconjiaru"
      >
        <apply-community :searchIsShow="false" :phone="phone"></apply-community>
      </TabPane>
      <TabPane
        label="社区信息"
        tab="clientUserTabs"
        v-if="$options.filters.auth(['communityM.residentInfo.view'])"
        icon="null iconfont iconjianzhuwu"
      >
        <resident-info :searchIsShow="false" :phone="phone"></resident-info>
      </TabPane>
      <TabPane
        label="安装区域"
        tab="clientUserTabs"
        v-if="$options.filters.auth(['hostM.installArea.view'])"
        icon="null iconfont iconfl-jia"
      >
        <install-area :searchIsShow="false" :phone="phone"></install-area>
      </TabPane>
      <TabPane
        label="防盗主机"
        tab="clientUserTabs"
        v-if="$options.filters.auth(['hostM.security.view'])"
        icon="null iconfont iconzhujiruqinfangyu"
      >
        <!-- 防盗主机-start -->
        <security-host :searchIsShow="false" :phone="phone"></security-host>
        <!-- 防盗主机-end -->
      </TabPane>
    </Tabs>
  </Modal>
</template>
<script>
import { getClientUserDetail } from "@/api/userManage";
import Share from "./share";
import FamilyList from "./familyList";
import ApplyCommunity from "@/views/communityManage/applyCommunity/applyCommunity";
import InstallArea from "@/views/hostManage/installArea/installArea";
import SecurityHost from "@/views/hostManage/securityHost/securityHost";
import Linkman from "./linkman/linkman";
import ResidentInfo from "@/views/communityManage/residentInfo/residentInfo";
export default {
  components: {
    Share,
    FamilyList,
    ApplyCommunity,
    ResidentInfo,
    InstallArea,
    SecurityHost,
    Linkman
  },
  props: {
    userNumber: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      realName: null, // 真实姓名
      nickName: null //昵称
    };
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
      getClientUserDetail({
        userNumber: this.userNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          let { nickName, realName } = data;
          this.nickName = nickName;
          this.realName = realName;
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
.divider {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 30px 0;
}

>>>.ivu-tree-children>li {
  margin-top: 0;
}
</style>


