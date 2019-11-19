<template>
  <Modal title="添加" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem prop="files.path" label="广告图片">
          <upload v-model="form.files.path" fileNamePrefix="advertisement"></upload>
      </FormItem>
      <FormItem label="是否全局" >
        <i-switch @on-change='valueStaChang'>
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>

        <FormItem prop="plotNumber" label="对应小区" v-if='!form.streetShow'>
          <div style="display: flex;">
            <address-cascader
              ref="addressCascader"
              @onChange="addressCascaderChange"
              :showLevel="5"
               style="width: 150px"
            ></address-cascader>
          </div>
        </FormItem>

      <FormItem label="是否有效">
        <i-switch size="large" @on-change='effecTiveChang'>
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
      </FormItem>
      <FormItem prop="noticeTypeNumber" label="轮播时间(秒)" >
        <Select v-model.trim='form.noticeTypeNumber' placeholder="输入轮播时间" style="width: 140px;">
          <Option v-for="(item,index) in activeTime" :value="item*activeTime" :key="index">{{ item*activeTime }}s</Option>
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
import { AddAdvertisementList } from "@/api/communityManage";
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
    }
  },
  data() {
    return {
      activeTime: 10,
      streetShow:null,
      valueSta: null,
      plotList:[],
      effecTive: null,
      subIsShow: false,
      form: {
        streetShow:null,
        valueSta: null,
        array: null,
        IsAdver: null,
        AdverTime: null,
        plotNumber: null,//小区
        provinceCode: null, //省
        cityCode: null,     //市
        areaCode: null,     //区
        streetCode: null ,   //小区
        noticeTypeNumber: null,
        files: {
          fileName: "门口机logo",
          path: "",
          isLoading: false
        }
      },
      rules: {
        'files.path': [
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
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.$refs["form"].resetFields();
    },
    "form.streetCode": function(val, oldVal) {
      if (val) {
        this.getPlotList(); // 当选择了街道时，拉一下小区数据
      } else {
        this.plotList = [];
      }
    }
  },
  methods: {
    valueStaChang(data){
        this.form.streetShow = data 
      console.log(this.streetShow)
    },
    effecTiveChang(data){
      this.form.valueSta = data
    },
    handleClose() {
      this.$emit("handleClose");
    },
    submit(){      
      console.log(this.form)
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let {
            files,//图片
            plotNumber,//小区number
            streetShow,//是否全局
            valueSta,//是否有效
            noticeTypeNumber,//轮播时间
            areaCode,//区
            cityCode,//市
            provinceCode,//省
            streetCode//小区
          } = this.form;
          let data = {
                url: files.path ? files.path : '',//图片
                plotNumber: plotNumber? plotNumber : null,//小区number
                globleStatus: streetShow == true ? 0 : 1,//是否全局
                effective: valueSta == true ? 0 : 1,//是否有效
                time: noticeTypeNumber ? noticeTypeNumber : null,//轮播时间
                provinceCode,//省
                cityCode,//市
                areaCode,//区
                streetCode//小区
              };
          console.log(data)
          AddAdvertisementList(data)
          .then(({ errorCode })=>{
            if(errorCode === 0){
              this.$Message.success('添加成功!');
              this.$emit("handleClose", true);
              this.subIsShow = false;
            }
          }).catch(err=>{
            this.subIsShow = false;
          })
        } else {
           this.$Message.error('提交信息有误!');
        }
        
      })
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


