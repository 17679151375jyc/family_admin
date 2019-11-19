<template>
  <Modal
    title="添加"
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

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="companyId" label="对应公司">
        <Select v-model.trim="form.companyId" placeholder="对应公司" style="width: 200px;">
          <Option value="all">无指定公司</Option>
          <Option :value="item.id" v-for="item in companyList" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="套餐设备" prop="deviceList" required>
        <Table border stripe highlight-row :columns="tabCol" :data="tabData"></Table>
      </FormItem>

      <FormItem prop="name" label="套餐名称">
        <Input v-model.trim="form.name" placeholder="请输入套餐名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="code" label="套餐编码">
        <Input v-model.trim="form.code" placeholder="请输入套餐编码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="packageDeposit" label="套餐押金">
        <InputNumber
          :min="0"
          :precision="2"
          :max="100000"
          v-model.trim="form.packageDeposit"
          placeholder="请输入套餐押金"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="monthPrice" label="包月价">
        <InputNumber
          :min="0"
          :precision="2"
          :max="100000"
          v-model.trim="form.monthPrice"
          placeholder="请输入套餐包月价格"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="quarterPrice" label="包季价">
        <InputNumber
          :min="0"
          :precision="2"
          :max="100000"
          v-model.trim="form.quarterPrice"
          placeholder="请输入套餐包季价格"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="yearPrice" label="包年价">
        <InputNumber
          :min="0"
          :precision="2"
          :max="100000"
          v-model.trim="form.yearPrice"
          placeholder="请输入套餐包年价格"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="valid" label="是否有效">
        <i-switch size="large" v-model.trim="form.valid">
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
      </FormItem>

      <FormItem prop="remark" label="套餐描述">
        <Input v-model.trim="form.remark" type="textarea" :rows="8" placeholder="请填写套餐描述" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addCombo, getDeviceList } from "@/api/installManage";
let self;
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
    companyList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      subIsShow: false,
      form: {
        deviceList: [], //设备列表，要根据销售渠道查询不同
        companyId: null, // 销售渠道
        name: null, // 套餐名称
        code: null, // 套餐编码
        remark: null, // 套餐描述
        valid: false, // 是否有效
        monthPrice: null, // 包月价
        quarterPrice: null, // 包季价
        yearPrice: null, // 包年价
        packageDeposit: null//套餐押金
      },
      rules: {
        companyId: [
          {
            required: true,
            message: "请选择销售渠道",
            trigger: "blur"
          }
        ],
        deviceList: [
          {
            validator: (rule, value, callback, source, options) => {
              let num = false;
              let err = [];
              for (let i = 0; i < self.form.deviceList.length; i++) {
                if (self.form.deviceList[i].num !== 0) {
                  num = true;
                }
              }

              if (!num) {
                err = "最少设定一个设备数量为1";
              }
              callback(err);
            }
          }
        ],
        name: [
          {
            required: true,
            message: "请填写套餐名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请填写套餐编码",
            trigger: "blur"
          }
        ],
        packageDeposit: [
          {
            type: "number",
            required: true,
            message: "请填写套餐押金",
            trigger: "blur"
          }
        ],
        monthPrice: [
          {
            type: "number",
            required: true,
            message: "请填写套餐包月价格",
            trigger: "blur"
          }
        ],
        quarterPrice: [
          {
            type: "number",
            required: true,
            message: "请填写套餐包季价格",
            trigger: "blur"
          }
        ],
        yearPrice: [
          {
            type: "number",
            required: true,
            message: "请填写套餐包年价格",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "请填写套餐描述",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
    },
    "form.companyId": function(val, oldVal) {
      this.form.selDevice = [];
      if (val) {
        this.getDeviceList(val);
      } else {
        this.deviceList = [];
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
          minWidth: 100,
          tooltip: true
        },
        {
          title: "单价",
          key: "price",
          width: 100
        },
        {
          title: "数量",
          align: "center",
          //   key: "num",
          width: 120,
          render: (h, params) => {
            let self = this;
            let input = h("InputNumber", {
              props: {
                min: 0,
                max: 99,
                value: 0
              },
              on: {
                input: val => {
                  self.form.deviceList[params.index].num = val;
                }
              }
            });
            return h("div", [input]);
          }
        },
        {
          title: "总价",
          key: "totalPrice",
          width: 100
        }
      ];
    },
    tabData: function() {
      let data = [];
      for (let i = 0; i < this.form.deviceList.length; i++) {
        this.form.deviceList[i].price = (
          this.form.deviceList[i].price - 0
        ).toFixed(2);
        this.form.deviceList[i].totalPrice = (
          this.form.deviceList[i].price * this.form.deviceList[i].num
        ).toFixed(2);
        data.push(this.form.deviceList[i]);
      }
      return data;
    }
  },
  created() {
    self = this;
  },
  methods: {
    /**
     * 根据销售渠道查询相关的设备列表
     */
    getDeviceList(companyId) {
      getDeviceList({
        input: {
          valid: true,
          companyId
        },
        page: 1,
        pageSize: 999
      })
        .then(({ data, errorCode }) => {
          for (let i = 0; i < data.list.length; i++) {
            data.list[i].num = 0;
          }
          this.form.deviceList = data.list;
        })
        .catch(() => {});
    },
    handleClose() {
      // 当窗口关闭时触发
      this.$emit("handleClose");
    },
    submit() {
      console.log("点击了确定");
      this.$refs["form"].validate(async valid => {
        console.log("验证中", valid);
        if (valid) {
          console.log("验证完成");
          //计算添加的设备
          let applyDevices = [];
          for (let i = 0; i < this.form.deviceList.length; i++) {
            let { id, num } = this.form.deviceList[i];
            if (num != 0) {
              applyDevices.push({
                id,
                num
              });
            }
          }
          let {
            companyId,
            name,
            code,
            price,
            remark,
            valid,
            monthPrice,
            quarterPrice,
            yearPrice,
            packageDeposit
          } = this.form;
          this.subIsShow = true;
          addCombo({
            applyDevices,
            companyId: companyId == "all" ? "" : companyId,
            name,
            code,
            remark,
            valid,
            monthPrice,
            quarterPrice,
            yearPrice,
            packageDeposit
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.subIsShow = false;
                this.$emit("handleClose", true);
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
.device-list {
  .left {
  }

  .right {
    margin-top: 4px;

    .item {
      width: 350px;
      border: 1px solid #dcdee2;
      display: flex;
      border-radius: 3px;
      padding: 2px;

      .index {
        flex: 0 0 20px;
        text-align: center;
      }

      span {
        flex: 1;
        padding: 0 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .num {
        display: flex;
      }
    }
  }
}
</style>


