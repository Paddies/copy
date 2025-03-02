<template>
    <div class="container">
        <el-tabs type="border-card">
            <el-tab-pane label="标注员统计">
                <div class="header">
                    <div class="filter_wrap">
                        <el-form :model="queryParams" ref="queryForm" :inline="true">
                            <el-form-item prop="model">
                                <el-select v-model="queryParams.a" placeholder="请选择" size="small">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="model">
                                <el-date-picker v-model="dateRanage" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" size="small">
                                </el-date-picker> </el-form-item>
                        </el-form>
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="标注员" width="180"></el-table-column>
                    <el-table-column prop="name" label="任务总数" width="180"></el-table-column>
                    <el-table-column prop="address" label="无效数据"> </el-table-column>
                    <el-table-column prop="address" label="开始时间"> </el-table-column>
                    <el-table-column prop="address" label="结束时间"> </el-table-column>
                    <el-table-column prop="address" label="总耗时"> </el-table-column>
                    <el-table-column prop="address" label="标注数量"> </el-table-column>
                    <el-table-column prop="address" label="返工数量"> </el-table-column>
                    <el-table-column prop="address" label="交付情况"> </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="质检员统计">
                <div class="header">
                    <div class="filter_wrap">
                        <el-form :model="queryParams" ref="queryForm" :inline="true">
                            <el-form-item prop="model">
                                <el-select v-model="queryParams.a" placeholder="请选择" size="small">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="model">
                                <el-date-picker v-model="dateRanage" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" size="small">
                                </el-date-picker> </el-form-item>
                        </el-form>
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="质检员" width="180"></el-table-column>
                    <el-table-column prop="name" label="任务总数" width="180"></el-table-column>
                    <el-table-column prop="address" label="无效数据"> </el-table-column>
                    <el-table-column prop="address" label="开始时间"> </el-table-column>
                    <el-table-column prop="address" label="结束时间"> </el-table-column>
                    <el-table-column prop="address" label="总耗时"> </el-table-column>
                    <el-table-column prop="address" label="质检总数"> </el-table-column>
                    <el-table-column prop="address" label="一审通过数"> </el-table-column>
                    <el-table-column prop="address" label="交付情况"> </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="验收员统计">
                <div class="header">
                    <div class="filter_wrap">
                        <el-form :model="queryParams" ref="queryForm" :inline="true">
                            <el-form-item prop="model">
                                <el-select v-model="queryParams.a" placeholder="请选择" size="small">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="model">
                                <el-date-picker v-model="dateRanage" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" size="small">
                                </el-date-picker> </el-form-item>
                        </el-form>
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="验收员" width="180"></el-table-column>
                    <el-table-column prop="name" label="任务总数" width="180"></el-table-column>
                    <el-table-column prop="address" label="无效数据"> </el-table-column>
                    <el-table-column prop="address" label="开始时间"> </el-table-column>
                    <el-table-column prop="address" label="结束时间"> </el-table-column>
                    <el-table-column prop="address" label="总耗时"> </el-table-column>
                    <el-table-column prop="address" label="验收总数"> </el-table-column>
                    <el-table-column prop="address" label="交付情况"> </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            value: '',
            value2: '',
            options: [],
            dateRanage: [],
            queryParams: {}
        }
    },
    methods: {
        handleQuery() { },
        resetQuery() { }
    }
}
</script>

<style lang="scss" scoped>
.container {
    margin: 20px;
}

.header {
    padding: 20px 0;
    clear: both;

    .filter_wrap {
        float: right;
    }

}
</style>