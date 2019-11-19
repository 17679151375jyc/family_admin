<template>
  <Modal
    title="编辑"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
  >
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>

    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="name" label="主机名称">
        <Input v-model.trim="form.name" placeholder="请填写主机名称" style="width: 200px;" />
      </FormItem>
      <FormItem v-if="form.type !== 1" prop="account" label="主机登录号">
        <Input v-model.trim="form.account" placeholder="请填写主机上的设备号" style="width: 200px;" />
      </FormItem>

      <FormItem v-if="form.type !== 1" prop="installCode" label="主机区域码" :required="true">
        <Select v-model="form.installCode" style="width:200px">
          <Option
            v-for="(item,index) in serverList"
            :value="item.installCode"
            :key="index"
          >{{ item.installCode }}</Option>
        </Select>
      </FormItem>

      <FormItem prop="areaNumber" required label="绑定区域" v-if="form.type===1 && phone">
        <Select v-model.trim="form.areaNumber" placeholder="请选择所属区域" style="width: 200px;">
          <Option
            v-for="(item,index) in areaList"
            :key="index"
            :value="item.areaNumber"
          >{{item.areaName}}</Option>
        </Select>
      </FormItem>

      <FormItem prop="defenceAreaNumber" required label="绑定防区" v-if="form.type===1 && phone">
        <Select
          v-model="form.defenceAreaNumber"
          multiple
          style="width:250px;"
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
import {
  getSectorByNumber,
  updateSectorHost,
  getSetupServerList,
  getDefenceAreaBySecurity
} from "@/api/hostManage";
import { getAreaByPhone } from "@/api/dataManage";
export default {
  props: {
    areaNumber: {
      type: String,
      default: null
    },
    number: {
      type: String,
      default: null
    },
    phone: {
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
      serverList: [], // 主机区域列表
      areaList: [], // 安装区域列表
      defenceAreaList: [], // 防区列表
      subIsShow: false,
      isReady: false,
      form: {
        id: null, //
        name: null, // 主机名
        account: null, //主机唯一账号
        areaNumber: null, // 安装区域
        position: null, //位置
        installCode: null, //主机区域码
        buildingName: null, //楼座名
        cityName: null, // 城市名
        doorName: null, //绑定的门号
        phone: null,
        defenceAreaNumber: [] //对应防区
      }
    };
  },
  watch: {
    isShow: async function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        await this.getDetail();
        await this.getDefenceAreaBySecurity(this.areaNumber); // 获取当前详情的区域的防区列表
        await this.getAreaList();
        this.isReady = true;
      } else {
        this.defenceAreaList = [];
        this.areaList = [];
        this.isReady = false;
      }
    },
    "form.areaNumber": function(val) {
      if (this.isReady) {
        this.form.defenceAreaNumber = []; // 清空当前选择的防区
        this.getDefenceAreaBySecurity(val);
      }
    }
  },
  computed: {
    rules: function() {
      return {
        name: [
          {
            required: true,
            message: "请填写主机名称",
            trigger: "blur"
          }
        ],
        account: [
          {
            required: true,
            message: "请填写主机上的设备号",
            trigger: "blur"
          }
        ],
        installCode: [
          {
            required: true,
            message: "请选择主机区域码",
            trigger: "blur"
          }
        ],
        areaNumber: [
          {
            required: true,
            message: "请选择绑定的区域",
            trigger: "blur"
          }
        ],
        defenceAreaNumber: [
          {
            type: "array",
            required: true,
            message: "请选择所属防区",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              console.log("defenceAreaNumber", value.length);
              if (value.length === 0) {
                err = "请选择所属防区";
              }
              callback(err);
            }
          }
        ]
      };
    }
  },
  created() {
    this.getSetupServerList();
  },
  methods: {
    /**
     * 获取详情
     */
    async getDetail() {
      return new Promise(resolve => {
        getSectorByNumber({
          number: this.number
        })
          .then(({ data, errorCode }) => {
            if (errorCode === 0) {
              let { type, cameraList } = data;
              let defenceAreaNumber = [];
              if (type === 1) {
                // 如果是视频主机类型
                if (cameraList && cameraList.length != 0) {
                  let defenceAreaList = cameraList[0].defenceAreaList;
                  for (let i = 0; i < defenceAreaList.length; i++) {
                    defenceAreaNumber.push(defenceAreaList[i].defenceNumber);
                  }
                }
              }
              this.form = Object.assign(this.form, data, {
                defenceAreaNumber
              });
              resolve();
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            name,
            id,
            account,
            position,
            installCode,
            defenceAreaNumber
          } = this.form;
          this.subIsShow = true;
          updateSectorHost({
            name,
            id,
            account,
            position,
            installCode,
            defenceAreaNumber: defenceAreaNumber.join(",")
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
    },
    /**
     * 获取配网服务器列表
     */
    getSetupServerList() {
      getSetupServerList({
        page: 1,
        pageSize: 999
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.serverList = data.list;
        }
      });
    },
    /**
     * 根据手机号查询用户对应的安装区域
     */
    async getAreaList() {
      return new Promise((resolve, reject) => {
        this.areaList = [];
        if (!this.phone) {
          resolve();
        } else {
          getAreaByPhone({
            userPhone: this.phone
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
                resolve();
              }
            })
            .catch(() => {
              reject();
            });
        }
      });
    },
    /**
     * 根据区域获取防区列表
     */
    async getDefenceAreaBySecurity(areaNumber) {
      return new Promise((resolve, reject) => {
        if (!areaNumber) {
          resolve();
        } else {
          getDefenceAreaBySecurity({
            areaNumber
          })
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.defenceAreaList = data;
                resolve();
              }
            })
            .catch(() => {
              reject();
            });
        }
      });
    }
  }
};
</script>


