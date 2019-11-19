<template>
  <Modal
    title="编辑"
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

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="effectiveTime" label="服务结束时间">
        <DatePicker
          v-model.trim="form.effectiveTime"
          :options="effectiveTimeOptions"
          type="date"
          placeholder="选择服务结束时间"
          style="width: 250px"
        ></DatePicker>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>

  </Modal>
</template>
<script>
import { getDefenceAreaBySecurityDetail, editDefenceAreaBySecurity } from "@/api/hostManage";
import { mapState } from "vuex";
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
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      subIsShow: false,
      effectiveTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      amap: {
        // 转码组件
        isShow: false
      },
      form: {
        effectiveTime: null
      },
      rules: {
        effectiveTime: [
          {
            type: "date",
            required: true,
            message: "请选择服务结束时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if(val){
        this.getDetail()
      }
    }
  },
  methods: {
    getDetail(){
      console.log(this.id)
      getDefenceAreaBySecurityDetail({
        id: this.id
      }).then(({data, errorCode})=>{
        if(errorCode === 0){
          if(data){
            this.form.effectiveTime = this.$options.filters.formatTime(data.effectiveTime, "Y-M-D")
          }
        }
      })
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            effectiveTime
          } = this.form;
          this.subIsShow = true;
          console.log(new Date(effectiveTime).getTime())
          let data = {
            id: this.id,
            effectiveTime: new Date(effectiveTime).getTime()/1000
          }
          editDefenceAreaBySecurity(data).then(({ errorCode }) => {
            if (errorCode === 0) {
              this.$Message.success("编辑成功");
              this.subIsShow = false;
              this.$emit("handleClose", true);
            }
          }).catch(err => {
              this.subIsShow = false;
          });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    addressOnChange(value, vlaueObj) {
      this.$set(this.form, "province", vlaueObj[0].value);
      this.$set(this.form, "city", vlaueObj[1].value);
      this.$set(this.form, "area", vlaueObj[2].value);
      this.$set(this.form, "street", vlaueObj[3].value);
      this.$set(this.form, "provinceName", vlaueObj[0].label);
      this.$set(this.form, "cityName", vlaueObj[1].label);
      this.$set(this.form, "zoneName", vlaueObj[2].label);
      this.$set(this.form, "streetName", vlaueObj[3].label);
    },
    plotOnChange(value) {
      this.form.plotNumber = value[0];
      this.form.buildingNumber = value[1];
      this.form.doorNumber = value[2];
    },
    /**
     * 显示地图转码经纬度
     */
    showAmap() {
      this.amap.isShow = true;
    },
    /**
     * 关闭地图
     */
    amapClose() {
      this.amap.isShow = false;
    },
    /**
     * 当前选择的坐标的值
     */
    selLngLat(position) {
      this.$set(this.form, "longitude", position[0]);
      this.$set(this.form, "latitude", position[1]);
      this.amapClose();
    }
  }
};
</script>
<style lang="stylus" scoped></style>