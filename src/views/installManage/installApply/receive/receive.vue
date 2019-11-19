<template>
    <div>
        <div class="handle-container but_top">
            <div class="handle-title">
            </div>
            <Button type="info" class="but_button" @click='receiveShow'>打印领料单</Button>
        </div>
        <add :id='id' @handleClose="addClose" :isShow="add.isShow"></add>
    </div>        
</template>
<script>
import add from './add'
export default {
    components:{
      add
    },
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
    }
  },
  data() {
    return {
        subIsShow: false,
        add: {
            isShow: false
        }
    }
  },
  watch: {
    isShow: function(val, oldVal) {
    }
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    receiveShow(){
      this.add.isShow = true
    },
    submit(){

    },
    /**
     * @method addClose 添加的弹窗关闭时触发
     * @param {Boolean} isRefresh 是否需要重新加载列表
     */
    addClose(isRefresh = false) {
      this.add.isShow = false;
    },
  }
};
</script>
<style lang="stylus" scoped>
.but_top{
  margin-top: 30px;
}
</style>