<template>
  <div style="width:0;height:0;overflow:hidden;">
    <!-- <audio id="audio" src="./alarmSound.mp3" ></audio> -->
    <audio id="sound" preload="preload" controls hidden loop>
      <source src="./alarmSound.mp3" type="audio/mpeg" />
    </audio>
    <!-- <video></video>
    <iframe allow="autoplay" style="display:none" :src="require('./alarmSound.mp3')"></iframe>-->
  </div>
</template>
<script>
import { getAlramList } from "@/api/messageManage";
export default {
  data() {
    return {
      timer: null,
      audio: null,
      number: 0,
      startUpdateTime: null,
      totalNotice: 0
    };
  },
  mounted() {
    this.getAlramList();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    openAlarmWindow() {
      this.$emit("openAlarmWindow");
    },
    getAlramList() {
      //   if (!sessionStorage.getItem("alarmList")) {
      //     sessionStorage.setItem("alarmList", JSON.stringify([]));
      //   }
      this.timer = setTimeout(() => {
        getAlramList({
          timeoutSecond: 180,
          startUpdateTime: this.startUpdateTime,
          pageSize: 10,
          page: 1
        }).then(({ data: { list }, errorCode }) => {
          if (errorCode === 0) {
            /*   if (list.length === 0) {
              // 如果查到的新接口，没有要处理的报警，就清空session
              sessionStorage.setItem("alarmList", JSON.stringify([]));
              this.$Notice.destroy();
            } else */
            if (list.length > 0) {
              // 如果有未处理的报警
              let alarmList = sessionStorage.getItem("alarmList")
                ? JSON.parse(sessionStorage.getItem("alarmList"))
                : [];
              // this.$Notice.destroy();

              /* if (!alarmList || alarmList.length === 0) {
                sessionStorage.setItem("alarmList", JSON.stringify(list));
                alarmList = JSON.parse(sessionStorage.getItem("alarmList"));
              }*/
              for (let i = 0; i < list.length; i++) {
                let obj = list[i];
                if (i == list.leading - 1) {
                  this.startUpdateTime = obj.updateTime;
                }
                for (let j = 0; j < alarmList.length; j++) {
                  // 对比session数据，如果信息存在，但没有手动关闭过的才弹窗
                  if (
                    list[i].id == alarmList[j].id &&
                    list[i].status == alarmList[j].status
                  ) {
                    obj = null;
                    break;
                  }
                }
                if (obj) {
                  if (this.totalNotice < 10) {
                    this.totalNotice++;
                    this.$Notice.warning({
                      top: 4,
                      title: `${obj.status} - ${obj.userPhone} - ${obj.name}`,
                      duration: 0,
                      onClose: () => {
                        //TODO 点击时跳到相对应的页面处理
                        this.audio.pause()
                        setTimeout(() => {
                          this.openAlarmWindow();
                        }, 500);
                        this.totalNotice--;
                      }
                    });
                    this.audio = document.getElementById("sound");
                    this.audio.play();
                    alarmList.push(obj);
                  } else {
                    this.startUpdateTime = obj.updateTime;
                    break;
                  }
                }
              }
              sessionStorage.setItem("alarmList", JSON.stringify(alarmList));
            }
            // let alarmList = JSON.parse(sessionStorage.getItem("alarmList"));

            // let list = data.list;
            // let newAlarmList = [];

            // // 遍历本地的数据，如果有新数据，就加入
            // for (let j = 0; j < list.length; j++) {
            //   if (alarmList.length === 0) {
            //     for (let i = 0; i < list.length; i++) {
            //       newAlarmList.push({
            //         name: list[i].name,
            //         id: list[i].id,
            //         close: false
            //       });
            //     }
            //   } else {
            //     for (let i = 0; i < alarmList.length; i++) {
            //       if (alarmList[i].id !== list[j].id) {
            //         newAlarmList.push({
            //           name: list[j].name,
            //           id: list[j].id,
            //           close: false
            //         });
            //       }
            //     }
            //   }
            // }
            // // this.$Notice.destroy();
            // sessionStorage.setItem("alarmList", JSON.stringify(newAlarmList)); // 保存最新

            // for (let i = 0; i < newAlarmList.length; i++) {
            //   this.$Notice.warning({
            //       title: newAlarmList[i].id,
            //     // title: `${this.$options.filters.statusName(
            //     //   statusValue,
            //     //   "AlertMessageStatus"
            //     // )} - ${userPhone} - ${name}`,
            //     duration: 0,
            //     name: newAlarmList[i].id,
            //     onClose: () => {
            //       let alarms = JSON.parse(
            //         sessionStorage.getItem("alarmList")
            //       );
            //       let newAlarms = [];
            //       for (let i = 0; i < alarms.length; i++) {
            //         if (alarms[i].id == id) {
            //         }
            //         newAlarms.push({
            //           name: alarms[i].name,
            //           id: alarms[i].id,
            //           close: true
            //         });
            //       }
            //       sessionStorage.setItem(
            //         "alarmList",
            //         JSON.stringify(newAlarms)
            //       );
            //       console.log("关闭了" + id);
            //     }
            //   });
            // }
          }
        });
        this.getAlramList();
      }, 10000);
    }
  }
};
</script>
