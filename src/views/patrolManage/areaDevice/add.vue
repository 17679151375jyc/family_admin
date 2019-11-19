<template>
  <Modal title="添加" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="phone" label="手机号码">
        <Input v-model.trim="form.phone" placeholder="请输入手机号码" style="width: 200px;" />
      </FormItem>
      <FormItem prop="areaNumber" label="区域" v-show="areaList.length > 0">
        <Select v-model.trim="form.areaNumber" placeholder="请选择所属区域" style="width: 200px;">
          <Option
            v-for="(item,index) in areaList"
            :key="index"
            :value="item.areaNumber"
          >{{item.areaName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" label="设备名称">
          <Input v-model.trim="form.name" placeholder="请填写设备名称" style="width: 200px;"/>
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
import { getAreaByPhone } from "@/api/dataManage";
import { addSectorHost, getSetupServerList } from "@/api/hostManage";
import { UpdateRegionEquipment } from "@/api/patrolManage";
export default {
  props: {
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
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      regionList: [],
      areaList: [], // 区域列表
      subIsShow: false,
      form: {
        phone: "", // 电话
        name: null,
        code: null,
        type: null,
        areaNumber: null
      },
      rules: {
        phone: [
          // {
          //   required: true,
          //   message: "请填写手机号码",
          //   trigger: "blur"
          // },
          {
            validator: (rule, value, callback, source, options) =>{
                let err = [];
                if (!this.$options.filters.phone(value) && value) {
                  err = "请填写正确的手机号码";
                }
                callback(err);
              
            }
          }
        ],
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
        areaNumber: [
          {
            required: true,
            message: "请选择对应的区域",
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
      if(val){
        this.getList();
      }
    },
    "form.phone": function(val, oldVal) {
      console.log(val);
      if(val){
        if (this.$options.filters.phone(val)) {
          this.getAreaList();
        } else {
          this.areaList = [];
        }

      }
    }
  },
  methods: {
    getList(){
      let { size, current } = this.page;
      let data = {
        pageSize: size,
        page: current
      };
      getSetupServerList(data)
        .then(({data, errorCode}) => {
          if (errorCode === 0) {          
            if(data.list){
              this.regionList = data.list;              
            }            
          }
        })
    },
    handleClose() {
      this.$emit("handleClose");
    },
    getAreaList() {
      getAreaByPhone({
        userPhone: this.form.phone
      })
        .then(({ data, errorCode }) => {
          if (errorCode === 0) {
            if (data.list.length > 0) {
              this.areaList = data.list;
            } else {
              this.$Message.warning({
                closable: true,
                content: "该用户没有添加区域，请先添加",
                duration: 5
              });
            }
          }
        })
        .catch(() => {});
    },
    submit() {
      // console.log(this.form)
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, code, areaNumber, type } = this.form;
          this.subIsShow = true;
          console.log(this.form)
          UpdateRegionEquipment(this.form)
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


