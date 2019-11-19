<template>
  <Modal
    title="添加防区"
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
      <FormItem prop="name" label="防区名称">
        <Input v-model.trim="form.name" placeholder="请填写防区名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="property" label="防区属性">
        <RadioGroup v-model.trim="form.property">
          <Radio
            :label="item.code"
            v-for="item in defenceAreaProperty"
            :key="item.code"
          >{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>

      
      <FormItem prop="deviceType" label="设备类型">
        <Select v-model.trim="form.deviceType" style="width: 200px;">
          <Option v-for="(item, index) in deviceType" :key="index" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="defenceIndex" label="防区编号">
        <Select v-model.trim="form.defenceIndex" style="width:200px;" placeholder="请选择防区编号">
          <Option
            v-for="item in 99"
            :key="item"
            :value="item > 9 ? item+'' : '0' + item"
            v-show="defenceList.indexOf(item) == -1"
          >{{item > 9 ? item+'' : '0' + item}}</Option>
        </Select>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import {
  getSecurityHostList,
  addDefenceArea
} from "@/api/hostManage";
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    macNumber: {
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
      deviceType: this.$options.filters.statusList("DeviceType"), //防区类型
      defenceAreaProperty: this.$options.filters.statusList(
        "DefenceAreaProperty"
      ), //
      securityHostList: [], // 区域列表
      subIsShow: false,
      form: {
        name: "", // 主机名称
        defenceIndex: null, // 防区编号
        deviceType: null, // 设备类型
        property: null, // 防区属性
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写主机名称",
            trigger: "blur"
          }
        ],
        property: [
          {
            type: "number",
            required: true,
            message: "请选择防区属性",
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
        ],
        defenceIndex: [
          {
            required: true,
            message: "请选择防区编号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    defenceList: function() {
      let arr = [];
      for (let i = 0; i < this.list.length; i++) {
        arr.push(this.list[i].defenceIndex);
      }
      return arr;
    }
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
    },
    "form.phone": function(val, oldVal) {
      if (this.$options.filters.phone(val)) {
        this.getSecurityHostList();
      } else {
        this.securityHostList = [];
      }
    }
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },

    getSecurityHostList() {
      getSecurityHostList({
        phone: this.form.phone,
        pageSize: 99,
        page: 1
      })
        .then(({ data, errorCode }) => {
          if (errorCode === 0) {
            if (data.list.length > 0) {
              this.securityHostList = data.list;
            } else {
              this.$Message.warning({
                closable: true,
                content: "该用户没有添加主机，请先添加",
                duration: 0
              });
            }
          }
        })
        .catch(() => {});
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, type, defenceIndex, deviceType , property} = this.form;
          this.subIsShow = true;
          addDefenceArea({
            name,
            type,
            property,
            machineNumber: this.macNumber,
            defenceIndex,
            deviceType
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


