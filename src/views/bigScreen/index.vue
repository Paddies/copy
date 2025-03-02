<template>
  <div class="app-container home">
    <div id="index" ref="appRef">
      <div class="bg" :style="{ 'background-image': `url(${bg_institude})` }">
        <dv-loading v-if="loading">Loading...</dv-loading>
        <div v-else class="host-body">
          <div class="d-flex jc-center">
            <dv-decoration-10 class="dv-dec-10" />
            <div class="d-flex jc-center">
              <dv-decoration-8 class="dv-dec-8" :color="decorationColor" />
              <div class="title">
                <span class="title-text">大数据可视化平台</span>
                <dv-decoration-6 class="dv-dec-6" :reverse="true" :color="['#50e3c2', '#67a1e5']" />
              </div>
              <dv-decoration-8 class="dv-dec-8" :reverse="true" :color="decorationColor" />
            </div>
            <dv-decoration-10 class="dv-dec-10-s" />
            <div class="react-right mr-4 react-l-s">
              <span class="react-after"></span>
              <span class="text">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span>
            </div>
          </div>
          <div class="content">
            <div id="centerRight1">
              <div class="bg-color-black">
                <div class="d-flex sectionList">
                  <div class="d-flex jc-center body-box">
                    <dv-border-box-1>
                      <div class="title">标注员业绩红榜前10</div>
                      <div class="table_wrap">
                        <table class="table">
                          <tr class="head">
                            <th>排名</th>
                            <th>人员名称</th>
                            <th>任务数</th>
                            <th>通过数</th>
                            <th>通过率</th>
                          </tr>
                          <tr v-for="(item, index) in userJobList" :key="index">
                            <td v-if="index === 0">
                              <img class="icon" src="../../assets/icons/marks/big/1.png">
                            </td>
                            <td v-else-if="index === 1">
                              <img class="icon" src="../../assets/icons/marks/big/2.png">
                            </td>
                            <td v-else-if="index === 2">
                              <img class="icon" src="../../assets/icons/marks/big/3.png">
                            </td>
                            <td v-else>{{ index + 1 }}</td>
                            <td>{{ item.userName }}</td>
                            <td>{{ item.totalCount }}</td>
                            <td>{{ item.passCount }}</td>
                            <td>{{ item.accuracy }}</td>
                          </tr>
                        </table>
                      </div>
                    </dv-border-box-1>
                  </div>
                  <div class="d-flex jc-center body-box">
                    <dv-border-box-1>
                      <div class="title">标注员业绩黑榜前10</div>
                      <div class="table_wrap">
                        <table class="table">
                          <tr class="head">
                            <th>排名</th>
                            <th>人员名称</th>
                            <th>任务数</th>
                            <th>通过数</th>
                            <th>通过率</th>
                          </tr>
                          <tr v-for="(item, index) in userJobList_re" :key="index">
                            <td v-if="index === 0">
                              <img class="icon" src="../../assets/icons/marks/big/1.png">
                            </td>
                            <td v-else-if="index === 1">
                              <img class="icon" src="../../assets/icons/marks/big/2.png">
                            </td>
                            <td v-else-if="index === 2">
                              <img class="icon" src="../../assets/icons/marks/big/3.png">
                            </td>
                            <td v-else>{{ index + 1 }}</td>
                            <td>{{ item.userName }}</td>
                            <td>{{ item.totalCount }}</td>
                            <td>{{ item.passCount }}</td>
                            <td>{{ item.accuracy }}</td>
                          </tr>
                        </table>
                      </div>
                    </dv-border-box-1>
                  </div>
                  <div class="d-flex jc-center body-box">
                    <dv-border-box-1>
                      <div class="title">质检员业绩红榜前10</div>
                      <div class="table_wrap">
                        <table class="table">
                          <tr class="head">
                            <th>排名</th>
                            <th>人员名称</th>
                            <th>任务数</th>
                            <th>通过数</th>
                          </tr>
                          <tr v-for="(item, index) in userCheckList" :key="index">
                            <td v-if="index === 0">
                              <img class="icon" src="../../assets/icons/marks/big/1.png">
                            </td>
                            <td v-else-if="index === 1">
                              <img class="icon" src="../../assets/icons/marks/big/2.png">
                            </td>
                            <td v-else-if="index === 2">
                              <img class="icon" src="../../assets/icons/marks/big/3.png">
                            </td>
                            <td v-else>{{ index + 1 }}</td>
                            <td>{{ item.userName }}</td>
                            <td>{{ item.totalCount }}</td>
                            <td>{{ item.passCount }}</td>
                          </tr>
                        </table>
                      </div>
                    </dv-border-box-1>
                  </div>
                  <div class="d-flex jc-center body-box">
                    <dv-border-box-1>
                      <div class="title">质检员业绩黑榜前10</div>
                      <div class="table_wrap">
                        <table class="table">
                          <tr class="head">
                            <th>排名</th>
                            <th>人员名称</th>
                            <th>任务数</th>
                            <th>通过数</th>
                          </tr>
                          <tr v-for="(item, index) in userCheckList_re" :key="index">
                            <td v-if="index === 0">
                              <img class="icon" src="../../assets/icons/marks/big/1.png">
                            </td>
                            <td v-else-if="index === 1">
                              <img class="icon" src="../../assets/icons/marks/big/2.png">
                            </td>
                            <td v-else-if="index === 2">
                              <img class="icon" src="../../assets/icons/marks/big/3.png">
                            </td>
                            <td v-else>{{ index + 1 }}</td>
                            <td>{{ item.userName }}</td>
                            <td>{{ item.totalCount }}</td>
                            <td>{{ item.passCount }}</td>
                          </tr>
                        </table>
                      </div>
                    </dv-border-box-1>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { listJobhome } from '@/api/project/job'
import { formatTime1 } from '@/utils'
import drawMixin from '@/utils/tools/drawMixin'
export default {
  mixins: [drawMixin],
  data() {
    return {
      timer: null,
      timing: null,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      bg_institude: require('@/assets/pageBg.png'),
      loading: false,
      decorationColor: ['#568aea', '#000000'],
      userCheckList: [],
      userCheckList_re: [],
      userJobList: [],
      userJobList_re: [],
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

    }
  },
  mounted() {
    this.timeFn()
    this.getlist()
    this.handleQuery()
  },
  beforeDestroy() {
    clearInterval(this.timing)
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    async getlist() {
      // this.resetData()
      const res = await listJobhome({})
      const { userCheckListRed, userCheckListBlack, userJobListBlack, userJobListRed } = res.data
      this.userCheckList = userCheckListRed
      this.userCheckList_re = userCheckListBlack
      this.userJobList = userJobListRed
      this.userJobList_re = userJobListBlack
    },
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime1(new Date(), 'HH: mm: ss')
        this.dateYear = formatTime1(new Date(), 'yyyy-MM-dd')
        this.dateWeek = this.weekday[new Date().getDay()]
      }, 1000)
    },
    resetData() {
      this.userCheckList = []
      this.userJobList = []
      this.userCheckList_re = []
      this.userJobList_re = []
    },
    handleQuery() {
      this.timer = setInterval(() => {
        this.getlist()
      }, 10000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/index.scss';
</style>

<style lang="scss" scoped>
$box-height: 300px;
$box-width: 100%;

.app-container {
  background-color: #020308;
  height: 100vh;
}

#centerRight1 {
  padding: 16px;
  padding-top: 20px;
  // height: $box-height;
  width: $box-width;
  border-radius: 5px;

  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }

  .text {
    color: #c3cbde;
  }

  .sectionList {
    margin-top: 50px;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .body-box {
    width: 24%;
    height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;

    .dv-scr-board {
      width: 270px;
      height: 340px;
    }

    .title {
      text-align: center;
      font-size: 20px;
      color: #fff;
      width: 100%;
    }

    .table_wrap {
      margin-top: 20px;
    }

    .table {
      border-collapse: collapse;
      width: 90%;
      margin: 0 auto;
      color: #32c5e9;
      font-size: 16px;

      .head {
        height: 42px;
      }

      td {
        text-align: center;
        padding: 14px 20px;
      }

      .icon {
        // background: #ccc;
        width: 20px;
        height: 20px;
      }
    }
  }
}

.react-right {
  width: 300px;
  position: absolute;
  top: 54px;
  right: 60px;

}
</style>
