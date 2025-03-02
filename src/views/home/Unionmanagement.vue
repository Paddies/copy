<template>
  <div class="layout-container">
    <HeaderTabtar :current="2"></HeaderTabtar>
    <div class="content">
      <div class="page-wrap">
        <div class="sidebar white-card">
          <UnionSiderBar />
        </div>
        <div class="right-content">
          <div class="white-card">
            <h2 class="h2">公会任务列表</h2>
            <div class="task-list">
              <div class="list-item gray-card" v-for="item in taskList" :key="item.name">
                <div class="task-name">{{ item.name }}</div>
                <div class="task-count">{{ item.count }}</div>
              </div>
            </div>
          </div>
          <div class="white-card">
            <h2 class="h2">公会任务列表</h2>
            <div class="task-list">
              <div class="todo-item gray-card">
                <div class="todo-l">
                  <div>申请加入公会</div>
                  <div class="desc">共32人申请加入公会</div>
                </div>
                <div class="todo-r">
                  去处理
                </div>
              </div>
              <div class="todo-item gray-card">
                <div class="todo-l">
                  <div>申请退出公会</div>
                  <div class="desc">共2人申请退出公会</div>
                </div>
                <div class="todo-r">
                  去处理
                </div>
              </div>
            </div>
          </div>
          <div class="white-card">
            <h2 class="h2 flex-between">
              <div>
                任务进度
              </div>

              <div>
                <el-select v-model="value" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </h2>
            <div class="">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="taskName" label="任务名称" width="180">
                </el-table-column>
                <el-table-column prop="taskType" label="任务类型" width="180">

                  <template slot-scope="scope">
                    <div class="gray">
                      {{ scope.row.taskType }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="startDate" label="开始执行日期">
                  <template slot-scope="scope">
                    <div class="gray">
                      {{ scope.row.startDate }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="money" label="结算金额">
                </el-table-column>
                <el-table-column prop="操作" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">执行详情</el-button>
                    <el-button type="text" size="small">效率进度追踪</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterVue />
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import FooterVue from './components/Footer.vue';
import HeaderTabtar from "./components/HeaderTabtar.vue";
import UnionSiderBar from "./components/UnionSiderBar.vue";


// import Footer from './components/Footer.vue';
export default {
  components: {
    HeaderTabtar,
    UnionSiderBar,
    FooterVue
  },
  data() {
    return {
      taskList: [
        {
          name: '累计执行任务',
          count: 111
        },
        {
          name: '累计完成任务',
          count: 222
        },
        {
          name: '新增会员',
          count: 333
        },
        {
          name: '执行结算金额',
          count: 444
        },
        {
          name: '执行体现金额',
          count: 555
        },
      ],
      tableData: [
        {
          taskName: "3d点云标注",
          taskType: '3d点云标注',
          startDate: '2023-10-22',
          money: '300.0元',
        },
        {
          taskName: "3d点云标注1",
          taskType: '3d点云标注',
          startDate: '2023-10-22',
          money: '300.0元',
        },
        {
          taskName: "3d点云标注2",
          taskType: '3d点云标注',
          startDate: '2023-10-22',
          money: '300.0元',
        },


      ],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: ''
    }
  }

}
</script>

<style lang="scss" scoped>
.white-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.gray-card {
  background: #f7f8fa;
  border-radius: 4px;
  padding: 20px;
}

.h2 {
  font-size: 24px;
  color: #000;
}

.gray {
  color: #86909c;
}

.content {

  // border: 1px solid #000;
  padding: 24px;
  padding-bottom: 50px;
  background-color: #f6f7f9;

  .page-wrap {
    width: 1200px;
    margin: 0 auto;
    // background: #fff;
    min-height: 1000px;
    display: flex;

    .task-name {
      color: #86909c;
      margin-bottom: 8px;
      font-size: 16px;
    }

    .white-card {
      margin-bottom: 24px;
    }
  }

  .sidebar {
    width: 282px;
   height: 785px;
  }

  .right-content {
    width: calc(100% - 282px);
    padding-left: 24px;
  }

  .task-list {
    display: flex;
    justify-content: space-between;

    .todo-item {
      width: 410px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .desc {
        color: #86909C;
        margin-top: 8px;
      }

      .todo-r {
        background: #3381ff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        height: 48px;
        width: 96px;
        border-radius: 8px;

      }

    }

    .list-item {
      width: 150px;
      font-size: 24px;

    }
  }
}
.Footer{
position: fixed;
bottom: 0;
left: 0;
right: 0;
}
</style>
