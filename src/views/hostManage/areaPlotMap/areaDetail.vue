<template>
  <div>
    <Modal v-model="visible" title="安装区域详情" width="1000" footer-hide>
      <div class="tab-wrapper">
        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconshijian01"></i>
              <span>安装时间</span>
            </div>
            <div
              class="text"
            >{{ this.$moment(info.createTime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont iconshijian01"></i>
              <span>服务到期时间</span>
            </div>
            <div
              class="text"
            >{{ this.$moment(info.effectiveTime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconfl-jia"></i>
              <span>区域名称</span>
            </div>
            <div class="text">{{ info.areaName }}</div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont icongongsi"></i>
              <span>小区名称</span>
            </div>
            <div class="text">{{ info.plotName }}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconicon-test"></i>
              <span>楼座号码</span>
            </div>
            <div class="text">{{ info.buildingName }}</div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont iconmenchuangmenchuangwujinanzhuang"></i>
              <span>门牌号码</span>
            </div>
            <div class="text">{{ info.doorName }}</div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="label">
              <i class="iconfont iconquyuditu"></i>
              <span>所在区域</span>
            </div>
            <div
              class="text"
            >{{ info.provinceName }}-{{ info.cityName }}-{{ info.zoneName }}-{{ info.streetName }}</div>
          </div>
          <div class="item">
            <div class="label">
              <i class="iconfont icondizhi1"></i>
              <span>详细地址</span>
            </div>
            <div class="text">{{ info.address }}</div>
          </div>
        </div>
      </div>

      <Tabs style="margin-top:30px;">
        <TabPane label="安保人员" icon="null iconfont icongongandunpai">
          <fs-user-table :plotNumber="plotNumber" :roleType="0"></fs-user-table>
        </TabPane>
        <TabPane label="维保人员" icon="null iconfont iconweixiuguanli">
          <fs-user-table :plotNumber="plotNumber" :roleType="1"></fs-user-table>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>
<script>
import { getDefenceAreaBySecurityDetail } from "@/api/hostManage";
// import SecurityTable from "./securityTable";
// import MaintenanceTable from "./maintenanceTable";
import FsUserTable from './fsUserTable'
export default {
  components: {
    FsUserTable
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    plotNumber: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      visible: false,
      tabIsLoading: false,
      info: {}
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
  },

  methods: {
    getDetail() {
      getDefenceAreaBySecurityDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.info {
  margin-top: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-weight: bold;
  color: #38f;
}

.photo-modal-wrap {
  .ivu-modal-body {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}

>>>.flex-div {
  width: 50px;
  height: 50px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>