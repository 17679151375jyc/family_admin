<template>
  <div class="error-wrapper">
    <img :src="require('./404.png')" class="img" />
    <p class="text">
      访问页面不存在，
      <a @click="toHome" class="to-home">点击</a>
      返回首页
      <b>({{time}}秒后自动返回)</b>
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      timer: null,
      time: 5
    };
  },
  mounted() {
    this.start();
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  computed: {
    ...mapState({
      companyType: state => state.user.companyType
    })
  },
  methods: {
    start() {
      setTimeout(() => {
        this.time = this.time - 1;
        if (this.time === 0) {
          this.toHome();
        } else {
          this.start();
        }
      }, 1000);
    },
    toHome() {
      if (this.companyType === 1) {
        // 如果公司类型为物管，就跳到物管首页
        this.$router.push({
          name: this.$config.communityHomeName
        });
      } else {
        this.$router.push({
          name: this.$config.homeName
        });
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.error-wrapper {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  .img {
    margin-top: 30px;
    width: 430px;
    height: 269px;
  }

  .text {
    font-size: 16px;
    margin-top: 30px;
    letter-spacing: 2px;

    .to-home {
      font-size: 16px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    b {
      display: block;
      font-weight: normal;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
