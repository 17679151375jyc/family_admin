<template>
  <Modal title="编辑" v-model.trim="visible" :mask-closable="false" :loading="loading">
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem prop="realName" label="真实姓名">
            <Input v-model.trim="form.realName" placeholder="请填写真实姓名" style="width: 200px;"></Input>
        </FormItem>
        <FormItem prop="identityCard" label="身份证号">
             <Input v-model.trim="form.identityCard" placeholder="请填写身份证号码" style="width: 200px;"></Input>
        </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="visible = false">取消</Button>
      <Button type="primary" @click="submit" :loading="subIsShow">确定</Button>
    </div>
  </Modal>
</template>
<script>
import { getResidentDetail, updateResident } from "@/api/communityManage";
export default {
  props: {
    domicileNumber: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      subIsShow: false,
      form: {
          realName: null,
          identityCard: null
      },
      rules: {
        realName: [
          {
            required: true,
            message: "请填写真实姓名",
            trigger: "blur"
          },
          {
              validator: (rule, value, callback) =>{
                  let err  = []
                  if (!this.$options.filters.realName(value)) {
                      err = '请输入2-4位中文的真实姓名'
                  }
                  callback(err)
              }
          }
        ],
        identityCard: [
            {
                required:true,
                message: '请填写身份证号码',
                trigger: 'blur'
            },
            {
                validator: (rule, value, callback) =>{
                    let err = []
                    if (!this.$options.filters.identityCard(value)){
                        err = '请输入正确的身份证号码'
                    }
                    callback(err)
                }
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
  methods: {
    /**
     * 获取数据详情
     */
    getDetail() {
      getResidentDetail({
        domicileNumber: this.domicileNumber
      }).then(({ data, errorCode }) => {
        if (errorCode === 0) {
          this.form = data;
          //   this.getPassDetai();
        }
      });
    },
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { realName, identityCard } = this.form;
          this.subIsShow = true;
          updateResident({
            domicileNumber: this.domicileNumber,
            name: realName, 
            identityCard
          })
            .then(({ errorCode }) => {
              if (errorCode === 0) {
                this.$Message.success("修改成功");
                this.visible = false
                this.subIsShow = false;
              }
            })
            .catch(err => {
              this.subIsShow = false;
            });
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>


