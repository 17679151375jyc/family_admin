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

    <!-- <span>{{companyList[0].name}}</span> -->
    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem prop="areaMachineName" label="服务器名称">
        <Input v-model.trim="form.areaMachineName" placeholder="请填写服务器名称" style="width:200px;" />
      </FormItem>
      <FormItem prop="areaCode" label="请选择区">
        <address-cascader style="width:200px" :showLevel="3" @onChange="PcasChange"></address-cascader>
      </FormItem>
      <FormItem prop="ip" label="IP地址">
        <Input v-model.trim="form.ip" placeholder="请填写ip地址" style="width:200px;" />
      </FormItem>
      <FormItem prop="port" label="端口号">
        <InputNumber
          :max="999999"
          :min="1"
          v-model.trim="form.port"
          placeholder="请填写端口号"
          style="width: 200px;"
        ></InputNumber>
      </FormItem>
      <FormItem prop="uploadPort" label="服务器上传端口">
        <InputNumber
          :max="9999"
          :min="1"
          v-model.trim="form.uploadPort"
          placeholder="请填写服务器上传端口"
          style="width: 200px;"
        ></InputNumber>
      </FormItem>

      <!-- <FormItem label="主机区域码" prop="installCode">
        <InputNumber
          :max="9999"
          :min="1" v-model.trim="form.installCode" placeholder="选填" style="width: 200px;"></InputNumber>
      </FormItem>-->
      <FormItem label="主机区域码" prop="installCode">
        <Input  :value="form.installCode" @on-change="installCodeChange" placeholder="请填写主机区域码" style="width:200px;" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addHostNetwork } from "@/api/hostManage";
import { getCompanyList } from "@/api/dataManage";
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
        areaMachineName: null, //测试服务器名称
        provinceName: null, //省名
        provinceCode: null, //省码
        cityName: null, //市名
        cityCode: null, //市码
        areaName: null, // 区名
        areaCode: null, //区码
        installCode: null, //主机区域码
        uploadPort: null
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
            type: "number",
            required: true,
            message: "请填写对应的端口号",
            trigger: "blur"
          }
        ],
        uploadPort: [
          {
            type: "number",
            required: true,
            message: "请填写服务器上传端口",
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
        installCode: [
          {
            required: true,
            message: "请填写主机区域码",
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (value) {
                if (!this.$options.filters.installCode(value)) {
                  err = "最多填写10位字符";
                }
              }
              callback(err);
            }
          }
        ],
        areaMachineName: [
          {
            required: true,
            message: "请填写ip地址",
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
        // this.getCompanyList();
        // this.getRoleList();
      }
    }
  },
  mounted() {},
  methods: {
    // maxTagPlaceholder(num) {
    //   return "more" + 10;
    // },
    // dtList(data) {
    //   if (data.length !== 0) {
    //     this.form.companyId = data[0].id;
    //     this.comId = data[0].id;
    //     this.companyName = data[0].name;
    //   } else {
    //     this.form.companyId = null;
    //     this.companyName = null;
    //   }
    // },
    /**
     * @method getRoleList 获取角色列表
     */
    // getRoleList() {
    //   getRoleList({}).then(({ data: { list }, errorCode }) => {
    //     if (errorCode === 0) {
    //       this.roleList = list;
    //     }
    //   });
    // },
    /**
     * 获取公司列表
     */
    // getCompanyList() {
    //   getCompanyList({}).then(({ data, errorCode }) => {
    //     if (errorCode === 0) {
    //       this.companyList = data.list;
    //       // 数据转化为树形结构
    //       let dataList = data.list;
    //       let map = {};
    //       dataList.forEach(item => {
    //         map[item.id] = item;
    //       });
    //       var val = [];
    //       dataList.forEach(item => {
    //         var parent = map[item.parentId];
    //         if (parent) {
    //           (parent.children || (parent.children = [])).push(item);
    //         } else {
    //           val.push(item);
    //         }
    //       });
    //       for (let item of val) {
    //         item.title = item.name;
    //         item.expand = true;
    //         if (item.children) {
    //           item.children[0].title = item.children[0].name;
    //           item.children[0].expand = true;
    //         }
    //       }
    //       this.companyListData = val;
    //     }
    //   });
    // },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          // this.subIsShow = true;
          console.log(this.form);
          addHostNetwork(this.form)
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.subIsShow = false;
                this.$emit("handleClose", true);
              }
            })
            .catch(err => {
              console.log(err);
            });
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
      this.form.cityName = valObj[1] && valObj[1].label;
      this.form.cityCode = valObj[1] && valObj[1].value;
      this.form.areaName = valObj[2] && valObj[2].label;
      this.form.areaCode = valObj[2] && valObj[2].value;
    },
    installCodeChange(event){
        console.log(event.target.value)
        this.form.installCode = event.target.value.toUpperCase()
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


