<template>
  <Modal
    title="添加"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="700"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>

    <!-- 右上角关闭按钮-start -->
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="area" label="省市区信息">
        <address-cascader
          ref="addressCascader"
          @onChange="addressCascaderChange"
          :showAllText="true"
          :showAllTextLevel="4"
          :showLevel="4"
        ></address-cascader>
      </FormItem>
      <FormItem prop="startTime" label="选择排班日期">
        <DatePicker
          ref="dataTimePicker"
          type="daterange"
          format="yyyy-MM-dd"
          v-model="form.dateRange"
          :options="datePicekerOption"
          @on-change="changeDate"
          placeholder="选择查询的时间段"
          style="width: 250px"
        ></DatePicker>
      </FormItem>
      <FormItem prop="plotArr" label="选择小区">
        <Select
          style="width:250px;"
          ref="plotArr"
          @on-change="selPlot"
          :label-in-value="true"
          multiple
        >
          <Option value="null" disabled>
            <span>名称</span>
            <span class="select-right-span" style="padding-right:20px;">巡更点</span>
          </Option>
          <Option
            v-for="(item, index) in plotList"
            :key="index"
            :value="item.plotNumber"
            :label="item.plotName"
          >
            <span>{{item.plotName}}</span>
            <span class="select-right-span" style="padding-right:20px;">{{item.pointNumber}}个</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem prop="captainNumber" label="负责队长">
        <Select
          v-model="form.captainNumber"
          @on-change="selCaptain"
          :label-in-value="true"
          placeholder="请选择负责的队长"
          style="width:250px;"
        >
          <Option
            v-for="(item, index) in captainList"
            :key="index"
            :value="item.number"
          >{{item.realName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="restDay" label="默认休息天数">
        <Select v-model="form.restDay" style="width: 250px;">
          <Option v-for="item in 11" :value="item-1" :key="item">{{item-1}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="shiftList" label="添加班次">
        <duty-shifts :shiftList="form.shiftList" @addShift="addShift" @delShift="delShift"></duty-shifts>
      </FormItem>
      <FormItem label="人员调整">
        <personnel-turnover
          :captainNumber="form.captainNumber"
          :captainName="form.captainName"
          :startTime="form.startTime"
          :endTime="form.endTime"
          :turnoverList="form.turnoverList"
          :userList="userList"
          @addTurnover="addTurnover"
          @delTurnover="delTurnover"
        ></personnel-turnover>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">自动生成排班</Button>
    </div>
  </Modal>
</template>
<script>
import { addDevice } from "@/api/installManage";
import { getPlot, addDuty } from "@/api/patrolManage";
import { getServerUserList } from "@/api/userManage";
import DutyShifts from "./dutyShifts"; // 排班班次
import PersonnelTurnover from "./personnelTurnover"; // 人员调整
import AddressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: {
    AddressCascader,
    DutyShifts,
    PersonnelTurnover
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
      roleList: [],
      subIsShow: false,
      plotList: [], // 小区列表
      captainList: [], // 队长列表
      userList: [], //队长下面，所属的队员列表
      datePicekerOption: {
        // 排班日期配置
        disabledDate(date) {
          // 只能选择今天或以后的
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      form: {
        captainNumber: "", // 当前队长
        captainName: "", // 队长名
        dateRange: [], // 时间范围
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        province: null,
        city: null,
        area: null,
        street: null,
        plotArr: [], // 选择的小区
        restDay: 0, // 休息时间
        shiftList: [], //班次列表
        turnoverList: [] // 人员调整列表
      },
      rules: {
        area: [
          {
            required: true,
            message: "请选择小区对应的省市区",
            trigger: "true"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请选择排班日期",
            trigger: "true"
          }
        ],
        plotArr: [
          {
            type: "array",
            required: true,
            message: "请选择排班小区",
            trigger: "true"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (value.length === 0) {
                err = "请至少选择一个小区进行排班";
              }
              callback(err);
            }
          }
        ],
        restDay: [
          {
            type: "number",
            required: true,
            message: "请选择休息天数",
            trigger: "true"
          }
        ],
        shiftList: [
          {
            type: "array",
            required: true,
            message: "请添加班次",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (value.length === 0) {
                err = "请添加排班";
              }
              callback(err);
            }
          }
        ],
        captainNumber: [
          {
            required: true,
            message: "请选择负责队长",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {
    isShow: function(val, oldVal) {
      if (!val) {
        this.$refs["plotArr"].reset();
      }
      this.$refs["form"].resetFields();
      this.form.turnoverList = [];
      this.$refs["addressCascader"].resetData();
      this.$refs["dataTimePicker"].handleClear();
    },
    "form.area": function(val, oldVal) {
      console.log("区改变了");
      this.plotList = [];
      this.form.plotNumber = null;
      this.form.plotName = null;
      if (val && this.form.startTime) {
        this.getPlot();
      }
      if (!val) {
        this.form.plotNumber = null;
      }
    },
    "form.street": function(val, oldVal) {
      console.log("街道改变了");
      this.plotList = [];
      this.form.plotNumber = null;
      this.form.plotName = null;
      if (this.form.area && this.form.startTime) {
        this.getPlot();
      }
    },
    "form.startTime": function(val, oldVal) {
      this.plotList = [];
      this.form.plotNumber = null;
      this.form.plotName = null;
      if (val && this.form.area) {
        this.getPlot();
      }
      if (!val) {
        this.plotList = [];
      }
    },
    "form.captainNumber": function(val, oldVal) {
      this.userList = [];
      if (val) {
        this.getServerUserList();
      }
    }
  },
  created() {
    this.getCaptainList(); // 获取队长列表
  },
  methods: {
    handleClose() {
      // 当窗口关闭时触发
      this.$emit("handleClose");
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          console.log("验证成功 ");

          this.subIsShow = true;
          let {
            turnoverList,
            shiftList,
            plotArr,
            startTime,
            endTime,
            restDay,
            captainNumber
          } = this.form;
          //遍历人员调整数据
          let dutyMembers = [];
          for (let i = 0; i < this.userList.length; i++) {
            dutyMembers.push({
              fsUserNumber: this.userList[i].number
            });
          }
          for (let i = 0; i < turnoverList.length; i++) {
            for (let j = 0; j < dutyMembers.length; j++) {
              if (turnoverList[i].number === dutyMembers[j].fsUserNumber) {
                dutyMembers[j].restDay = turnoverList[i].restDayQuantity;
                dutyMembers[j].restDates = turnoverList[i].restDays
                  ? {
                      list: turnoverList[i].restDays.split(",")
                    }
                  : {};
              }
            }
            // dutyMembers.push({
            //   fsUserNumber: turnoverList[i].number,
            //   restDay: turnoverList[i].restDayQuantity,
            //   restDates: turnoverList[i].restDays
            //     ? {
            //         list: turnoverList[i].restDays.split(",")
            //       }
            //     : {}
            // });
          }

          //遍历班次
          let dutyShifts = [];
          for (let i = 0; i < shiftList.length; i++) {
            dutyShifts.push({
              name: shiftList[i].name,
              time: shiftList[i].timeRange,
              shiftOrder: i + 1
            });
          }

          //遍历所选小区
          let dutyAreas = [];
          for (let i = 0; i < plotArr.length; i++) {
            dutyAreas.push({
              plotNumber: plotArr[i].value,
              plotName: plotArr[i].label
            });
          }

          let data = {
            dutyMembers: dutyMembers,
            dutyShifts: dutyShifts,
            dutyAreas: dutyAreas,
            dataRange: startTime + "~" + endTime,
            defaultRestDay: restDay,
            fsUserNumber: captainNumber
          };
          console.log("生成值班表数据", data);
          addDuty(data)
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
     * 选择日期范围时触发
     */
    changeDate(e) {
      console.log(e);
      this.form.startTime = e[0];
      this.form.endTime = e[1];
    },
    /**
     * 选择省市区返回数据
     */
    addressCascaderChange(val, value) {
      this.form.province = value[0] && value[0].value;
      this.form.city = value[1] && value[1].value;
      this.form.area = value[2] && value[2].value;
      this.form.street = value[3] && value[3].value;
    },
    /**
     * 根据街道、日期查出小区
     */
    getPlot() {
      let { area, street, startTime, endTime } = this.form;
      getPlot({
        areaCode: area,
        streetCode: street,
        dutyStartTime: startTime,
        dutyEndTime: endTime,
        areaTypes: [1, 2]
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          console.log(data);
          this.plotList = data.list;
        }
      });
    },
    /**
     * 选中小区
     */
    selPlot(value) {
      this.form.plotArr = value;
    },
    /**
     * 添加班次
     */
    addShift({ name, timeRange }) {
      this.form.shiftList.push({
        name,
        timeRange
      });
    },
    /**
     * 删除一项排班
     */
    delShift(index) {
      this.form.shiftList.splice(index, 1);
    },
    /**
     * 获取安保队长和安维保队长
     */
    getCaptainList() {
      getServerUserList({
        page: 1,
        pageSize: 999,
        captains: [
          this.$config.serverUser.type[1].value,
          this.$config.serverUser.type[3].value
        ],
        roleType: 0, // 安保角色
        status: 2 // 审核通过
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.captainList = data.list;
        }
      });
    },
    /**
     * 添加一条人员调整信息
     */
    addTurnover({ number, userName, restDayQuantity, restDays }) {
      console.log("人员调整信息", number, userName, restDayQuantity, restDays);
      let isHas = false; //判断是否已存在
      for (let i = 0; i < this.form.turnoverList.length; i++) {
        if (this.form.turnoverList[i].number === number) {
          isHas = true;
        }
      }
      if (!isHas) {
        this.form.turnoverList.push({
          number,
          userName,
          restDayQuantity,
          restDays: restDays
        });
      } else {
        this.$Message.warning("不能重复调整同一个人员");
      }
    },
    /**
     * 删除一项人员调整
     */
    delTurnover(index) {
      this.form.turnoverList.splice(index, 1);
    },
    /**
     * 选择队长时，把队长名也存起来
     */
    selCaptain(value) {
      console.log(value);
      this.form.captainName = value && value.label;
    },
    /**
     * 获取队长下面人员列表
     */
    getServerUserList() {
      getServerUserList({
        page: 1,
        pageSize: 999,
        roleType: this.$config.serverUser.role[0].value,
        parentNumber: this.form.captainNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.userList = [
            { number: this.form.captainNumber, realName: this.form.captainName }
          ];
          for (let i = 0; i < data.list.length; i++) {
            this.userList.push(data.list[i]);
          }
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>


