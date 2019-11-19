<!--审核-->
<template>
  <Modal
    title="审核"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="700"
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
            <i class="iconfont iconjianzhuwu"></i>
            <span>所属小区</span>
          </div>
          <div class="text">{{info.plotName}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconcheliang"></i>
            <span>车辆号码</span>
          </div>
          <div class="text">{{info.carNumber}}</div>
        </div>
      </div>

      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconyonghu"></i>
            <span>所属人</span>
          </div>
          <div class="text">{{info.carownName}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshouji"></i>
            <span>联系电话</span>
          </div>
          <div class="text">
            <span>{{info.carownPhone}}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>创建时间</span>
          </div>
          <div class="text">{{this.$moment(info.createTime*1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>更新时间</span>
          </div>
          <div class="text">{{this.$moment(info.updateTime*1000).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
      </div>
    </div>

    <!-- <div class="tab-title">
      <i class="iconfont iconlishixiao"></i>
      <span>审核历史</span>
    </div>
    <Table border stripe highlight-row :loading="tabIsLoading" :columns="tabCol" :data="tabData"></Table>-->

    <div class="tab-title">
      <i class="iconfont iconshenhe"></i>
      <span>审核操作</span>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100" style="margin-top:30px;">
      <FormItem prop="status" label="更改状态为">
        <Select v-model.trim="form.status" placeholder="箐选择要改变的状态" style="width:200px;">
          <Option
            v-for="item in UserCarStatus"
            :value="item.code"
            :key="item.code"
            v-show="item.code!=0"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="remark" required label="不通过原因" v-show="form.status===2">
          <Input v-model.trim="form.remark" type="textarea" :rows="4" placeholder="请填写不通过原因" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
      <!-- 更改状态为：
      <Button type="info" @click="changeStatus(3)" v-if="info.status !== 3" :loading="subIsShow">审核中</Button>
      <Button type="error" @click="changeStatus(2)" :loading="subIsShow">不通过</Button>
      <Button type="success" @click="changeStatus(1)" :loading="subIsShow">通 过</Button>-->
    </div>
  </Modal>
</template>
<script>
import { getCarDetail, updateCar} from "@/api/communityManage";
let that;
export default {
  props: {
    id: {
      type: Number,
      default: ""
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
      UserCarStatus: this.$options.filters.statusList("UserCarStatus"),
      searchForm: {
        plotNumber: null,
        buildingNumber: null,
        doorNumber: null
      },
      tabIsLoading: false,
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      manageList: [], //物管列表
      subIsShow: false,
      info: {},
      form: {
        status: null,
        remark: ''
      },
      failureList: []
    };
  },
  computed: {
    rules: function() {
      console.log(this.form);
      return {
        status: [
          {
            type: "number",
            required: true,
            message: "请选择要修改的状态",
            trigger: "blur"
          }
        ],
        remark: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (this.form.status === 2 && !value) {
                err = "请选择不通过的原因";
              }

              callback(err);
            }
          }
        ]
      };
    },
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getDetail();
      }
    }
  },
  created() {
    that = this;
  },
  methods: {
    /**
     * 获取数据详情
     */
    getDetail() {
      getCarDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    changeStatus(status) {
      if (status === 3 && !this.info.remarkReason) {
        // status为1即通过，为2不通过
        this.$Message.error("请填写审核不通过的原因备注");
      } else {
        this.subIsShow = true;
        let { id, status, feedback } = this.form;
        updateApplyStatus({
          status: status,
          remark: remarkReason,
          number: number
        })
          .then(({ data, errorCode }) => {
            this.subIsShow = false;
            if (errorCode === 0) {
              this.$Message.success("修改成功");
              this.$emit("handleClose", true);
            }
          })
          .catch(() => {
            this.subIsShow = false;
          });
      }
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsShow = true;
          let { status, remark} = this.form;
          updateCar({
            id: this.id,
            status, 
            remark
          })
            .then(({ data, errorCode }) => {
              this.subIsShow = false;
              if (errorCode === 0) {
                this.$Message.success("审核成功");
                this.$emit("handleClose", true);
              }
            })
            .catch(() => {
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
</style>


