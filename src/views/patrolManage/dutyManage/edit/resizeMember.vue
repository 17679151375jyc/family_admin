<template>
  <Modal title="调整人员" v-model="visible" :mask-closable="false" :closable="true" width="600">
    <div class="tab-wrapper">
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconriqi"></i>
            <span>日期</span>
          </div>
          <div class="text">{{date}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont iconlingdaitie3"></i>
            <span>班次</span>
          </div>
          <div class="text">{{shiftName}}</div>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="label">
            <i class="iconfont iconshijian"></i>
            <span>时间</span>
          </div>
          <div class="text">{{shiftTime}}</div>
        </div>

        <div class="item">
          <div class="label">
            <i class="iconfont icongeren"></i>
            <span>值班人员</span>
          </div>
          <div class="text">{{memberName}}</div>
        </div>
      </div>
    </div>
    <Form :model="form" ref="form" style="margin-top:30px;">
      <FormItem prop="fsUserNumbers" label="调整人员">
        <Select v-model="form.fsUserNumbers" multiple style="width:300px;" placeholder="请选择值班人员">
          <Option
            v-for="item in dutyMembers"
            :key="item.fsUserNumber"
            :value="item.fsUserNumber"
          >{{item.fsUserName}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible = false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import {updateDutyMember}  from '@/api/patrolManage'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: ""
    },
    shiftName: {
      type: String,
      default: ""
    },
    shiftTime: {
      type: String,
      default: ""
    },
    shiftId: {
      type: String,
      default: ""
    },
    memberName: {
      type: String,
      default: ""
    },
    dutyMembers: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    value: function(val) {
      this.visible = val;
    },
    visible: function(val, oldVal) {
      if (!val) {
          this.$refs['form'].resetFields()
      }
      this.$emit("input", val);
    }
  },
  data() {
    return {
      visible: false,
      form: {
        fsUserNumbers: []
      },
      subIsLoading: false
    };
  },
  methods: {
      /**
       * 提交更新数据
       */
      submit() {
          this.subIsLoading = true
          updateDutyMember({
              day:this.date,
              shiftId: this.shiftId,
              fsUserNumbers: this.form.fsUserNumbers
          }).then(({data, errorCode}) => {
              this.subIsLoading = false
              if (errorCode === 0) {
                  this.$Message.success('调整成功')
                  this.visible = false
              }
          }).catch(() => {
              this.subIsLoading = false
          })
      }
  }
};
</script>