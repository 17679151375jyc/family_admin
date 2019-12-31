<!--详情页-->
<template>
  <Modal
    title="详情"
    v-model.trim="visible"
    :mask-closable="false"
    :loading="loading"
    width="1000"
    footer-hide
  >
    <DetailInfo v-if="visible" :macNumber="macNumber"></DetailInfo>
  </Modal>
</template>
<script>
import DetailInfo from "./detailInfo";
export default {
  name: "Detail",
  components: {
    DetailInfo
  },
  props: {
    macNumber: {
      type: String,
      default: null
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
      visible: false
    };
  },
  computed: {},
  watch: {
    value: async function(val, oldVal) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {}
};
</script>
<style lang="stylus" scoped></style>


