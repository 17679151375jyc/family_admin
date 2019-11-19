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

    <Form ref="form" :model="form" :rules="rules" :label-width="110">
      <FormItem prop="type" label="主机类型">
        <Select v-model="form.type" placeholder="请选择主机类型" style="width:200px;">
          <Option v-for="item in MachineType" :key="item.code" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem prop="name" label="主机名称">
        <Input v-model.trim="form.name" placeholder="请填写主机名称" style="width: 200px;" />
      </FormItem>
      <FormItem prop="account" label="主机登录号">
        <Input v-model.trim="form.account" placeholder="主机唯一账号(视频主机机身码)" style="width: 200px;" />
      </FormItem>
      <FormItem prop="validateCode" label="视频主机验证码" required v-if="form.type ===1">
        <Input v-model.trim="form.validateCode" placeholder="请填写视频主机验证码" style="width:200px;" />
      </FormItem>
      <FormItem prop="channel" label="通道号" required v-if="form.type ===1">
        <InputNumber
          :max="99"
          :min="1"
          v-model.trim="form.channel"
          placeholder="请填写视频主机通道号"
          style="width:200px;"
        ></InputNumber>
      </FormItem>
      <FormItem
        v-if="form.type!=null && form.type!==1"
        prop="installCode"
        label="主机区域码"
        :required="true"
      >
        <!--如果主机类型为视频主机，不需要选择-->
        <Select v-model="form.installCode" style="width:200px">
          <Option
            v-for="(item,index) in regionList"
            :value="item.installCode"
            :key="index"
          >{{ item.installCode }}</Option>
        </Select>
      </FormItem>
    
     <Divider orientation="center">{{form.type!==1 ? '绑定区域' :'绑定防区'}}</Divider>
      <FormItem prop="phone" label="绑定手机账号">
        <Input v-model.trim="form.phone" placeholder="请输入绑定手机账号" style="width: 200px;" />
      </FormItem>
      <FormItem prop="areaNumber" label="绑定区域">
        <Select
          v-model.trim="form.areaNumber"
          style="width: 200px;"
          :placeholder="form.phone ? '请选择所属区域' : '请先输入手机号查询区域列表'"
          :not-found-text="form.phone ? '该手机号没有设置区域' : '请先输入手机号查询区域列表'"
        >
          <Option
            v-for="(item,index) in areaList"
            :key="index"
            :value="item.areaNumber"
          >{{item.areaName}}</Option>
        </Select>
      </FormItem>

      <FormItem prop="defenceAreaNumber" label="绑定防区" v-if="form.type===1">
        <Select
          v-model="form.defenceAreaNumber"
          multiple
          style="width:200px;"
          :placeholder="form.areaNumber ?　'请选择防区(可多选)' : '请先选择绑定区域'"
          :not-found-text="form.areaNumber ?　'该绑定区域没有设置防区' : '请先选择绑定区域'"
        >
          <Option value="null" disabled v-if="defenceAreaList.length>0">
            <span>防区名称</span>
            <span class="select-right-span-disabled">所属主机</span>
          </Option>
          <Option
            v-for="(item, index) in defenceAreaList"
            :key="index"
            :value="item.number"
            :label="`${item.name}`"
          >
            <span>{{item.name}}</span>
            <span class="select-right-span">{{item.machineName}}</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem prop="position" label="安装位置">
        <Input v-model.trim="form.position" placeholder="请填写安装位置" style="width: 200px;" />
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
import {
  addSectorHost,
  getSetupServerList,
  getDefenceAreaBySecurity
} from "@/api/hostManage";
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
      MachineType: this.$options.filters.statusList("MachineType"),
      page: {
        total: 0,
        size: this.$config.page.size,
        sizeOpts: this.$config.page.sizeOpts,
        current: 1
      },
      regionList: [],
      areaList: [], // 区域列表
      defenceAreaList: [], // 防区列表
      subIsShow: false,
      form: {
        type: null, // 主机类型
        name: "", // 主机名称
        phone: "", // 电话
        areaNumber: "",
        account: "", // 主机唯一账号
        position: "", // 安装位置
        installCode: null, //主机区域码
        validateCode: "", //视频主机验证码，视频主机必传
        channel: null, // 通道号，选视频主机时必传
        defenceAreaNumber: [] // 防区编号数组，选视频主机时必传
      },
      rules: {
        type: [
          {
            type: "number",
            required: true,
            message: "请选择主机类型",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写主机名称",
            trigger: "blur"
          }
        ],
        phone: [
          //   {
          //     required: true,
          //     message: "请填写绑定的用户手机号",
          //     trigger: "blur"
          //   },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (this.form.type === 1 && !value) {
                err = "视频主机需填写手机号";
              }
              if (!this.$options.filters.phone(value) && value) {
                err = "请填写正确的手机号码";
              }
              callback(err);
            }
          }
        ],
        account: [
          {
            required: true,
            message: "请填写主机上的设备号",
            trigger: "blur"
          }
        ],
        areaNumber: [
          {
            message: "请选择对应的区域",
            trigger: "blur"
          }
        ],

        installCode: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (this.form.type !== null && this.form.type !== 1 && !value) {
                err = "请选择主机区域码";
              }
              callback(err);
            }
          }
        ],
        validateCode: [
          {
            required: true,
            message: "请填写视频主机验证码",
            trigger: "blur"
          }
        ],
        channel: [
          {
            type: "number",
            required: true,
            message: "请填写视频主机通道号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      if (!val) {
        this.$refs["form"].resetFields();
      }

      if (val) {
        this.getList();
      }
    },
    "form.phone": function(val, oldVal) {
      console.log(val);
      if (val) {
        this.form.areaNumber = null;
      }
      if (this.$options.filters.phone(val)) {
        this.getAreaList();
      } else {
        this.areaList = [];
      }
    },
    "form.areaNumber": function(val, oldVal) {
      // 当区域改变时，重新拉一次防区
      if (val) {
        this.form.defenceAreaNumber = []; // 清空一下已选择的防区
        this.getDefenceAreaBySecurity();
      }
    }
  },
  methods: {
    getList() {
      let { size, current } = this.page;
      let data = {
        pageSize: size,
        page: current
      };
      getSetupServerList(data).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          if (data.list) {
            this.regionList = data.list;
          }
        }
      });
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
      console.log(this.form);
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            type, // 主机类型
            name, // 主机名称
            phone, // 电话
            areaNumber,
            account, // 主机唯一账号
            position, // 安装位置
            installCode, //主机区域码
            validateCode, //视频主机验证码，视频主机必传
            channel, // 通道号，选视频主机时必传
            defenceAreaNumber // 防区编号数组，选视频主机时必传
          } = this.form;
          this.subIsShow = true;
          // console.log(this.form)
          addSectorHost({
            type, // 主机类型
            name, // 主机名称
            phone, // 电话
            areaNumber,
            account, // 主机唯一账号
            position, // 安装位置
            installCode, //主机区域码
            validateCode, //视频主机验证码，视频主机必传
            channel, // 通道号，选视频主机时必传
            defenceAreaNumber // 防区编号数组，选视频主机时必传
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
    },
    /**
     * 根据区域获取防区列表
     */
    getDefenceAreaBySecurity() {
      getDefenceAreaBySecurity({
        areaNumber: this.form.areaNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.defenceAreaList = data;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>


