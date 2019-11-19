<!--审核-->
<template>
  <Modal
    title="详情"
    v-model.trim="visible"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="500"
  >
    <!-- 右上角关闭按钮-start -->
    <!-- <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>-->
    <!-- 右上角关闭按钮-start -->
    <!-- <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>真实姓名</span>
          </div>
          <div class="text">{{info.realName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>手机号</span>
          </div>
          <div class="text">{{info.phone}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconxingbie"></i>
            <span>性别</span>
          </div>
          <div class="text">{{info.sex ? '男' : '女'}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>业主手机号</span>
          </div>
          <div class="text">
            <span>{{info.domicilePhone}}</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconId"></i>
            <span>身份证</span>
          </div>
          <div class="text">{{info.identityCard}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>申请时间</span>
          </div>
          <div class="text">{{info.applyTime|formatTime}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconstatus"></i>
            <span>当前状态</span>
          </div>
          <div class="text">
            <span
              :class="[info.status !=null ? statusList[info.status].class  : '']"
            >{{info.status | statusName('DomicileStatus')}}</span>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconwenhao"></i>
            <span>是否业主</span>
          </div>
          <div class="text">
            <span
              :class="[info.isOwner ? 'cell-info' : 'cell-error']"
            >{{info.isOwner ? '业主' : '非业主'}}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>邀请人</span>
          </div>
          <div class="text">{{info.inviterName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>邀请人手机</span>
          </div>
          <div class="text">{{info.inviterName}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconjianzhuwu"></i>
            <span>小区楼座</span>
          </div>
          <div
            class="text"
          >{{info.plotName + (info.buildingName ? info.buildingName+info.doorName:'')}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>省市区</span>
          </div>
          <div class="text">{{info.provinceName+info.cityName+info.areaName+info.streetName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont icondizhi1"></i>
            <span>详细地址</span>
          </div>
          <div class="text">{{info.address}}</div>
        </div>
      </div>
    </div>-->

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <!-- <i-switch v-model=""></i-switch> -->
      <FormItem prop="relationType" label="与业主关系">
        <Select v-model="form.relationType" placeholder="请选择与业主关系" style="width: 200px">
          <Option
            v-show="item.code!=1000"
            v-for="item in InviterType"
            :key="item.code"
            :value="item.code"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { residentRemoveOwner } from "@/api/communityManage";
let that;
export default {
  props: {
    domicileNumber: {
      type: String,
      default: ""
    },
    value: {
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
      subIsShow: false,
      visible: false,
      InviterType: this.$options.filters.statusList("InviterType"),
      form: {
        relationType: null
      },
      rules: {
        relationType: [
          {
            type: "number",
            required: true,
            message: "请选择业主关系",
            trigger: "blue"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {
    value: function(val, oldVal) {
      this.visible = val;
    },
    visible(val) {
      if(!val) {
          this.$refs['form'].resetFields()
      }
      this.$emit("input", val);
    }
  },
  created() {
    that = this;
  },
  methods: {
    /**
     * 提交
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsShow = true;
          residentRemoveOwner({
            domicileNumber: this.domicileNumber,
            relationType: this.form.relationType
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("取消成功");
                this.subIsShow = false;
                this.visible = false;
              }
            })
            .catch(err => {
              this.subIsShow = false;
            });
        } else {
          this.$Message.error("提交信息有误");
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

>>>.ivu-icon-null {
  font-size: 14px;
}
</style>


