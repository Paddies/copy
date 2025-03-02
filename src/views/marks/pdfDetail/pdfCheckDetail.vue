<template>
  <div class="container">
    <!-- 左侧PDF展示区 -->
    <div class="pdf">
      <iframe v-if="!iframeChanged" :src="url" frameborder="0" height="100%" width="100%" id="pdf" name="pdf"
        ref="pdf"></iframe>
    </div>
    <!-- 右侧配置区 -->
    <div class="topic">
      <el-card>
        <el-row>
          <el-col><span>文件名称: </span><span style="color: #1890ff;cursor: pointer;" @click="showFileTable = true">{{
            fileName }}</span></el-col>
        </el-row>
        <p></p>
        <div style="display: flex;gap: 10px 30px;">
          <span>任务状态: <span style="color: purple">{{ dictLabel }}</span></span>
          <span>任务领取人: <span style="color: #13ce66;">{{ groupJobName }}</span></span>
          <span>已标注数量: <span style="color: #13ce66">{{ jobSum }}</span></span>
        </div>
      </el-card>
      <p></p>
      <el-card width="100%">
        <p v-if="check_note">驳回理由：<b style="color: red">{{ check_note }}</b></p>
        <p v-else-if="!check_note && jobType">
          状态：<span :style="{ 'color': statusColor[`statu${jobType}`]['color'] }">{{ statusColor[`statu${jobType}`].statu
          }}</span>
        </p>
        <p v-if="jobNickName">标注员：{{ jobNickName }}</p>
        <div class="form">
          <el-form ref="topicForm" :model="form" inline size="mini" statu-icon :rules="rules" label-width="100px"
            label-position="left">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="titleType" label="题目类型：">
                  <el-radio-group v-model="form.titleType" :disabled="disabled" size="mini">
                    <el-radio v-for="item in radios" :key="item.name" :label="item.label" :name="item.name"
                      style="margin: 5px 20px 0 0"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="题目页码：" prop="titlePage">
                  <el-input type="number" :disabled="disabled" min="1" v-model="form.titlePage" size="mini"
                    style="width: 100px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="题目编号：" prop="titleNumber">
                  <el-input type="text" :disabled="disabled" v-model="form.titleNumber" size="mini"
                    style="width: 100px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" align="end">
                <div v-if="disabled">
                  <el-button type="default" size="mini" @click="backToProjectList()"
                    style="margin-left: 10px;">返回</el-button>
                </div>
                <div v-else>
                  <el-button type="primary" size="mini" v-hasPermi="['pdf:job:reback']" @click="rejectForm">驳回</el-button>
                  <el-button type="primary" size="mini" v-hasPermi="['pdf:job:pass']" @click="passForm"
                    :loading="passLoading">通过</el-button>
                  <el-button type="default" size="mini" @click="backToProjectList()"
                    style="margin-left: 10px;">返回</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <el-card style="margin: 10px 0">
        <div class="selector">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" plain
            @click="addContent('topic')">小题</el-button>
          <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" plain
            @click="addContent('answer')">答案</el-button>
          <el-button type="warning" icon="el-icon-circle-plus-outline" size="mini" plain
            @click="addContent('analysis')">解析</el-button>
        </div>
      </el-card>
      <!-- 小题区 -->
      <el-card>
        <div class="content">
          <div v-for="item in content" :key="item.sortId" class="content-unit"
            :style="{ backgroundColor: bgColor[item.contentType] }">
            <el-popconfirm size="mini" title="确定删除这段内容吗？" @confirm="deleteContent(item.sortId)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" class="delete" circle plain size="mini"
                :disabled="getCanDelete(item.contentType) || disabled" v-if="item.contentType !== 'topic'"></el-button>
            </el-popconfirm>
            <custom-upload :ref="`upload_${item.sortId}_dom`" :title="`${item.title + (item.index + 1)}选图`"
              type="topicPic" :disabled="disabled" @handleAi="(value) => handleAi(value, item.sortId)"
              @remove="(response) => removeFile(response, item.sortId)"
              @uploadChange="(respones) => uploadChange(respones, item.sortId)">
            </custom-upload>
            <p>
              <el-popover placement="bottom" trigger="hover" :disabled="disabled">
                <p>运算符 Binary operations</p>
                <div class="symbol">
                  <span v-katex="' \\ll '" @click="insetSymbol('\\ll', item.sortId)"></span>
                  <span v-katex="' \\lim '" @click="insetSymbol('\\lim', item.sortId)"></span>
                  <span v-katex="' \\lim_{x \\to \\infty} '" @click="
                    insetSymbol('\\lim_{x \\to \\infty}', item.sortId)
                    "></span>
                  <span v-katex="' \\sqrt[y]{x} '" @click="insetSymbol('\\sqrt[y]{x}', item.sortId)"></span>
                  <span v-katex="'  {\\textstyle \\sum_{a}^{b}} '" @click="
                    insetSymbol('{\\textstyle \\sum_{a}^{b}}', item.sortId)
                    "></span>
                </div>
                <el-button size="mini" slot="reference" :disabled="disabled">运算符</el-button>
              </el-popover>
              <el-popover placement="bottom" trigger="hover" :disabled="disabled">
                <p>插入XML标签</p>
                <div class="symbol">
                  <!-- <span @click="insetTag('quiz', item.sortId)">quiz</span>
                  <span @click="insetTag('ans', item.sortId)">ans</span> -->
                  <span @click="insetTag('space', item.sortId)">space</span>
                  <span @click="insetTag('latex', item.sortId)">latex</span>
                </div>
                <el-button size="mini" slot="reference" style="margin-left: 10px" :disabled="disabled">插入XML标签</el-button>
              </el-popover>
            </p>
            <el-input :id="`katex_${item.sortId}_text`" type="textarea" rows="5" v-model="item.contentText"
              :disabled="disabled" :placeholder="`请录入题目${item.title}`" :spellcheck="false"
              @blur="(e) => blur(e, item.sortId)" @change="textChange"></el-input>
            <p>LaTex预览</p>
            <div v-katex="item.contentText" readonly :ref="`katex_${item.sortId}_dom`" style="margin-bottom: 20px,font-size:18px;
    letter-spacing: 0.1em;" />
          </div>
        </div>
      </el-card>
    </div>
    <!-- 驳回弹框 -->
    <el-dialog title="驳回理由" :visible.sync="showDialog" width="30%">
      <el-input type="textarea" v-model="check_note" placeholder="请输入驳回理由" rows="5"></el-input>
      <span slot="footer">
        <el-button type="primary" :loading="loading" @click="confirm">确认</el-button>
        <el-button type="default" :loading="passLoading" @click="showDialog = !showDialog">取消</el-button>
      </span>
    </el-dialog>
    <!-- 标注、质检完成弹框 -->
    <el-dialog :title="'完成质检'" :visible.sync="okCheckOpen" width="600px" append-to-body>
      <el-form ref="okCheckForm" :model="okCheckForm" :rules="okcheckrules" label-width="80px">
        <el-form-item label="科目" prop="subject">
          <!-- <el-input size="mini" v-model="okCheckForm.subject" type="text" placeholder="请填入科目"></el-input> -->
          <el-select v-model="okCheckForm.subject" size="mini" clearable placeholder="请选择科目" style="width: 100%;">
            <el-option v-for="option in subjects" :key="option.dictValue" :label="option.dictLabel"
              :value="option.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select v-model="okCheckForm.language" size="mini" clearable placeholder="请选择语言" style="width: 100%;">
            <el-option v-for="option in languages" :key="option.dictValue" :label="option.dictLabel"
              :value="option.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份" prop="pubYear">
          <el-input v-model="okCheckForm.pubYear" type="text" placeholder="请填入年份" size="mini"
            style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="subOkCheckForm" :loading="subOkLoading">确 定</el-button>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 点击文件名弹窗 -->
    <el-dialog :visible.sync="showFileTable" width="70%">
      <template #title>
        <span>任务列表</span>
      </template>
      <el-table :data="fileTableData" size="mini" height="600">
        <el-table-column type="index" label="序号" width="50" fixed align="center"></el-table-column>
        <el-table-column label="任务ID" prop="id" align="center"></el-table-column>
        <el-table-column label="题目类型" prop="titleType" align="center"></el-table-column>
        <el-table-column label="页码" prop="titlePage" align="center"></el-table-column>
        <el-table-column label="题目编号" prop="titleNumber" align="center"></el-table-column>
      </el-table>
      <div class="table-bottom">
        <p></p>
        <div>
          <el-pagination size="mini" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pagination.pageNum" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.allNum">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 作废弹框 -->
    <el-dialog :visible.sync="cancellationVisible" width="600px" append-to-body>
      <el-form ref="cancellationForm" :model="cancellationForm" :rules="cancellationRules" label-position="left"
        label-width="100px">
        <el-form-item prop="text" label="作废原因：" size="mini">
          <el-input v-model="cancellationForm.text" placeholder="请输入作废原因" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col align="end">
          <el-button type="primary" size="mini" @click="confirmCancellation" :loading="cancellationLoading">确认</el-button>
          <el-button type="default" size="mini" @click="rejectCancellation">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import katex from "katex";
import "katex/dist/katex.min.css";
import { getJobContent, EditJobContent, cancellation } from "@/api/project/job";
import { latexImage } from "@/api/tool/gen";
import { debounce } from "@/utils"
import { update, addJobContentUpdata, JobContentCheckSave, RejectJobContent, PassJobContent, completeMarkSave, completeCheckSave, getJobGroupTable } from "@/api/project/job"
import { completeMark, reStartCheck } from "@/api/project/project"
import CustomUpload from "@/views/components/marks/customupload"
export default {
  name: 'pdfCheckDetail',
  components: {
    CustomUpload
  },
  data() {
    return {
      fileName: '',
      showFileTable: false,
      fileTableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 100,
        allNum: 0
      },
      groupStatus: [],
      groupStatu: '',
      groupJobName: '', // 任务领取人
      jobSum: '', // 已标注数量
      url: "",
      jobType: null,
      jobNickName: '',
      form: {
        titleType: '',
        titlePage: null,
        titleNumber: null
      },
      cancellationVisible: false,
      cancellationForm: {
        text: ''
      },
      cancellationRules: {
        text: {
          required: true, message: '作废原因为必填！', trigger: 'blur'
        }
      },
      cancellationLoading: false,
      radios: [],
      rules: {
        titleType: [
          { required: true, message: '请选择题目类型', trigger: 'blur' }
        ],
        titlePage: [
          { required: true, message: '请输入题目页码', trigger: 'blur' }
        ],
        titleNumber: [
          { required: true, message: '请输入题目编号', trigger: 'blur' }
        ]
      },
      content: [
        {
          title: '题目',
          contentType: 'topic',
          pictures: [],
          texts: [],
          contentText: '',
          sortId: 0
        }
      ],
      submitLoading: false,
      subOkLoading: false,
      saveLoading: false,
      jobId: this.$route.query.id,
      check_note: '',
      loading: false,
      passLoading: false,
      showDialog: false,
      // 完成标注弹窗选择字段
      okCheckOpen: false,
      okCheckForm: {
        subject: '',
        language: '',
        pubYear: ''
      },
      // 必填校验
      okcheckrules: {
        subject: [
          { required: true, message: "科目不能为空", trigger: "blur" },
        ],
        language: [
          { required: true, message: "语言不能为空", trigger: "blur" },
        ]
      },
      subjects: [],
      languages: [],
      iframeChanged: false
    };
  },
  mounted() {
    console.log(this.$route.query);
    // if (!this.jobId) {
    //   this.$message.warning("缺少任务id,请从列表页点击创建或者详情进入！")
    //   setTimeout(() => {
    //     this.backToProjectList()
    //   }, 1000);
    // }
    this.getInitPdf(this.jobId);
    // 题目类型
    this.getDicts("mark_title_type").then((response) => {
      if (response.code === 200) {
        this.radios = response.data.map(item => {
          return {
            label: item.dictLabel,
            name: item.dictValue
          }
        })
      }
    });
    // 字典-科目
    this.getDicts("group_subject").then(res => {
      this.subjects = res.data
    })
    // 字典-语言
    this.getDicts("group_language").then(res => {
      this.languages = res.data
    })
    // 字典-任务分组状态
    this.getDicts('group_status').then(res => {
      this.groupStatus = res.data
    })

    // 记录页面进入详情页
    sessionStorage.setItem('topicDetail', true)
    // 获取用户该分组下所有任务
    this.getJobGroupTable()
  },

  computed: {
    dictLabel() {
      return this.groupStatus.find(item => item.dictValue === this.groupStatu)?.dictLabel
    },
    disabled() {
      if (this.jobType === '-1') {
        // 废除状态
        return true
      } else {
        // 未作废
        return false
      }
    },
    bgColor() {
      return {
        question: '#e8f4ff',
        topic: '#e8f4ff',
        answer: '#e7faf0',
        analysis: '#fff8e6'
      }
    },
    statusColor() {
      return {
        'statu4': {
          'color': '#1890ff',
          'statu': '已通过'
        },
        'statu1': {
          'color': '#13ce66',
          'statu': '标注中'
        },
        'statu2': {
          'color': '#ffba00',
          'statu': '待检验'
        },
        'statu9': {
          'color': 'F5222D',
          'statu': '已驳回'
        },
        'statu-1': {
          'color': '#ff4949',
          'statu': '已作废'
        },
      }
    }
  },
  methods: {
    // 作废
    handleCancellation() {
      this.cancellationVisible = true
    },
    // 确认作废
    confirmCancellation() {
      this.$refs.cancellationForm.validate(valid => {
        if (valid) {
          this.cancellationLoading = true
          // 提交作废
          cancellation({
            jobId: this.jobId
          }).then(res => {
            if (res.code === 200) {
              this.cancellationLoading = false
              this.$message.success('作废操作完成！')
              this.cancellationVisible = false
              this.$refs.cancellationForm.resetFields()
              // 清空表单
              this.resetForm()
              // 任务清单
              this.jobId = res.data.id
              // 回显下一道题
              this.$router.replace({ path: '/marks/topic_c', query: { id: res.data.id, file: res.data.fileId } })
              this.iframeChanged = true;
              this.getInitPdf(res.data.id)

            }
          }).catch(() => {
            this.cancellationLoading = false
          })
        }
      })
    },
    // 取消作废
    rejectCancellation() {
      this.$refs.cancellationForm.resetFields()
      this.cancellationVisible = false
    },
    // 获取所有用户该分组下的所有任务
    getJobGroupTable() {
      getJobGroupTable({
        ...this.pagination,
        ...this.jobTableQuery,
        jobId: this.jobId,
        groupId: this.$route.query.groupId
      }).then(res => {
        if (res.code === 200) {
          this.fileTableData = res.data.content
          this.pagination.allNum = res.data.allNum
        }
      })
    },
    // 翻页
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getJobGroupTable()
    },
    // 翻页
    handleCurrentChange(val) {
      this.pagination.pageNum = val
      this.getJobGroupTable()
    },
    backToProjectList() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1)
    },
    /**
     *@Description: 获取pdf链接
     *@param {String} id - pdf对应id,
     *@return {undefined} - 返回值描述
     */
    getInitPdf(jobId) {
      this.iframeChanged = true
      getJobContent({ jobId }).then((response) => {
        if (response.code === 200) {
          // 控制进入的时候加载pdf到指process定页面
          this.url =
            process.env.VUE_APP_BASE_API +
            "/tools/view?fileId=" +
            this.$route.query.file +
            `#page=${response.data?.titlePage ? response.data.titlePage : 1
            }&view=FitH,top`;

          this.iframeChanged = false
          // 赋值form
          this.form = {
            titleType: response.data.titleType,
            titlePage: response.data.titlePage,
            titleNumber: response.data.titleNumber
          }
          this.check_note = response.data.checkNote
          this.jobType = response.data.jobType
          this.jobNickName = response.data.jobNickName
          this.fileName = response.data.fileName
          this.groupStatu = response.data.groupStatus
          this.groupJobName = response.data.groupJobName
          this.jobSum = response.data.jobSum
          // 图片回显
          if (response.data?.content && response.data?.content.length > 0) {
            response.data.content.forEach(item => item.texts = [])
            this.content = response.data.content
            this.setPartSort()
            this.content.forEach(item => {
              if (item.pictures && Array.isArray(item.pictures)) {
                this.$nextTick(() => {
                  this.$refs[`upload_${item.sortId}_dom`][0].fileList = item.pictures.map(o => {
                    return {
                      uid: o,
                      url: process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + o
                    }
                  })
                })
              }
              // latex预览显示
              if (item.contentText) {
                this.$nextTick(() => {
                  katex.render(item.contentText, this.$refs[`katex_${item.sortId}_dom`][0], {
                    throwOnError: false,
                  });
                })
              }
            })
          } else {
            this.setPartSort()
          }
        }
      });
    },
    /**
     *@Description: 获取是否可删除
     *@param {String} type - 小类，是否为题目、答案、分析、小题,
     *@return {Boolean} Boolean - 是否禁用
    */
    getCanDelete(type) {
      // 是否为题目
      if (type === 'topic') {
        return true
      } else {
        // 不为题目, 且不为质检状态则可以删除
        return false
      }
    },
    /**
     *@Description: 提交
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    submit: debounce(function () {
      this.submitLoading = true
      this.$refs.topicForm.validate((valid) => {
        if (valid) {
          let params = {
            versionNo: '1',
            groupId: this.$route.query.groupId,
            jobType: '2',
            jobId: this.jobId,
            ...this.form,
            content: this.content
          }
          addJobContentUpdata(params).then(res => {
            this.submitLoading = false
            if (res.code === 200) {
              this.$message.success('提交成功！')
              // 清空表单
              this.resetForm()
              if (this.$route.query.myjob) {
                // 我的任务
                this.backToProjectList()
              } else {
                // 任务清单
                this.jobId = res.data.id
                // mark为1需要调用详情接口回显下一道题
                if (res.data.mark === '1') {
                  this.getInitPdf(res.data.id)
                }
              }
            }
          }).catch(err => {
            this.submitLoading = false
          })
        } else {
          this.submitLoading = false
        }
      });
    }, 500),
    /**
     *@Description: 标注完成备注
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    subOkCheckForm() {
      const type = this.$route.query.checker ? 'check' : 'mark'
      this.$confirm(`是否继续质检'}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkAndMarkSave(type)
      }).catch(e => {
        this.checkAndMarkCancel(type)
      })
    },
    checkAndMarkCancel(type) {
      const requests = {
        'mark': completeMarkSave,
        'check': completeCheckSave
      }
      requests[type]({
        jobId: this.jobId,
        ...this.okCheckForm
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(`${type === 'mark' ? '标注' : '质检'}完成！`)
          this.okCheckOpen = false
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.replace({ path: '/project/list' })
        }
      })
    },
    checkAndMarkSave() {
      this.$refs["okCheckForm"].validate((valid) => {
        if (valid) {
          this.subOkLoading = true
          let params = {
            jobId: this.jobId,
            ...this.okCheckForm
          }
          reStartCheck(params).then(res => {
            this.subOkLoading = false
            if (res.code === 200) {
              if (res.data.code === 9999) {
                //9999已驳回状态
                // 完成所有标注任务，返回列表
                this.okCheckOpen = false
                this.$message.success(`质检完成！`)
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.replace({ path: '/project/list' })
              } else {
                this.$message.success(`质检完成！`)
                this.okCheckOpen = false
                this.iframeChanged = true;
                this.getNewCheckDetail(res.data)
                this.$refs["okCheckForm"].resetFields()
              }
            }
          }).catch(() => {
            this.subOkLoading = false
          })
        }
      })

    },
    closeDialog() {
      this.$refs.okCheckForm.resetFields()
      this.okCheckOpen = false
    },
    /**
     *@Description: 清空表单
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    resetForm() {
      this.$refs.topicForm.resetFields();
      this.content.forEach(async (item) => {
        await this.$nextTick();
        // upload组件清空
        this.$refs[`upload_${item.sortId}_dom`][0] ? this.$refs[`upload_${item.sortId}_dom`][0].fileList = [] : ''
        // latex预览清空
        if (this.$refs[`katex_${item.sortId}_dom`][0]) {
          // latex预览清空
          katex.render('', this.$refs[`katex_${item.sortId}_dom`][0], {
            throwOnError: false,
          });
        }
      })
      this.jobType = null
      this.check_note = ''
      this.content = [
        {
          title: '题目',
          contentType: 'topic',
          pictures: [],
          texts: [],
          contentText: '',
          sortId: 0,
          index: 0
        }
      ]
    },
    /**
     *@Description: 添加小题、答案、解析
     *@param {String} type - 添加类型：小题、答案、解析,
     *@return {undefined} - 返回值描述
    */
    addContent(type) {
      switch (type) {
        case 'topic':
          this.content.push({
            title: '小题',
            contentType: 'question',
            pictures: [],
            texts: [],
            contentText: '',
            sortId: Math.max(...this.content.map(obj => obj.sortId)) + 1
          })
          break;
        case 'answer':
          this.content.push({
            title: '答案',
            contentType: 'answer',
            pictures: [],
            texts: [],
            contentText: '',
            sortId: Math.max(...this.content.map(obj => obj.sortId)) + 1
          })
          break;
        default:
          this.content.push({
            title: '解析',
            contentType: 'analysis',
            pictures: [],
            texts: [],
            contentText: '',
            sortId: Math.max(...this.content.map(obj => obj.sortId)) + 1
          })
          break;
      }
      // 设置标题（题目1、答案n、解析n）
      this.setPartSort()
      // 滚动到对应位置
      const c_box = document.querySelector('.topic')
      this.$nextTick(() => {
        c_box.scrollTop = c_box.scrollHeight
      })
    },
    /**
     *@Description: 删除对应sort内容
     *@param {Number} sort - 排序号,
     *@return {undefined} - 返回值描述
    */
    deleteContent(sort) {
      this.content = this.content.filter(item => item.sortId !== sort)
      this.setPartSort()
    },
    /**
     *@Description: OCR识别
     *@param {Object} obj - 上传图片对象
     *@param {Number} sort - 排序索引
     *@return {undefined} - 返回值描述
    */
    handleAi(obj, sort) {
      try {
        this.getLatexString(obj.uid, sort, obj.index)
      } catch (error) {
        this.$modal.closeLoading();
      }
    },
    /**
     *@Description: 删除图片
     *@param {Object} response - 删除后的数据,
     *@param {Number} sort - 排序索引,
     *@return {undefined} - 返回值描述
    */
    removeFile(response, sort) {
      // this.content[sort].pictures = response.data.map(item => item.uid)
      let target = this.content.find(item => item.sortId === sort)
      target.pictures = response.data.map(item => item.uid)
    },
    /**
     *@Description: 上传图片回调
     *@param {Object} response - file对象
     *@param {Number} sort - 排序索引
     *@return {undefined} - 返回值描述
    */
    uploadChange(response, sort) {
      // console.log('pictures', response, sort);
      // this.content[sort].pictures = response.map(item => item.uid)
      // console.log('this.content', this.content);
      let target = this.content.find(item => item.sortId === sort)
      target.pictures = response.map(item => item.uid)
    },
    /**
     *@Description: 失去焦点，出发latex预览
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    blur(e, sort) {
      katex.render(e.target.value, this.$refs[`katex_${sort}_dom`][0], {
        throwOnError: false,
      });
    },
    /**
     *@Description: 文字变化
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    textChange() {
      console.log(this.content)
    },
    /**
     *@Description: 上传图片至服务端解析成字符串回显，并解析数学符号,
     *@param {String} id - 上传图片的id,
     *@param {Number} sort - 排序索引,
     *@param {Number} index - 索引
     */
    getLatexString(id, sort, index) {
      latexImage({ fileId: id }).then((res) => {
        this.$modal.closeLoading();
        const targetLatex = this.content.find(item => item.sortId === sort)
        if (res.code === 200) {
          targetLatex.texts[index] = res.data.data;
          targetLatex.contentText = targetLatex.texts.reduce((prev, next) => {
            return prev + next
          }, '')
          katex.render(targetLatex.contentText, this.$refs[`katex_${sort}_dom`][0], {
            throwOnError: false,
          });
        }
      }).catch(err => {
        this.$modal.closeLoading()
      });
    },
    /**
     *@Description:
     *@param {类型} 参数名称 - 参数描述
    */
    rejectForm() {
      this.showDialog = true
    },
    /**
      *@Description: 通过质检
      *@return {undefined} - 返回值描述
    */
    passForm() {
      this.passLoading = true;
      JobContentCheckSave({
        ...this.form,
        jobId: this.$route.query.id,
        groupId: this.$route.query.groupId,
        content: this.content,
        jobType: 4
      }).then(res => {
        if (res.code === 200) {
          PassJobContent({
            ...this.form,
            content: this.content,
            jobId: this.$route.query.id,
            groupId: this.$route.query.groupId,
            jobType: 4
          }).then((response) => {
            if (response.code === 200) {
              this.passLoading = false
              if (response.data.code === 9999) {
                // 完成质检
                this.$message.success('质检完成，即将返回项目列表！')
                setTimeout(() => {
                  this.$store.dispatch("tagsView/delView", this.$route);
                  this.$router.replace({ path: '/project/list' })
                }, 2000);
              } else if (response.data.code === 8888) {
                this.okCheckOpen = true
                this.$nextTick(() => {
                  this.okCheckForm.subject = response.data.subject
                  this.okCheckForm.language = response.data.language
                  this.okCheckForm.pubYear = response.data.pubYear
                })
                console.log(this.okCheckForm);
              } else {
                this.$message.success("质检通过");
                console.log(response.data);
                this.getNewCheckDetail(response.data, true)
              }
            } else {
              this.$message.error(response.msg)
            }
          }).catch(err => {
            this.passLoading = false
          })
        }
      }).catch(err => {
        this.passLoading = false
      })
    },
    /**
     *@Description: 确认驳回
    */
    confirm() {
      if (!this.check_note) return this.$message.warning('驳回理由不能为空')
      this.loading = true
      JobContentCheckSave({
        ...this.form,
        jobId: this.$route.query.id,
        groupId: this.$route.query.groupId,
        content: this.content,
        checkNote: this.check_note,
        jobType: 9
      }).then(res => {
        if (res.code === 200) {
          RejectJobContent({
            ...this.form,
            jobId: this.$route.query.id,
            groupId: this.$route.query.groupId,
            content: this.content,
            checkNote: this.check_note,
            jobType: 9
          }).then((response) => {
            if (response.code === 200) {
              if (res.data.code === 9999) {
                // 完成质检
                this.$message.success('质检完成，即将返回项目列表！')
                setTimeout(() => {
                  this.$store.dispatch("tagsView/delView", this.$route);
                  this.$router.replace({ path: '/project/list' })
                }, 2000);
              } else if (response.data.code === 8888) {
                this.okCheckOpen = true
                this.loading = false
                this.showDialog = false
                this.$nextTick(() => {
                  this.okCheckForm.subject = response.data.subject
                  this.okCheckForm.language = response.data.language
                  this.okCheckForm.pubYear = response.data.pubYear
                })
              } else {
                this.$message.success("驳回成功");
                this.loading = false
                this.showDialog = false
                this.getNewCheckDetail(response.data, true)
              }
              // this.$router.back()
            } else {
              this.$message.error(response.msg)
            }
          }).catch(err => {
            this.loading = false
          });
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.loading = false
      });
    },
    /**
     *@Description: 通过或驳回后回调，更新当前质检信息
     *@param {Object} content - 质检详情,
     *@return {undefined} - 返回值描述
    */
    getNewCheckDetail(detail, _next) {
      if (_next) {
        this.iframeChanged = true
        // 无需请求接口（下一题）
        if (detail) {
          // 控制进入的时候加载pdf到指process定页面
          this.url =
            process.env.VUE_APP_BASE_API +
            "/tools/view?fileId=" +
            this.$route.query.file +
            `#page=${detail?.titlePage ? detail.titlePage : 1
            }&view=FitH,top`;
          // 赋值form
          setTimeout(() => {
            this.iframeChanged = false
          }, 0);
          this.form = {
            titleType: detail.titleType,
            titlePage: detail.titlePage,
            titleNumber: detail.titleNumber
          }
          this.check_note = detail.checkNote
          this.jobType = detail.jobType
          this.jobNickName = detail.jobNickName
          this.$route.query.id = detail.id
          this.jobId = detail.id
          this.fileName = detail.fileName
          this.groupStatu = detail.groupStatus
          this.groupJobName = detail.groupJobName
          this.jobSum = detail.jobSum
          // 图片回显
          if (detail?.content && detail?.content.length > 0) {
            detail.content.forEach(item => item.texts = [])
            this.content = detail.content
            this.setPartSort()
            this.content.forEach(item => {
              if (item.pictures && Array.isArray(item.pictures)) {
                this.$nextTick(() => {
                  this.$refs[`upload_${item.sortId}_dom`][0].fileList = item.pictures.map(o => {
                    return {
                      uid: o,
                      url: process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + o
                    }
                  })
                })
              }
              // latex预览显示
              if (item.contentText) {
                this.$nextTick(() => {
                  katex.render(item.contentText, this.$refs[`katex_${item.sortId}_dom`][0], {
                    throwOnError: false,
                  });
                })
              }
            })
          }
        } else {
          this.setPartSort()
        }
      } else {
        // 初始化
        if (detail) {
          console.log('完成标注后fileId：' + detail.fileId);
          // 赋值form
          this.$route.query.id = detail.id
          this.$route.query.groupId = detail.groupId
          this.$route.query.file = detail.fileId
          this.jobId = detail.id
          this.groupId = detail.groupId
          this.jobType = detail.jobType
          this.getInitPdf(this.jobId)
          // 控制进入的时候加载pdf到指定页面
          this.url =
            process.env.VUE_APP_BASE_API +
            "/tools/view?fileId=" +
            detail.fileId +
            `#page=${detail?.titlePage ? detail.titlePage : 1
            }&view=FitH,top`;
          this.iframeChanged = false
        } else {
          // this.$router.back()
          this.$router.replace('/timu/checklist')
        }
      }
    },
    /**
     *@Description: 给content部分分类，添加排序字段
    */
    setPartSort() {
      let types = {
        topic: 'topic',
        answer: 'answer',
        analysis: 'analysis',
        question: 'question'
      }
      for (let key in types) {
        let arr = this.content.filter(item => item.contentType === key)
        arr.forEach((item, index) => {
          item.index = index
        })
      }
    },
    /**
     *@Description: 插入XML标签
     *@param {String} tag - 标签字符串,
     *@param {Number} sortId - 索引,
     *@return {undefined} - 返回值描述
    */
    insetTag(tag, sortId) {
      const _dom = document.getElementById(`katex_${sortId}_text`);
      // 字符串截取
      let target = this.content.find(item => item.sortId === sortId)
      const str = target.contentText.slice(_dom.selectionStart, _dom.selectionEnd);
      const addStr = tag === 'space' ? `[${tag}]` : `<${tag}>${str}</${tag}>`
      target.contentText = `${target.contentText.slice(
        0,
        _dom.selectionStart
      )}${addStr}${target.contentText.slice(
        _dom.selectionEnd,
        target.contentText.length
      )}`;
      this.blur({ target: { value: target.contentText } }, sortId)
    },
    /**
     *@Description: 插入Latex标签
     *@param {String} latexString - latex符号,
     *@param {Number} sortId - 索引,
     *@return {undefined} - 返回值描述
    */
    insetSymbol(latexString, sortId) {
      const _dom = document.getElementById(`katex_${sortId}_text`);
      let target = this.content.find(item => item.sortId === sortId)
      const str = target.contentText.slice(_dom.selectionStart, _dom.selectionEnd);
      target.contentText = `${target.contentText.slice(
        0,
        _dom.selectionStart
      )}${latexString}${target.contentText.slice(
        _dom.selectionEnd,
        target.contentText.length
      )}`;
      this.blur({ target: { value: target.contentText } }, sortId)
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: inherit;
  display: flex;
  gap: 10px;
}

.pdf {
  width: 50%;
  height: inherit;

  #pdf {
    height: calc(100% - 10px);
  }
}

.topic {
  width: 50%;
  height: 100vh;
  overflow-y: auto;
  padding: 10px;
}

.content {
  .content-unit {
    width: 100%;
    max-height: 520px;
    overflow-y: auto;
    position: relative;
    padding-bottom: 20px;
    padding: 0 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    background-color: #e8f4ff;

    .delete {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}

.drops {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
}

.symbol {
  display: flex;
  align-items: center;
  gap: 10px;

  >span {
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    display: block;
    cursor: pointer;
    text-align: center;
    background-color: #f4f4f4;
    padding: 0 5px;
  }
}

.table-bottom {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}

::v-deep .el-textarea__inner {
  height: 200px;
  letter-spacing: 0.1em;
  font-size: 18px;
}
</style>
