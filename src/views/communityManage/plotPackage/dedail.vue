<template>
  <Modal title="添加" v-model.trim="isShow" :mask-closable="false" :loading="loading" :closable="false">
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->

    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <!-- <FormItem prop="files.path" label="广告图片">
        <div class="logo-wrapper">
          <div class="logo">
            <Icon type="md-add" size="50" v-if="!form.files.path" />
            <img :src="form.files.path" v-if="form.files.path" />
          </div>
          <Button type="info" icon="md-cloud-upload">上传图片</Button>
          <input
            type="file"
            @change="fileChange($event)"
            accept="image/png, image/jpeg, image/gif, image/jpg"
          />
        </div>
      </FormItem> -->
      <!-- <FormItem label="是否全局" >
        <i-switch @on-change='valueStaChang'>
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem> -->

        <FormItem prop="plotNumber" label="小区">
          <div style="display: flex;">
            <address-cascader
              ref="addressCascader"
              @onChange="addressCascaderChange"
               style="width: 150px"
            ></address-cascader>
            <Select
              v-model.trim="form.plotNumber"
              placeholder="请选择小区数据"
              style="margin-left: 5px;width: 150px"
            >
              <Option
                :value="item.plotNumber"
                v-for="(item, index) in plotList"
                :key="index"
              >{{item.plotName}}</Option>
            </Select>
          </div>
        </FormItem>

      <!-- <FormItem label="是否有效">
        <i-switch size="large" @on-change='effecTiveChang'>
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
      </FormItem> -->
      <!-- <FormItem prop="noticeTypeNumber" label="轮播时间(秒)" >
        <Select v-model.trim='form.noticeTypeNumber' placeholder="输入轮播时间" style="width: 140px;">
          <Option v-for="(item,index) in activeTime" :value="item*activeTime" :key="index">{{ item*activeTime }}s</Option>
        </Select>
      </FormItem> -->
    </Form>
    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { AddAdvertisementList } from "@/api/communityManage";
import { getAuthorization, getPlotList } from "@/api/common";
import addressCascader from "@/components/addressCascader/addressCascader";
export default {
  components: { 
    addressCascader
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
      let {        
        plotNumber,//小区number
        provinceCode, //省
        cityCode,     //市
        areaCode,     //区
        streetCode   //小区
      } = this.form
      this.$emit('plotNumberFunc',null)
    },
    // fileChange(e) {
    //   let file = e.target.files[0];
    //   if (file.type.split("/")[0] !== "image") {
    //     this.$Message.error("请选择正确的图片类型上传");
    //     return;
    //   }
    //   this.form.files.isLoading = true;
    //   console.log("开始上传");
    //   cos.sliceUploadFile(
    //     {
    //       Bucket: this.$config.cos.bucket,
    //       Region: this.$config.cos.region,
    //       Key:
    //         "/web/service/" +
    //         "entranceDevice" +
    //         "-" +
    //         new Date().getTime() +
    //         "-" +
    //         Math.ceil(Math.random() * 100) +
    //         "." +
    //         file.type.split("/")[1],
    //       Body: file
    //     },
    //     (err, data) => {
    //       console.log("上传完成", err, data);
    //       this.form.files.isLoading = false;
    //       if (err) {
    //         this.$Message.error("上传出现错误！");
    //       }
    //       this.form.files.path = "https://" + data.Location;
    //     }
    //   );
    // },
    submit(){            
      this.$refs["form"].validate(async valid => {
        let {        
          plotNumber,//小区number
          provinceCode, //省
          cityCode,     //市
          areaCode,     //区
          streetCode   //小区
        } = this.form
        console.log(this.form)
        if(plotNumber){
          this.$emit('plotNumberFunc',this.form)
          this.$emit("handleClose");
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


