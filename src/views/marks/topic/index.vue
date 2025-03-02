<template>
  <div class="container">
    啊啊啊啊啊啊啊啊啊啊啊
    <div class="pdf">
      <!-- <div id="pdf" ref="pdf"></div> -->
      <iframe :src="url" frameborder="0" height="100%" width="100%" id="pdf" ref="pdf"></iframe>
      <!-- <embed height="100%" width="100%" :src="this.url" ref="pdf" id="pdf"> </embed> -->
    </div>
    <div class="topic">
      <div class="topic_content" :style="{ 'height': `calc(100vh - ${form.checkNote ? 40 : 20}px)` }">
        <p v-if="form.checkNote" style="font-size: 12px; line-height: 20px;margin: 0">状态：<span
            style="color: red">已驳回</span> &nbsp;&nbsp;&nbsp;&nbsp; 理由：{{ form.checkNote }}</p>
        <div class="form">
          <!-- 题目基本信息 -->
          <el-form id="basicform" ref="form" :mode="form" label-width="80px" size="mini">
            <el-row>
              <el-col :span="24">
                <el-form-item label="题目类型:" required>
                  <el-radio-group v-model="form.titleType" :disabled="disabled">
                    <el-radio label="解答题" name="question"></el-radio>
                    <el-radio label="选择题" name="selection"></el-radio>
                    <el-radio label="判断题" name="judgments"></el-radio>
                    <el-radio label="填空题" name="filling"></el-radio>
                    <el-radio label="做图题" name="picture"></el-radio>
                    <el-radio label="证明题" name="provide"></el-radio>
                    <el-radio label="其它题" name="other"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="题目页码:" required>
                  <el-input type="number" :disabled="disabled" min="1" v-model="form.titlePage" style="width: 80px;"
                    size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" prop="titleNumber">
                <el-form-item label="题目编号:" required>
                  <el-input type="number" :disabled="disabled" min="1" v-model="form.titleNumber" style="width: 80px;"
                    size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div class="submit" v-if="!disabled">
                  <el-button type="primary" size="mini" @click="dataSave">保存</el-button>
                  <el-popconfirm confirm-button-text='确认' cancel-button-text='取消' icon="el-icon-info" icon-color="red"
                    title="确认后将会提交审批，是否确认？" @confirm="sumbit">
                    <el-button slot="reference" type="primary" size="mini" style="margin-left: 10px;">提交</el-button>
                  </el-popconfirm>
                </div>
                <div v-else>
                  <el-button type="primary" size="mini" @click="rejectForm">驳回</el-button>
                  <el-button type="primary" size="mini" @click="passForm">通过</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="uploaders">
          <!-- 上传题目图片 -->
          <el-card>
            <custom-upload ref="topicPic" title="题目选图" type="topicPic" :disabled="disabled" @handleAi="handleAi"
              @remove="removeFile" @uploadChange="uploadChange"></custom-upload>
            <custom-upload ref="answerPic" title="答案选图" type="answerPic" :disabled="disabled" @handleAi="handleAi"
              @remove="removeFile" @uploadChange="uploadChange"></custom-upload>
            <custom-upload ref="analysisPic" title="解析选图" type="analysisPic" :disabled="disabled" @handleAi="handleAi"
              @remove="removeFile" @uploadChange="uploadChange"></custom-upload>
          </el-card>
          <p></p>
          <el-card>
            <Logging ref="logging" :disabled="disabled" @change="changeLogging"></Logging>
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog title="驳回理由" :visible.sync="showDialog" width="30%">
      <el-input type="textarea" v-model="check_note" placeholder="请输入驳回理由" rows="5"></el-input>
      <span slot="footer">
        <el-button type="primary" :loading="loading" @click="confirm">确认</el-button>
        <el-button type="default" :loading="passLoading" @click="showDialog = !showDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CustomUpload from "@/views/components/marks/customupload"
import Logging from "@/views/components/marks/logging"
import { item, add, update } from "@/api/project/job";
import { debounce } from "@/utils"
export default {
  components: {
    CustomUpload,
    Logging
  },
  data() {
    return {
      url: "",
      htmlUrl: "",
      isShow: false,
      form: {
        titleType: '',
        titlePage: null,
        titleNumber: null,
        topicPic: [],
        answerPic: [],
        analysisPic: [],
        topicQuestion: '',
        topicAnswer: '',
        topicAnalysis: ''
      },
      currentType: 'topicQuestion',
      showDialog: false,
      check_note: '',
      // 驳回提交loading
      loading: false,
      passLoading: false,
      showPrint: false,
      pdfh5: null
    };
  },
  computed: {
    disabled() {
      // 条件判断是否质检员
      // if(this.$store.state.user.roles.includes('bzy_tm ')) {
      //   return false
      // } else {
      //   return true
      // }
      if (this.$route.query?.checker) {
        // 质检页面
        return true
      } else {
        // 标注页面
        return false
      }
    }
  },
  created() {
    this.getItem(this.$route.query.id)

  

  },


  methods: {
    getItem(id) {
      item({ "id": id }).then((response) => {
        // 初始化
        for (let key in response.data) {
          if (['topicPic', 'answerPic', 'analysisPic'].includes(key) && !response.data[key]) {
            response.data[key] = []
          }
        }
        // 控制进入的时候加载pdf到指定页面
        this.url = process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + this.$route.query.file + `#page=${response.data?.titlePage ? response.data.titlePage : 1
          }&view=FitH,top`

        this.form = response.data
        this.form = {
          ...response.data,
          groupId: this.$route.query.groupId
        }
        this.$nextTick(() => {
          // 回显图片
          for (let key in this.form) {
            if (['topicPic', 'answerPic', 'analysisPic'].includes(key)) {
              this.$nextTick(() => {
                this.$refs[key].fileList = this.form[key].map(item => {
                  return {
                    uid: item,
                    url: process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + item
                  }
                })
              })
            }
          }
          // 处理后端转译
          this.$refs.logging.form = {
            topicQuestion: this.form?.topicQuestion || '',
            topicAnswer: this.form?.topicAnswer || '',
            topicAnalysis: this.form?.topicAnalysis || ''
          }
          for (let key in this.$refs.logging.form) {
            if (this.$refs.logging.form[key]) {
              // 渲染工具,初始渲染
              this.$refs.logging.insetSymbol('', key)
            }
          }
        })
      });
    },
    dataSave() {
      // 处理图片
      this.form.topicPic = this.mapId(this.$refs.topicPic.fileList)
      this.form.answerPic = this.mapId(this.$refs.answerPic.fileList)
      this.form.analysisPic = this.mapId(this.$refs.analysisPic.fileList)
      update(this.form).then((response) => {
        if (response.code === 200) {
          this.$message.success("保存成功");
        } else {
          this.$message.error(response.msg)
        }
      });
    },
    uploadChange(response) {
      this.form[response.type].push({ uid: response.data, url: process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + response.data })
    },
    removeFile(response) {
      this.form[response.type] = response.data
    },
    sumbit: debounce(function () {
      if (!this.form.titleType) return this.$message.warning("请选择题目类型")
      if (!this.form.titlePage) return this.$message.warning("请输入题目页码")
      if (!this.form.titleNumber) return this.$message.warning("请输入题目编号")
      // 处理图片
      this.form.topicPic = this.mapId(this.$refs.topicPic.fileList)
      this.form.answerPic = this.mapId(this.$refs.answerPic.fileList)
      this.form.analysisPic = this.mapId(this.$refs.analysisPic.fileList)
      this.form['jobType'] = "2";
      update(this.form).then((response) => {
        this.$message.success("新增成功");
        this.resetform()
      });
    }, 500),
    // 重置表单初始值
    resetform() {
      this.form = {
        titleType: '',
        titlePage: null,
        titleNumber: null,
        topicPic: [],
        answerPic: [],
        analysisPic: [],
        topicQuestion: '',
        topicAnswer: '',
        topicAnalysis: ''
      }
      // 清空upload,logging组件数据
      this.$refs.topicPic.fileList = []
      this.$refs.answerPic.fileList = []
      this.$refs.analysisPic.fileList = []
      this.$refs.logging.form = {
        topicQuestion: "",
        topicAnswer: "",
        topicAnalysis: "",
      }
      this.$refs.logging.changeTopic()
      this.$refs.logging.changeAnswer()
      this.$refs.logging.changeAnalysis()
      // 获取一个新的任务id
      add({ "groupId": this.$route.query.groupId }).then(res => {
        this.form['id'] = res.data.id
        this.form['fileId'] = res.data.fileId
      })
      // this.$router.back()
    },
    changeLogging(form) {
      this.form = {
        ...this.form,
        ...form
      }
    },
    // 质检驳回
    rejectForm() {
      this.showDialog = true
    },
    // 确认驳回
    confirm() {
      if (!this.check_note) return this.$message.warning('驳回理由不能为空')
      this.loading = true
      update({ ...this.form, checkNote: this.check_note, jobType: 9 }).then((response) => {
        if (response.code === 200) {
          this.$message.success("驳回成功");
          this.loading = false
          this.showDialog = false
          this.$router.back()
        } else {
          this.$message.error(response.msg)
        }
      });
    },
    /**
     *@Description: 质检通过
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    passForm() {
      this.passLoading = true;
      update({ ...this.form, jobType: 4 }).then((response) => {
        if (response.code === 200) {
          this.$message.success("质检通过");
          this.passLoading = false
          this.$router.back()
        } else {
          this.$message.error(response.msg)
        }
      });
    },
    /**
     *@Description: AI识别，传入图片
     *@file {Object} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    handleAi(file) {
      const obj = {
        topicPic: 'topicQuestion',
        answerPic: 'topicAnswer',
        analysisPic: 'topicAnalysis'
      }
      this.$refs.logging.getLatexString(file.uid, obj[file.type])
    },
    mapId(files) {
      let ids = []
      if (Array.isArray(files)) {
        ids = files.map(item => item.uid)
      }
      return ids
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
}

.pdf {
  width: 50%;
  height: 100%;

  #pdf {
    height: calc(100% - 10px)
  }
}

.topic {
  width: 50%;
  height: 100vh;
  padding: 10px;

  .submit {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

.topic_content {
  width: 100%;
  height: calc(100vh - 20px);

  .form {
    width: 100%;
    height: 90px;
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.10);
    margin-bottom: 10px;
    padding-right: 10px;
    border-radius: 4px;
  }

  .uploaders {
    height: calc(100% - 100px);
    overflow-y: scroll;
  }
}

// ::v-deep .katex .base {
//   display: block;
//   width: 100%;
//   white-space: pre-wrap;
//   word-break: break-word;
// }

::v-deep .el-form-item--mini {
  font-size: 12px;
}

::v-deep .el-form-item__label {
  font-size: 12px;
}

::v-deep .el-radio__label {
  font-size: 12px;
}
</style>
