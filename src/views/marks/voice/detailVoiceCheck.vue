<template>
  <!-- 包含语音标注和表单的组件容器 -->
  <div class="mixin-components-container">
    <!-- 语音标注部分 -->
    <el-row>
      <el-card class="box-card" style="text-align: left">
        <div class="clearfix title">
          <span>语音标注</span>
        </div>
        <!-- VoicePlayer组件，用于播放和标注语音 -->
        <VoicePlayer :voiceSrc="voiceSrc" @regionUpdate="handleRegionUpdate" ref="voicePlayerRef" />
      </el-card>
    </el-row>
    <!-- 表单部分 -->
    <el-row>
      <el-card>
        <el-row>
          <el-col :span="14" :offset="5">
            <!-- <el-button type="primary" @click="addOneRegion">
              添加一个段落（测试用）
            </el-button> -->
            <!-- 表单 -->
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
              <el-form-item label="任务状态：">
                <div> <span :class="`status-tag status-tag-jobStatus-${jobStatus}`">{{ jobStatusTxt }}</span></div>
              </el-form-item>
              <!-- 语音转写输入框 -->
              <el-form-item label="有效区域（s）:">
                <div v-if="voiceTimeRange">
                  {{ voiceTimeTxt }}
                  <span class="my-label" style="margin-left: 130px; margin-right: 20px">有效时长（s）:</span>
                  <span>{{ voiceTimeRange }}s</span>
                </div>
              </el-form-item>
              <el-form-item label="语音转写：" prop="paragraphContent" required>
                <el-input type="textarea" v-model="form.paragraphContent"></el-input>
              </el-form-item>
              <!-- 预识别文本显示框 -->
              <el-form-item label="预识别文本：" prop="preTranslateText">
                <el-input disabled v-model="form.preTranslateText"></el-input>
              </el-form-item>
              <!-- 有效性单选框 -->
              <el-form-item label="有效性：" prop="paragraphStatus" required>
                <el-radio-group v-model="form.paragraphStatus">
                  <el-radio v-for="error in effectList" :label="error.dictValue" :key="error.dictLabel">{{ error.dictLabel
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 错误类型复选框 -->
              <el-form-item label="错误类型：" prop="errorType">
                <el-checkbox-group v-model="form.errorType">
                  <el-checkbox v-for="error in errorTypeOptions" :label="error.dictValue" :key="error.dictLabel">{{
                    error.dictLabel }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- 其他备注输入框 -->
              <el-form-item label="其他备注：" prop="remark">
                <el-input type="textarea" v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="clickOk('4')" v-if="jobStatus ==='5' && checkPermi(['voice:job:check'])">通过</el-button>
                <el-button size="small" type="warning" @click="clickOk('9')"  v-if="jobStatus === '5' && checkPermi(['voice:job:check'])">驳回</el-button>
                <el-button size="small" type="danger" @click="handleVoid"  v-if="jobStatus === '5' && checkPermi(['voice:job:cancel'])">作废</el-button>
                <el-button size="small" type="primary" plain @click="getNext"
                v-if="jobStatus === '5' && checkPermi(['voice:job:nextCheck'])">下一条</el-button>
                <el-button size="small" type="info" plain @click="backHome">返回</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import VoicePlayer from "./components/VoicePlayer";
import {
  getJobContent,
  saveVoiceParagraphs,
  submitVoiceJob,
  voiceCancel,
} from "@/api/project/voiceJob";

import {
  voiceCheck,
  nextCheck
} from "@/api/project/voiceCheck";

import { getFileSrcById } from "./tools";

export default {
  name: "detailVoiceJob",
  components: { VoicePlayer },
  data() {
    return {
      // 表单数据
      form: {
        paragraphContent: "",
        paragraphStatus: "",
        errorType: [],
        remark: "",
      },
      rules: {
        paragraphContent: [
          { required: true, message: "请输入语音转写", trigger: "blur" },
        ],
        paragraphStatus: [
          { required: true, message: "请选择有效性", trigger: "change" },
        ],
      },
      // 错误类型选项
      errorTypeOptions: [],
      effectList: [],
      voiceSrc: "",
      paragraphStart: "",
      paragraphEnd: "",
      // jobId: this.$route.query.id,
      submitLoading: false,
      detailData: {},
      // 提交加载
      subLoading: false,
      voiceTimeRange: '',
      voiceTimeTxt: '',
      projectId: '', // 项目id
      jobId: '', // 任务id
      jobStatus:'',//任务状态
      jobStatusList: [],
      jobStatusTxt: ''
    };
  },
  mounted() {
    // 可以在这里进行其他初始化操作
    this.jobId = this.$route.query.id;
    this.type = this.$route.query.type;
    this.getDetail();
    this.getVoiceErrorType();
    this.getParagraphStatus();
  },
  methods: {
    backHome() {
      let id = this.projectId;
      this.$router.replace({
        path: "/project/static",
        query: {
          id,
        },
      });
    },


    // todo 根据id获取任务详情
    async getDetail() {
      const res = await getJobContent({ id: this.jobId });
      if (res.code !== 200) {
        return;
      }
      this.detailData = res.data;
      await this.getDicts("t_job_type").then((response) => {
        this.jobStatusList = response.data;
      });
      const { fileId, paragraphs, projectId, jobStatus } = this.detailData;
      this.projectId = projectId;
      this.jobStatus = jobStatus.toString();
      this.jobStatusTxt = this.jobStatusList?.find(
        (item) => item.dictValue === jobStatus
      ).dictLabel;
      // 获取MP3url
      const mp3Url = getFileSrcById(fileId);
      this.voiceSrc = mp3Url;
      if (paragraphs && paragraphs.length) {
        console.log("2023-11-24 00:26:40 index.vue line:131", paragraphs[0]);
        const {
          paragraphContent, // 转换内容
          paragraphStatus, // 状态
          errorType, // 错误类型
          paragraphStart, //段落选中开始时间
          paragraphEnd, //段落选中结束时间
          remark, // 驳回/作废描述
        } = paragraphs[0];
        this.form.paragraphContent = paragraphContent;
        this.form.paragraphStatus = paragraphStatus;
        if (errorType) {
          this.form.errorType = errorType.split(",");
        }

        this.paragraphStart = paragraphStart;
        this.paragraphEnd = paragraphEnd;
        this.form.remark = remark;
        this.addOneRegion(); // 添加一个区域
      }
      console.log("mp3Url", mp3Url);
    },

    // todo 获取错误类型
    async getVoiceErrorType() {
      const res = await this.getDicts("voice_error_type");
      this.errorTypeOptions = res.data;
      // console.log("getVoiceErrorType", this.errorTypeOptions);
      if (!res.data) {
        return;
      }
    },
    // todo 获取语音状态
    async getParagraphStatus() {
      const res = await this.getDicts("paragraph_status");
      this.effectList = res.data;
      // console.log("getParagraphStatus", this.effectList);
      if (!res.data) {
        return;
      }
    },


    // 点击通过
    async clickOk(jobStatus) {
      const res = await voiceCheck({
        jobId: this.jobId,
        jobStatus,
        remark: this.form.remark,
        errorType: this.form.errorType.join(',')
      })
      if (res.code === 200) {
        this.$message.success('操作成功，进行下一条')
        this.getNext()
      }

    },
    async getNext() {
      const res = await nextCheck({ projectId: this.projectId })

      if (res.code === 200) {
        // 没有任务时，返回列表
        if (!res.data.nextId) {
          this.$message.warning(`暂无新任务`)
          this.backHome()
          return
        }
        const nextId = res.data.nextId
        if (nextId === this.jobId) {
          this.$message.warning(`当前任务还未质检完毕`)
          return
        }
        this.jobId = nextId
        // 将路由的id重置
        this.$router.replace(`/marks/voice/detailVoiceCheck?id=${nextId}`);
        this.getDetail()
      }
    },
    // 提交
    submit() {
      if (this.voiceTimeRange === "0.0") {
        this.$message.warning("请先截取有效段落");
        return;
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          let params = {
            jobId: this.jobId,
            paragraphs: [
              {
                paragraphNum: "1",
                paragraphStatus: this.form.paragraphStatus,
                paragraphStart: this.paragraphStart,
                paragraphEnd: this.paragraphEnd,
                paragraphContent: this.form.paragraphContent,
                remark: this.form.remark,
                errorType: this.form.errorType.join(","),
                paragraphDuration: Number((this.paragraphEnd - this.paragraphStart).toFixed(4)),
              },
            ],
          };
          saveVoiceParagraphs(params)
            .then((res) => {
              this.submitLoading = false;
              if (res.code === 200) {
                this.$message.success("提交成功！");
              }
            })
            .catch((err) => {
              this.submitLoading = false;
            });
        } else {
          this.submitLoading = false;
        }
      });
    },
    // 清空表单和语音
    resetParams() {
      this.$refs["voicePlayerRef"].clear()
      this.voiceTimeRange = ''
      this.voiceTimeTxt = ''
      this.resetParagraphForm();
    },
    resetParagraphForm() {
      this.resetForm("form");
    },
    handleSubmit() {
      let params = {
        jobId: this.jobId,
        paragraphs: [
          {
            paragraphNum: "1",
            paragraphStatus: this.form.paragraphStatus,
            paragraphStart: this.paragraphStart,
            paragraphEnd: this.paragraphEnd,
            paragraphContent: this.form.paragraphContent,
            remark: this.form.remark,
            errorType: this.form.errorType.join(","),
            paragraphDuration: Number((this.paragraphEnd - this.paragraphStart).toFixed(4)),
          },
        ],
      };
      // 调保存接口
      submitVoiceJob(params)
        .then((res) => {
          this.subLoading = false;
          if (res.code === 200) {
            this.$message.success("提交成功！");
            // 有下一题
            if (res.data.nextId) {
              this.jobId = res.data.nextId;
              this.$router.replace({
                path: "/marks/voice/detailVoiceJob",
                query: {
                  id: this.jobId,
                },

              });
              this.resetParams()
              this.getDetail();
            }
          }
        })
        .catch((err) => {
          this.subLoading = false;
        });
    },
    // 作废
    handleVoid() {
      let { errorType, remark } = this.form
      if (remark === '') {
        this.$message.warning("请输入备注说明");
        return
      }
      voiceCancel({
        jobId: this.jobId,
        errorType: errorType.join(","),
        remark: remark,
      }).then((res) => {
        
        if (res.data.nextId) {
          this.$message.success("作废成功"); // 有下一题
          this.getNext()
        } else {
          this.$message.success("作废成功，暂无新任务"); 
          this.getDetail();       
        }
      });
    },
    //传值
    handleRegionUpdate(e) {
      this.paragraphStart = Number(e.start).toFixed(4);
      this.paragraphEnd = Number(e.end).toFixed(4);
      this.voiceTimeRange = Number(this.paragraphEnd - this.paragraphStart).toFixed(4) || '0.0'
      this.voiceTimeTxt = `【${Number(this.paragraphEnd).toFixed(4)}，${Number(this.paragraphStart).toFixed(4)}】` || ''
    },
    updateStartAndEnd() {
      // 更新 start 和 end 的值
      this.paragraphStart = this.paragraphStart;
      this.paragraphEnd = this.paragraphEnd;
      console.log("updateStartAndEnd", this.paragraphStart, this.paragraphEnd);
    },
    addOneRegion() {
      this.$refs["voicePlayerRef"].addRegion({
        start: this.paragraphStart,
        end: this.paragraphEnd,
      });
      console.log("addOneRegion", this.paragraphStart, this.paragraphEnd);
    },
  },
};
</script>

<style >
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}

.title {
  text-align: center;
  font-size: larger;
}

.wavesurfer-handle {
  width: 6px !important;
  background-color: pink !important;
}

#waveform ::part(region-handle-right) {
  border-right-width: 4px !important;
  border-right-color: #fff000 !important;
}

.my-label {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}
.el-form {
    border-bottom: 0px ;
}
</style>
