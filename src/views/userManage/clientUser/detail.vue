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
      <TabPane label="分享人信息" tab="clientUserTabs" icon="null iconfont iconjiaren1">
        <!-- 家人信息 -->
        <Table
          border
          stripe
          highlight-row
          :loading="shareTabIsLoading"
          :columns="shareTabCol"
          :data="shareTabData"
        ></Table>
        <!-- 家人信息 -->
      </TabPane>
      <TabPane label="联系人信息" tab="clientUserTabs" icon="null iconfont icongeren">
        <defence-area :userNumber="userNumber" :isShow="isShow"></defence-area>
      </TabPane>
      <TabPane label="家人信息" tab="clientUserTabs" icon="null iconfont iconjiaren1">
        <!-- 家人信息 -->
        <Table
          border
          stripe
          highlight-row
          :loading="tabIsLoading"
          :columns="FamilyTabCol"
          :data="FamilyTabData"
        ></Table>
        <!-- 家人信息 -->
      </TabPane>
      <TabPane label="申请社区" tab="clientUserTabs" v-if="$options.filters.auth(['communityM.applyList.view'])" icon="null iconfont iconjiaru">
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
import {
  getClientUserDetail,
  getFalimyInfo,
  getShareInfo
} from "@/api/userManage";
import ApplyCommunity from "@/views/communityManage/applyCommunity/applyCommunity";
import InstallArea from "@/views/hostManage/installArea/installArea";
import SecurityHost from "@/views/hostManage/securityHost/securityHost";
import DefenceArea from "./defenceArea/defenceArea";
import ResidentInfo from "@/views/communityManage/residentInfo/residentInfo";
export default {
  components: {
    ApplyCommunity,
    ResidentInfo,
    InstallArea,
    SecurityHost,
    DefenceArea
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
      macStatusList: {
        // 防盗主机状态列表
        // 主机状态列表
        布防: {
          name: "布防",
          class: "cell-success"
        },
        撤防: {
          name: "撤防",
          class: "cell-warning"
        },
        留守布防: {
          name: "留守布防",
          class: "cell-success"
        }
      },
      shareTabIsLoading: false, //分享人信息table是否在loading
      tabIsLoading: false, // 家人信息table是否在loading
      shareList: [], // 分享人信息
      areaList: [], //用户我家数据
      realName: null, // 真实姓名
      nickName: null //昵称
    };
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        this.getDetail();
        this.getShareInfo();
      }
    }
  },
  computed: {
    shareTabCol() {
      return [
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center"
        },
        {
          title: "姓名",
          key: "shareUserName",
          width: 120
        },
        {
          title: "电话",
          key: "shareUserPhone",
          width: 120
        },
        {
          title: "分享时间",
          key: "createTime",
          minWidth: 120
        }
      ];
    },
    shareTabData() {
      let tabData = [];
      console.log(this.shareList);
      for (let i = 0; i < this.shareList.length; i++) {
        let { shareUserName, shareUserPhone, createTime } = this.shareList[i];
        tabData.push({
          shareUserName, // 姓名
          shareUserPhone, // 电话
          createTime: this.$options.filters.formatTime(createTime) // 分享时间
        });
      }
      return tabData;
    },
    FamilyTabCol() {
      return [
        {
          title: "家人姓名",
          key: "contactName",
          minWidth: 120
        },
        {
          title: "联系方式",
          key: "contactPhone",
          minWidth: 150
        }
      ];
    },
    FamilyTabData() {
      let tabData = [];
      for (let i = 0; i < this.list.length; i++) {
        let { contactName, contactPhone } = this.list[i];
        tabData.push({
          contactName,
          contactPhone
        });
      }
      return tabData;
    }
  },
  methods: {
    loadData(item, callback) {
      setTimeout(() => {
        const data = [
          {
            title: "children",
            loading: false,
            children: []
          },
          {
            title: "children",
            loading: false,
            children: []
          }
        ];
        callback(data);
      }, 1000);
    },
    /**
     * 获取分享人信息
     */
    getShareInfo() {
      getShareInfo({
        userNumber: this.userNumber
      }).then(({ data, errorCode }) => {
        this.tabIsLoading = false;
        if (errorCode === 0) {
          if (data) {
            this.shareList = data;
            console.log(this.shareList);
          } else {
            this.shareList = [];
            this.page.total = 0;
          }
        }
      });
    },
    /**
     * 获取家人信息
     */
    getList() {
      this.tabIsLoading = true;
      getFalimyInfo({
        userNumber: this.userNumber
      }).then(({ data, errorCode }) => {
        this.tabIsLoading = false;
        if (errorCode === 0) {
          if (data) {
            this.list = data;
            console.log(this.list);
          } else {
            this.list = [];
            this.page.total = 0;
          }
        }
      });
    },
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


