<template>
  <Modal
    title="添加"
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    :width='900'
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <!-- 右上角关闭按钮-start -->
    <Form ref="form" :model="form" :rules="rules" :label-width="100" style='position: relative;'>
      <FormItem prop="noticeTypeNumber" label="通知分类">
        <Select v-model.trim="form.noticeTypeNumber" placeholder="请选择通知分类" style="width:200px;">
          <Option
            v-for="(item, key, index) in noticeType"
            :key="index"
            :value="key"
          >{{item.typeName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="noticeTitle" label="通知标题">
        <Input
          v-model.trim="form.noticeTitle"
          placeholder="请输入通知标题"
          :maxlength="32"
          style="width:200px;"
        />
      </FormItem>

      <FormItem prop="street" label="省市区街道" v-if="isShow && !curPlotNumber" style='z-index: 1000'>
        <address-cascader
          style="width: 250px;"
          ref="addressCascader"
          :clearable="false"
          @onChange="addressOnChange"
          :showLevel="5"
        ></address-cascader>
      </FormItem>
      <FormItem prop="userNumber" label="发布物管" v-if="form.plotNumber || curPlotNumber">
        <Select v-model.trim="form.userNumber" placeholder="请选择发布的物管" style="width:200px;">
          <Option
            v-for="(item, index) in managePersonList"
            :key="index"
            :value="item.userNumber+ ',' +item.name"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="noticeContent" label="通知内容" style='z-index: 100'>        
        <!-- <div id="divExmied" class="divExmied">
          <Spin size="large" fix v-if='loadShow'></Spin>
        </div> -->
        <quillText 
          @getContert="getContert" 
          :quillValue="quillValue"></quillText>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { addNotice, getManagePersonList } from "@/api/communityManage";
import addressCascader from "@/components/addressCascader/addressCascader";
import plotCascader from "@/components/plotCascader/plotCascader";
import { mapState } from "vuex";
import quillText from '_c/quillText/quillText'

export default {
  components: {
    addressCascader,
    plotCascader,
    quillText
  },
  props: {
    noticeType: {
      type: Object,
      default: {}
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    value: { // 图片路径
      type: String,
      default: ""
    },
    pathDir: { // 文件存放的目录 
      type: String,
      default: "/web/service/"
    },
    fileNamePrefix: { // 文件名前缀
      type: String,
      default: ""
    }
  },
  data() {
    return {
      quillValue: '',
      loadShow: false,
      subIsShow: false,
      managePersonList: [], // 物管人员列表
      form: {
        noticeTitle: null, // 通知标题
        noticeContent: null, // 通知内容
        noticeTypeNumber: null, // 分类编号
        userNumber: null,
        pictureLink: null, //图片列表,
        province: null,
        city: null,
        area: null,
        street: null,
        plotNumber: null,
        plotName: null,
        realName: null,
      },
      rules: {
        noticeTypeNumber: [
          {
            required: true,
            message: "请选择通知分类",
            trigger: "change"
          }
        ],
        noticeTitle: [
          {
            required: true,
            message: "请填写通知标题",
            trigger: "blur"
          }
        ],
        street: [
          {
            required: true,
            message: "请选择对应省市区街道",
            trigger: "change"
          }
        ],
        plotNumber: [
          {
            required: true,
            message: "请选择要发布的小区",
            trigger: "change"
          }
        ],
        userNumber: [
          {
            required: true,
            message: "请选择发布物管",
            trigger: "change"
          }
        ],
        noticeContent: [
          {
            validator:(rule, value, callback, source, options) =>{
              let err = [];
              if (this.quillValue == '') {
                err = "请填写通知内容";
              }
              callback(err);
            }
          }
        ]
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
        this.$refs["form"].resetFields();
        this.quillValue = ''
    },
    "form.plotNumber": function(val, oldVal) {
      this.managePersonList = [];
      if (val) {
        this.getManagePersonList(val);
      }
    },
    curPlotNumber: {
      handler: function(val, oldVal) {
        this.managePersonList = [];
        if (val) {
          this.getManagePersonList(val);
        }
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
    getContert(val){
      this.quillValue = val
    },
    handleClose() {
      this.$emit("handleClose");
    },
    /**
     * 获取物管人员列表
     */
    getManagePersonList(plotNumber) {
      getManagePersonList({
        plotNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.managePersonList = data;
        }
      });
    },
    submit() {
      console.log(this.quillValue)
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.form.noticeContent = this.quillValue;
          this.form.pictureLink = null;
          let {
            noticeTitle,
            noticeContent,
            noticeTypeNumber,
            userNumber,
            realName,
            plotNumber,
            pictureLink,
            plotName,
          } = this.form;
          console.log(this.form)
          this.subIsShow = true;
          console.log("准备发送请求");
          addNotice({
            noticeTitle,
            noticeContent,
            noticeTypeNumber,
            userNumber: userNumber.split(',')[0],
            plotNumber,
            realName: userNumber.split(',')[1],
            pictureLink:null,
            plotName:null,
          })
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
    addressOnChange(value) {
      console.log(value)
      this.$set(this.form, "province", value[0]);
      this.$set(this.form, "city", value[1]);
      this.$set(this.form, "area", value[2]);
      this.$set(this.form, "street", value[3]);
      this.$set(this.form, "plotNumber", value[4]);
    },
    /**
     * 当小区下拉选中时
     */
    plotOnChange(value) {
      console.log(value);
      this.form.plotNumber = value[0];
    },
  },
  mounted(){    
    // let that = this
  }
};
</script>
<style lang="stylus" scoped>
>>>.ivu-cascader .ivu-select-dropdown{
  z-index: 9999999!important;
}
>>>.ivu-select-dropdown{
  z-index: 9999999!important;
}
</style>