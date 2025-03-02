<template>
  <div>
    <b v-if="title" style="padding: 10px 0;display: block;">{{ title }}：</b>
    <el-upload :action="uploadUrl" ref="uploader" :disabled="disabled" :file-list="fileList" list-type="picture-card"
      :on-success="uploadSuccess">
      <div slot="default" class="upload_wrap" v-if="!disabled">
        <div class="pastboard" @click.stop="selectPastBoard" v-on:paste="handlePaste">ctrl+V粘贴上传</div>
        <div class="btn"><el-button tyope="primary" size="mini">上传文件</el-button></div>
      </div>
      <div slot="default" v-else>
        <!-- <div class="pastboard" @click.stop="selectPastBoard" v-on:paste="handlePaste">ctrl+V粘贴上传</div> -->
        <el-button tyope="primary" size="mini" disabled>上传文件</el-button>
      </div>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <!-- <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleAi(file)"
          >
            <i class="el-icon-mobile"></i>
          </span> -->
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { file, uploadImg } from "@/api/tool/gen"
export default {
  props: {
    title: '',
    type: '',
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 测试
      // fileList: [{
      //   name: "15161693486092_.pic",
      //   url: process.env.VUE_APP_BASE_API+"/tools/view?fileId=" + '1699671940140126208'
      // }],
      fileList: [],
      uploadUrl: process.env.VUE_APP_BASE_API + "/tools/upFile" //文件上传地址
    };
  },
  methods: {
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.$emit("remove", {
        type: this.type,
        data: this.fileList
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAi(file) {
      let i = this.fileList.findIndex(item => item.uid === file.uid)
      console.log(file, this.fileList, i);
      this.$modal.loading("正在OCR识别，请稍候...");
      this.$emit('handleAi', { ...file, index: i, type: this.type })
    },
    uploadSuccess(response, file, fileList) {
      console.log('uploadSuccess', response);
      // this.$emit("uploadChange", {
      //   type: this.type,
      //   data: response.data
      // })
      this.fileList.push({ uid: response.data, url: process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + response.data })
      this.$emit("uploadChange", this.fileList)
    },
    selectPastBoard() {

    },
    handlePaste(e) {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          // 现在你可以处理这个图片 blob
          this.uploadImg(blob)
        }
      }
    },
    uploadImg(blob) {
      const formData = new FormData()
      formData.append('file', blob)
      uploadImg(formData).then(res => {
        this.fileList.push({
          uid: res.data,
          url: process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + res.data
        })
        this.$emit("uploadChange", this.fileList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload_wrap {
  width: 100%;
  height: 100%;
}

.pastboard {
  width: 80%;
  height: 50%;
  border: 1px dashed gray;
  margin: 10% auto;
  line-height: 60px;
  border-radius: 2px;
}

.btn {
  width: 100%;
  height: 20%;
  position: relative;

  >button {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
