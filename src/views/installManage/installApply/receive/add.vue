<template>
  <Modal
    v-model.trim="isShow"
    :mask-closable="false"
    :loading="loading"
    :closable="false"
    width="850"
  >
    <!-- 右上角关闭按钮-start -->
    <a class="ivu-modal-close no-print" @click="handleClose">
      <i class="ivu-icon ivu-icon-ios-close"></i>
    </a>
    <div ref="myrefPrint">
      <div class="print_class" ref="printWidth">
        <div class="header_title">广东穿云箭科技有限公司</div>
        <h1 class="title_text">领料单</h1>
        <table class="table_css">
          <tr>
            <td style="width:100px">
              <!-- <i class="iconfont iconyonghu"></i> -->
              <span>领料人:</span>
            </td>
            <td style="width:260px"></td>
            <td style="width:100px">
              <!-- <i class="iconfont iconshouji"></i> -->
              <span>领料人电话:</span>
            </td>
            <td style="width:260px"></td>
          </tr>
          <tr>
            <td>
              <!-- <i class="iconfont iconyonghu"></i> -->
              <span>客户姓名:</span>
            </td>
            <td>{{ info.name }}</td>
            <td>
              <!-- <i class="iconfont iconshouji"></i> -->
              <span>客户电话:</span>
            </td>
            <td>{{ info.contactPhone }}</td>
          </tr>
          <tr>
            <td>
              <!-- <i class="iconfont iconId"></i> -->
              <span>客户身份证:</span>
            </td>
            <td>{{ info.credentialNo }}</td>
            <td>
              <!-- <i class="iconfont iconshijian"></i> -->
              <span>创建时间:</span>
            </td>
            <td>{{ info.createTime | formatTime }}</td>
          </tr>
          <tr>
            <td>
              <!-- <i class="iconfont iconchengshifuwu"></i> -->
              <span>省市区街道:</span>
            </td>
            <td>
              {{ info.province?info.province:'' }}
              {{ info.city?info.city:'' }}
              {{ info.area?info.area:'' }}
              {{ info.street?info.street:'' }}
            </td>
            <td>
              <!-- <i class="iconfont iconliwu--"></i> -->
              <span>套餐名:</span>
            </td>
            <td>{{ info.applyPackage?info.applyPackage.name:'' }}</td>
          </tr>
          <tr>
            <td>
              <!-- <i class="iconfont iconjianzhuwu"></i> -->
              <span>详细安装地址:</span>
            </td>
            <td colspan="3" style="text-align:right;">{{ info.detailedAddress }}</td>
          </tr>
          <tr>
            <td>
              <!-- <i class="iconfont iconmiaoshu"></i> -->
              <span>备注:</span>
            </td>
            <td style="border-left:0;border-right:0;"></td>
            <td style="border-left:0;border-right:0;"></td>
            <td style="border-left:0"></td>
          </tr>
        </table>
        <!-- <Table
        border
        stripe
        highlight-row
        :columns="tabCol"
        :data="tabData"
        style="margin: 10px 0;"
        ></Table>-->
        <table class="tab_form" v-if='info.applyPackage&&info.applyPackage.applyDevices'>
          <caption>
            <h3>套餐设备表</h3>
          </caption>
          <!---表头--->
          <tr>
            <th style="width:10%">序号</th>
            <th style="width:50%">需领设备</th>
            <th style="width:10%">数量</th>
            <th style="width:10%">总价(元)</th>
            <th style="width:20%">备注</th>
          </tr>
          <tr v-for="(item,index) in info.applyPackage.applyDevices" :key="index">
            <td>{{ index+1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.num }}</td>
            <td>{{ item.price | formatDates }}</td>
            <td></td>
          </tr>
        </table>
        <table class="tab_form" v-if="info.applyDevices&&info.applyDevices.length>0">
          <caption>
            <h3>新增设备表</h3>
          </caption>
          <tr>
            <th style="width:10%">序号</th>
            <th style="width:50%">需领设备</th>
            <th style="width:10%">数量</th>
            <th style="width:10%">总价(元)</th>
            <th style="width:20%">备注</th>
          </tr>
          <tr v-for="(item, index) in info.applyDevices" :key="index">
            <td>{{ index+1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.num }}</td>
            <td>{{ item.price | formatDates }}</td>
            <td></td>
          </tr>
        </table>
        <table class="tab_form" v-if='info.otherApplyDevices&&info.otherApplyDevices[0]&&info.otherApplyDevices[0].list&&info.otherApplyDevices[0].list.length>0'>
          <caption>
            <h3>补充设备表</h3>
          </caption>
          <tr>
            <th style="width:10%">序号</th>
            <th style="width:50%">需领设备</th>
            <th style="width:10%">数量</th>
            <th style="width:10%">总价(元)</th>
            <th style="width:20%">备注</th>
          </tr>
          <tbody v-for="(items, key) in info.otherApplyDevices?info.otherApplyDevices:[]" :key="key">
            <tr v-for="(item, index) in items?items.list:[]" :key="index">
              <td>{{ tabIndex()}}</td>
              <td>{{ items?item.name:'' }}</td>
              <td>{{ items?item.num :''}}</td>
              <td>{{ items?item.price:'' | formatDates }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="handle-container" ref="button" style="margin:80px 5% 0 0;">
          <div style="margin-left: 40px;">
            领料人签名：
            <input type="text" class="input_div" />
          </div>
          <div>
            领料日期：
            <input type="text" class="input_div" />
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="no-print">
      <Button type="text" @click="handleClose">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">打印</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState } from "vuex";
import { getApplyDetail } from "@/api/installManage";
import excel from "@/libs/excel";
var number = 0;
export default {
  props: {
    id: {
      type: String,
      default: null
    },
    isShow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    },
    userNumber: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      anchorTable: [],
      divEnter: false,
      subIsShow: false,
      info: {
        applyDevices: null, //设备列表
        otherApplyDevices: [{
            installId: null,
            list: null
          }], //补充设备
        applyPackage: {
          applyDevices: null
        }, //套餐设备
        fsUserName: null, //领料人
        fsUserPhone: null, //领料人电话
        name: null, // 用户名
        contactPhone: null, // 用户电话
        province: null,
        city: null,
        area: null,
        street: null, //省市区街道
        detailedAddress: null, //详细地址
        updateTime: null, //更新时间
        createTime: null //创建时间
      }
    };
  },
  watch: {
    isShow: function(val, oldVal) {
      this.getDetail();
    }
  },
  computed: {
    tabCol: function() {
      return [
        {
          type: "index",
          title: "序号",
          width: 100,
          align: "center"
        },
        {
          title: "需领设备",
          key: "name",
          width: 150
        },
        {
          title: "数量",
          key: "num",
          width: 100
        },
        {
          title: "总价",
          key: "price",
          minWidth: 100
        }
      ];
    },
    tabData: function() {{
      let data = [];
      if(this.info.applyDevices)
        for (let i = 0; i < this.info.applyDevices.length; i++) {
          data.push(this.info.applyDevices[i]);
      }
       return data;

      }
    }
  },
  filters: {
    // 过滤价格保留两位小数
    formatDates: value => {
      return (value * 1).toFixed(2);
    }
  },
  mounted() {},
  methods: {
    tabIndex() {
      number++;
      return number;
    },
    exportExcle(){
        import('@/libs/export2Excel.js').then(excel => {
          const title = ['广东穿云箭科技有限公司', '', '', '', '']  //标题
          const tHeader = ['领料单',"","","",""] //表头
        //表头对应字段
          const filterVal = ['NUMBER', 'EQUIPMENT_NAMW', 'NUM', 'PRICE_NUM', 'OTHER']
            const list = [
              {
                NUMBER: "领料人:",
                EQUIPMENT_NAMW: "",
                NUM: "领料人电话:",
                PRICE_NUM: "",
                OTHER: ""
              },{
                NUMBER: "客户姓名:",
                EQUIPMENT_NAMW: `${this.info.name}`,
                NUM: "客户电话:",
                PRICE_NUM: `${this.info.contactPhone}`,
                OTHER: ""
              },
              {
                NUMBER: "客户身份证号:",
                EQUIPMENT_NAMW: `${this.info.credentialNo}`,
                NUM: "创建时间:",
                PRICE_NUM: `${this.$options.filters.formatTime(this.info.createTime)}`,
                OTHER: ""
              },
              {
                NUMBER: "省市区街道:",
                EQUIPMENT_NAMW: `${(this.info.province ? this.info.province : "") +
                  (this.info.city ? this.info.city : "") +
                  (this.info.area ? this.info.area : "") +
                  (this.info.street ? this.info.street : "")}`,
                NUM: "套餐名:",
                PRICE_NUM: `${
                  this.info.applyPackage ? this.info.applyPackage.name : ""
                }`,
                OTHER: ""
              },
              {
                NUMBER: "详细安装地址:",
                EQUIPMENT_NAMW: `${
                  this.info.detailedAddress ? this.info.detailedAddress : ""
                }`,
                NUM: "",
                PRICE_NUM: "",
                OTHER: ""
              },
              {
                NUMBER: "备注:",
                EQUIPMENT_NAMW: "",
                NUM: "",
                PRICE_NUM: "",
                OTHER: ""
              }
            ]
            let objList = {
              NUMBER: "序号",
              EQUIPMENT_NAMW: "需领设备",
              NUM: "数量",
              PRICE_NUM: "总价(元)",
              OTHER: "备注"
            };
            let nullList = {
              NUMBER: "",
              EQUIPMENT_NAMW: "",
              NUM: "",
              PRICE_NUM: "",
              OTHER: ""
            };
            if (this.info.applyPackage && 
                this.info.applyPackage.applyDevices
                ) {
              list.push(nullList);
              list.push({
                NUMBER: "套餐设备表",
                EQUIPMENT_NAMW: "",
                NUM: "",
                PRICE_NUM: "",
                OTHER: ""
              });
              list.push(objList);
              for (let i = 0; i < this.info.applyPackage.applyDevices.length; i++) {
                let { name, num, price } = this.info.applyPackage.applyDevices[i];
                list.push({
                  NUMBER: i + 1,
                  EQUIPMENT_NAMW: name,
                  NUM: num,
                  PRICE_NUM: (price * 1).toFixed(2),
                  OTHER: ""
                });
              }
            }

            if (this.info.applyDevices && this.info.applyDevices.length>0) {
              list.push(nullList);
              list.push({
                NUMBER: "新增设备表",
                EQUIPMENT_NAMW: "",
                NUM: "",
                PRICE_NUM: "",
                OTHER: ""
              });
              list.push(objList);
              for (let i = 0; i < this.info.applyDevices.length; i++) {
                let { name, num, price } = this.info.applyDevices[i];
                list.push({
                  NUMBER: i + 1,
                  EQUIPMENT_NAMW: name,
                  NUM: num,
                  PRICE_NUM: (price * 1).toFixed(2),
                  OTHER: ""
                });
              }
            }
            number = 0;
            if (this.info.otherApplyDevices &&
              this.info.otherApplyDevices[0] && this.info.otherApplyDevices[0].list&&
              this.info.otherApplyDevices[0].list.length>0) {
              list.push(nullList);
              list.push({
                NUMBER: "补充设备表",
                EQUIPMENT_NAMW: "",
                NUM: "",
                PRICE_NUM: "",
                OTHER: ""
              });
              list.push(objList);

              for (let i = 0; i < this.info.otherApplyDevices.length; i++) {
                for(let j = 0; j < this.info.otherApplyDevices[i].list.length; j++){
                  let { name, num, price } = this.info.otherApplyDevices[i].list[j];
                    list.push({
                      NUMBER: this.tabIndex(),
                      EQUIPMENT_NAMW: name,
                      NUM: num,
                      PRICE_NUM: (price * 1).toFixed(2),
                      OTHER: ""
                    });
                }
                
              }
            }
          const data = this.formatJson(filterVal, list)
          data.map(item => {
            // console.log(item)
            item.map((i, index) => {
              if (!i) {
                item[index] = ''
              }
            })
          })
          let setMealIndex = this.info.applyPackage.applyDevices.length>0?this.info.applyPackage.applyDevices.length+3:0;
          let addMealIndex = this.info.applyDevices.length?this.info.applyDevices.length+1:0;
          let supplementIndex = this.tabIndex();
          const merges = [
            "A1:E1", "A2:E2", "D3:E3", "D4:E4", "D5:E5", "D6:E6", 'B7:E7', 'B8:E8', 'A9:E9', "A10:E10",

             `A${9 + setMealIndex}:E${9 + setMealIndex}`,
             `A${9 + setMealIndex+1}:E${9 + setMealIndex+1}`,

            `A${9 + setMealIndex+addMealIndex}:E${9 + setMealIndex+addMealIndex}`,
            `A${9 + setMealIndex+addMealIndex+1}:E${9 + setMealIndex+addMealIndex+1}`
            ] //合并单元格
          excel.export_json_to_excel_receive({
            setMealIndex,
            addMealIndex,
            supplementIndex,
            title: title,
            header: tHeader,
            data ,
            merges,
            filename: '领料单',
            autoWidth: true,
            bookType: 'xlsx'
          })
          number = 0;
          this.handleClose();
        })
      },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    submit() {
      console.log(this.$refs.printWidth.clientHeight);
      if (this.$refs.printWidth.clientHeight < 1950) {
        this.$print(this.$refs.myrefPrint);
      } else {
        this.exportExcle();
      }
    },
    getDetail() {
      console.log(this.id);
      getApplyDetail({
        id: this.id
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.info = data;
          console.log(data);
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="stylus" scoped>
@page {
  margin: 8.5mm 0 12.4mm 0mm;
}

.header_title {
  text-align: center;
  letter-spacing: 5px;
  color: #000;
  height: 36px;
  display: block;
}

.title_text {
  display: block;
  height: 71px;
  text-align: center;
  letter-spacing: 7px;
  color: #000;
}

.tab_form {
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  border-collapse: collapse;
  width: 90%;
  margin: 0 auto;
  font-size: 12px;
  color: #000;
}

.tab_form caption {
  height: 71px;
  line-height: 90px;
}

.tab_form th {
  border-left: 1px solid #000;
  border-top: 1px solid #000;
  height: 36px;
  font-weight: bold;
  color: #000;
}

.tab_form td {
  border-left: 1px solid #000;
  border-top: 1px solid #000;
  text-align: center;
  height: 36px;
  color: #000;
  font-size: 12px;
}

.table_css {
  width: 90%;
  font-size: 12px;
  margin: 0 auto;
  border-collapse: collapse;
}

.table_css td {
  border: 1px solid #000;
  height: 36px;
  text-align: right;
  padding: 5px;
  color: #000;
}

.table_css tr span {
  margin-left: 5px;
}

.input_div {
  border: 0;
  border-bottom: 1px solid #000;
  outline: none;
}

.print_class {
}
</style>


