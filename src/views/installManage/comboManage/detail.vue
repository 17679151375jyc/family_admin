<template>
  <Modal
    title="详情"
    footer-hide
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="800"
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
            <i class="iconfont iconshebei"></i>
            <span>套餐名称</span>
          </div>
          <div class="text">{{info.name}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconiconset0254"></i>
            <span>套餐编码</span>
          </div>
          <div class="text">{{info.code}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconfl-xiaoshoudan"></i>
            <span>对应公司</span>
          </div>
          <div class="text">{{info.companyName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconwenhao"></i>
            <span>是否有效</span>
          </div>
          <div class="text">{{info.valid ? '有效' : '无效'}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>原价</span>
          </div>
          <div class="text">{{info.originalPrice ? info.originalPrice.toFixed(2) : '0.00'}}元</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>包月价</span>
          </div>
          <div class="text">{{info.monthPrice ? info.monthPrice.toFixed(2) : '0.00'}}元</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>季度价</span>
          </div>
          <div class="text">{{info.quarterPrice ? info.quarterPrice.toFixed(2) : '0.00'}}元</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>包年价</span>
          </div>
          <div class="text">{{info.yearPrice ? info.yearPrice.toFixed(2) : '0.00'}}元</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjiage"></i>
            <span>套餐押金</span>
          </div>
          <div class="text">{{ info.packageDeposit }}元</div>
        </div>
      </div>

      <!-- <div class="row">
        
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>更新时间</span>
          </div>
          <div class="text">{{info.updateTime}}</div>
        </div>
      </div>-->
      <!-- <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>创建时间</span>
          </div>
          <div class="text">{{info.createTime}}</div>
        </div>
      </div>-->
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshebei"></i>
            <span>设备列表</span>
          </div>
          <div class="text">
            <!-- 表格-start -->
            <Table
              border
              stripe
              highlight-row
              :columns="tabCol"
              :data="tabData"
              style="margin: 10px 0;"
            ></Table>
            <!-- 表格-end -->
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>套餐描述</span>
          </div>
          <div class="text">{{info.remark}}</div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getComboDetail } from "@/api/installManage";
export default {
  props: {
    id: {
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
      info: {
        companyName: null, //公司名称
        applyDevices: [], // 设备列表
        code: null, // 设备编码
        createTime: null, // 创建时间
        name: null, //设备名称
        noEdit: null, // 是否可以编辑
        price: null, //价格
        updateTime: null, //更新时间
        valid: null, // 是否有效
        packageDeposit: null //套餐押金
      }
    };
  },
  watch: {
    isShow: async function(val, oldVal) {
      if (val) {
        this.getDetail();
      }
    }
  },
  computed: {
    tabCol: function() {
      return [
        {
          type: "index",
          title: "序号",
          width: 64,
          align: "center"
        },
        {
          title: "设备名称",
          key: "name",
          minWidth: 150
        },
        {
          title: "数量",
          key: "num",
          width: 100
        },
        {
          title: "总价",
          key: "price",
          width: 100
        }
      ];
    },
    tabData: function() {
      let data = [];
      for (let i = 0; i < this.info.applyDevices.length; i++) {
        data.push(this.info.applyDevices[i]);
      }
      return data;
    }
  },
  methods: {
    /**
     * 获取用户详情
     */
    getDetail() {
      // 获取账号详情
      getComboDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          data.createTime = this.$options.filters.formatTime(data.createTime);
          data.updateTime = this.$options.filters.formatTime(data.updateTime);
          this.info = data;
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


