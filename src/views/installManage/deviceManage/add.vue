<template>
  <Modal
    title="添加"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="companyId" label="对应公司">
        <Select v-model="form.companyId" placeholder="非必选" :clearable="true" style="width:200px;">
          <Option v-for="item in companyList" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="deviceType" label="设备类型">
        <RadioGroup v-model="form.deviceType">
          <Radio :label="item.code" v-for="item in InstallDeviceType" :key="item.code">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem prop="name" label="设备名称">
        <Input v-model.trim="form.name" placeholder="请输入设备名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="code" label="设备编码">
        <Input v-model.trim="form.code" placeholder="请输入设备编码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="price" label="设备价格">
        <InputNumber
          :min="0"
          :precision="2"
          :max="10000"
          v-model.trim="form.price"
          placeholder="请输入设备价格"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="servicePrice" label="服务费/月">
        <InputNumber
          :min="0"
          :precision="2"
          :max="10000"
          v-model.trim="form.servicePrice"
          placeholder="请输入服务费，可为空"
          style="width: 200px;"
        />
      </FormItem>
      <FormItem prop="valid" label="是否有效">
        <i-switch size="large" v-model.trim="form.valid">
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
        <!-- <RadioGroup v-model.trim="form.valid">
          <Radio :label="true">有效</Radio>
          <Radio :label="false">无效</Radio>
        </RadioGroup>-->
      </FormItem>
      <FormItem label="备注">
        <Input v-model.trim="form.remark" placeholder="选填" style="width: 200px;" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addDevice } from "@/api/installManage";
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
      // 公司列表
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      InstallDeviceType: this.$options.filters.statusList("InstallDeviceType"),
      roleList: [],
      subIsShow: false,
      form: {
        companyId: null, // 选中的公司id
        name: null, // 设备名称
        code: null, // 设备编码
        price: null, // 设备价格
        servicePrice: 0, // 服务费
        valid: true, // 是否有效
        remark: null,
        deviceType: null
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写设备名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请填写设备编码",
            trigger: "blur"
          }
        ],
        price: [
          {
            type: "number",
            required: true,
            message: "请填写设备价格",
            trigger: "blur"
          }
          //   {
          //     min: 1,
          //     max: 4,
          //     message: "请输入1-9999的价格",
          //     trigger: "blur"
          //   },
        ],
        valid: [
          {
            type: "boolean",
            required: true,
            message: "请选择是否有效",
            trigger: "blur"
          }
        ],
        deviceType: [
          {
            type: "number",
            required: true,
            message: "请选择设备类型",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      if (val) {
        this.$refs["form"].resetFields();
      }
    }
  },
  methods: {
    handleClose() {
      // 当窗口关闭时触发
      this.$emit("handleClose");
    },
    /**
     * 提交数据
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            deviceType,
            name,
            code,
            price,
            valid,
            companyId,
            servicePrice,
            remark
          } = this.form;
          this.subIsShow = true;
          addDevice({
            deviceType,
            companyId,
            name,
            code,
            price,
            valid,
            servicePrice,
            remark
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
<style lang="stylus" scoped></style>


