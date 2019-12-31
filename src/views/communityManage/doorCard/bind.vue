<template>
  <Modal title="编辑" v-model.trim="visible" :mask-closable="false">
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="type" label="绑卡用户类型">
        <RadioGroup v-model="form.type">
          <Radio :label="item.code" v-for="item in CardType" :key="item.code">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem prop="domicileNumber" required label="绑定业主" v-show="form.type === 2">
        <address-cascader
          v-if="!curPlotNumber"
          ref="addressCascader1"
          @onChange="addressCascaderChange"
          :showLevel="8"
          style="width:350px;"
        ></address-cascader>
        <building-cascader
          v-if="curPlotNumber"
          ref="buildingCascader"
          :showLevel="3"
          @onChange="buildingCascaderChange"
          style="width: 150px;"
        ></building-cascader>
      </FormItem>

      <FormItem
        :required="true"
        prop="plotNumber"
        label="选择小区"
        v-show="!curPlotNumber && form.type===1"
      >
        <address-cascader
          ref="addressCascader2"
          @onChange="addressCascaderChange"
          :showLevel="5"
          style="width:350px;"
        ></address-cascader>
      </FormItem>

      <FormItem prop="fsUserNumber" label="绑定物管" v-if="form.type===1">
        <Select
          v-model="form.fsUserNumber"
          placeholder="请选择对应的物管"
          style="width:200px;"
          v-show="form.type===1 && (form.plotNumber || curPlotNumber)"
        >
          <Option
            v-for="item in serverUserList"
            :key="item.number"
            :value="item.number+'/'+item.realName"
          >{{item.realName?item.realName:item.phone}}</Option>
        </Select>
        <span v-show="form.type===1 && !form.plotNumber && !curPlotNumber">请先选择小区</span>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addDoorCard, bindCard } from "@/api/communityManage";
import { getServerUserList } from "@/api/userManage";
import { mapState } from "vuex";
import addressCascader from "@/components/addressCascader/addressCascader";
import BuildingCascader from "@/components/buildingCascader/buildingCascader";
export default {
  components: {
    addressCascader,
    BuildingCascader
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: false
    },
  },

  data() {
    return {
      CardType: this.$options.filters.statusList("CardType"),
      subIsLoading: false,
      visible: false,
      serverUserList: [],
      form: {
        id: null,
        plotNumber: "",
        type: null,
        domicileNumber: "",
        domicileName: '',
        fsUserNumber: "",
        fsUserName: '',

      },
      rules: {
        plotNumber: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (!this.curPlotNumber && !value) {
                err = "请选择门卡绑定的业主";
              }
              callback(err);
            }
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择绑卡用户类型",
            trigger: "blur"
          }
        ],
        domicileNumber: [
          {
            validator: (rule, value, callback, source, options) => {
              let err = [];
              if (this.form.type === 2 && !value) {
                err = "请选择门卡绑定的业主";
              }
              callback(err);
            }
          }
        ],
        fsUserNumber: [
            {
              validator: (rule, value, callback, source, options) => {
                let err = [];
                if (this.form.type === 1 && !value) {
                  err = "请选择门卡绑定的物管";
                }
                callback(err);
              }
            }
        ]
      }
    };
  },
  watch: {
    value: function(val) {
      this.visible = val;
      this.form.id = this.id;
    },
    visible: function(val) {
      if (!val) {
        this.$refs["form"].resetFields();
        this.$refs["addressCascader1"] &&
          this.$refs["addressCascader1"].resetData();
        this.$refs["addressCascader2"] &&
          this.$refs["addressCascader2"].resetData();
        this.$refs["buildingCascader"] &&
          this.$refs["buildingCascader"].resetData();
      }
      this.$emit("input", val);
    },
    "form.type": function(val) {
      this.form.fsUserNumber = null;
      this.$refs["addressCascader1"] &&
        this.$refs["addressCascader1"].resetData();
      this.$refs["addressCascader2"] &&
        this.$refs["addressCascader2"].resetData();
      this.$refs["buildingCascader"] &&
        this.$refs["buildingCascader"].resetData();
      if (val === 2 && this.form.plotNumber) {
        // 如果是选择绑定为物管时，要请求这个小区的所有物管
        this.getServerUserList();
      }
    },
    "form.plotNumber": function(val) {
      if (this.form.type === 2 && val) {
        // 如果是选择绑定为物管时，要请求这个小区的所有物管
        this.getServerUserList(val);
      }
    },
    curPlotNumber: {
      handler: function(val) {
        this.getServerUserList(val);
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      curPlotNumber: state => state.user.curPlotNumber
    })
  },
  methods: {
    /**
     * 提交数据
     */
    submit() {
      this.subIsLoading = true;
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            id,
            plotNumber,
            fsUserNumber,
            domicileNumber,
            domicileName,
            type,
            buildingNumber,
            doorNumber
          } = this.form;
          let dataList;
          if(type == 1){
            dataList = {
              id,
              fsUserNumber: fsUserNumber.split('/')[0],
              fsUserName: fsUserNumber.split('/')[1]
            }
          }else if(type == 2){
            dataList = {
              id,
              domicileNumber,
              domicileName
            }
          }
          console.log(dataList)
          bindCard(dataList)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功!");
                this.subIsLoading = false;
                this.visible = false;
              }
            })
            .catch(err => {
              this.subIsLoading = false;
            });
        } else {
          this.subIsLoading = false;
          this.$Message.error("提交信息有误!");
        }
      });
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value, selectedData) {
      this.form.provinceCode = value[0];
      this.form.cityCode = value[1];
      this.form.areaCode = value[2];
      this.form.streetCode = value[3];
      this.form.plotNumber = value[4];
      this.form.buildingNumber = value[5];
      this.form.doorNumber = value[6];
      this.form.domicileNumber = value[7];
      this.form.domicileName = (selectedData[7] ? selectedData[7].label : '');
    },

    /**
     * 楼座组件改变
     */
    buildingCascaderChange(value) {
      this.form.buildingNumber = value[0];
      this.form.doorNumber = value[1];
      this.form.domicileNumber = value[2];
    },
    /**
     * 获取物管列表
     */
    getServerUserList(plotNumber) {
      getServerUserList({
        plotNumber,
        roleType: 2,
        page: 1,
        pageSize: 99
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.serverUserList = data.list;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.logo-wrapper {
  position: relative;
  width: 100px;
  height: 136px;

  .logo {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    margin-bottom: 4px;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  input {
    display: block;
    position: absolute;
    width: 100px;
    height: 30px;
    left: 0;
    bottom: 0;
    opacity: 0;
  }
}
</style>


