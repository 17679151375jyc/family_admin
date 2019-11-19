<template>
  <Modal
    title="编辑视频主机"
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
      <FormItem prop="name" label="名称">
        <Input v-model.trim="form.name" placeholder="输入名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="defenceNumber" label="拍摄防区" >
        <Select v-model.trim="form.defenceNumber" multiple placeholder="请选择所属防区" style="width: 200px;">
          <Option v-for="(item,index) in defenceList" :key="index" :value="item.number">{{item.name}}</Option>
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
  updateVideoHost,
  getDefenceAreaBySecurity,
  getVideoHostDetail
} from "@/api/hostManage";
import { Promise } from "q";
import { setTimeout } from "timers";
export default {
  props: {
    machineNumber: {
      // 主机号码
      type: String,
      default: null
    },
    cameraNumber: {
      // 视频主机号码
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
      defenceList: [], // 防区列表
      subIsShow: false,
      form: {
        name: "",
        deviceNumber: "",
        machineNumber: "",
        cameraNumber: '',
        defenceNumber: []
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入视频主机名称",
            trigger: "blur"
          }
        ],
        defenceNumber: [
          {
            type: "array",
            required: true,
            message: "请选择防区编号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: async function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        await this.getDefenceAreaBySecurity();
        this.getDetail();
      }
    }
  },
  methods: {
    /**
     * @method getDefenceAreaBySecurity 获取防区列表
     */
    async getDefenceAreaBySecurity() {
      return new Promise((resolve, reject) => {
        getDefenceAreaBySecurity({
          machineNumber: this.machineNumber
        }).then(({ data, errorCode }) => {
          if (errorCode === 0) {
            this.defenceList = data;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    getDetail() {
      // 获取账号详情
      getVideoHostDetail({
        cameraNumber: this.cameraNumber
      }).then(
        ({
          data: { deviceNumber, name,cameraNumber, defenceAreaList, machineNumber },
          errorCode
        }) => {
          if (errorCode === 0) {
            this.form.name = name;
            this.form.deviceNumber = deviceNumber;
            let defenceNumber = [];
            for (let i = 0; i < defenceAreaList.length; i++) {
              defenceNumber.push(defenceAreaList[i].defenceNumber);
            }
            this.form.cameraNumber = cameraNumber
            this.form.defenceNumber = defenceNumber;
            this.form.machineNumber = machineNumber;
          }
        }
      );
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, cameraNumber, defenceNumber } = this.form;
          this.subIsShow = true;
          updateVideoHost({
            name,
            cameraNumber: cameraNumber,
            defenceAreaNumber: defenceNumber.join(',')
          })
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


