<template>
  <div class="app-container home">
    <Statistics v-if="$store.state.user.roles.some(element => ['tm_xmjl', 'ocr_pm', 'admin'].includes(element))">
    </Statistics>
    <template v-else>
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <Card :attr="cardGradeProps" :granularity.sync="gradeGranularity" @switchGranularity="getMyAchievement"></Card>
        </el-col>
        <el-col :span="8">
          <Card :attr="cardProductionProps" :granularity.sync="productionGranularity"
            @switchGranularity="getMyProduction"></Card>
        </el-col>
        <el-col :span="8">
          <Card :attr="cardCalender"></Card>
        </el-col>
      </el-row>
      <p></p>
      <el-row>
        <el-card>
          <p>我参与的任务</p>
          <el-table ref="tableTask" :data="tableData" :loading="loading">
            <el-table-column label="任务名称" prop="jobName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="任务ID" prop="id" align="center"></el-table-column>
            <el-table-column label="当前状态" prop="jobStatus" align="center">
              <template slot-scope="scope">
                <span>{{ labelText(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属项目" prop="projectName" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <a class="operation">
                  <el-button type="text" v-hasPermi="['index:startmark']">
                    <a @click="jumpPage(scope.row, 'mark')">
                      <svg-icon icon-class="startmark"></svg-icon>
                      <span>开始标注</span>
                    </a>
                  </el-button>
                  <el-button type="text" v-hasPermi="['index:startcheck']">
                    <a @click="jumpPage(scope.row, 'check')">
                      <svg-icon icon-class="startcheck"></svg-icon>
                      <span>开始质检</span>
                    </a>
                  </el-button>
                </a>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-row>
    </template>
  </div>
</template>

<script>
import Card from './components/cards/index'
import Statistics from '@/views/chart/statistics'
import { getMyAchievement, getMyProduction, getMyTasks } from '@/api/project/home'
import { getQuickJob, getQuickCheck } from '@/api/project/project'
export default {
  components: {
    Card,
    Statistics
  },
  name: "Index",
  data() {
    return {
      cardGradeProps: {
        title: '我的成绩',
        cards: [
          {
            title: '团队排行',
            value: 0,
            icon: 'grade_01'
          },
          {
            title: '平均准确率',
            value: 0,
            icon: 'grade_02'
          }
        ]
      },
      cardProductionProps: {
        title: '我的产能',
        cards: [
          {
            title: '标注数量',
            value: 0,
            icon: 'production_01'
          },
          {
            title: '通过审核数量',
            value: 0,
            icon: 'production_02'
          }
        ]
      },
      cardCalender: {
        type: 'Calender'
      },
      tableData: [],
      loading: false,
      gradeGranularity: 'day',
      productionGranularity: 'day',
      PDFLabels: [],
      OCRLabels: []
    };
  },
  computed: {
    labelText() {
      return function (row) {
        if (row) {
          if (row.projectType === '2') {
            const target = this.PDFLabels?.find(item => item.dictValue === row.jobStatus);
            return target?.dictLabel
          } else {
            const target = this.OCRLabels?.find(item => item.dictValue === row.jobStatus);
            return target?.dictLabel
          }
        } else {
          return ''
        }
      }
    }
  },
  mounted() {
    if (!this.$store.state.user.roles.some(element => ['tm_xmjl', 'ocr_pm', 'admin'].includes(element))) {
      this.loading = true
      this.getMyAchievement()
      this.getMyProduction()
      this.getMyTasks()
    }
    // 获取字典
    this.getDict()
  },
  methods: {
    getDict() {
      // PDF状态
      this.getDicts("group_status").then((response) => {
        this.PDFLabels = response.data;
      });
      // PDF状态
      this.getDicts("group_label").then((response) => {
        this.OCRLabels = response.data;
      });
    },
    getMyAchievement() {
      getMyAchievement({
        granularity: this.gradeGranularity
      }).then(res => {
        if (res.code === 200) {
          this.cardGradeProps.cards[0].value = res.data.ranking
          this.cardGradeProps.cards[1].value = res.data.accuracy.toFixed(2) + '%'
        }
      })
    },
    getMyProduction() {
      getMyProduction({
        granularity: this.productionGranularity
      }).then(res => {
        if (res.code === 200) {
          this.cardProductionProps.cards[0].value = res.data.jobCount
          this.cardProductionProps.cards[1].value = res.data.passCount
        }
      })
    },
    getMyTasks() {
      getMyTasks({
        ...this.pagination
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    jumpPage(row, type) {
      if (type === 'mark') {
        getQuickJob({
          projectId: row.projectId
        }).then(res => {
          if (res.code === 200) {
            // OCR标注
            if (row.projectType === '1') {
              this.$router.push({
                name: "ocrJobDetail",
                query: {
                  id: res.data.id,
                },
              });
            } else {
              // 题目标注
              this.$router.push({
                path: '/marks/pdfDetail',
                query: {
                  id: res.data.id,
                  file: res.data.fileId,
                  groupId: res.data.groupId
                },
              })
            }
          }
        })
      } else {
        getQuickCheck({
          projectId: row.projectId
        }).then(res => {
          if (res.code === 200) {
            // 质检
            if (row.projectType === '1') {
              this.$router.push({
                name: "ocrCheckDetail",
                query: {
                  id: res.data.id,
                },
              });
            } else {
              // 教辅
              this.$router.push({
                path: '/marks/pdfDetail',
                query: {
                  id: res.data.id,
                  file: res.data.fileId,
                  groupId: res.data.groupId,
                  checker: true
                },
              });
            }
          }
        })
      }
    }
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans",
  "Helvetica Neue",
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}

.operation {
  display: flex;
  gap: 30px;
  color: #409EFF;
  justify-content: center;

  span {
    margin-left: 5px;
  }
}
</style>

