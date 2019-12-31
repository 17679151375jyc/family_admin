<template>
  <Modal title="发放优惠券" v-model.trim="visible" :mask-closable="false" width="600">
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem prop="isImport" label="发送方式">
        <i-switch size="large" v-model="form.isImport" true-color="#13ce66" false-color="#3388FF">
          <span slot="open">导入</span>
          <span slot="close">录入</span>
        </i-switch>
        <Button
          type="success"
          icon="md-download"
          size="small"
          :loading="exportLoading"
          v-if="form.isImport"
          @click="exportExcel"
          style="margin-left:20px;"
        >导出批量发券Excel模板</Button>
      </FormItem>
      <FormItem prop="phone" label="导入Excel" v-if="form.isImport">
        <Upload :before-upload="handleBeforeUpload" :accept="'.xls, .xlsx'" action>
          <Button type="success" size="small" @click="initUpload">点击导入</Button>
        </Upload>
      </FormItem>
      <FormItem label="导入的数据" v-if="form.isImport && form.phone">
        <Input :value="form.phone" disabled type="textarea" :rows="6" style="width: 400px" />
        <Tag color="success">共{{form.phone.split(',').length }}条数据</Tag>
      </FormItem>
      <FormItem prop="phone" label="用户手机账号" v-if="!form.isImport">
        <Input v-model="form.phone" placeholder="请填写收券用户的手机账号" style="width:200px" />
      </FormItem>
      <FormItem label="优惠券库存" v-show="checkInfoIsShow">{{checkInfo.stock}}张</FormItem>
      <FormItem label="已拥有此券" v-show="checkInfoIsShow">{{checkInfo.haveCount}}张</FormItem>
      <FormItem label="还可发此券" v-show="checkInfoIsShow">{{checkInfo.residueCount}}张</FormItem>
      <FormItem prop="number" label="发券数量">
        <InputNumber v-model="form.number" placeholder="请填写数量" style="width:200px;"></InputNumber>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { checkCoupon, issueCoupon } from "@/api/couponManage";
import excel from "@/libs/excel";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      subIsLoading: false,
      exportLoading: false,
      excelTable: {
        isShow: false,
        tabCol: [],
        tabData: [],
        buildingNumber: ""
      },
      checkInfo: {
        haveCount: 0, // 已经拥有此优惠券多少张
        residueCount: 0, //可发送优惠券数
        stock: 0 // 优惠券剩余库存
      },
      form: {
        id: null, // 优惠券id
        phone: null, // 发放到的手机
        number: 1, //发送数量
        isImport: false //是否导入
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (!val) {
        this.$refs["form"] && this.$refs["form"].resetFields();
      } else {
        this.form.id = this.id;
      }
    },
    visible(val) {
      this.$emit("input", val);
    },
    "form.isImport"() {
      this.form.phone = null;
    },
    "form.phone"(val) {
      if (this.$options.filters.phone(val)) {
        this.checkInfo.residueCount = 0;
        this.checkInfo.haveCount = 0;
        this.checkInfo.stock = 0;
        if (!this.form.isImport) {
          this.checkCoupon();
        }
      }
    }
  },
  computed: {
    couponName() {
      let name = "";
      let { type, enoughPrice, businessValue } = this.form;
      if (type === 0) {
        // 折扣券
        if (enoughPrice === 0) {
          name = `${businessValue}折`;
        } else {
          name = `满${enoughPrice}元打${businessValue}折`;
        }
      } else if (type === 1) {
        // 代金券
        if (enoughPrice === 0) {
          name = `${businessValue}元`;
        } else {
          name = `满${enoughPrice}元减${businessValue}元`;
        }
      }
      return name;
    },
    rules() {
      let phone = [];
      if (this.form.isImport) {
        // 如果是导入
        phone = [
          {
            required: true,
            message: "请导入数据",
            trigger: "blur"
          }
        ];
      } else {
        phone = [
          {
            required: true,
            message: "请填写用户手机账号",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (!this.$options.filters.phone(value)) {
                err = "请填写正确的手机账号";
              }
              callback(err);
            }
          }
        ];
      }

      return {
        phone: phone,
        number: [
          {
            type: "number",
            required: true,
            message: "请填写发放数量",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value <= 0) {
                err = "发券数量最少为1";
              }
              callback(err);
            }
          }
        ]
      };
    },
    checkInfoIsShow() {
      let { phone, isImport } = this.form;
      if (phone && phone.length === 11 && !isImport) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    /**
     * 拉取商家列表
     */
    // getBusinessList() {
    //   getBusinessList({
    //     input: {
    //       isEffective: 1
    //     },
    //     pageSize: 999,
    //     page: 1
    //   }).then(({ data, errorCode }) => {
    //     if (errorCode === 0) {
    //       this.businessList = data.list;
    //     }
    //   });
    // },
    /**
     * 提交数据
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          let { id, phone, number, isImport } = this.form;

          issueCoupon({
            id,
            number,
            phone
          })
            .then(({ data, errorCode }) => {
              if (errorCode === 0) {
                this.visible = false;
                this.subIsLoading = false;
                if (data.length && data.length > 0) {
                  
                  this.$Modal.error({
                    title: `以下${data.length}个手机号发券失败`,
                    // content: data.join(","),
                    render: h => {
                      let html = [];
                      for (let i = 0; i < data.length; i++) {
                        html.push(
                          h(
                            "div",
                            {
                              style: {
                                flex: "0 0 100px",
                                "text-align": "center"
                              }
                            },
                            data[i]
                          )
                        );
                      }
                      return h(
                        "div",
                        {
                          style: {
                            display: "flex",
                            "flex-flow": "wrap"
                          }
                        },
                        html
                      );
                    }
                  });
                } else {
                  this.$Message.success("发放成功");
                }
              }
            })
            .catch(err => {
              this.subIsLoading = false;
            });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 省市区地址数据变化
     */
    addressOnChange(value, obj) {
      this.form.provinceCode = obj[0] && obj[0].value;
      this.form.provinceName = obj[0] && obj[0].label;
      this.form.cityCode = obj[1] && obj[1].value;
      this.form.cityName = obj[1] && obj[1].label;
      this.form.areaCode = obj[2] && obj[2].value;
      this.form.areaName = obj[2] && obj[2].label;
      this.form.streetCode = obj[3] && obj[3].value;
      this.form.streetName = obj[3] && obj[3].label;
    },
    /**
     * 当选择经纬度的值改变时
     */
    changeLngLat(val) {
      this.form.longitude = val && val[0];
      this.form.latitude = val && val[1];
    },
    /**
     * 导入操作
     */
    handleBeforeUpload(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file);
        this.file = file;
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc:
            "文件：" +
            file.name +
            "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。"
        });
      }
      return false;
    },
    initUpload() {
      this.file = null;
      this.showProgress = false;
      this.loadingProgress = 0;
      this.tableData = [];
      this.tableTitle = [];
    },
    handleUploadFile() {
      this.initUpload();
    },
    /**
     * 读取文件
     */
    readFile(file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadstart = e => {
        this.uploadLoading = true;
        this.tableLoading = true;
        this.showProgress = true;
      };
      reader.onprogress = e => {
        this.progressPercent = Math.round((e.loaded / e.total) * 100);
      };
      reader.onerror = e => {
        this.$Message.error("文件读取出错");
      };
      reader.onload = e => {
        this.$Message.info("文件读取成功");
        this.excelTable.isShow = true;
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        const tableTitle = header.map(item => {
          return { title: item, key: item };
        });

        console.log("文档结果", results);
        this.excelTable.tabData = results;
        let phones = [];
        for (let i = 0; i < results.length; i++) {
          let keys = Object.keys(results[i]);
          for (let j = 0; j < keys.length; j++) {
            phones.push(results[i][keys[j]]);
          }
        }
        this.form.phone = phones.join(",");
        console.log(phones);

        this.excelTable.tabCol = tableTitle;

        this.uploadLoading = false;
        this.tableLoading = false;
        this.showRemoveFile = true;
      };
    },
    /**
     * 导出门号模板
     */
    exportExcel() {
      //   this.exportLoading = true;
      const params = {
        title: [
          //   "楼座",
          "电话号码"
        ],
        key: [
          //   "building",
          "电话号码"
        ],
        data: [
          {
            // building: "1",
            电话号码: "15917889383"
          }
        ],
        autoWidth: true,
        filename: "批量发券"
      };
      excel.export_array_to_excel(params);
      //   this.exportLoading = false;
    },
    /**
     * 检测优惠券使用情况
     */
    checkCoupon() {
      checkCoupon({
        phone: this.form.phone,
        couponId: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          console.log(data);
          let { residueCount, haveCount, stock } = data;
          this.checkInfo.residueCount = residueCount;
          this.checkInfo.haveCount = haveCount;
          this.checkInfo.stock = stock;
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


