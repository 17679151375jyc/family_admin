<template>
  <div>
    <!-- 添加班次弹窗-start -->
    <Modal title="调整人员" v-model="modalIsVisible" :mask-closable="false" :closable="false">
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem prop="number" label="选择人员">
          <Select
            v-model="form.number"
            style="width: 200px;"
            :label-in-value="true"
            @on-change="userChange"
          >
            <Option
              v-for="(item, index) in userList"
              :key="index"
              :value="item.number"
            >{{item.realName}}</Option>
          </Select>
        </FormItem>
        <FormItem prop='restDayQuantity' label="休息天数">
          <Select v-model="form.restDayQuantity" placeholder="请选择休息天数" style="width:200px;">
              <Option :value="0">0天</Option>
            <Option v-for="item in restDayQuantity" :value="item" :key="item">{{item}}天</Option>
          </Select>
        </FormItem>
        <FormItem prop="restDays" label="指定休息时间">
          <DatePicker
            type="date"
            :options="datePickerOption"
            multiple
            v-model="form.restDays"
            placeholder="选择休息时间"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalIsVisible = false">取消</Button>
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>
    <!-- 添加班次弹窗-end -->

    <div style="text-align:right;">
      <Button type="primary" size="small" @click="showModal">调整人员</Button>
    </div>
    <!-- 表单-start -->
    <Table border stripe highlight-row :columns="tabCol" :data="turnoverList"></Table>
    <!-- 表单-end -->
  </div>
</template>

<script>
import { getServerUserList } from "@/api/userManage";
export default {
  props: {
    turnoverList: {
      type: Array,
      default: function() {
        return [
          //   {
          //     name: "早班",
          //     timeRange: "8:00 - 16:00"
          //   }
        ];
      }
    },
    userList: {
        type:Array,
        default: function () {
            return []
        }
    },
    captainNumber: { // 队称number
      type: String,
      default: ""
    },
    captainName: { // 队长名称
        type: String,
        default: ''
    },
    startTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    }
  },
  watch: {
    modalIsVisible() {
      this.$refs["form"].resetFields();
    },
    // captainNumber: {
    //   handler: function(val, oldVal) {
    //     this.userList = [];
    //     if (val) {
    //       this.getServerUserList();
    //     }
    //   },
    //   immediate: true
    // }
  },
  data() {
    return {
      modalIsVisible: false,
    //   personList: [], // 人员列表
      form: {
        number: "",
        userName: "", // 人员名称
        restDays: [], // 指定的休息时间 
        restDayQuantity: 0, // 休息天数
      },
      rules: {
        number: [
          {
            required: true,
            message: "请选择需调整的人员",
            trigger: "blur"
          }
        ],
        restDayQuantity: [
            {
                validator: (rule, value, callback, source, options) => {
                    let err = []
                    if (value < this.form.restDays.length){
                        err="休息天数不能少于指定休息时间的天数"
                    }
                    callback(err)
                }
            }
        ]
      }
    };
  },
  computed: {
    tabCol: function() {
      return [
        {
          title: "人员名称",
          key: "userName"
        },
        {
          title: "休息天数",
          key: "restDayQuantity",
          width: 100
        },
        {
          title: "休息日期",
          key: "restDays"
        },
        {
          title: "操作",
          width: 100,
          align: "center",
          render: (h, params) => {
            return [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.delItem(params.index);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              )
            ];
          }
        }
      ];
    },
    datePickerOption: function() {
      let that = this;
      if (that.endTime && that.startTime) {
        return {
          disabledDate(date) {
            return (
              date &&(
              date.valueOf() >
                new Date(that.endTime.split("-").join("/")).valueOf() ||
              date.valueOf() <
                new Date(that.startTime.split("-").join("/")).valueOf()
            ));
          }
        };
      } else {
        return {};
      }
    },
    restDayQuantity: function () { // 可休息总数
        if (this.startTime) {
            return (new Date(this.endTime).valueOf() - new Date(this.startTime).valueOf()) / 86400000 + 1
        } else {
            return 0
        }
    }
  },
  methods: {
    /**
     * 提交数据
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {  number,
            userName,
            restDayQuantity,
            restDays} = this.form;
            let restDaysArr = []
            for (let i = 0; i < restDays.length; i++){
                restDaysArr.push(
                    this.$options.filters.formatTime((new Date(restDays[i])).valueOf(), 'Y-M-D')
                    
                )
            }
          this.$emit("addTurnover", { // 添加调整数据
            number,
            userName,
            restDayQuantity,
            restDays: restDaysArr.join(',')
          });
          this.modalIsVisible = false;
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 删除某一项排班
     */
    delItem(index) {
      console.log(index);
      this.$emit("delTurnover", index);
    },
    /**
     * 显示添加弹窗
     */
    showModal() {
      if (!this.captainNumber) {
        this.$Message.warning("请先选择队长");
        return;
      }
      if (!this.startTime) {
        this.$Message.warning("请先选择排班日期");
        return;
      }
      this.modalIsVisible = true;
    },
    /**
     * 获取队长下面人员列表
     */
    // getServerUserList() {
    //   getServerUserList({
    //     page: 1,
    //     pageSize: 999,
    //     roleType: this.$config.serverUser.role[0].value,
    //     parentNumber: this.captainNumber
    //   }).then(({ data, errorCode }) => {
    //     if (errorCode === 0) {
    //       this.userList = data.list;
    //     }
    //   });
    // },
    /**
     * 选择人 员改变时
     */
    userChange(value) {
      this.form.userName =value &&  value.label;
    }
  }
};
</script>

