<template>
  <Modal title="编辑" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem prop="name" label="设备名称">
        <Input v-model.trim="form.name" placeholder="请填写设备名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="code" label="设备号">
        <Input v-model.trim="form.code" placeholder="请填写设备上的设备号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="type" label="设备类型">
        <Select v-model="form.type" style="width:200px">
          <Option v-for="(item,index) in equipment" :value="item.value" :key="index">{{ item.name }}</Option>
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
// import { getSectorByNumber, updateSectorHost } from "@/api/hostManage";
import { getRegionEquipmentDetail, UpdateRegionEquipment } from "@/api/patrolManage";
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
      equipment: {
        // 主机状态列表
        1: {
          name: "蓝牙巡更",
          value: '1',
        }
      },
      subIsShow: false,
      form: {
        id: null, //
        name: null, // 主机名
        code: null, //主机唯一账号
        type: null, //位置
        areaNumber: null
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写主机名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请填写主机上的设备号",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请填写正确的区域码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      // 获取账号详情
      getRegionEquipmentDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          console.log(data)
          let { id, name, code, type, areaNumber } = data;
          // this.info = data;
          this.form.id = id;
          this.form.name = name;
          this.form.code = code;
          this.form.areaNumber = areaNumber;
          this.form.type = type.toString();
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          console.log(this.form)
          this.subIsShow = true;
          UpdateRegionEquipment(this.form)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("修改成功");
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


