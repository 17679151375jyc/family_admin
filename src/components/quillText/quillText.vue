<template>
    <div class="edit_container">
        <quillEditor 
            placeholder="111"
            class="quill_css"
            v-model='quillTextVal'
            ref="myQuillEditor" 
            :options="editorOption" 
            @blur="onEditorBlur($event)" 
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
            
        </quillEditor>
        <Spin size="large" fix v-if='loadShow' class="spin_css"></Spin>
        <input type="file" id='update' ref='update' class="update" @change="fileChange($event)">
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module';
import * as Quill from 'quill' //引入编辑器
Quill.register('modules/imageDrop', ImageDrop);
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import COS from "cos-js-sdk-v5";
import { getAuthorization } from "@/api/common";
// cos上传
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
    components: {
        quillEditor
    },
    data(){
        return{
            loadShow: false,
            quillTextVal:'111',
            editorOption:{
                placeholder: '请输入通知内容',
                modules:{
                    toolbar:{
                        container:[
                            ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                            ['blockquote', 'code-block'],     //引用，代码块           
                            [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                            [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                            [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                            [{ 'direction': 'rtl' }],             // 文本方向           
                            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题           
                            [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                            [{ 'font': [] }],     //字体
                            [{ 'align': [] }],    //对齐方式
                            ['clean'],    //清除字体样式
                            ['image']    //上传图片、上传视频
                        ],
                        handlers: {
                            'image': (value) => {
                                if (value) {
                                    this.$refs.update.dispatchEvent(new MouseEvent('click')) 
                                } else {
                                    this.quill.format('image', false);
                                }
                            },
                        }
                    },
                    imageDrop:false,//拖拽上传（base64） 
                },
                theme:'snow'
            }
 
        }
    },
    props: {
        quillValue: {
            type: String,
            default: ''
        },
        value: { // 图片路径
            type: String,
            default: ""
        },
        pathDir: { // 文件存放的目录 
            type: String,
            default: "/web/service/"
        },
        fileNamePrefix: { // 文件名前缀
            type: String,
            default: ""
        },
    },
    watch:{
        quillValue:function(val, oldVal){
            if(val == ''){
                this.quillTextVal = ''
            }
        }
    },
    methods:{
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange({ editor, html, text }){// 内容改变事件
            let that = this
            that.$emit('getContert', html)
        }, 
        fileChange(e){//上传图片
            let that = this
            that.loadShow = true;
            let file = e.target.files[0];
            cos.sliceUploadFile(
                {
                Bucket: that.$config.cos.bucket,
                Region: that.$config.cos.region,
                Key:
                    that.pathDir +
                    that.fileNamePrefix +
                    "-" +
                    new Date().getTime() +
                    "-" +
                    Math.ceil(Math.random() * 100) +
                    "." + file.type.split("/")[1],
                    Body: file
                },
                (err, data) => {
                console.log("上传完成", err, data);
                if (err) {
                    that.$Message.error("上传出现错误！");
                }else{
                    that.loadShow = false;
                    console.log("https://" + data.Location)
                    let quill = this.$refs.myQuillEditor.quill
                    let length = quill.getSelection().index;
                    let res = "https://" + data.Location
                    quill.insertEmbed(length, 'image', res)
                }
            }
        );
        }
        
    },
    mounted(){
        let that = this
        that.quillTextVal = that.quillValue
    }
}
</script>
<style lang="stylus" scoped>
.update{
    display none
}
.spin_css{
    height 435px
}
.quill_css{
    height 400px
}
>>>.ql-toolbar{
    border-top-left-radius 5px
    border-top-right-radius 5px
}
>>>.ql-container{
    height 80%
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px
}
>>>.ql-snow{
    border 1px solid #DCDEE2
}
</style>