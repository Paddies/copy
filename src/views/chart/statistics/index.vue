<template>
    <div id="test_app">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="人员统计" name="user">
                <el-form :model="userParams" ref="queryUserForm" :inline="true">
                    <el-form-item label="项目名称" prop="projectName">
                        <el-input v-model="userParams.projectName" size="small" clearable placeholder="请输入项目名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="userdateRanage" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="cyan" icon="el-icon-search" @click="handlePersonQuery" size="small">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="resetUserQuery" size="small">重置</el-button>
                        <el-button type="primary" plain icon="el-icon-download" size="small" @click="handleUserExport"
                            v-hasPermi="['statistics:personnel:export']">导出</el-button>
                    </el-form-item>
                </el-form>

                <el-table :data="userData" border style="width: 100%" height="600">
                    <el-table-column prop="projectName" label="项目名称" width="200"></el-table-column>
                    <el-table-column prop="projectTotalCount" label="项目总人数"></el-table-column>
                    <el-table-column prop="annotatorCount" label="标注员"></el-table-column>
                    <el-table-column prop="auditorCount" label="审核员"></el-table-column>
                    <el-table-column prop="qualityInspectorCount" label="质检员"></el-table-column>
                    <el-table-column prop="observerCount" label="观察员"></el-table-column>
                    <el-table-column prop="managerCount" label="团队管理员"></el-table-column>
                    <el-table-column prop="realStartTime" label="项目开始时间" width="200"></el-table-column>
                    <el-table-column prop="realEndTime" label="项目结束时间" width="200"></el-table-column>
                </el-table>
                <pagination v-show="userTotal > 0" :total="userTotal" :page.sync="userParams.pageNum"
                    :limit.sync="userParams.pageSize" @pagination="getPersonList" />
            </el-tab-pane>
            <el-tab-pane label="标注统计" name="annot">
                <el-form :model="AnnotParams" ref="queryAnnotForm" :inline="true">
                    <el-form-item>
                        <el-date-picker v-model="annotdateRanage" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="cyan" icon="el-icon-search" @click="handleAnnoaQuery" size="small"
                            style="margin-left: 10px;">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="resetAnnoaQuery" size="small">重置</el-button>
                        <el-button type="primary" plain icon="el-icon-download" size="small" @click="handleAnnotExport"
                            v-hasPermi="['statistics:job:export']" style="margin-left: 10px;">导出</el-button>
                    </el-form-item>
                </el-form>

                <el-table :data="annotData" border style="width: 100%" height="600">
                    <el-table-column prop="userName" label="标注员"> </el-table-column>
                    <el-table-column prop="totalCount" label="任务总数"></el-table-column>
                    <el-table-column prop="invalidCount" label="无效数据数量"></el-table-column>
                    <el-table-column prop="timeConsumingDesc" label="总耗时"></el-table-column>
                    <el-table-column prop="passCount" label="标注数量"></el-table-column>
                    <el-table-column prop="rejectCount" label="返工数量"></el-table-column>
                    <el-table-column prop="statisticsNum" label="小题数量"></el-table-column>
                    <el-table-column prop="deliveryStatus" label="交付情况"></el-table-column>
                </el-table>
                <pagination v-show="annotTotal > 0" :total="annotTotal" :page.sync="AnnotParams.pageNum"
                    :limit.sync="AnnotParams.pageSize" @pagination="getAnnotationStatistics" />
            </el-tab-pane>
            <el-tab-pane label="质检统计" name="check">
                <el-form :model="AnnotParams" ref="queryCheckForm" :inline="true">
                    <el-form-item>
                        <el-date-picker v-model="checkdateRanage" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="cyan" icon="el-icon-search" @click="handleCheckQuery" size="small"
                            style="margin-left: 10px;">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="resetCheckQuery" size="small">重置</el-button>
                        <el-button type="primary" plain icon="el-icon-download" size="small" @click="handleCheckExport"
                            v-hasPermi="['statistics:check:export']" style="margin-left: 10px;">导出</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="checkData" border style="width: 100%" height="600">
                    <el-table-column prop="userName" label="质检员"> </el-table-column>
                    <el-table-column prop="totalCount" label="任务总数"></el-table-column>
                    <el-table-column prop="invalidCount" label="无效数据数量"></el-table-column>
                    <el-table-column prop="timeConsumingDesc" label="总耗时"></el-table-column>
                    <el-table-column prop="passCount" label="质检数"></el-table-column>
                    <el-table-column prop="statisticsNum" label="小题数量"></el-table-column>
                    <el-table-column prop="deliveryStatus" label="交付情况"></el-table-column>
                </el-table>
                <pagination v-show="checkTotal > 0" :total="checkTotal" :page.sync="checkParams.pageNum"
                    :limit.sync="checkParams.pageSize" @pagination="getCheckStatistics" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {
    getAnnotationStatistics,
    getCheckStatistics,
    personnelStatistics,
} from "@/api/project/statistics";
import { formatTime1 } from '@/utils'
export default {
    data() {
        return {
            userdateRanage: [],
            annotdateRanage: [],
            checkdateRanage: [],
            activeName: "user",
            userTotal: 0,
            userParams: {
                pageNum: 1,
                pageSize: 10,
                projectName: ''
            },
            userData: [],
            AnnotParams: {
                pageNum: 1,
                pageSize: 10
            },
            annotTotal: 0,
            annotData: [],
            checkParams: {
                pageNum: 1,
                pageSize: 10
            },
            checkData: [],
            checkTotal: 0,
        };
    },
    watch: {
        activeName: {
            handler: function (newval, oldval) {
                switch (newval) {
                    case 'user':
                        this.getPersonList();
                        break;
                    case 'annot':
                        this.getAnnotationStatistics();
                        break;
                    case 'check':
                        this.getCheckStatistics();
                        break;
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        let now = formatTime1(new Date(), 'yyyy-MM-dd')
        this.annotdateRanage = [now, now]
        this.checkdateRanage = [now, now]

    },
    methods: {
        handlePersonQuery() {
            this.userParams.pageNum = 1
            this.getPersonList()
        },
        resetUserQuery() {
            this.userdateRanage = []
            this.resetForm("queryUserForm");
            this.handlePersonQuery()
        },
        handleAnnoaQuery() {
            this.AnnotParams.pageNum = 1
            this.getAnnotationStatistics()
        },
        resetAnnoaQuery() {
            this.annotdateRanage = []
            this.resetForm("queryAnnotForm");
            this.handleAnnoaQuery()
        },
        handleCheckQuery() {
            this.checkParams.pageNum = 1
            this.getCheckStatistics()
        },
        resetCheckQuery() {
            this.checkdateRanage = []
            this.resetForm("queryCheckForm");
            this.handleCheckQuery()
        },
        // 获取项目组人员列表
        async getPersonList() {
            let res = await personnelStatistics(this.addDateRangeBy(this.userParams, this.userdateRanage));
            this.userData = res.data.content || [];
            this.userTotal = res.data.allNum || 0
        },
        //  题目标注统计
        async getAnnotationStatistics() {
            let res = await getAnnotationStatistics(this.addDateRangeBy(this.AnnotParams, this.annotdateRanage));
            this.annotData = res.data.content || [];
            this.annotTotal = res.data.allNum || 0
        },
        //  题目质检统计
        async getCheckStatistics() {
            let res = await getCheckStatistics(this.addDateRangeBy(this.checkParams, this.checkdateRanage));
            this.checkData = res.data.content || [];
            this.checkTotal = res.data.allNum || 0
        },
        // 项目组人员导出按钮操作
        handleUserExport() {
            this.download('statistics/exportStatistics', {
                ...this.addDateRangeBy(this.userParams, this.userdateRanage),
                codeParam: 'data:personnelStatistics'
            }, `项目人员统计_${new Date().getTime()}.xls`)
        },
        // 标注员统计导出
        handleAnnotExport() {
            this.download('statistics/exportStatistics', {
                ...this.addDateRangeBy(this.AnnotParams, this.annotdateRanage),
                codeParam: 'data:getJobStatistics'
            }, `题目标注员统计_${new Date().getTime()}.xls`)
        },
        // 质检员统计导出
        handleCheckExport() {
            this.download('statistics/exportStatistics', {
                ...this.addDateRangeBy(this.checkParams, this.checkdateRanage),
                codeParam: 'data:getCheckStatistics'
            }, `题目质检员统计_${new Date().getTime()}.xls`)
        },
    },
};
</script>

<style lang="scss" scoped>
#test_app {
    color: #2968cc;
    padding: 20px;
    // background: linear-gradient(to left,
    //         rgba(253, 253, 253, 0.18) 0%,
    //         rgba(83, 183, 255, 0.13) 50%,
    //         rgba(255, 255, 255, 0.49) 100%);
}

.el-breadcrumb {
    font-family: PingFang SC;
    font-size: 18px;
    font-weight: 400;
    line-height: 35px;
}

.el-breadcrumb__inner {
    color: #2968cc;
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #2968cc;
}

.green {
    color: #4880ff;
    font-size: 16px;
}

.header {
    font-size: 16px;
    height: 30px;
    color: #4880ff;
    margin-bottom: 10px;
}

.left {
    float: right;
    font-size: 15px;

    span {
        margin-right: 10px;
    }

    >div {
        display: inline-block;
    }
}

.el-table th>.cell {
    text-align: center;
}


.el-table .cell {
    text-align: center;
}

img {
    vertical-align: middle;
}

.form_wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.pagination-container {
    padding: 32px 16px;
}
</style>
