<template>
  <Modal title="添加" v-model.trim="visible" :mask-closable="false" :loading="loading">
    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem prop="type" label="广告类型">
        <Select placeholde="请选择广告类型" v-model="form.type" style="width:200px;">
          <Option
            v-for="(item, index) in $options.filters.statusList('AdvertisementType')"
            :key="index"
            :value="item.code"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem
        prop="files.path"
        v-if="form.type!=null"
        :label="`上传${$options.filters.statusName(form.type, 'AdvertisementType')}`"
      >
        <upload v-model="form.files.path" fileNamePrefix="ggBanner" :type="uploadType"></upload>
        <Tag v-if="form.type===0">上传格式为mp4的视频，且大小不能超过50M</Tag>
      </FormItem>
      <FormItem label="是否全局">
        <i-switch @on-change="valueStaChang">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>

      <FormItem prop="plotNumber" label="对应小区" v-if="!form.streetShow">
        <div style="display: flex;">
          <address-cascader
            ref="addressCascader"
            @onChange="addressCascaderChange"
            :showLevel="5"
            style="width: 350px"
          ></address-cascader>
        </div>
      </FormItem>

      <!-- <FormItem label="是否有效">
        <i-switch size="large" @on-change="effecTiveChang">
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
      </FormItem> -->

      <FormItem prop="startTime" label="生效时间">
        <DatePicker
          v-model="form.startTime"
          :options="effectiveTimeOptions"
          type="date"
          format="yyyy-MM-dd"
          placeholder="请选择生效时间"
          style="width: 140px"
        ></DatePicker>
      </FormItem>
      <FormItem label="是否分时段广告">
        <i-switch size="large" @on-change="effecTiveChangKing">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem prop="glodenTime" label="分时时间段" v-if="form.glodenStatus">
        <TimePicker
          type="timerange"
          format="HH:mm"
          placeholder="请选择分时时间段"
          style="width: 140px"
          v-model="form.glodenTime"
          hide-disabled-options
        ></TimePicker>
      </FormItem>
      <FormItem prop="noticeTypeNumber" label="轮播时间(秒)" v-if="form.type!==0">
        <Select v-model.trim="form.noticeTypeNumber" placeholder="输入轮播时间" style="width: 140px;">
          <Option :value="5">5s</Option>
          <Option
            v-for="(item,index) in activeTime"
            :value="item*activeTime"
            :key="index"
          >{{ item*activeTime }}s</Option>
        </Select>
      </FormItem>
      <FormItem prop="effectiveTime" label="广告有效时间">
        <DatePicker
          v-model.trim="form.effectiveTime"
          :options="IsEffectiveTimeOptions"
          type="date"
          placeholder="选择广告有效时间"
          style="width: 140px"
        ></DatePicker>
      </FormItem>
      <FormItem prop="remark" label="备注">
        <Input v-model="form.remark" type="textarea" :rows="4" placeholder="请填写备注" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { AddAdvertisementList } from "@/api/communityManage";
import { getPlotList } from "@/api/common";
import addressCascader from "@/components/addressCascader/addressCascader";
import upload from "@/components/upload/upload";
export default {
  components: {
    addressCascader,
    upload
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: null
    },
    code: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      startTimeValue: Date.now() - 86400000,
      visible: false,

      effectiveTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      activeTime: 10,
      streetShow: null,
      plotList: [],
      effecTive: null,
      subIsLoading: false,
      form: {
        streetShow: null,
        // effective: null,
        startTime: null, //生效时间
        glodenTime: [], //分时时间段
        glodenStatus: 0, //是否分时广告
        array: null,
        IsAdver: null,
        AdverTime: null,
        plotNumber: null, //小区
        provinceCode: null, //省
        cityCode: null, //市
        areaCode: null, //区
        streetCode: null, //小区
        noticeTypeNumber: null,
        type: null,
        files: {
          fileName: "门口机logo",
          path: "",
          isLoading: false
        },
        effectiveTime: null, // 有效时间
        remark: null // 备注
      },
      rules: {
        glodenTime: [
          {
            type: "array",
            required: true,
            message: "请选择分时时间段",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value[0] == "" && value[1] == "") {
                err = "请选择分时时间段";
              }
              callback(err);
            }
          }
        ],
        startTime: [
          {
            type: "date",
            required: true,
            message: "请选择生效时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择广告类型",
            trigger: "blur"
          }
        ],
        "files.path": [
          {
            required: true,
            message: "请上传广告图片，宽高比为16:9",
            trigger: "blur"
          }
        ],
        noticeTypeNumber: [
          {
            type: "number",
            required: true,
            message: "请选择轮播时间",
            trigger: "blur"
          }
        ],
        plotNumber: [
          {
            // type: "array",
            // type: 'number',
            // type: 'string',

            required: true,
            message: "请选择小区",
            trigger: "blur"
          }
        ],
        effectiveTime: [
          {
            type: "date",
            required: true,
            message: "请选择广告有效时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    'form.startTime':function(val) {
      if(val){
        this.startTimeValue = val.valueOf()
      }else{
        this.startTimeValue = Date.now() - 86400000
      }
    },
    value(val) {
      this.visible = val;
      if (!val) {
        this.$refs["form"].resetFields();
        this.$refs["addressCascader"] &&
          this.$refs["addressCascader"].resetData();
      }
    },
    visible(val) {
      this.$emit("input", val);
    },
    // isShow: function(val, oldVal) {
    //   this.$refs["form"].resetFields();
    //   this.$refs["addressCascader"] &&
    //     this.$refs["addressCascader"].resetData();
    // },
    "form.streetCode": function(val, oldVal) {
      if (val) {
        this.getPlotList(); // 当选择了街道时，拉一下小区数据
      } else {
        this.plotList = [];
      }
    }
  },
  computed: {
    uploadType: function() {
      let uploadType = null;
      if (this.form.type === 0) {
        uploadType = "video";
      } else if (this.form.type === 1) {
        uploadType = "image";
      }
      return uploadType;
    },
    IsEffectiveTimeOptions: function(){
      let that = this
      return {
        disabledDate(date) {
          return date && date.valueOf() < that.startTimeValue
        }
      }
    }
  },
  methods: {
    valueStaChang(data) {
      this.form.streetShow = data;
      if(data){
        this.form.provinceCode = null;
        this.form.cityCode = null;
        this.form.areaCode = null;
        this.form.streetCode = null;
        this.form.plotNumber = null;
      }
    },
    effecTiveChangKing(data) {
      console.log(data)
      this.form.glodenStatus = data ? 1 : 0;
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            files, //图片
            plotNumber, //小区number
            streetShow, //是否全局
            // effective, //是否有效
            noticeTypeNumber, //轮播时间
            areaCode, //区
            cityCode, //市
            provinceCode, //省
            streetCode, //小区
            effectiveTime, // 有效时间
            type, // 广告类型
            startTime, //生效时间
            glodenStatus, //是否分时广告
            glodenTime,
            remark // 备注
          } = this.form;
          let data = {
            url: files.path ? files.path : "", //图片
            plotNumber: plotNumber ? plotNumber : null, //小区number
            globleStatus: streetShow == true ? 0 : 1, //是否全局
            // effective: effective == true ? 0 : 1, //是否有效
            time: noticeTypeNumber ? noticeTypeNumber : null, //轮播时间
            provinceCode, //省
            cityCode, //市
            areaCode, //区
            streetCode, //小区
            effectiveTime:
              new Date(effectiveTime).getTime() / 1000 + 24 * 60 * 60 - 1,
            type,
            startTime: new Date(startTime).getTime() / 1000, //生效时间
            glodenStatus: glodenStatus ? 1 : 0, //是否分时广告  0否，1是
            glodenStart: glodenStatus ?  glodenTime[0].replace(":", "."):null , //分时开始时间
            glodenEnd: glodenStatus ? glodenTime[1].replace(":", "."):null   , ////分时结束时间，
            remark
          };
          console.log(data);
          AddAdvertisementList(data)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功!");
                this.visible = false;
                this.subIsLoading = false;
              }
            })
            .catch(err => {
              this.subIsLoading = false;
            });
        } else {
          this.$Message.error("提交信息有误!");
        }
      });
    },
    /**
     * 根据省市区获取小区列表
     */
    getPlotList() {
      getPlotList({
        streetCode: this.form.streetCode
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.plotList = data.list;
        }
      });
    },
    /**
     * 地址选择组件改变
     */
    addressCascaderChange(value) {
      this.form.provinceCode = value[0];
      this.form.cityCode = value[1];
      this.form.areaCode = value[2];
      this.form.streetCode = value[3];
      this.form.plotNumber = value[4];
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

.abc {
  background-color: red;
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>


