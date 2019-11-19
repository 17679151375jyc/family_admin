<template>
  <Modal
    title="编辑"
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

    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem prop="files.path" label="广告图片">
        <upload v-model="form.files.path" fileNamePrefix="advertisement"></upload>
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
      <FormItem prop="noticeTypeNumber" label="轮播时间(秒)">
        <Select v-model.trim="form.noticeTypeNumber" placeholder="输入轮播时间" style="width: 140px;">
          <Option
            v-for="(item,index) in activeTime"
            :value="item*activeTime"
            :key="index"
          >{{ item*activeTime }}s</Option>
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
import {
  AddAdvertisementList,
  getAdvertisementDetail,
  UpdateAdvertisementList
} from "@/api/communityManage";
import { getPlotDetail } from "@/api/dataManage";
import { getPlotList } from "@/api/common";
import addressCascader from "@/components/addressCascader/addressCascader";
import upload from '@/components/upload/upload'
export default {
  components: {
    addressCascader,
    upload
  },
  props: {
    isShow: {
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
      subIsShow: false,
      form: {
        arrdessPolt: null, //小区全名
        streetShow: null, //是否全局
        valueSta: null, //是否有效
        array: null,
        IsAdver: null,
        AdverTime: null,
        plotNumber: null, //小区
        provinceCode: null, //省
        cityCode: null, //市
        areaCode: null, //区
        streetCode: null,
        noticeTypeNumber: null,
        files: {
          fileName: "门口机广告图片",
          path: "",
          isLoading: false
        }
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
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
      if (val) {
        this.getDetail();
      }
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
      console.log(this.id);
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
            streetCode
          } = data;
          console.log(data);
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
          //   this.getgPlot(); //初始化小区number
        }
      });
    },
    editClose(isRefresh = false) {
      this.dedail.isShow = false;
      if (isRefresh) {
        // this.getList();
      }
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
    handleClose() {
      this.$emit("handleClose");
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
            streetCode //小区
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
            streetCode //小区
          };
          console.log(data);
          UpdateAdvertisementList(data)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("编辑成功!");
                this.$emit("handleClose", true);
                this.subIsShow = false;
              }
            })
            .catch(err => {
              this.subIsShow = false;
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
      this.form.plotNumber = value[4]
    },
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


