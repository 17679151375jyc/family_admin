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

    <!-- <span>{{companyList[0].name}}</span> -->
    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem prop="areaCode" label="区域">
        {{ form.provinceName }}-{{ form.cityName }}-{{ form.areaName }}
        <!-- <address-cascader style="width:200px" :showLevel="3" @onChange="PcasChange"></address-cascader> -->
      </FormItem>
      <FormItem prop="ip" label="IP地址">
        <Input v-model.trim="form.ip" placeholder="请填写ip地址" style="width:200px;" />
      </FormItem>
      <FormItem prop="port" label="端口号">
        <InputNumber
          :max="9999"
          :min="1"
          v-model.trim="form.port"
          placeholder="请填写端口号"
          style="width: 200px;"
        ></InputNumber>
      </FormItem>
      <!-- <FormItem prop="areaMachineName" label="测试服务器名称">
        <Input v-model.trim="form.areaMachineName" placeholder="请填写ip地址" style="width:200px;" />
      </FormItem> -->
      <!-- <FormItem label="主机区域码">
        <Input v-model.trim="form.installCode" placeholder="选填" style="width: 200px;" />
      </FormItem> -->
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getHostNetworkDetail, updateHostNetwork } from "@/api/hostManage";
import AddressCascader from "_c/addressCascader/addressCascader";
export default {
  components: {
    AddressCascader
  },
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
      default: false
    }
  },
  data() {
    return {
      comId: "",
      listAnd: [],
      companyName: null,
      companyListData: [],
      companyList: [],
      roleList: [],
      subIsShow: false,
      form: {
        ip: null,
        port: null,
        areaMachineName: null,//测试服务器名称
        provinceName: null,//省名
        provinceCode: null,//省码
        cityName: null,//市名
        cityCode: null,//市码
        areaName: null, // 区名
        areaCode: null, //区码
        installCode: null//主机区域码
      },
      rules: {
        areaCode: [
          {
            required: true,
            message: "请选择所属区域",
            trigger: "blur"
          }
        ],
        port: [
          {
            type: 'number',
            required: true,
            message: "请填写对应的端口号",
            trigger: "blur"
          }
        ],
        ip: [
          {
            required: true,
            message: "请填写ip地址",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.$options.filters.ip(value)) {
                err = "请填写正确的ip";
              }
              callback(err);
            }
          }
        ],
        areaMachineName: [
          {
            required: true,
            message: "请填写测试服务器名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getHostDetail();
      }
    }
  },
  mounted() {},
  methods: {    
    getHostDetail(){
      getHostNetworkDetail({
        id: this.id
      }).then(({data, errorCode})=>{
        if(errorCode === 0){
          if(data){
            let {
              areaCode,
              areaMachineName,
              areaName,
              cityCode,
              cityName,
              id,
              installCode,
              ip,
              port,
              provinceCode,
              provinceName
            } = data
            console.log(data)
            this.form = {
              id,
              ip,
              port: port*1,
              areaMachineName,//测试服务器名称
              provinceName,//省名
              provinceCode,//省码
              cityName,//市名
              cityCode,//市码
              areaName, // 区名
              areaCode, //区码
              installCode//主机区域码
            }
          }
        }  
      })
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsShow = true;
          let data = {
            id: this.form.id,
            ip: this.form.ip,
            port: this.form.port
          }
          console.log(data)
          updateHostNetwork(data).then(({data, errorCode})=>{
            if(errorCode === 0){
              this.$Message.success("修改成功");
              this.subIsShow = false;
              this.$emit("handleClose", true);
            }
          })
          
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * 省市区选择器内容改变时
     */
    PcasChange(val, valObj) {
      this.form.provinceName = valObj[0] && valObj[0].label;
      this.form.provinceCode = valObj[0] && valObj[0].value;
      this.form.cityName = valObj[1] && valObj[1].label
      this.form.cityCode = valObj[1] && valObj[1].value
      this.form.areaName = valObj[2] && valObj[2].label;
      this.form.areaCode = valObj[2] && valObj[2].value;
    }
  }
};
</script>
<style lang="stylus" scoped>
.Option_css {
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
}

.Option_top {
  margin-top: -20px;
}
</style>


