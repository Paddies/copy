<template>
  <div class="container">
    <!-- <div class="pdf">
      <iframe
        :src="url"
        frameborder="0"
        height="100%"
        width="100%"
        id="pdf"
        ref="pdf"
      ></iframe>
    </div> -->
    <div class="topic">
      <el-card>
        <div class="content">
          <div v-for="item in content" :key="item.sortId" class="content-unit" :style="{backgroundColor: bgColor[item.contentType]}">
            <el-popconfirm
              size="mini"
              title="确定删除这段内容吗？"
              @confirm="deleteContent(item.sortId)"
            >
              <el-button  slot="reference" type="danger" icon="el-icon-delete" class="delete" circle plain size="mini" :disabled="getCanDelete(item.contentType) || disabled" v-if="item.contentType !== 'topic'"></el-button>
            </el-popconfirm>
            <custom-upload :ref="`upload_${item.sortId}_dom`" :title="`选图`" type="topicPic"  :disabled="disabled" @handleAi="(value)=>handleAi(value, item.sortId)" @remove="(response) => removeFile(response, item.sortId)" @uploadChange="(respones) => uploadChange(respones, item.sortId)"></custom-upload>
            <p>
              <el-popover placement="bottom" trigger="hover" :disabled="disabled">
                <p>运算符 Binary operations</p>
                <div class="symbol">
                  <span
                    v-katex="' \\ll '"
                    @click="insetSymbol('\\ll', item.sortId)"
                  ></span>
                  <span
                    v-katex="' \\lim '"
                    @click="insetSymbol('\\lim', item.sortId)"
                  ></span>
                  <span
                    v-katex="' \\lim_{x \\to \\infty} '"
                    @click="
                      insetSymbol('\\lim_{x \\to \\infty}', item.sortId)
                    "
                  ></span>
                  <span
                    v-katex="' \\sqrt[y]{x} '"
                    @click="insetSymbol('\\sqrt[y]{x}', item.sortId)"
                  ></span>
                  <span
                    v-katex="'  {\\textstyle \\sum_{a}^{b}} '"
                    @click="
                      insetSymbol('{\\textstyle \\sum_{a}^{b}}', item.sortId)
                    "
                  ></span>
                </div>
                <el-button size="mini" slot="reference" :disabled="disabled">运算符</el-button>
              </el-popover>
              <el-popover placement="bottom" trigger="hover" :disabled="disabled">
                <p>插入XML标签</p>
                <div class="symbol">
                  <span @click="insetTag('quiz', item.sortId)">quiz</span>
                  <span @click="insetTag('ans', item.sortId)">ans</span>
                  <span @click="insetTag('span', item.sortId)">span</span>
                  <span @click="insetTag('latex', item.sortId)">latex</span>
                </div>
                <el-button size="mini" slot="reference" style="margin-left: 10px" :disabled="disabled">插入XML标签</el-button>
              </el-popover>
            </p>
            <el-input
              :id="`katex_${item.sortId}_text`"
              type="textarea"
              rows="5"
              v-model="item.contentText"
              :disabled="disabled"
              :placeholder="`请录入题目${item.title}`"
              :spellcheck="false"
              @blur="(e)=> blur(e, item.sortId)"
              @change="textChange"
            ></el-input>
            <p>LaTex预览</p>
            <div
              v-katex="item.contentText"
              readonly
              :ref="`katex_${item.sortId}_dom`"
              style="margin-bottom: 20px"
            />
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="驳回理由"
      :visible.sync="showDialog"
      width="30%">
      <el-input type="textarea" v-model="check_note" placeholder="请输入驳回理由" rows="5"></el-input>
      <span slot="footer">
        <el-button type="primary" :loading="loading" @click="confirm">确认</el-button>
        <el-button type="default" :loading="passLoading" @click="showDialog=!showDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import katex from "katex";
import "katex/dist/katex.min.css";
import { getJobContent, EditJobContent } from "@/api/project/job";
import { latexImage } from "@/api/tool/gen";
import { debounce } from "@/utils"
import { update, addJobContentUpdata, JobContentCheckSave, RejectJobContent, PassJobContent } from "@/api/project/job"
import CustomUpload from "@/views/components/marks/customupload"
export default {
  path: 'pdfDetail',
  components: {
    CustomUpload
  },
  data() {
    return {
      url: "",
      jobType: null,
      jobNickName: '',
      form: {
        titleType: '',
        titlePage: null,
        titleNumber: null
      },
      radios: [],
      rules: {
        titleType: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
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
      saveLoading: false,
      jobId: this.$route.params.id,
      check_note: '',
      loading: false,
      passLoading: false,
      showDialog: false
    };
  },
  mounted() {
    // if(!this.jobId) {
    //   this.$message.warning("缺少任务id,请从列表页点击创建或者详情进入！")
    //   setTimeout(() => {
    //     this.$router.back()
    //   }, 1000);
    // }
    // this.getInitPdf(this.jobId);
    // 题目类型
    this.getDicts("mark_title_type").then((response) => {
      if(response.code === 200) {
        this.radios = response.data.map(item => {
          return {
            label: item.dictLabel,
            name: item.dictValue
          }
        })
      }
    });
  },
  computed: {
    disabled() {
      // if(this.$route.params?.checker) {
      //   // 质检页面或者待检验
      //   return true
      // } else {
      //   // 标注页面
      //   return false
      // }
      return false
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
        }
      }
    }
  },
  methods: {
    /**
     *@Description: 获取pdf链接
     *@param {String} id - pdf对应id,
     *@return {undefined} - 返回值描述
     */
    getInitPdf(jobId) {
      getJobContent({ jobId }).then((response) => {
        if (response.code === 200) {
          // p
          this.url =
            process.env.VUE_APP_BASE_API +
            "/tools/view?fileId=" +
            this.$route.params.file +
            `#page=${
              response.data?.titlePage ? response.data.titlePage : 1
            }&view=FitH,top`;
          // 赋值form
          this.form = {
            titleType: response.data.titleType,
            titlePage: response.data.titlePage,
            titleNumber: response.data.titleNumber
          }
          this.check_note = response.data.checkNote
          this.jobType = response.data.jobType
          this.jobNickName = response.data.jobNickName
          // 图片回显
          if(response.data?.content && response.data?.content.length > 0) {
            response.data.content.forEach(item => item.texts = [])
            this.content = response.data.content
            this.setPartSort()
            this.content.forEach(item => {
              if(item.pictures && Array.isArray(item.pictures)) {
                this.$nextTick(() => {
                  this.$refs[`upload_${item.sortId}_dom`][0].fileList = item.pictures.map(o => {
                    return {
                      uid: o,
                      url: process.env.VUE_APP_BASE_API+"/tools/view?fileId=" + o
                    }
                  })
                })
              }
              // latex预览显示
              if(item.contentText) {
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
     if(type === 'topic') {
       return true
     } else {
       // 不为题目, 且不为质检状态则可以删除
       return false
     }
   },
   /**
    *@Description:
    *@param {类型} 参数名称 - 参数描述,
    *@return {undefined} - 返回值描述
   */
    saveData() {
      this.saveLoading = true
      let params = {
        versionNo: '1',
        jobId: this.$route.params.id,
        ...this.form,
        content: this.content
      }
      EditJobContent(params).then(res => {
        this.saveLoading = false
        if(res.code === 200) {
          this.$message.success('保存成功！')
        }
      }).catch(err => {
        this.saveLoading = false
      })
    },
    /**
     *@Description: 提交
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    submit: debounce(function() {
      this.submitLoading = true
      this.$refs.topic_form.validate((valid) => {
        if(valid) {
          let params = {
            versionNo: '1',
            groupId: this.$route.params.groupId,
            jobType: '2',
            jobId: this.jobId,
            ...this.form,
            content: this.content
          }
          addJobContentUpdata(params).then(res => {
            this.submitLoading = false
            if(res.code === 200) {
              this.$message.success('提交成功！')
              // 清空表单
              this.resetForm()
              if(this.$route.params.myjob) {
                // 我的任务
                this.$router.back()
              } else {
                // 任务清单
                this.jobId = res.data.id
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
     *@Description: 清空表单
     *@param {类型} 参数名称 - 参数描述,
     *@return {undefined} - 返回值描述
    */
    resetForm() {
      this.$refs.topic_form.resetFields();
      this.content.forEach(async (item) => {
        await this.$nextTick();
        // upload组件清空
        this.$refs[`upload_${item.sortId}_dom`][0] ? this.$refs[`upload_${item.sortId}_dom`][0].fileList = [] : ''
        // latex预览清空
        katex.render('', this.$refs[`katex_${item.sortId}_dom`][0], {
          throwOnError: false,
        });
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
      // this.content[sort].pictures = response.map(item => item.uid)
      // this.content.find(item => item.sort)
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
        jobId: this.$route.params.id,
        groupId: this.$route.params.groupId,
        content: this.content,
        jobType: 4
      }).then(res => {
        if(res.code === 200) {
          PassJobContent({
            ...this.form,
            content: this.content,
            jobId: this.$route.params.id,
            groupId: this.$route.params.groupId,
            jobType: 4
          }).then((response) => {
            if(response.code === 200) {
              this.$message.success("质检通过");
              this.passLoading = false
              this.$router.back()
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
      if(!this.check_note) return this.$message.warning('驳回理由不能为空')
      this.loading = true
      JobContentCheckSave({
        ...this.form,
        jobId: this.$route.params.id,
        groupId: this.$route.params.groupId,
        content: this.content,
        checkNote: this.check_note,
        jobType: 9
      }).then(res => {
        if(res.code === 200) {
          RejectJobContent({
            ...this.form,
            jobId: this.$route.params.id,
            groupId: this.$route.params.groupId,
            content: this.content,
            checkNote: this.check_note,
            jobType: 9
          }).then((response) => {
            if(response.code === 200) {
              this.$message.success("驳回成功");
              this.loading = false
              this.showDialog = false
              this.$router.back()
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
     *@Description: 给content部分分类，添加排序字段
    */
    setPartSort() {
      let types = {
        topic: 'topic',
        answer: 'answer',
        analysis: 'analysis',
        question: 'question'
      }
      for(let key in types) {
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
      target.contentText = `${target.contentText.slice(
        0,
        _dom.selectionStart
      )}<${tag}>${str}</${tag}>${target.contentText.slice(
        _dom.selectionEnd,
        target.contentText.length
      )}`;
      this.blur({target: { value: target.contentText}}, sortId)
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
      this.blur({target: { value: target.contentText}}, sortId)
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: inherit;
  display:flex;
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
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding: 10px;
}
.content {
  .content-unit {
    width: 100%;
    overflow-y: auto;
    position: relative;
    padding-bottom: 20px;
    padding: 0 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    background-color: #e8f4ff;
    .delete  {
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
  > span {
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    display: block;
    cursor: pointer;
    text-align: center;
    background-color: #f4f4f4;
  }
}
</style>
