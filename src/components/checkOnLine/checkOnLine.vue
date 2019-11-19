<template></template>
<script>
import {checkOnLine} from '@/api/common'
export default {
  data() {
    return {
        timer: null
    };
  },
  mounted() {
      this.checkOnLine()
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
      checkOnLine (){
          this.timer = setTimeout(() => {
              checkOnLine({}).then(({data, errorCode})=> {
                  if (errorCode === 0) {
                      console.log('检测在线成功')
                  }
              })
              this.checkOnLine()
          }, 10000)
      }
  }
};
</script>