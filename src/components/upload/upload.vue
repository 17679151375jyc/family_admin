<template>
  <div class="upload">
    <i class="iconfont iconjia"></i>
    <span>上 传</span>
    <div class="img-div" v-if="filePath">
      <img :src="filePath" v-if="type==='image'" />
      <i v-if="type==='video'" class="iconfont iconiconfonttubiao_shipinzhibo"></i>
    </div>
    <div class="close" @click="filePath=''" v-if="filePath && !loading">
      <i class="iconfont iconguanbi1"></i>
    </div>
    <div class="loading" v-show="loading">
      <Spin fix>
        <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
        <div>上传中...</div>
      </Spin>
    </div>
    <input type="file" ref="fileInput" @change="fileChange($event)" :accept="accept" />
  </div>
</template>
<script>
import { getAuthorization } from "@/api/common";
import COS from "cos-js-sdk-v5";
//cos上传
var cos = new COS({
  getAuthorization: function(options, callback) {
    getAuthorization({}).then(({ data, errorCode }) => {
      if (errorCode === 0) {
        let { expiredTime, sessionToken, tmpSecretId, tmpSecretKey } = data;
        callback({
          TmpSecretId: tmpSecretId,
          TmpSecretKey: tmpSecretKey,
          XCosSecurityToken: sessionToken,
          ExpiredTime: expiredTime
        });
      }
    });
  }
});
export default {
  props: {
    value: {
      // 图片路径
      type: String,
      default: ""
    },
    pathDir: {
      // 文件存放的目录
      type: String,
      default: "/web/service/"
    },
    fileNamePrefix: {
      // 文件名前缀
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "image"
    }
  },
  watch: {
    value: function(val) {
      this.filePath = val;
    },
    filePath: function(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      loading: false,
      filePath: ""
    };
  },
  computed: {
    accept() {
      if (this.type === "image") {
        return "image/png, image/jpeg, image/gif, image/jpg";
      } else if (this.type === "video") {
        return "video/mp4";
      } else {
          return ''
      }
    }
  },
  methods: {
    /**
     * 图片上传
     */
    fileChange(e) {
      let file = e.target.files[0];

      if (file.type.split("/")[0] !== this.type) {
        this.$Message.error("请选择对应的文件类型上传");
        return;
      }
      if (this.type === "video") {
        if (file.size > 52428800) {
          // 视频上传不能大于50m
          this.$Message.error("上传的视频不能大于50M");
          return;
        }
      } else if (this.type === "image") {
        // 图片上传不能大于5m
        if (file.size > 5242880) {
          this.$Message.error("上传的视频不能大于5M");
          return;
        }
      }
      this.loading = true;
      cos.sliceUploadFile(
        {
          Bucket: this.$config.cos.bucket,
          Region: this.$config.cos.region,
          Key:
            this.pathDir +
            this.fileNamePrefix +
            "-" +
            new Date().getTime() +
            "-" +
            Math.ceil(Math.random() * 100) +
            "." +
            file.type.split("/")[1],
          Body: file
        },
        (err, data) => {
          console.log("上传完成", err, data);
          this.$refs.fileInput.value = "";
          this.loading = false;
          if (err) {
            this.$Message.error("上传出现错误！");
          }
          this.filePath = "https://" + data.Location;
        }
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.upload {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  cursor: pointer;
  position: relative;

  i {
    font-size: 26px;
    color: #999;
  }

  span {
    color: #666;
    font-size: 14px;
  }

  &:hover {
    border-color: #38f;
  }

  .img-div {
    position: absolute;
    background: #fff;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-height: 100%;
      max-width: 100%;
    }

    i {
      color: #3388ff;
      font-size: 48px;
    }
  }

  .close {
    z-index: 2;
    position: absolute;
    top: -11px;
    right: -11px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: -1px 1px 3px rgba(0, 0, 0, 0.5);

    i {
      font-size: 20px;
      color: #f5222d;
    }
  }

  input {
    display: block;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100px;
    height: 100px;
    opacity: 0;
    cursor: pointer;
  }

  .loading {
    position: absolute;
    z-index: 4;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(180deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
</style>