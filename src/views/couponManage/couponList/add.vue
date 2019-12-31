<template>
  <Modal title="添加" v-model.trim="visible" :mask-closable="false" width="800">
    <Form ref="form" :model="form" :rules="rules" :label-width="110">
      <FormItem prop="type" label="类型">
        <Select v-model="form.type" placeholder="请选择优惠券类型" style="width: 200px;">
          <Option v-for="item in CouponType" :key="item.code" :value="item.code">{{item.name}}</Option>
        </Select>
      </FormItem>
      <!-- <FormItem prop="couponName" label="优惠券名称">
        <Input
          v-model.trim="form.couponName"
          :maxlength="14"
          placeholder="不超过14个字符"
          style="width:200px;"
        />
      </FormItem>-->
      <FormItem prop="businessId" label="对应商家">
        <Select v-model="form.businessId" style="width:200px;" filterable>
          <Option v-for="item in businessList" :key="item.id" :value="item.id">{{item.businessName}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="originPrice" label="本金(元)">
        <i-switch
          true-color="#13ce66"
          false-color="#ff4949"
          size="large"
          v-model="form.originPriceBoolean"
        >
          <span slot="open">收益</span>
          <span slot="close">亏损</span>
        </i-switch>
        <InputNumber
          :max="9999.00"
          :min="0.00"
          v-model="form.originPrice"
          style="width:135px;margin-left: 10px;"
          @on-blur="form.originPrice = parseFloat(form.originPrice.toFixed(2))"
        ></InputNumber>
        <br />
        <Tag color="gold" style="display: inline-block;">本金为本公司收益时，选收益项；为亏损时，选亏损项</Tag>
      </FormItem>
      <!-- <FormItem prop="originPrice" label="本金(元)">
        
      </FormItem>-->

      <FormItem prop="businessValue" label="优惠券价值">
        <InputNumber
          :max="9999.00"
          :min="0.00"
          v-model="form.businessValue"
          style="width:166px;"
          @on-blur="form.businessValue = parseFloat(form.businessValue.toFixed(2))"
        ></InputNumber>
        <Tag
          color="success"
          style="height:30px;line-height:30px;margin-left:5px;"
          v-if="form.type===0"
        >折</Tag>
        <Tag
          color="primary"
          style="height:30px;line-height:30px;margin-left:5px;"
          v-if="form.type===1"
        >元</Tag>
      </FormItem>
      <FormItem prop="enoughPrice" label="满多少元可用">
        <InputNumber
          :max="9999.00"
          :min="0.00"
          v-model="form.enoughPrice"
          style="width:200px;"
          @on-blur="form.enoughPrice = parseFloat(form.enoughPrice.toFixed(2))"
        ></InputNumber>
      </FormItem>
      <!-- <FormItem prop="isEffective" label="是否有效">
        <i-switch size="large" v-model.trim="form.isEffective" :true-value="1" :false-value="0">
          <span slot="open">有效</span>
          <span slot="close">无效</span>
        </i-switch>
      </FormItem>-->
      <FormItem prop="effectiveTime" label="有效时间">
        <DatePicker
          v-model.trim="form.effectiveTime"
          :options="effectiveTimeOptions"
          type="date"
          placeholder="选择服务结束时间"
          style="width: 200px"
        ></DatePicker>
      </FormItem>
      <FormItem prop="stock" label="库存">
        <InputNumber :max="9999" v-model="form.stock" style="width:200px;"></InputNumber>
      </FormItem>
      <FormItem prop="restrictionNumber" label="每个账号最多可用此券多少张">
        <InputNumber :max="9999" v-model="form.restrictionNumber" style="width:200px;"></InputNumber>
      </FormItem>

      <FormItem prop="description" label="介绍描述">
        <Input
          maxlength="128"
          show-word-limit
          type="textarea"
          :rows="4"
          v-model.trim="form.description"
          placeholder="请填写商家介绍描述"
          style="width:250px; "
        />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="visible=false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsLoading">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getBusinessList } from "@/api/dataManage";
import { addCoupon } from "@/api/couponManage";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      subIsLoading: false,
      businessList: [], // 商家列表
      CouponType: this.$options.filters.statusList("CouponType"),
      effectiveTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      form: {
        type: null, // 优惠券类型
        // couponName: null, //  优惠券名称
        businessId: null, // 对应的商家
        originPrice: 0.0, // 对应本金
        originPriceBoolean: false,
        businessValue: 0.0, // 商家价值
        enoughPrice: 0.0, // 满多少元可用
        isEffective: 1, // 是否有效
        effectiveTime: null, // 有效时间
        description: null, // 描述
        stock: 1, // 库存,
        restrictionNumber: 1 //限购数据
      },

      rules: {
        type: [
          {
            type: "number",
            required: true,
            message: "请选择优惠券分类",
            trigger: "blur"
          }
        ],
        // couponName: [
        //   {
        //     required: true,
        //     message: "请填写优惠券名称",
        //     trigger: "blur"
        //   }
        // ],
        businessId: [
          {
            required: true,
            message: "请选择对应商家",
            trigger: "blur"
          }
        ],
        originPrice: [
          {
            type: "number",
            required: true,
            message: "请填写本金",
            trigger: "blur"
          }
        ],
        businessValue: [
          {
            type: "number",
            required: true,
            message: "请填写优惠券价值",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (this.form.type === 0 && (value > 10 || value < 1)) {
                // 如果是折扣券
                err = "折扣券请填写1至10折";
              }
              callback(err);
            }
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              console.log("判不能小于本金");
              console.log(this.form.type, !this.form.originPriceBoolean)
              if (
                this.form.type === 1 &&
                !this.form.originPriceBoolean &&
                value < this.form.originPrice - 0
              ) {
                console.log("进入if");
                // 代金券
                err = "本金亏损时，优惠券价值不能小于本金";
              }
              callback(err);
            }
          }
        ],
        enoughPrice: [
          {
            type: "number",
            required: true,
            message: "请填写满多少元可用",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value < 0) {
                err = "不能设置为负数";
              }
              callback(err);
            }
          }
        ],
        isEffective: [
          {
            type: "number",
            required: true,
            message: "请选择是否有效",
            trigger: "blur"
          }
        ],
        effectiveTime: [
          {
            type: "date",
            required: true,
            message: "请选择有效时间",
            trigger: "blur"
          }
        ],
        stock: [
          {
            type: "number",
            required: true,
            message: "请填写库存",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value < 1) {
                err = "库存不能少于1";
              }
              callback(err);
            }
          }
        ],
        restrictionNumber: [
          {
            type: "number",
            required: true,
            message: "每个账号最多可用此券多少张",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              let err = [];
              if (value > this.form.stock) {
                err = "可用优惠券数量不能大于库存";
              }
              if (value < 1) {
                err = "可用优惠券数量不能少于1";
              }
              callback(err);
            }
          }
        ]
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (!val) {
        this.$refs["form"].resetFields();
      } else {
        this.getBusinessList();
      }
    },
    visible(val) {
      this.$emit("input", val);
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
    }
  },
  methods: {
    /**
     * 拉取商家列表
     */
    getBusinessList() {
      getBusinessList({
        input: {
          isEffective: 1
        },
        pageSize: 999,
        page: 1
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.businessList = data.list;
        }
      });
    },
    /**
     * 提交数据
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.subIsLoading = true;
          let {
            effectiveTime,
            businessValue,
            type,
            originPrice,
            originPriceBoolean
          } = this.form;
          let data = Object.assign({}, this.form, {
            isDelete: false,
            originPrice: originPriceBoolean ? originPrice : -originPrice,
            couponName: this.couponName,
            effectiveTime: new Date(effectiveTime).getTime() / 1000 + 86399,
            businessValue: type === 0 ? businessValue / 10 : businessValue // 如果是折扣券，把折数除以10
          });
          addCoupon(data)
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("添加成功");
                this.visible = false;
                this.subIsLoading = false;
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


