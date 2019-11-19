<template>
  <div>
    <!-- 添加班次弹窗-start -->
    <Modal title="添加班次" v-model="modalIsVisible" :mask-closable="false" :closable="false">
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem prop="name" label="班次名称">
          <Input v-model.trim="form.name" placeholder="请输入班次名称" style="width: 200px;" />
        </FormItem>
        <FormItem prop="startTime" label="开始时间">
          <TimePicker
            format="HH:mm"
            placement="bottom-end"
            placeholder="选择时间段"
            v-model="form.startTime"
            style="width: 200px"
          ></TimePicker>
        </FormItem>
        <FormItem prop="endTime" label="结束时间">
          <TimePicker
            format="HH:mm"
            placement="bottom-end"
            placeholder="选择时间段"
            v-model="form.endTime"
            style="width: 200px"
          ></TimePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalIsVisible = false">取消</Button>
        <Button type="primary" @click="submit">确定</Button>
      </div>
    </Modal>
    <!-- 添加班次弹窗-end -->

    <div style="text-align:right;">
      <Button type="primary" size="small" @click="modalIsVisible = true">添加班次</Button>
    </div>
    <!-- 表单-start -->
    <Table border stripe highlight-row :columns="tabCol" :data="shiftList"></Table>
    <!-- 表单-end -->
  </div>
</template>

<script>
export default {
  props: {
    shiftList: {
      type: Array,
      default: function() {
        return [
        //   {
        //     name: "早班",
        //     timeRange: "8:00 - 16:00"
        //   }
        ];
      }
    }
  },
  watch: {
    modalIsVisible() {
      this.$refs["form"].resetFields();
    }
  },
  data() {
    return {
      modalIsVisible: false,
      form: {
        name: "",
        startTime: "",
        endTime: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写名称",
            trigger: "blur"
          }
        ],
        startTime: [
            {
                required: true,
                message: '请选择开始时间',
                trigger: 'blur'
            }
        ],
        endTime: [
            {
                required: true,
                message: '请选择结束时间',
                trigger: 'blur'
            }
        ]
      }
    };
  },
  computed: {
    tabCol: function() {
      return [
        {
          title: "班次名称",
          key: "name"
        },
        {
          title: "时间",
          key: "timeRange"
        },
        {
          title: "操作",
          width: 100,
          align: 'center',
          render: (h, params) => {
              return [h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.delItem(params.index);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              )]
          }
        }
      ];
    }
  },
  methods: {
    /**
     * 提交数据
     */
    submit() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let { name, startTime, endTime } = this.form;
          this.$emit("addShift", { name, timeRange: startTime + '-'+endTime  });
          this.modalIsVisible = false
        } else {
          this.$Message.error("提交信息有误");
        }
      });
    },
    /**
     * 删除某一项排班
     */
    delItem(index) {
        console.log(index)
        this.$emit('delShift', index)
    }
  }
};
</script>

