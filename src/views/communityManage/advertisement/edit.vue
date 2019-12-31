<template>
  <Modal title="编辑" v-model.trim="visible" :mask-closable="false" :loading="loading">
    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem prop="files.path" label="广告图片">
        <upload v-model="form.files.path" fileNamePrefix="advertisement" :type="uploadType"></upload>
        <Tag v-if="form.type===0">上传格式为mp4的视频，且大小不能超过50M</Tag>
      </FormItem>
      <FormItem label="是否全局">
        <i-switch v-model="form.streetShow" @on-change="valueStaChang">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>

      <FormItem prop="plotNumber" label="小区" v-if="!form.streetShow">
        <address-cascader
          ref="addressCascader"
          @onChange="addressCascaderChange"
          :showLevel="5"
          :valueArr="[form.provinceCode,form.cityCode, form.areaCode, form.streetCode, form.plotNumber]"
        ></address-cascader>
      </FormItem>

      <FormItem label="是否有效">
        <i-switch v-model="form.valueSta" size="large" @on-change="effecTiveChang">
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
      </FormItem>
      <FormItem v-if="form.valueSta" prop="startTime" label="生效时间">
        <DatePicker 
          v-model="form.startTime"
          type="datetime" 
          format="yyyy-MM-dd HH:mm" 
          placeholder="请选择生效时间" 
          style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="是否分时段广告">
        <i-switch size="large" v-model="form.glodenStatus">
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
          ></TimePicker>
      </FormItem>
      <FormItem prop="noticeTypeNumber" label="轮播时间(秒)">
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
          type="date"
          placeholder="选择广告有效时间"
          style="width: 250px"
        ></DatePicker>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import {
  getAdvertisementDetail,
  UpdateAdvertisementList
} from "@/api/communityManage";
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
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      timeValue: ['05:02', '07:08'],
      visible: false,
      ploNumber: null,
      dedail: {
        id: null,
        isShow: false
      },
      activeTime: 10,
      streetShow: null,
      valueSta: null,
      plotList: [],
      effecTive: null,
      subIsLoading: false,
      form: {
        arrdessPolt: null, //小区全名
        streetShow: null, //是否全局
        valueSta: null, //是否有效
        startTime: null,//生效时间
        glodenStatus: null,//是否分时广告
        glodenTime: [],//分时时间段
        array: null,
        IsAdver: null,
        AdverTime: null,
        plotNumber: null, //小区
        provinceCode: null, //省
        cityCode: null, //市
        areaCode: null, //区
        streetCode: null,
        noticeTypeNumber: null,
        type: null,
        files: {
          fileName: "门口机广告图片",
          path: "",
          isLoading: false
        },
        effectiveTime: null // 有效时间
      },
      rules: {
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
    value(val) {
      this.visible = val;
      if (val) {
        this.getDetail();
      } else {
        this.$refs["form"].resetFields();
      }
    },
    visible(val) {
      this.$emit("input", val);
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
    }
  },
  methods: {
    getPlotNumber: function(val) {
      if (val) {
        // console.log(val)
        this.ploNumber = val.plotNumber;
        this.form.plotNumber = val.plotNumber;
        this.form.provinceCode = val.provinceCode; //省
        this.form.cityCode = val.cityCode; //市
        this.form.areaCode = val.areaCode; //区
        this.form.streetCode = val.streetCode; //小区
        this.getgPlot();
      } else {
        this.form.streetShow = true;
      }
    },
    getDetail() {
      getAdvertisementDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        console.log(data);
        if (errorCode === 0) {
          let {
            time, //轮播时间
            url, //广告图片
            plotNumber, //小区number
            effective, //是否有效
            globleStatus, //是否全局
            provinceCode,
            cityCode,
            areaCode,
            streetCode,
            effectiveTime,
            type,
            startTime,
            glodenStatus,
            glodenStart,
            glodenEnd,
          } = data;
          console.log(data);
          this.form.glodenStatus = glodenStatus
          this.form.streetShow =
            globleStatus >= 0 && globleStatus == 0 ? true : false; //初始化全局？
          this.form.valueSta = effective >= 0 && effective == 0 ? true : false; //初始化有效无？
          this.form.noticeTypeNumber = time; //初始化时间
          this.form.files = {
            fileName: "广告图片", //初始化图片
            path: url ? url : ""
          };
          this.form.provinceCode = provinceCode;
          this.form.cityCode = cityCode;
          this.form.areaCode = areaCode;
          this.form.streetCode = streetCode;
          this.form.plotNumber = plotNumber;
          this.form.effectiveTime = new Date(effectiveTime * 1000);
          this.form.type = type
          this.$set(this.form, 'type', type)
          this.form.startTime = new Date(startTime * 1000);
          this.form.glodenTime = []
          this.form.glodenTime[0] = this.getGlodenTime(glodenStart)
          this.form.glodenTime[1] = this.getGlodenTime(glodenEnd)
          console.log(this.form.glodenTime)
        }
      });
    },
    valueStaChang(data) {
      this.form.streetShow = data;
      if (data == false) {
        this.dedail.isShow = true;
        this.form.arrdessPolt = null;
      }
    },
    effecTiveChang(data) {
      this.form.valueSta = data;
    },
    getGlodenTime(startTime){      
      if(startTime||startTime===0){
        startTime = startTime<10? '0'+ startTime : startTime + ''
        startTime = startTime.indexOf('.') > -1?startTime.replace('.', ':'):startTime + ':00'
        startTime = startTime.length<5?startTime+'0':startTime
      }
      return startTime;
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            files, //图片
            plotNumber, //小区
            streetShow, //是否全局
            valueSta, //是否有效
            noticeTypeNumber, //轮播时间
            provinceCode, //省
            cityCode, //市
            areaCode, //区
            streetCode, //小区
            effectiveTime, // 有效时间
            startTime,//生效时间
            glodenStatus,
            glodenTime
          } = this.form;
          let data = {
            id: this.id,
            url: this.form.files.path ? this.form.files.path : "", //图片
            plotNumber: plotNumber
              ? streetShow == true
                ? null
                : plotNumber
              : null, //小区
            time: noticeTypeNumber ? noticeTypeNumber : null, //轮播时间
            effective: valueSta == true ? 0 : 1, //是否有效
            globleStatus: streetShow == true ? 0 : 1, //是否全局
            provinceCode, //省
            cityCode, //市
            areaCode, //区
            streetCode, //小区
            effectiveTime:
              new Date(effectiveTime).getTime() / 1000 + 24 * 60 * 60 - 1,
            startTime: new Date(startTime).getTime()/1000,//生效时间
            glodenStatus: glodenStatus?1:0,
            glodenStart: glodenTime[0].replace(':','.'),//分时开始时间
            glodenEnd: glodenTime[1].replace(':','.'),////分时结束时间 

          };
          console.log(data);
          UpdateAdvertisementList(data)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功!");
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
</style>


