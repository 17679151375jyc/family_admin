<template>
  <Modal title="编辑防区" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
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
        <Select v-model.trim="form.property" style="width:200px;" placeholder="请选择防区属性">
          <Option v-for='(item,index) in defenceAreaProperty' :key='index' :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="deviceType" label="设备类型">
        <Select v-model.trim="form.deviceType" style="width:200px;" placeholder="请选择设备类型">
          <Option v-for='(item,index) in deviceTypeList' :key='index' :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
       <FormItem prop="position" label="防区位置">
        <Input v-model.trim="form.position" placeholder="请填写防区位置" style="width: 200px;" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getDefenceDetail, editDefence} from "@/api/hostManage";
export default {
  props: {
    number: {
      type: String,
      default: null
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
      defenceAreaProperty: this.$options.filters.statusList(
        "DefenceAreaProperty"
      ),
      deviceTypeList: this.$options.filters.statusList(
        "DeviceType"
      ),
      subIsShow: false,
      form: {
        id: null,
        name: null, // 防区名称
        defenceIndex: null,//防区序列号
        property: null, // 防区属性 0、关闭，1、普通，2、留守，3、紧急
        deviceType: null,//设备类型0、红外线，1、烟感，2、燃气，3、门磁，
        position: null,//防区位置
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写防区名称",
            trigger: "blur"
          }
        ],
        property: [
          {
            type: "number",
            required: true,
            message: "请选择设备类型",
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
        position: [
          {
            required: true,
            message: "请选择防区位置",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
          this.getDetail();
          console.log(this.defenceAreaProperty)
      }
    },
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getDefenceDetail({
        number: this.number
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (data) {
            let {
              id,
              name,
              property,
              deviceType,
              position,
              defenceIndex
            } = data;
            this.form = {
              defenceIndex,
              name,
              property,
              deviceType,
              position,
              id
            }
            console.log(this.form);
          }
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {      
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsShow = true;
          console.log(this.form)
          editDefence(this.form)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功");
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


